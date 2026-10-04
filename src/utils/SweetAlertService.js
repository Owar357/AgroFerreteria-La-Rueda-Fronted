import { actualizarPreciosMasivo } from '@/services/compraService'
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

const clasesPopupResponsivo = {
  popup: '!rounded-2xl !p-4 sm:!p-6 !max-w-[90vw] sm:!max-w-[32rem] !font-[\'Inter\',sans-serif]',
  confirmButton: '!rounded-xl !font-semibold !text-xs sm:!text-sm !py-2.5 sm:!py-3 !px-5 sm:!px-6 !w-full sm:!w-auto cursor-pointer shadow-sm',
  cancelButton: '!rounded-xl !font-semibold !text-xs sm:!text-sm !py-2.5 sm:!py-3 !px-5 sm:!px-6 !text-[#1a2e1f] !w-full sm:!w-auto cursor-pointer',
  actions: '!gap-2 sm:!gap-3 flex-col sm:flex-row !w-full sm:!w-auto'
}

/**
 * Muestra el modal de carga mientras se ejecuta una promesa/petición.
 * Garantiza un tiempo mínimo visual de 500ms para evitar destellos (flash),
 * pero si el servidor tarda más, se mantiene abierto el tiempo necesario.
 */
export const mostrarCargando = (titulo = 'Guardando cambios...', mensaje = 'Por favor espera un momento') => {
  return Swal.fire({
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; gap:16px; padding: 12px 0;">
        <div class="swal2-loading-spinner" style="width:48px; height:48px; border:4px solid #e2e8dd; border-top-color:#2b5e3b; border-radius:50%; animation: spin 0.8s linear infinite;"></div>
        <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">${titulo}</h3>
        <p style="font-size:13px; color:#6b7280; margin:0;">${mensaje}</p>
      </div>
      <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    `,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    customClass: {
      popup: '!rounded-2xl !p-6 !max-w-[90vw] sm:!max-w-[24rem] !font-[\'Inter\',sans-serif]',
    },
  })
}

/**
 * Helper reutilizable para envolver cualquier promesa con el spinner de carga
 * (mínimo 500ms) y evitar flashes si el servidor responde súper rápido.
 */
export const ejecutarConCarga = async (promesa, titulo = 'Procesando...', mensaje = 'Espera un momento') => {
  mostrarCargando(titulo, mensaje)
  const [resultado] = await Promise.all([
    promesa,
    new Promise((resolve) => setTimeout(resolve, 500)) // Timer mínimo de 500ms
  ])
  return resultado
}

/**
 * Cierra cualquier alerta o loader de SweetAlert que esté abierto
 */
export const cerrarAlerta = () => {
  Swal.close()
}

export const mostrarAlerta = ({
  tipo = 'success',
  titulo = '',
  mensajeHtml = '',
  icono = null,
  timer = 1000,
  showConfirmButton = false,
  confirmButtonText = 'Entendido',
  confirmButtonColor = '#2b5e3b',
  timerProgressBar = true,
}) => {
  const estilo = EstilosBase[tipo] || EstilosBase.info
  const iconoFinal = icono || estilo.iconoDefault

  return Swal.fire({
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 4px 0;">
        <div style="width:48px; height:48px; border-radius:50%; background:${estilo.bgIcono}; display:flex; align-items:center; justify-content:center;" class="sm:!w-[56px] sm:!h-[56px]">
          <i class="pi ${iconoFinal}" style="font-size:22px; color:${estilo.colorIcono};"></i>
        </div>
        <h3 style="font-size:16px; font-weight:600; color:#1e3a2f; margin:0;" class="sm:!text-[18px]">${titulo}</h3>
        <p style="font-size:13px; color:#6b7280; margin:0;" class="sm:!text-[14px]">${mensajeHtml}</p>
      </div>
    `,
    showConfirmButton,
    confirmButtonText,
    confirmButtonColor,
    timer: showConfirmButton ? undefined : timer,
    timerProgressBar,
    customClass: clasesPopupResponsivo,
  })
}

