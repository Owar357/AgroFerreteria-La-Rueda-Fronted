<template>
  <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm p-4 font-['Inter',sans-serif]">

    <!-- 1. BARRA DE FILTROS (ARRIBA, MÁS AMPLIA Y DISTRIBUIDA) -->
    <div class="w-full bg-[#fafdf7] p-5 rounded-xl border border-[#e2e8dd] mb-5 shadow-xs">
      <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">

        <!-- Título y Subtexto -->
        <div class="shrink-0">
          <h2 class="text-lg font-bold text-[#1e3a2f] flex items-center gap-2 m-0">
            <i class="pi pi-history text-[#2b5e3b] text-xl"></i> Movimientos de Inventario (Kardex)
          </h2>
          <p class="text-xs text-gray-500 m-0 mt-1">
            Cantidades registradas en <strong class="text-[#2b5e3b] font-semibold">{{ unidadBase || 'Unidad Base'
              }}</strong>.
          </p>
        </div>

        <!-- Controles de Filtrado (más grandes, distribuidos a lo ancho) -->
        <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto xl:justify-end">
          <!-- Selector Tipo Movimiento -->
          <div class="flex items-center gap-2 text-sm text-[#1e3a2f]">
            <span class="font-semibold text-gray-700">Tipo:</span>
            <select v-model="tipoMovimiento" @change="aplicarFiltro"
              class="bg-white border border-[#cbd5e1] rounded-lg text-sm px-3 py-2 text-[#1a2e1f] focus:outline-none focus:border-[#2b5e3b] cursor-pointer shadow-2xs font-medium min-w-[190px]">
              <option value="">Todos los movimientos</option>
              <option value="ENTRADA_COMPRA">Entrada por Compra</option>
              <option value="SALIDA_VENTA">Salida por Venta</option>
              <option value="ANULACION_COMPRA">Anulación de Compra</option>
              <option value="ANULACION_VENTA">Anulación de Venta</option>
              <option value="AJUSTE_POSITIVO">Ajuste Positivo (+)</option>
              <option value="AJUSTE_NEGATIVO">Ajuste Negativo (-)</option>
              <option value="REEVALUACION_COSTO">Reevaluación de Costo</option>
              <option value="CAMBIO_PRESENTACION">Cambio de Presentación</option>
            </select>
          </div>

          <!-- Fechas -->
          <div class="flex items-center gap-2 text-sm text-[#1e3a2f]">
            <span class="font-semibold text-gray-700">Desde:</span>
            <input type="date" v-model="fechaInicio"
              class="bg-white border border-[#cbd5e1] rounded-lg text-sm px-3 py-2 text-[#1a2e1f] focus:outline-none focus:border-[#2b5e3b] shadow-2xs font-medium" />
          </div>

          <div class="flex items-center gap-2 text-sm text-[#1e3a2f]">
            <span class="font-semibold text-gray-700">Hasta:</span>
            <input type="date" v-model="fechaFin"
              class="bg-white border border-[#cbd5e1] rounded-lg text-sm px-3 py-2 text-[#1a2e1f] focus:outline-none focus:border-[#2b5e3b] shadow-2xs font-medium" />
          </div>

          <!-- Botones de Acción -->
          <div class="flex items-center gap-2">
            <Button icon="pi pi-filter" label="Filtrar"
              class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white text-sm font-semibold px-4 py-2 rounded-lg border-none transition-all cursor-pointer shadow-xs"
              @click="aplicarFiltro" />

            <Button icon="pi pi-refresh" v-tooltip.top="'Limpiar / Refrescar'"
              class="!bg-white hover:!bg-[#eef2e9] !text-[#2b5e3b] !border !border-[#cfe0d2] rounded-lg p-2 transition-all cursor-pointer shadow-2xs"
              @click="limpiarFiltros" />
          </div>
        </div>

      </div>
    </div>

    <!-- 2. TARJETAS DE MÉTRICAS GLOBALES (CSS plano, no depende de Tailwind) -->
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



    <!-- Tabla Kardex -->
    <DataTable :value="kardexStore.cargando ? Array.from({ length: 5 }) : kardexStore.movimientos" lazy
      :paginator="!kardexStore.cargando && kardexStore.totalRecords > 0" :rows="kardexStore.perPage"
      :totalRecords="kardexStore.totalRecords" responsiveLayout="scroll" class="p-datatable-sm text-xs"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} movimientos" @page="onPageChange">

      <template #empty>
        <div class="text-center py-8 text-gray-400">
          No hay movimientos de Kardex registrados con los filtros seleccionados.
        </div>
      </template>

      <Column header="Fecha" class="w-[140px]">
        <template #body="slotProps">
          <Skeleton v-if="kardexStore.cargando" width="80%" height="1rem" />
          <span v-else class="text-gray-600 font-medium">
            {{ formatearFecha(slotProps.data.created_at) }}
          </span>
        </template>
      </Column>

      <Column header="Movimiento">
        <template #body="slotProps">
          <Skeleton v-if="kardexStore.cargando" width="6rem" height="1.4rem" borderRadius="12px" />
          <span v-else
            :class="['px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider', obtenerBadgeClase(slotProps.data.tipo_movimiento)]">
            {{ formatearMovimiento(slotProps.data.tipo_movimiento) }}
          </span>
        </template>
      </Column>

      <Column header="Documento / Concepto">
        <template #body="slotProps">
          <Skeleton v-if="kardexStore.cargando" width="90%" height="1rem" />
          <div v-else class="flex flex-col">
            <span class="font-semibold text-[#1e3a2f]">{{ slotProps.data.numero_documento || 'S/N' }}</span>
            <span class="text-[11px] text-gray-500 truncate max-w-[200px]">{{ slotProps.data.concepto }}</span>
          </div>
        </template>
      </Column>

      <Column header="Entrada" class="text-right">
        <template #body="slotProps">
          <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
          <span v-else
            :class="{ 'text-emerald-700 font-semibold': Number(slotProps.data.cantidad_entrada) > 0, 'text-gray-400': Number(slotProps.data.cantidad_entrada) === 0 }">
            {{ Number(slotProps.data.cantidad_entrada) > 0 ? '+' + formatDecimal(slotProps.data.cantidad_entrada, 4) :
              '—' }} {{ unidadBase || 'Unidad Base' }}
          </span>
        </template>
      </Column>

      <Column header="Salida" class="text-right">
        <template #body="slotProps">
          <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
          <span v-else
            :class="{ 'text-rose-700 font-semibold': Number(slotProps.data.cantidad_salida) > 0, 'text-gray-400': Number(slotProps.data.cantidad_salida) === 0 }">
            {{ Number(slotProps.data.cantidad_salida) > 0 ? '-' + formatDecimal(slotProps.data.cantidad_salida, 4) : '—'
            }} {{ unidadBase || 'Unidad Base' }}
          </span>
        </template>
      </Column>

      <Column header="Saldo Stock" class="text-right font-bold text-[#1e3a2f]">
        <template #body="slotProps">
          <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
          <span v-else>
            {{ formatDecimal(slotProps.data.cantidad_saldo, 4) }}
          </span>
        </template>
      </Column>

      <Column header="CPP" class="text-right">
        <template #body="slotProps">
          <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
          <span v-else class="text-[#3c674b] font-medium">
            ${{ formatDecimal(slotProps.data.costo_promedio_ponderado, 4) }}
          </span>
        </template>
      </Column>

      <Column header="Monto Saldo" class="text-right font-bold text-[#2b5e3b]">
        <template #body="slotProps">
          <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
          <span v-else>
            ${{ formatDecimal(slotProps.data.monto_saldo, 2) }}
          </span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import Swal from 'sweetalert2'
