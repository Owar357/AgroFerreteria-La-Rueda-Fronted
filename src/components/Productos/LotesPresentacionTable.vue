<template>
  <div class="bg-[#eef2e9] min-h-screen p-3 sm:p-6 font-['Inter',sans-serif]">
    
    <!-- ======================================================= -->
    <!-- BOTÓN VOLVER (Móvil Full / PC Fijo)                     -->
    <!-- ======================================================= -->
    <div class="mb-4">
      <!-- Vista Móvil -->
      <div class="block md:hidden">
        <Button icon="pi pi-arrow-left" label="Volver a presentaciones" severity="secondary" text
          class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white !px-4 !py-3 !rounded-xl transition-all cursor-pointer text-sm font-semibold w-full flex justify-center"
          @click="volver" />
      </div>

      <!-- Vista Escritorio -->
      <div class="hidden md:flex items-center justify-between">
        <Button icon="pi pi-arrow-left" label="Volver a presentaciones" severity="secondary" text
          class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white !px-4 !py-2 !rounded-xl transition-all cursor-pointer text-sm font-semibold"
          @click="volver" />
      </div>
    </div>

    <!-- TARJETA CABECERA PRINCIPAL CON MÉTRICAS DEL BACKEND -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-4 sm:p-5 mb-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div class="flex items-center gap-3.5">
          <div class="bg-[#f4f7f2] p-3 sm:p-3.5 rounded-2xl border border-[#dce4d7] shrink-0">
            <i class="pi pi-box text-[22px] sm:text-[26px] text-[#2b5e3b]"></i>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-[#1a2e1f] m-0">Gestión de Lotes</h1>
            <p class="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1 m-0">
              Control de existencias por lote de entrada, fecha de vencimiento y costos
            </p>
          </div>
        </div>

        <!-- BADGES MÉTRICOS GLOBALES -->
        <div class="grid grid-cols-2 md:flex gap-3 sm:gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
          <div class="bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-200/60 min-w-[120px]">
            <span class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Lotes</span>
            <span class="text-base sm:text-lg font-bold text-[#1a2e1f] font-mono">{{ loteStore.totalRecords }}</span>
          </div>
          <div class="bg-[#f4f9f5] px-3.5 py-2.5 rounded-xl border border-[#e3efe6] min-w-[140px]">
            <span class="text-[10px] sm:text-xs font-semibold text-[#2b5e3b] uppercase tracking-wider block">Stock Total</span>
            <div class="flex items-baseline gap-1">
              <span class="text-base sm:text-lg font-bold text-[#2b5e3b] font-mono">{{ formatNumber(loteStore.stockTotalActivo) }}</span>
              <span class="text-[11px] sm:text-xs font-semibold text-[#2b5e3b]/80 capitalize font-mono truncate">
                {{ etiquetaStock || 'Unidades' }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- SECCIÓN REGISTROS -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm overflow-hidden">
      <div class="p-4 sm:p-5 border-b border-[#e2e8dd] bg-[#fbfdf9] flex justify-between items-center">
        <h2 class="text-base sm:text-lg font-bold text-[#1a2e1f] m-0 flex items-center gap-2">
          <i class="pi pi-list text-[#2b5e3b]"></i> Registros de Entrada
        </h2>
        <span class="text-[11px] sm:text-xs text-gray-400">Ordenados por ingreso</span>
      </div>

      <!-- ======================================================= -->
      <!-- VISTA MÓVIL LOTES                                       -->
      <!-- ======================================================= -->
      <div class="block md:hidden">
        <DataTable 
          v-model:expandedRows="expandedRows"
          :value="loteStore.lotes" 
          :loading="loteStore.cargando" 
          lazy 
          paginator 
          :rows="loteStore.perPage"
          :totalRecords="loteStore.totalRecords" 
          :first="(loteStore.currentPage - 1) * loteStore.perPage"
          @page="onPageChange"
          dataKey="id" 
          class="p-datatable-custom text-xs w-full"
        >
          <template #empty>
            <div class="text-center py-8 text-gray-400 text-xs">No hay lotes registrados para esta presentación.</div>
          </template>

          <Column expander style="width: 2.2rem" />

          <Column header="Lote / Estado">
            <template #body="{ data }">
              <div class="flex flex-col gap-1 items-start">
                <span class="font-mono text-[11px] bg-[#f4f7f2] text-[#1a2e1f] px-2 py-0.5 rounded-md border border-[#dce4d7] font-bold">
                  {{ data.lote_interno }}
                </span>
                <Tag :value="data.estado" :severity="severidadEstado(data.estado)" rounded class="!text-[9px] !px-2 !py-0" />
              </div>
            </template>
          </Column>

          <Column header="Stock Actual" class="text-right">
            <template #body="{ data }">
              <span class="font-bold text-[#1a2e1f] font-mono text-xs block">{{ formatNumber(data.cantidad_actual) }}</span>
              <span v-if="!esGranel" class="text-[10px] text-gray-500 font-mono block mt-0.5">
                <strong class="text-gray-400 font-normal">P.Venta:</strong> ${{ formatNumber(data.precio_venta) }}
              </span>
            </template>
          </Column>

          <template #expansion="{ data }">
            <div class="p-3 bg-[#f4f7f2]/60 border-y border-[#e2e8dd] text-xs">
              <div class="bg-white p-3.5 rounded-xl border border-[#e2e8dd] shadow-2xs space-y-2.5">
                
                <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#6b7280] block">Cant. Inicial</span>
                    <span class="font-mono text-xs text-[#334155] font-semibold">{{ formatNumber(data.cantidad_inicial) }}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-bold uppercase text-[#6b7280] block">Costo Unit.</span>
                    <span class="font-mono text-xs text-[#334155] font-semibold">${{ formatNumber(data.costo_unitario_compra) }}</span>
                  </div>
                </div>

                <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#6b7280] block">Descuento</span>
                    <span v-if="Number(data.porcentaje_descuento) > 0" class="bg-[#f4f7f2] text-[#2b5e3b] font-bold px-2 py-0.5 rounded text-[10px] border border-[#dce4d7]">
                      {{ data.porcentaje_descuento }}%
                    </span>
                    <span v-else class="bg-gray-50 text-gray-600 font-medium px-2 py-0.5 rounded text-[10px] border border-gray-200">
                      Sin desc.
                    </span>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-bold uppercase text-[#6b7280] block">Vencimiento</span>
                    <span class="font-mono text-xs text-[#1a2e1f] font-semibold">{{ formatFecha(data.fecha_vencimiento) }}</span>
                  </div>
                </div>

                <div class="pt-1 flex justify-end gap-2">
                  <Button icon="pi pi-tag" label="Descuento" severity="secondary" outlined size="small"
                    class="!py-1.5 !px-3 !text-xs !text-[#2b5e3b] !border-[#2b5e3b] hover:!bg-[#f4f7f2] rounded-lg cursor-pointer font-medium"
                    :disabled="data.estado !== 'ACTIVO' || Number(data.cantidad_actual) <= 0"
                    @click="abrirModalDescuento(data)" />

                  <Button icon="pi pi-sliders-h" label="Ajustar" severity="secondary" outlined size="small"
                    class="!py-1.5 !px-3 !text-xs !text-[#1a2e1f] !border-[#1a2e1f] hover:!bg-[#f4f7f2] rounded-lg cursor-pointer font-medium"
                    :disabled="data.estado === 'INACTIVO'" 
                    @click="abrirModalAjuste(data)" />
                </div>

              </div>
            </div>
          </template>
        </DataTable>
      </div>

      <!-- ======================================================= -->
      <!-- VISTA ESCRITORIO LOTES                                  -->
      <!-- ======================================================= -->
      <div class="hidden md:block">
        <DataTable :value="loteStore.lotes" :loading="loteStore.cargando" lazy paginator :rows="loteStore.perPage"
          :totalRecords="loteStore.totalRecords" :first="(loteStore.currentPage - 1) * loteStore.perPage"
          @page="onPageChange" responsiveLayout="scroll" class="p-datatable-sm"
          emptyMessage="No hay lotes registrados para esta presentación.">

          <Column field="lote_interno" header="Cód. Lote" class="text-sm font-semibold text-gray-800">
            <template #body="{ data }">
              <span
                class="font-mono text-xs bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md border border-gray-200 font-bold">
                {{ data.lote_interno }}
              </span>
            </template>
          </Column>

          <Column field="cantidad_inicial" header="Cant. Inicial" class="text-sm text-right">
            <template #body="{ data }">
              <span class="text-gray-500 font-mono text-xs">{{ formatNumber(data.cantidad_inicial) }}</span>
            </template>
          </Column>

          <Column field="cantidad_actual" header="Cant. Actual" class="text-sm text-right">
            <template #body="{ data }">
              <span class="font-bold text-[#1a2e1f] font-mono text-sm">{{ formatNumber(data.cantidad_actual) }}</span>
            </template>
          </Column>

          <Column field="costo_unitario_compra" header="Costo Unit." class="text-sm text-right">
            <template #body="{ data }">
              <span class="text-gray-600 font-mono text-xs">${{ formatNumber(data.costo_unitario_compra) }}</span>
            </template>
          </Column>

          <Column v-if="!esGranel" field="precio_venta" header="Precio Venta" class="text-sm text-right">
            <template #body="{ data }">
              <span class="font-semibold text-gray-800 font-mono text-xs">${{ formatNumber(data.precio_venta) }}</span>
            </template>
          </Column>

          <Column field="porcentaje_descuento" header="Desc. (%)" class="text-sm text-center">
            <template #body="{ data }">
              <span v-if="Number(data.porcentaje_descuento) > 0"
                class="bg-[#f4f7f2] text-[#2b5e3b] font-bold px-2 py-0.5 rounded-md text-xs border border-[#dce4d7]">
                {{ data.porcentaje_descuento }}%
              </span>
              <span v-else class="bg-gray-50 text-gray-600 font-medium px-2 py-0.5 rounded-md text-xs border border-gray-200">
                0%
              </span>
            </template>
          </Column>

          <Column field="fecha_vencimiento" header="Vencimiento" class="text-sm">
            <template #body="{ data }">
              <span class="text-xs text-gray-600 font-mono">{{ formatFecha(data.fecha_vencimiento) }}</span>
            </template>
          </Column>

          <Column field="estado" header="Estado" class="text-sm text-center">
            <template #body="{ data }">
              <Tag :value="data.estado" :severity="severidadEstado(data.estado)" rounded class="!text-xs !px-2.5" />
            </template>
          </Column>

          <!-- ACCIONES PC -->
          <Column header="Acciones" class="text-sm text-center" style="width: 130px">
            <template #body="{ data }">
              <div class="flex justify-center gap-1.5">
                <Button icon="pi pi-tag" v-tooltip.top="'Gestionar Descuento'"
                  class="!bg-white hover:!bg-[#fffbeb] !text-[#2b5e3b] !border-[#2b5e3b] rounded-lg !p-2 transition-all cursor-pointer"
                  :disabled="data.estado !== 'ACTIVO' || Number(data.cantidad_actual) <= 0"
                  @click="abrirModalDescuento(data)" />

                <Button icon="pi pi-sliders-h" v-tooltip.top="'Ajustar Inventario'"
                  class="!bg-white hover:!bg-[#f5f3ff] !text-[#1a2e1f] !border-[#1a2e1f] rounded-lg !p-2 transition-all cursor-pointer"
                  :disabled="data.estado === 'INACTIVO'" @click="abrirModalAjuste(data)" />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-10 text-gray-400 text-sm">No hay lotes registrados para esta presentación.</div>
          </template>
        </DataTable>
      </div>

    </div>

    <!-- ======================================================= -->
    <!-- DIÁLOGO ESTANDARIZADO: GESTIONAR DESCUENTO              -->
    <!-- ======================================================= -->
    <Dialog 
      v-model:visible="modalVisible" 
      header="GESTIONAR DESCUENTO" 
      modal 
      :draggable="false"
      :closable="false"
      :style="{ width: 'min(calc(100vw - 2rem), 34rem)' }"
      class="custom-dialog"
      :pt="{ root: { class: '!rounded-2xl overflow-hidden shadow-2xl' } }"
    >
      <!-- VISTA MÓVIL (< 640px) -->
      <div class="block sm:hidden bg-white p-4 text-[#1a2e1f] space-y-4 font-['Inter',sans-serif]">
        <BaseInputPercent
          v-model="porcentajeInput"
          label="Porcentaje de descuento (%)"
          :min="0"
          :min-fraction-digits="0"
          help="Este descuento se aplicará directamente al precio de venta del lote."
        />

        <div class="pt-3 flex flex-col gap-2 w-full">
          <Button 
            label="Guardar" 
            :loading="guardando"
            class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-xs font-bold py-3 rounded-xl border-none cursor-pointer shadow-md w-full"
            @click="guardarDescuento" 
          />
          <Button 
            label="Cerrar" 
            icon="pi pi-times" 
            severity="secondary" 
            outlined 
            class="!text-xs !py-3 !border-[#cbd5e1] !text-gray-600 !rounded-xl !w-full font-semibold cursor-pointer"
            @click="modalVisible = false" 
          />
        </div>
      </div>

      <!-- VISTA ESCRITORIO (>= 640px) -->
      <div class="hidden sm:flex bg-white p-6 text-[#1a2e1f] flex-col gap-5 font-['Inter',sans-serif]">
        <BaseInputPercent
          v-model="porcentajeInput"
          label="Porcentaje de descuento (%)"
          :min="0"
          :min-fraction-digits="0"
          help="Este descuento se aplicará directamente al precio de venta del lote."
        />

        <div class="flex justify-between items-center mt-1 pt-4 border-t border-[#e2e8dd] w-full">
          <Button 
            label="Cerrar" 
            icon="pi pi-times" 
            severity="secondary" 
            outlined 
            class="!text-sm !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl font-semibold cursor-pointer w-[47%] flex justify-center items-center"
            @click="modalVisible = false" 
          />
          <Button 
            label="Guardar" 
            :loading="guardando"
            class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold !py-2.5 rounded-xl border-none cursor-pointer shadow-lg transition-colors w-[47%] flex justify-center items-center"
            @click="guardarDescuento" 
          />
        </div>
      </div>
    </Dialog>

    <!-- MODAL AUXILIAR DE AJUSTE DE LOTE -->
    <AjusteLoteDialog 
      v-model="mostrarModalAjuste" 
      :lote="loteSeleccionado" 
      :nombre-presentacion="etiquetaStock"
      :unidad-medida="unidadMedida || 'Unidad'" 
      @ajuste-realizado="refrescarTablaLotes" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import BaseInputPercent from '@/components/base/BaseInputPercent.vue'
import { useLoteStore } from '@/stores/loteStore'
import AjusteLoteDialog from '@/components/Inventario/AjusteLoteDialog.vue'
import { 
  mostrarExito, 
  mostrarError, 
  mostrarCargando 
} from '@/utils/SweetAlertService'

const props = defineProps({
  presentacionId: { type: [String, Number], required: true },
  nombrePresentacion: { type: String, default: '' },
  unidadMedida: { type: String, default: 'Unidad' },
  esGranel: { type: Boolean, default: false },
  nombreBase: { type: String, default: '' },
})

// En granel el stock está en la unidad base; en unidad fija, en la propia presentación
const etiquetaStock = computed(() =>
  props.esGranel && props.nombreBase ? props.nombreBase : props.nombrePresentacion,
)

const loteStore = useLoteStore()
const emit = defineEmits(['volver'])

const expandedRows = ref({})
const modalVisible = ref(false)
const mostrarModalAjuste = ref(false)
const loteSeleccionado = ref(null)
const porcentajeInput = ref(0)
const guardando = ref(false)

onMounted(async () => {
  await loteStore.fetchLotesByPresentacion(props.presentacionId)
})

const refrescarTablaLotes = async () => {
  await loteStore.fetchLotesByPresentacion(
    props.presentacionId,
    loteStore.currentPage,
    loteStore.perPage
  )
}

const onPageChange = (event) => {
  loteStore.fetchLotesByPresentacion(props.presentacionId, event.page + 1, event.rows)
}

const abrirModalAjuste = (lote) => {
  loteSeleccionado.value = lote
  mostrarModalAjuste.value = true
}

const abrirModalDescuento = (lote) => {
  loteSeleccionado.value = lote
  porcentajeInput.value = Number(lote.porcentaje_descuento ?? 0)
  modalVisible.value = true
}

const guardarDescuento = async () => {
  if (!loteSeleccionado.value) return
  
  guardando.value = true
  mostrarCargando('Guardando descuento...', 'Actualizando el precio del lote')

  try {
    await Promise.all([
      loteStore.actualizarDescuento(
        loteSeleccionado.value.id,
        porcentajeInput.value,
        props.presentacionId
      ),
      new Promise((resolve) => setTimeout(resolve, 500))
    ])

    modalVisible.value = false
    mostrarExito('¡Descuento aplicado!', 'El porcentaje de descuento se actualizó con éxito.')
  } catch (e) {
    const msg = e.response?.data?.message || 'No se pudo aplicar el descuento al lote.'
    mostrarError('Error al guardar', msg)
  } finally {
    guardando.value = false
  }
}
const volver = () => {
  emit('volver')
}

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-SV', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const formatNumber = (value) => Number(value ?? 0).toFixed(2)

const severidadEstado = (estado) => {
  const mapa = {
    ACTIVO: 'success',
    DAÑADO: 'warning',
    AGOTADO: 'secondary',
    VENCIDO: 'danger',
    ANULADO: 'contrast',
  }
  return mapa[estado] ?? 'info'
}
</script>

<style>
.custom-dialog .p-dialog-header {
  background-color: #1a3323 !important;
  color: #ffffff !important;
  border-bottom: 1px solid #2b5e3b !important;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 1.1rem 1.5rem !important;
}

.custom-dialog .p-dialog-content {
  background-color: #ffffff !important;
  padding: 0 !important;
}

.p-inputtext:enabled:focus,
.p-inputnumber-input:enabled:focus,
.p-select:not(.p-disabled).p-focus,
.p-password-input:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #fbfdf9;
  color: #2b5e3b;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 0.75rem 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f4f8f3 !important;
}
</style>