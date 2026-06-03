<template>
  <DataTable
    :value="store.categorias"
    :loading="store.cargando"
<<<<<<< HEAD
    lazy
    :paginator="true"
    :rows="store.perPage"
    :totalRecords="store.totalRecords"
    responsiveLayout="scroll"
    class="p-datatable-custom text-[14px]"
    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categorías"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
=======
    responsiveLayout="scroll"
    class="p-datatable-custom text-[14px]"
    :paginator="true"
    :lazy="true"
    :rows="store.perPage"
    :totalRecords="store.totalRecords"
    :first="(store.currentPage - 1) * store.perPage"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categorías"
>>>>>>> rama_prueba
    @page="onPageChange"
  >
    <template #empty>
      <div class="text-center py-6 text-[#6b7280] text-[14px]">No hay categorías registradas.</div>
    </template>

<<<<<<< HEAD
    <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f] capitalize" />
=======
    <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f]" />
>>>>>>> rama_prueba

    <Column header="Acciones" class="text-right w-[150px]">
      <template #body="slotProps">
        <div class="flex gap-2 justify-end">
<<<<<<< HEAD
          <Button icon="pi pi-pencil" label="Editar" severity="secondary" text rounded size="small"
            v-tooltip="'Editar categoría'" @click="$emit('open-edit', slotProps.data)" />
          <Button icon="pi pi-eye" label="Ver" severity="secondary" text rounded size="small"
            v-tooltip="'Ver categoría'" @click="$emit('open-view', slotProps.data)" />
=======
          <Button
            icon="pi pi-pencil"
            label="Editar"
            severity="secondary"
            text
            rounded
            size="small"
            v-tooltip="'Editar categoría'"
            @click="$emit('open-edit', slotProps.data)"
          />
          <Button
            icon="pi pi-eye"
            label="Ver"
            severity="secondary"
            text
            rounded
            size="small"
            v-tooltip="'Ver categoría'"
            @click="$emit('open-view', slotProps.data)"
          />
>>>>>>> rama_prueba
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column    from 'primevue/column'
import Button    from 'primevue/button'
import { useCategoriaStore } from '../../stores/categoriaStore'

const emit = defineEmits(['open-edit', 'open-view'])
const store = useCategoriaStore()

<<<<<<< HEAD
const onPageChange = (event) => {
  const page    = event.page + 1   // PrimeVue empieza en 0
  const perPage = event.rows
  store.cargarCategorias(page, perPage)
=======

// Cargar primera página al montar
store.cargarCategorias(1, store.perPage)

const onPageChange = (event) => {
  const page = event.page + 1  
  store.cargarCategorias(page, event.rows)
>>>>>>> rama_prueba
}
</script>

<style>
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #ffffff !important;
  color: #1e3a2f !important;
  border-bottom: 2px solid #e2e8dd !important;
  font-size: 13px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.05em;
  padding: 1.25rem 1rem;
}
<<<<<<< HEAD
=======

>>>>>>> rama_prueba
.p-datatable-custom .p-datatable-tbody > tr {
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border-bottom: 1px solid #e2e8dd !important;
}
<<<<<<< HEAD
.p-datatable-custom .p-datatable-tbody > tr:hover { background-color: #f4f7f2 !important; }
=======

.p-datatable-custom .p-datatable-tbody > tr:hover {
  background-color: #f4f7f2 !important;
}
>>>>>>> rama_prueba
</style>