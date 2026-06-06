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
            placeholder="Buscar por nombre o N° DUI..."
            class="w-full bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px]"
          />
        </IconField>

        <Dropdown
          v-model="filters['personType'].value"
          :options="personTypeOptions"
          showClear
          placeholder="Tipo de persona"
          class="w-52 bg-[#ffffff] border-[#cbd5e1] text-[14px] rounded-lg h-[42px] flex items-center px-2"
        />
      </div>
    </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <DataTable
        :value="clients"
        v-model:filters="filters"
        :globalFilterFields="['name', 'documentNumber']"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]"
        :paginator="true"
        :rows="5"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} clientes"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      >
        <Column field="personType" header="Tipo de persona">
          <template #body="{ data }">
            <span
              :class="data.personType === 'Natural'
                ? 'bg-[#dbeafe] text-[#1d4ed8]'
                : 'bg-[#fef9ec] text-[#cda03f]'" 
              class="px-3 py-1 rounded text-[12px] font-semibold uppercase tracking-wide inline-flex items-center gap-1"
            >
              <i :class="data.personType === 'Natural' ? 'pi pi-user' : 'pi pi-building'" class="text-[11px]" />
              {{ data.personType }}
            </span>
          </template>
        </Column>

        <Column field="name" header="Nombre">
          <template #body="{ data }">
            <span class="font-semibold text-[#1a2e1f]">{{ data.name }}</span>
          </template>
        </Column>

        <Column field="documentNumber" header="N° Documento">
          <template #body="{ data }">
            <span class="font-mono text-[13px] text-[#2b5e3b] font-semibold">{{ data.documentNumber }}</span>
          </template>
        </Column>

        <Column field="phone" header="Teléfono">
          <template #body="{ data }">
            <span class="inline-flex items-center gap-1 text-[#6b7280]">
              <i class="pi pi-phone text-[12px]" />
              {{ data.phone }}
            </span>
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
import { ref } from 'vue'
import IconField    from 'primevue/iconfield'
import InputIcon    from 'primevue/inputicon'
import InputText    from 'primevue/inputtext'
import Dropdown     from 'primevue/dropdown'
import Button       from 'primevue/button'
import DataTable    from 'primevue/datatable'
import Column       from 'primevue/column'

// ── Emits
defineEmits(['view-detail', 'view-history'])

// ── Filtros
const personTypeOptions = ref(['Natural', 'Jurídica'])

const filters = ref({
  global:     { value: null, matchMode: 'contains' },
  personType: { value: null, matchMode: 'equals'   }
})


const clients = ref([
  {
    personType:     'Natural',
    name:           'Carlos Ramírez',
    documentNumber: '04567890-1',
    phone:          '7890-1234',
    email:          'carlos.ramirez@email.com',
    nrc:            '12345-6',
    clientName:     'Carlos Eduardo Ramírez López'
  },
  {
    personType:     'Jurídica',
    name:           'Distribuidora El Sol S.A.',
    documentNumber: '0614-120390-101-5',
    phone:          '2222-3344',
    email:          'contacto@elsol.com.sv',
    nrc:            '98765-4',
    businessName:   'Distribuidora El Sol Sociedad Anónima de Capital Variable'
  },
  {
    personType:     'Natural',
    name:           'Ana Martínez',
    documentNumber: '01234567-8',
    phone:          '6655-4433',
    email:          'ana.martinez@gmail.com',
    nrc:            '54321-0',
    clientName:     'Ana Beatriz Martínez de García'
  },
  {
    personType:     'Jurídica',
    name:           'Inversiones Norte S.A. de C.V.',
    documentNumber: '0614-010180-104-3',
    phone:          '2100-5566',
    email:          'info@inversiones-norte.com',
    nrc:            '11223-3',
    businessName:   'Inversiones Norte Sociedad Anónima de Capital Variable'
  }
])
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