<template>
  <div class="bg-[#eef2e9] min-h-screen p-6 mx-auto">
    <Button icon="pi pi-arrow-left" label="Volver a presentaciones" severity="secondary" text
      class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white mb-4 !px-4 !py-2 !rounded-lg transition-all duration-200"
      @click="volver" />

    <div class="bg-white rounded-2xl border border-[#e8efe1] shadow-sm p-6 mb-6">
      <h1 class="text-2xl font-bold text-[#1e3a2f]">Lotes de: {{ nombrePresentacion }}</h1>
      <p class="text-sm text-gray-600 mt-1">Historial de lotes registrados para esta presentación</p>
    </div>

    <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm">
      <DataTable :value="loteStore.lotes" :loading="loteStore.cargando" lazy :paginator="true" :rows="loteStore.perPage"
        :totalRecords="loteStore.totalRecords" responsiveLayout="scroll" class="p-datatable-sm" @page="onPageChange">
        <Column field="lote_interno" header="Lote Interno" class="text-sm" />
        <Column field="lote_fabricante" header="Lote Fabricante" class="text-sm">
          <template #body="{ data }">{{ data.lote_fabricante ?? '—' }}</template>
        </Column>
        <Column field="fecha_vencimiento" header="Fecha Vencimiento" class="text-sm">
          <template #body="{ data }">{{ formatFecha(data.fecha_vencimiento) }}</template>
        </Column>
        <Column field="cantidad_inicial" header="Cant. Inicial" class="text-sm" />
        <Column field="cantidad_actual" header="Cant. Actual" class="text-sm" />
        <Column field="costo_unitario_compra" header="Costo Unitario" class="text-sm">
          <template #body="{ data }">${{ formatNumber(data.costo_unitario_compra) }}</template>
        </Column>

        <!-- COLUMNA % DESCUENTO PROMO -->
        <Column field="porcentaje_descuento" header="% Oferta" class="text-sm">
          <template #body="{ data }">
            <span v-if="Number(data.porcentaje_descuento) > 0"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {{ Number(data.porcentaje_descuento) }}%
            </span>
            <span v-else class="text-gray-400 text-xs">0%</span>
          </template>
        </Column>
        <Column field="estado" header="Estado" class="text-sm">
          <template #body="{ data }">
            <Tag :value="data.estado" :severity="severidadEstado(data.estado)" rounded />
          </template>
        </Column>

        <!-- COLUMNA ACCIONES PARA EDITAR DESCUENTO -->
        <Column header="Acciones" class="text-sm text-center" style="width: 120px">
          <template #body="{ data }">
            <Button icon="pi pi-tag" v-tooltip.top="'Gestionar Descuento'" severity="warning" text rounded
              :disabled="data.estado !== 'ACTIVO' || Number(data.cantidad_actual) <= 0"
              @click="abrirModalDescuento(data)" />
          </template>
        </Column>

        <template #empty>
          <div class="text-center py-8 text-gray-400">
            Esta presentación aún no tiene lotes registrados
          </div>
        </template>
      </DataTable>
    </div>

    <!-- MODAL DE ASIGNACIÓN DE DESCUENTO -->
    <Dialog v-model:visible="modalVisible" header="Gestionar Descuento Promocional" :modal="true"
      class="w-full max-w-md">
      <div v-if="loteSeleccionado" class="space-y-4 pt-2">
        <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm space-y-1">
          <p><strong>Lote:</strong> {{ loteSeleccionado.lote_interno }}</p>
          <p><strong>Stock Actual:</strong> {{ loteSeleccionado.cantidad_actual }}</p>
          <p><strong>Vencimiento:</strong> {{ formatFecha(loteSeleccionado.fecha_vencimiento) }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">% Porcentaje de Descuento</label>
          <InputNumber v-model="porcentajeInput" suffix="%" :min="0" :max="100" :minFractionDigits="0"
            :maxFractionDigits="2" class="w-full" placeholder="0 %" />
          <p class="text-xs text-gray-500 mt-1">Ingrese 0 si desea quitar la promoción al lote.</p>
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" severity="secondary" text @click="modalVisible = false" />
        <Button label="Guardar Descuento" icon="pi pi-check" severity="success" :loading="guardando"
          @click="guardarDescuento" />
      </template>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import { useLoteStore } from '@/stores/loteStore'

const props = defineProps({
  presentacionId: { type: [String, Number], required: true },
  nombrePresentacion: { type: String, default: '' },
})

const router = useRouter()
const loteStore = useLoteStore()

// Modal
const modalVisible = ref(false)
const loteSeleccionado = ref(null)
const porcentajeInput = ref(0)
const guardando = ref(false)

onMounted(async () => {
  await loteStore.fetchLotesByPresentacion(props.presentacionId)
})

const onPageChange = (event) => {
  loteStore.fetchLotesByPresentacion(props.presentacionId, event.page + 1, event.rows)
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

    await loteStore.fetchLotesByPresentacion(props.presentacionId, loteStore.currentPage, loteStore.perPage)

  } catch (e) {

  } finally {
    guardando.value = false
  }
}

const volver = () => router.back()

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