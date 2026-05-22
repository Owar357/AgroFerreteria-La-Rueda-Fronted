<template>
  <div class="w-64 h-screen flex flex-col p-6 flex-shrink-0 border-r border-[#162e1e]"
    style="background-color: #1e3a2f; font-family: 'Inter', sans-serif;">

    <!-- Analíticas -->
    <div @click="navigate('/admin/estadistiscas')"
      class="flex items-center p-3 rounded-lg cursor-pointer mb-1 transition-colors duration-150"
      :style="activeItem === 'estadistiscas' ? activeStyle : inactiveStyle"
      @mouseenter="e => { if (activeItem !== 'estadistiscas') e.currentTarget.style.backgroundColor = '#b8cfaa20' }"
      @mouseleave="e => { if (activeItem !== 'estadistiscas') e.currentTarget.style.backgroundColor = 'transparent' }">
      <i class="pi pi-chart-bar mr-2"></i>
      <span>Analíticas</span>
    </div>

    <!-- Label REGISTROS -->
    <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;" class="mt-4 mb-1.5 mx-1">REGISTROS</p>

    <!-- Usuarios -->
    <div @click="navigate('/admin/usuarios')"
      class="flex items-center p-3 rounded-lg cursor-pointer mb-1 transition-colors duration-150"
      :style="activeItem === 'usuarios' ? activeStyle : inactiveStyle"
      @mouseenter="e => { if (activeItem !== 'usuarios') e.currentTarget.style.backgroundColor = '#b8cfaa20' }"
      @mouseleave="e => { if (activeItem !== 'usuarios') e.currentTarget.style.backgroundColor = 'transparent' }">
      <i class="pi pi-users mr-2"></i>
      <span>Usuarios</span>
    </div>

    <!-- Desplegable: Inventario -->
    <div @click="toggleInventario"
      class="flex items-center justify-between p-3 rounded-lg cursor-pointer mb-1 transition-colors duration-150"
      :style="inventarioActive ? activeParentStyle : inactiveStyle"
      @mouseenter="e => { if (!inventarioActive) e.currentTarget.style.backgroundColor = '#b8cfaa20' }"
      @mouseleave="e => { if (!inventarioActive) e.currentTarget.style.backgroundColor = 'transparent' }">
      <div class="flex items-center">
        <i class="pi pi-box mr-2"></i>
        <span>Inventario</span>
      </div>
      <i :class="showInventario ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" style="font-size: 11px;"></i>
    </div>

    <transition name="slide">
      <div v-if="showInventario" class="ml-3 mb-1">
        <div @click="navigate('/admin/inventario/productos')"
          class="flex items-center p-2 rounded-lg cursor-pointer mb-1 transition-colors duration-150"
          :style="activeItem === 'productos' ? activeStyle : inactiveStyle"
          @mouseenter="e => { if (activeItem !== 'productos') e.currentTarget.style.backgroundColor = '#b8cfaa20' }"
          @mouseleave="e => { if (activeItem !== 'productos') e.currentTarget.style.backgroundColor = 'transparent' }">
          <i class="pi pi-tag mr-2"></i>
          <span>Producto</span>
        </div>
        <div @click="navigate('/admin/inventario/categorias')"
          class="flex items-center p-2 rounded-lg cursor-pointer mb-1 transition-colors duration-150"
          :style="activeItem === 'categorias' ? activeStyle : inactiveStyle"
          @mouseenter="e => { if (activeItem !== 'categorias') e.currentTarget.style.backgroundColor = '#b8cfaa20' }"
          @mouseleave="e => { if (activeItem !== 'categorias') e.currentTarget.style.backgroundColor = 'transparent' }">
          <i class="pi pi-th-large mr-2"></i>
          <span>Categoría</span>
        </div>
        <div @click="navigate('/admin/inventario/proveedores')"
          class="flex items-center p-2 rounded-lg cursor-pointer mb-1 transition-colors duration-150"
          :style="activeItem === 'proveedores' ? activeStyle : inactiveStyle"
          @mouseenter="e => { if (activeItem !== 'proveedores') e.currentTarget.style.backgroundColor = '#b8cfaa20' }"
          @mouseleave="e => { if (activeItem !== 'proveedores') e.currentTarget.style.backgroundColor = 'transparent' }">
          <i class="pi pi-truck mr-2"></i>
          <span>Proveedor</span>
        </div>
      </div>
    </transition>

    <!-- Desplegable: Procesos -->
    <div @click="toggleProcesos"
      class="flex items-center justify-between p-3 rounded-lg cursor-pointer mb-1 transition-colors duration-150"
      :style="procesosActive ? activeParentStyle : inactiveStyle"
      @mouseenter="e => { if (!procesosActive) e.currentTarget.style.backgroundColor = '#b8cfaa20' }"
      @mouseleave="e => { if (!procesosActive) e.currentTarget.style.backgroundColor = 'transparent' }">
      <div class="flex items-center">
        <i class="pi pi-shopping-cart mr-2"></i>
        <span>Procesos</span>
      </div>
      <i :class="showProcesos ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" style="font-size: 11px;"></i>
    </div>

    <transition name="slide">
      <div v-if="showProcesos" class="ml-3 mb-1">

        <!-- Turno de caja -->
        <div @click="navigate('/admin/venta/turno-caja')"
          class="flex items-center p-2 rounded-lg cursor-pointer mb-1 transition-colors duration-150"
          :style="activeItem === 'turno-caja' ? activeStyle : inactiveStyle"
          @mouseenter="e => { if (activeItem !== 'turno-caja') e.currentTarget.style.backgroundColor = '#b8cfaa20' }"
          @mouseleave="e => { if (activeItem !== 'turno-caja') e.currentTarget.style.backgroundColor = 'transparent' }">
          <i class="pi pi-money-bill mr-2"></i>
          <span>Turno de caja</span>
        </div>

        <!-- Venta -->
        <div @click="navigate('/admin/venta/venta')"
          class="flex items-center p-2 rounded-lg cursor-pointer mb-1 transition-colors duration-150"
          :style="activeItem === 'venta' ? activeStyle : inactiveStyle"
          @mouseenter="e => { if (activeItem !== 'venta') e.currentTarget.style.backgroundColor = '#b8cfaa20' }"
          @mouseleave="e => { if (activeItem !== 'venta') e.currentTarget.style.backgroundColor = 'transparent' }">
          <i class="pi pi-receipt mr-2"></i>
          <span>Venta</span>
        </div>

        <!-- Compra -->
        <div @click="navigate('/admin/venta/compra')"
          class="flex items-center p-2 rounded-lg cursor-pointer mb-1 transition-colors duration-150"
          :style="activeItem === 'compra' ? activeStyle : inactiveStyle"
          @mouseenter="e => { if (activeItem !== 'compra') e.currentTarget.style.backgroundColor = '#b8cfaa20' }"
          @mouseleave="e => { if (activeItem !== 'compra') e.currentTarget.style.backgroundColor = 'transparent' }">
          <i class="pi pi-shopping-bag mr-2"></i>
          <span>Compra</span>
        </div>

      </div>
    </transition>

    <!-- Divider -->
    <hr class="border-none border-t my-3" style="border-color: #162e1e;" />

    <!-- Label SISTEMA -->
    <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;" class="mt-2 mb-1.5 mx-1">SISTEMA</p>

    <!-- Reportes -->
    <div @click="navigate('/admin/reportes')"
      class="flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-150"
      :style="activeItem === 'reportes' ? activeStyle : inactiveStyle"
      @mouseenter="e => { if (activeItem !== 'reportes') e.currentTarget.style.backgroundColor = '#b8cfaa20' }"
      @mouseleave="e => { if (activeItem !== 'reportes') e.currentTarget.style.backgroundColor = 'transparent' }">
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
const showProcesos = ref(false)

