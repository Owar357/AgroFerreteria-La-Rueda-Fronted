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
import HistorialVentasTable from '../components/Ventas/HistorialVentasTable.vue'
import DetalleVentasDialog from '../components/Ventas/DetalleVentasDialog.vue'
import { getDetallesVenta, getVentas } from '@/services/ventaService.js'
import { useRoute } from 'vue-router'
import { 
  mostrarError, 
  mostrarAccesoDenegado 
} from '@/utils/SweetAlertService'

const mostrarDetalle = ref(false)
const ventaSeleccionada = ref(null)
const route = useRoute()

const clienteId = route.query.clienteId

// --- Estado de la lista ---
const ventas = ref([])
const cargando = ref(false)
const totalRegistros = ref(0)
const pagina = ref(1)
const porPagina = ref(8)
const primero = ref(0)
const filtros = ref({ search: '', estado: '', tipo_pago: '', fecha_desde: '', fecha_hasta: '' })

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

    ventas.value = []
    totalRegistros.value = 0
    
    if (error.response?.status === 403) {
      mostrarAccesoDenegado()
    } else {
      mostrarError('Error de carga', 'No se pudo obtener el historial de ventas.')
    }
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
    if (error.response?.status === 403) {
      mostrarAccesoDenegado()
    } else {
      mostrarError('Error', 'No se pudo obtener el detalle de la venta.')
    }
  }
}

onMounted(() => cargarVentas())
</script>

<style scoped>
:global(.swal2-container) {
  z-index: 999999 !important;
}
</style>