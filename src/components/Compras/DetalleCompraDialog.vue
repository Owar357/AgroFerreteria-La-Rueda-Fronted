<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :closable="true"
    :style="{ width: '1200px' }"
    :pt="{
      root: { class: '!rounded-2xl !border-0 overflow-hidden shadow-2xl bg-white' },
      header: { class: '!bg-[#1a2e1f] !text-white !px-5 !py-3 !border-0 flex items-center justify-between' },
      title: { class: '!text-white !font-bold' },
      closeButton: { class: '!text-white/70 hover:!text-white hover:!bg-white/10 transition-colors rounded-full w-8 h-8 flex items-center justify-center' },
      content: { class: 'bg-[#eef2e9] p-6 !border-0' },
      footer: { class: 'bg-white p-4 !border-0' }
    }"
  >
    <template #header>
      <div class="flex items-center gap-2.5">
        <span class="bg-[#2b5e3b] text-white rounded-full p-1.5 flex items-center justify-center shadow-sm">
          <i class="pi pi-shopping-cart text-[15px]" />
        </span>
        <div>
          <h2 class="text-[16px] font-bold text-white m-0 tracking-wide">Detalle de Compra</h2>
          <p class="text-[12px] text-[#a7f3d0] font-mono m-0 opacity-90">{{ compra?.numero_documento }}</p>
        </div>
      </div>
    </template>

    <div v-if="compra" class="flex flex-col gap-6 pt-2">
      <!-- Información general -->
      <div class="bg-white rounded-xl border border-[#e2e8dd] p-4 shadow-sm">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-bold mb-1">Proveedor</p>
            <p class="text-[14px] font-semibold text-[#1a2e1f] m-0">{{ compra.proveedor?.nombre }}</p>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-bold mb-1">Fecha de Emisión</p>
            <p class="text-[14px] font-semibold text-[#1a2e1f] m-0">{{ formatDate(compra.fecha_emision) }}</p>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-bold mb-1">Tipo DTE</p>
            <p class="text-[14px] font-semibold text-[#1a2e1f] m-0">{{ compra.tipo_dte }}</p>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-bold mb-1">Estado de Pago</p>
            <span :class="compra.estado_pago === 'PAGADO'
              ? 'bg-[#dff0e0] text-[#2b5e3b] border-[#c5e3c7]'
              : 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]'"
              class="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border inline-block">
              {{ compra.estado_pago }}
            </span>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-bold mb-1">Vencimiento pago</p>
            <p class="text-[14px] font-semibold text-[#1a2e1f] m-0">{{ formatDate(compra.fecha_vencimiento_pago) }}</p>
          </div>
          <div v-if="compra.usuario">
            <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-bold mb-1">Registrado por</p>
            <p class="text-[14px] font-semibold text-[#1a2e1f] m-0">{{ compra.usuario.nombre }}</p>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-bold mb-1">Descuento global</p>
            <p class="text-[14px] font-semibold text-[#1a2e1f] m-0">${{ formatCurrency(compra.descuento_global) }}</p>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-bold mb-1">IVA total</p>
            <p class="text-[14px] font-semibold text-[#1a2e1f] m-0">${{ formatCurrency(compra.iva_total) }}</p>
          </div>
        </div>
      </div>

      <!-- Tabla de productos y lotes -->
      <div>
        <p class="text-[11px] uppercase tracking-wider text-[#1a2e1f] font-bold mb-2.5 flex items-center gap-1.5">
          <i class="pi pi-box text-[12px] text-[#2b5e3b]" />
          Productos y Lotes
        </p>
        <div class="rounded-xl border border-[#e2e8dd] overflow-hidden shadow-sm bg-white">
          <DataTable :value="compra.detalles_compra" responsiveLayout="scroll" class="p-datatable-detalle text-[13px]">
            <Column header="Producto">
              <template #body="{ data }">
                <span class="text-[#1a2e1f] font-medium">{{ data.lote?.presentacion?.producto?.nombre || '—' }}</span>
              </template>
            </Column>
            <Column header="Presentación">
              <template #body="{ data }">
                <span class="text-[#4b5563]">{{ data.lote?.presentacion?.nombre || '—' }}</span>
              </template>
            </Column>
            <Column header="Lote interno">
              <template #body="{ data }">
                <span class="text-[#1a2e1f] font-medium">{{ data.lote?.lote_interno || 'Sin lote' }}</span>
              </template>
            </Column>
            <Column header="Lote fabricante">
              <template #body="{ data }">
                <span class="text-[#4b5563]">{{ data.lote?.lote_fabricante || '—' }}</span>
              </template>
            </Column>
            <Column header="Vence">
              <template #body="{ data }">
                <span class="text-[#4b5563]">{{ data.lote?.fecha_vencimiento ? formatDate(data.lote.fecha_vencimiento) : '—' }}</span>
              </template>
            </Column>
            <Column header="Cant. facturada" class="text-right">
              <template #body="{ data }">
                <span class="text-[#4b5563]">{{ Number(data.cantidad_facturada).toFixed(2) }}</span>
              </template>
            </Column>
            <Column header="Bonificado" class="text-right">
              <template #body="{ data }">
                <span class="text-[#2b5e3b] font-semibold">
                  {{ Number(data.cantidad_bonificada) > 0 ? `+${Number(data.cantidad_bonificada).toFixed(2)}` : '0.00' }}
                </span>
              </template>
            </Column>
            <Column header="Precio factura" class="text-right">
              <template #body="{ data }">
                <span class="text-[#4b5563]">${{ formatCurrency(data.precio_unitario_factura) }}</span>
              </template>
            </Column>
            <Column header="IVA línea" class="text-right">
              <template #body="{ data }">
                <span class="text-[#4b5563]">${{ formatCurrency(data.iva_linea) }}</span>
              </template>
            </Column>
            <Column header="Descuento" class="text-right">
              <template #body="{ data }">
                <span class="text-[#b91c1c]">
                  {{ Number(data.descuento_linea) > 0 ? `-$${formatCurrency(data.descuento_linea)}` : '$0.00' }}
                </span>
              </template>
            </Column>
            <Column header="Costo real (lote)" class="text-right">
              <template #body="{ data }">
                <span class="text-[#1a2e1f]">${{ formatCurrency(data.lote?.costo_unitario_compra) }}</span>
              </template>
            </Column>
            <Column header="Subtotal" class="text-right">
              <template #body="{ data }">
                <span class="font-bold text-[#1a2e1f]">${{ formatCurrency(data.sub_total) }}</span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

      <!-- Total general -->
      <div class="flex justify-end">
        <div class="bg-[#f4f7f2] border border-[#e2e8dd] rounded-xl px-5 py-2.5 flex items-center gap-4 shadow-sm">
          <span class="text-[12px] font-bold uppercase tracking-wider text-[#1e3a2f] opacity-80">Total de la Compra</span>
          <span class="text-[22px] font-black text-[#2b5e3b]">${{ formatCurrency(compra.monto_total) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end w-full">
        <Button
          label="Cerrar"
          icon="pi pi-times"
          class="!bg-[#1e3a2f] hover:!bg-[#2b5e3b] !text-white border-none text-[13px] font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
          @click="visible = false"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
const props = defineProps({
  compra: { type: Object, default: null }
})

const visible = defineModel('visible', { type: Boolean, default: false })

const formatCurrency = (v) => {
  const num = parseFloat(v)
  return isNaN(num) ? '0.00' : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDate = (isoDate) => {
  if (!isoDate) return '—'
  const date = new Date(isoDate)
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style>
.p-datatable-detalle .p-datatable-thead > tr > th {
  background-color: #f4f7f2 !important;
  color: #1e3a2f !important;
  border-bottom: 1px solid #e2e8dd !important;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.75rem 1rem;
}

.p-datatable-detalle .p-datatable-tbody > tr {
  background-color: #ffffff !important;
  border-bottom: 1px solid #e2e8dd !important;
}

.p-datatable-detalle .p-datatable-tbody > tr:last-child {
  border-bottom: none !important;
}

.p-datatable-detalle .p-datatable-tbody > tr:nth-child(even) {
  background-color: #f9fafb !important;
}

.p-datatable-detalle .p-datatable-tbody > tr:hover {
  background-color: #eef2e9 !important;
}
</style>