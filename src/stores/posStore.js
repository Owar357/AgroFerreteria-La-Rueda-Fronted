import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import { 
  buscarClientePorDocumento, 
  registerVenta
} from '@/services/ventaService'
import { useCajaStore } from '@/stores/cajaStore'

const LOCAL_STORAGE_KEY = 'pos_venta_en_proceso'

export const usePosStore = defineStore('pos', () => {
  const cajaStore = useCajaStore()

  // Estado
  const tipoFactura = ref('01')
  const productosVenta = ref([])
  const busquedaCliente = ref('')
  const clienteId = ref(null)
  const nombreCliente = ref('')
  const tipoPago = ref('efectivo')
  const efectivoRecibido = ref(0)
  const mostrarModalCliente = ref(false)

  // Computados
  const subtotalGravado = computed(() =>
    productosVenta.value.reduce(
      (acc, p) => (p.aplica_iva ? acc + parseFloat((p.subtotal / 1.13).toFixed(4)) : acc),
      0
    )
  )
  const subtotalExento = computed(() =>
    productosVenta.value.reduce((acc, p) => (!p.aplica_iva ? acc + p.subtotal : acc), 0)
  )
  const iva = computed(() => subtotalGravado.value * 0.13)
  const total = computed(() => subtotalGravado.value + subtotalExento.value + iva.value)
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
      Swal.fire({
        icon: 'warning',
        title: 'Unidad base requerida',
        text: `El producto "${producto.nombre}" no tiene una unidad de medida configurada.`,
        confirmButtonColor: '#2b5e3b',
      })
      return false
    }

    const precioOriginal = parseFloat(presentacion.precio_venta) || 0
    const porcentajeDescuento = parseFloat(presentacion.porcentaje_descuento || producto.porcentaje_descuento || 0)
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
    tipoPago.value = 'efectivo'
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }

  // Persistencia Local
  const guardarVentaLocal = () => {
    if (productosVenta.value.length === 0) {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(estadoVenta))
  }

  const recuperarVentaLocal = () => {
    const datosGuardados = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!datosGuardados) return
    try {
      const estado = JSON.parse(datosGuardados)
      productosVenta.value = estado.productosVenta || []
      tipoFactura.value = estado.tipoFactura || '01'
      tipoPago.value = estado.tipoPago || 'efectivo'
      clienteId.value = estado.clienteId || null
      nombreCliente.value = estado.nombreCliente || ''
      busquedaCliente.value = estado.busquedaCliente || ''
    } catch (e) {
      console.error('Error al recuperar venta del localStorage:', e)
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
  }

  // Operaciones de API y Descarga
  const buscarCliente = async () => {
    if (!busquedaCliente.value.trim()) return
    try {
      const response = await buscarClientePorDocumento(String(busquedaCliente.value))
      const cliente = response.data.data
      nombreCliente.value = cliente.nombre || cliente.razon_social
      clienteId.value = cliente.id
    } catch (error) {
      if (error.response?.status === 404) {
        const resultado = await Swal.fire({
          icon: 'question',
          title: 'Cliente no encontrado',
          text: '¿Desea registrar un nuevo cliente?',
          showCancelButton: true,
          confirmButtonText: 'Registrar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#2b5e3b',
        })
        if (resultado.isConfirmed) mostrarModalCliente.value = true
      }
    }
  }

  const descargarETicket = (ventaId) => {
    try {
      const idLimpio = parseInt(ventaId, 10)
      if (isNaN(idLimpio)) throw new Error('ID de venta inválido')

      const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
      return `${baseUrl}/api/reportes/ticket/${idLimpio}`
    } catch (error) {
      console.error('Error al generar la URL del PDF:', error)
      return null
    }
  }

  const procesarVenta = async (router) => {
    if (productosVenta.value.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin productos',
        text: 'Agrega al menos un producto.',
        confirmButtonColor: '#2b5e3b',
      })
      return
    }

    if (tipoFactura.value === '02' && !clienteId.value) {
      Swal.fire({
        icon: 'warning',
        title: 'Cliente requerido',
        text: 'El crédito fiscal requiere un cliente.',
        confirmButtonColor: '#2b5e3b',
      })
      return
    }

    const payload = {
      tipo_pago: tipoPago.value.toUpperCase(),
      gravado: parseFloat(subtotalGravado.value.toFixed(2)),
      exento: parseFloat(subtotalExento.value.toFixed(2)),
      iva: parseFloat(iva.value.toFixed(2)),
      total: parseFloat(total.value.toFixed(2)),
      efectivo_recibido: tipoPago.value === 'efectivo' ? efectivoRecibido.value : null,
      cambio: tipoPago.value === 'efectivo' ? cambio.value : null,
      cliente_id: clienteId.value || null,
      apertura_caja_id: 1,
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

    try {
      const response = await registerVenta(payload)

      console.log('RESPUESTA COMPLETA DE VENTA:', response.data)

      cajaStore.marcarActualizacionPendiente()

      const respuestaBackend = response.data?.data || response.data
      const ventaId = parseInt(respuestaBackend?.id || response.data?.id, 10)

      const numDoc = respuestaBackend?.num_documento || respuestaBackend?.numero_factura || `#${ventaId}`
      const clienteNombreStr = nombreCliente.value || 'Consumidor Final'
      const totalVentaStr = total.value.toFixed(2)
      const cambioVentaStr = cambio.value.toFixed(2)

      const result = await Swal.fire({
        title: '¡Venta realizada con éxito!',
        html: `
          <div style="text-align:left; font-size:14px; color:#374151">
            <p>La transacción ha sido registrada correctamente en el sistema.</p>
            <div style="background:#f9fafb; border:1px solid #e2e8dd; border-radius:8px; padding:12px; margin-top:12px">
              <p style="margin:4px 0;"><strong>Comprobante:</strong> ${numDoc}</p>
              <p style="margin:4px 0;"><strong>Cliente:</strong> ${clienteNombreStr}</p>
              <p style="margin:4px 0;"><strong>Total a Pagar:</strong> $${totalVentaStr}</p>
              ${tipoPago.value === 'efectivo' ? `<p style="margin:4px 0;"><strong>Cambio:</strong> $${cambioVentaStr}</p>` : ''}
            </div>
          </div>
        `,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Imprimir Ticket PDF',
        cancelButtonText: 'Siguiente Venta',
        confirmButtonColor: '#2b5e3b',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
      })

      if (result.isConfirmed && ventaId) {
        const urlTicket = descargarETicket(ventaId)
        if (urlTicket) {
          window.open(urlTicket, '_blank')
        }
      }

      resetVenta()

      if (response.data.apertura_pendiente) {
        const resApertura = await Swal.fire({
          icon: 'warning',
          title: 'Apertura de caja pendiente',
          text: 'Debes aperturar tu turno en el módulo de caja.',
          confirmButtonText: 'Ir a aperturar',
          confirmButtonColor: '#e0b354',
          showCancelButton: true,
          cancelButtonText: 'Cerrar',
        })

        if (resApertura.isConfirmed) {
          router.push({ name: 'caja' })
        }
      }
    } catch (error) {
      console.error('Error al registrar la venta:', error)
      const status = error.response?.status
      const respuesta = error.response?.data

      if (status === 422 && respuesta?.errors) {
        const mensajes = Object.values(respuesta.errors).flat()
        Swal.fire({
          icon: 'warning',
          title: 'Error de validación',
          text: mensajes[0],
          confirmButtonColor: '#2b5e3b',
        })
      } else if (respuesta?.message) {
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: respuesta.message,
          confirmButtonColor: '#2b5e3b',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error de servidor',
          text: 'Ocurrió un problema inesperado al procesar la venta.',
          confirmButtonColor: '#2b5e3b',
        })
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