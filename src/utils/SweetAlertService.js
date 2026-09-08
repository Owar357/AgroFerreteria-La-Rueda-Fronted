import Swal from 'sweetalert2'

const EstilosBase = {
  success: {
    bgIcono: '#dcfce7',
    colorIcono: '#15803d',
    iconoDefault: 'pi-check-circle',
  },
  error: {
    bgIcono: '#fee2e2',
    colorIcono: '#b91c1c',
    iconoDefault: 'pi-exclamation-triangle',
  },
  ban: {
    bgIcono: '#fee2e2',
    colorIcono: '#b91c1c',
    iconoDefault: 'pi-ban',
  },
  info: {
    bgIcono: '#e0f2fe',
    colorIcono: '#0369a1',
    iconoDefault: 'pi-info-circle',
  },
}

export const mostrarAlerta = ({
  tipo = 'success',
  titulo = '',
  mensajeHtml = '',
  icono = null,
  timer = 3000,
  showConfirmButton = false,
  confirmButtonText = 'Entendido',
  confirmButtonColor = '#2b5e3b',
  timerProgressBar = true,
}) => {
  const estilo = EstilosBase[tipo] || EstilosBase.info
  const iconoFinal = icono || estilo.iconoDefault

  return Swal.fire({
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
        <div style="width:56px; height:56px; border-radius:50%; background:${estilo.bgIcono}; display:flex; align-items:center; justify-content:center;">
          <i class="pi ${iconoFinal}" style="font-size:24px; color:${estilo.colorIcono};"></i>
        </div>
        <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">${titulo}</h3>
        <p style="font-size:14px; color:#6b7280; margin:0;">${mensajeHtml}</p>
      </div>
    `,
    showConfirmButton,
    confirmButtonText,
    confirmButtonColor,
    timer: showConfirmButton ? undefined : timer,
    timerProgressBar,
    customClass: {
      confirmButton: '!rounded-lg !font-semibold !text-sm',
      popup: '!rounded-2xl',
    },
  })
}

// Métodos rápidos especializados
export const mostrarExito = (titulo, mensajeHtml, opciones = {}) =>
  mostrarAlerta({ tipo: 'success', titulo, mensajeHtml, timer: 1500, showConfirmButton: false, ...opciones })

export const mostrarError = (titulo, mensajeHtml, opciones = {}) =>
  mostrarAlerta({ tipo: 'error', titulo, mensajeHtml, timer: 2000, showConfirmButton: false, ...opciones })

export const mostrarAccesoDenegado = (opciones = {}) =>
  mostrarAlerta({
    tipo: 'ban',
    titulo: 'Sin autorización',
    mensajeHtml: 'No tienes permisos para realizar esta acción.',
    timer: 2000,
    showConfirmButton: false,
    ...opciones,
  })