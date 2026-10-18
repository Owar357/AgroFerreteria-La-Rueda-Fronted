import Swal from 'sweetalert2'
import router from '@/router'
import authService from '@/services/authService'
import { mostrarAlertaConfirmar, clasesPopupResponsivo } from '@/utils/SweetAlertService'

// Segundos antes del vencimiento del token en que aparece el aviso
const AVISO_SEG = 120

let timerAviso = null
let timerCuenta = null
let avisoAbierto = false
let escuchandoPestanas = false

// Lee la fecha de vencimiento (exp) que viene dentro del JWT
function getExp(token) {
  if (!token) return null
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64)).exp * 1000
  } catch {
    return null
  }
}

// Se calcula contra la hora real, así no se desfasa si la pestaña queda en segundo plano
function segundosRestantes(exp) {
  return Math.max(Math.round((exp - Date.now()) / 1000), 0)
}

function formatear(seg) {
  const m = Math.floor(seg / 60)
  const s = String(seg % 60).padStart(2, '0')
  return `${m}:${s}`
}

function limpiarTimers() {
  clearTimeout(timerAviso)
  clearInterval(timerCuenta)
  timerAviso = null
  timerCuenta = null
}

function cerrarAviso() {
  if (avisoAbierto) {
    avisoAbierto = false
    Swal.close()
  }
}

// El token ya no sirve: limpia la sesión local, manda al login y explica por qué
async function expirar(
  titulo = 'Sesión cerrada',
  mensaje = 'Tu sesión expiró por inactividad. Vuelve a iniciar sesión para continuar.',
) {
  limpiarTimers()
  cerrarAviso()
  authService.cerrarSesionLocal()
  await router.push('/login')
  mostrarAlertaConfirmar({ tipo: 'info', icono: 'pi-clock', titulo, mensajeHtml: mensaje })
}

async function renovar() {
  const r = await authService.refresh()

  if (r.success) {
    programar()
    return
  }

  // Sin respuesta del servidor (sin internet): se vuelve a mostrar el aviso para reintentar
  if (!r.status) {
    mostrarAviso(getExp(authService.getToken()), 'No se pudo conectar con el servidor. Intenta de nuevo.')
    return
  }

  if (r.status === 403) {
    expirar('Cuenta desactivada', r.message)
  } else {
    expirar('Tu sesión de hoy terminó', 'Por seguridad debes volver a iniciar sesión.')
  }
}

async function cerrarPorUsuario() {
  limpiarTimers()
  await authService.logout()
  router.push('/login')
}

function mostrarAviso(exp, error = '') {
  if (!exp || segundosRestantes(exp) <= 0) return expirar()

  // Si hay otra alerta abierta (por ejemplo "Guardando..."), se espera a que termine
  if (Swal.isVisible() && !avisoAbierto) {
    timerAviso = setTimeout(() => mostrarAviso(exp, error), 3000)
    return
  }

  avisoAbierto = true

  Swal.fire({
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding:4px 0;">
        <div style="width:48px; height:48px; border-radius:50%; background:#fef3c7; display:flex; align-items:center; justify-content:center;">
          <i class="pi pi-clock" style="font-size:22px; color:#b45309;"></i>
        </div>
        <h3 style="font-size:16px; font-weight:600; color:#1e3a2f; margin:0;">Tu sesión está por cerrarse</h3>
        <p style="font-size:13px; color:#6b7280; margin:0;">Por seguridad, la sesión se cerrará en</p>
        <span id="cuenta-sesion" style="font-size:28px; font-weight:700; color:#b45309; font-variant-numeric:tabular-nums;">
          ${formatear(segundosRestantes(exp))}
        </span>
        ${error ? `<p style="font-size:12px; color:#b91c1c; margin:0;">${error}</p>` : ''}
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Seguir conectado',
    cancelButtonText: 'Cerrar sesión',
    confirmButtonColor: '#2b5e3b',
    cancelButtonColor: '#e2e8dd',
    reverseButtons: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: { ...clasesPopupResponsivo, container: '!z-[999999]' },
    didOpen: () => {
      timerCuenta = setInterval(() => {
        const seg = segundosRestantes(exp)
        const el = Swal.getHtmlContainer()?.querySelector('#cuenta-sesion')
        if (el) el.textContent = formatear(seg)
        if (seg <= 0) expirar()
      }, 1000)
    },
    willClose: () => clearInterval(timerCuenta),
  }).then((r) => {
    avisoAbierto = false
    if (r.isConfirmed) renovar()
    else if (r.dismiss === Swal.DismissReason.cancel) cerrarPorUsuario()
  })
}

// Programa el aviso según el vencimiento del token actual
function programar() {
  if (avisoAbierto) return
  limpiarTimers()

  const exp = getExp(authService.getToken())
  if (!exp) return

  const msHastaAviso = exp - Date.now() - AVISO_SEG * 1000
  timerAviso = setTimeout(() => mostrarAviso(exp), Math.max(msHastaAviso, 0))
}

// Si en otra pestaña se renueva o se cierra la sesión, esta pestaña se entera
function escucharPestanas() {
  if (escuchandoPestanas) return
  escuchandoPestanas = true

  window.addEventListener('storage', (e) => {
    if (e.key !== 'auth_token') return

    cerrarAviso()
    limpiarTimers()

    if (e.newValue) {
      programar()
    } else if (router.currentRoute.value.path !== '/login') {
      router.push('/login')
    }
  })
}

export function useSessionTimeout() {
  escucharPestanas()

  return {
    programar,
    detener: () => {
      limpiarTimers()
      cerrarAviso()
    },
  }
}