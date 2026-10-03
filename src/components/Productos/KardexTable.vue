<template>
  <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm p-3 sm:p-5 font-['Inter',sans-serif]">

    <!-- 1. BARRA DE FILTROS RESPONSIVA -->
    <div class="w-full bg-[#fafdf7] p-4 sm:p-5 rounded-xl border border-[#e2e8dd] mb-5 shadow-xs">
      <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">

        <!-- Título y Subtexto -->
        <div class="shrink-0">
          <h2 class="text-base sm:text-lg font-bold text-[#1e3a2f] flex items-center gap-2 m-0">
            <i class="pi pi-history text-[#2b5e3b] text-xl"></i> Movimientos de Inventario (Kardex)
          </h2>
          <p class="text-xs text-gray-500 m-0 mt-1">
            Cantidades registradas en <strong class="text-[#2b5e3b] font-semibold">{{ unidadBase || 'Unidad Base' }}</strong>.
          </p>
        </div>

        <!-- Controles de Filtrado Adaptables a Móvil -->
        <div class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full xl:w-auto xl:justify-end">
          
          <!-- Selector Tipo Movimiento -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-sm text-[#1e3a2f] w-full sm:w-auto">
            <span class="font-semibold text-gray-700 text-xs sm:text-sm">Tipo:</span>
            <BaseSelect
              v-model="tipoMovimiento"
              :options="opcionesMovimiento"
              option-label="label"
              option-value="value"
              placeholder="Todos los movimientos"
              class="w-full sm:min-w-[190px]"
              @update:model-value="aplicarFiltro"
            />
          </div>

          <!-- Fecha Desde -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-sm text-[#1e3a2f] w-full sm:w-auto">
            <span class="font-semibold text-gray-700 text-xs sm:text-sm">Desde:</span>
            <input 
              type="date" 
              v-model="fechaInicio"
              class="w-full sm:w-auto bg-white border border-[#cbd5e1] rounded-lg text-sm px-3 py-2 text-[#1a2e1f] focus:outline-none focus:border-[#2b5e3b] shadow-2xs font-medium" 
            />
          </div>

          <!-- Fecha Hasta -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-sm text-[#1e3a2f] w-full sm:w-auto">
            <span class="font-semibold text-gray-700 text-xs sm:text-sm">Hasta:</span>
            <input 
              type="date" 
              v-model="fechaFin"
              class="w-full sm:w-auto bg-white border border-[#cbd5e1] rounded-lg text-sm px-3 py-2 text-[#1a2e1f] focus:outline-none focus:border-[#2b5e3b] shadow-2xs font-medium" 
            />
          </div>

          <!-- Botones de Acción -->
          <div class="flex items-center gap-2 w-full sm:w-auto pt-1 sm:pt-0">
            <Button 
              icon="pi pi-filter" 
              label="Filtrar"
              class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white text-sm font-semibold px-4 py-2 rounded-lg border-none transition-all cursor-pointer shadow-xs flex-1 sm:flex-none justify-center"
              @click="aplicarFiltro" 
            />

            <Button 
              icon="pi pi-refresh" 
              v-tooltip.top="'Limpiar / Refrescar'"
              class="!bg-white hover:!bg-[#eef2e9] !text-[#2b5e3b] !border !border-[#cfe0d2] rounded-lg p-2 transition-all cursor-pointer shadow-2xs shrink-0"
              @click="limpiarFiltros" 
            />
          </div>

        </div>

      </div>
    </div>

    <!-- 2. TARJETAS DE MÉTRICAS GLOBALES (1 Columna en móvil, 2 en sm, 4 en xl) -->
    <div class="kx-metrics">

      <!-- Total Entradas -->
      <div class="kx-metric-card kx-card-green">
        <div class="kx-metric-icon kx-icon-green">
          <i class="pi pi-arrow-down-left"></i>
        </div>
        <div class="kx-metric-body">
          <span class="kx-metric-label kx-label-green">Total Entradas</span>
          <div class="kx-metric-value-row">
            <span class="kx-metric-value">
              {{ kardexStore.cargando ? '—' : formatDecimal(kardexStore.metricas.total_entradas, 2) }}
            </span>
            <span class="kx-metric-unit kx-unit-green">{{ unidadBase }}</span>
          </div>
        </div>
      </div>

      <!-- Total Salidas -->
      <div class="kx-metric-card kx-card-rose">
        <div class="kx-metric-icon kx-icon-rose">
          <i class="pi pi-arrow-up-right"></i>
        </div>
        <div class="kx-metric-body">
          <span class="kx-metric-label kx-label-rose">Total Salidas</span>
          <div class="kx-metric-value-row">
            <span class="kx-metric-value kx-value-rose">
              {{ kardexStore.cargando ? '—' : formatDecimal(kardexStore.metricas.total_salidas, 2) }}
            </span>
            <span class="kx-metric-unit kx-unit-rose">{{ unidadBase }}</span>
          </div>
        </div>
      </div>

      <!-- Valor Entradas -->
      <div class="kx-metric-card kx-card-green">
        <div class="kx-metric-icon kx-icon-green">
          <i class="pi pi-dollar"></i>
        </div>
        <div class="kx-metric-body">
          <span class="kx-metric-label kx-label-green">Valor Entradas</span>
          <span class="kx-metric-value kx-value-block">
            ${{ kardexStore.cargando ? '0.00' : formatDecimal(kardexStore.metricas.monto_total_entradas, 2) }} 
          </span>
        </div>
      </div>

      <!-- Valor Salidas -->
      <div class="kx-metric-card kx-card-rose">
        <div class="kx-metric-icon kx-icon-rose">
          <i class="pi pi-wallet"></i>
        </div>
        <div class="kx-metric-body">
          <span class="kx-metric-label kx-label-rose">Valor Salidas</span>
          <span class="kx-metric-value kx-value-block kx-value-rose">
            ${{ kardexStore.cargando ? '0.00' : formatDecimal(kardexStore.metricas.monto_total_salidas, 2) }}
          </span>
        </div>
      </div>

    </div>

    <!-- ======================================================= -->
    <!-- VISTA MÓVIL: Tabla Kardex Desplegable (< 768px)          -->
    <!-- ======================================================= -->
    <div class="block md:hidden w-full border border-[#e2e8dd] rounded-xl overflow-hidden shadow-xs">
      <DataTable 
        v-model:expandedRows="expandedRows"
        :value="kardexStore.cargando ? Array.from({ length: 5 }) : kardexStore.movimientos" 
        lazy
        :paginator="!kardexStore.cargando && kardexStore.totalRecords > 0" 
        :rows="kardexStore.perPage"
        :totalRecords="kardexStore.totalRecords" 
        dataKey="id"
        class="p-datatable-custom text-xs w-full"
        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        currentPageReportTemplate="{first}-{last} de {totalRecords}" 
        @page="onPageChange"
      >
        <template #empty>
          <div class="text-center py-8 text-gray-400">
            No hay movimientos de Kardex registrados con los filtros seleccionados.
          </div>
        </template>

        <!-- Flecha de Expansión -->
        <Column expander style="width: 2.5rem" />

        <!-- Columna 1: Fecha -->
        <Column header="Fecha">
          <template #body="slotProps">
            <Skeleton v-if="kardexStore.cargando" width="80%" height="1rem" />
            <span v-else class="text-gray-700 font-medium block leading-tight text-[11px]">
              {{ formatearFecha(slotProps.data.created_at) }}
            </span>
          </template>
        </Column>

        <!-- Columna 2: Movimiento -->
        <Column header="Movimiento">
          <template #body="slotProps">
            <Skeleton v-if="kardexStore.cargando" width="5rem" height="1.2rem" borderRadius="8px" />
            <span v-else
              :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide inline-block whitespace-nowrap', obtenerBadgeClase(slotProps.data.tipo_movimiento)]">
              {{ formatearMovimiento(slotProps.data.tipo_movimiento) }}
            </span>
          </template>
        </Column>

        <!-- Plantilla de Expansión (Detalles en Tarjeta Móvil) -->
        <template #expansion="slotProps">
          <div class="p-3 bg-[#f8faf7] border-y border-[#e2e8dd] text-xs">
            <div class="bg-white p-3 rounded-lg border border-[#e2e8dd] shadow-xs space-y-2.5">
              
              <!-- Documento / Concepto -->
              <div>
                <span class="text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                  Documento / Concepto
                </span>
                <span class="font-bold text-[#1e3a2f] block">
                  {{ slotProps.data.numero_documento || 'S/N' }}
                </span>
                <span class="text-[11px] text-gray-600 block mt-0.5 break-words">
                  {{ slotProps.data.concepto || 'Sin concepto registrado' }}
                </span>
              </div>

              <!-- Cantidades Entrada / Salida -->
              <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <div>
                  <span class="text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                    Entrada
                  </span>
                  <span :class="[
                    'font-bold block',
                    Number(slotProps.data.cantidad_entrada) > 0 ? 'text-emerald-700' : 'text-gray-400'
                  ]">
                    {{ Number(slotProps.data.cantidad_entrada) > 0 ? '+' + formatDecimal(slotProps.data.cantidad_entrada, 4) : '—' }} {{ unidadBase }}
                  </span>
                </div>

                <div>
                  <span class="text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                    Salida
                  </span>
                  <span :class="[
                    'font-bold block',
                    Number(slotProps.data.cantidad_salida) > 0 ? 'text-rose-700' : 'text-gray-400'
                  ]">
                    {{ Number(slotProps.data.cantidad_salida) > 0 ? '-' + formatDecimal(slotProps.data.cantidad_salida, 4) : '—' }} {{ unidadBase }}
                  </span>
                </div>
              </div>

              <!-- Saldo Stock, CPP y Monto Saldo -->
              <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                <div>
                  <span class="text-[0.65rem] font-bold uppercase text-gray-500 block mb-0.5">Stock</span>
                  <span class="font-bold text-[#1e3a2f] block">
                    {{ formatDecimal(slotProps.data.cantidad_saldo, 2) }}
                  </span>
                </div>

                <div>
                  <span class="text-[0.65rem] font-bold uppercase text-gray-500 block mb-0.5">CPP</span>
                  <span class="font-semibold text-[#3c674b] block">
                    ${{ formatDecimal(slotProps.data.costo_promedio_ponderado, 2) }}
                  </span>
                </div>

                <div>
                  <span class="text-[0.65rem] font-bold uppercase text-gray-500 block mb-0.5">Monto Saldo</span>
                  <span class="font-bold text-[#2b5e3b] block">
                    ${{ formatDecimal(slotProps.data.monto_saldo, 2) }}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO: Tabla Completa Tradicional (>= 768px)  -->
    <!-- ======================================================= -->
    <div class="hidden md:block w-full overflow-x-auto border border-[#e2e8dd] rounded-xl">
      <DataTable :value="kardexStore.cargando ? Array.from({ length: 5 }) : kardexStore.movimientos" lazy
        :paginator="!kardexStore.cargando && kardexStore.totalRecords > 0" :rows="kardexStore.perPage"
        :totalRecords="kardexStore.totalRecords" responsiveLayout="scroll" class="p-datatable-custom text-xs w-full min-w-[50rem]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} movimientos" @page="onPageChange">

        <template #empty>
          <div class="text-center py-8 text-gray-400">
            No hay movimientos de Kardex registrados con los filtros seleccionados.
          </div>
        </template>

        <Column header="Fecha" class="w-[140px] whitespace-nowrap">
          <template #body="slotProps">
            <Skeleton v-if="kardexStore.cargando" width="80%" height="1rem" />
            <span v-else class="text-gray-600 font-medium">
              {{ formatearFecha(slotProps.data.created_at) }}
            </span>
          </template>
        </Column>

        <Column header="Movimiento" class="min-w-[9rem]">
          <template #body="slotProps">
            <Skeleton v-if="kardexStore.cargando" width="6rem" height="1.4rem" borderRadius="12px" />
            <span v-else
              :class="['px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider whitespace-nowrap inline-block', obtenerBadgeClase(slotProps.data.tipo_movimiento)]">
              {{ formatearMovimiento(slotProps.data.tipo_movimiento) }}
            </span>
          </template>
        </Column>

        <Column header="Documento / Concepto" class="min-w-[12rem]">
          <template #body="slotProps">
            <Skeleton v-if="kardexStore.cargando" width="90%" height="1rem" />
            <div v-else class="flex flex-col">
              <span class="font-semibold text-[#1e3a2f]">{{ slotProps.data.numero_documento || 'S/N' }}</span>
              <span class="text-[11px] text-gray-500 truncate max-w-[200px]">{{ slotProps.data.concepto }}</span>
            </div>
          </template>
        </Column>

        <Column header="Entrada" class="text-right min-w-[8rem]">
          <template #body="slotProps">
            <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
            <span v-else
              :class="{ 'text-emerald-700 font-semibold': Number(slotProps.data.cantidad_entrada) > 0, 'text-gray-400': Number(slotProps.data.cantidad_entrada) === 0 }"
              class="whitespace-nowrap">
              {{ Number(slotProps.data.cantidad_entrada) > 0 ? '+' + formatDecimal(slotProps.data.cantidad_entrada, 4) :
                '—' }} {{ unidadBase || 'Unidad Base' }}
            </span>
          </template>
        </Column>

        <Column header="Salida" class="text-right min-w-[8rem]">
          <template #body="slotProps">
            <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
            <span v-else
              :class="{ 'text-rose-700 font-semibold': Number(slotProps.data.cantidad_salida) > 0, 'text-gray-400': Number(slotProps.data.cantidad_salida) === 0 }"
              class="whitespace-nowrap">
              {{ Number(slotProps.data.cantidad_salida) > 0 ? '-' + formatDecimal(slotProps.data.cantidad_salida, 4) : '—'
              }} {{ unidadBase || 'Unidad Base' }}
            </span>
          </template>
        </Column>

        <Column header="Saldo Stock" class="text-right font-bold text-[#1e3a2f] min-w-[7rem]">
          <template #body="slotProps">
            <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
            <span v-else class="whitespace-nowrap">
              {{ formatDecimal(slotProps.data.cantidad_saldo, 4) }}
            </span>
          </template>
        </Column>

        <Column header="CPP" class="text-right min-w-[6.5rem]">
          <template #body="slotProps">
            <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
            <span v-else class="text-[#3c674b] font-medium whitespace-nowrap">
              ${{ formatDecimal(slotProps.data.costo_promedio_ponderado, 4) }}
            </span>
          </template>
        </Column>

        <Column header="Monto Saldo" class="text-right font-bold text-[#2b5e3b] min-w-[7.5rem]">
          <template #body="slotProps">
            <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
            <span v-else class="whitespace-nowrap">
              ${{ formatDecimal(slotProps.data.monto_saldo, 2) }}
            </span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import BaseSelect from '@/components/base/BaseSelect.vue'
import { useKardexStore } from '@/stores/kardexStore'
import { mostrarError, mostrarAlertaConfirmar } from '@/utils/SweetAlertService'

const props = defineProps({
  productoId: { type: [Number, String], required: true },
  unidadBase: { type: String, default: 'Unidad Base' }
})

const kardexStore = useKardexStore()
const expandedRows = ref({})

const obtenerPrimerDiaMes = () => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
}
const obtenerHoy = () => new Date().toISOString().split('T')[0]