// ── Estilos según guía ────────────────────────────────────────────────────────

// Item activo: fondo dorado, texto oscuro, 14px / 500
const activeStyle = {
  backgroundColor: '#e0b354',
  color: '#1e3a2f',
  fontSize: '14px',
  fontWeight: '500',
  borderRadius: '8px',
}

// Item activo padre (Inventario / Procesos abiertos pero no seleccionados)
const activeParentStyle = {
  backgroundColor: 'transparent',
  color: '#e0b354',
  fontSize: '14px',
  fontWeight: '500',
}

// Item inactivo: texto claro, 14px / 500
const inactiveStyle = {
  backgroundColor: 'transparent',
  color: '#b8cfaa',
  fontSize: '14px',
  fontWeight: '500',
}

// ── Lógica de ruta activa ─────────────────────────────────────────────────────
const activeItem = computed(() => {
  if (route.path.includes('usuarios'))    return 'usuarios'
  if (route.path.includes('productos'))   return 'productos'
  if (route.path.includes('categorias'))  return 'categorias'
  if (route.path.includes('proveedores')) return 'proveedores'
  if (route.path.includes('turno-caja'))  return 'turno-caja'
   if (route.path.includes('compra'))      return 'compra'
  if (route.path.includes('venta'))       return 'venta'
  if (route.path.includes('reportes'))    return 'reportes'
  return 'estadistiscas'
})

const inventarioActive = computed(() =>
  ['productos', 'categorias', 'proveedores'].includes(activeItem.value)
)

const procesosActive = computed(() =>
  ['turno-caja', 'venta', 'compra'].includes(activeItem.value)
)

const toggleInventario = () => { showInventario.value = !showInventario.value }
const toggleProcesos   = () => { showProcesos.value   = !showProcesos.value   }

const navigate = (ruta) => { router.push(ruta) }
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