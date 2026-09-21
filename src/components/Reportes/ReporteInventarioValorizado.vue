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
        <i class="pi pi-box text-[24px] text-[#5F6B52]"></i>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-[#1e3a2f]">Reporte de Inventario Valorizado</h1>
        <p class="text-gray-500 text-sm mt-1">
          Auditoría del inventario a costo y a venta, con alertas de margen de ganancia reducido.
        </p>
      </div>
    </div>

    <!-- Card de filtros -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-6">
      <div class="flex items-center gap-2 mb-5 pb-4 border-b border-[#e2e8dd]">
        <i class="pi pi-filter text-[#e0b354] text-[18px]"></i>
        <span class="font-semibold text-[#1e3a2f] text-lg">Filtro</span>
      </div>

      <p class="text-sm text-gray-500 mb-4">
        Este reporte es un corte del inventario actual, no requiere seleccionar fechas.
      </p>

      <div class="flex flex-wrap items-end gap-4">
        <!-- Categoría (opcional) -->
        <div class="flex flex-col gap-1 flex-1 min-w-[220px]">
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
import { api } from '@/services/authService'
import { generarReporteInventarioValorizado } from '@/services/reporteService'

const emit = defineEmits(['volver'])

const categoriaId = ref(null)
const categorias = ref([])

const cargarCategorias = async () => {
  try {
    const res = await api.get('/categorias', { params: { per_page: 100 } })
    categorias.value = res.data.data ?? []
  } catch (error) {
    categorias.value = []
  }
}

onMounted(cargarCategorias)

const generarPDF = () => {
  generarReporteInventarioValorizado({
    categoriaId: categoriaId.value,
  })
}

const limpiarFiltros = () => {
  categoriaId.value = null
}
</script>