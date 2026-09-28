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
                {{ nombrePresentacion || 'Unidades' }}
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
      <!-- VISTA MÓVIL LOTES (Colores Verdes Institucionales)     -->
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

          <!-- Flecha de Expansión -->
          <Column expander style="width: 2.2rem" />

          <!-- Cód. Lote / Estado -->
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

          <!-- Stock Actual y Precio Venta -->
          <Column header="Stock Actual" class="text-right">
            <template #body="{ data }">
              <span class="font-bold text-[#1a2e1f] font-mono text-xs block">{{ formatNumber(data.cantidad_actual) }}</span>
              <span class="text-[10px] text-gray-500 font-mono block mt-0.5">
                <strong class="text-gray-400 font-normal">P.Venta:</strong> ${{ formatNumber(data.precio_venta) }}
              </span>
            </template>
          </Column>

          <!-- Desplegable Móvil Verde Uniforme -->
          <template #expansion="{ data }">
            <div class="p-3 bg-[#f4f7f2]/60 border-y border-[#e2e8dd] text-xs">
              <div class="bg-white p-3.5 rounded-xl border border-[#e2e8dd] shadow-2xs space-y-2.5">
                
                <!-- Fila 1: Cantidades -->
                <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#6b7280] block">Cant. Inicial</span>
                    <span class="font-mono text-xs text-[#334155] font-semibold">{{ formatNumber(data.cantidad_inicial) }}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-bold uppercase text-[#6b7280]  block">Costo Unit.</span>
                    <span class="font-mono text-xs text-[#334155] font-semibold">${{ formatNumber(data.costo_unitario_compra) }}</span>
                  </div>
                </div>

                <!-- Fila 2: Descuento y Vencimiento -->
                <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
                <div>
                  <span class="text-[10px] font-bold uppercase text-[#6b7280] block">Descuento</span>
                  <span v-if="Number(data.porcentaje_descuento) > 0" class="bg-[#f4f7f2] text-[#2b5e3b] font-bold px-2 py-0.5 rounded text-[10px] border border-[#dce4d7]">
                    {{ data.porcentaje_descuento }}%
                  </span>
                  <!-- Novedad: Etiqueta gris sólida en lugar de texto decolorido -->
                  <span v-else class="bg-gray-50 text-gray-600 font-medium px-2 py-0.5 rounded text-[10px] border border-gray-200">
                    Sin desc.
                  </span>
                </div>
                  <div class="text-right">
                    <span class="text-[10px] font-bold uppercase text-[#6b7280] block">Vencimiento</span>
                    <span class="font-mono text-xs text-[#1a2e1f] font-semibold">{{ formatFecha(data.fecha_vencimiento) }}</span>
                  </div>
                </div>

                <!-- Fila 3: Botones de Acción Móvil -->
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
      <!-- VISTA ESCRITORIO LOTES (Solo PC: hidden md:block)       -->
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

          <Column field="precio_venta" header="Precio Venta" class="text-sm text-right">
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
              <!-- Novedad: Etiqueta gris sólida para PC -->
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

    <!-- MODALES -->
    <Dialog v-model:visible="modalVisible" header="Gestionar Descuento" :style="{ width: '400px' }" modal :pt="{
      root: { class: '!rounded-2xl' },
      header: { class: '!pb-2 !border-b !border-gray-100' }
    }">
      <div class="flex flex-col gap-1.5">
          <BaseInputPercent
            v-model="porcentajeInput"
            label="Porcentaje de descuento (%)"
            :min="0"
            :min-fraction-digits="0"
          />
          <small class="text-xs text-gray-500">
            Este descuento se aplicará directamente al precio de venta del lote.
          </small>
        </div>
      <template #footer>
        <div class="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <Button label="Cancelar" icon="pi pi-times" severity="secondary" outlined @click="modalVisible = false"
            class="!rounded-xl !py-2 !px-4 text-sm cursor-pointer" />
          <Button label="Guardar" icon="pi pi-check" :loading="guardando"
            class="!bg-[#2b5e3b] !border-[#2b5e3b] !text-white !rounded-xl !py-2 !px-4 text-sm cursor-pointer"
            @click="guardarDescuento" />
        </div>
      </template>
    </Dialog>

    <AjusteLoteDialog v-model="mostrarModalAjuste" :lote="loteSeleccionado" :nombre-presentacion="nombrePresentacion"
      :unidad-medida="unidadMedida || 'Unidad'" @ajuste-realizado="refrescarTablaLotes" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import BaseInputPercent from '@/components/base/BaseInputPercent.vue'
import { useLoteStore } from '@/stores/loteStore'
import AjusteLoteDialog from '@/components/Inventario/AjusteLoteDialog.vue'

const props = defineProps({
  presentacionId: { type: [String, Number], required: true },
  nombrePresentacion: { type: String, default: '' },
  unidadMedida: { type: String, default: 'Unidad' },
})

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
  try {
    await loteStore.actualizarDescuento(
      loteSeleccionado.value.id,
      porcentajeInput.value,
      props.presentacionId
    )
    modalVisible.value = false
    await refrescarTablaLotes()
  } catch (e) {
    console.error(e)
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