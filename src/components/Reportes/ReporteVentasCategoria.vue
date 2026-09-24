<template>
  <div class="bg-[#eef2e9] min-h-screen p-6 font-['Inter',sans-serif]">
    <!-- Botón volver -->
    <Button
      icon="pi pi-arrow-left"
      label="Volver a reportes"
      severity="secondary"
      text
      class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white mb-6 !px-4 !py-2 !rounded-lg transition-all duration-200"
      @click="$emit('volver')"
    />

    <!-- Título -->
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-white p-3 rounded-2xl shadow-sm border border-[#e2e8dd]">
        <i class="pi pi-tags text-[24px] text-[#5F6B52]"></i>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-[#1e3a2f]">Reporte de Ventas por Categoría</h1>
        <p class="text-gray-500 text-sm mt-1">Ventas agrupadas por categoría de producto.</p>
      </div>
    </div>

    <!-- Card de filtros -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-6">
      <div class="flex items-center gap-2 mb-5 pb-4 border-b border-[#e2e8dd]">
        <i class="pi pi-filter text-[#e0b354] text-[18px]"></i>
        <span class="font-semibold text-[#1e3a2f] text-lg">Filtros</span>
      </div>

      <div class="flex flex-wrap items-end gap-4">
        <!-- Fecha inicio -->
        <div class="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label class="text-sm font-medium text-gray-600">Fecha inicio</label>
          <DatePicker
            v-model="fechaInicio"
            dateFormat="yy-mm-dd"
            placeholder="Seleccione fecha"
            showIcon
            class="w-full"
            :inputClass="'!border-gray-300 !text-[#1a2e1f] !text-sm !py-2 !px-3 !bg-white'"
          />
        </div>

        <!-- Fecha fin -->
        <div class="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label class="text-sm font-medium text-gray-600">Fecha fin</label>
          <DatePicker
            v-model="fechaFin"
            dateFormat="yy-mm-dd"
            placeholder="Seleccione fecha"
            showIcon
            class="w-full"
            :inputClass="'!border-gray-300 !text-[#1a2e1f] !text-sm !py-2 !px-3 !bg-white'"
          />
        </div>

        <!-- Categoría (opcional) -->
        <div class="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label class="text-sm font-medium text-gray-600">Categoría (opcional)</label>
          <Select
            v-model="categoriaId"
            :options="categorias"
            optionLabel="nombre"
            optionValue="id"
            placeholder="Todas las categorías"
            showClear
            filter
            filterPlaceholder="Buscar categoría..."
            scrollHeight="200px"
            class="w-full"
            :pt="{ input: { class: '!text-sm !py-2 !px-3' } }"
          />
        </div>

        <!-- Botones -->
        <div class="flex gap-3">
          <Button
            label="Generar PDF"
            icon="pi pi-file-pdf"
            :loading="generandoPDF"
            class="!bg-[#5F6B52] !border-[#5F6B52] !text-white !text-sm !px-5 !py-2"
            @click="generarPDF"
          />
          <Button
            label="Limpiar"
            icon="pi pi-times"
            severity="secondary"
            outlined
            class="!text-sm !px-5 !py-2 !border-gray-300 !text-gray-600"
            @click="limpiarFiltros"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import Select from 'primevue/select'
import { DatePicker } from 'primevue'
import Swal from 'sweetalert2'
import { api } from '@/services/authService'
import { generarReporteVentasPorCategoria } from '@/services/reporteService'

const emit = defineEmits(['volver'])

const fechaInicio = ref(null)
const fechaFin = ref(null)
const categoriaId = ref(null)
const categorias = ref([])

const formatFechaParam = (date) => {
  if (!date) return null
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const cargarCategorias = async () => {
  try {
    // El endpoint pagina por defecto con per_page=5; como aquí es solo
    // un filtro (no una tabla paginada), pedimos un límite alto para
    // traerlas todas de una sola vez.
    const res = await api.get('/categorias', { params: { per_page: 100 } })
    categorias.value = res.data.data ?? []
  } catch (error) {
    // Si falla la carga de categorías (o el usuario no es ADMIN y el
    // backend responde 403), el filtro simplemente queda vacío — el
    // reporte sigue funcionando sin filtrar por categoría.
    categorias.value = []
  }
}

onMounted(cargarCategorias)

const generandoPDF = ref(false)

const generarPDF = async () => {
  if (!fechaInicio.value || !fechaFin.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Fechas requeridas',
      text: 'Seleccione fecha inicio y fecha fin para generar el reporte.',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }

  generandoPDF.value = true
  try {
    await generarReporteVentasPorCategoria({
      fechaInicio: formatFechaParam(fechaInicio.value),
      fechaFin: formatFechaParam(fechaFin.value),
      categoriaId: categoriaId.value,
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo generar el reporte PDF.',
      confirmButtonColor: '#2b5e3b',
    })
  } finally {
    generandoPDF.value = false
  }
}

const limpiarFiltros = () => {
  fechaInicio.value = null
  fechaFin.value = null
  categoriaId.value = null
}
</script>

<style scoped>
:deep(.p-calendar .p-inputtext) {
  border-color: #d1d5db;
}
:deep(.p-calendar .p-inputtext:focus) {
  box-shadow: none !important;
  border-color: #2b5e3b !important;
}
</style>