<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-[26px] font-semibold tracking-tigh !text-black">Registro de Compras Realizadas</h1>
        
        <Button
          label="+ Agregar compra"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-4 py-4 rounded-lg border-none cursor-pointer shadow-md transition-all"
          @click="irARegistroCompra"
        />
      </div>

      <div class="flex justify-start items-center w-full gap-8">
        <!-- Modificado: Ahora el v-model apunta directo al valor del filtro interno -->
        <Select
          v-model="filtros['estadoPago'].value"
          :options="estadosPago"
          placeholder="Filtrar por Estado..."
          class="w-64 bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg focus:ring-1 focus:ring-[#2b5e3b]"
          showClear
        />
      </div>
    </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <!-- Modificado: Vinculamos la propiedad :filters con nuestro objeto reactivo -->
      <DataTable
        :value="comprasRealizadas"
        :filters="filtros"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]"
      >
        <Column field="fechaEmision" header="Fecha Emisión" />
        <Column field="fechaVencimiento" header="Fecha Vencimiento" class="text-[#6b7280]" />
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
              class="font-semibold px-3 py-1 rounded text-[13px] tracking-wide"
              :class="{
                'bg-[#dff0e0] text-[#2b5e3b]': slotProps.data.estadoPago === 'PAGADO',
                'bg-[#fef3c7] text-[#b45309]': slotProps.data.estadoPago === 'PENDIENTE',
                'bg-[#e0f2fe] text-[#0369a1]': slotProps.data.estadoPago === 'ABONADO',
                'bg-[#fee2e2] text-[#b91c1c]': slotProps.data.estadoPago === 'VENCIDO'
              }"
            >
              {{ slotProps.data.estadoPago }}
            </span>
          </template>
        </Column>

        <Column header="Acciones" class="text-center w-[180px]">
          <template #body="slotProps">
            <div class="flex gap-3 justify-center">
              <Button
                icon="pi pi-eye"
                class="!bg-[#e0b354] hover:bg-[#e2e8dd] border border-[#cbd5e1] text-[#1a2e1f] w-9 h-9 rounded-full p-0 transition-colors"
                v-tooltip.top="'Ver detalles'"
                @click="verDetalles(slotProps.data)"
              />
              <Button
                icon="pi pi-ban"
                class="bg-[#fee2e2] hover:bg-[#fca5a5] border border-[#f87171] text-[#b91c1c] w-9 h-9 rounded-full p-0 transition-colors"
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
// Modificado: Importación obligatoria del modo de filtrado nativo
import { FilterMatchMode } from '@primevue/core/api'


const irARegistroCompra = () => emit('open-add')
const emit = defineEmits(['open-add'])


const comprasRealizadas = ref([
  { id: 1, fechaEmision: '10-02-2025', fechaVencimiento: 'N/A', tipoDocumento: 'Factura', numDocumento: 'F-00124', precioFactura: '1,250.00', estadoPago: 'PAGADO' },
  { id: 2, fechaEmision: '12-02-2025', fechaVencimiento: '12-03-2025', tipoDocumento: 'Crédito Fiscal', numDocumento: 'CF-9902', precioFactura: '3,420.50', estadoPago: 'PENDIENTE' },
  { id: 3, fechaEmision: '14-02-2025', fechaVencimiento: '14-03-2025', tipoDocumento: 'Factura', numDocumento: 'F-00125', precioFactura: '850.00', estadoPago: 'ABONADO' },
  { id: 4, fechaEmision: '16-02-2025', fechaVencimiento: '16-02-2025', tipoDocumento: 'Crédito Fiscal', numDocumento: 'CF-9903', precioFactura: '2,100.00', estadoPago: 'VENCIDO' }
])

// Modificado: Estructura de filtros nativos para PrimeVue 4
const filtros = ref({
  estadoPago: { value: null, matchMode: FilterMatchMode.EQUALS }
})

const estadosPago = ref(['PAGADO', 'PENDIENTE', 'ABONADO', 'VENCIDO'])


const verDetalles = (compra) => {
  console.log('Viendo detalles de:', compra.numDocumento)
}

const anularCompra = (compra) => {
  console.log('Anulando compra:', compra.numDocumento)
}
</script>

<style>
/* Se mantienen tus estilos CSS globales exactamente idénticos */
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
