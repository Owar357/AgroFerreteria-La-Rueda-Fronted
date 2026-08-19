<template>
  <div class="bg-[#eef2e9] min-h-screen p-6 mx-auto">
    <Button icon="pi pi-arrow-left" label="Volver a presentaciones" severity="secondary" text
      class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white mb-4 !px-4 !py-2 !rounded-lg transition-all duration-200"
      @click="$emit('volver')" />

    <div class="bg-white rounded-2xl border border-[#e8efe1] shadow-sm p-6 mb-6">
      <h1 class="text-2xl font-bold text-[#1e3a2f]">Lotes de la presentacion: {{ presentacion.nombre }}</h1>
      <p class="text-sm text-gray-600 mt-1">Historial de lotes registrados para esta presentación</p>
    </div>

    <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm">
      <DataTable
        :value="lotes"
        :loading="cargando"
        lazy
        :paginator="true"
        :rows="perPage"
        :totalRecords="totalRecords"
        responsiveLayout="scroll"
        class="p-datatable-sm"
        @page="onPageChange"
      >
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
        <Column field="estado" header="Estado" class="text-sm">
          <template #body="{ data }">
            <Tag :value="data.estado" :severity="severidadEstado(data.estado)" rounded />
          </template>
        </Column>

        <template #empty>
          <div class="text-center py-8 text-gray-400">
            Esta presentación aún no tiene lotes registrados
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Swal from 'sweetalert2'
import { getLotesByPresentacion } from '@/services/productoService'

const props = defineProps({
  presentacion: { type: Object, required: true },
})

const emit = defineEmits(['volver'])

const lotes = ref([])
const cargando = ref(false)
const totalRecords = ref(0)
const currentPage = ref(1)
const perPage = ref(5)

onMounted(async () => {
  await cargarLotes()
})

const cargarLotes = async (page = 1, rows = perPage.value) => {
  cargando.value = true
  try {
    const res = await getLotesByPresentacion(props.presentacion.id, page, rows)
    lotes.value = res.data.data
    totalRecords.value = res.data.total
    currentPage.value = res.data.current_page
    perPage.value = res.data.per_page
  } catch (error) {
    const status = error.response?.status
    if (status === 404) {
      Swal.fire({
        icon: 'error',
        title: 'Presentación no encontrada',
        text: 'Esta presentación ya no existe.',
        confirmButtonColor: '#2b5e3b',
      }).then(() => emit('volver'))
    } else if (status === 403) {
      Swal.fire({
        icon: 'error',
        title: 'Sin autorización',
        text: 'No tiene permisos para ver los lotes.',
        confirmButtonColor: '#2b5e3b',
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los lotes.',
        confirmButtonColor: '#2b5e3b',
      })
    }
  } finally {
    cargando.value = false
  }
}

const onPageChange = (event) => {
  cargarLotes(event.page + 1, event.rows)
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