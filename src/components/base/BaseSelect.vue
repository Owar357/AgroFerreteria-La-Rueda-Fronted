<script setup>
import { useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  label: String,
  placeholder: { type: String, default: 'Seleccionar' },
  options: { type: Array, default: () => [] },
  optionLabel: String, 
  optionValue: String, 
   size: {
    type: String,
    default: 'xl',
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
  xl: 'h-14 px-5 text-[18px]'
}
</script>

<template>
  <div class="flex flex-col gap-2" :class="$attrs.class">
    <label v-if="label" :for="id" class="text-[14px] font-medium text-[#1a2e1f]">
  <span v-html="label"></span>
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
    root: { class: ['bg-[#f9fafb] border-[#d1d5db] rounded-lg flex items-center', sizes[size]] },
    label: { class: 'flex items-center !py-0 !my-0 truncate' },
  }"
/>

    <small v-if="error" class="text-red-600 text-[12px] font-medium">{{ error }}</small>
  </div>
</template>