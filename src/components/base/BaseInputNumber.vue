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
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v),
  },
  suffix: String,
  prefix: String,
  min: Number,
  max: Number,
  minFractionDigits: Number,
  maxFractionDigits: Number,
  mode: String,
  currency: String,
  useGrouping: {
    type: Boolean,
    default: false,
  },
})

const model = defineModel()
const id = useId()

const sizes = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-11 px-4 text-[14px]',
  lg: 'h-12 px-4 text-[16px]',
  xl: 'h-14 px-5 text-[18px]',
}


const handleKeyDown = (e) => {
  // Permitir teclas de control (Borrar, flechas, tab, etc.)
  if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
    return
  }

  const inputEl = e.target
  const currentValue = inputEl.value || ''
  

  const start = inputEl.selectionStart
  const end = inputEl.selectionEnd
  const futureValue = currentValue.slice(0, start) + e.key + currentValue.slice(end)

 
  const cleanNumberText = futureValue.replace(/[^0-9.,-]/g, '').replace(',', '.')
  const parsedValue = parseFloat(cleanNumberText)

  // 1. Validar que sea un número válido
  if (isNaN(parsedValue)) {
    
    if ((e.key === '.' || e.key === ',') && !currentValue.includes('.') && !currentValue.includes(',')) {
      return
    }
    e.preventDefault()
    return
  }

 
  if (props.max !== undefined && parsedValue > props.max) {
    e.preventDefault()
    model.value = props.max
    return
  }


  const maxDecimals = props.maxFractionDigits !== undefined ? props.maxFractionDigits : 2
  if (cleanNumberText.includes('.')) {
    const decimalPlaces = cleanNumberText.split('.')[1].length
    if (decimalPlaces > maxDecimals) {
      e.preventDefault()
    }
  }
}


const handleInput = (e) => {
  const val = e.value
  if (val === null || val === undefined) return

  if (props.max !== undefined && val > props.max) {
    model.value = props.max
  }
  if (props.min !== undefined && val < props.min) {
    model.value = props.min
  }
}
</script>

<template>
  <div class="flex flex-col gap-2" :class="$attrs.class">
    <label v-if="label" :for="id" class="text-[14px] font-medium text-[#1a2e1f]">
      {{ label }}
    </label>

    <InputNumber
      :input-id="id"
      v-model="model"
      :placeholder="placeholder"
      :suffix="suffix"
      :prefix="prefix"
      :min="min"
      :max="max"
      :use-grouping="useGrouping"
      :min-fraction-digits="minFractionDigits"
      :max-fraction-digits="maxFractionDigits"
      :mode="mode"
      :currency="currency"
      v-bind="{ ...$attrs, class: undefined }"
      class="w-full"
      :input-class=" [
        'w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] rounded-lg transition-colors',
        sizes[size],
        { '!border-red-500 focus:!border-red-500': error },
      ]"
      @input="handleInput"
      @keydown="handleKeyDown"
    />

    <slot name="help">
      <small v-if="help" class="text-[13px] text-[#6b7280] leading-relaxed">{{ help }}</small>
    </slot>

    <small v-if="error" class="text-red-600 text-[12px] font-medium">{{ error }}</small>
  </div>
</template>
