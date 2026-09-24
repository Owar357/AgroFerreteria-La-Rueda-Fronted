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
        <i class="pi pi-truck text-[24px] text-[#5F6B52]"></i>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-[#1e3a2f]">Reporte de Compras por Proveedor</h1>
        <p class="text-gray-500 text-sm mt-1">Filtra por rango de fecha y genera el reporte PDF.</p>
      </div>
    </div>

    <!-- Card de filtros -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-6 mb-6">
      <div class="flex items-center gap-2 mb-5 pb-4 border-b border-[#e2e8dd]">
        <i class="pi pi-filter text-[#e0b354] text-[18px]"></i>
        <span class="font-semibold text-[#1e3a2f] text-lg">Filtros de fecha</span>
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

        <!-- Botones -->
        <div class="flex gap-3">
          <Button
            label="Filtrar"
            icon="pi pi-search"
            :loading="cargando"
            class="!bg-[#2b5e3b] !border-[#2b5e3b] !text-white !text-sm !px-5 !py-2"
            @click="filtrarCompras"
          />
          <Button
            label="Generar PDF"
            icon="pi pi-file-pdf"
            :disabled="compras.length === 0"
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

    <!-- Tabla de compras -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm overflow-hidden">
      <div class="flex items-center gap-2 px-6 py-4 border-b border-[#e2e8dd] bg-[#fafdf7]">
        <i class="pi pi-list text-[#e0b354] text-[16px]"></i>
        <span class="font-semibold text-[#1e3a2f]">
          Compras
          <span v-if="compras.length > 0" class="text-sm font-normal text-gray-500 ml-2">
            ({{ compras.length }} registros)
          </span>
        </span>
      </div>

      <DataTable
        :value="compras"
        :loading="cargando"
        responsiveLayout="scroll"
        class="p-datatable-sm"
        emptyMessage="No hay compras en el rango seleccionado."
      >
        <Column header="Proveedor" class="text-sm">
          <template #body="{ data }">
            {{ data.proveedor?.nombre ?? '—' }}
          </template>
        </Column>
        <Column field="numero_documento" header="N° Documento" class="text-sm" />
        <Column field="fecha_emision" header="Fecha" class="text-sm">
          <template #body="{ data }">
            {{ formatFecha(data.fecha_emision) }}
          </template>
        </Column>
        <Column field="es_anulado" header="Estado" class="text-sm">
          <template #body="{ data }">
            <Tag
              :value="data.es_anulado ? 'ANULADA' : 'VÁLIDA'"
              :severity="data.es_anulado ? 'danger' : 'success'"
              rounded
            />
          </template>
        </Column>
        <Column field="monto_total" header="Monto" class="text-sm">
          <template #body="{ data }">
            <span class="font-semibold text-[#1e3a2f]">{{ formatCurrency(data.monto_total) }}</span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue' //
import Button from 'primevue/button' //
import DataTable from 'primevue/datatable' //
import Column from 'primevue/column' //
import Tag from 'primevue/tag' //
import { DatePicker } from 'primevue' //
import Swal from 'sweetalert2' //

// 1. Importamos ambas funciones desde tu servicio de reportes de forma destructurada
import { generarReporteComprasPorProveedor, getComprasPorProveedor } from '@/services/reporteService'

const emit = defineEmits(['volver']) //

const fechaInicio = ref(null) //
const fechaFin = ref(null) //
const compras = ref([]) //
const cargando = ref(false) //

const formatFechaParam = (date) => {
  if (!date) return null //
  const d = new Date(date) //
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` //
}

const formatFecha = (val) => {
  if (!val) return '—' //
  return new Date(val).toLocaleDateString('es-SV', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }) //
}

const formatCurrency = (val) =>
  new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(val || 0) //


const filtrarCompras = async () => { //
  if (!fechaInicio.value || !fechaFin.value) { //
    Swal.fire({
      icon: 'warning',
      title: 'Fechas requeridas',
      text: 'Seleccione fecha inicio y fecha fin para filtrar.',
      confirmButtonColor: '#2b5e3b',
    }) //
    return //
  }

  cargando.value = true //
  try { //
    const params = {
      fecha_inicio: formatFechaParam(fechaInicio.value), //
      fecha_fin: formatFechaParam(fechaFin.value), //
    }

    // 2. Ejecutamos la nueva función del servicio para rellenar la tabla
    compras.value = await getComprasPorProveedor(params)

    if (compras.value.length === 0) { //
      Swal.fire({
        icon: 'info',
        title: 'Sin resultados',
        text: 'No se encontraron compras en ese rango de fechas.',
        confirmButtonColor: '#2b5e3b',
      }) //
    }
  } catch (error) { //
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las compras.',
      confirmButtonColor: '#2b5e3b',
    }) //
  } finally { //
    cargando.value = false //
  }
}


const generandoPDF = ref(false)

const generarPDF = async () => {
  if (!fechaInicio.value || !fechaFin.value) return

  generandoPDF.value = true
  try {
    // 3. Generamos el PDF consumiendo la función que ya tenías
    await generarReporteComprasPorProveedor({
      fechaInicio: formatFechaParam(fechaInicio.value),
      fechaFin: formatFechaParam(fechaFin.value),
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

const limpiarFiltros = () => { //
  fechaInicio.value = null //
  fechaFin.value = null //
  compras.value = [] //
}
</script>


<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #fafdf7;
  color: #3c674b;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.75rem 1rem;
}
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
}
:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #eef5e9 !important;
}
:deep(.p-calendar .p-inputtext) {
  border-color: #d1d5db;
}
:deep(.p-calendar .p-inputtext:focus) {
  box-shadow: none !important;
  border-color: #2b5e3b !important;
}
</style>