const fechaInicio = ref(obtenerPrimerDiaMes())
const fechaFin = ref(obtenerHoy())
const tipoMovimiento = ref('')

const opcionesMovimiento = [
  { label: 'Todos los movimientos', value: '' },
  { label: 'Entrada por Compra', value: 'ENTRADA_COMPRA' },
  { label: 'Salida por Venta', value: 'SALIDA_VENTA' },
  { label: 'Anulación de Compra', value: 'ANULACION_COMPRA' },
  { label: 'Anulación de Venta', value: 'ANULACION_VENTA' },
  { label: 'Ajuste Positivo (+)', value: 'AJUSTE_POSITIVO' },
  { label: 'Ajuste Negativo (-)', value: 'AJUSTE_NEGATIVO' },
  { label: 'Reevaluación de Costo', value: 'REEVALUACION_COSTO' },
  { label: 'Cambio de Presentación', value: 'CAMBIO_PRESENTACION' },
]

onMounted(async () => {
  await consultarKardex()
})

onUnmounted(() => {
  kardexStore.limpiarKardex()
})

const consultarKardex = async (page = 1) => {
  if (!props.productoId) return

  const filtros = {
    fecha_inicio: fechaInicio.value,
    fecha_fin: fechaFin.value,
  }

  if (tipoMovimiento.value && tipoMovimiento.value.trim() !== '') {
    filtros.tipo_movimiento = tipoMovimiento.value.trim()
  }

  const res = await kardexStore.cargarKardex(props.productoId, page, kardexStore.perPage, filtros)
  if (res?.error) {
    mostrarAlertaConfirmar({
      tipo: 'advertencia',
      titulo: 'Atención',
      mensajeHtml: res.error || 'No se pudieron consultar los movimientos de inventario.'
    })
  }
}

