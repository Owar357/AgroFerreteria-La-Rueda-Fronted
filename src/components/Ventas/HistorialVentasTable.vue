<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <!-- Encabezado -->
    <div class="flex flex-col mb-8 gap-4">
      <div class="flex flex-col w-full">
        <h1 class="text-2xl font-semibold tracking-tight text-black">Historial de ventas</h1>
        <p class="text-[13px] text-[#6b7280] mt-1">
          Sin filtro de fechas se muestran las ventas de hoy. Los filtros se aplican sobre todo el historial.
        </p>
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap justify-start items-center w-full gap-4">
        <!-- buscador -->
        <IconField class="w-80">
          <InputIcon class="pi pi-search text-[#6b7280]" />
          <InputText
            v-model="busqueda"
            placeholder="Buscar factura, vendedor..."
            class="w-full bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px]"
          />
        </IconField>

        <Select
          v-model="estadoSel"
          :options="opcionesEstado"
          showClear
          placeholder="Todos los estados"
          class="w-52 bg-[#ffffff] border-[#cbd5e1] text-[14px] rounded-lg h-[42px] flex items-center px-2"
        />

        <Select
          v-model="pagoSel"
          :options="opcionesPago"
          showClear
          placeholder="Tipo de pago"
          class="w-48 bg-[#ffffff] border-[#cbd5e1] text-[14px] rounded-lg h-[42px] flex items-center px-2"
        />

        <DatePicker
          v-model="rangoDeFechas"
          selectionMode="range"
          placeholder="Filtrar por fecha"
          dateFormat="dd/mm/yy"
          showIcon
          showButtonBar
          class="w-64 bg-[#ffffff] border-[#cbd5e1] text-[14px] rounded-lg h-[42px]"
          @hide="alCerrarCalendario"
        />
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <!-- lazy: el servidor entrega solo la página actual; la paginación y los filtros NO se hacen aquí -->
      <DataTable
        :value="cargando ? Array.from({ length: filas }) : ventas"
        lazy
        paginator
        :rows="filas"
        :first="primero"
        :totalRecords="totalRegistros"
        :rowsPerPageOptions="[8, 15, 30]"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} ventas"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        @page="onPage"
      >
        <template #empty>
          <div class="text-center py-6 text-[#6b7280] text-[14px]">
            No hay ventas para los filtros seleccionados.
          </div>
        </template>

        <!-- Columna: Vendido por -->
        <Column field="vendidoPor" header="Vendido por" class="font-semibold text-[#1a2e1f]">
          <template #body="slotProps">
            <Skeleton v-if="cargando" width="65%" height="1.2rem" />
            <span v-else>{{ slotProps.data.vendidoPor }}</span>
          </template>
        </Column>

        <!-- Columna: N° Factura -->
        <Column field="numeroFactura" header="N° Factura">
          <template #body="slotProps">
            <Skeleton v-if="cargando" width="5rem" height="1.2rem" />
            <span v-else class="font-mono text-[13px] text-[#2b5e3b] font-semibold">
              {{ slotProps.data.numeroFactura }}
            </span>
          </template>
        </Column>

        <!-- Columna: Tipo de pago -->
        <Column field="tipoPago" header="Tipo de pago">
          <template #body="slotProps">
            <Skeleton v-if="cargando" width="6.5rem" height="1.5rem" borderRadius="20px" />
            <span v-else :class="estiloPago(slotProps.data.tipoPago)">
              <i class="pi text-[11px]" :class="iconoPago(slotProps.data.tipoPago)" />
              {{ slotProps.data.tipoPago }}
            </span>
          </template>
        </Column>

        <!-- Columna: Estado -->
        <Column field="estado" header="Estado">
          <template #body="slotProps">
            <Skeleton v-if="cargando" width="5.5rem" height="1.5rem" borderRadius="20px" />
            <span
              v-else
              :class="
                slotProps.data.estado === 'PROCESADA'
                  ? 'bg-[#dff0e0] text-[#2b5e3b] px-2 py-1 rounded-full text-xs font-medium'
                  : 'bg-[#fee2e2] text-[#b91c1c] px-2 py-1 rounded-full text-xs font-medium'
              "
            >
              {{ slotProps.data.estado }}
            </span>
          </template>
        </Column>

        <!-- Columna: Fecha -->
        <Column field="fecha" header="Fecha" class="text-[#6b7280]">
          <template #body="slotProps">
            <Skeleton v-if="cargando" width="5.5rem" height="1.2rem" />
            <span v-else>{{ slotProps.data.fecha }}</span>
          </template>
        </Column>

        <!-- Columna: Total -->
        <Column field="total" header="Total">
          <template #body="slotProps">
            <Skeleton v-if="cargando" width="4rem" height="1.2rem" />
            <span v-else class="font-bold text-[#1a2e1f]">${{ formatearMoneda(slotProps.data.total) }}</span>
          </template>
        </Column>

        <!-- Columna: Acciones -->
        <Column header="Acciones" class="text-center w-[90px]">
          <template #body="slotProps">
            <div class="flex gap-2 justify-center">
              <template v-if="cargando">
                <Skeleton shape="circle" size="2rem" />
              </template>

              <template v-else>
                <Button
                  icon="pi pi-eye"
                  v-tooltip.top="'Ver detalle'"
                  class="!bg-[#2b5e3b] hover:!bg-[#1f482d] border-none text-white w-8 h-8 rounded-full p-0 transition-colors shadow-sm"
                  @click="$emit('ver-detalle', slotProps.data)"
                />
              </template>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import Skeleton from 'primevue/skeleton'

