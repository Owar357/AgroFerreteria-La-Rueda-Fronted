<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <!-- Encabezado -->
    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-2xl font-semibold tracking-tight text-black">Historial de ventas</h1>
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap justify-start items-center w-full gap-4">
        <!-- buscador -->
        <IconField class="w-80">
          <InputIcon class="pi pi-search text-[#6b7280]" />
          <InputText v-model="filtros.global.value" placeholder="Buscar factura, vendedor..."
            class="w-full bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px]" />
        </IconField>

        <Select v-model="filtros.estado.value" :options="opcionesEstado" showClear placeholder="Todos los estados"
          class="w-52 bg-[#ffffff] border-[#cbd5e1] text-[14px] rounded-lg h-[42px] flex items-center px-2" />

        <Select v-model="filtros.tipoPago.value" :options="opcionesPago" showClear placeholder="Tipo de pago"
          class="w-48 bg-[#ffffff] border-[#cbd5e1] text-[14px] rounded-lg h-[42px] flex items-center px-2" />

        <DatePicker v-model="rangoDeFechas" selectionMode="range" placeholder="Filtrar por fecha" dateFormat="dd/mm/yy"
          showIcon showButtonBar class="w-64 bg-[#ffffff] border-[#cbd5e1] text-[14px] rounded-lg h-[42px]"
          @date-select="onFechaSeleccionada" />
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <DataTable :value="ventasFiltradas" v-model:filters="filtros"
        :globalFilterFields="['vendidoPor', 'numeroFactura']" responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]" :paginator="true" :rows="5" :rowsPerPageOptions="[5, 10, 20]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} ventas"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport">

        <Column field="vendidoPor" header="Vendido por" class="font-semibold text-[#1a2e1f]" />

        <Column field="numeroFactura" header="N° Factura">
          <template #body="{ data }">
            <span class="font-mono text-[13px] text-[#2b5e3b] font-semibold">{{ data.numeroFactura }}</span>
          </template>
        </Column>

        <Column field="tipoPago" header="Tipo de pago">
          <template #body="{ data }">
            <span :class="estiloPago(data.tipoPago)">
              <i class="pi text-[11px]" :class="iconoPago(data.tipoPago)" />
              {{ data.tipoPago }}
            </span>
          </template>
        </Column>

        <Column field="estado" header="Estado">
          <template #body="{ data }">
            <span :class="data.estado === 'PROCESADA'
              ? 'bg-[#dff0e0] text-[#2b5e3b] px-2 py-1 rounded-full text-xs font-medium'
              : 'bg-[#fee2e2] text-[#b91c1c] px-2 py-1 rounded-full text-xs font-medium'">
              {{ data.estado }}
            </span>
          </template>
        </Column>

        <Column field="fecha" header="Fecha" class="text-[#6b7280]" />

        <Column field="total" header="Total">
          <template #body="{ data }">
            <span class="font-bold text-[#1a2e1f]">${{ formatearMoneda(data.total) }}</span>
          </template>
        </Column>

        <Column header="Acciones" class="text-center w-[130px]">
          <template #body="{ data }">
            <div class="flex gap-2 justify-center">
              <Button icon="pi pi-eye" v-tooltip.top="'Ver detalle'"
                class="!bg-[#2b5e3b] hover:!bg-[#1f482d] border-none text-white w-8 h-8 rounded-full p-0 transition-colors shadow-sm"
                @click="$emit('ver-detalle', data)" />
              <Button icon="pi pi-ban" v-tooltip.top="'Anular venta'" :disabled="data.estado === 'ANULADA'" :class="data.estado === 'ANULADA'
                ? '!bg-[#e5e7eb] !text-[#9ca3af] cursor-not-allowed'
                : '!bg-[#fee2e2] hover:!bg-[#fca5a5] !text-[#b91c1c]'"
                class="border-none w-8 h-8 rounded-full p-0 transition-colors shadow-sm"
                @click="$emit('anular-venta', data)" />
            </div>
          </template>
        </Column>

      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import Dropdown from 'primevue/dropdown'



// Props
const props = defineProps({           // ← fix: faltaba guardar en variable
  ventas: {
    type: Array,
    required: true,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['ver-detalle', 'anular-venta', 'filtrar-fechas'])

// Opciones de filtros
const opcionesEstado = ref(['PROCESADA', 'ANULADA'])
const opcionesPago = ref(['EFECTIVO', 'TRANSFERENCIA', 'TARJETA'])
const rangoDeFechas = ref(null)

// Filtros reactivos
const filtros = reactive({
  global: { value: null, matchMode: 'contains' },
  estado: { value: null, matchMode: 'equals' },
  tipoPago: { value: null, matchMode: 'equals' }
})



const onFechaSeleccionada = () => {
  const rango = rangoDeFechas.value
  if (!rango) return
  
  const desde = rango[0]
  const hasta = rango[1] || rango[0]
  
  emit('filtrar-fechas', {
    fecha_desde: desde.toISOString().split('T')[0],
    fecha_hasta: hasta.toISOString().split('T')[0],
  })
}

// Filtro por rango de fechas
const ventasFiltradas = computed(() => {
  if (!props.ventas) return []
  if (!rangoDeFechas.value?.[0]) return props.ventas
  const [desde, hasta] = rangoDeFechas.value
  return props.ventas.filter(venta => {
    if (!venta.fecha) return false
    const [d, m, a] = venta.fecha.split('/')
    const fechaVenta = new Date(`${a}-${m}-${d}`)
    return hasta ? fechaVenta >= desde && fechaVenta <= hasta : fechaVenta >= desde
  })
})

// Helpers visuales
const estiloPago = (tipo) => {
  if (tipo === 'EFECTIVO') return 'bg-[#fef9c3] text-[#854d0e] px-2 py-1 rounded-full text-xs font-medium'
  if (tipo === 'TRANSFERENCIA') return 'bg-[#dbeafe] text-[#1d4ed8] px-2 py-1 rounded-full text-xs font-medium'
  if (tipo === 'TARJETA') return 'bg-[#f3e8ff] text-[#6b21a8] px-2 py-1 rounded-full text-xs font-medium'
  return ''
}

const iconoPago = (tipo) => {
  if (tipo === 'EFECTIVO') return 'pi pi-money-bill'
  if (tipo === 'TRANSFERENCIA') return 'pi pi-mobile'
  if (tipo === 'TARJETA') return 'pi pi-credit-card'
  return ''
}

const formatearMoneda = (valor) => {
  const num = parseFloat(String(valor).replace(/,/g, ''))
  return isNaN(num) ? '0.00' : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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

.p-inputtext:enabled:focus,
.p-dropdown:not(.p-disabled).p-focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>