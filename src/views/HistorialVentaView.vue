<template>
  <div>
    <!-- Tabla -->
    <HistorialVentaTable
      :sales="sales"
      @view-detail="openDetail"
      @void-sale="confirmVoid"
    />

    <!-- Modal detalle -->
    <DetallVentaDialogo
      v-model:visible="showDetail"
      :sale="selectedSale"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import HistorialVentaTable from '../components/Usuarios/HistorialVentaTable.vue'
import DetallVentaDialogo from '@/components/Usuarios/DetallVentaDialogo.vue'

// ── Estado del modal
const showDetail  = ref(false)
const selectedSale = ref(null)

// ── Datos centralizados en el padre
const sales = ref([
  {
    id: 1, soldBy: 'Daniel Melgar', Numberfact: 'FAC-001-2025',
    paymentType: 'Efectivo', status: 'Procesado', date: '10/02/2025', total: 90.50,
    items: [
      { product: 'Fertilizante  ',  cantidad: 2,unidad: 'libra', price: 85.00 },
      { product: ' Semillas',  cantidad: 1, unidad: 'libra', price: 5.50 }
    ]
  },
  {
    id: 2, soldBy: 'Maria Lopez', Numberfact: 'FAC-002-2025',
    paymentType: 'Transferencia', status: 'Procesado', date: '11/02/2025', total: 68.00,
    items: [
      { product: 'Herbicida Roundup ', cantidad: 4, unidad: 'libra', price: 48.00 },
      { product: 'conecntrado ',    cantidad: 1, unidad: 'libra', price: 20.00 }
    ]
  },
  {
    id: 3, soldBy: 'Carlos Ruiz', Numberfact: 'FAC-003-2025',
    paymentType: 'Tarjeta', status: 'Anulado', date: '12/02/2025', total: 26.15,
    items: [
      { product: 'Semillas de maíz híbrido', cantidad: 5, unidad: 'libra', price: 26.15 }
    ]
  },
 
])

// ── Abrir detalle 
const openDetail = (sale) => {
  selectedSale.value = sale
  showDetail.value   = true
}

// ── Anular venta con SweetAlert2
const confirmVoid = (sale) => {
  if (sale.status === 'Anulado') return

  Swal.fire({
    title: '¿Anular esta venta?',
    html: `
      <div style="text-align:left;font-size:14px;color:#374151">
        <p style="margin:0 0 8px 0">Esta acción <strong>no se puede deshacer</strong>.</p>
        <div style="background:#f9fafb;border:1px solid #e2e8dd;border-radius:8px;padding:12px;margin-top:8px">
          <p style="margin:0 0 4px 0"><strong>Factura:</strong> ${sale.invoiceNumber}</p>
          <p style="margin:0 0 4px 0"><strong>Vendido por:</strong> ${sale.soldBy}</p>
          <p style="margin:0"><strong>Total:</strong> $${formatCurrency(sale.total)}</p>
        </div>
      </div>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, anular',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#b91c1c',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    customClass: { popup: 'swal-custom-popup', title: 'swal-custom-title' }
  }).then((result) => {
    if (!result.isConfirmed) return

    const idx = sales.value.findIndex(s => s.id === sale.id)
    if (idx !== -1) sales.value[idx].status = 'Anulado'

    Swal.fire({
      title: '¡Venta anulada!',
      text: `La factura ${sale.invoiceNumber} fue anulada exitosamente.`,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#2b5e3b',
      timer: 3000,
      timerProgressBar: true
    })
  })
}

const formatCurrency = (v) =>
  Number(v).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
</script>

<style>
.swal-custom-popup  { border-radius: 16px !important; font-family: 'Inter', sans-serif !important; }
.swal-custom-title  { font-size: 18px !important; color: #1a2e1f !important; }
</style>