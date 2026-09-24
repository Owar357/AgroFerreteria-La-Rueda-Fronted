<script setup>
import { computed, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  label: String,
  placeholder: String,
  help: String, // <- Prop para mensajes sencillos
  filter: {
    type: String,
    validator: (v) => ['int', 'num', 'alpha', 'alphanum', 'percent'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v),
  },
  error: String,
})

const model = defineModel()
const id = useId()

const patterns = {
  int: /[0-9]/,
  num: /[0-9.\-]/,
  alpha: /[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]/,
  alphanum: /[A-Za-z0-9ÑñÁáÉéÍíÓóÚúÜü\s]/,
  percent: /[0-9.]/,
}

const pattern = computed(() => patterns[props.filter] ?? /[\s\S]/)

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

    <InputText
      :id="id"
      v-model="model"
      v-keyfilter="pattern"
      :placeholder="placeholder"
      v-bind="{ ...$attrs, class: undefined }"
      class="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] rounded-lg"
      :class="[sizes[size], { 'border-red-500 focus:border-red-500': error }]"
    />

    <!-- Si se pasa la prop help, la muestra; si se usa el slot, muestra el slot -->
    <slot name="help">
      <small v-if="help" class="text-[13px] text-[#6b7280]">{{ help }}</small>
    </slot>

    <small v-if="error" class="text-red-600 text-[12px] font-medium">{{ error }}</small>
  </div>
</template>