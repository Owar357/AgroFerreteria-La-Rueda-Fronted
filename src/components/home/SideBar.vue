<template>
  <div
    class="w-64 h-screen flex flex-col p-6 flex-shrink-0 border-r border-[#162e1e]"
    style="background-color: #1e3a2f; font-family: 'Inter', sans-serif;"
  >

    <template v-if="isAdmin">
      <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;" class="mb-1.5 mx-1">
        ADMINISTRACIÓN
      </p>

      <SidebarItem
        icon="pi pi-users"
        label="Usuarios"
        :active="activeItem === 'usuarios'"
        @click="navigate('/admin/usuarios')"
      />
      <hr class="border-none border-t my-3" style="border-color: #162e1e;" />
    </template>


    <template v-if="isAdmin || isContador">
      <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;" class="mb-1.5 mx-1">
        LOGÍSTICA
      </p>

      <SidebarDropdown
        icon="pi pi-box"
        label="Inventario"
        :open="showInventario"
        :parentActive="inventarioActive"
        @toggle="toggleInventario"
      >
        <SidebarItem icon="pi pi-th-large" label="Categorías" :active="activeItem === 'categorias'"  @click="navigate('/admin/inventario/categorias')" sub />
        <SidebarItem icon="pi pi-tag"       label="Productos"  :active="activeItem === 'productos'"   @click="navigate('/admin/inventario/productos')"  sub />
        <SidebarItem icon="pi pi-truck"     label="Proveedores" :active="activeItem === 'proveedores'" @click="navigate('/admin/inventario/proveedores')" sub />
      </SidebarDropdown>
      <hr class="border-none border-t my-3" style="border-color: #162e1e;" />
    </template>


    <template v-if="isAdmin || isCajero || isContador">
      <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;" class="mb-1.5 mx-1">
        OPERACIONES
      </p>

      <SidebarDropdown
        icon="pi pi-sync"
        label="Procesos"
        :open="showProcesos"
        :parentActive="procesosActive"
        @toggle="toggleProcesos"
      >
        <SidebarItem
          v-if="isAdmin || isContador"
          icon="pi pi-shopping-bag"
          label="Compra"
          :active="activeItem === 'compra'"
          @click="navigate('/admin/venta/compra')"
          sub
        />
        <SidebarItem
          icon="pi pi-history"
          label="Historial Ventas"
          :active="activeItem === 'historial-ventas'"
          @click="navigate('/admin/procesos/historial-ventas')"
          sub
        />
      </SidebarDropdown>
      <hr class="border-none border-t my-3" style="border-color: #162e1e;" />
    </template>


    <template v-if="isAdmin || isCajero">
      <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;" class="mb-1.5 mx-1">
        PUNTO DE VENTA
      </p>

      <SidebarDropdown
        icon="pi pi-sliders-h"
        label="Gestión"
        :open="showGestion"
        :parentActive="gestionActive"
        @toggle="toggleGestion"
      >
        <SidebarItem icon="pi pi-wallet"       label="Caja"            :active="activeItem === 'caja'"           @click="navigate('/admin/caja')"           sub />
        <SidebarItem icon="pi pi-percentage"   label="Movimiento Caja" :active="activeItem === 'movimiento-caja'" @click="navigate('/admin/gestion/movimiento-caja')" sub />
        <SidebarItem icon="pi pi-calculator"   label="POS"             :active="activeItem === 'pos'"             @click="navigate('/admin/gestion/pos')"             sub />
      </SidebarDropdown>
      <hr class="border-none border-t my-3" style="border-color: #162e1e;" />
    </template>


    <template v-if="isAdmin || isContador">
      <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;" class="mb-1.5 mx-1">
        ESTADÍSTICAS
      </p>

      <SidebarItem
        icon="pi pi-chart-bar"
        label="Reportes (Pendiente)"
        :active="activeItem === 'reportes'"
        class="opacity-60 cursor-not-allowed"
      />
    </template>


    <div class="mt-auto mb-8">
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
import SidebarItem     from '@/components/home/SidebarItem.vue'
import SidebarDropdown from '@/components/home/SidebarDropdown.vue'

const router = useRouter()
const route  = useRoute()

// Estados para controlar los menús desplegables
const showInventario = ref(false)
const showProcesos   = ref(false)
const showGestion    = ref(false)

// Mapeo dinámico y control de Roles
const userRole   = authService.getUserRole()
const isAdmin    = userRole === 'admin'
const isCajero   = userRole === 'cajero'
const isContador = userRole === 'contador'

// Determinar el ítem activo evaluando la URL actual del navegador
const activeItem = computed(() => {
  if (route.path.includes('usuarios'))        return 'usuarios'
  if (route.path.includes('productos'))       return 'productos'
  if (route.path.includes('categorias'))      return 'categorias'
  if (route.path.includes('proveedores'))     return 'proveedores'
  if (route.path.includes('compra'))          return 'compra'
  if (route.path.includes('historial-ventas')) return 'historial-ventas'
  if (route.path.includes('caja'))            return 'caja'
  if (route.path.includes('movimiento-caja')) return 'movimiento-caja'
  if (route.path.includes('pos'))             return 'pos'
  if (route.path.includes('reportes'))        return 'reportes'
  return 'dashboard'
})

// Mantiene iluminado el título del desplegable padre si un hijo está activo
const inventarioActive = computed(() =>
  ['productos', 'categorias', 'proveedores'].includes(activeItem.value)
)
const procesosActive = computed(() =>
  ['compra', 'historial-ventas'].includes(activeItem.value)
)
const gestionActive = computed(() =>
  ['caja', 'movimiento-caja', 'pos'].includes(activeItem.value)
)

// Funciones para abrir/cerrar desplegables
const toggleInventario = () => { showInventario.value = !showInventario.value }
const toggleProcesos   = () => { showProcesos.value   = !showProcesos.value }
const toggleGestion    = () => { showGestion.value    = !showGestion.value }

const navigate = (ruta) => { router.push(ruta) }

async function handleLogout() {
  await authService.logout()
  router.push('/login')
}
</script>