<template>
  <div
    class="w-64 h-screen flex flex-col p-6 flex-shrink-0 border-r border-[#162e1e]"
    style="background-color: #1e3a2f; font-family: 'Inter', sans-serif;"
  >

    <!-- ── REGISTROS (solo admin) ─────────────────────────────────── -->
    <template v-if="isAdmin">
      <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;" class="mb-1.5 mx-1">
        REGISTROS
      </p>

      <!-- Usuarios -->
      <SidebarItem
        icon="pi pi-users"
        label="Usuarios"
        :active="activeItem === 'usuarios'"
        @click="navigate('/admin/usuarios')"
      />

      <!-- Inventario (desplegable) -->
      <SidebarDropdown
        icon="pi pi-box"
        label="Inventario"
        :open="showInventario"
        :parentActive="inventarioActive"
        @toggle="toggleInventario"
      >
        <SidebarItem icon="pi pi-tag"     label="Producto"   :active="activeItem === 'productos'"   @click="navigate('/admin/inventario/productos')" sub />
        <SidebarItem icon="pi pi-th-large" label="Categoría" :active="activeItem === 'categorias'"  @click="navigate('/admin/inventario/categorias')" sub />
        <SidebarItem icon="pi pi-truck"   label="Proveedor"  :active="activeItem === 'proveedores'" @click="navigate('/admin/inventario/proveedores')" sub />
      </SidebarDropdown>

      <hr class="border-none border-t my-3" style="border-color: #162e1e;" />
    </template>

    <!-- ── PROCESOS (admin + cajero) ──────────────────────────────── -->
    <template v-if="isAdmin || isCajero">
      <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;" class="mb-1.5 mx-1">
        PROCESOS
      </p>

      <SidebarDropdown
        icon="pi pi-shopping-cart"
        label="Procesos"
        :open="showProcesos"
        :parentActive="procesosActive"
        @toggle="toggleProcesos"
      >
        <!-- Turno de caja: admin + cajero -->
        <SidebarItem
          icon="pi pi-money-bill"
          label="Turno de caja"
          :active="activeItem === 'turno-caja'"
          @click="navigate('/admin/venta/turno-caja')"
          sub
        />
        <!-- Venta: admin + cajero -->
        <SidebarItem
          icon="pi pi-receipt"
          label="Venta"
          :active="activeItem === 'venta'"
          @click="navigate('/admin/venta/venta')"
          sub
        />
        <!-- Compra: solo admin (el contador lo ve en SISTEMA) -->
        <SidebarItem
          v-if="isAdmin"
          icon="pi pi-shopping-bag"
          label="Compra"
          :active="activeItem === 'compra'"
          @click="navigate('/admin/venta/compra')"
          sub
        />
      </SidebarDropdown>

      <hr class="border-none border-t my-3" style="border-color: #162e1e;" />
    </template>

    <!-- ── SISTEMA (admin + contador) ─────────────────────────────── -->
    <template v-if="isAdmin || isContador">
      <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;" class="mb-1.5 mx-1">
        SISTEMA
      </p>

      <!-- Compra (visible para contador aquí) -->
      <SidebarItem
        v-if="isContador"
        icon="pi pi-shopping-bag"
        label="Compra"
        :active="activeItem === 'compra'"
        @click="navigate('/admin/venta/compra')"
      />

      <!-- Reportes -->
      <SidebarItem
        icon="pi pi-file-pdf"
        label="Reportes"
        :active="activeItem === 'reportes'"
        @click="navigate('/admin/reportes')"
      />
    </template>

    <!-- ── CERRAR SESIÓN (todos) ───────────────────────────────────── -->
    <div class="mt-auto">
      <hr class="border-none border-t mb-3" style="border-color: #162e1e;" />
      <SidebarItem
        icon="pi pi-sign-out"
        label="Cerrar sesión"
        :active="false"
        @click="handleLogout"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import authService from '@/services/authService'

// ── Sub-componentes inline ─────────────────────────────────────────────────────
// SidebarItem
const SidebarItem = {
  props: {
    icon:   String,
    label:  String,
    active: Boolean,
    sub:    { type: Boolean, default: false },
  },
  emits: ['click'],
  template: `
    <div
      @click="$emit('click')"
      class="flex items-center rounded-lg cursor-pointer mb-1 transition-colors duration-150"
      :class="sub ? 'p-2 ml-3' : 'p-3'"
      :style="active ? activeStyle : inactiveStyle"
      @mouseenter="e => { if (!active) e.currentTarget.style.backgroundColor = '#b8cfaa20' }"
      @mouseleave="e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }"
    >
      <i :class="icon + ' mr-2'"></i>
      <span>{{ label }}</span>
    </div>
  `,
  setup(props) {
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
    return { activeStyle, inactiveStyle }
  },
}

// SidebarDropdown
const SidebarDropdown = {
  props: {
    icon:         String,
    label:        String,
    open:         Boolean,
    parentActive: Boolean,
  },
  emits: ['toggle'],
  template: `
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
  `,
  setup() {
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
    return { activeParentStyle, inactiveStyle }
  },
}

// ── Lógica principal ───────────────────────────────────────────────────────────
const router = useRouter()
const route  = useRoute()

const showInventario = ref(false)
const showProcesos   = ref(false)

// Rol del usuario logueado
const userRole   = authService.getUserRole() // 'admin' | 'cajero' | 'contador'
const isAdmin    = userRole === 'admin'
const isCajero   = userRole === 'cajero'
const isContador = userRole === 'contador'

// Item activo según la ruta actual
const activeItem = computed(() => {
  const p = route.path
  if (p.includes('usuarios'))    return 'usuarios'
  if (p.includes('productos'))   return 'productos'
  if (p.includes('categorias'))  return 'categorias'
  if (p.includes('proveedores')) return 'proveedores'
  if (p.includes('turno-caja'))  return 'turno-caja'
  if (p.includes('compra'))      return 'compra'
  if (p.includes('venta'))       return 'venta'
  if (p.includes('reportes'))    return 'reportes'
  return ''
})

const inventarioActive = computed(() =>
  ['productos', 'categorias', 'proveedores'].includes(activeItem.value)
)
const procesosActive = computed(() =>
  ['turno-caja', 'venta', 'compra'].includes(activeItem.value)
)

const toggleInventario = () => { showInventario.value = !showInventario.value }
const toggleProcesos   = () => { showProcesos.value   = !showProcesos.value }

const navigate = (ruta) => { router.push(ruta) }

// Logout
async function handleLogout() {
  await authService.logout()
  router.push('/login')
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