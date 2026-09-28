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
        <i class="pi pi-wallet text-[24px] text-[#5F6B52]"></i>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-[#1e3a2f]">Reporte de Arqueo de Caja</h1>
        <p class="text-gray-500 text-sm mt-1">Selecciona la fecha y el cajero para generar el reporte de cierre.</p>
      </div>
    </div>

    <!-- Card de filtros -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-6">
      <div class="flex items-center gap-2 mb-5 pb-4 border-b border-[#e2e8dd]">
        <i class="pi pi-filter text-[#e0b354] text-[18px]"></i>
        <span class="font-semibold text-[#1e3a2f] text-lg">Filtros</span>
      </div>

      <div class="flex flex-wrap items-end gap-4">
        <!-- Fecha -->
        <div class="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label class="text-sm font-medium text-gray-600">Fecha</label>
          <DatePicker
            v-model="fecha"
            dateFormat="yy-mm-dd"
            placeholder="Seleccione fecha"
            showIcon
            class="w-full"
            :inputClass="'!border-gray-300 !text-[#1a2e1f] !text-sm !py-2 !px-3 !bg-white'"
          />
        </div>

        <!-- Cajero -->
        <div class="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label class="text-sm font-medium text-gray-600">Cajero</label>
          <Select
            v-model="cajeroId"
            :options="cajeros"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione cajero"
            filter
            filterPlaceholder="Buscar cajero..."
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
import { generarReporteArqueoCaja } from '@/services/reporteService'

const emit = defineEmits(['volver'])

const fecha = ref(null)
const cajeroId = ref(null)
const cajeros = ref([])
const generandoPDF = ref(false)

const formatFechaParam = (date) => {
  if (!date) return null
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const cargarCajeros = async () => {
  try {
    const res = await api.get('/usuarios/cajeros')
    cajeros.value = res.data.data ?? res.data ?? []
  } catch (error) {
    cajeros.value = []
  }
}

onMounted(cargarCajeros)

const generarPDF = async () => {
  if (!fecha.value || !cajeroId.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Datos requeridos',
      text: 'Seleccione la fecha y el cajero para generar el reporte.',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }

  generandoPDF.value = true
  try {
    await generarReporteArqueoCaja({
      fecha: formatFechaParam(fecha.value),
      cajeroId: cajeroId.value,
    })
  } catch (error) {
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error?.message || 'No se pudo generar el reporte PDF.',
      confirmButtonColor: '#2b5e3b',
    })
  } finally {
    generandoPDF.value = false
  }
}

const limpiarFiltros = () => {
  fecha.value = null
  cajeroId.value = null
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