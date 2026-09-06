<template>
  <div>
    <div
      @click="$emit('toggle')"
      :class="[
        'flex items-center justify-between p-3 rounded-lg cursor-pointer mb-1 transition-colors duration-150 text-[14px] font-medium',
        parentActive 
          ? 'bg-transparent text-[#e0b354] font-semibold' 
          : 'bg-transparent text-[#b8cfaa] hover:bg-[#b8cfaa]/10'
      ]"
    >
      <div class="flex items-center">
        <i :class="[icon, 'mr-2']"></i>
        <span>{{ label }}</span>
      </div>
      <i :class="open ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" class="text-[11px]"></i>
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
  icon: String,
  label: String,
  open: Boolean,
  parentActive: Boolean,
})
defineEmits(['toggle'])
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