const aplicarFiltro = () => consultarKardex(1)

const limpiarFiltros = () => {
  fechaInicio.value = obtenerPrimerDiaMes()
  fechaFin.value = obtenerHoy()
  tipoMovimiento.value = ''
  consultarKardex(1)
}

const onPageChange = (event) => consultarKardex(event.page + 1)

const formatDecimal = (valor, decimales = 2) => {
  const num = Number(valor)
  return isNaN(num) ? '0.00' : num.toFixed(decimales)
}

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '—'
  const f = new Date(fechaStr)
  return f.toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatearMovimiento = (tipo) => {
  const mapa = {
    'ENTRADA_COMPRA': 'Entrada Compra',
    'SALIDA_VENTA': 'Salida Venta',
    'ANULACION_COMPRA': 'Anulación Compra',
    'ANULACION_VENTA': 'Anulación Venta',
    'AJUSTE_POSITIVO': 'Ajuste (+)',
    'AJUSTE_NEGATIVO': 'Ajuste (-)',
    'REEVALUACION_COSTO': 'Reevaluación Costo',
    'CAMBIO_PRESENTACION': 'Cambio Presentación'
  }
  return mapa[tipo] || tipo
}

const obtenerBadgeClase = (tipo) => {
  switch (tipo) {
    case 'ENTRADA_COMPRA':
    case 'AJUSTE_POSITIVO':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-300'
    case 'SALIDA_VENTA':
    case 'AJUSTE_NEGATIVO':
      return 'bg-rose-100 text-rose-800 border border-rose-300'
    case 'ANULACION_COMPRA':
    case 'ANULACION_VENTA':
      return 'bg-amber-100 text-amber-800 border border-amber-300'
    case 'REEVALUACION_COSTO':
    case 'CAMBIO_PRESENTACION':
      return 'bg-blue-100 text-blue-800 border border-blue-300'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<style scoped>
:deep(.p-datatable-custom .p-datatable-thead > tr > th) {
  background-color: #fafdf7 !important;
  color: #3c674b !important;
  font-weight: 600 !important;
  font-size: 0.75rem !important;
  padding: 0.75rem 0.5rem !important;
  border-bottom: 1px solid #e2e8dd !important;
}

:deep(.p-datatable-custom .p-datatable-tbody > tr > td) {
  padding: 0.6rem 0.5rem !important;
}

:deep(.p-datatable-custom .p-datatable-tbody > tr:hover) {
  background-color: #eef5e9 !important;
}

/* Tarjetas de métricas responsivas */
.kx-metrics {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.75rem;
  width: 100%;
  margin-bottom: 1.25rem;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .kx-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media (min-width: 1280px) {
  .kx-metrics {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.kx-metric-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  box-sizing: border-box;
}

.kx-card-green {
  background-color: rgba(236, 253, 245, 0.8);
  border-color: #bfe3cf;
}

.kx-card-rose {
  background-color: rgba(255, 241, 242, 0.8);
  border-color: #f5d0d5;
}

.kx-metric-icon {
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  max-width: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.1rem;
  box-sizing: border-box;
}

.kx-icon-green {
  background-color: #d1fae5;
  border: 1px solid #86d9ab;
  color: #047857;
}

.kx-icon-rose {
  background-color: #ffe4e6;
  border: 1px solid #f0aab2;
  color: #be123c;
}

.kx-metric-body {
  flex: 1 1 0%;
  min-width: 0;
}

.kx-metric-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.kx-label-green {
  color: #065f46;
}

.kx-label-rose {
  color: #9f1239;
}

.kx-metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-top: 0.125rem;
}

.kx-metric-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e3a2f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kx-value-block {
  display: block;
  margin-top: 0.125rem;
  color: #2b5e3b;
  font-weight: 800;
  font-size: 1.1rem;
}

.kx-value-rose {
  color: #9f1239;
}

.kx-metric-unit {
  font-size: 0.7rem;
  font-weight: 600;
  flex-shrink: 0;
}

.kx-unit-green {
  color: #047857;
}

.kx-unit-rose {
  color: #be123c;
}
</style>