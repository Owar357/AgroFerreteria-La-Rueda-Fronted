<template>
  <div
    class="w-64 h-screen flex flex-col p-6 flex-shrink-0 border-r border-[#162e1e]"
    style="background-color: #1e3a2f; font-family: 'Inter', sans-serif;"
  >

    <!--registro solso para el admin-->
    <template v-if="isAdmin">
      <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;" class="mb-1.5 mx-1">
        REGISTROS
      </p>

      <SidebarItem
        icon="pi pi-users"
        label="Usuarios"
        :active="activeItem === 'usuarios'"
        @click="navigate('/admin/usuarios')"
      />

      <SidebarDropdown
        icon="pi pi-box"
        label="Inventario"
        :open="showInventario"
        :parentActive="inventarioActive"
        @toggle="toggleInventario"
      >
        <SidebarItem icon="pi pi-tag"      label="Producto"  :active="activeItem === 'productos'"   @click="navigate('/admin/inventario/productos')"  sub />
        <SidebarItem icon="pi pi-th-large" label="Categoría" :active="activeItem === 'categorias'"  @click="navigate('/admin/inventario/categorias')" sub />
        <SidebarItem icon="pi pi-truck"    label="Proveedor" :active="activeItem === 'proveedores'" @click="navigate('/admin/inventario/proveedores')" sub />
      </SidebarDropdown>

      <hr class="border-none border-t my-3" style="border-color: #162e1e;" />
    </template>

    <!--roceso del admin mas el cajero-->
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
        <!-- Turno de caja: comentado hasta que exista la vista -->
        <!--
        <SidebarItem
          icon="pi pi-money-bill"
          label="Turno de caja"
          :active="activeItem === 'turno-caja'"
          @click="navigate('/admin/venta/turno-caja')"
          sub
        />
        -->

        <SidebarItem
          icon="pi pi-receipt"
          label="Venta"
          :active="activeItem === 'venta'"
          @click="navigate('/admin/venta/venta')"
          sub
        />

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

    <!--ese el sistema admion mas conydor-->
    <template v-if="isAdmin || isContador">
      <p style="color: #b8cfaa; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;" class="mb-1.5 mx-1">
        SISTEMA
      </p>

      <SidebarItem
        v-if="isContador"
        icon="pi pi-shopping-bag"
        label="Compra"
        :active="activeItem === 'compra'"
        @click="navigate('/admin/venta/compra')"
      />

      <SidebarItem
        icon="pi pi-file-pdf"
        label="Reportes"
        :active="activeItem === 'reportes'"
        @click="navigate('/admin/reportes')"
      />
    </template>

    <!--cerra la sesion-->
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

const showInventario = ref(false)
const showProcesos   = ref(false)

// Rol del usuario logueado
const userRole   = authService.getUserRole()
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

async function handleLogout() {
  await authService.logout()
  router.push('/login')
}
</script>