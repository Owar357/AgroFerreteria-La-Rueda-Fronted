<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :closable="true"
    :style="{ width: '620px' }"
    class="sale-detail-dialog"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <span class="bg-[#e3e9e3] text-[#2b5e3b] rounded-full p-2">
          <i class="pi pi-receipt text-[18px]" />
        </span>
        <div>
          <h2 class="text-[17px] font-bold text-[#1a2e1f] m-0">Detalle de venta</h2>
          <p class="text-[15px] text-[#f1f1f5] m-0">{{ sale?.Numberfact }}</p>
        </div>
      </div>
    </template>

    <div v-if="sale" class="flex flex-col gap-5 pt-1">

      <!-- Info general -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-[#ffffff] rounded-lg p-4 border border-[#e2e8dd]">
          <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-semibold mb-1">Vendido por</p>
          <p class="text-[14px] font-semibold text-[#1a2e1f] m-0">{{ sale.soldBy }}</p>
        </div>
        <div class="bg-[#ffffff] rounded-lg p-4 border border-[#e2e8dd]">
          <p class="text-[11px] uppercase tracking-wider text-[#60646d] font-semibold mb-1">Fecha</p>
          <p class="text-[14px] font-semibold text-[#1a2e1f] m-0">{{ sale.date }}</p>
        </div>
        <div class="bg-[#ffffff] rounded-lg p-4 border border-[#e2e8dd]">
          <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-semibold mb-1">Tipo de pago</p>
          <p class="text-[14px] font-semibold text-[#1a2e1f] m-0">{{ sale.paymentType }}</p>
        </div>
        <div class="bg-[#ffffff] rounded-lg p-4 border border-[#e2e8dd]">
          <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-semibold mb-1">Estado</p>
          <span :class="sale.status === 'Procesado'
            ? 'bg-[#dff0e0] text-[#2b5e3b]'
            : 'bg-[#fee2e2] text-[#b91c1c]'"
            class="px-3 py-1 rounded text-[12px] font-semibold uppercase tracking-wide">
            {{ sale.status }}
          </span>
        </div>
      </div>

      <!-- Tabla de productos -->
      <div>
        <p class="text-[12px] uppercase tracking-wider text-[#4e4949] font-semibold mb-2">Productos</p>
        <div class="rounded-lg border border-[#e2e8dd] overflow-hidden">
          <table class="w-full text-[13px]">
            <thead>
              <tr class="bg-[#f4f7f2] text-[#1e3a2f] text-left">
                <th class="px-4 py-2 font-semibold uppercase text-[11px] tracking-wide">Producto</th>
                <th class="px-4 py-2 font-semibold uppercase text-[11px] tracking-wide text-center">Canidad</th>
                <th class="px-4 py-2 font-semibold uppercase text-[11px] tracking-wide text-right">Precio unit.</th>
                 <th class="px-4 py-2 font-semibold uppercase text-[11px] tracking-wide text-right">Unidad base</th>
                <th class="px-4 py-2 font-semibold uppercase text-[11px] tracking-wide text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in sale.items" :key="i"
                class="border-t border-[#e2e8dd] hover:bg-[#f9fafb]">
                <td class="px-4 py-2 text-[#1a2e1f] font-medium">{{ item.product }}</td>
                <td class="px-4 py-2 text-center text-[#4b5563]">{{ item.cantidad }}</td>
                <td class="px-4 py-2 text-right text-[#4b5563]">${{ formatCurrency(item.price) }}</td>
                 <td class="px-4 py-1 text-[#1a2e1f] font-medium">{{ item.unidad }}</td>
                <td class="px-4 py-2 text-right font-semibold text-[#1a2e1f]">${{ formatCurrency(item.cantidad * item.price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Total -->
      <div class="flex justify-end">
        <div class="bg-[#ffffff] text-black rounded-lg px-6 py-3 flex items-center gap-3">
          <span class="text-[13px] font-semibold uppercase tracking-wide opacity-80">Total</span>
          <span class="text-[20px] font-bold">${{ formatCurrency(sale.total) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        class="!bg-[#2b5e3b] hover:!bg-[#406d4e] !text-[#ffffff] border-none text-[13px] font-semibold px-8 py-4 rounded-lg"
        @click="visible = false"
      />
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { baseItem } from '@primeuix/themes/aura/megamenu'

// ── Props 
defineProps({
  sale: {
    type: Object,
    default: null
  }
})

// ── v-model para controlar visibilidad desde el padre
const visible = defineModel('visible', { type: Boolean, default: false })

// ── Helpers
const formatCurrency = (v) =>
  Number(v).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
</script>

<style>
.sale-detail-dialog .p-dialog         { border-radius: 16px !important; overflow: hidden !important; }
.sale-detail-dialog .p-dialog-header  { background: #1a2e1f !important; border-bottom: 1px solid #e2e8dd !important; padding: 1.25rem 1.5rem !important; }
.sale-detail-dialog .p-dialog-content { padding: 1.5rem !important; }

</style>