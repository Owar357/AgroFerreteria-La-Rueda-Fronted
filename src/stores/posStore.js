import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import {
  buscarClientePorDocumento,
  registerVenta,
  imprimirTicketPDF,
} from '@/services/ventaService'
import authService from '@/services/authService'
import { useCajaStore } from '@/stores/cajaStore'
import {
  mostrarExito,
  mostrarError,
  mostrarAccesoDenegado,
  mostrarAlertaConfirmar,
  mostrarCargando,
} from '@/utils/SweetAlertService'

const LOCAL_STORAGE_KEY = 'pos_venta_en_proceso'

// El carrito guardado es por usuario: el siguiente cajero no recupera el carrito del anterior
const claveLocal = () => `${LOCAL_STORAGE_KEY}_${authService.getUser()?.id ?? 'anon'}`

export const usePosStore = defineStore('pos', () => {
  const cajaStore = useCajaStore()

  // Estado
  const tipoFactura = ref('01')
  const productosVenta = ref([])
  const busquedaCliente = ref('')
  const clienteId = ref(null)
  const nombreCliente = ref('')
  const tipoPago = ref('EFECTIVO')
  const efectivoRecibido = ref(0)
  const mostrarModalCliente = ref(false)

  const subtotalGravado = computed(() =>
    productosVenta.value.reduce(
      (acc, p) => (p.aplica_iva ? acc + parseFloat((p.subtotal / 1.13).toFixed(4)) : acc),
      0,
    ),
  )
  const subtotalExento = computed(() =>
    productosVenta.value.reduce((acc, p) => (!p.aplica_iva ? acc + p.subtotal : acc), 0),
  )
  const iva = computed(() => subtotalGravado.value * 0.13)
  const total = computed(() => subtotalGravado.value + subtotalExento.value + iva.value)
  // Solo para mostrar en pantalla: el cambio real lo calcula y guarda el servidor
  const cambio = computed(() => Math.max(0, efectivoRecibido.value - total.value))

  // Métodos de Carrito
  const agregarProducto = (producto, presentacion) => {
    const unidadBase =
      producto.unidad_base ||
      producto.unidad_medida?.abreviatura ||
      producto.unidad_medida?.nombre ||
      producto.unidadMedida?.abreviatura ||
      producto.unidadMedida?.nombre ||
      null

    if (!unidadBase) {
      mostrarAlertaConfirmar({
        tipo: 'advertencia',
        titulo: 'Unidad base requerida',
        mensajeHtml: `El producto "<strong>${producto.nombre}</strong>" no tiene una unidad de medida configurada.`,
      })
      return false
    }

    const precioOriginal = parseFloat(presentacion.precio_venta) || 0
    const porcentajeDescuento = parseFloat(
      presentacion.porcentaje_descuento || producto.porcentaje_descuento || 0,
    )
    const descuentoUnitario = (precioOriginal * porcentajeDescuento) / 100
    const precioFinalUnitario = precioOriginal - descuentoUnitario
    const cantidad = 1
    const subtotal = cantidad * precioFinalUnitario

    productosVenta.value.push({
      nombre: `${producto.nombre} - ${presentacion.nombre}`,
      cantidad,
      precio: precioOriginal,
      porcentaje_descuento: porcentajeDescuento,
      descuento: parseFloat((descuentoUnitario * cantidad).toFixed(4)),
      subtotal: parseFloat(subtotal.toFixed(4)),
      aplica_iva: producto.aplica_iva,
      presentacion_id: presentacion.id,
      producto_id: producto.id,
      unidad_base: unidadBase,
    })

    guardarVentaLocal()
    return true
  }

  const recalcularSubtotal = (item) => {
    const cantidad = parseFloat(item.cantidad) || 0
    const precioOriginal = parseFloat(item.precio) || 0
    const porcentajeDescuento = parseFloat(item.porcentaje_descuento) || 0

    const descuentoUnitario = (precioOriginal * porcentajeDescuento) / 100
    const precioFinalUnitario = precioOriginal - descuentoUnitario

    item.descuento = parseFloat((descuentoUnitario * cantidad).toFixed(4))
    item.subtotal = parseFloat((cantidad * precioFinalUnitario).toFixed(4))
    guardarVentaLocal()
  }

  const eliminarProducto = (index) => {
    productosVenta.value.splice(index, 1)
    guardarVentaLocal()
  }

  const resetVenta = () => {
    productosVenta.value = []
    busquedaCliente.value = ''
    nombreCliente.value = ''
    clienteId.value = null
    efectivoRecibido.value = 0
    tipoFactura.value = '01'
    tipoPago.value = 'EFECTIVO'
    localStorage.removeItem(claveLocal())
  }

  // Persistencia Local
  const guardarVentaLocal = () => {
    if (productosVenta.value.length === 0) {
      localStorage.removeItem(claveLocal())
      return
    }
    const estadoVenta = {
      productosVenta: productosVenta.value,
      tipoFactura: tipoFactura.value,
      tipoPago: tipoPago.value,
      clienteId: clienteId.value,
      nombreCliente: nombreCliente.value,
      busquedaCliente: busquedaCliente.value,
    }
    localStorage.setItem(claveLocal(), JSON.stringify(estadoVenta))
  }

  const recuperarVentaLocal = () => {
    const datosGuardados = localStorage.getItem(claveLocal())
    if (!datosGuardados) return
    try {
      const estado = JSON.parse(datosGuardados)
      productosVenta.value = estado.productosVenta || []
      tipoFactura.value = ['01', '03'].includes(estado.tipoFactura) ? estado.tipoFactura : '01'
      tipoPago.value = estado.tipoPago ? estado.tipoPago.toUpperCase() : 'EFECTIVO'
      clienteId.value = estado.clienteId || null
      nombreCliente.value = estado.nombreCliente || ''
      busquedaCliente.value = estado.busquedaCliente || ''
    } catch (e) {
      console.error('Error al recuperar venta del localStorage:', e)
      localStorage.removeItem(claveLocal())
    }
  }

  // Operaciones de API
  const buscarCliente = async () => {
    if (!busquedaCliente.value.trim()) return
    try {
      const response = await buscarClientePorDocumento(String(busquedaCliente.value))
      const cliente = response.data.data
      nombreCliente.value = cliente.nombre || cliente.razon_social
      clienteId.value = cliente.id
    } catch (error) {
      if (error.response?.status === 403) {
        mostrarAccesoDenegado()
      } else if (error.response?.status === 404) {
        const registrar = await mostrarAlertaConfirmar({
          tipo: 'pregunta',
          titulo: 'Cliente no encontrado',
          mensajeHtml: '¿Desea registrar un nuevo cliente?',
          textoConfirmar: 'Registrar',
          textoCancelar: 'Cancelar',
        })
        if (registrar) mostrarModalCliente.value = true
      } else {
        mostrarError('Error de consulta', 'Ocurrió un error al buscar la información del cliente.')
      }
    }
  }

  // El ticket exige token: se pide por axios como blob y se abre desde un object URL
  const imprimirTicket = async (ventaId) => {
    try {
      const idLimpio = parseInt(ventaId, 10)
      if (isNaN(idLimpio)) throw new Error('ID de venta inválido')

      const response = await imprimirTicketPDF(idLimpio)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const ventana = window.open(url, '_blank')

      // Si el navegador bloqueó la ventana emergente, se descarga el archivo
      if (!ventana) {
        const enlace = document.createElement('a')
        enlace.href = url
        enlace.download = `Ticket-${idLimpio}.pdf`
        document.body.appendChild(enlace)
        enlace.click()
        enlace.remove()
      }

      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch (error) {
      if (error.response?.status === 403) {
        mostrarAccesoDenegado()
      } else {
        mostrarError(
          'No se pudo abrir el ticket',
          'La venta fue registrada correctamente. Puedes reimprimir el ticket desde el historial de ventas.',
        )
      }
    }
  }

  const irACaja = async (router, texto) => {
    const ir = await mostrarAlertaConfirmar({
      tipo: 'advertencia',
      titulo: 'Venta no aperturada',
      mensajeHtml: texto,
      textoConfirmar: 'Ir a caja',
      textoCancelar: 'Cerrar',
    })

    if (ir) router?.push({ name: 'caja' })
  }

  const procesarVenta = async (router) => {
    // Sin turno propio abierto no se puede vender (el backend también lo valida)
    if (!cajaStore.puedeOperar) {
      const texto = cajaStore.turnoDeOtroCajero
        ? `El turno está abierto por <strong>${cajaStore.turnoActivo.cajero_nombre}</strong>. Solo ese cajero puede registrar ventas.`
        : 'Debes aperturar la caja y tu venta en el módulo de caja para poder vender.'
      await irACaja(router, texto)
      return
    }

    if (productosVenta.value.length === 0) {
      mostrarAlertaConfirmar({
        tipo: 'advertencia',
        titulo: 'Sin productos',
        mensajeHtml: 'Agrega al menos un producto a la venta.',
      })
      return
    }

    if (tipoFactura.value === '03' && !clienteId.value) {
      mostrarAlertaConfirmar({
        tipo: 'advertencia',
        titulo: 'Cliente requerido',
        mensajeHtml: 'El crédito fiscal requiere asociar un cliente registrado.',
      })
      return
    }

    // Comparación en centavos para evitar errores de punto flotante
    if (
      tipoPago.value === 'EFECTIVO' &&
      Math.round((efectivoRecibido.value || 0) * 100) < Math.round(total.value * 100)
    ) {
      mostrarAlertaConfirmar({
        tipo: 'advertencia',
        titulo: 'Efectivo insuficiente',
        mensajeHtml: 'El efectivo recibido no puede ser menor al total de la venta.',
      })
      return
    }

    const payload = {
      tipo_pago: tipoPago.value.toUpperCase(),
      tipo_factura: tipoFactura.value,
      gravado: parseFloat(subtotalGravado.value.toFixed(2)),
      exento: parseFloat(subtotalExento.value.toFixed(2)),
      iva: parseFloat(iva.value.toFixed(2)),
      total: parseFloat(total.value.toFixed(2)),
      efectivo_recibido: tipoPago.value === 'EFECTIVO' ? efectivoRecibido.value : null,
      cliente_id: clienteId.value || null,
      detalles: productosVenta.value.map((p) => ({
        nombre_producto: p.nombre,
        presentacion: p.nombre,
        cantidad: p.cantidad,
        precio_unitario: p.precio,
        subtotal: p.subtotal,
        iva_aplicado: p.aplica_iva ? parseFloat(((p.subtotal / 1.13) * 0.13).toFixed(4)) : 0,
        descuento_aplicado: p.descuento,
        presentacion_id: p.presentacion_id,
        producto_id: p.producto_id,
        unidad_base: p.unidad_base,
      })),
    }

    mostrarCargando('Procesando venta...', 'Registrando la transacción en el sistema')

    try {
      const [response] = await Promise.all([
        registerVenta(payload),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ])

      cajaStore.marcarActualizacionPendiente()

      const respuestaBackend = response.data?.data || response.data
      const ventaId = parseInt(respuestaBackend?.id || response.data?.id, 10)

      const numDoc =
        respuestaBackend?.num_documento || respuestaBackend?.numero_factura || `#${ventaId}`
      const clienteNombreStr = nombreCliente.value || 'Consumidor Final'
      const totalVentaStr = parseFloat(respuestaBackend?.total ?? total.value).toFixed(2)
      const cambioVentaStr = parseFloat(respuestaBackend?.cambio ?? cambio.value).toFixed(2)
      const fueEfectivo = tipoPago.value === 'EFECTIVO'

  
     const result = await Swal.fire({
        title: '¡Venta realizada con éxito!',
        html: `
          <div style="text-align:left; font-size:14px; color:#374151">
            <p>La transacción ha sido registrada correctamente en el sistema.</p>
            <div style="background:#f9fafb; border:1px solid #e2e8dd; border-radius:12px; padding:14px; margin-top:12px">
              <p style="margin:4px 0; color:#14291d"><strong>Comprobante:</strong> ${numDoc}</p>
              <p style="margin:4px 0; color:#14291d"><strong>Cliente:</strong> ${clienteNombreStr}</p>
              <p style="margin:4px 0; color:#14291d"><strong>Total a Pagar:</strong> $${totalVentaStr}</p>
              ${fueEfectivo ? `<p style="margin:4px 0; color:#14291d"><strong>Cambio:</strong> $${cambioVentaStr}</p>` : ''}
            </div>
          </div>
        `,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Imprimir Ticket PDF',
        confirmButtonColor: '#2b5e3b',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
        customClass: {
          popup: 'rounded-2xl p-6 border border-[#e2e8dd]',
          title: 'text-[#1a2e1f] text-xl font-bold',
          confirmButton: 'px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer',
          cancelButton: 'px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer',
        },
      })
      resetVenta()

      // Si hizo clic en "Imprimir Ticket PDF" (botón cancel/dismiss)
      if (result.isDismissed && ventaId) {
        await imprimirTicket(ventaId)
      }
    } catch (error) {
      cajaStore.cargarEstadoCaja()

      const status = error.response?.status
      const respuesta = error.response?.data

      if (status === 403) {
        mostrarAccesoDenegado()
      } else if (status === 422 && respuesta?.errors) {
        const mensajes = Object.values(respuesta.errors).flat()
        mostrarAlertaConfirmar({
          tipo: 'advertencia',
          titulo: 'Error de validación',
          mensajeHtml: mensajes[0],
        })
      } else if (respuesta?.message) {
        mostrarAlertaConfirmar({
          tipo: 'advertencia',
          titulo: 'Atención',
          mensajeHtml: respuesta.message,
        })
      } else {
        mostrarError('Error de servidor', 'Ocurrió un problema inesperado al procesar la venta.')
      }
    }
  }

  return {
    tipoFactura,
    productosVenta,
    busquedaCliente,
    clienteId,
    nombreCliente,
    tipoPago,
    efectivoRecibido,
    mostrarModalCliente,
    subtotalGravado,
    subtotalExento,
    iva,
    total,
    cambio,
    agregarProducto,
    recalcularSubtotal,
    eliminarProducto,
    resetVenta,
    guardarVentaLocal,
    recuperarVentaLocal,
    buscarCliente,
    procesarVenta,
  }
})