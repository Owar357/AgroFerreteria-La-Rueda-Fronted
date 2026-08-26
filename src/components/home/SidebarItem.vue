<template>
  <div
    @click="$emit('click')"
    class="flex items-center rounded-lg cursor-pointer mb-1 transition-colors duration-150"
    :class="sub ? 'p-2 ml-3' : 'p-3'"
    :style="active ? activeStyle : inactiveStyle"
    @mouseenter="
      (e) => {
        if (!active) e.currentTarget.style.backgroundColor = '#b8cfaa20'
      }
    "
    @mouseleave="
      (e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent'
      }
    "
  >
    <span class="relative inline-flex mr-2">
      <i :class="icon"></i>
      <span
        v-if="badge > 0"
        class="absolute -top-1.5 -right-2 flex items-center justify-center bg-red-600 text-white text-[9px] font-bold rounded-full min-w-[15px] h-[15px] px-0.5 leading-none border-2"
        :style="{ borderColor: active ? '#e0b354' : '#1e3a2f' }"
      >
        {{ badge > 99 ? '99+' : badge }}
      </span>
    </span>
    <span>{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  active: Boolean,
  sub: { type: Boolean, default: false },
  badge: { type: Number, default: 0 },
})
defineEmits(['click'])

const activeStyle = {
  backgroundColor: '#e0b354',
  color: '#1e3a2f',
  fontSize: '14px',
  fontWeight: '500',
  borderRadius: '8px',
}
const inactiveStyle = {
  backgroundColor: 'transparent',
  color: '#b8cfaa',
  fontSize: '14px',
  fontWeight: '500',
}
</script>