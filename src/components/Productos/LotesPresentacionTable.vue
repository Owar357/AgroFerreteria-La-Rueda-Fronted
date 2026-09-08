<template>
  <div class="bg-[#eef2e9] min-h-screen p-6 font-['Inter',sans-serif]">
    <!-- Botón Volver -->
    <Button icon="pi pi-arrow-left" label="Volver a presentaciones" severity="secondary" text
      class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white mb-6 !px-4 !py-2 !rounded-lg transition-all duration-200"
      @click="volver" />

    <!-- Header / Título -->
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-white p-3 rounded-2xl shadow-sm border border-[#e2e8dd]">
        <i class="pi pi-box text-[24px] text-[#5F6B52]"></i>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-[#1e3a2f]">Gestión de Lotes</h1>
        <p class="text-gray-500 text-sm mt-1">
          Presentación: <span class="font-semibold text-[#1e3a2f]">{{ nombrePresentacion || '—' }}</span>
        </p>
      </div>
    </div>

    <!-- Tabla de Lotes -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm overflow-hidden">
      <DataTable :value="loteStore.lotes" :loading="loteStore.loading" lazy paginator :rows="loteStore.perPage"
        :totalRecords="loteStore.totalRecords" :first="(loteStore.currentPage - 1) * loteStore.perPage"
        @page="onPageChange" responsiveLayout="scroll" class="p-datatable-sm"
        emptyMessage="No hay lotes registrados para esta presentación.">
        <Column field="lote_interno" header="Cód. Lote" class="text-sm font-medium" />

        <Column field="cantidad_inicial" header="Cant. Inicial" class="text-sm text-right">
          <template #body="{ data }">
            {{ formatNumber(data.cantidad_inicial) }}
          </template>
        </Column>

        <Column field="cantidad_actual" header="Cant. Actual" class="text-sm text-right">
          <template #body="{ data }">
            <span class="font-bold text-[#1e3a2f]">{{ formatNumber(data.cantidad_actual) }}</span>
          </template>
        </Column>

        <Column field="costo_unitario_compra" header="Costo Unit." class="text-sm text-right">
          <template #body="{ data }">
            ${{ formatNumber(data.costo_unitario_compra) }}
          </template>
        </Column>

        <Column field="precio_venta" header="Precio Venta" class="text-sm text-right">
          <template #body="{ data }">
            ${{ formatNumber(data.precio_venta) }}
          </template>
        </Column>

        <Column field="porcentaje_descuento" header="Desc. (%)" class="text-sm text-center">
          <template #body="{ data }">
            <span v-if="Number(data.porcentaje_descuento) > 0"
              class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-xs">
              {{ data.porcentaje_descuento }}%
            </span>
            <span v-else class="text-gray-400">0%</span>
          </template>
        </Column>

        <Column field="fecha_vencimiento" header="Vencimiento" class="text-sm">
          <template #body="{ data }">
            {{ formatFecha(data.fecha_vencimiento) }}
          </template>
        </Column>

        <Column field="estado" header="Estado" class="text-sm text-center">
          <template #body="{ data }">
            <Tag :value="data.estado" :severity="severidadEstado(data.estado)" rounded />
          </template>
        </Column>

        <!-- Acciones corregidas -->
        <Column header="Acciones" class="text-sm text-center" style="width: 120px">
          <template #body="{ data }">
            <div class="flex justify-center gap-1">
              <!-- 1. Gestionar Descuento -->
              <Button icon="pi pi-tag" v-tooltip.top="'Gestionar Descuento'" severity="warning" text rounded
                :disabled="data.estado !== 'ACTIVO' || Number(data.cantidad_actual) <= 0"
                @click="abrirModalDescuento(data)" />

              <!-- 2. Ajuste de Inventario -->
              <Button icon="pi pi-sliders-h" v-tooltip.top="'Ajustar Inventario'" severity="help" text rounded
                :disabled="data.estado === 'INACTIVO'" @click="abrirModalAjuste(data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal para Descuentos -->
    <Dialog v-model:visible="modalVisible" header="Gestionar Descuento" :style="{ width: '380px' }" modal>
      <div class="flex flex-col gap-4 py-2">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-[#4b5563]">Porcentaje de descuento (%)</label>
          <InputNumber v-model="porcentajeInput" suffix="%" :min="0" :max="100" :minFractionDigits="0"
            :maxFractionDigits="2" class="w-full" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="Cancelar" icon="pi pi-times" severity="secondary" outlined @click="modalVisible = false" />
          <Button label="Guardar" icon="pi pi-check" :loading="guardando"
            class="!bg-[#2b5e3b] !border-[#2b5e3b] !text-white" @click="guardarDescuento" />
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
import InputNumber from 'primevue/inputnumber'
import { useLoteStore } from '@/stores/loteStore'

// Importación correcta del componente Modal de Ajuste
import AjusteLoteDialog from '@/components/Inventario/AjusteLoteDialog.vue'

const props = defineProps({
  presentacionId: { type: [String, Number], required: true },
  nombrePresentacion: { type: String, default: '' },
})

const loteStore = useLoteStore()
const emit = defineEmits(['volver'])

// Modales
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