<template>
  <DataTable
    :value="store.categorias"
    responsiveLayout="scroll"
    class="p-datatable-custom text-[14px]"
    :paginator="true"
    :rows="5"
    :rowsPerPageOptions="[5, 15, 25]"
    :loading="store.cargando"
    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categorias"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
  >
    <template #empty>
      <div class="text-center py-6 text-[#6b7280] text-[14px]">
        No hay categorías registradas.
      </div>
    </template>

    <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f]" />

    <Column header="Acciones" class="text-center w-[150px]">
      <template #body="slotProps">
        <div class="flex gap-2 justify-center">
          <Button
            icon="pi pi-pencil"
            class="!bg-[#e0b354] hover:!bg-[#cda03f] border-none text-[#1a2e1f] w-8 h-8 rounded-full p-0 transition-colors shadow-sm cursor-pointer"
            @click="$emit('open-edit', slotProps.data)"
          /> 
          
          <Button
            icon="pi pi-eye"
            class="bg-[#eef2e9] hover:bg-[#e2e8dd] border border-[#cbd5e1] text-[#1a2e1f] w-8 h-8 rounded-full p-0 transition-colors cursor-pointer"
            @click="$emit('open-view', slotProps.data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { useCategoriaStore } from '../../stores/categoriaStore'

defineEmits(['open-edit', 'open-view'])

const store = useCategoriaStore()
</script>

<style>
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #ffffff !important;
  color: #1e3a2f !important;
  border-bottom: 2px solid #e2e8dd !important;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.25rem 1rem;
}

.p-datatable-custom .p-datatable-tbody > tr {
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border-bottom: 1px solid #e2e8dd !important;
}

.p-datatable-custom .p-datatable-tbody > tr:hover {
  background-color: #f4f7f2 !important;
}
</style>