import { useKardexStore } from '@/stores/kardexStore'

const props = defineProps({
  productoId: { type: [Number, String], required: true },
  unidadBase: { type: String, default: 'Unidad Base' }
})

const kardexStore = useKardexStore()

const obtenerPrimerDiaMes = () => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
}
const obtenerHoy = () => new Date().toISOString().split('T')[0]

const fechaInicio = ref(obtenerPrimerDiaMes())
const fechaFin = ref(obtenerHoy())
const tipoMovimiento = ref('')

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
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: res.error,
      confirmButtonColor: '#2b5e3b',
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
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #fafdf7;
  color: #3c674b;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.75rem 0.5rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.6rem 0.5rem;
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #eef5e9 !important;
}

/* --- Tarjetas de métricas: CSS puro, no depende de utilidades de Tailwind --- */
.kx-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.25rem;
  box-sizing: border-box;
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
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  box-sizing: border-box;
}

.kx-card-green {
  background-color: rgba(236, 253, 245, 0.7);
  border-color: #bfe3cf;
}

.kx-card-rose {
  background-color: rgba(255, 241, 242, 0.7);
  border-color: #f5d0d5;
}

.kx-metric-icon {
  width: 2.75rem;
  height: 2.75rem;
  min-width: 2.75rem;
  max-width: 2.75rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.15rem;
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