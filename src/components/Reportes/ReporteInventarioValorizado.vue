<template>
  <div class="bg-[#eef2e9] min-h-screen p-3 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif] w-full overflow-x-hidden">

    <!-- ======================================================= -->
    <!-- VISTA MÓVIL                                            -->
    <!-- ======================================================= -->
    <div class="block lg:hidden space-y-4 w-full max-w-full">

      <!-- Botón Volver Móvil -->
      <Button
        icon="pi pi-arrow-left"
        label="Volver a reportes"
        severity="secondary"
        text
        class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white !w-full !px-4 !py-2 !rounded-xl !text-xs font-bold transition-all duration-200"
        @click="$emit('volver')"
      />

      <!-- Encabezado Móvil -->
      <div class="flex items-center gap-3">
        <div class="!w-10 !h-10 rounded-xl bg-white border border-[#e2e8dd] shadow-2xs flex items-center justify-center shrink-0">
          <i class="pi pi-box text-[#2b5e3b] text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[#1a2e1f] leading-tight m-0">
            Inventario Valorizado
          </h1>
          <p class="text-xs text-gray-500 mt-0.5 m-0">
            Auditoría a costo y venta del inventario
          </p>
        </div>
      </div>

      <!-- Card de Filtros Móvil -->
      <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-2xs p-4 space-y-4 w-full">
        <div class="flex items-center gap-2 pb-3 border-b border-[#e2e8dd]">
          <i class="pi pi-filter text-[#e0b354] text-base"></i>
          <span class="font-bold text-[#1a2e1f] text-sm">Filtros de Búsqueda</span>
        </div>

        <p class="text-[0.85rem] text-gray-500 ">
          Este reporte es un corte del inventario actual, no requiere seleccionar fechas.
        </p>

        <!-- Categoría Móvil -->
        <div class="flex flex-col gap-3 w-full">
          <label class="text-[0.85rem] font-semibold text-gray-600">La categoría (opcional)</label>
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
            class="!w-full"
            :pt="{ input: { class: '!text-xs !py-2.5 !px-3 !border-[#cbd5e1] !bg-white !rounded-xl !w-full' } }"
          />
        </div>

        <!-- Botones Móvil -->
        <div class="pt-2 flex flex-col gap-2 w-full">
          <Button
            label="Generar PDF"
            icon="pi pi-file-pdf"
            class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !border-[#2b5e3b] !text-white !text-xs !py-2.5 !rounded-xl !w-full font-bold shadow-2xs cursor-pointer"
            @click="generarPDF"
          />
          <Button
            label="Limpiar"
            icon="pi pi-times"
            severity="secondary"
            outlined
            class="!text-xs !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl !w-full font-semibold cursor-pointer"
            @click="limpiarFiltros"
          />
        </div>
      </div>

    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO                                       -->
    <!-- ======================================================= -->
    <div class="hidden lg:block space-y-6 w-full">

      <!-- Botón Volver PC -->
      <Button
        icon="pi pi-arrow-left"
        label="Volver a reportes"
        severity="secondary"
        text
        class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white mb-6 !px-4 !py-2 !rounded-lg transition-all duration-200 cursor-pointer"
        @click="$emit('volver')"
      />

      <!-- Encabezado PC -->
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-white p-3 rounded-2xl shadow-sm border border-[#e2e8dd]">
          <i class="pi pi-box text-[24px] text-[#5F6B52]"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e3a2f] m-0">Reporte de Inventario Valorizado</h1>
          <p class="text-gray-500 text-sm mt-1 m-0">
            Auditoría del inventario a costo y a venta, con alertas de margen de ganancia reducido.
          </p>
        </div>
      </div>

      <!-- Card de Filtros PC -->
      <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-6">
        <div class="flex items-center gap-2 mb-5 pb-4 border-b border-[#e2e8dd]">
          <i class="pi pi-filter text-[#e0b354] text-[18px]"></i>
          <span class="font-semibold text-[#1e3a2f] text-lg">Filtro</span>
        </div>

        <p class="text-sm text-gray-500 mb-4 m-0">
          Este reporte es un corte del inventario actual, no requiere seleccionar fechas.
        </p>

        <div class="flex flex-wrap items-end gap-4 mt-4">
          <!-- Categoría PC -->
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
              class="!w-full"
              :pt="{ input: { class: '!text-sm !py-2 !px-3 !w-full' } }"
            />
          </div>

          <!-- Botones PC -->
          <div class="flex gap-3">
            <Button
              label="Generar PDF"
              icon="pi pi-file-pdf"
              class="!bg-[#5F6B52] hover:!bg-[#4d5742] !border-[#5F6B52] !text-white !text-sm !px-5 !py-2 cursor-pointer"
              @click="generarPDF"
            />
            <Button
              label="Limpiar"
              icon="pi pi-times"
              severity="secondary"
              outlined
              class="!text-sm !px-5 !py-2 !border-gray-300 !text-gray-600 cursor-pointer"
              @click="limpiarFiltros"
            />
          </div>
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