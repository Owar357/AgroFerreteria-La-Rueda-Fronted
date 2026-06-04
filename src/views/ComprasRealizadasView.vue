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
      <!-- Modificado: Vinculamos la propiedad :filters con nuestro objeto reactivo -->
      <DataTable
        :value="comprasRealizadas"
        :filters="filtros"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]"
        :paginator="true"
        :rows="5"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} compras"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
      >
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
// Modificado: Importación obligatoria del modo de filtrado nativo
import { DatePicker } from 'primevue'
import { FilterMatchMode } from '@primevue/core/api'
import { resolveUserAgent } from '@primeuix/utils'

const irARegistroCompra = () => emit('open-add')
const emit = defineEmits(['open-add'])

//variables para fecjas inicio y fin individuales
const fechaInicio = ref(null)
const fechsFin = ref(null)

const comprasRealizadas = ref([
  {
    id: 1,
    fechaEmision: '10-02-2025',
    proveedor: 'Distribuidora San Carlos',
    tipoDocumento: 'Factura',
    numDocumento: 'F-00124',
    precioFactura: '1,250.00',
    estadoPago: 'PAGADO',
  },
  {
    id: 2,
    fechaEmision: '12-02-2025',
    proveedor: 'Distribuidora San Carlos',
    tipoDocumento: 'Crédito Fiscal',
    numDocumento: 'CF-9902',
    precioFactura: '3,420.50',
    estadoPago: 'PENDIENTE',
  },
  {
    id: 3,
    fechaEmision: '14-02-2025',
    proveedor: 'Distribuidora San Carlos',
    tipoDocumento: 'Factura',
    numDocumento: 'F-00125',
    precioFactura: '850.00',
    estadoPago: 'ABONADO',
  },
  {
    id: 4,
    fechaEmision: '16-02-2025',
    proveedor: 'Distribuidora San Carlos',
    tipoDocumento: 'Crédito Fiscal',
    numDocumento: 'CF-9903',
    precioFactura: '2,100.00',
    estadoPago: 'VENCIDO',
  },
  {
    id: 5,
    fechaEmision: '05-05-2024',
    proveedor: 'Distribuidora San Carlos',
    tipoDocumento: 'Factura',
    numDocumento: 'F-00841',
    precioFactura: '920.00',
    estadoPago: 'PAGADO',
  },
  {
    id: 6,
    fechaEmision: '20-11-2024',
    proveedor: 'NutriGreen S.A.',
    tipoDocumento: 'Crédito Fiscal',
    numDocumento: 'CF-1024',
    precioFactura: '4,150.00',
    estadoPago: 'PAGADO',
  },
  {
    id: 7,
    fechaEmision: '15-01-2025',
    proveedor: 'Agroservicios del Centro',
    tipoDocumento: 'Factura',
    numDocumento: 'F-00210',
    precioFactura: '600.00',
    estadoPago: 'PAGADO',
  },
  {
    id: 8,
    fechaEmision: '18-05-2026',
    proveedor: 'TecnoAgro Global',
    tipoDocumento: 'Crédito Fiscal',
    numDocumento: 'CF-4412',
    precioFactura: '1,850.00',
    estadoPago: 'PENDIENTE',
  },
  {
    id: 9,
    fechaEmision: '22-05-2026',
    proveedor: 'Semillas del Pacífico',
    tipoDocumento: 'Factura',
    numDocumento: 'F-00302',
    precioFactura: '1,100.00',
    estadoPago: 'ABONADO',
  },
  {
    id: 10,
    fechaEmision: '25-05-2026',
    proveedor: 'Importaciones InterAgro',
    tipoDocumento: 'Crédito Fiscal',
    numDocumento: 'CF-8819',
    precioFactura: '2,750.40',
    estadoPago: 'PENDIENTE',
  },
  {
    id: 11,
    fechaEmision: '12-08-2023',
    proveedor: 'BioProtect S.A.',
    tipoDocumento: 'Factura',
    numDocumento: 'F-00912',
    precioFactura: '320.00',
    estadoPago: 'PAGADO',
  },
  {
    id: 12,
    fechaEmision: '04-03-2025',
    proveedor: 'Fertilizantes del Norte',
    tipoDocumento: 'Crédito Fiscal',
    numDocumento: 'CF-9945',
    precioFactura: '1,430.00',
    estadoPago: 'VENCIDO',
  },
])

//  Estructura de filtros nativos para PrimeVue 4
const filtros = ref({
  estadoPago: { value: null, matchMode: FilterMatchMode.EQUALS },
  fechaEmision: { value: null, matchMode: FilterMatchMode.CUSTOM },
})

const estadosPago = ref(['PAGADO', 'PENDIENTE', 'ABONADO', 'VENCIDO'])

const actualizarFiltroFecha = () => {
  // este es un objeto personal para a fprzar a prume vue a realizar la funcion
  //falta hacer todo el procesos en los stores
  filtros.value.fechaEmision.value = { inicio: fechaInicio.value, fin: fechsFin.value }
}

//Reisttro de ña ficion personalizada d efiltado en el objeto
//filtros de la yabla
filtros.value.fechaEmision.constraits = (value, filter) => {
  if (!filter || !filter[0] || !filter[1]) return true
  if (!value) return false

  const [dia, mes, anio] = value.split('-').map(Number)
  const fechaRegistro = new Date(anio, mes - 1, dia)
  fechaRegistro.setHours(0, 0, 0, 0)

  //valisdamos si la fecha de inicio existe
  if (filter.inicio) {
    const inicio = new Date(filter.inicio)
    inicio.setHours(0, 0, 0, 0)
    if (fechaRegistro < inicio) return false
  }

  //Validamos que la fecha fin ingresada exista
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
