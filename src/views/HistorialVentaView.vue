<template>
  <div>
    <HistorialVentaTable :ventas="ventas" @ver-detalle="abrirDetalle" @anular-venta="confirmarAnulacion"
      @filtrar-fechas="aplicarFiltroFechas" />

    <DetallVentaDialogo v-model:visible="mostrarDetalle" :venta="ventaSeleccionada" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import HistorialVentaTable from '../components/Usuarios/HistorialVentaTable.vue'
import DetallVentaDialogo from '@/components/Usuarios/DetallVentaDialogo.vue'
import { getDetallesVenta, getVentas } from '@/services/ventaService.js'

const mostrarDetalle = ref(false)
const ventaSeleccionada = ref(null)
const ventas = ref([])
const cargando = ref(false)





const aplicarFiltroFechas = async (fechas) => {
  cargando.value = true
  try {
    const response = await getVentas(fechas || {})
    const data = response.data.data || []
    ventas.value = data.map(v => ({
      id: v.id,
      vendidoPor: v.vendido_por.name,
      numeroFactura: v.numero_factura,
      tipoPago: v.tipo_pago,
      estado: v.estado,
      fecha: new Date(v.created_at).toLocaleDateString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      }),
      total: v.total,
    }))
  } catch {
    ventas.value = []
  } finally {
    cargando.value = false
  }
}

const cargarVentas = async () => {
  cargando.value = true
  try {
    const response = await getVentas()
    const data = response.data.data || response.data || []
    ventas.value = data.map(v => ({
      id: v.id,
      vendidoPor: v.vendido_por.name,
      numeroFactura: v.numero_factura,
      tipoPago: v.tipo_pago,
      estado: v.estado,
      fecha: new Date(v.created_at).toLocaleDateString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      }),
      total: v.total,
    }))
  } catch (error) {
    console.error(error)
    Swal.fire({
      toast: true, position: 'top-end', icon: 'error',
      title: 'Error al cargar el historial',
      showConfirmButton: false, timer: 2000
    })
  } finally {
    cargando.value = false
  }
}

const abrirDetalle = async (venta) => {
  try {

    const response = await getDetallesVenta(venta.id)
    const detalles = response.data.data || response.data

    ventaSeleccionada.value = {
      // Datos de la venta (cabecera)
      vendidoPor: venta.vendidoPor,              // o venta.vendidoPor
      numeroFactura: venta.numeroFactura,
      fechaEmision: venta.fecha,
      tipoPago: venta.tipoPago,
      estado: venta.estado,
      total: venta.total,
     
      items: detalles.map(d => ({
        nombreProducto: d.nombre_producto,
        cantidad: parseFloat(d.cantidad),
        precio: parseFloat(d.precio_unitario),
        unidad: d.unidad_medida,
        subtotal: parseFloat(d.subtotal) || (parseFloat(d.cantidad) * parseFloat(d.precio_unitario))
      }))

    }
    mostrarDetalle.value = true



  } catch (error) {
    console.error(error)
    Swal.fire({
      toast: true, position: 'top-end', icon: 'error',
      title: 'Error al cargar el detalle',
      showConfirmButton: false, timer: 2000
    })
  }
}

const confirmarAnulacion = (venta) => {       // ← llave que cerraba antes de tiempo, fix
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

    const idx = ventas.value.findIndex(v => v.id === venta.id)
    if (idx !== -1) ventas.value[idx].estado = 'ANULADA'

    Swal.fire({
      title: '¡Venta anulada!', icon: 'success',
      text: `La factura ${venta.numeroFactura} fue anulada.`,
      confirmButtonColor: '#2b5e3b', timer: 3000, timerProgressBar: true
    })
  })
}

onMounted(() => cargarVentas())

const formatearMoneda = (valor) =>
  Number(valor).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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