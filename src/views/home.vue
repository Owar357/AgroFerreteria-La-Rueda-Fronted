<template>
  <div style="height: 100vh; display: flex; flex-direction: column;">

    <NavBar @toggleSidebar="sidebarOpen = !sidebarOpen" />

    <div style="flex: 1; display: flex; overflow: hidden;">

      <transition name="sidebar-slide">
        <SideBar v-if="sidebarOpen"  style="flex-shrink: 0;"/>
      </transition>

      <!-- Contenedor del contenido que ahora incluye el Footer -->
      <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #f5f5f5;">
        
        <!-- Zona con scroll exclusivo para las vistas -->
        <div style="flex: 1; overflow-y: auto;">
          <router-view />
        </div>

        <Footer />
        
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import NavBar from '@/components/shared/navbar.vue'
import SideBar from '@/components/home/SideBar.vue'
import Footer from '@/components/shared/Footer.vue' // <-- Asegúrate de crear e importar tu footer aquí

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
