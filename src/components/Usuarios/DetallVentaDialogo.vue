<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :closable="true"
    :style="{ width: '650px' }"
    :pt="{
      root: { class: '!rounded-2xl !border-0 overflow-hidden shadow-2xl bg-white' },
      header: { class: '!bg-[#1a2e1f] !text-white !px-5 !py-3 !border-0 flex items-center justify-between' },
      title: { class: '!text-white !font-bold' },
      headerIcons: { class: 'flex items-center' },
      closeButton: { class: '!text-white/70 hover:!text-white hover:!bg-white/10 transition-colors rounded-full w-8 h-8 flex items-center justify-center' },
      content: { class: 'bg-[#eef2e9] p-6 !border-0' },
      footer: { class: 'bg-white p-4 !border-0' }
    }"
  >
    <template #header>
      <div class="flex items-center gap-2.5">
        <span class="bg-[#2b5e3b] text-[#ffffff] rounded-full p-1.5 flex items-center justify-center shadow-sm">
          <i class="pi pi-receipt text-[15px]" />
        </span>
        <div>
          <h2 class="text-[16px] font-bold text-white m-0 tracking-wide">Detalle de Venta</h2>
          <p class="text-[12px] text-[#a7f3d0] font-mono m-0 opacity-90">{{ sale?.Numberfact }}</p>
        </div>
      </div>
    </template>

    <div v-if="sale" class="flex flex-col gap-6 pt-2">
            <div class="bg-white rounded-xl border border-[#e2e8dd] p-4 shadow-sm flex flex-col gap-4">
      
        <div class="grid grid-cols-2 gap-4 pb-3 border-b border-[#e2e8dd]/60">
          <div>
            <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-bold mb-1">Vendido por</p>
            <p class="text-[14px] font-semibold text-[#1a2e1f] m-0">{{ sale.soldBy }}</p>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-bold mb-1">Fecha de Emisión</p>
            <p class="text-[14px] font-semibold text-[#1a2e1f] m-0">{{ sale.date }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-bold mb-1">Tipo de Pago</p>
            <p class="text-[14px] font-semibold text-[#1a2e1f] m-0">{{ sale.paymentType }}</p>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-wider text-[#6b7280] font-bold mb-1">Estado Transacción</p>
            <div class="mt-0.5">
              <span :class="sale.status === 'Procesado'
                ? 'bg-[#dff0e0] text-[#2b5e3b] border-[#c5e3c7]'
                : 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]'"
                class="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border inline-block">
                {{ sale.status }}
              </span>
            </div>
          </div>
        </div>

      </div>

      <div>
        <p class="text-[11px] uppercase tracking-wider text-[#1a2e1f] font-bold mb-2.5 flex items-center gap-1.5">
          <i class="pi pi-box text-[12px] text-[#2b5e3b]" />
          Productos Registrados
        </p>
        <div class="rounded-xl border border-[#e2e8dd] overflow-hidden shadow-sm">
          <table class="w-full text-[13px]">
            <thead>
              <tr class="bg-[#f4f7f2] text-[#1e3a2f] text-left border-b border-[#e2e8dd]">
                <th class="px-4 py-3 font-semibold uppercase text-[11px] tracking-wide">Producto</th>
                <th class="px-4 py-3 font-semibold uppercase text-[11px] tracking-wide text-center">Cantidad</th>
                <th class="px-4 py-3 font-semibold uppercase text-[11px] tracking-wide text-right">Precio unit.</th>
                <th class="px-4 py-3 font-semibold uppercase text-[11px] tracking-wide text-right">Unidad base</th>
                <th class="px-4 py-3 font-semibold uppercase text-[11px] tracking-wide text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in sale.items"
                :key="i"
                :class="i % 2 === 0 ? 'bg-white' : 'bg-[#f9fafb]'"
                class="border-b last:border-0 border-[#e2e8dd] hover:bg-[#eef2e9] transition-colors"
              >
                <td class="px-4 py-2.5 text-[#1a2e1f] font-medium">{{ item.product }}</td>
                <td class="px-4 py-2.5 text-center text-[#4b5563] font-semibold">{{ item.cantidad }}</td>
                <td class="px-4 py-2.5 text-right text-[#4b5563]">${{ formatCurrency(item.price) }}</td>
                <td class="px-4 py-1.5 text-right text-[#4b5563] font-medium">{{ item.unidad }}</td>
                <td class="px-4 py-2.5 text-right font-bold text-[#1a2e1f]">${{ formatCurrency(item.cantidad * item.price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-end">
        <div class="bg-[#f4f7f2] border border-[#e2e8dd] rounded-xl px-5 py-2.5 flex items-center gap-4 shadow-sm">
          <span class="text-[12px] font-bold uppercase tracking-wider text-[#1e3a2f] opacity-80">Total a Pagar</span>
          <span class="text-[22px] font-black text-[#2b5e3b]">${{ formatCurrency(sale.total) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end w-full">
        <Button
          label="Cerrar factura"
          icon="pi pi-times"
          class="!bg-[#1e3a2f] hover:!bg-[#2b5e3b] !text-[#ffffff] border-none text-[13px] font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
          @click="visible = false"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

defineProps({
  sale: {
    type: Object,
    default: null
  }
})

const visible = defineModel('visible', { type: Boolean, default: false })

const formatCurrency = (v) =>
  Number(v).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
</script>