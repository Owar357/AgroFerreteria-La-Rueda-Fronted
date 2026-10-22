<template>
  <!-- Contenedor principal global dinámico libre de scrolls hacia el navegador -->
  <div class="h-dvh max-h-screen overflow-hidden flex flex-col">
    <!-- Barra de navegación superior -->
    <NavBar @toggleSidebar="sidebarOpen = !sidebarOpen" />

    <!-- Cuerpo intermedio flexible -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Menú lateral izquierdo con transición responsiva -->
      <transition name="sidebar-slide">
        <SideBar v-if="sidebarOpen" class="shrink-0" />
      </transition>

      <!-- Contenedor central del contenido y el pie de página -->
      <div class="flex-1 flex flex-col overflow-hidden bg-transparent">
        <!-- Zona con scroll inteligente exclusivo para renderizar los 12 reportes -->
        <div class="flex-1 min-h-0 overflow-y-auto">
          <router-view />
        </div>

        <!-- Pie de página estático -->
        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import NavBar from '@/components/shared/navbar.vue'
import SideBar from '@/components/home/SideBar.vue'
import Footer from '@/components/shared/Footer.vue'

const sidebarOpen = ref(window.innerWidth >= 768)
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
  transition:
    width 0.25s ease,
    opacity 0.25s ease;
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
