<script setup>
import { useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  label: String,
  placeholder: String,
  help: String,
  error: String,
   size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl', 'responsive'].includes(v),
  },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 100 },
  minFractionDigits: { type: Number, default: 1 },
  maxFractionDigits: { type: Number, default: 2 },
  locale: { type: String, default: 'en-US' }, 
})

const model = defineModel()
const id = useId()

const sizes = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-11 px-4 text-[14px]',
  lg: 'h-12 px-4 text-[16px]',
  xl: 'h-14 px-5 text-[18px]',
  responsive: 'h-11 px-4 text-sm md:h-14 md:px-5 md:text-lg',
}

const soloNumero = (texto) => texto.replace(/[^0-9.]/g, '')

const handleKeyDown = (e) => {
  const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Home', 'End']
  if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) return

  const isDigit = /^[0-9]$/.test(e.key)
  const isDecimalKey = e.key === '.' || e.key === ','

  if (!isDigit && !isDecimalKey) {
    e.preventDefault()
    return
  }

  const inputEl = e.target
  const start = inputEl.selectionStart
  const end = inputEl.selectionEnd
  const currentValue = inputEl.value || ''

  const antes = soloNumero(currentValue.slice(0, start))
  const despues = soloNumero(currentValue.slice(end))

  if (isDecimalKey) {
    if (antes.includes('.') || despues.includes('.')) {
      e.preventDefault() // ya existe un punto, no se duplica
    }
    return
  }

  const futuro = antes + e.key + despues

  if (/^0[0-9]/.test(futuro)) {
    e.preventDefault()
    return
  }

  const parsed = parseFloat(futuro)
  if (isNaN(parsed)) {
    e.preventDefault()
    return
  }

  if (parsed > props.max) {
    e.preventDefault()
    return
  }

  if (futuro.includes('.')) {
    const decimalPart = futuro.split('.')[1]
    if (decimalPart && decimalPart.length > props.maxFractionDigits) {
      e.preventDefault()
    }
  }
}
</script>

<template>
  <div class="flex flex-col gap-2" :class="$attrs.class">
    <label v-if="label" :for="id" class="text-[14px] font-medium text-[#1a2e1f]">
      <span v-html="label"></span>
    </label>

   <InputNumber
  :input-id="id"
  v-model="model"
  :placeholder="placeholder"
  suffix="%"
  :locale="locale"
  :min="min"
  :max="max"
  :min-fraction-digits="minFractionDigits"
  :max-fraction-digits="maxFractionDigits"
  v-bind="{ ...$attrs, class: undefined }"
  class="w-full"
  :input-class="[
    'w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] rounded-lg transition-colors',
    sizes[size],
    { '!border-red-500 focus:!border-red-500': error },
  ]"
  @keydown="handleKeyDown"
/>

    <slot name="help">
      <small v-if="help" class="text-[13px] text-[#6b7280] leading-relaxed">{{ help }}</small>
    </slot>

    <small v-if="error" class="text-red-600 text-[12px] font-medium">{{ error }}</small>
  </div>
</template>