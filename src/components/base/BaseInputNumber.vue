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
    default: 'xl',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v),
  },
  min: Number,
  max: Number,
  useGrouping: { type: Boolean, default: false },
  locale: { type: String, default: 'en-US' }, 
})

const model = defineModel()
const id = useId()

const sizes = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-11 px-4 text-[14px]',
  lg: 'h-12 px-4 text-[16px]',
  xl: 'h-14 px-5 text-[18px]'
}

const handleKeyDown = (e) => {
  const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Home', 'End']
  if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) return

  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault()
    return
  }

  const inputEl = e.target
  const start = inputEl.selectionStart
  const end = inputEl.selectionEnd
  const currentValue = inputEl.value || ''

  const cursorAlFinal = start === end && start === currentValue.length
  if (!cursorAlFinal) {
    e.preventDefault()
    return
  }

  const currentDigits = currentValue.replace(/[^0-9]/g, '')
  const futureDigits = currentDigits + e.key

  if (/^0[0-9]/.test(futureDigits)) {
    e.preventDefault()
    return
  }

  const parsedValue = parseInt(futureDigits, 10)
  if (props.max !== undefined && parsedValue > props.max) {
    e.preventDefault()
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
      :min="min"
      :max="max"
      :use-grouping="useGrouping"
      :locale="locale"
      :max-fraction-digits="0"
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