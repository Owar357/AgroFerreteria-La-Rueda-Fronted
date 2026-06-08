<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <!-- Header -->
    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-[26px] font-semibold tracking-tight !text-black">Historial de ventas</h1>
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap justify-start items-center w-full gap-4">
        <IconField class="w-80">
          <InputIcon class="pi pi-search text-[#6b7280]" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Buscar factura, vendedor..."
            class="w-full bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px]"
          />
        </IconField>

        <Dropdown
          v-model="filters['status'].value"
          :options="statusOptions"
          showClear
          placeholder="Todos los estados"
          class="w-52 bg-[#ffffff] border-[#cbd5e1] text-[14px] rounded-lg h-[42px] flex items-center px-2"
        />

        <Dropdown
          v-model="filters['paymentType'].value"
          :options="paymentOptions"
          showClear
          placeholder="Tipo de pago"
          class="w-48 bg-[#ffffff] border-[#cbd5e1] text-[14px] rounded-lg h-[42px] flex items-center px-2"
        />

        <Calendar
          v-model="dateRange"
          selectionMode="range"
          placeholder="Filtrar por fecha"
          dateFormat="dd/mm/yy"
          showIcon
          showButtonBar
          class="w-64 bg-[#ffffff] border-[#cbd5e1] text-[14px] rounded-lg h-[42px]"
        />
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <DataTable
        :value="filteredSales"
        v-model:filters="filters"
        :globalFilterFields="['soldBy', 'Numberfact']"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]"
        :paginator="true"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} ventas"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
      >
        <Column field="soldBy" header="Vendido por" class="font-semibold text-[#1a2e1f]" />

        <Column field="Numberfact" header="N° Factura">
          <template #body="{ data }">
            <span class="font-mono text-[13px] text-[#2b5e3b] font-semibold">{{ data.Numberfact }}</span>
          </template>
        </Column>

        <Column field="paymentType" header="Tipo de pago">
          <template #body="{ data }">
            <span :class="paymentClass(data.paymentType)"
              class="px-3 py-1 rounded text-[12px] font-semibold uppercase tracking-wide inline-flex items-center gap-1">
              <i :class="paymentIcon(data.paymentType)" class="pi text-[11px]" />
              {{ data.paymentType }}
            </span>
          </template>
        </Column>

        <Column field="status" header="Estado">
          <template #body="{ data }">
            <span :class="data.status === 'Procesado'
              ? 'bg-[#dff0e0] text-[#2b5e3b]'
              : 'bg-[#fee2e2] text-[#b91c1c]'"
              class="px-3 py-1 rounded text-[13px] font-semibold uppercase tracking-wide">
              {{ data.status }}
            </span>
          </template>
        </Column>

        <Column field="date" header="Fecha" class="text-[#6b7280]" />

        <Column field="total" header="Total">
          <template #body="{ data }">
            <span class="font-bold text-[#1a2e1f]">${{ formatCurrency(data.total) }}</span>
          </template>
        </Column>

        <Column header="Acciones" class="text-center w-[130px]">
          <template #body="{ data }">
            <div class="flex gap-2 justify-center">
              <Button
                icon="pi pi-eye"
                v-tooltip.top="'Ver detalle'"
                class="!bg-[#2b5e3b] hover:!bg-[#1f482d] border-none text-white w-8 h-8 rounded-full p-0 transition-colors shadow-sm"
                @click="$emit('view-detail', data)"
              />
              <Button
                icon="pi pi-ban"
                v-tooltip.top="'Anular venta'"
                :disabled="data.status === 'Anulado'"
                :class="data.status === 'Anulado'
                  ? '!bg-[#e5e7eb] !text-[#9ca3af] cursor-not-allowed'
                  : '!bg-[#fee2e2] hover:!bg-[#fca5a5] !text-[#b91c1c]'"
                class="border-none w-8 h-8 rounded-full p-0 transition-colors shadow-sm"
                @click="$emit('void-sale', data)"
              />
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
import Calendar from 'primevue/calendar'

// ── Props
const props = defineProps({
  sales: {
    type: Array,
    required: true
  }
})

// ── Emits 
defineEmits(['view-detail', 'void-sale'])

// ── Filtros 
const statusOptions  = ref(['Procesado', 'Anulado'])
const paymentOptions = ref(['Efectivo', 'Transferencia', 'Tarjeta'])
const dateRange      = ref(null)

const filters = ref({
  global:      { value: null, matchMode: 'contains' },
  status:      { value: null, matchMode: 'equals'   },
  paymentType: { value: null, matchMode: 'equals'   }
})

// Filtro de rango de fechas 
const filteredSales = computed(() => {
  if (!dateRange.value?.[0]) return props.sales
  const [from, to] = dateRange.value
  return props.sales.filter(s => {
    const [d, m, y] = s.date.split('/')
    const saleDate  = new Date(`${y}-${m}-${d}`)
    return to ? saleDate >= from && saleDate <= to : saleDate >= from
  })
})

// ── Helpers visuales 
const paymentClass = (type) => ({
  'bg-[#fef9c3] text-[#854d0e]': type === 'Efectivo',
  'bg-[#dbeafe] text-[#1d4ed8]': type === 'Transferencia',
  'bg-[#f3e8ff] text-[#6b21a8]': type === 'Tarjeta'
})

const paymentIcon = (type) => ({
})

const formatCurrency = (v) =>
  Number(v).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
.p-datatable-custom .p-datatable-tbody > tr {
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border-bottom: 1px solid #e2e8dd !important;
}
.p-datatable-custom .p-datatable-tbody > tr:hover { background-color: #f4f7f2 !important; }

.p-inputtext:enabled:focus,
.p-dropdown:not(.p-disabled).p-focus {
  box-shadow: 0 0 0 2px rgba(43,94,59,0.2) !important;
  border-color: #2b5e3b !important;
}

</style>