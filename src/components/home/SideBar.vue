<template>
  <div class="w-64 h-screen flex flex-col p-6 flex-shrink-0 bg-[#1C3A1A] border-r border-[#2a4a28] font-['Poppins',sans-serif]">

    <!-- Analíticas -->
    <div @click="navigate('/admin/estadistiscas')"
      class="flex items-center p-3 rounded-lg cursor-pointer mb-1 text-xl font-medium transition-colors duration-150"
      :class="activeItem === 'estadistiscas' ? 'text-[#EAEAEA]' : 'text-[#B0B0B0] hover:bg-[#2a4a28] hover:text-[#EAEAEA]'">
      <i class="pi pi-chart-bar mr-2"></i>
      <span>Analíticas</span>
    </div>

    <!-- Label REGISTROS -->
    <p class="text-[#6FAF65] text-xs font-semibold tracking-widest mt-4 mb-1.5 mx-1">REGISTROS</p>

    <!-- Usuarios -->
    <div @click="navigate('/admin/usuarios')"
      class="flex items-center p-3 rounded-lg cursor-pointer mb-1 text-xl font-medium transition-colors duration-150"
      :class="activeItem === 'usuarios' ? 'text-[#EAEAEA]' : 'text-[#B0B0B0] hover:bg-[#2a4a28] hover:text-[#EAEAEA]'">
      <i class="pi pi-users mr-2"></i>
      <span>Usuarios</span>
    </div>

    <!-- Desplegable: Inventario -->
    <div @click="toggleInventario"
      class="flex items-center justify-between p-3 rounded-lg cursor-pointer mb-1 text-xl font-medium transition-colors duration-150"
      :class="inventarioActive ? 'text-[#EAEAEA]' : 'text-[#B0B0B0] hover:bg-[#2a4a28] hover:text-[#EAEAEA]'">
      <div class="flex items-center">
        <i class="pi pi-box mr-2"></i>
        <span>Inventario</span>
      </div>
      <i :class="showInventario ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" class="text-xs"></i>
    </div>

    <transition name="slide">
      <div v-if="showInventario" class="ml-3 mb-1">
        <div @click="navigate('/admin/inventario/productos')"
          class="flex items-center p-2 rounded-lg cursor-pointer mb-1 text-base font-medium transition-colors duration-150"
          :class="activeItem === 'productos' ? 'text-[#EAEAEA]' : 'text-[#B0B0B0] hover:bg-[#2a4a28] hover:text-[#EAEAEA]'">
          <i class="pi pi-tag mr-2"></i>
          <span>Producto</span>
        </div>
        <div @click="navigate('/admin/inventario/categorias')"
          class="flex items-center p-2 rounded-lg cursor-pointer mb-1 text-base font-medium transition-colors duration-150"
          :class="activeItem === 'categorias' ? 'text-[#EAEAEA]' : 'text-[#B0B0B0] hover:bg-[#2a4a28] hover:text-[#EAEAEA]'">
          <i class="pi pi-th-large mr-2"></i>
          <span>Categoría</span>
        </div>
        <div @click="navigate('/admin/inventario/proveedores')"
          class="flex items-center p-2 rounded-lg cursor-pointer mb-1 text-base font-medium transition-colors duration-150"
          :class="activeItem === 'proveedores' ? 'text-[#EAEAEA]' : 'text-[#B0B0B0] hover:bg-[#2a4a28] hover:text-[#EAEAEA]'">
          <i class="pi pi-truck mr-2"></i>
          <span>Proveedor</span>
        </div>
      </div>
    </transition>

    <!-- Desplegable: Venta -->
    <div @click="toggleVenta"
      class="flex items-center justify-between p-3 rounded-lg cursor-pointer mb-1 text-xl font-medium transition-colors duration-150"
      :class="ventaActive ? 'text-[#EAEAEA]' : 'text-[#B0B0B0] hover:bg-[#2a4a28] hover:text-[#EAEAEA]'">
      <div class="flex items-center">
        <i class="pi pi-shopping-cart mr-2"></i>
        <span>Venta</span>
      </div>
      <i :class="showVenta ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" class="text-xs"></i>
    </div>

    <transition name="slide">
      <div v-if="showVenta" class="ml-3 mb-1">
        <div @click="navigate('/admin/venta/turno-caja')"
          class="flex items-center p-2 rounded-lg cursor-pointer mb-1 text-base font-medium transition-colors duration-150"
          :class="activeItem === 'turno-caja' ? 'text-[#EAEAEA]' : 'text-[#B0B0B0] hover:bg-[#2a4a28] hover:text-[#EAEAEA]'">
          <i class="pi pi-money-bill mr-2"></i>
          <span>Turno de caja</span>
        </div>
      </div>
    </transition>

    <!-- Divider -->
    <hr class="border-none border-t border-[#2a4a28] my-3" />

    <!-- Label SISTEMA -->
    <p class="text-[#6FAF65] text-xs font-semibold tracking-widest mt-2 mb-1.5 mx-1">SISTEMA</p>

    <!-- Reportes -->
    <div @click="navigate('/admin/reportes')"
      class="flex items-center p-3 rounded-lg cursor-pointer text-xl font-medium transition-colors duration-150"
      :class="activeItem === 'reportes' ? 'text-[#EAEAEA]' : 'text-[#B0B0B0] hover:bg-[#2a4a28] hover:text-[#EAEAEA]'">
      <i class="pi pi-file-pdf mr-2"></i>
      <span>Reportes</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const showInventario = ref(false)
const showVenta = ref(false)

const activeItem = computed(() => {
  if (route.path.includes('usuarios')) return 'usuarios'
  if (route.path.includes('productos')) return 'productos'
  if (route.path.includes('categorias')) return 'categorias'
  if (route.path.includes('proveedores')) return 'proveedores'
  if (route.path.includes('turno-caja')) return 'turno-caja'
  if (route.path.includes('reportes')) return 'reportes'
  return 'estadistiscas'
})

const inventarioActive = computed(() =>
  ['productos', 'categorias', 'proveedores'].includes(activeItem.value)
)

const ventaActive = computed(() =>
  ['turno-caja'].includes(activeItem.value)
)

const toggleInventario = () => {
  showInventario.value = !showInventario.value
}

const toggleVenta = () => {
  showVenta.value = !showVenta.value
}

const navigate = (ruta) => {
  router.push(ruta)
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
  max-height: 200px;
  opacity: 1;
}
</style>