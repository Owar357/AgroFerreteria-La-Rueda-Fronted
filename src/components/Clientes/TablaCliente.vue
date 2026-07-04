<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-[26px] font-semibold tracking-tight !text-black">Historial de clientes</h1>
      </div>

      <div class="flex flex-wrap justify-start items-center w-full gap-4">
        <IconField class="w-80">
          <InputIcon class="pi pi-search text-[#6b7280]" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Buscar por nombre o N° documento..."
            class="w-full bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px]"
          />
        </IconField>

        <Dropdown
          v-model="filters['tipo_persona'].value"
          :options="tipoPersonaOpciones"
          showClear
          placeholder="Tipo de persona"
          class="w-52 bg-[#ffffff] border-[#cbd5e1] text-[14px] rounded-lg h-[42px] flex items-center px-2"
        />
      </div>
    </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <DataTable
        :value="clientes"
        :loading="cargando"
        v-model:filters="filters"
        :globalFilterFields="['nombre', 'numero_documento']"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]"
        :paginator="true"
        :rows="porPagina"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} clientes"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      >
        <Column field="tipo_persona" header="Tipo de persona">
          <template #body="{ data }">
            <span
              :class="data.tipo_persona === 'Natural'
                ? 'bg-[#dbeafe] text-[#1d4ed8]'
                : 'bg-[#fef9ec] text-[#cda03f]'"
              class="px-3 py-1 rounded text-[12px] font-semibold uppercase tracking-wide inline-flex items-center gap-1"
            >
              <i :class="data.tipo_persona === 'Natural' ? 'pi pi-user' : 'pi pi-building'" class="text-[11px]" />
              {{ data.tipo_persona }}
            </span>
          </template>
        </Column>

        <Column field="nombre" header="Nombre">
          <template #body="{ data }">
            <span class="font-semibold text-[#1a2e1f]">{{ data.nombre }}</span>
          </template>
        </Column>

        <Column field="numero_documento" header="N° Documento">
          <template #body="{ data }">
            <span class="font-mono text-[13px] text-[#2b5e3b] font-semibold">{{ data.numero_documento }}</span>
          </template>
        </Column>


        <Column header="Acciones" class="text-center w-[130px]">
          <template #body="{ data }">
            <div class="flex gap-2 justify-center">
              <Button
                icon="pi pi-eye"
                v-tooltip.top="'Ver detalles'"
                class="!bg-[#2b5e3b] hover:!bg-[#1f482d] border-none text-white w-8 h-8 rounded-full p-0 transition-colors shadow-sm"
                @click="$emit('view-detail', data)"
              />
              <Button
                icon="pi pi-history"
                v-tooltip.top="'Ver historial'"
                class="!bg-[#fbf5e6] hover:!bg-[#f5e6c4] !text-[#cda03f] border-none w-8 h-8 rounded-full p-0 transition-colors shadow-sm"
                @click="$emit('view-history', data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted }   from 'vue'
import IconField             from 'primevue/iconfield'
import InputIcon             from 'primevue/inputicon'
import InputText             from 'primevue/inputtext'
import Dropdown              from 'primevue/dropdown'
import Button                from 'primevue/button'
import DataTable             from 'primevue/datatable'
import Column                from 'primevue/column'
import { useClienteStore }   from '@/stores/clienteStore'
import { storeToRefs }       from 'pinia'

defineEmits(['view-detail', 'view-history'])

const store = useClienteStore()
const { clientes, cargando, porPagina } = storeToRefs(store)

const tipoPersonaOpciones = ref(['Natural', 'Jurídica'])

const filters = ref({
  global:       { value: null, matchMode: 'contains' },
  tipo_persona: { value: null, matchMode: 'equals'   },
})

onMounted(() => store.cargarClientes())
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
.p-inputtext:enabled:focus,
.p-dropdown:not(.p-disabled).p-focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>