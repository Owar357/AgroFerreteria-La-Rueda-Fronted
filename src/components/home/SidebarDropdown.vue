<template>
  <div>
    <div
      @click="$emit('toggle')"
      class="flex items-center justify-between p-3 rounded-lg cursor-pointer mb-1 transition-colors duration-150"
      :style="parentActive ? activeParentStyle : inactiveStyle"
      @mouseenter="e => { if (!parentActive) e.currentTarget.style.backgroundColor = '#b8cfaa20' }"
      @mouseleave="e => { if (!parentActive) e.currentTarget.style.backgroundColor = 'transparent' }"
    >
      <div class="flex items-center">
        <i :class="icon + ' mr-2'"></i>
        <span>{{ label }}</span>
      </div>
      <i :class="open ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" style="font-size:11px;"></i>
    </div>
    <transition name="slide">
      <div v-if="open" class="mb-1">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  icon:         String,
  label:        String,
  open:         Boolean,
  parentActive: Boolean,
})
defineEmits(['toggle'])

const activeParentStyle = {
  backgroundColor: 'transparent',
  color: '#e0b354',
  fontSize: '14px',
  fontWeight: '500',
}
const inactiveStyle = {
  backgroundColor: 'transparent',
  color: '#b8cfaa',
  fontSize: '14px',
  fontWeight: '500',
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 300px;
  opacity: 1;
}
</style>