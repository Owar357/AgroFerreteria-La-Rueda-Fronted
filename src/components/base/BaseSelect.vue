<script setup>
import { useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  label: String,
  placeholder: { type: String, default: 'Seleccionar' },
  options: { type: Array, default: () => [] },
  optionLabel: String, // sin default: si options es array de strings, se deja vacío
  optionValue: String, // sin default: idem
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v),
  },
  error: String,
})

const model = defineModel()
const id = useId()

const sizes = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-11 px-4 text-[14px]',
  lg: 'h-12 px-4 text-[16px]',
  xl: 'h-14 px-5 text-[18px]',
}
</script>

<template>
  <div class="flex flex-col gap-2" :class="$attrs.class">
    <label v-if="label" :for="id" class="text-[14px] font-medium text-[#1a2e1f]">
      {{ label }}
    </label>

    <Select
      :input-id="id"
      v-model="model"
      :options="options"
      :option-label="optionLabel"
      :option-value="optionValue"
      :placeholder="placeholder"
      :invalid="!!error"
      fluid
      v-bind="{ ...$attrs, class: undefined }"
      :pt="{
        root: { class: ['bg-[#f9fafb] border-[#d1d5db] rounded-lg', sizes[size]] },
      }"
    />

    <small v-if="error" class="text-red-600 text-[12px] font-medium">{{ error }}</small>
  </div>
</template>