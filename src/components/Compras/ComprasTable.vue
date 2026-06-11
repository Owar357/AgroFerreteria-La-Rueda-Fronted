<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-[26px] font-semibold tracking-tigh !text-black">
          Registro de Compras Realizadas
        </h1>

        <Button
          label="+ Agregar compra"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-4 py-4 rounded-lg border-none cursor-pointer shadow-md transition-all"
          @click="emit('open-add')"
        />
      </div>

      <div class="flex justify-start items-center w-full gap-8">
        <Select
          v-model="filtros['estadoPago'].value"
          :options="estadosPago"
          placeholder="Filtrar por Estado..."
          class="w-64 bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg focus:ring-1 focus:ring-[#2b5e3b]"
          showClear
        />
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-[#4b5563]">Fecha Inicio:</span>
          <DatePicker
            v-model="fechaInicio"
            placeholder="dd-mm-aaaa"
            dateFormat="dd-mm-yy"
            class="w-44 bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg focus:ring-1 focus:ring-[#2b5e3b]"
            showClear
            @update:modelValue="actualizarFiltroFecha"
          />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-[#4b5563]">Fecha Fin:</span>
          <DatePicker
            v-model="fechaFin"
            placeholder="dd-mm-aaaa"
            dateFormat="dd-mm-yy"
            class="w-44 bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg focus:ring-1 focus:ring-[#2b5e3b]"
            showClear
            @update:modelValue="actualizarFiltroFecha"
          />
        </div>
      </div>
    </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <DataTable
        :value="compras"
        :filters="filtros"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]"
        :paginator="true"
        :rows="5"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} compras"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
      >
        <template #empty>
          <div class="text-center py-6 text-gray-400">No se encontraron compras.</div>
        </template>

        <Column field="fechaEmision" header="Fecha Emisión" />
        <Column field="proveedor" header="Proveedor" class="text-[#6b7280]" />
        <Column field="tipoDocumento" header="Tipo Documento" />
        <Column field="numDocumento" header="Nº Documento" />

        <Column field="precioFactura" header="Precio Factura">
          <template #body="slotProps">
            <span class="font-bold text-[#2b5e3b]">${{ slotProps.data.precioFactura }}</span>
          </template>
        </Column>

        <Column field="estadoPago" header="Estado de Pago">
          <template #body="slotProps">
            <span
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
              :class="{
                'bg-green-100 text-green-800': slotProps.data.estadoPago === 'PAGADO',
                'bg-yellow-100 text-yellow-800': slotProps.data.estadoPago === 'PENDIENTE',
                'bg-blue-100 text-blue-800': slotProps.data.estadoPago === 'ABONADO',
                'bg-red-100 text-red-800': slotProps.data.estadoPago === 'VENCIDO',
              }"
            >
              {{ slotProps.data.estadoPago }}
            </span>
          </template>
        </Column>

        <Column header="Acciones" class="text-right w-[200px]">
          <template #body="slotProps">
            <div class="flex gap-2 justify-end">
              <Button
                icon="pi pi-eye"
                label="Ver"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip.top="'Ver detalles'"
                @click="verDetalles(slotProps.data)"
              />
              <Button
                icon="pi pi-ban"
                label="Anular"
                severity="danger"
                text
                rounded
                size="small"
                v-tooltip.top="'Anular compra'"
                @click="anularCompra(slotProps.data)"
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
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Select from 'primevue/select'
import { DatePicker } from 'primevue'
import { FilterMatchMode } from '@primevue/core/api'

const props = defineProps({
  compras: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['open-add'])

const fechaInicio = ref(null)
const fechaFin = ref(null)

const filtros = ref({
  estadoPago: { value: null, matchMode: FilterMatchMode.EQUALS },
  fechaEmision: { value: null, matchMode: FilterMatchMode.CUSTOM },
})

const estadosPago = ref(['PAGADO', 'PENDIENTE', 'ABONADO', 'VENCIDO'])

const actualizarFiltroFecha = () => {
  filtros.value.fechaEmision.value = { inicio: fechaInicio.value, fin: fechaFin.value }
}

filtros.value.fechaEmision.constraits = (value, filter) => {
  if (!filter || (!filter.inicio && !filter.fin)) return true
  if (!value) return false

  const [dia, mes, anio] = value.split('-').map(Number)
  const fechaRegistro = new Date(anio, mes - 1, dia)
  fechaRegistro.setHours(0, 0, 0, 0)

  if (filter.inicio) {
    const inicio = new Date(filter.inicio)
    inicio.setHours(0, 0, 0, 0)
    if (fechaRegistro < inicio) return false
  }

  if (filter.fin) {
    const fin = new Date(filter.fin)
    fin.setHours(23, 59, 59, 999)
    if (fechaRegistro > fin) return false
  }

  return true
}

const verDetalles = (compra) => {
  console.log('Viendo detalles de:', compra.numDocumento)
}

const anularCompra = (compra) => {
  console.log('Anulando compra:', compra.numDocumento)
}
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

.p-select {
  background-color: #ffffff !important;
  border-color: #cbd5e1 !important;
  box-shadow: none !important;
  height: 40px !important;
  display: flex !important;
  align-items: center !important;
}

.p-select:not(.p-disabled).p-focus {
  border-color: #2b5e3b !important;
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
}

.p-select-label {
  color: #1a2e1f !important;
  font-size: 14px !important;
}

.p-select-overlay {
  background-color: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
}

.p-select-option {
  color: #1a2e1f !important;
  background: transparent !important;
  font-size: 14px !important;
}

.p-select-option:not(.p-placeholder-option):not(.p-select-option-selected):not(.p-disabled).p-focus,
.p-select-option:not(.p-placeholder-option):not(.p-select-option-selected):not(.p-disabled):hover {
  background-color: #eef2e9 !important;
  color: #1a2e1f !important;
}

.p-select-option-selected {
  background-color: #e2e8dd !important;
  color: #1a2e1f !important;
  font-weight: 600;
}
</style>