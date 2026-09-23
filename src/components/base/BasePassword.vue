<script setup>
import { computed, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  label: String,
  placeholder: String,
  help: String, // <- Prop para mensajes sencillos
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v),
  },
  error: String,
  toggleMask: { type: Boolean, default: true },
  feedback: { type: Boolean, default: false },
})

const model = defineModel()
const id = useId()

const sizes = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-11 px-4 text-[14px]',
  lg: 'h-12 px-4 text-[16px]',
  xl: 'h-14 px-5 text-[18px]',
}

const inputClasses = computed(
  () =>
    `w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] rounded-lg ${sizes[props.size]} ` +
    (props.error ? 'border-red-500 focus:border-red-500' : ''),
)
</script>

<template>
  <div class="flex flex-col gap-2" :class="$attrs.class">
    <label v-if="label" :for="id" class="text-[14px] font-medium text-[#1a2e1f]">
      {{ label }}
    </label>

    <Password
      v-model="model"
      :input-id="id"
      :toggle-mask="toggleMask"
      :feedback="feedback"
      :placeholder="placeholder"
      :input-props="{ autocomplete: 'new-password' }"
      :input-class="inputClasses"
      class="w-full"
      v-bind="{ ...$attrs, class: undefined }"
    />

    <!-- Si se pasa la prop help, la muestra; si se usa el slot, muestra el slot -->
    <slot name="help">
      <small v-if="help" class="text-[13px] text-[#6b7280]">{{ help }}</small>
    </slot>

    <small v-if="error" class="text-red-600 text-[12px] font-medium">{{ error }}</small>
  </div>
</template>