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

export const clasesPopupResponsivo = {
  popup: "!rounded-2xl !p-4 sm:!p-6 !max-w-[90vw] sm:!max-w-[32rem] !font-['Inter',sans-serif]",
  confirmButton:
    '!rounded-xl !font-semibold !text-xs sm:!text-sm !py-2.5 sm:!py-3 !px-5 sm:!px-6 !w-full sm:!w-auto cursor-pointer shadow-sm',
  cancelButton:
    '!rounded-xl !font-semibold !text-xs sm:!text-sm !py-2.5 sm:!py-3 !px-5 sm:!px-6 !text-[#1a2e1f] !w-full sm:!w-auto cursor-pointer',
  actions: '!gap-2 sm:!gap-3 flex-col sm:flex-row !w-full sm:!w-auto',
}

/**
 * Muestra el modal de carga mientras se ejecuta una promesa/petición.
 * Garantiza un tiempo mínimo visual de 500ms para evitar destellos (flash),
 * pero si el servidor tarda más, se mantiene abierto el tiempo necesario.
 */
export const mostrarCargando = (
  titulo = 'Guardando cambios...',
  mensaje = 'Por favor espera un momento',
) => {
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
      popup: "!rounded-2xl !p-6 !max-w-[90vw] sm:!max-w-[24rem] !font-['Inter',sans-serif]",
    },
  })
}

/**
 * Helper reutilizable para envolver cualquier promesa con el spinner de carga
 * (mínimo 500ms) y evitar flashes si el servidor responde súper rápido.
 */
