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
    <i :class="icon + ' mr-2'"></i>
    <span>{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  active: Boolean,
  sub: { type: Boolean, default: false },
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
