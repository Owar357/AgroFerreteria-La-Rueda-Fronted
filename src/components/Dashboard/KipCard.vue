<template>
  <div
    class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-5 flex flex-col gap-3 min-w-0"
    :class="clickable ? 'cursor-pointer hover:border-[#4A8C3F] transition-colors' : ''"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="clickable && emit('click')"
    @keydown.enter="clickable && emit('click')"
  >
    <div class="flex items-center justify-between gap-3">
      <span class="text-sm font-medium text-[#6b7280] leading-tight min-w-0">{{ title }}</span>
      <span
        class="w-[2.5rem] h-[2.5rem] min-w-[2.5rem] rounded-xl flex items-center justify-center shrink-0"
        :class="tonos[tone].icono"
      >
        <i :class="icon" class="text-lg"></i>
      </span>
    </div>

    <p class="text-3xl font-bold text-[#1a2e1f] m-0 truncate">{{ value }}</p>

    <div class="flex flex-wrap items-center gap-2 text-xs min-h-6">
      <template v-if="variacion !== undefined">
        <span
          v-if="variacion !== null"
          class="inline-flex items-center gap-1 px-2 py-1 rounded-md font-semibold"
          :class="claseVariacion"
        >
          <i :class="iconoVariacion" class="text-[0.65rem]"></i>
          {{ porcentaje(variacion) }}
        </span>
        <span v-if="variacion !== null" class="text-[#6b7280]">{{ comparacion }}</span>
        <span v-else class="text-[#9ca3af]">Aún sin datos para comparar</span>
      </template>
      <span v-if="hint" class="text-[#6b7280]">{{ hint }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { porcentaje } from '@/utils/formatters'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, required: true },
  tone: { type: String, default: 'green' },
  variacion: { type: Number, default: undefined },
  comparacion: { type: String, default: '' },
  hint: { type: String, default: '' },
  clickable: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

const tonos = {
  green: { icono: 'bg-[#e6f1e2] text-[#4A8C3F]' },
  blue: { icono: 'bg-[#e3f1fd] text-[#2196F3]' },
  yellow: { icono: 'bg-[#fbf0dc] text-[#D48A1A]' },
  red: { icono: 'bg-[#f9e5e2] text-[#C0392B]' },
}

const claseVariacion = computed(() => {
  if (props.variacion > 0) return 'bg-[#e6f1e2] text-[#2f6b27]'
  if (props.variacion < 0) return 'bg-[#f9e5e2] text-[#C0392B]'
  return 'bg-[#f1f3ef] text-[#6b7280]'
})

const iconoVariacion = computed(() => {
  if (props.variacion > 0) return 'pi pi-arrow-up'
  if (props.variacion < 0) return 'pi pi-arrow-down'
  return 'pi pi-minus'
})
</script>