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
          <i class="pi pi-truck text-[#2b5e3b] text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[#1a2e1f] leading-tight m-0">
            Compras por Proveedor
          </h1>
          <p class="text-xs text-gray-500 mt-0.5 m-0">
            Filtra por fechas y genera el reporte
          </p>
        </div>
      </div>

      <!-- Card de Filtros Móvil -->
      <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-2xs p-4 space-y-4 w-full">
        <div class="flex items-center gap-2 pb-3 border-b border-[#e2e8dd]">
          <i class="pi pi-filter text-[#e0b354] text-base"></i>
          <span class="font-bold text-[#1a2e1f] text-sm">Filtros de fecha</span>
        </div>

        <!-- Fecha Inicio Móvil -->
        <div class="flex flex-col gap-1 w-full">
          <label class="text-xs font-semibold text-gray-600">Fecha inicio</label>
          <DatePicker
            v-model="fechaInicio"
            dateFormat="yy-mm-dd"
            placeholder="Seleccione fecha inicio"
            showIcon
            class="!w-full"
            :inputClass="'!border-[#cbd5e1] !text-[#1a2e1f] !text-xs !py-2.5 !px-3 !bg-white !rounded-xl !w-full'"
          />
        </div>

        <!-- Fecha Fin Móvil -->
        <div class="flex flex-col gap-1 w-full">
          <label class="text-xs font-semibold text-gray-600">Fecha fin</label>
          <DatePicker
            v-model="fechaFin"
            dateFormat="yy-mm-dd"
            placeholder="Seleccione fecha fin"
            showIcon
            class="!w-full"
            :inputClass="'!border-[#cbd5e1] !text-[#1a2e1f] !text-xs !py-2.5 !px-3 !bg-white !rounded-xl !w-full'"
          />
        </div>

        <!-- Botones Móvil -->
        <div class="pt-2 flex flex-col gap-2 w-full">
          <Button
            label="Filtrar"
            icon="pi pi-search"
            :loading="cargando"
            class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !border-[#2b5e3b] !text-white !text-xs !py-2.5 !rounded-xl !w-full font-bold shadow-2xs cursor-pointer"
            @click="filtrarCompras"
          />
          <Button
            label="Generar PDF"
            icon="pi pi-file-pdf"
            :disabled="compras.length === 0"
            class="!bg-[#5F6B52] hover:!bg-[#4d5742] !border-[#5F6B52] !text-white !text-xs !py-2.5 !rounded-xl !w-full font-bold shadow-2xs cursor-pointer disabled:!opacity-50"
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

      <!-- Tarjetas de Compras Móvil -->
      <div class="space-y-3 w-full">
        <div class="flex items-center justify-between px-1">
          <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Compras Registradas
          </span>
          <span v-if="compras.length > 0" class="text-xs font-semibold text-[#2b5e3b] bg-[#eef7f0] px-2 py-0.5 rounded-full border border-[#c2e3c8]">
            {{ compras.length }} registros
          </span>
        </div>

        <div v-if="compras.length === 0 && !cargando" class="bg-white rounded-2xl border border-[#e2e8dd] p-6 text-center text-gray-500 text-xs">
          No hay compras en el rango seleccionado.
        </div>

        <div v-if="cargando" class="bg-white rounded-2xl border border-[#e2e8dd] p-6 text-center text-gray-500 text-xs">
          <i class="pi pi-spin pi-spinner text-lg mb-2 block"></i>
          Cargando compras...
        </div>

        <div
          v-for="compra in compras"
          :key="'movil-' + compra.id"
          class="bg-white rounded-2xl border border-[#e2e8dd] shadow-2xs p-4 space-y-2.5"
        >
          <div class="flex items-center justify-between border-b border-[#f0f4ee] pb-2">
            <span class="font-bold text-[#1a2e1f] text-sm capitalize">
              {{ compra.proveedor?.nombre ?? '—' }}
            </span>
            <Tag
              :value="compra.es_anulado ? 'ANULADA' : 'VÁLIDA'"
              :severity="compra.es_anulado ? 'danger' : 'success'"
              class="!text-[10px] !px-2 !py-0.5"
              rounded
            />
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-semibold">N° Documento</span>
              <span class="font-medium text-[#1a2e1f]">{{ compra.numero_documento || '—' }}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-semibold">Fecha</span>
              <span class="font-medium text-[#1a2e1f]">{{ formatFecha(compra.fecha_emision) }}</span>
            </div>
          </div>

          <div class="pt-2 border-t border-[#f0f4ee] flex items-center justify-between">
            <span class="text-xs text-gray-500 font-medium">Monto Total</span>
            <span class="text-sm font-bold text-[#2b5e3b]">{{ formatCurrency(compra.monto_total) }}</span>
          </div>
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
          <i class="pi pi-truck text-[24px] text-[#5F6B52]"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e3a2f] m-0">Reporte de Compras por Proveedor</h1>
          <p class="text-gray-500 text-sm mt-1 m-0">Filtra por rango de fecha y genera el reporte PDF.</p>
        </div>
      </div>

      <!-- Card de Filtros PC -->
      <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-6 mb-6">
        <div class="flex items-center gap-2 mb-5 pb-4 border-b border-[#e2e8dd]">
          <i class="pi pi-filter text-[#e0b354] text-[18px]"></i>
          <span class="font-semibold text-[#1e3a2f] text-lg">Filtros de fecha</span>
        </div>

        <div class="flex flex-wrap items-end gap-4">
          <!-- Fecha Inicio PC -->
          <div class="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label class="text-sm font-medium text-gray-600">Fecha inicio</label>
            <DatePicker
              v-model="fechaInicio"
              dateFormat="yy-mm-dd"
              placeholder="Seleccione fecha"
              showIcon
              class="!w-full"
              :inputClass="'!border-gray-300 !text-[#1a2e1f] !text-sm !py-2 !px-3 !bg-white !w-full'"
            />
          </div>

          <!-- Fecha Fin PC -->
          <div class="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label class="text-sm font-medium text-gray-600">Fecha fin</label>
            <DatePicker
              v-model="fechaFin"
              dateFormat="yy-mm-dd"
              placeholder="Seleccione fecha"
              showIcon
              class="!w-full"
              :inputClass="'!border-gray-300 !text-[#1a2e1f] !text-sm !py-2 !px-3 !bg-white !w-full'"
            />
          </div>

          <!-- Botones PC -->
          <div class="flex gap-3">
            <Button
              label="Filtrar"
              icon="pi pi-search"
              :loading="cargando"
              class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !border-[#2b5e3b] !text-white !text-sm !px-5 !py-2 cursor-pointer"
              @click="filtrarCompras"
            />
            <Button
              label="Generar PDF"
              icon="pi pi-file-pdf"
              :disabled="compras.length === 0"
              class="!bg-[#5F6B52] hover:!bg-[#4d5742] !border-[#5F6B52] !text-white !text-sm !px-5 !py-2 cursor-pointer disabled:!opacity-50"
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

      <!-- Tabla de Compras PC -->
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

  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { DatePicker } from 'primevue'
import Swal from 'sweetalert2'
import { generarReporteComprasPorProveedor, getComprasPorProveedor } from '@/services/reporteService'

const emit = defineEmits(['volver'])

const fechaInicio = ref(null)
const fechaFin = ref(null)
const compras = ref([])
const cargando = ref(false)

const formatFechaParam = (date) => {
  if (!date) return null
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const formatFecha = (val) => {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('es-SV', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

const formatCurrency = (val) =>
  new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(val || 0)

const filtrarCompras = async () => {
  if (!fechaInicio.value || !fechaFin.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Fechas requeridas',
      text: 'Seleccione fecha inicio y fecha fin para filtrar.',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }

  cargando.value = true
  try {
    const params = {
      fecha_inicio: formatFechaParam(fechaInicio.value),
      fecha_fin: formatFechaParam(fechaFin.value),
    }

    compras.value = await getComprasPorProveedor(params)

    if (compras.value.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin resultados',
        text: 'No se encontraron compras en ese rango de fechas.',
        confirmButtonColor: '#2b5e3b',
      })
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las compras.',
      confirmButtonColor: '#2b5e3b',
    })
  } finally {
    cargando.value = false
  }
}

const generarPDF = () => {
  if (!fechaInicio.value || !fechaFin.value) return

  generarReporteComprasPorProveedor({
    fechaInicio: formatFechaParam(fechaInicio.value),
    fechaFin: formatFechaParam(fechaFin.value),
  })
}

const limpiarFiltros = () => {
  fechaInicio.value = null
  fechaFin.value = null
  compras.value = []
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