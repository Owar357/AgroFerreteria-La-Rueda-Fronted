<template>
  <div class="bg-[#eef2e9] min-h-screen p-3 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <!-- ======================================================= -->
    <!-- VISTA MÓVIL ENCABEZADO (Solo Teléfono / Tablet < 1024px)-->
    <!-- ======================================================= -->
    <div class="block lg:hidden mb-4">
      <div class="flex items-center gap-3">
        <div class="!w-[2.5rem] !h-[2.5rem] rounded-xl bg-white border border-[#e2e8dd] shadow-2xs flex items-center justify-center shrink-0">
          <i class="pi pi-receipt text-[#2b5e3b] text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[#1a2e1f] leading-tight m-0">Historial de Ventas</h1>
          <p class="text-xs text-gray-500 mt-0.5 m-0">Consulta de transacciones e historial general</p>
        </div>
      </div>
    </div>

    
    <div class="hidden lg:flex items-center gap-3 mb-6">
      <div class="!w-[2.5rem] !h-[2.5rem] rounded-xl bg-white border border-[#e2e8dd] shadow-sm flex items-center justify-center shrink-0">
        <i class="pi pi-receipt text-[#2b5e3b] text-xl"></i>
      </div>
      <div>
        <h1 class="text-[1.75rem] md:text-[2rem] font-bold text-[#1a2e1f] leading-tight m-0">Historial de Ventas</h1>
        <p class="text-sm text-gray-500 mt-0.5 m-0">Consulta de transacciones del día e historial general</p>
      </div>
    </div>

    <!-- TARJETA CONTENEDORA PRINCIPAL -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm overflow-hidden w-full">
      
      <!-- ======================================================= -->
      <!-- VISTA MÓVIL FILTROS (Solo Teléfono / Tablet)           -->
      <!-- ======================================================= -->
      <div class="block lg:hidden p-4 border-b border-[#e2e8dd] bg-[#fbfdf9] space-y-3">
        <div class="flex flex-col gap-3">
          <IconField class="w-full">
            <InputIcon class="pi pi-search text-gray-400" />
            <InputText
              v-model="busqueda"
              placeholder="Buscar factura, vendedor..."
              maxlength="100"
              class="w-full !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-11 focus:!border-[#2b5e3b]"
            />
          </IconField>
          
          <div class="grid grid-cols-2 gap-2">
            <Select
              v-model="estadoSel"
              :options="opcionesEstado"
              placeholder="Estado..."
              class="w-full !bg-white !border-gray-300 text-sm rounded-xl h-11 flex items-center px-2"
            />
            <Select
              v-model="pagoSel"
              :options="opcionesPago"
              placeholder="Tipo pago..."
              class="w-full !bg-white !border-gray-300 text-sm rounded-xl h-11 flex items-center px-2"
            />
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1 border-t border-[#e2e8dd]/60">
            <span class="col-span-2 text-xs font-bold text-[#2b5e3b] uppercase tracking-wider block">
              Filtrar por fecha:
            </span>
            <DatePicker
              v-model="fechaInicio"
              :maxDate="fechaFin"
              placeholder="Desde"
              dateFormat="dd/mm/yy"
              :pt="{ pcInputText: { root: { readonly: true } } }"
              class="w-full !bg-white !border-gray-300 text-sm rounded-xl h-11"
            />
            <DatePicker
              v-model="fechaFin"
              :minDate="fechaInicio"
              placeholder="Hasta"
              dateFormat="dd/mm/yy"
              :pt="{ pcInputText: { root: { readonly: true } } }"
              class="w-full !bg-white !border-gray-300 text-sm rounded-xl h-11"
            />
          </div>
          
          <Button
            v-if="hayFiltros"
            label="Limpiar filtros"
            icon="pi pi-filter-slash"
            class="w-full !bg-white hover:!bg-[#f4f8f3] !text-[#2b5e3b] !border !border-[#2b5e3b]/40 text-sm font-semibold h-11 rounded-xl cursor-pointer shadow-2xs"
            @click="limpiarFiltros"
          />
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- VISTA ESCRITORIO FILTROS (Solo PC - 2 Filas Ordenadas) -->
      <!-- ======================================================= -->
      <div class="hidden lg:block p-5 border-b border-[#e2e8dd] bg-[#fbfdf9]">
        <div class="flex flex-col gap-3.5 w-full">
          <!-- FILA 1: Buscador, Estado y Tipo de Pago -->
          <div class="flex items-center gap-3 w-full">
            <IconField class="w-full md:w-[22rem]">
              <InputIcon class="pi pi-search text-[#6b7280] text-sm" />
              <InputText
                v-model="busqueda"
                placeholder="Nº factura o vendedor..."
                maxlength="100"
                class="w-full !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-11 focus:!border-[#2b5e3b]"
              />
            </IconField>

            <Select
              v-model="estadoSel"
              :options="opcionesEstado"
              placeholder="Todos los estados"
              class="w-full md:w-[12rem] !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-11 flex items-center px-2"
            />

            <Select
              v-model="pagoSel"
              :options="opcionesPago"
              placeholder="Tipos de pago"
              class="w-full md:w-[12rem] !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-11 flex items-center px-2"
            />
          </div>

          <!-- FILA 2: Fechas y Limpiar -->
          <div class="flex items-center gap-3 pt-2 border-t border-[#e2e8dd]/60">
            <span class="text-xs font-bold text-[#2b5e3b] uppercase tracking-wider shrink-0">
              Filtrar por fecha:
            </span>
            <div class="w-[12rem] shrink-0">
              <DatePicker
                v-model="fechaInicio"
                :maxDate="fechaFin"
                placeholder="Desde"
                dateFormat="dd/mm/yy"
                :pt="{ pcInputText: { root: { readonly: true } } }"
                class="w-full !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-11"
              />
            </div>
            <div class="w-[12rem] shrink-0">
              <DatePicker
                v-model="fechaFin"
                :minDate="fechaInicio"
                placeholder="Hasta"
                dateFormat="dd/mm/yy"
                :pt="{ pcInputText: { root: { readonly: true } } }"
                class="w-full !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-11"
              />
            </div>
            
            <Button
              v-if="hayFiltros"
              label="Limpiar filtros"
              icon="pi pi-filter-slash"
              class="ml-auto !bg-white hover:!bg-[#f4f8f3] !text-[#2b5e3b] !border !border-[#2b5e3b]/40 text-sm font-semibold h-11 px-6 rounded-xl cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
              @click="limpiarFiltros"
            />
          </div>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- BANNER DE FECHAS DINÁMICO                               -->
      <!-- ======================================================= -->
      <div class="px-4 py-3 sm:px-5 bg-white border-b border-[#e2e8dd] flex items-center gap-2.5">
        <span class="text-sm font-medium text-[#4b5563]">
          {{ textoRangoFechas }}
        </span>
      </div>  

      <!-- ======================================================= -->
      <!-- VISTA MÓVIL: Tabla con Desplegable (< 1024px)           -->
      <!-- ======================================================= -->
      <div class="block lg:hidden w-full">
        <DataTable
          v-model:expandedRows="expandedRows"
          :value="cargando ? Array.from({ length: filas }) : ventas"
          lazy
          paginator
          :rows="filas"
          :first="primero"
          :totalRecords="totalRegistros"
          dataKey="numero_factura"
          class="p-datatable-custom text-sm w-full"
          currentPageReportTemplate="{first}-{last} de {totalRecords}"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
          @page="onPage"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center py-8 text-gray-400">
              <i class="pi pi-inbox text-3xl mb-2 opacity-40" />
              <span class="text-sm font-medium">No hay ventas registradas</span>
            </div>
          </template>

          <Column expander style="width: 2.2rem" />

          <Column header="Factura / Vendedor">
            <template #body="slotProps">
              <div v-if="cargando" class="space-y-1">
                <Skeleton width="60%" height="1rem" />
                <Skeleton width="40%" height="0.8rem" />
              </div>
              <div v-else class="flex flex-col gap-0.5 items-start">
                <span class="font-mono text-[11px] bg-[#f1f5f0] text-[#334155] px-2 py-0.5 rounded border border-[#e2e8dd] font-bold uppercase whitespace-nowrap">
                  {{ slotProps.data.numero_factura }}
                </span>
                <span class="text-xs text-gray-600 truncate max-w-[150px] block">
                  {{ slotProps.data.vendido_por?.name || '—' }}
                </span>
              </div>
            </template>
          </Column>

          <Column header="Total / Estado" class="text-right">
            <template #body="slotProps">
              <div v-if="cargando" class="flex flex-col items-end gap-1">
                <Skeleton width="3.5rem" height="1rem" />
                <Skeleton width="4rem" height="1.2rem" borderRadius="12px" />
              </div>
              <div v-else class="flex flex-col items-end gap-1">
                <span class="font-bold text-[#1a2e1f] text-xs font-mono">
                  ${{ formatearMoneda(slotProps.data.total) }}
                </span>
                <Tag
                  :value="slotProps.data.estado"
                  :severity="slotProps.data.estado === 'PROCESADA' ? 'success' : 'danger'"
                  rounded
                  class="!text-[9px] !px-2 !py-0 whitespace-nowrap"
                />
              </div>
            </template>
          </Column>

          <template #expansion="slotProps">
            <div class="p-3 bg-[#f1f5f0] border-y border-[#e2e8dd] text-sm">
              <div class="bg-white p-3.5 rounded-xl border border-[#e2e8dd] shadow-2xs space-y-2.5">
                <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
                  <span class="text-[10px] font-bold uppercase text-[#6b7280]">Fecha Registro</span>
                  <span class="font-mono text-xs text-[#334155] font-semibold">{{ formatearFechaVisual(slotProps.data.created_at) }}</span>
                </div>
                <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
                  <span class="text-[10px] font-bold uppercase text-[#6b7280]">Tipo de Pago</span>
                  <span :class="estiloPago(slotProps.data.tipo_pago)">
                    <i class="pi text-[11px]" :class="iconoPago(slotProps.data.tipo_pago)" />
                    {{ slotProps.data.tipo_pago }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-bold uppercase text-[#6b7280]">Vendedor</span>
                  <span class="text-xs text-[#334155] font-medium">{{ slotProps.data.vendido_por?.name || '—' }}</span>
                </div>
              </div>
              <div class="mt-3 flex justify-end">
                <Button
                  icon="pi pi-eye"
                  label="Ver Detalle"
                  outlined
                  class="!border-[#2b5e3b] !text-[#2b5e3b] hover:!bg-[#f4f7f2] rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer shadow-2xs w-full justify-center"
                  @click="$emit('ver-detalle', slotProps.data)"
                />
              </div>
            </div>
          </template>
        </DataTable>
      </div>

      <!-- ======================================================= -->
      <!-- VISTA ESCRITORIO: Tabla Completa Tradicional (>= 1024px)-->
      <!-- ======================================================= -->
      <div class="hidden lg:block w-full overflow-x-auto">
        <DataTable
          :value="cargando ? Array.from({ length: filas }) : ventas"
          lazy
          paginator
          :rows="filas"
          :first="primero"
          :totalRecords="totalRegistros"
          responsiveLayout="scroll"
          class="p-datatable-custom text-sm w-full min-w-[55rem]"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} ventas"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          @page="onPage"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center py-12 text-gray-400">
              <i class="pi pi-inbox text-[48px] mb-3 text-gray-300" />
              <span class="text-[15px] font-medium">No hay ventas registradas para estos filtros</span>
            </div>
          </template>

          <Column field="vendido_por" header="Vendido por" class="font-semibold text-[#1a2e1f] min-w-[12rem]">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="65%" height="1.2rem" />
              <span v-else class="capitalize block">{{ slotProps.data.vendido_por?.name || '—' }}</span>
            </template>
          </Column>

          <Column field="numero_factura" header="N° Factura" class="min-w-[9.5rem]">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="5rem" height="1.2rem" />
              <span v-else class="font-mono text-xs bg-[#f1f5f0] text-[#334155] px-2 py-0.5 rounded border border-[#e2e8dd] font-bold uppercase">
                {{ slotProps.data.numero_factura }}
              </span>
            </template>
          </Column>

          <Column field="tipo_pago" header="Tipo de pago" class="min-w-[10rem]">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="6.5rem" height="1.5rem" borderRadius="20px" />
              <span v-else :class="estiloPago(slotProps.data.tipo_pago)">
                <i class="pi text-[11px]" :class="iconoPago(slotProps.data.tipo_pago)" />
                {{ slotProps.data.tipo_pago }}
              </span>
            </template>
          </Column>

          <Column field="estado" header="Estado" class="text-center min-w-[8.5rem]">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="5.5rem" height="1.5rem" borderRadius="20px" class="mx-auto" />
              <Tag
                v-else
                :value="slotProps.data.estado"
                :severity="slotProps.data.estado === 'PROCESADA' ? 'success' : 'danger'"
                rounded
                class="!text-xs !px-2.5 whitespace-nowrap"
              />
            </template>
          </Column>

          <Column field="created_at" header="Fecha" class="text-gray-600 min-w-[9rem]">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="5.5rem" height="1.2rem" />
              <span v-else class="font-mono text-xs">{{ formatearFechaVisual(slotProps.data.created_at) }}</span>
            </template>
          </Column>

          <Column field="total" header="Total" class="text-right min-w-[8.5rem]">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="4rem" height="1.2rem" class="ml-auto" />
              <span v-else class="font-bold text-[#1a2e1f] font-mono">${{ formatearMoneda(slotProps.data.total) }}</span>
            </template>
          </Column>

          <Column header="Acción" class="w-[6rem] shrink-0 text-center">
            <template #body="slotProps">
              <div class="flex items-center justify-center">
                <Skeleton v-if="cargando" shape="circle" size="2rem" />
                <Button
                  v-else
                  icon="pi pi-eye"
                  outlined
                  class="!border-[#2b5e3b] !text-[#2b5e3b] hover:!bg-[#f4f7f2] w-8 h-8 rounded-full p-0 transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
                  v-tooltip.top="'Ver detalle'"
                  @click="$emit('ver-detalle', slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, computed, nextTick } from 'vue'
import Skeleton from 'primevue/skeleton'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'

defineProps({
  ventas: { type: Array, required: true, default: () => [] },
  cargando: { type: Boolean, default: false },
  totalRegistros: { type: Number, default: 0 },
  filas: { type: Number, default: 8 },
  primero: { type: Number, default: 0 },
})

const emit = defineEmits(['ver-detalle', 'cambiar-pagina', 'cambiar-filtros'])

const expandedRows = ref({})
const ESTADO_TODOS = 'TODAS'

const opcionesEstado = ref([ESTADO_TODOS, 'PROCESADA', 'ANULADA'])
const opcionesPago = ref([ESTADO_TODOS, 'EFECTIVO', 'TRANSFERENCIA', 'TARJETA'])

const busqueda = ref('')
const estadoSel = ref(ESTADO_TODOS)
const pagoSel = ref(ESTADO_TODOS)

const fechaActual = new Date()
const fechaHaceUnMes = new Date()
fechaHaceUnMes.setMonth(fechaActual.getMonth() - 1)
const fechaInicio = ref(fechaHaceUnMes)
const fechaFin = ref(fechaActual)




const aISO = (fecha) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`

const formatearFechaVisual = (fechaISO) => {
  if (!fechaISO) return '—'
  const date = new Date(fechaISO)
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

const textoRangoFechas = computed(() => {
  if (!fechaInicio.value && !fechaFin.value) return 'Mostrando todo el historial de ventas'

  const opciones = { day: '2-digit', month: 'long', year: 'numeric' }

  if (fechaInicio.value && fechaFin.value) {
    const inicio = fechaInicio.value.toLocaleDateString('es-ES', opciones)
    const fin = fechaFin.value.toLocaleDateString('es-ES', opciones)
    return `Mostrando ventas del ${inicio} al ${fin}`
  } else if (fechaInicio.value) {
    return `Mostrando ventas desde el ${fechaInicio.value.toLocaleDateString('es-ES', opciones)}`
  } else if (fechaFin.value) {
    return `Mostrando ventas hasta el ${fechaFin.value.toLocaleDateString('es-ES', opciones)}`
  }
})

const emitirFiltros = () => {
  emit('cambiar-filtros', {
    search: busqueda.value.trim(),
    estado: estadoSel.value === ESTADO_TODOS ? '' : estadoSel.value,
    tipo_pago: pagoSel.value === ESTADO_TODOS ? '' : pagoSel.value,
    fecha_desde: fechaInicio.value ? aISO(fechaInicio.value) : '',
    fecha_hasta: fechaFin.value ? aISO(fechaFin.value) : '',
  })
}

const hayFiltros = computed(() => {
  return busqueda.value.trim() !== '' || 
         estadoSel.value !== ESTADO_TODOS || 
         pagoSel.value !== ESTADO_TODOS || 
         fechaInicio.value !== null || 
         fechaFin.value !== null
})

let limpiando = false
const limpiarFiltros = () => {
  limpiando = true
  busqueda.value = ''
  estadoSel.value = ESTADO_TODOS
  pagoSel.value = ESTADO_TODOS
  fechaInicio.value = null
  fechaFin.value = null
  
  emitirFiltros()
  
  nextTick(() => {
    limpiando = false
  })
}

watch([estadoSel, pagoSel, fechaInicio, fechaFin], () => {
  if (!limpiando) emitirFiltros()
})

let temporizador = null
watch(busqueda, () => {
  clearTimeout(temporizador)
  if (!limpiando) {
    temporizador = setTimeout(emitirFiltros, 400)
  }
})

onBeforeUnmount(() => clearTimeout(temporizador))

const onPage = (event) => {
  emit('cambiar-pagina', { page: event.page + 1, per_page: event.rows })
}

const estiloPago = (tipo) => {
  if (tipo === 'EFECTIVO') return 'inline-flex items-center gap-1.5 bg-[#fef9c3] text-[#854d0e] px-2.5 py-1 rounded-full text-xs font-semibold'
  if (tipo === 'TRANSFERENCIA') return 'inline-flex items-center gap-1.5 bg-[#dbeafe] text-[#1d4ed8] px-2.5 py-1 rounded-full text-xs font-semibold'
  if (tipo === 'TARJETA') return 'inline-flex items-center gap-1.5 bg-[#f3e8ff] text-[#6b21a8] px-2.5 py-1 rounded-full text-xs font-semibold'
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
  background-color: #fbfdf9 !important;
  color: #2b5e3b !important;
  font-weight: 600 !important;
  font-size: 0.8rem !important;
  padding: 0.75rem 1rem !important;
  border-bottom: 1px solid #e2e8dd !important;
  white-space: nowrap !important;
}

.p-datatable-custom .p-datatable-tbody > tr > td {
  padding: 0.75rem 1rem !important;
  font-size: 0.85rem !important;
  border-bottom: 1px solid #f1f5f0 !important;
}

.p-datatable-custom .p-datatable-tbody > tr:hover {
  background-color: #f4f8f3 !important;
}
</style>