export const ejecutarConCarga = async (
  promesa,
  titulo = 'Procesando...',
  mensaje = 'Espera un momento',
) => {
  mostrarCargando(titulo, mensaje)
  const [resultado] = await Promise.all([
    promesa,
    new Promise((resolve) => setTimeout(resolve, 500)), // Timer mínimo de 500ms
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

/**
 * Maneja el flujo cuando el backend detecta ganancia reducida.
 * IMPORTANTE: en este punto la compra AÚN NO está guardada (el backend hizo rollback).
 *
 * @param {Array} alertas - alertas devueltas por el backend
 * @param {Function} guardarCompra - función que reenvía la compra con { confirmado: true }
 * @returns {Promise<boolean>} true si la compra quedó guardada, false si el usuario canceló
 */
export const manejarAlertaGananciaReducida = async (alertas = [], guardarCompra) => {
  if (typeof guardarCompra !== 'function') {
    throw new Error('manejarAlertaGananciaReducida requiere la función guardarCompra')
  }

  const filasHtml = alertas
    .map(
      (a) => `
    <tr style="border-bottom: 1px solid #e5e7eb; font-size: 12px;">
      <td style="padding: 10px 12px; text-align: left;">
        <strong>${a.producto_nombre}</strong><br>
        <small style="color: #6b7280;">${a.presentacion_nombre}</small>
      </td>
      <td style="padding: 10px 12px; text-align: right; white-space: nowrap;">$${a.costo_promedio_proyectado.toFixed(2)}</td>
      <td style="padding: 10px 12px; text-align: right; white-space: nowrap;">$${a.precio_venta_actual.toFixed(2)}</td>
      <td style="padding: 10px 12px; text-align: right; color: #dc2626; font-weight: bold; white-space: nowrap;">${a.porcentaje_ganancia_actual}%</td>
      <td style="padding: 10px 12px; text-align: right; color: #16a34a; font-weight: bold; white-space: nowrap;">$${a.precio_venta_sugerido.toFixed(2)}</td>
    </tr>
  `,
    )
    .join('')

  // Versión celular: una tarjeta por presentación (sin scroll horizontal)
  const tarjetasHtml = alertas
    .map(
      (a) => `
    <div style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #ffffff;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
        <div style="min-width: 0;">
          <strong style="font-size: 13px;">${a.producto_nombre}</strong><br>
          <small style="color: #6b7280;">${a.presentacion_nombre}</small>
        </div>
        <div style="text-align: right; white-space: nowrap;">
          <div style="color: #dc2626; font-weight: 700; font-size: 13px;">${a.porcentaje_ganancia_actual}%</div>
          <div style="font-size: 10px; text-transform: uppercase; color: #6b7280;">Ganancia</div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8px; font-size: 12px;">
        <div>
          <div style="font-size: 10px; text-transform: uppercase; color: #6b7280;">CPP</div>
          <div>$${a.costo_promedio_proyectado.toFixed(2)}</div>
        </div>
        <div>
          <div style="font-size: 10px; text-transform: uppercase; color: #6b7280;">P. actual</div>
          <div>$${a.precio_venta_actual.toFixed(2)}</div>
        </div>
        <div>
          <div style="font-size: 10px; text-transform: uppercase; color: #6b7280;">P. sugerido</div>
          <div style="color: #16a34a; font-weight: 700;">$${a.precio_venta_sugerido.toFixed(2)}</div>
        </div>
      </div>
    </div>
  `,
    )
    .join('')

  const htmlBase = `
    <div style="text-align: left; margin-top: 8px; font-family: 'Inter', sans-serif;">
      <p style="font-size: 13px; color: #374151; margin-bottom: 14px; line-height: 1.5;">
      ¡Atención! Esta compra generará pérdidas de dinero.
Los nuevos costos de adquisición superan tus precios de venta actuales en el catálogo. Si guardas la compra con los precios vigentes, venderás este producto a pérdida. Te sugerimos ajustar los precios de venta a los valores de la tabla para recuperar tu margen mínimo de ganancia.
      </p>
      <div class="gr-tabla" style="max-height: 260px; overflow: auto; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 16px;">
        <table style="width: 100%; min-width: 560px; border-collapse: collapse; background: #ffffff; word-break: normal; overflow-wrap: normal; word-wrap: normal;">
          <thead>
            <tr style="font-size: 10px; text-transform: uppercase; color: #374151;">
              <th style="padding: 10px 12px; text-align: left; position: sticky; top: 0; background-color: #f3f4f6;">Presentación</th>
              <th style="padding: 10px 12px; text-align: right; white-space: nowrap; position: sticky; top: 0; background-color: #f3f4f6;">CPP</th>
              <th style="padding: 10px 12px; text-align: right; white-space: nowrap; position: sticky; top: 0; background-color: #f3f4f6;">P. actual</th>
              <th style="padding: 10px 12px; text-align: right; white-space: nowrap; position: sticky; top: 0; background-color: #f3f4f6;">% Ganancia</th>
              <th style="padding: 10px 12px; text-align: right; white-space: nowrap; position: sticky; top: 0; background-color: #f3f4f6;">P. sugerido</th>
            </tr>
          </thead>
          <tbody>
            ${filasHtml}
          </tbody>
        </table>
      </div>
      <div class="gr-cards" style="max-height: 260px; overflow-y: auto; flex-direction: column; gap: 8px; margin-bottom: 16px;">
        ${tarjetasHtml}
      </div>
      <style>
        .gr-cards { display: none; }
        @media (max-width: 639px) {
          .gr-tabla { display: none; }
          .gr-cards { display: flex; }
        }
      </style>
      <p style="font-size: 13px; color: #1e3a2f; font-weight: 600;">
        ¿Deseas aplicar los precios sugeridos de forma automática en el catálogo?
      </p>
    </div>
  `

  const resultBase = await Swal.fire({
    title: 'Ganancia Reducida Detectada',
    html: htmlBase,
    icon: 'warning',
    width: '48rem',
    showCancelButton: true,
    showDenyButton: true,
    allowOutsideClick: false,

    confirmButtonText: `
    <span class="flex items-center justify-center gap-1.5">
      <i class="pi pi-check text-xs"></i>
      <span>Actualizar precios</span>
    </span>
  `,

    denyButtonText: `
    <span class="flex items-center justify-center gap-1.5">
      <i class="pi pi-exclamation-triangle text-xs"></i>
      <span>Ignorar y mantener precios</span>
    </span>
  `,

    cancelButtonText: `
    <span class="flex items-center justify-center gap-1.5">
      <i class="pi pi-arrow-left text-xs"></i>
      <span>Regresar a la compra</span>
    </span>
  `,

    confirmButtonColor: '#15803d',
    denyButtonColor: '#4b5563',
    cancelButtonColor: '#f3f4f6',
    reverseButtons: true,
    customClass: {
      popup: '!rounded-2xl !p-4 sm:!p-8 !max-w-[95vw]',
      confirmButton: '!rounded-xl !font-semibold !text-xs sm:!text-sm !py-2.5 !px-4 order-3',
      denyButton: '!rounded-xl !font-semibold !text-xs sm:!text-sm !py-2.5 !px-4 order-2',
      cancelButton:
        '!rounded-xl !font-semibold !text-xs sm:!text-sm !py-2.5 !px-4 !text-[#1a2e1f] !border !border-gray-200 hover:!bg-gray-200 order-1',
      actions: '!gap-2 flex-col sm:flex-row !w-full sm:!w-auto',
    },
  })

  // Cancelar (o Esc): no se guarda nada, se vuelve al formulario para corregir
  if (!resultBase.isConfirmed && !resultBase.isDenied) {
    return false
  }

  if (resultBase.isConfirmed) {
    // 1) Ahora sí se guarda la compra (el backend recibe confirmado: true).
    //    Si falla, el error sube al catch de AddCompra.vue.
    await ejecutarConCarga(
      guardarCompra(),
      'Registrando compra...',
      'Guardando documento y procesando entrada de lotes',
    )

    // 2) Se aplican los precios sugeridos en el catálogo
    try {
      const payloadPrecios = alertas.map((a) => ({
        presentacion_id: a.presentacion_id,
        precio_venta_sugerido: a.precio_venta_sugerido,
      }))

      await actualizarPreciosMasivo(payloadPrecios)

      await Swal.fire({
        icon: 'success',
        title: '¡Compra registrada!',
        text: 'La compra se guardó y los precios del catálogo se ajustaron al margen mínimo requerido.',
        confirmButtonColor: '#2b5e3b',
        timer: 1500,
        customClass: clasesPopupResponsivo,
      })
    } catch (error) {
      await Swal.fire({
        icon: 'warning',
        title: 'Compra guardada, precios sin actualizar',
        text:
          error.response?.data?.message ||
          'La compra sí se guardó, pero no se pudieron actualizar los precios. Actualízalos manualmente en el catálogo.',
        confirmButtonColor: '#2b5e3b',
        customClass: clasesPopupResponsivo,
      })
    }
    return true
  }

  // Llegó aquí solo si presionó "No actualizar"
  const resumenPerdidaHtml = alertas
    .map((a) => {
      const gananciaActualDinero = a.precio_venta_actual - a.costo_promedio_proyectado
      return `<li class="flex items-start gap-1.5">• <span><strong>${a.producto_nombre} - ${a.presentacion_nombre}:</strong> Perderás $${Math.abs(gananciaActualDinero).toFixed(2)} por unidad.</span></li>`
    })
    .join('')

  const resultPersuasivo = await Swal.fire({
    title: '¿Confirmas vender a pérdida?',
    width: '40rem',
    html: `
        <div class="text-left text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p class="mb-4">
            Al no actualizar los precios de catálogo, venderás por debajo del costo de adquisición.
          </p>

          <div class="bg-red-50 border-l-4 border-red-500 p-3 rounded-xl mb-4 text-xs text-red-800 shadow-sm">
            <div class="flex items-center gap-2 mb-1.5 font-bold text-red-900">
              <i class="pi pi-exclamation-triangle text-xs text-red-600"></i>
              <span>Desglose de Pérdidas Proyectadas</span>
            </div>
            <div style="max-height: 140px; overflow-y: auto; padding-right: 4px;">
              <ul class="space-y-1 font-medium list-disc pl-4">
                ${resumenPerdidaHtml}
              </ul>
            </div>
          </div>
        </div>
      `,
    icon: 'error',
    showCancelButton: true,

    confirmButtonText: `
        <span class="flex items-center justify-center gap-1.5">
          <i class="pi pi-arrow-left text-xs"></i>
          <span>Volver y corregir</span>
        </span>
      `,
    confirmButtonColor: '#15803d',

    cancelButtonText: `
        <span class="flex items-center justify-center gap-1.5">
          <i class="pi pi-exclamation-triangle text-xs"></i>
          <span>Asumir pérdida y mantener</span>
        </span>
      `,
    cancelButtonColor: '#6b7280',

    reverseButtons: true,
    allowOutsideClick: false,

    customClass: {
      popup: '!rounded-2xl !p-4 sm:!p-8 !max-w-[95vw]',
      confirmButton: '!rounded-xl !font-semibold !text-xs sm:!text-sm !py-2.5 !px-4 order-2',
      cancelButton: '!rounded-xl !font-semibold !text-xs sm:!text-sm !py-2.5 !px-4 order-1',
      actions: '!gap-2 flex-col sm:flex-row !w-full sm:!w-auto !mt-4',
    },
  })

  // Mantener precios: se guarda la compra sin tocar el catálogo
  if (resultPersuasivo.isConfirmed) {
    await ejecutarConCarga(
      guardarCompra(),
      'Registrando compra...',
      'Guardando documento y procesando entrada de lotes',
    )
    await mostrarExito(
      '¡Compra registrada!',
      'La compra se guardó manteniendo los precios actuales.',
    )
    return true
  }

  // Volver y corregir: se regresa al modal anterior (ahí está el botón Cancelar)
  return manejarAlertaGananciaReducida(alertas, guardarCompra)
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
