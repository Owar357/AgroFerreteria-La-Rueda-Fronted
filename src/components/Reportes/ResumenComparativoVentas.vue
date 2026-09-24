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
        <i class="pi pi-chart-line text-[24px] text-[#5F6B52]"></i>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-[#1e3a2f]">Resumen Comparativo de Ventas</h1>
        <p class="text-gray-500 text-sm mt-1">Compara las ventas entre dos rangos de fecha distintos.</p>
      </div>
    </div>

    <!-- Card de filtros: dos rangos -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-6">
      <div class="flex items-center gap-2 mb-5 pb-4 border-b border-[#e2e8dd]">
        <i class="pi pi-filter text-[#e0b354] text-[18px]"></i>
        <span class="font-semibold text-[#1e3a2f] text-lg">Rangos a comparar</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Rango 1 -->
        <div class="bg-[#fafdf7] border border-[#e2e8dd] rounded-xl p-4">
          <p class="text-sm font-semibold text-[#1e3a2f] mb-3">Rango 1</p>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-600">Fecha inicio</label>
              <DatePicker
                v-model="fechaInicio1"
                dateFormat="yy-mm-dd"
                placeholder="Seleccione fecha"
                showIcon
                class="w-full"
                :inputClass="'!border-gray-300 !text-[#1a2e1f] !text-sm !py-2 !px-3 !bg-white'"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-600">Fecha fin</label>
              <DatePicker
                v-model="fechaFin1"
                dateFormat="yy-mm-dd"
                placeholder="Seleccione fecha"
                showIcon
                class="w-full"
                :inputClass="'!border-gray-300 !text-[#1a2e1f] !text-sm !py-2 !px-3 !bg-white'"
              />
            </div>
          </div>
        </div>

        <!-- Rango 2 -->
        <div class="bg-[#fafdf7] border border-[#e2e8dd] rounded-xl p-4">
          <p class="text-sm font-semibold text-[#1e3a2f] mb-3">Rango 2</p>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-600">Fecha inicio</label>
              <DatePicker
                v-model="fechaInicio2"
                dateFormat="yy-mm-dd"
                placeholder="Seleccione fecha"
                showIcon
                class="w-full"
                :inputClass="'!border-gray-300 !text-[#1a2e1f] !text-sm !py-2 !px-3 !bg-white'"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-600">Fecha fin</label>
              <DatePicker
                v-model="fechaFin2"
                dateFormat="yy-mm-dd"
                placeholder="Seleccione fecha"
                showIcon
                class="w-full"
                :inputClass="'!border-gray-300 !text-[#1a2e1f] !text-sm !py-2 !px-3 !bg-white'"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="flex gap-3 mt-6 pt-4 border-t border-[#e2e8dd]">
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
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import { DatePicker } from 'primevue'
import Swal from 'sweetalert2'
import { generarReporteComparativoVentas } from '@/services/reporteService'

const emit = defineEmits(['volver'])

const fechaInicio1 = ref(null)
const fechaFin1 = ref(null)
const fechaInicio2 = ref(null)
const fechaFin2 = ref(null)

const formatFechaParam = (date) => {
  if (!date) return null
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const generandoPDF = ref(false)

const generarPDF = async () => {
  if (!fechaInicio1.value || !fechaFin1.value || !fechaInicio2.value || !fechaFin2.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Fechas requeridas',
      text: 'Complete las fechas de inicio y fin de ambos rangos para generar el reporte.',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }

  generandoPDF.value = true
  try {
    await generarReporteComparativoVentas({
      fechaInicio1: formatFechaParam(fechaInicio1.value),
      fechaFin1: formatFechaParam(fechaFin1.value),
      fechaInicio2: formatFechaParam(fechaInicio2.value),
      fechaFin2: formatFechaParam(fechaFin2.value),
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
  fechaInicio1.value = null
  fechaFin1.value = null
  fechaInicio2.value = null
  fechaFin2.value = null
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