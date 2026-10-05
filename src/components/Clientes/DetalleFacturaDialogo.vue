<template>
  <Dialog
    v-model:visible="visibleModel"
    modal
    header="DETALLE DE FACTURA"
    :draggable="false"
    :closable="false"
    :style="{ width: 'min(calc(100vw - 2rem), 48rem)' }"
    class="custom-dialog"
    :pt="{ root: { class: '!rounded-2xl overflow-hidden shadow-2xl' } }"
  >
    <template v-if="compra">
      <!-- ======================================================= -->
      <!-- VISTA MÓVIL (< 640px)                                   -->
      <!-- ======================================================= -->
      <div class="block sm:hidden bg-white p-4 text-[#1a2e1f] space-y-4 font-['Inter',sans-serif] max-h-[85vh] overflow-y-auto">
        
        <!-- Subcabecera con Nº Factura -->
        <div class="flex items-center justify-between pb-2 border-b border-[#e2e8dd]">
          <span class="text-xs font-bold uppercase text-[#2b5e3b]">N° Factura</span>
          <span class="text-xs font-mono font-bold text-[#1a2e1f] bg-[#f4f7f2] px-2.5 py-1 rounded-md border border-[#dce4d7]">
            {{ compra.factura || '—' }}
          </span>
        </div>

        <!-- Tabla Desplegable / Con Scroll Móvil -->
        <div class="space-y-2">
          <p class="text-xs uppercase tracking-wider text-[#1a2e1f] font-bold m-0 flex items-center gap-3.5">
            <i class="pi pi-box text-[#2b5e3b]" /> Productos Registrados
          </p>

          <div class="rounded-xl border border-[#e2e8dd] overflow-hidden bg-white shadow-2xs">
            <DataTable
              v-model:expandedRows="expandedRows"
              :value="productos"
              :loading="cargando"
              dataKey="nombre"
              scrollable
              scrollHeight="220px"
              class="p-datatable-custom text-xs w-full"
            >
              <template #empty>
                <div class="text-center py-6 text-gray-400 text-xs">
                  No hay productos registrados en esta factura.
                </div>
              </template>

              <!-- Columna Expansible -->
              <Column expander style="width: 2.2rem" />

              <Column header="Producto">
                <template #body="{ data }">
                  <div class="flex flex-col">
                    <span class="font-bold text-[#1a2e1f] capitalize">
                      {{ data.nombre }}
                    </span>
                    <span class="text-[10px] text-gray-500">
                      Cant: {{ data.cantidad }}
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

              <!-- Desplegable Móvil -->
              <template #expansion="{ data }">
                <div class="p-3 bg-[#f8faf7] border-y border-[#e2e8dd] text-xs">
                  <div class="bg-white p-3 rounded-lg border border-[#e2e8dd] space-y-2">
                    <div class="flex justify-between pb-1.5 border-b border-gray-100">
                      <span class="text-gray-500 font-medium">Cantidad:</span>
                      <span class="font-mono font-bold text-[#1a2e1f]">{{ data.cantidad }}</span>
                    </div>
                    <div class="flex justify-between pb-1.5 border-b border-gray-100">
                      <span class="text-gray-500 font-medium">Precio Unitario:</span>
                      <span class="font-mono">${{ formatCurrency(data.precio) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500 font-medium">Subtotal Línea:</span>
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

        <!-- Resumen Financiero Móvil -->
        <div class="bg-[#fbfdf9] rounded-xl border border-[#e2e8dd] p-3.5 space-y-2 text-xs">
          <div class="flex justify-between items-center text-gray-600">
            <span>Gravado:</span>
            <span class="font-mono">$0.00</span>
          </div>
          <div class="flex justify-between items-center text-gray-600">
            <span>Exento:</span>
            <span class="font-mono">$0.00</span>
          </div>
          <div class="flex justify-between items-center text-gray-600 pb-2 border-b border-[#e2e8dd]">
            <span>IVA (13%):</span>
            <span class="font-mono">$0.00</span>
          </div>
          <div class="flex justify-between items-center pt-1">
            <span class="font-bold text-[#1e3a2f] uppercase">Total Factura:</span>
            <span class="text-lg font-black text-[#2b5e3b] font-mono">${{ formatCurrency(compra?.total) }}</span>
          </div>
        </div>

        <!-- Botón Cierre Móvil -->
        <div class="pt-2 flex flex-col gap-2 w-full">
          <Button
            label="Cerrar factura"
            icon="pi pi-times"
            severity="secondary"
            outlined
            class="!text-xs !py-3 !border-[#cbd5e1] !text-gray-600 !rounded-xl !w-full font-semibold cursor-pointer"
            @click="visibleModel = false"
          />
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- VISTA ESCRITORIO (>= 640px)                             -->
      <!-- ======================================================= -->
      <div class="hidden sm:flex bg-white p-6 text-[#1a2e1f] flex-col gap-5 font-['Inter',sans-serif]">
        
        <!-- Subcabecera Nº Factura -->
        <div class="flex items-center justify-between pb-2 border-b border-[#e2e8dd]">
          <div class="flex items-center gap-2">
            <i class="pi pi-receipt text-[#2b5e3b] text-base" />
            <span class="text-xs font-bold uppercase tracking-wider text-[#2b5e3b]">Factura N°</span>
          </div>
          <span class="text-sm font-mono font-bold text-[#1a2e1f] bg-[#f4f7f2] px-3 py-1 rounded-lg border border-[#dce4d7]">
            {{ compra.factura || '—' }}
          </span>
        </div>

        <!-- Tabla Completa con Scrollable (Escritorio) -->
        <div class="space-y-2">
          <p class="text-xs uppercase tracking-wider text-[#1a2e1f] font-bold m-0 flex items-center pb-3 gap-1.5">
            <i class="pi pi-box text-[#2b5e3b]" /> Productos Registrados
          </p>

          <div class="rounded-2xl border border-[#e2e8dd] overflow-hidden bg-white shadow-2xs">
            <DataTable
              v-model:expandedRows="expandedRows"
              :value="productos"
              :loading="cargando"
              dataKey="nombre"
              scrollable
              scrollHeight="280px"
              responsiveLayout="scroll"
              class="p-datatable-custom text-xs w-full"
            >
              <template #empty>
                <div class="text-center py-8 text-gray-400 text-sm">
                  No hay productos registrados en esta factura.
                </div>
              </template>

              <!-- Columna Expansible -->
              <Column expander style="width: 2.5rem" />

              <Column header="Producto" class="font-semibold text-[#1a2e1f]">
                <template #body="{ data }">
                  <span class="font-bold text-[#1a2e1f] capitalize">
                    {{ data.nombre }}
                  </span>
                </template>
              </Column>

              <Column header="Cantidad" class="text-center">
                <template #body="{ data }">
                  <span class="font-mono font-semibold text-gray-700">{{ data.cantidad }}</span>
                </template>
              </Column>

              <Column header="Precio Unit." class="text-right">
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

              <!-- Desplegable con Detalle Secundario -->
              <template #expansion="{ data }">
                <div class="p-3 bg-[#f8faf7] border-y border-[#e2e8dd] text-xs">
                  <div class="bg-white p-3.5 rounded-xl border border-[#e2e8dd] grid grid-cols-3 gap-4">
                    <div>
                      <span class="text-[10px] font-bold uppercase text-[#2b5e3b] block mb-0.5">Cantidad Comprada</span>
                      <span class="font-mono text-gray-700">{{ data.cantidad }}</span>
                    </div>
                    <div>
                      <span class="text-[10px] font-bold uppercase text-[#2b5e3b] block mb-0.5">Precio Unitario</span>
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

        <!-- Resumen y Cierre Escritorio -->
        <div class="flex justify-between items-end mt-1 pt-4 border-t border-[#e2e8dd] w-full">
          <!-- Desglose de Totales -->
          <div class="flex flex-col gap-1.5 min-w-[220px] text-xs bg-[#fbfdf9] p-3 rounded-xl border border-[#e2e8dd]">
            <div class="flex justify-between text-gray-600">
              <span>Gravado:</span>
              <span class="font-mono">$0.00</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Exento:</span>
              <span class="font-mono">$0.00</span>
            </div>
            <div class="flex justify-between text-gray-600 pb-1.5 border-b border-[#e2e8dd]">
              <span>IVA (13%):</span>
              <span class="font-mono">$0.00</span>
            </div>
            <div class="flex justify-between items-center pt-0.5">
              <span class="font-bold text-[#1e3a2f]">TOTAL:</span>
              <span class="text-xl font-black text-[#2b5e3b] font-mono">${{ formatCurrency(compra?.total) }}</span>
            </div>
          </div>

          <Button
            label="Cerrar factura"
            icon="pi pi-times"
            severity="secondary"
            outlined
            class="!text-sm !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl font-semibold cursor-pointer w-[30%] flex justify-center items-center"
            @click="visibleModel = false"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { getDetallesVenta } from '@/services/ventaService'
import { 
  mostrarError, 
  mostrarAccesoDenegado 
} from '@/utils/SweetAlertService'

const props = defineProps({
  visible: Boolean,
  compra: Object
})

const emit = defineEmits(['update:visible'])

const visibleModel = ref(props.visible)
watch(() => props.visible, (val) => { visibleModel.value = val })
watch(visibleModel, (val) => { emit('update:visible', val) })

const productos = ref([])
const cargando = ref(false)
const expandedRows = ref({})

const formatCurrency = (v) => {
  const num = parseFloat(v)
  return isNaN(num) ? '0.00' : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

watch(() => props.visible, async (val) => {
  if (val && props.compra?.id) {
    cargando.value = true
    try {
      const { data } = await getDetallesVenta(props.compra.id)
      const lista = data.data || data
      productos.value = lista.map(d => ({
        nombre: d.nombre_producto,
        cantidad: parseFloat(d.cantidad),
        precio: parseFloat(d.precio_unitario)
      }))
    } catch (error) {
      const status = error.response?.status
      productos.value = []
      if (status === 403) {
        mostrarAccesoDenegado()
      } else {
        mostrarError('Error de carga', 'No se pudieron consultar los productos de la factura.')
      }
    } finally {
      cargando.value = false
    }
  }
})
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