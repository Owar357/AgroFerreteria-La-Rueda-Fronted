<template>



  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-[26px] font-semibold tracking-tight !text-black">
          Registro de Proveedores
        </h1>

        <Button label="+ Agregar"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-7 py-5 rounded-lg border-none cursor-pointer shadow-md transition-all"
          @click="$emit('open-add')" />
      </div>

      <div class="flex justify-start items-center w-full gap-8">
        <IconField class="w-80">
          <InputIcon class="pi pi-search text-[#6b7280]" />
          <InputText v-model="filters['global'].value" placeholder="Buscar por nombre..."
            class="w-full bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px] focus:ring-1 focus:ring-[#2b5e3b]" />
        </IconField>

        <Select v-model="filters['estado'].value" :options="estadoOptions" showClear placeholder="Todos los estados"
          class="w-56 bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px] flex items-center px-2 focus:ring-1 focus:ring-[#2b5e3b]" />
      </div>
    </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <DataTable :value="proveedores" :loading="loading" :lazy="false" :totalRecords="totalProveedores"
        v-model:filters="filters" :globalFilterFields="['nombre', 'correo']" responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]" :paginator="true" :rows="7" @page="onPage($event)"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} proveedores"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport">

        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-[#6b7280]">
            <i class="pi pi-inbox text-[48px] mb-3 text-[#cbd5e1]" />
            <span class="text-[15px] font-medium">No hay proveedores registrados</span>
          </div>
        </template>

        <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f] capitalize" />

        <Column field="correo" header="Correo" class="text-[#4b5563]" />

        <Column field="telefono" header="Teléfono" class="text-[#4b5563]" />

        <Column field="estado" header="Estado">
          <template #body="slotProps">
            <Tag :value="slotProps.data.estado === 'Activo' ? 'ACTIVO' : 'INACTIVO'"
              :severity="slotProps.data.estado === 'Activo' ? 'success' : 'danger'" rounded />
          </template>
        </Column>

        <Column header="Acciones">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" label="Editar"
                class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
                v-tooltip.top="'Editar proveedor'" @click="handleEdit(slotProps.data)" />

              <Button icon="pi pi-eye" label="Ver"
                class="!bg-white hover:!bg-[#eef2e9] !text-[#1e3a2f] !border !border-[#cfe0d2] rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
                v-tooltip.top="'Ver detalles'" @click="handleDetail(slotProps.data)" />

              <Button :icon="slotProps.data.estado === 'Activo' ? 'pi pi-ban' : 'pi pi-check-circle'"
                :label="slotProps.data.estado === 'Activo' ? 'Desactivar' : 'Activar'" :class="slotProps.data.estado === 'Activo'
                  ? '!bg-white hover:!bg-[#fde8e8] !text-[#9c2a2a] !border !border-[#f0c9c9]'
                  : '!bg-white hover:!bg-[#eef2e9] !text-[#2b5e3b] !border !border-[#cfe0d2]'"
                class="rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
                v-tooltip.top="slotProps.data.estado === 'Activo' ? 'Desactivar proveedor' : 'Activar proveedor'"
                @click="toggleEstado(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { Select } from 'primevue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useProveedorStore } from '@/stores/proveedorStore'
import { storeToRefs } from 'pinia'

const emit = defineEmits(['open-add', 'open-edit', 'open-detail'])

const store = useProveedorStore()
const { proveedores, cargando: loading, totalRecords: totalProveedores } = storeToRefs(store)



const estadoOptions = ref(['Activo', 'Inactivo'])

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  estado: { value: null, matchMode: 'equals' },
})

onMounted(() => store.cargarProveedores())

const handleEdit = (proveedor) => emit('open-edit', proveedor)
const handleDetail = (proveedor) => emit('open-detail', proveedor)
const toggleEstado = (proveedor) => store.toggleEstado(proveedor)
</script>

<style>
.p-datatable-custom .p-datatable-thead>tr>th {
  background-color: #ffffff !important;
  color: #1e3a2f !important;
  border-bottom: 2px solid #e2e8dd !important;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.25rem 1rem;
}

.p-datatable-custom .p-datatable-tbody>tr {
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border-bottom: 1px solid #e2e8dd !important;
}

.p-datatable-custom .p-datatable-tbody>tr:hover {
  background-color: #f4f7f2 !important;
}

.p-inputtext:enabled:focus,
.p-dropdown:not(.p-disabled).p-focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}

.p-dropdown {
  background-color: #ffffff !important;
  border-color: #cbd5e1 !important;
}

.p-dropdown-label {
  color: #1a2e1f !important;
}

.p-dropdown-overlay {
  background-color: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
}

.p-dropdown-item {
  color: #1a2e1f !important;
}

.p-dropdown-item:not(.p-highlight):not(.p-disabled):hover {
  background-color: #eef2e9 !important;
}
</style>
