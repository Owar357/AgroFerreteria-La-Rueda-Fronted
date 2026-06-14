<template>
  <div
    class="w-64 h-screen flex flex-col p-6 flex-shrink-0 border-r border-[#162e1e]"
    style="background-color: #1e3a2f; font-family: 'Inter', sans-serif"
  >
    <div
      class="flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >

      <!-- ADMINISTRACIÓN — solo ADMIN -->
      <template v-if="isAdmin">
        <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em" class="mb-1.5 mx-1">
          ADMINISTRACIÓN
        </p>
        <SidebarItem icon="pi pi-users" label="Usuarios" :active="activeItem === 'usuarios'" @click="navigate('/admin/usuarios')" />
        <SidebarItem icon="pi pi-bell" label="Alertas" :active="activeItem === 'alertas'" @click="navigate('/admin/alertas')" class="mt-1" />
        <hr class="border-none border-t my-3" style="border-color: #162e1e" />
      </template>

      <!-- LOGÍSTICA — solo ADMIN -->
      <template v-if="isAdmin">
        <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em" class="mb-1.5 mx-1">
          LOGÍSTICA
        </p>
        <SidebarDropdown icon="pi pi-box" label="Inventario" :open="showInventario" :parentActive="inventarioActive" @toggle="toggleInventario">
          <SidebarItem icon="pi pi-th-large" label="Categorías" :active="activeItem === 'categorias'" @click="navigate('/admin/inventario/categorias')" sub />
          <SidebarItem icon="pi pi-tag" label="Productos" :active="activeItem === 'productos'" @click="navigate('/admin/inventario/productos')" sub />
          <SidebarItem icon="pi pi-truck" label="Proveedores" :active="activeItem === 'proveedores'" @click="navigate('/admin/inventario/proveedores')" sub />
        </SidebarDropdown>
        <hr class="border-none border-t my-3" style="border-color: #162e1e" />
      </template>

      <!-- OPERACIONES — ADMIN ve todo, CAJERO ve historial y clientes, CONTADOR ve compra -->
      <template v-if="isAdmin || isCajero || isContador">
        <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em" class="mb-1.5 mx-1">
          OPERACIONES
        </p>
        <SidebarDropdown icon="pi pi-sync" label="Procesos" :open="showProcesos" :parentActive="procesosActive" @toggle="toggleProcesos">
          <!-- Compra: solo ADMIN y CONTADOR -->
          <SidebarItem
            v-if="isAdmin || isContador"
            icon="pi pi-shopping-bag"
            label="Compra"
            :active="activeItem === 'compra'"
            @click="navigate('/admin/venta/compra')"
            sub
          />
          <!-- Historial ventas: solo ADMIN y CAJERO -->
          <SidebarItem
            v-if="isAdmin || isCajero"
            icon="pi pi-history"
            label="Historial Ventas"
            :active="activeItem === 'historial-ventas'"
            @click="navigate('/admin/procesos/historial-ventas')"
            sub
          />
          <!-- Clientes: todos -->
          <SidebarItem
            icon="pi pi-address-book"
            label="Clientes"
            :active="activeItem === 'clientes'"
            @click="navigate('/admin/procesos/clientes')"
            sub
          />
        </SidebarDropdown>
        <hr class="border-none border-t my-3" style="border-color: #162e1e" />
      </template>

      <!-- PUNTO DE VENTA — solo ADMIN y CAJERO -->
      <template v-if="isAdmin || isCajero">
        <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em" class="mb-1.5 mx-1">
          PUNTO DE VENTA
        </p>
        <SidebarDropdown icon="pi pi-sliders-h" label="Gestión" :open="showGestion" :parentActive="gestionActive" @toggle="toggleGestion">
          <SidebarItem icon="pi pi-wallet" label="Caja" :active="activeItem === 'caja'" @click="navigate('/admin/caja')" sub />
          <SidebarItem icon="pi pi-percentage" label="Movimientos de Caja" :active="activeItem === 'movimientos-caja'" @click="navigate('/admin/venta/movimientos-de-caja')" sub />
          <SidebarItem icon="pi pi-calculator" label="POS" :active="activeItem === 'pos'" @click="navigate('/admin/gestion/pos')" sub />
        </SidebarDropdown>
        <hr class="border-none border-t my-3" style="border-color: #162e1e" />
      </template>

      <!-- ESTADÍSTICAS — solo ADMIN y CONTADOR -->
      <template v-if="isAdmin || isContador">
        <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em" class="mb-1.5 mx-1">
          ESTADÍSTICAS
        </p>
        <SidebarItem icon="pi pi-chart-bar" label="Reportes" :active="activeItem === 'reportes'" @click="navigate('/admin/reportes')" />
      </template>

    </div>

    <!-- CERRAR SESIÓN -->
    <div class="mt-auto pt-4 pb-10 mb-4">
      <hr class="border-none border-t mb-3" style="border-color: #162e1e" />
      <SidebarItem icon="pi pi-sign-out" label="Cerrar sesión" :active="false" @click="handleLogout" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import authService from '@/services/authService'
import SidebarItem from '@/components/home/SidebarItem.vue'
import SidebarDropdown from '@/components/home/SidebarDropdown.vue'

const router = useRouter()
const route  = useRoute()

const showInventario = ref(false)
const showProcesos   = ref(false)
const showGestion    = ref(false)

const userRole   = authService.getUserRole()
const isAdmin    = userRole === 'ADMIN'
const isCajero   = userRole === 'CAJERO'
const isContador = userRole === 'CONTADOR'

const activeItem = computed(() => {
  if (route.path.includes('usuarios'))          return 'usuarios'
  if (route.path.includes('alertas'))           return 'alertas'
  if (route.path.includes('productos'))         return 'productos'
  if (route.path.includes('categorias'))        return 'categorias'
  if (route.path.includes('proveedores'))       return 'proveedores'
  if (route.path.includes('compra'))            return 'compra'
  if (route.path.includes('historial-ventas'))  return 'historial-ventas'
  if (route.path.includes('clientes'))          return 'clientes'
  if (route.path.includes('movimientos-de-caja')) return 'movimientos-caja'
  if (route.path.includes('caja'))              return 'caja'
  if (route.path.includes('pos'))               return 'pos'
  if (route.path.includes('reportes'))          return 'reportes'
  return 'dashboard'
})

const inventarioActive = computed(() => ['productos', 'categorias', 'proveedores'].includes(activeItem.value))
const procesosActive   = computed(() => ['compra', 'historial-ventas', 'clientes'].includes(activeItem.value))
const gestionActive    = computed(() => ['caja', 'movimientos-caja', 'pos'].includes(activeItem.value))

const toggleInventario = () => { showInventario.value = !showInventario.value }
const toggleProcesos   = () => { showProcesos.value   = !showProcesos.value   }
const toggleGestion    = () => { showGestion.value    = !showGestion.value    }

const navigate = (ruta) => router.push(ruta)

async function handleLogout() {
  await authService.logout()
  router.push('/login')
}
</script>