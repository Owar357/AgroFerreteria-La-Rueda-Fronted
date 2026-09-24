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
        <i class="pi pi-exclamation-triangle text-[24px] text-[#5F6B52]"></i>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-[#1e3a2f]">Reporte de Productos Próximos a Vencer</h1>
        <p class="text-gray-500 text-sm mt-1">
          Lotes activos próximos a vencer, para control de mermas.
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
        Este reporte no se filtra por fecha, sino por un umbral de días hacia adelante.
      </p>

      <div class="flex flex-wrap items-end gap-4">
        <!-- Días umbral -->
        <div class="flex flex-col gap-1 w-[220px]">
          <label class="text-sm font-medium text-gray-600">Días a evaluar</label>
          <InputNumber
            v-model="diasUmbral"
            :min="1"
            placeholder="30"
            showButtons
            buttonLayout="horizontal"
            suffix=" días"
            class="w-full"
            :inputClass="'!border-gray-300 !text-[#1a2e1f] !text-sm !py-2 !px-3 !bg-white !w-full'"
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

      <p class="text-xs text-gray-400 mt-4">
        * Si no especifica un valor, el backend usa 30 días por defecto.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Swal from 'sweetalert2'
import { generarReporteProductosPorVencer } from '@/services/reporteService'

const emit = defineEmits(['volver'])

const diasUmbral = ref(null) // si queda vacío, el backend usa su default (30)
const generandoPDF = ref(false)

const generarPDF = async () => {
  generandoPDF.value = true
  try {
    await generarReporteProductosPorVencer({
      diasUmbral: diasUmbral.value,
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
  diasUmbral.value = null
}
</script>