<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    :draggable="false"
    :closable="!loading"
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
          Apertura de venta
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

    <!-- Referencia del fondo fijo -->
    <div class="flex items-center gap-2 mb-4 px-4 py-3 rounded-lg bg-[#f2f5ef] border border-[#e2e8dd]">
      <i class="pi pi-info-circle text-[#2b5e3b]"></i>
      <span class="text-[13px] text-[#1e3a2f]">
        Cuenta el dinero heredado del turno anterior. El fondo fijo de operación es
        <strong>{{ formatCurrency(fondoFijoNumero) }}</strong>.
      </span>
    </div>

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
              {{ formatCurrency(((item.qty || 0) * item.cents) / 100) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Alerta crítica: el conteo no coincide con el fondo fijo -->
    <div
      v-if="requiereJustificacion"
      class="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 flex flex-col gap-3"
    >
      <div class="flex items-start gap-3">
        <i class="pi pi-exclamation-triangle text-red-600 text-[20px] mt-0.5"></i>
        <div class="flex flex-col gap-1">
          <span class="text-[14px] font-semibold text-red-700">
            El conteo no coincide con el fondo fijo
          </span>
          <span class="text-[13px] text-red-700">
            {{ mensajeAlerta }}
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[13px] font-medium text-[#1a2e1f]">
          Justificación de apertura <span class="text-red-500 text-[12px]">*Obligatorio</span>
        </label>
        <Textarea
          v-model="justificacion"
          :rows="3"
          :maxlength="500"
          placeholder="Ej: El turno anterior cerró incompleto por bajas ventas."
          class="w-full !text-[13px] !border-[#d1d5db] !rounded-lg resize-none"
          :class="{ '!border-red-500': !justificacion.trim() }"
        />
        <small class="text-[12px] text-[#6b7280] text-right">{{ justificacion.length }}/500</small>
      </div>
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
          label="Aperturar venta"
          icon="pi pi-lock-open"
          :loading="loading"
          :disabled="botonDeshabilitado"
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
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

const props = defineProps({
  visible: { type: Boolean, default: false },
  isShiftOpen: { type: Boolean, default: false },
  // Fondo fijo de operación (viene del backend en /caja/estado)
  fondoFijo: { type: [String, Number], default: '75.00' },
  // true mientras se envía la apertura al backend
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible', 'open-cash-register'])

// 'cents' evita errores de punto flotante: todo se suma en centavos enteros
const crearDenominaciones = () => [
  { id: 'c1', label: '$0.01 (centavo)', value: 0.01, cents: 1, qty: 0 },
  { id: 'c5', label: '$0.05 (centavos)', value: 0.05, cents: 5, qty: 0 },
  { id: 'c10', label: '$0.10 (centavos)', value: 0.1, cents: 10, qty: 0 },
  { id: 'c25', label: '$0.25 (centavos)', value: 0.25, cents: 25, qty: 0 },
  { id: 'b1', label: '$1.00 (dólar)', value: 1, cents: 100, qty: 0 },
  { id: 'b5', label: '$5.00 (dólares)', value: 5, cents: 500, qty: 0 },
  { id: 'b10', label: '$10.00 (dólares)', value: 10, cents: 1000, qty: 0 },
  { id: 'b20', label: '$20.00 (dólares)', value: 20, cents: 2000, qty: 0 },
  { id: 'b50', label: '$50.00 (dólares)', value: 50, cents: 5000, qty: 0 },
  { id: 'b100', label: '$100.00 (dólares)', value: 100, cents: 10000, qty: 0 },
]

const denominations = ref(crearDenominaciones())
const justificacion = ref('')

const inputRefs = ref([])

onBeforeUpdate(() => {
  inputRefs.value = []
})

const focusNextInput = (currentIndex) => {
  const nextComponent = inputRefs.value[currentIndex + 1]
  if (nextComponent) {
    nextComponent.$el.querySelector('input')?.focus()
  } else {
    document.activeElement?.blur()
  }
}

// --- Totales en centavos ---
const totalCents = computed(() =>
  denominations.value.reduce((acc, item) => acc + (item.qty || 0) * item.cents, 0),
)

const totalCash = computed(() => totalCents.value / 100)

const fondoFijoNumero = computed(() => parseFloat(props.fondoFijo) || 0)
const fondoFijoCents = computed(() => Math.round(fondoFijoNumero.value * 100))

// Si el conteo (menor o mayor) es distinto del fondo fijo, la justificación es obligatoria
const requiereJustificacion = computed(
  () => totalCents.value > 0 && totalCents.value !== fondoFijoCents.value,
)

const mensajeAlerta = computed(() => {
  const contado = formatCurrency(totalCash.value)
  const fondo = formatCurrency(fondoFijoNumero.value)

  return totalCents.value < fondoFijoCents.value
    ? `Contaste ${contado}, que es MENOR al fondo fijo de ${fondo}. Explica por qué la caja se abre con menos dinero.`
    : `Contaste ${contado}, que es MAYOR al fondo fijo de ${fondo}. Explica por qué la caja se abre con más dinero.`
})

const botonDeshabilitado = computed(
  () =>
    props.loading ||
    totalCents.value <= 0 ||
    (requiereJustificacion.value && !justificacion.value.trim()),
)

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(val)
}

const handleOpenCash = () => {
  if (botonDeshabilitado.value) return

  emit('open-cash-register', {
    total: totalCash.value,
    details: denominations.value,
    // Formato que espera el backend: { c1: 0, c5: 2, ..., b100: 1 }
    denominaciones: Object.fromEntries(denominations.value.map((d) => [d.id, d.qty || 0])),
    justificacion: requiereJustificacion.value ? justificacion.value.trim() : '',
  })
}

// El padre lo llama tras una apertura exitosa para que el siguiente conteo empiece en cero
const reset = () => {
  denominations.value = crearDenominaciones()
  justificacion.value = ''
}

defineExpose({ reset })
</script>