<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="DETALLE DE VENTA"
    :draggable="false"
    :closable="false"
    :style="{ width: 'min(calc(100vw - 2rem), 54rem)' }"
    class="custom-dialog"
    :pt="{ root: { class: '!rounded-2xl overflow-hidden shadow-2xl' } }"
  >
    <!-- ======================================================= -->
    <!-- VISTA MÓVIL (< 640px)                                   -->
    <!-- ======================================================= -->
    <div v-if="venta" class="block sm:hidden bg-white p-4 text-[#1a2e1f] space-y-4 font-['Inter',sans-serif]">
      
      <!-- Subcabecera con Nº Factura -->
      <div class="flex items-center justify-between pb-2 border-b border-[#e2e8dd]">
        <span class="text-xs font-bold uppercase text-[#2b5e3b]">N° Factura</span>
        <span class="text-xs font-mono font-bold text-[#1a2e1f] bg-[#f4f7f2] px-2.5 py-1 rounded-md border border-[#dce4d7]">
          {{ venta.numeroFactura || '—' }}
        </span>
      </div>

      <!-- Resumen General Móvil -->
      <div class="bg-[#fbfdf9] rounded-xl border border-[#e2e8dd] p-3.5 space-y-2.5 text-xs">
        <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
          <span class="text-gray-500 font-medium">Vendido por:</span>
          <span class="font-bold text-[#1a2e1f]">{{ venta.vendidoPor || '—' }}</span>
        </div>
        <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
          <span class="text-gray-500 font-medium">Fecha Emisión:</span>
          <span class="font-semibold text-[#1a2e1f] font-mono">{{ venta.fechaEmision || '—' }}</span>
        </div>
        <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
          <span class="text-gray-500 font-medium">Tipo de Pago:</span>
          <span class="font-semibold text-[#1a2e1f]">{{ venta.tipoPago || '—' }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-500 font-medium">Estado:</span>
          <span
            :class="
              venta.status === 'Procesado' || venta.estado === 'Procesado'
                ? 'bg-[#dff0e0] text-[#2b5e3b] border-[#c5e3c7]'
                : 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]'
            "
            class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
          >
            {{ venta.estado || venta.status || 'PROCESADO' }}
          </span>
        </div>
      </div>

      <!-- Tabla Desplegable Móvil -->
      <div class="space-y-2">
        <p class="text-xs uppercase tracking-wider text-[#1a2e1f] font-bold m-0 flex items-center gap-1.5">
          <i class="pi pi-box text-[#2b5e3b]" /> Productos Registrados
        </p>

        <div class="rounded-xl border border-[#e2e8dd] overflow-hidden bg-white shadow-2xs">
          <DataTable
            v-model:expandedRows="expandedRows"
            :value="venta.items"
            dataKey="nombreProducto"
            class="p-datatable-custom text-xs w-full"
          >
            <!-- Columna Expansible (Flecha) -->
            <Column expander style="width: 2.2rem" />

            <Column header="Producto">
              <template #body="{ data }">
                <div class="flex flex-col">
                  <span class="font-bold text-[#1a2e1f] capitalize">
                    {{ data.nombreProducto }}
                  </span>
                  <span class="text-[10px] text-gray-500">
                    Cant: {{ data.cantidad }} | Unid: {{ data.unidad }}
                  </span>
                </div>
              </template>
            </Column>

            <Column header="Subtotal" class="text-right">
              <template #body="{ data }">
                <span class="font-bold text-[#1a2e1f] font-mono">
                  ${{ formatCurrency(data.cantidad * data.precio) }}
                </span>
              </template>
            </Column>

            <!-- Desplegable Móvil con Detalle de Valores -->
            <template #expansion="{ data }">
              <div class="p-3 bg-[#f8faf7] border-y border-[#e2e8dd] text-xs">
                <div class="bg-white p-3 rounded-lg border border-[#e2e8dd] space-y-2">
                  <div class="flex justify-between pb-1.5 border-b border-gray-100">
                    <span class="text-gray-500 font-medium">Cantidad Registrada:</span>
                    <span class="font-mono font-bold text-[#1a2e1f]">{{ data.cantidad }}</span>
                  </div>
                  <div class="flex justify-between pb-1.5 border-b border-gray-100">
                    <span class="text-gray-500 font-medium">Unidad Base:</span>
                    <span class="font-semibold text-gray-700">{{ data.unidad || '—' }}</span>
                  </div>
                  <div class="flex justify-between pb-1.5 border-b border-gray-100">
                    <span class="text-gray-500 font-medium">Precio Unitario:</span>
                    <span class="font-mono">${{ formatCurrency(data.precio) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500 font-medium">Subtotal Calculado:</span>
                    <span class="font-mono font-bold text-[#2b5e3b]">
                      ${{ formatCurrency(data.cantidad * data.precio) }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </DataTable>
        </div>
      </div>

      <!-- Total Móvil -->
      <div class="bg-[#f4f7f2] border border-[#e2e8dd] rounded-xl p-3.5 flex justify-between items-center">
        <span class="text-xs font-bold uppercase text-[#1e3a2f]">Total a Pagar:</span>
        <span class="text-xl font-black text-[#2b5e3b] font-mono">${{ formatCurrency(venta.total) }}</span>
      </div>

      <!-- Botones Móvil -->
      <div class="pt-2 flex flex-col gap-2 w-full">
        <Button
          label="Cerrar factura"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-xs !py-3 !border-[#cbd5e1] !text-gray-600 !rounded-xl !w-full font-semibold cursor-pointer"
          @click="visible = false"
        />
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO (>= 640px)                             -->
    <!-- ======================================================= -->
    <div v-if="venta" class="hidden sm:flex bg-white p-6 text-[#1a2e1f] flex-col gap-5 font-['Inter',sans-serif]">
      
      <!-- Subcabecera Nº Factura -->
      <div class="flex items-center justify-between pb-2 border-b border-[#e2e8dd]">
        <div class="flex items-center gap-2">
          <i class="pi pi-receipt text-[#2b5e3b] text-base" />
          <span class="text-xs font-bold uppercase tracking-wider text-[#2b5e3b]">Factura N°</span>
        </div>
        <span class="text-sm font-mono font-bold text-[#1a2e1f] bg-[#f4f7f2] px-3 py-1 rounded-lg border border-[#dce4d7]">
          {{ venta.numeroFactura || '—' }}
        </span>
      </div>

      <!-- Información General Grid Escritorio -->
      <div class="bg-[#fbfdf9] rounded-2xl border border-[#e2e8dd] p-4 shadow-2xs">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <p class="text-[10px] uppercase tracking-wider text-[#2b5e3b] font-bold mb-0.5">Vendido por</p>
            <p class="text-sm font-bold text-[#1a2e1f] m-0">{{ venta.vendidoPor || '—' }}</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-[#2b5e3b] font-bold mb-0.5">Fecha Emisión</p>
            <p class="text-sm font-semibold text-[#1a2e1f] m-0 font-mono">{{ venta.fechaEmision || '—' }}</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-[#2b5e3b] font-bold mb-0.5">Tipo de Pago</p>
            <p class="text-sm font-semibold text-[#1a2e1f] m-0">{{ venta.tipoPago || '—' }}</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-[#2b5e3b] font-bold mb-0.5">Estado</p>
            <span
              :class="
                venta.status === 'Procesado' || venta.estado === 'Procesado'
                  ? 'bg-[#dff0e0] text-[#2b5e3b] border-[#c5e3c7]'
                  : 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]'
              "
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border inline-block"
            >
              {{ venta.estado || venta.status || 'PROCESADO' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tabla Completa Desplegable/Expandible para Escritorio -->
      <div class="space-y-2">
        <p class="text-xs uppercase tracking-wider text-[#1a2e1f] font-bold m-0 flex items-center gap-1.5">
          <i class="pi pi-box text-[#2b5e3b]" /> Productos Registrados
        </p>

        <div class="rounded-2xl border border-[#e2e8dd] overflow-hidden bg-white shadow-2xs">
          <DataTable
            v-model:expandedRows="expandedRows"
            :value="venta.items"
            dataKey="nombreProducto"
            responsiveLayout="scroll"
            class="p-datatable-custom text-xs w-full"
          >
            <!-- Columna Expansible (Flecha) -->
            <Column expander style="width: 2.5rem" />

            <Column header="Producto" class="font-semibold text-[#1a2e1f]">
              <template #body="{ data }">
                <span class="font-bold text-[#1a2e1f] capitalize">
                  {{ data.nombreProducto }}
                </span>
              </template>
            </Column>

            <Column header="Cantidad" class="text-center">
              <template #body="{ data }">
                <span class="font-mono font-semibold text-gray-700">{{ data.cantidad }}</span>
              </template>
            </Column>

            <Column header="Precio Unitario" class="text-right">
              <template #body="{ data }">
                <span class="font-mono">${{ formatCurrency(data.precio) }}</span>
              </template>
            </Column>

            <Column header="Subtotal" class="text-right">
              <template #body="{ data }">
                <span class="font-bold text-[#1a2e1f] font-mono">
                  ${{ formatCurrency(data.cantidad * data.precio) }}
                </span>
              </template>
            </Column>

            <!-- Desplegable con Detalle de Unidad Base e Información Complementaria -->
            <template #expansion="{ data }">
              <div class="p-3 bg-[#f8faf7] border-y border-[#e2e8dd] text-xs">
                <div class="bg-white p-3.5 rounded-xl border border-[#e2e8dd] grid grid-cols-3 gap-4">
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#2b5e3b] block mb-0.5">Unidad Base</span>
                    <span class="font-semibold text-gray-700">{{ data.unidad || '—' }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#2b5e3b] block mb-0.5">Precio Unitario Facturado</span>
                    <span class="font-mono text-gray-700">${{ formatCurrency(data.precio) }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#2b5e3b] block mb-0.5">Subtotal de Línea</span>
                    <span class="font-mono font-bold text-[#2b5e3b]">
                      ${{ formatCurrency(data.cantidad * data.precio) }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </DataTable>
        </div>
      </div>

      <!-- Total Factura + Botón de Cierre Escritorio -->
      <div class="flex justify-between items-center mt-1 pt-4 border-t border-[#e2e8dd] w-full">
        <div class="bg-[#f4f7f2] border border-[#e2e8dd] rounded-xl px-4 py-2 flex items-center gap-3">
          <span class="text-xs font-bold uppercase text-[#1e3a2f]">Total a Pagar:</span>
          <span class="text-2xl font-black text-[#2b5e3b] font-mono">${{ formatCurrency(venta.total) }}</span>
        </div>

        <Button
          label="Cerrar factura"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-sm !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl font-semibold cursor-pointer w-[35%] flex justify-center items-center"
          @click="visible = false"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

defineProps({
  venta: {
    type: Object,
    default: null
  }
})

const visible = defineModel('visible', { type: Boolean, default: false })
const expandedRows = ref({})

const formatCurrency = (v) => {
  const num = parseFloat(v)
  return isNaN(num) ? '0.00' : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
</script>

<style>
/* Encabezado sin 'X' y paleta AgroFerretería */
.custom-dialog .p-dialog-header {
  background-color: #1a3323 !important;
  color: #ffffff !important;
  border-bottom: 1px solid #2b5e3b !important;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 1.1rem 1.5rem !important;
}

/* Limpieza del contenedor de contenido */
.custom-dialog .p-dialog-content {
  background-color: #ffffff !important;
  padding: 0 !important;
}

/* Estilos de la DataTable personalizada para detalles */
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #fcfdfe !important;
  border-bottom: 1px solid #e2e8dd !important;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.75rem 1rem !important;
}

.p-datatable-custom .p-datatable-tbody > tr > td {
  padding: 0.75rem 1rem !important;
  border-bottom: 1px solid #f1f5f0 !important;
}
</style>