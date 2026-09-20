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
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
        <div style="width:56px; height:56px; border-radius:50%; background:${estilo.bgIcono}; display:flex; align-items:center; justify-content:center;">
          <i class="pi ${iconoFinal}" style="font-size:24px; color:${estilo.colorIcono};"></i>
        </div>
        <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">${titulo}</h3>
        <p style="font-size:14px; color:#6b7280; margin:0;">${mensajeHtml}</p>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonColor,
    confirmButtonText,
    customClass: {
      confirmButton: '!rounded-lg !font-semibold !text-sm',
      popup: '!rounded-2xl',
    },
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
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
        <div style="width:56px; height:56px; border-radius:50%; background:${bgIcono}; display:flex; align-items:center; justify-content:center;">
          <i class="pi ${icono}" style="font-size:24px; color:${colorIcono};"></i>
        </div>
        <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">${titulo}</h3>
        <p style="font-size:14px; color:#6b7280; margin:0;">${mensajeHtml}</p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    cancelButtonText,
    customClass: {
      container: '!z-[9999]',
      confirmButton: '!rounded-lg !font-semibold !text-sm',
      cancelButton: '!rounded-lg !font-semibold !text-sm !text-[#1a2e1f]',
      popup: '!rounded-2xl',
    },
  })
}

/**
 * Secuencia Interactiva de Alerta de Ganancia Reducida (Modal Base + Modal Persuasivo)
 */
export const manejarAlertaGananciaReducida = async (alertas = []) => {
  const filasHtml = alertas
    .map(
      (a) => `
    <tr style="border-bottom: 1px solid #e5e7eb; font-size: 13px;">
      <td style="padding: 8px; text-align: left;">
        <strong>${a.producto_nombre}</strong><br>
        <small style="color: #6b7280;">${a.presentacion_nombre}</small>
      </td>
      <td style="padding: 8px; text-align: right; white-space: nowrap;">$${a.costo_promedio_proyectado.toFixed(2)}</td>
      <td style="padding: 8px; text-align: right; white-space: nowrap;">$${a.precio_venta_actual.toFixed(2)}</td>
      <td style="padding: 8px; text-align: right; color: #dc2626; font-weight: bold; white-space: nowrap;">${a.porcentaje_ganancia_actual}%</td>
      <td style="padding: 8px; text-align: right; color: #16a34a; font-weight: bold; white-space: nowrap;">$${a.precio_venta_sugerido.toFixed(2)}</td>
    </tr>
  `,
    )
    .join('')

  const htmlBase = `
    <div style="text-align: left; margin-top: 8px; font-family: 'Inter', sans-serif;">
      <p style="font-size: 14px; color: #374151; margin-bottom: 12px;">
        La compra se guardó exitosamente, pero el nuevo Costo Promedio (CPP) redujo el porcentaje de ganancia en las siguientes presentaciones:
      </p>
      <div style="max-height: 200px; overflow-y: auto; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 12px;">
        <table style="width: 100%; border-collapse: collapse; background: #ffffff;">
          <thead>
            <tr style="background-color: #f3f4f6; font-size: 11px; text-transform: uppercase; color: #374151;">
              <th style="padding: 8px; text-align: left;">Presentación</th>
              <th style="padding: 8px; text-align: right; white-space: nowrap;">CPP</th>
              <th style="padding: 8px; text-align: right; white-space: nowrap;">P. Venta</th>
              <th style="padding: 8px; text-align: right; white-space: nowrap;">% Act.</th>
              <th style="padding: 8px; text-align: right; white-space: nowrap;">P. Sugerido</th>
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

  // 1. MODAL BASE
  const resultBase = await Swal.fire({
    title: 'Ganancia Reducida Detectada',
    html: htmlBase,
    icon: 'warning',
    width: '650px',
    showCancelButton: true,
    confirmButtonText: 'Actualizar mis precios ahora',
    cancelButtonText: 'No actualizar precios',
    confirmButtonColor: '#2b5e3b',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    customClass: {
      popup: '!rounded-2xl !p-6',
      confirmButton: '!rounded-lg !font-semibold !text-sm !py-2.5 !px-5',
      cancelButton: '!rounded-lg !font-semibold !text-sm !py-2.5 !px-5',
    },
  })

  // SI PRESIONA "Actualizar mis precios ahora"
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
        customClass: { popup: '!rounded-2xl', confirmButton: '!rounded-lg' },
      })
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error de actualización',
        text: error.response?.data?.message || 'No se pudieron actualizar los precios.',
        confirmButtonColor: '#2b5e3b',
      })
    }
    return
  }

  // 2. MODAL PERSUASIVO (Si presiona "No actualizar precios")
  const resumenPerdidaHtml = alertas
    .map((a) => {
      const gananciaActualDinero = a.precio_venta_actual - a.costo_promedio_proyectado
      return `<li class="flex items-start gap-1.5">• <span><strong>${a.producto_nombre} (${a.presentacion_nombre}):</strong> Perderás $${Math.abs(gananciaActualDinero).toFixed(2)} por cada unidad vendida.</span></li>`
    })
    .join('')

  const resultPersuasivo = await Swal.fire({
    title: '¿Confirmas mantener precios bajos?',
    html: `
    <div class="text-left text-sm text-gray-700 leading-relaxed">
      <p class="mb-3">
        Al no actualizar, estás vendiendo por debajo del margen mínimo rentable configurado para tu negocio:
      </p>
      
      <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl mb-4 text-xs text-red-800 shadow-sm">
        <div class="flex items-center gap-2 mb-2 font-bold text-red-900">
          <i class="pi pi-exclamation-triangle text-sm"></i>
          <span>Desglose de Pérdidas Proyectadas</span>
        </div>
        <ul class="space-y-1.5 font-medium">
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
    confirmButtonText: 'Entendido, mantener precios',
    cancelButtonText: 'Volver y corregir',
    confirmButtonColor: '#991b1b',
    cancelButtonColor: '#2b5e3b',
    reverseButtons: true,
    customClass: {
      popup: '!rounded-2xl !p-6',
      confirmButton: '!rounded-lg !font-semibold !text-sm !py-2.5 !px-5',
      cancelButton: '!rounded-lg !font-semibold !text-sm !py-2.5 !px-5',
    },
  })

  if (!resultPersuasivo.isConfirmed) {
    await manejarAlertaGananciaReducida(alertas)
  }
}
// Métodos rápidos especializados
export const mostrarExito = (titulo, mensajeHtml, opciones = {}) =>
  mostrarAlerta({
    tipo: 'success',
    titulo,
    mensajeHtml,
    timer: 1500,
    showConfirmButton: false,
    ...opciones,
  })

export const mostrarError = (titulo, mensajeHtml, opciones = {}) =>
  mostrarAlerta({
    tipo: 'error',
    titulo,
    mensajeHtml,
    timer: 2000,
    showConfirmButton: false,
    ...opciones,
  })

export const mostrarAccesoDenegado = (opciones = {}) =>
  mostrarAlerta({
    tipo: 'ban',
    titulo: 'Sin autorización',
    mensajeHtml: 'No tienes permisos para realizar esta acción.',
    timer: 2000,
    showConfirmButton: false,
    ...opciones,
  })
