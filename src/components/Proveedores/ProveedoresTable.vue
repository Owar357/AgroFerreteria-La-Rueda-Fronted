<template>
  <div class="bg-[#eef2e9] min-h-screen p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <!-- ENCABEZADO DE MÓDULO UNIFICADO -->
    <div class="flex items-center gap-3 mb-6">
      <div
        class="!w-10 !h-10 rounded-xl bg-white border border-[#e2e8dd] shadow-sm flex items-center justify-center shrink-0">
        <i class="pi pi-users text-[#2b5e3b] text-xl "></i>
      </div>
      <div>
        <h1 class="text-[28px] md:text-[32px] font-bold text-[#1a2e1f] leading-tight m-0">
          Registro de Proveedores
        </h1>
        <p class="text-[14px] text-gray-500 mt-0.5 m-0">Gestión de contactos, directorio y comerciales</p>
      </div>
    </div>

    <!-- TARJETA CONTENEDORA PRINCIPAL (ESTÁNDAR) -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm overflow-hidden">

      <!-- BARRA DE HERRAMIENTAS Y FILTROS REAJUSTADA -->
      <div
        class="p-5 border-b border-[#e2e8dd] bg-[#fbfdf9] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">

          
          <IconField class="w-[600px] flex items-center">
            <InputIcon class="pi pi-search text-gray-400 text-sm ml-1" />
            <InputText v-model="filters['global'].value" placeholder="Buscar por nombre o correo..."
              class="w-full !bg-white h-[40px] !border-gray-300 !text-[#1a2e1f] !text-sm rounded-xl !py-2.5 !pl-10 !pr-3.5 focus:!border-[#2b5e3b] shadow-xs" />
          </IconField>

          <!-- SELECTOR DE ESTADOS LIGERAMENTE MÁS ANCHO -->
          <Select v-model="filtroEstado" :options="estadoOptions" optionLabel="label" optionValue="value" showClear
            placeholder="Todos los estados"
            class="w-full sm:w-60 !bg-white h-[40px] !border-gray-300 !text-[#1a2e1f] !text-sm rounded-xl flex items-center focus:!border-[#2b5e3b] shadow-xs"
            :pt="{
              root: { class: '!py-0.5' }
            }" />
        </div>

        <!-- BOTÓN AGREGAR PROVEEDOR -->
        <Button label="Agregar Proveedor" icon="pi pi-plus"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white text-sm font-semibold !px-6 !py-2.5 rounded-xl !border-none cursor-pointer shadow-sm transition-all shrink-0"
          @click="$emit('open-add')" />
      </div>

      <!-- TABLA DE DATOS DE PROVEEDORES -->
      <DataTable :value="loading ? Array.from({ length: 5 }) : proveedoresFiltrados" :lazy="false"
        :totalRecords="totalProveedores" v-model:filters="filters" :globalFilterFields="['nombre', 'correo']"
        responsiveLayout="scroll" class="p-datatable-sm" :paginator="!loading" :rows="7"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} proveedores"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport">
        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-gray-400">
            <i class="pi pi-inbox text-[48px] mb-3 text-gray-300" />
            <span class="text-[15px] font-medium">No hay proveedores registrados</span>
          </div>
        </template>

        <!-- Columna: Nombre -->
        <Column field="nombre" header="Nombre" class="text-sm font-semibold text-[#1a2e1f] capitalize">
          <template #body="slotProps">
            <Skeleton v-if="loading" width="70%" height="1.2rem" />
            <span v-else>{{ slotProps.data.nombre }}</span>
          </template>
        </Column>

        <!-- Columna: Correo -->
        <Column field="correo" header="Correo" class="text-sm text-gray-600">
          <template #body="slotProps">
            <Skeleton v-if="loading" width="80%" height="1.2rem" />
            <span v-else>{{ slotProps.data.correo || '—' }}</span>
          </template>
        </Column>

        <!-- Columna: Teléfono -->
        <Column field="telefono" header="Teléfono" class="text-sm text-gray-600 font-mono">
          <template #body="slotProps">
            <Skeleton v-if="loading" width="50%" height="1.2rem" />
            <span v-else>{{ slotProps.data.telefono || '—' }}</span>
          </template>
        </Column>

        <!-- Columna: Estado -->
        <Column field="estado" header="Estado" class="text-sm">
          <template #body="slotProps">
            <Skeleton v-if="loading" width="5rem" height="1.4rem" borderRadius="20px" />
            <Tag v-else :value="slotProps.data.activo ? 'ACTIVO' : 'INACTIVO'"
              :severity="slotProps.data.activo ? 'success' : 'danger'" rounded class="!text-xs !px-2.5" />
          </template>
        </Column>

        <!-- Columna: Acciones -->
        <Column header="Acciones" class="text-sm">
          <template #body="slotProps">
            <div class="flex items-center gap-1.5 flex-wrap">
              <template v-if="loading">
                <Skeleton width="4.5rem" height="2rem" borderRadius="8px" />
                <Skeleton width="3.5rem" height="2rem" borderRadius="8px" />
              </template>

              <template v-else>
                <template v-if="slotProps.data.activo">
                  <Button icon="pi pi-pencil" label="Editar"
                    class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer"
                    v-tooltip.top="'Editar proveedor'" @click="handleEdit(slotProps.data)" />

                  <Button icon="pi pi-eye" label="Ver"
                    class="!bg-white hover:!bg-[#eef2e9] !text-[#1e3a2f] !border !border-[#cfe0d2] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer"
                    v-tooltip.top="'Ver detalles'" @click="handleDetail(slotProps.data)" />

                  <Button icon="pi pi-ban" label="Desactivar"
                    class="!bg-white hover:!bg-[#fde8e8] !text-[#9c2a2a] !border !border-[#f0c9c9] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer"
                    v-tooltip.top="'Desactivar proveedor'" @click="confirmarDesactivar(slotProps.data)" />
                </template>

                <template v-else>
                  <Button icon="pi pi-eye" label="Ver"
                    class="!bg-white hover:!bg-[#eef2e9] !text-[#1e3a2f] !border !border-[#cfe0d2] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer"
                    v-tooltip.top="'Ver detalles'" @click="handleDetail(slotProps.data)" />
                </template>
              </template>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { Select } from 'primevue'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useProveedorStore } from '@/stores/proveedorStore'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'

