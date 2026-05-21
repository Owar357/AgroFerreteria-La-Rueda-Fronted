<template>
  <DataTable
    :value="categoriasSimuladas"
    responsiveLayout="scroll"
    class="p-datatable-custom text-[14px]"
  >
    <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f]" />
    
    <Column field="estado" header="Estado">
      <template #body="slotProps">
        <span
          :class="[
            'px-3 py-1 rounded text-[13px] font-semibold uppercase tracking-wide',
            slotProps.data.estado === 'Activa'
              ? 'bg-[#dff0e0] text-[#2b5e3b]'
              : 'bg-[#fee2e2] text-[#b91c1c]'
          ]"
        >
          {{ slotProps.data.estado }}
        </span>
      </template>
    </Column>

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
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

defineEmits(['open-edit', 'open-view'])


const categoriasSimuladas = ref([
  { id: 1, nombre: 'Herramientas', estado: 'Activa' },
  { id: 2, nombre: 'Consendrados', estado: 'Inactiva' },
  { id: 3, nombre: 'Granos básicos', estado: 'Activa' }
])
</script>

<style>
/* Estilos e identidades de la tabla corporativa clara */
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