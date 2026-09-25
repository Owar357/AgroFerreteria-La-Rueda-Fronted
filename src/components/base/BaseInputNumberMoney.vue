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
  min: { type: Number, default: 0.01 },
  max: { type: Number, default: 1000000.99 },
  currency: { type: String, default: 'USD' },
  locale: { type: String, default: 'en-US' },
})

const model = defineModel()
const id = useId()

const sizes = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-11 px-4 text-[14px]',
  lg: 'h-12 px-4 text-[16px]',
  xl: 'h-14 px-5 text-[18px]',
}

// Solo bloquea la tecla si haría que el número pasara del máximo.
// No toca el cursor ni el DOM: el navegador escribe donde ya iba a escribir.
const handleKeyDown = (e) => {
  if (!/^[0-9]$/.test(e.key)) return

  const inputEl = e.target
  const start = inputEl.selectionStart
  const end = inputEl.selectionEnd
  const currentValue = inputEl.value || ''

  const soloNumero = (texto) => texto.replace(/[^0-9.]/g, '')
  const antes = soloNumero(currentValue.slice(0, start))
  const despues = soloNumero(currentValue.slice(end))
  const futuro = antes + e.key + despues

  const parsed = parseFloat(futuro)
  if (!isNaN(parsed) && parsed > props.max) {
    e.preventDefault()
  }
}

const handleBlur = () => {
  if (model.value === null || model.value === undefined || model.value < props.min) {
    model.value = props.min
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
      mode="currency"
      :currency="currency"
      :locale="locale"
      :min="0"
      :min-fraction-digits="2"
      :max-fraction-digits="2"
      :use-grouping="true"
      v-bind="{ ...$attrs, class: undefined }"
      class="w-full"
      :input-class="[
        'w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] rounded-lg transition-colors',
        sizes[size],
        { '!border-red-500 focus:!border-red-500': error },
      ]"
      @keydown="handleKeyDown"
      @blur="handleBlur"
    />

    <slot name="help">
      <small v-if="help" class="text-[13px] text-[#6b7280] leading-relaxed">{{ help }}</small>
    </slot>

    <small v-if="error" class="text-red-600 text-[12px] font-medium">{{ error }}</small>
  </div>
</template>