export const mostrarAlertaConfirmar = ({
  tipo = 'ban',
  titulo = 'Sin autorización',
  mensajeHtml = 'No tienes permisos para realizar esta acción.',
  icono = null,
  confirmButtonText = 'Entendido',
  confirmButtonColor = '#2b5e3b',
}) => {
  const estilo = EstilosBase[tipo] || EstilosBase.ban
  const iconoFinal = icono || estilo.iconoDefault

  return Swal.fire({
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 4px 0;">
        <div style="width:48px; height:48px; border-radius:50%; background:${estilo.bgIcono}; display:flex; align-items:center; justify-content:center;" class="sm:!w-[56px] sm:!h-[56px]">
          <i class="pi ${iconoFinal}" style="font-size:22px; color:${estilo.colorIcono};"></i>
        </div>
        <h3 style="font-size:16px; font-weight:600; color:#1e3a2f; margin:0;" class="sm:!text-[18px]">${titulo}</h3>
        <p style="font-size:13px; color:#6b7280; margin:0;" class="sm:!text-[14px]">${mensajeHtml}</p>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonColor,
    confirmButtonText,
    customClass: clasesPopupResponsivo,
  })
}

export const mostrarConfirmacion = ({
  titulo = '¿Estás seguro?',
  mensajeHtml = '',
  icono = 'pi-question-circle',
  bgIcono = '#fef3c7',
  colorIcono = '#b45309',
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  confirmButtonColor = '#2b5e3b',
  cancelButtonColor = '#e2e8dd',
}) => {
  return Swal.fire({
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 4px 0;">
        <div style="width:48px; height:48px; border-radius:50%; background:${bgIcono}; display:flex; align-items:center; justify-content:center;" class="sm:!w-[56px] sm:!h-[56px]">
          <i class="pi ${icono}" style="font-size:22px; color:${colorIcono};"></i>
        </div>
        <h3 style="font-size:16px; font-weight:600; color:#1e3a2f; margin:0;" class="sm:!text-[18px]">${titulo}</h3>
        <p style="font-size:13px; color:#6b7280; margin:0;" class="sm:!text-[14px]">${mensajeHtml}</p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    cancelButtonText,
    customClass: {
      ...clasesPopupResponsivo,
      container: '!z-[999999]',
    },
  })
}