const emit = defineEmits(['open-add', 'open-edit', 'open-detail'])

const store = useProveedorStore()
const { proveedores, cargando: loading, totalRecords: totalProveedores } = storeToRefs(store)

const estadoOptions = ref([
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false },
])

const filtroEstado = ref(null)

const filters = ref({
  global: { value: null, matchMode: 'contains' },
})

const proveedoresFiltrados = computed(() => {
  const lista = proveedores.value ?? []

  return lista.filter((p) => {
    const textoBusqueda = filters.value.global.value?.toLowerCase() || ''
    const coincideBusqueda =
      !textoBusqueda ||
      p.nombre?.toLowerCase().includes(textoBusqueda) ||
      p.correo?.toLowerCase().includes(textoBusqueda)

    const coincideEstado =
      filtroEstado.value === null || filtroEstado.value === undefined
        ? true
        : p.activo === filtroEstado.value

    return coincideBusqueda && coincideEstado
  })
})

onMounted(async () => {
  const resultado = await store.cargarProveedores()
  if (resultado?.status === 403) {
    Swal.fire({
      html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
          <div style="width:56px; height:56px; border-radius:50%; background:#fee2e2; display:flex; align-items:center; justify-content:center;">
            <i class="pi pi-ban" style="font-size:24px; color:#b91c1c;"></i>
          </div>
          <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">Sin autorización</h3>
          <p style="font-size:14px; color:#6b7280; margin:0;">No tienes permisos para ver los proveedores.</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonColor: '#2b5e3b',
      confirmButtonText: 'Entendido',
      customClass: {
        confirmButton: '!rounded-lg !font-semibold !text-sm',
        popup: '!rounded-2xl',
      },
    })
  } else if (resultado?.error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: resultado.error,
      confirmButtonColor: '#2b5e3b',
    })
  }
})

const handleEdit = (proveedor) => emit('open-edit', proveedor)
const handleDetail = (proveedor) => emit('open-detail', proveedor)

const confirmarDesactivar = async (proveedor) => {
  const confirmacion = await Swal.fire({
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
        <div style="width:56px; height:56px; border-radius:50%; background:#fee2e2; display:flex; align-items:center; justify-content:center;">
          <i class="pi pi-ban" style="font-size:24px; color:#b91c1c;"></i>
        </div>
        <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">Desactivar proveedor</h3>
        <p style="font-size:14px; color:#6b7280; margin:0;">
          ¿Estás seguro de que deseas desactivar a
          <strong style="color:#1e3a2f;">${proveedor.nombre}</strong>? Esta acción no se puede revertir.
        </p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonColor: '#b91c1c',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: '!rounded-lg !font-semibold !text-sm',
      cancelButton: '!rounded-lg !font-semibold !text-sm',
      popup: '!rounded-2xl',
    },
  })

  if (!confirmacion.isConfirmed) return

  const resultado = await store.desactivarProveedor(proveedor.id)

  if (resultado.ok) {
    Swal.fire({
      icon: 'success',
      title: 'Proveedor desactivado',
      text: `"${proveedor.nombre}" ha sido desactivado.`,
      confirmButtonColor: '#2b5e3b',
      timerProgressBar: true,
    })
  } else if (resultado.status === 403) {
    Swal.fire({
      html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
          <div style="width:56px; height:56px; border-radius:50%; background:#fee2e2; display:flex; align-items:center; justify-content:center;">
            <i class="pi pi-ban" style="font-size:24px; color:#b91c1c;"></i>
          </div>
          <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">Sin autorización</h3>
          <p style="font-size:14px; color:#6b7280; margin:0;">No tienes permisos para realizar esta acción.</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonColor: '#2b5e3b',
      confirmButtonText: 'Entendido',
      customClass: {
        confirmButton: '!rounded-lg !font-semibold !text-sm',
        popup: '!rounded-2xl',
      },
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: resultado.error,
      confirmButtonColor: '#2b5e3b',
    })
  }
}
</script>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #fbfdf9;
  color: #2b5e3b;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 0.75rem 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f4f8f3 !important;
}

:deep(.p-inputtext:enabled:focus),
:deep(.p-select:focus),
:deep(.p-dropdown:focus) {
  box-shadow: none !important;
  border-color: #2b5e3b !important;
}
</style>