<template>
  <div>
    <HistorialVentaTable
      :sales="sales"
      @view-detail="openDetail"
      @void-sale="confirmVoid"
    />

    <DetallVentaDialogo
      v-model:visible="showDetail"
      :sale="selectedSale"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import HistorialVentaTable from '../components/Usuarios/HistorialVentaTable.vue'
import DetallVentaDialogo from '@/components/Usuarios/DetallVentaDialogo.vue'
import { getVentas } from '@/services/ventaService.js'

const showDetail   = ref(false)
const selectedSale = ref(null)
const sales        = ref([])
const cargando     = ref(false)

const cargarVentas = async () => {
  cargando.value = true
  try {
    const response = await getVentas()
    const ventas = response.data.data || response.data || []
    sales.value = ventas.map(v => ({
      id:            v.id,
      vendidoPor:    v.vendido_por,
      numeroFactura: v.numero_factura,
      tipoPago:      v.tipo_pago,
      estado:        v.estado,
      fecha:         new Date(v.created_at).toLocaleDateString('es-ES', {
                       day: '2-digit', month: '2-digit', year: 'numeric'
                     }),
      total:         v.total,
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

onMounted(() => cargarVentas())

const openDetail = (sale) => {
  selectedSale.value = sale
  showDetail.value   = true
}

const confirmVoid = (sale) => {
  if (sale.estado === 'ANULADA') return

  Swal.fire({
    title: '¿Anular esta venta?',
    html: `
      <div style="text-align:left;font-size:14px;color:#374151">
        <p style="margin:0 0 8px 0">Esta acción <strong>no se puede deshacer</strong>.</p>
        <div style="background:#f9fafb;border:1px solid #e2e8dd;border-radius:8px;padding:12px;margin-top:8px">
          <p style="margin:0 0 4px 0"><strong>Factura:</strong> ${sale.numeroFactura}</p>
          <p style="margin:0 0 4px 0"><strong>Vendido por:</strong> ${sale.vendidoPor}</p>
          <p style="margin:0"><strong>Total:</strong> $${formatCurrency(sale.total)}</p>
        </div>
      </div>`,
    icon: 'warning',
    showCancelButton:    true,
    confirmButtonText:   'Sí, anular',
    cancelButtonText:    'Cancelar',
    confirmButtonColor:  '#b91c1c',
    cancelButtonColor:   '#6b7280',
    reverseButtons:      true,
  }).then((result) => {
    if (!result.isConfirmed) return

    const idx = sales.value.findIndex(s => s.id === sale.id)
    if (idx !== -1) sales.value[idx].estado = 'ANULADA'

    Swal.fire({
      title: '¡Venta anulada!', icon: 'success',
      text: `La factura ${sale.numeroFactura} fue anulada.`,
      confirmButtonColor: '#2b5e3b', timer: 3000, timerProgressBar: true
    })
  })
}

const formatCurrency = (v) =>
  Number(v).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
</script>

<style>
.swal-custom-popup { border-radius: 16px !important; font-family: 'Inter', sans-serif !important; }
.swal-custom-title { font-size: 18px !important; color: #1a2e1f !important; }
</style>