export const manejarAlertaGananciaReducida = async (alertas = []) => {
  const filasHtml = alertas
    .map(
      (a) => `
    <tr style="border-bottom: 1px solid #e5e7eb; font-size: 12px;">
      <td style="padding: 6px; text-align: left;">
        <strong>${a.producto_nombre}</strong><br>
        <small style="color: #6b7280;">${a.presentacion_nombre}</small>
      </td>
      <td style="padding: 6px; text-align: right; white-space: nowrap;">$${a.costo_promedio_proyectado.toFixed(2)}</td>
      <td style="padding: 6px; text-align: right; white-space: nowrap;">$${a.precio_venta_actual.toFixed(2)}</td>
      <td style="padding: 6px; text-align: right; color: #dc2626; font-weight: bold; white-space: nowrap;">${a.porcentaje_ganancia_actual}%</td>
      <td style="padding: 6px; text-align: right; color: #16a34a; font-weight: bold; white-space: nowrap;">$${a.precio_venta_sugerido.toFixed(2)}</td>
    </tr>
  `,
    )
    .join('')

  const htmlBase = `
    <div style="text-align: left; margin-top: 8px; font-family: 'Inter', sans-serif;">
      <p style="font-size: 13px; color: #374151; margin-bottom: 10px;">
        La compra se guardó exitosamente, pero el nuevo Costo Promedio (CPP) redujo el porcentaje de ganancia:
      </p>
      <div style="max-height: 180px; overflow-y: auto; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 10px;">
        <table style="width: 100%; border-collapse: collapse; background: #ffffff;">
          <thead>
            <tr style="background-color: #f3f4f6; font-size: 10px; text-transform: uppercase; color: #374151;">
              <th style="padding: 6px; text-align: left;">Presentación</th>
              <th style="padding: 6px; text-align: right;">CPP</th>
              <th style="padding: 6px; text-align: right;">Actual</th>
              <th style="padding: 6px; text-align: right;">%</th>
              <th style="padding: 6px; text-align: right;">Sugerido</th>
            </tr>
          </thead>
          <tbody>
            ${filasHtml}
          </tbody>
        </table>
      </div>
      <p style="font-size: 13px; color: #1e3a2f; font-weight: 600;">
        ¿Deseas aplicar los precios sugeridos de forma automática en el catálogo?
      </p>
    </div>
  `

  const resultBase = await Swal.fire({
    title: 'Ganancia Reducida Detectada',
    html: htmlBase,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Actualizar precios',
    cancelButtonText: 'No actualizar',
    confirmButtonColor: '#2b5e3b',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    customClass: {
      popup: '!rounded-2xl !p-4 sm:!p-6 !max-w-[95vw] sm:!max-w-[38rem]',
      confirmButton: '!rounded-xl !font-semibold !text-xs sm:!text-sm !py-2.5 !px-4',
      cancelButton: '!rounded-xl !font-semibold !text-xs sm:!text-sm !py-2.5 !px-4',
      actions: '!gap-2 flex-col sm:flex-row !w-full sm:!w-auto'
    },
  })

  if (resultBase.isConfirmed) {
    try {
      const payloadPrecios = alertas.map((a) => ({
        presentacion_id: a.presentacion_id,
        precio_venta_sugerido: a.precio_venta_sugerido,
      }))

      await actualizarPreciosMasivo(payloadPrecios)

      await Swal.fire({
        icon: 'success',
        title: '¡Precios Actualizados!',
        text: 'Los precios de venta en el catálogo se ajustaron al margen mínimo requerido.',
        confirmButtonColor: '#2b5e3b',
        timer: 1000,
        customClass: clasesPopupResponsivo,
      })
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error de actualización',
        text: error.response?.data?.message || 'No se pudieron actualizar los precios.',
        confirmButtonColor: '#2b5e3b',
        timer: 3000,
        customClass: clasesPopupResponsivo,
      })
    }
    return
  }

  const resumenPerdidaHtml = alertas
    .map((a) => {
      const gananciaActualDinero = a.precio_venta_actual - a.costo_promedio_proyectado
      return `<li class="flex items-start gap-1.5">• <span><strong>${a.producto_nombre}:</strong> Perderás $${Math.abs(gananciaActualDinero).toFixed(2)} por unidad.</span></li>`
    })
    .join('')

  const resultPersuasivo = await Swal.fire({
    title: '¿Mantener precios bajos?',
    html: `
    <div class="text-left text-xs sm:text-sm text-gray-700 leading-relaxed">
      <p class="mb-2">
        Al no actualizar, venderás por debajo del margen rentable configurado:
      </p>
      
      <div class="bg-red-50 border-l-4 border-red-500 p-3 rounded-xl mb-3 text-xs text-red-800 shadow-sm">
        <div class="flex items-center gap-2 mb-1 font-bold text-red-900">
          <i class="pi pi-exclamation-triangle text-xs"></i>
          <span>Desglose de Pérdidas Proyectadas</span>
        </div>
        <ul class="space-y-1 font-medium">
          ${resumenPerdidaHtml}
        </ul>
      </div>
      
      <p class="font-semibold text-red-800 mb-0">
        ¿Deseas asumir el impacto en tu margen de ganancia o prefieres regresar y corregir?
      </p>
    </div>
  `,
    icon: 'error',
    showCancelButton: true,
    confirmButtonText: 'Mantener precios',
    cancelButtonText: 'Volver y corregir',
    confirmButtonColor: '#991b1b',
    cancelButtonColor: '#2b5e3b',
    reverseButtons: true,
    customClass: {
      popup: '!rounded-2xl !p-4 sm:!p-6 !max-w-[95vw] sm:!max-w-[32rem]',
      confirmButton: '!rounded-xl !font-semibold !text-xs sm:!text-sm !py-2.5 !px-4',
      cancelButton: '!rounded-xl !font-semibold !text-xs sm:!text-sm !py-2.5 !px-4',
      actions: '!gap-2 flex-col sm:flex-row !w-full sm:!w-auto'
    },
  })

  if (!resultPersuasivo.isConfirmed) {
    await manejarAlertaGananciaReducida(alertas)
  }
}

// Éxito: 1000ms (1 segundo)
export const mostrarExito = (titulo, mensajeHtml, opciones = {}) =>
  mostrarAlerta({
    tipo: 'success',
    titulo,
    mensajeHtml,
    timer: 1000,
    showConfirmButton: false,
    ...opciones,
  })

// Error: 3000ms (3 segundos)
export const mostrarError = (titulo, mensajeHtml, opciones = {}) =>
  mostrarAlerta({
    tipo: 'error',
    titulo,
    mensajeHtml,
    timer: 3000,
    showConfirmButton: false,
    ...opciones,
  })

// Acceso Denegado: 2500ms
export const mostrarAccesoDenegado = (opciones = {}) =>
  mostrarAlerta({
    tipo: 'ban',
    titulo: 'Sin autorización',
    mensajeHtml: 'No tienes permisos para realizar esta acción.',
    timer: 2500,
    showConfirmButton: false,
    ...opciones,
  })