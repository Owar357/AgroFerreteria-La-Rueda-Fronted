<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="CIERRE DE CAJA"
    :style="{ width: '450px' }"
    :draggable="false"
    :pt="{
      root: { class: 'rounded-2xl overflow-hidden' },
      header: { class: '!bg-[#1e3a2f] !text-white !px-6 !py-5' },
      title: { class: '!text-white !font-semibold !text-sm !tracking-widest' },
      closeButton: { class: '!text-white hover:!bg-[#2b5e3b]' },
      content: { class: '!bg-white !px-6 !py-5' },
      footer: { class: '!bg-white !px-6 !py-4 !border-t !border-[#e8efe1]' }
    }"
    @hide="resetForm"
  >
    <div class="flex flex-col gap-5">

      <!-- Info -->
      <div class="flex items-start gap-3 bg-[#f0f7ee] rounded-xl p-4 border border-[#d4e6cc]">
        <i class="pi pi-info-circle text-[#2b5e3b] mt-0.5"></i>
        <p class="text-sm text-[#2b5e3b] m-0">
          Ingrese el monto REAL que hay en caja después de contar el efectivo. La diferencia se calculará automáticamente.
        </p>
      </div>

    >
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#1a2e1f]">
          Monto esperado (según movimientos)
        </label>
        <InputNumber
          :modelValue="montoEsperado"
          mode="currency"
          currency="USD"
          locale="es-US"
          disabled
          class="w-full"
          :pt="{ input: { class: 'w-full !bg-[#f2f5ef] !text-[#6b7280] !text-sm !h-11 !px-4 !rounded-lg !border-[#d1d5db]' } }"
        />
      </div>

      <!-- Monto real contado -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#1a2e1f]">
          Monto real en caja <span class="text-red-500">*</span>
        </label>
        <InputNumber
          v-model="montoReal"
          mode="currency"
          currency="USD"
          locale="es-US"
          :min="0"
          class="w-full"
          :pt="{ input: { class: 'w-full !bg-[#f9fafb] !text-[#1a2e1f] !text-sm !h-11 !px-4 !rounded-lg !border-[#d1d5db]' } }"
          placeholder="$0.00"
        />
        <small v-if="errorMonto" class="text-red-500 text-xs">{{ errorMonto }}</small>
      </div>

      <!-- Diferencia calculada en tiempo real -->
      <div class="flex items-start gap-3 bg-[#fefcf5] rounded-xl p-4 border border-[#e8efe1]">
        <i class="pi pi-chart-line text-[#e0b354] mt-0.5"></i>
        <div class="flex-1">
          <p class="text-sm font-medium text-[#1a2e1f]">Diferencia calculada</p>
          <p :class="['text-2xl font-bold', diferenciaCalculada === 0 ? 'text-gray-500' : (diferenciaCalculada > 0 ? 'text-green-700' : 'text-red-600')]">
            ${{ formatNumber(Math.abs(diferenciaCalculada)) }}
            <span class="text-sm ml-1">{{ diferenciaCalculada < 0 ? '(Faltante)' : (diferenciaCalculada > 0 ? '(Sobrante)' : '') }}</span>
          </p>
          <p class="text-xs text-gray-500 mt-1">{{ diferenciaCalculada === 0 ? 'Cuadra perfectamente' : (diferenciaCalculada < 0 ? 'Falta dinero' : 'Sobra dinero') }}</p>
        </div>
      </div>

    </div>

    <template #footer>
      <div class="flex gap-3 justify-end">
        <Button
          label="Cancelar"
          severity="secondary"
          text
          @click="localVisible = false"
          class="!rounded-lg"
        />
        <Button
          label="Cerrar turno"
          icon="pi pi-check-circle"
          :loading="cerrando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white !border-none !rounded-lg"
          @click="confirmarCierre"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

const props = defineProps({
  visible: { type: Boolean, default: false },
  montoEsperado: { type: Number, default: 0 }
})

const emit = defineEmits(['update:visible', 'cerrar'])

const localVisible = ref(false)
const cerrando = ref(false)
const montoReal = ref(null)
const errorMonto = ref('')

watch(() => props.visible, (val) => { localVisible.value = val })
watch(localVisible, (val) => { emit('update:visible', val) })

const resetForm = () => {
  montoReal.value = null
  errorMonto.value = ''
  cerrando.value = false
}

const diferenciaCalculada = computed(() => {
  if (montoReal.value === null) return 0
  return montoReal.value - props.montoEsperado
})

const formatNumber = (value) => value?.toFixed(2) ?? '0.00'

const confirmarCierre = () => {
  errorMonto.value = ''
  if (montoReal.value === null || montoReal.value < 0) {
    errorMonto.value = 'Ingrese un monto real válido (mayor o igual a 0).'
    return
  }
  cerrando.value = true
  // Pequeña simulación (puede ir una llamada async)
  setTimeout(() => {
    emit('cerrar', montoReal.value, diferenciaCalculada.value)
    localVisible.value = false
    cerrando.value = false
  }, 300)
}
</script>