// Props: la página actual y los totales los entrega el padre (que consulta al servidor)
defineProps({
  ventas: { type: Array, required: true, default: () => [] },
  cargando: { type: Boolean, default: false },
  totalRegistros: { type: Number, default: 0 }, // total del servidor, no de la página
  filas: { type: Number, default: 8 },
  primero: { type: Number, default: 0 }, // índice del primer registro de la página
})

const emit = defineEmits(['ver-detalle', 'cambiar-pagina', 'cambiar-filtros'])

// --- Paginación ---
const onPage = (event) => {
  emit('cambiar-pagina', { page: event.page + 1, per_page: event.rows })
}

// --- Filtros (se envían al servidor; aquí no se filtra nada) ---
const opcionesEstado = ref(['PROCESADA', 'ANULADA'])
const opcionesPago = ref(['EFECTIVO', 'TRANSFERENCIA', 'TARJETA'])

const busqueda = ref('')
const estadoSel = ref(null)
const pagoSel = ref(null)
const rangoDeFechas = ref(null)

// Fecha local en formato YYYY-MM-DD
const aISO = (fecha) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`

const emitirFiltros = () => {
  const [desde, hasta] = rangoDeFechas.value ?? []

  emit('cambiar-filtros', {
    search: busqueda.value.trim(),
    estado: estadoSel.value || '',
    tipo_pago: pagoSel.value || '',
    fecha_desde: desde ? aISO(desde) : '',
    // Si solo se eligió un día, el rango es ese mismo día
    fecha_hasta: desde ? aISO(hasta ?? desde) : '',
  })
}

watch([estadoSel, pagoSel], emitirFiltros)

// Búsqueda con espera de 400 ms para no consultar en cada tecla
let temporizador = null
watch(busqueda, () => {
  clearTimeout(temporizador)
  temporizador = setTimeout(emitirFiltros, 400)
})
onBeforeUnmount(() => clearTimeout(temporizador))

// Rango completo o limpiado: se consulta de inmediato
watch(rangoDeFechas, (rango) => {
  if (!rango || (rango[0] && rango[1])) emitirFiltros()
})

// Si se cierra el calendario con una sola fecha elegida, se filtra ese día
const alCerrarCalendario = () => {
  const rango = rangoDeFechas.value
  if (rango?.[0] && !rango[1]) emitirFiltros()
}

// --- Helpers visuales ---
const estiloPago = (tipo) => {
  if (tipo === 'EFECTIVO')
    return 'bg-[#fef9c3] text-[#854d0e] px-2 py-1 rounded-full text-xs font-medium'
  if (tipo === 'TRANSFERENCIA')
    return 'bg-[#dbeafe] text-[#1d4ed8] px-2 py-1 rounded-full text-xs font-medium'
  if (tipo === 'TARJETA')
    return 'bg-[#f3e8ff] text-[#6b21a8] px-2 py-1 rounded-full text-xs font-medium'
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