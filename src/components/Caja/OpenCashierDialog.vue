<template>
  <Dialog 
    :visible="visible" 
    @update:visible="emit('update:visible', $event)"
    modal 
    :draggable="false"
    class="w-full max-w-2xl font-['Inter']"
    :pt="{
      root: { class: 'bg-white rounded-2xl shadow-xl overflow-hidden border border-[#eef2e9]' },
      header: { class: 'bg-white border-b border-[#eef2e9] p-6 flex justify-between items-center' },
      content: { class: 'p-6 bg-white max-h-[65vh] overflow-y-auto' },
      footer: { class: 'bg-white border-t border-[#eef2e9] p-6 flex justify-between items-center' }
    }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full pr-4">
        <h2 class="text-[26px] font-semibold text-[#1a2e1f]">
          Apertura de caja
        </h2>
        
        <div class="flex items-center gap-2">
          <span class="text-[14px] text-[#4b5563]">Estado:</span>
          <span 
            class="px-3 py-1 text-[13px] font-medium rounded-[40px] transition-colors"
            :class="isShiftOpen ? 'bg-[#e0b354] text-[#1e3a2f]' : 'bg-[#f2f5ef] text-[#2f573b]'"
          >
            Turno: {{ isShiftOpen ? 'Abierto' : 'Cerrado' }}
          </span>
        </div>
      </div>
    </template>

    <div class="w-full overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-[#eef2e9] bg-[#eef2e9]/50">
            <th class="py-3 px-4 text-[13px] font-semibold text-[#1e3a2f]">Monedas / Billetes</th>
            <th class="py-3 px-4 text-[13px] font-semibold text-[#1e3a2f] text-center w-36">Cantidad</th>
            <th class="py-3 px-4 text-[13px] font-semibold text-[#1e3a2f] text-right">Dinero</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#eef2e9]">
          <tr 
            v-for="(item, index) in denominations" 
            :key="item.id"
            class="hover:bg-[#b8cfaa]/15 transition-colors"
          >
            <td class="py-2.5 px-4 text-[14px] font-medium text-[#1a2e1f]">
              {{ item.label }}
            </td>

            <td class="py-2.5 px-4 text-center">
              <InputNumber 
                ref="inputRefs"
                v-model="item.qty" 
                :min="0" 
                showButtons 
                buttonLayout="horizontal"
                class="inline-flex items-center justify-center w-full max-w-[140px]"
                inputClass="!w-14 text-center text-[14px] font-medium py-1 px-2 text-[#1a2e1f] border border-gray-300 rounded-none focus:ring-1 focus:ring-[#2b5e3b] min-w-[56px] box-border"
                inputStyle="width: 56px; min-width: 56px;"
                decrementButtonClass="p-button-secondary bg-[#eef2e9] text-[#1a2e1f] hover:bg-[#e2e8dd] w-8 h-8 border-none rounded-l-md shrink-0"
                incrementButtonClass="p-button-secondary bg-[#eef2e9] text-[#1a2e1f] hover:bg-[#e2e8dd] w-8 h-8 border-none rounded-r-md shrink-0"
                incrementButtonIcon="pi pi-plus text-xs"
                decrementButtonIcon="pi pi-minus text-xs"
                @keydown.enter.prevent="focusNextInput(index)"
              />
            </td>

            <td class="py-2.5 px-4 text-right text-[14px] font-semibold text-[#1a2e1f]">
              {{ formatCurrency(item.qty * item.value) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div class="flex flex-col">
          <span class="text-[14px] text-[#4b5563]">Total en Efectivo</span>
          <span class="text-[22px] font-bold text-[#2b5e3b]">
            {{ formatCurrency(totalCash) }}
          </span>
        </div>

        <Button 
          label="Abrir Venta" 
          icon="pi pi-lock-open"
          @click="handleOpenCash"
          class="!bg-[#1f482d] hover:bg-[#1f482d] text-white font-semibold text-[14px] px-6 py-2.5 rounded-lg border-none transition-colors shadow-sm cursor-pointer"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, onBeforeUpdate } from 'vue'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  isShiftOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'open-cash-register'])


const denominations = ref([
  { id: 'c1', label: '$0.01 (centavo)', value: 0.01, qty: 0 },
  { id: 'c5', label: '$0.05 (centavos)', value: 0.05, qty: 0 },
  { id: 'c10', label: '$0.10 (centavos)', value: 0.10, qty: 0 },
  { id: 'c25', label: '$0.25 (centavos)', value: 0.25, qty: 0 },
  { id: 'b1', label: '$1.00 (dólar)', value: 1.00, qty: 0 },
  { id: 'b5', label: '$5.00 (dólares)', value: 5.00, qty: 0 },
  { id: 'b10', label: '$10.00 (dólares)', value: 10.00, qty: 0 },
  { id: 'b20', label: '$20.00 (dólares)', value: 20.00, qty: 0 },
  { id: 'b50', label: '$50.00 (dólares)', value: 50.00, qty: 0 },
  { id: 'b100', label: '$100.00 (dólares)', value: 100.00, qty: 0 }
])


const inputRefs = ref([])

// Limpiar el arreglo de referencias
onBeforeUpdate(() => {
  inputRefs.value = []
})


const focusNextInput = (currentIndex) => {
  const nextIndex = currentIndex + 1
  
  if (nextIndex < denominations.value.length) {

    
    const nextComponent = inputRefs.value[nextIndex]
    if (nextComponent) {
      
      const inputElement = nextComponent.$el.querySelector('input')
      if (inputElement) {
        inputElement.focus()
        
      
      }
    }
  } else {
    
    document.activeElement?.blur()
  }
}

// Cálculo Reactivo del Total en Efectivo
const totalCash = computed(() => {
  return denominations.value.reduce((acc, item) => {
    return acc + (item.qty || 0) * item.value
  }, 0)
})


const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(val)
}

const handleOpenCash = () => {
  emit('open-cash-register', {
    total: totalCash.value,
    details: denominations.value
  })
}
</script>
