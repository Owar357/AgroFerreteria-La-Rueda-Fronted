<template>
  <div style="height: 100vh; display: flex; flex-direction: column;">

    <NavBar @toggleSidebar="sidebarOpen = !sidebarOpen" />

    <div style="flex: 1; display: flex; overflow: hidden;">

      <transition name="sidebar-slide">
        <SideBar v-if="sidebarOpen"  style="flex-shrink: 0;"/>
      </transition>

      <div style="flex: 1;min-width: 0;overflow-y: auto; background: #f5f5f5;">
        <router-view />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import NavBar from '@/components/shared/navbar.vue'
import SideBar from '@/components/home/SideBar.vue'

const sidebarOpen = ref(true)
const windowWidth = ref(window.innerWidth)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value < 768) {
    sidebarOpen.value = false
  }
}

onMounted(() => window.addEventListener('resize', updateWidth))
onUnmounted(() => window.removeEventListener('resize', updateWidth))
</script>

<style scoped>
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: width 0.25s ease, opacity 0.25s ease;
  overflow: hidden;
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  width: 0;
  opacity: 0;
}
.sidebar-slide-enter-to,
.sidebar-slide-leave-from {
  width: 256px;
  opacity: 1;
}
</style>