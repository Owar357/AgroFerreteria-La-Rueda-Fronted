<template>
  <div>
    <HistorialVentasTable
      :ventas="ventas"
      :cargando="cargando"
      :total-registros="totalRegistros"
      :filas="porPagina"
      :primero="primero"
      @ver-detalle="abrirDetalle"
      @cambiar-pagina="onCambiarPagina"
      @cambiar-filtros="onCambiarFiltros"
    />

    <DetalleVentasDialog v-model:visible="mostrarDetalle" :venta="ventaSeleccionada" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import HistorialVentasTable from '../components/Ventas/HistorialVentasTable.vue'
import DetalleVentasDialog from '../components/Ventas/DetalleVentasDialog.vue'
import { getDetallesVenta, getVentas } from '@/services/ventaService.js'
import { useRoute } from 'vue-router'

const mostrarDetalle = ref(false)
const ventaSeleccionada = ref(null)
const route = useRoute()

const clienteId = route.query.clienteId

// --- Estado de la lista (la paginación y los filtros los resuelve el servidor) ---
const ventas = ref([])
const cargando = ref(false)
const totalRegistros = ref(0)
const pagina = ref(1)
const porPagina = ref(8)
const primero = ref(0)
const filtros = ref({ search: '', estado: '', tipo_pago: '', fecha_desde: '', fecha_hasta: '' })

// Evita que una respuesta lenta y antigua pise a una más reciente
let peticionActual = 0

const mapearVenta = (v) => ({
  id: v.id,
  vendidoPor: v.vendido_por?.name ?? '-',
  numeroFactura: v.numero_factura,
  tipoPago: v.tipo_pago,
  estado: v.estado,
  fecha: new Date(v.created_at).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }),
  total: v.total,
  aperturaVentaId: v.apertura_venta_id,
})

const cargarVentas = async () => {
  const numeroPeticion = ++peticionActual
  cargando.value = true

  try {
    const params = { page: pagina.value, per_page: porPagina.value }

    if (clienteId) params.cliente = clienteId
    if (filtros.value.search) params.search = filtros.value.search
    if (filtros.value.estado) params.estado = filtros.value.estado
    if (filtros.value.tipo_pago) params.tipo_pago = filtros.value.tipo_pago
    if (filtros.value.fecha_desde) {
      params.fecha_desde = filtros.value.fecha_desde
      params.fecha_hasta = filtros.value.fecha_hasta || filtros.value.fecha_desde
    }

    const response = await getVentas(params)

    if (numeroPeticion !== peticionActual) return

    ventas.value = (response.data.data ?? []).map(mapearVenta)
    totalRegistros.value = response.data.total ?? 0
  } catch (error) {
    if (numeroPeticion !== peticionActual) return

    console.error(error)
    ventas.value = []
    totalRegistros.value = 0
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Error al cargar el historial',
      showConfirmButton: false,
      timer: 2000,
    })
  } finally {
    if (numeroPeticion === peticionActual) cargando.value = false
  }
}

const onCambiarPagina = ({ page, per_page }) => {
  pagina.value = page
  porPagina.value = per_page
  primero.value = (page - 1) * per_page
  cargarVentas()
}

// Al cambiar un filtro se vuelve a la primera página
const onCambiarFiltros = (nuevosFiltros) => {
  filtros.value = nuevosFiltros
  pagina.value = 1
  primero.value = 0
  cargarVentas()
}

const abrirDetalle = async (venta) => {
  try {
    const response = await getDetallesVenta(venta.id)
    const detalles = response.data.data || response.data

    ventaSeleccionada.value = {
      // Datos de la venta (cabecera)
      vendidoPor: venta.vendidoPor,
      numeroFactura: venta.numeroFactura,
      fechaEmision: venta.fecha,
      tipoPago: venta.tipoPago,
      estado: venta.estado,
      total: venta.total,

      items: detalles.map((d) => ({
        nombreProducto: d.nombre_producto,
        cantidad: parseFloat(d.cantidad),
        precio: parseFloat(d.precio_unitario),
        unidad: d.unidad_base,
        subtotal: parseFloat(d.subtotal) || parseFloat(d.cantidad) * parseFloat(d.precio_unitario),
      })),
    }
    mostrarDetalle.value = true
  } catch (error) {
    console.error(error)
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Error al cargar el detalle',
      showConfirmButton: false,
      timer: 2000,
    })
  }
}

// PENDIENTE: la anulación real de ventas se implementará después (hoy solo cambia el estado en pantalla)
const confirmarAnulacion = (venta) => {
  if (venta.estado === 'ANULADA') return

  Swal.fire({
    title: '¿Anular esta venta?',
    html: `
      <div style="text-align:left;font-size:14px;color:#374151">
        <p style="margin:0 0 8px 0">Esta acción <strong>no se puede deshacer</strong>.</p>
        <div style="background:#f9fafb;border:1px solid #e2e8dd;border-radius:8px;padding:12px;margin-top:8px">
          <p style="margin:0 0 4px 0"><strong>Factura:</strong> ${venta.numeroFactura}</p>
          <p style="margin:0 0 4px 0"><strong>Vendido por:</strong> ${venta.vendidoPor}</p>
          <p style="margin:0"><strong>Total:</strong> $${formatearMoneda(venta.total)}</p>
        </div>
      </div>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, anular',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#b91c1c',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  }).then((result) => {
    if (!result.isConfirmed) return

    const idx = ventas.value.findIndex((v) => v.id === venta.id)
    if (idx !== -1) ventas.value[idx].estado = 'ANULADA'

    Swal.fire({
      title: '¡Venta anulada!',
      icon: 'success',
      text: `La factura ${venta.numeroFactura} fue anulada.`,
      confirmButtonColor: '#2b5e3b',
      timer: 3000,
      timerProgressBar: true,
    })
  })
}

onMounted(() => cargarVentas())

const formatearMoneda = (valor) =>
  Number(valor)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
</script>

<style>
.swal-custom-popup {
  border-radius: 16px !important;
  font-family: 'Inter', sans-serif !important;
}
.swal-custom-title {
  font-size: 18px !important;
  color: #1a2e1f !important;
}
</style>