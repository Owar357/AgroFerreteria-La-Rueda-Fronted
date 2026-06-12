<template>
  <DataTable :value="store.categorias" :loading="store.cargando" responsiveLayout="scroll"
    class="p-datatable-custom text-[14px]" :paginator="true" :lazy="true" :rows="store.perPage"
    :totalRecords="store.totalRecords" :first="(store.currentPage - 1) * store.perPage"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categorías" @page="onPageChange">
    <template #empty>
      <div class="text-center py-6 text-[#6b7280] text-[14px]">No hay categorías registradas.</div>
    </template>

    <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f]" />

    <Column header="Acciones" class="text-right w-[150px]">
      <template #body="slotProps">
          <div class="flex gap-2">
      <Button icon="pi pi-pencil" label="Editar"
        class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
        v-tooltip.top="'Editar categoría'" @click="emit('open-edit',slotProps.data)" />
    </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>

import { useCategoriaStore } from '../../stores/categoriaStore'

const emit = defineEmits(['open-edit', 'open-view'])
const store = useCategoriaStore()


// Cargar primera página al montar
store.cargarCategorias(1, store.perPage)

const onPageChange = (event) => {
  const page = event.page + 1
  store.cargarCategorias(page, event.rows)
}
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
</style>