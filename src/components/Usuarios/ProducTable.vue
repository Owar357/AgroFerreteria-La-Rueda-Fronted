<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-[26px] font-semibold tracking-tight !text-black">Registro de Productos</h1>

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

        <Dropdown v-model="filters['categoria'].value" :options="uniqueCategories" showClear
          placeholder="Todas las categorías"
          class="w-56 bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px] flex items-center px-2 focus:ring-1 focus:ring-[#2b5e3b]" />
      </div>
    </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <DataTable :value="products" v-model:filters="filters" :globalFilterFields="['name', 'fabricante', 'codigo']"
        responsiveLayout="scroll" :paginator="true" :rows="5" :rowsPerPageOptions="[5, 15, 25]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
        class="p-datatable-custom text-[14px]">
        <Column field="name" header="Nombre" class="font-semibold text-[#1a2e1f]" />
        <Column field="categoria" header="Categoría" class="text-[#4b5563]" />
        <Column field="fabricante" header="Fabricante" class="text-[#4b5563]" />
        <Column field="codigo" header="Código" class="text-[#6b7280]" />

        <Column header="Acciones" class="w-[200px]">
          <template #body="slotProps">
            <div class="flex gap-2">
              <!-- Editar -->
              <Button icon="pi pi-pencil" label="Editar" severity="secondary" text rounded size="small"
                v-tooltip="'Editar producto'" @click="handleEdit(slotProps.data)" />
              <!-- Ver Detalles -->
              <Button icon="pi pi-eye" label="Ver" severity="secondary" text rounded size="small"
                v-tooltip="'Ver presentaciones'" @click="handleDetail(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const emit = defineEmits(['open-add', 'open-edit', 'open-detail'])

const products = ref([
  { id: 1, name: 'Maíz Híbrido', categoria: 'Semilla', fabricante: 'Agrosem', codigo: 'PRN-908-789' },
  { id: 2, name: 'Fertilizante 20-20-20', categoria: 'Fertilizante', fabricante: 'NutriGreen', codigo: 'FER-234-567' },
  { id: 3, name: 'Herbicida Total', categoria: 'Herbicida', fabricante: 'CropCare', codigo: 'HER-876-543' },
  { id: 4, name: 'Maíz Tolerant', categoria: 'Semilla', fabricante: 'Biosem', codigo: 'PRN-345-123' },
  { id: 5, name: 'Fungicida Protector', categoria: 'Fungicida', fabricante: 'AgroProtect', codigo: 'FUN-654-321' },
  { id: 6, name: 'Insecticida Natural', categoria: 'Insecticida', fabricante: 'BioProtect', codigo: 'INS-123-456' },
  { id: 7, name: 'Insecticida Natural', categoria: 'Insecticida', fabricante: 'BioProtect', codigo: 'INS-123-457' },
  { id: 8, name: 'Insecticida Natural', categoria: 'Insecticida', fabricante: 'BioProtect', codigo: 'INS-123-458' },
])

const uniqueCategories = computed(() => {
  return [...new Set(products.value.map(p => p.categoria))].sort()
})

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  categoria: { value: null, matchMode: 'equals' }
})

const handleEdit = (product) => emit('open-edit', product)
const handleDetail = (product) => emit('open-detail', product)
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