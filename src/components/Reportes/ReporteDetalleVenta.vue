<template>
  <div
  class="bg-[#eef2e9] p-3 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif] w-full overflow-x-hidden"
>
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
        <div
          class="!w-10 !h-10 rounded-xl bg-white border border-[#e2e8dd] shadow-2xs flex items-center justify-center shrink-0"
        >
          <i class="pi pi-shopping-cart text-[#2b5e3b] text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[#1a2e1f] leading-tight m-0">Reporte de Ventas</h1>
          <p class="text-xs text-gray-500 mt-0.5 m-0">
            Filtra por rango de fecha y genera el reporte
          </p>
        </div>
      </div>

      <!-- Card de Filtros Móvil -->
      <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-2xs p-4 space-y-4 w-full">
        <div class="flex items-center gap-2 pb-3 border-b border-[#e2e8dd]">
          <i class="pi pi-filter text-[#e0b354] text-base"></i>
          <span class="font-bold text-[#1a2e1f] text-sm">Filtros de fecha</span>
        </div>

        <!-- Fecha Desde Móvil -->
        <div class="flex flex-col gap-1 w-full">
          <label class="text-xs font-semibold text-gray-600">Fecha desde</label>
          <DatePicker
            v-model="fechaDesde"
            dateFormat="yy-mm-dd"
            placeholder="Seleccione fecha desde"
            showIcon
            :pt="{ pcInputText: { root: { readonly: true } } }"
            class="!w-full"
            :inputClass="'!border-[#cbd5e1] !text-[#1a2e1f] !text-xs !py-2.5 !px-3 !bg-white !rounded-xl !w-full'"
          />
        </div>

        <!-- Fecha Hasta Móvil -->
        <div class="flex flex-col gap-1 w-full">
          <label class="text-xs font-semibold text-gray-600">Fecha hasta</label>
          <DatePicker
            v-model="fechaHasta"
            dateFormat="yy-mm-dd"
            placeholder="Seleccione fecha hasta"
            showIcon
            :pt="{ pcInputText: { root: { readonly: true } } }"
            class="!w-full"
            :inputClass="'!border-[#cbd5e1] !text-[#1a2e1f] !text-xs !py-2.5 !px-3 !bg-white !rounded-xl !w-full'"
          />
        </div>

        <!-- Botones Móvil -->
        <div class="pt-2 flex flex-col gap-2 w-full">
          <Button
            label="Generar PDF"
            icon="pi pi-file-pdf"
            :loading="generandoPDF"
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
          <i class="pi pi-shopping-cart text-[24px] text-[#5F6B52]"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e3a2f] m-0">Reporte de Ventas</h1>
          <p class="text-gray-500 text-sm mt-1 m-0">
            Seleccione un rango de fechas para exportar el informe detallado en formato PDF.
          </p>
        </div>
      </div>

      <!-- Card de Filtros PC -->
      <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-6 mb-6">
        <div class="flex items-center gap-2 mb-5 pb-4 border-b border-[#e2e8dd]">
          <i class="pi pi-filter text-[#e0b354] text-[18px]"></i>
          <span class="font-semibold text-[#1e3a2f] text-lg">Parámetros de consulta</span>
        </div>

        <div class="flex flex-wrap items-end gap-4">
          <!-- Fecha Desde PC -->
          <div class="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label class="text-sm font-medium text-gray-600">Fecha desde</label>
            <DatePicker
              v-model="fechaDesde"
              dateFormat="yy-mm-dd"
              placeholder="Seleccione fecha desde"
              showIcon
              :pt="{ pcInputText: { root: { readonly: true } } }"
              class="!w-full"
              :inputClass="'!border-gray-300 !text-[#1a2e1f] !text-sm !py-2 !px-3 !bg-white !w-full'"
            />
          </div>

          <!-- Fecha Hasta PC -->
          <div class="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label class="text-sm font-medium text-gray-600">Fecha hasta</label>
            <DatePicker
              v-model="fechaHasta"
              dateFormat="yy-mm-dd"
              placeholder="Seleccione fecha hasta"
              showIcon
              :pt="{ pcInputText: { root: { readonly: true } } }"
              class="!w-full"
              :inputClass="'!border-gray-300 !text-[#1a2e1f] !text-sm !py-2 !px-3 !bg-white !w-full'"
            />
          </div>

          <!-- Botones PC -->
          <div class="flex gap-3">
            <Button
              label="Limpiar"
              icon="pi pi-times"
              severity="secondary"
              outlined
              class="!text-sm !px-5 !py-2 !border-gray-300 !text-gray-600 cursor-pointer"
              @click="limpiarFiltros"
            />
            <Button
              label="Generar Reporte PDF"
              icon="pi pi-file-pdf"
              :loading="generandoPDF"
              class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !border-[#2b5e3b] !text-white !text-sm !px-5 !py-2 cursor-pointer font-semibold shadow-2xs"
              @click="generarPDF"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import { DatePicker } from 'primevue'
import { generarReporteVentas } from '@/services/reporteService'
import {
  mostrarExito,
  mostrarError,
  mostrarAlertaConfirmar,
  mostrarCargando,
} from '@/utils/SweetAlertService'

const emit = defineEmits(['volver'])

const fechaDesde = ref(null)
const fechaHasta = ref(null)
const generandoPDF = ref(false)

const formatFechaParam = (date) => {
  if (!date) return null
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const generarPDF = async () => {
  if (!fechaDesde.value || !fechaHasta.value) {
    mostrarAlertaConfirmar({
      tipo: 'advertencia',
      titulo: 'Fechas requeridas',
      mensajeHtml:
        'Debes seleccionar la <strong>Fecha desde</strong> y la <strong>Fecha hasta</strong> para generar el reporte.',
    })
    return
  }

  if (new Date(fechaDesde.value) > new Date(fechaHasta.value)) {
    mostrarAlertaConfirmar({
      tipo: 'advertencia',
      titulo: 'Rango de fechas inválido',
      mensajeHtml:
        'La <strong>Fecha desde</strong> no puede ser posterior a la <strong>Fecha hasta</strong>.',
    })
    return
  }

  generandoPDF.value = true
  mostrarCargando('Generando reporte PDF...', 'Procesando los datos de ventas para descargar')

  try {
    const [resultado] = await Promise.all([
      generarReporteVentas({
        fechaDesde: formatFechaParam(fechaDesde.value),
        fechaHasta: formatFechaParam(fechaHasta.value),
      }),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ])

    mostrarExito(
      '¡Reporte generado!',
      'El reporte de ventas en formato PDF se ha descargado exitosamente.',
    )
  } catch (error) {
    const msg = error.response?.data?.message || 'No se pudo generar ni descargar el archivo PDF.'
    mostrarError('Error al generar PDF', msg)
  } finally {
    generandoPDF.value = false
  }
}

const limpiarFiltros = () => {
  fechaDesde.value = null
  fechaHasta.value = null
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

.swal2-container {
  z-index: 999999 !important;
}
</style>
