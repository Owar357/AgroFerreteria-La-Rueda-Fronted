<template>
  <div class="bg-[#eef2e9] min-h-screen p-3 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <!-- BOTÓN REGRESAR -->
    <div class="mb-3">
      <!-- Vista Móvil: Botón Full Width -->
      <div class="block sm:hidden">
        <Button 
          icon="pi pi-arrow-left" 
          label="Volver a Clientes" 
          severity="secondary" 
          text
          class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white !px-4 !py-2.5 !rounded-xl transition-all cursor-pointer text-xs font-semibold w-full flex justify-center"
          @click="router.back()" 
        />
      </div>

      <!-- Vista Escritorio: Botón Compacto -->
      <div class="hidden sm:flex items-center justify-between">
        <Button 
          icon="pi pi-arrow-left" 
          label="Volver a Clientes" 
          severity="secondary" 
          text
          class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white !px-4 !py-2 !rounded-xl transition-all cursor-pointer text-xs font-semibold"
          @click="router.back()" 
        />
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA MÓVIL ENCABEZADO (Solo Teléfono / Tablet < 1024px)-->
    <!-- ======================================================= -->
    <div class="block lg:hidden mb-4">
      <div class="flex items-center gap-3">
        <div
          class="!w-[2.5rem] !h-[2.5rem] rounded-xl bg-white border border-[#e2e8dd] shadow-2xs flex items-center justify-center shrink-0">
          <i class="pi pi-shopping-bag text-[#2b5e3b] text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[#1a2e1f] leading-tight m-0">
            Historial de Compras
          </h1>
          <p class="text-xs text-gray-500 mt-0.5 m-0">
            Consulta de facturas y transacciones del cliente
          </p>
        </div>
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO ENCABEZADO (Solo PC >= 1024px)        -->
    <!-- ======================================================= -->
    <div class="hidden lg:flex items-center gap-3 mb-6">
      <div
        class="!w-[2.5rem] !h-[2.5rem] rounded-xl bg-white border border-[#e2e8dd] shadow-sm flex items-center justify-center shrink-0">
        <i class="pi pi-shopping-bag text-[#2b5e3b] text-xl"></i>
      </div>
      <div>
        <h1 class="text-[1.75rem] md:text-[2rem] font-bold text-[#1a2e1f] leading-tight m-0">
          Historial de Compras del Cliente
        </h1>
        <p class="text-sm text-gray-500 mt-0.5 m-0">
          Consulta de facturas y transacciones realizadas por el cliente
        </p>
      </div>
    </div>
      <!-- TARJETA CONTENEDORA PRINCIPAL -->
      <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm overflow-hidden w-full">

          <!-- ======================================================= -->
          <!-- VISTA MÓVIL FILTROS (Solo Teléfono / Tablet)           -->
          <!-- ======================================================= -->
          <div class="block lg:hidden p-4 border-b border-[#e2e8dd] bg-[#fbfdf9]">
            <div class="flex flex-col gap-2">
              <IconField class="w-full relative flex items-center h-[2.5rem]">
                <InputIcon class="pi pi-search text-gray-400 pointer-events-none z-10" />
                <InputText
                  v-model="filtroFactura"
                  placeholder="Buscar por N° Factura..."
                  class="w-full !h-[2.5rem] !bg-white !border-gray-300 text-[#1a2e1f] rounded-xl !pl-9 focus:!border-[#2b5e3b] box-border"
                />
              </IconField>
              
              <div v-if="filtroFactura" class="flex justify-end">
                <span
                  @click="filtroFactura = ''"
                  class="text-xs text-[#2b5e3b] font-semibold cursor-pointer hover:underline"
                >
                  Limpiar filtro
                </span>
              </div>
            </div>
          </div>

          <!-- ======================================================= -->
          <!-- VISTA ESCRITORIO FILTROS (Solo PC)                      -->
          <!-- ======================================================= -->
          <div class="hidden lg:block p-5 border-b border-[#e2e8dd] bg-[#fbfdf9]">
            <div class="flex items-center gap-3 w-80">
              <IconField class="w-full relative flex items-center h-10">
                <InputIcon class="pi pi-search text-gray-400 text-sm" />
                <InputText
                  v-model="filtroFactura"
                  placeholder="Buscar por N° Factura..."
                  class="w-full !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-10 focus:!border-[#2b5e3b]"
                />
              </IconField>
              <Button
                v-if="filtroFactura"
                icon="pi pi-times"
                text
                rounded
                severity="secondary"
                v-tooltip.top="'Limpiar filtro'"
                @click="filtroFactura = ''"
              />
            </div>
          </div>

          <!-- ======================================================= -->
          <!-- VISTA MÓVIL: Tabla con Desplegable (< 1024px)           -->
          <!-- ======================================================= -->
          <div class="block lg:hidden w-full">
            <DataTable
              v-model:expandedRows="expandedRows"
              :value="cargando ? Array.from({ length: filas }) : purchasesFiltradas"
              dataKey="id"
              class="p-datatable-custom text-sm w-full"
              :rows="filas"
              :paginator="purchasesFiltradas.length > filas"
              paginatorTemplate="PrevPageLink PageLinks NextPageLink"
              currentPageReportTemplate="{first}-{last} de {totalRecords}"
            >
              <template #empty>
                <div class="flex flex-col items-center justify-center py-8 text-gray-400">
                  <i class="pi pi-inbox text-3xl mb-2 opacity-40" />
                  <span class="text-sm font-medium">No se encontraron facturas</span>
                </div>
              </template>

              <Column expander style="width: 2.2rem" />

              <!-- Factura y Fecha -->
              <Column header="Factura / Fecha">
                <template #body="{ data }">
                  <div v-if="cargando" class="space-y-1">
                    <Skeleton width="60%" height="1rem" />
                    <Skeleton width="40%" height="0.8rem" />
                  </div>
                  <div v-else class="flex flex-col gap-0.5 items-start">
                    <span class="font-mono text-[11px] bg-[#f1f5f0] text-[#334155] px-2 py-0.5 rounded border border-[#e2e8dd] font-bold uppercase whitespace-nowrap">
                      {{ data.factura }}
                    </span>
                    <span class="text-xs text-gray-500 font-mono block">
                      {{ data.date }}
                    </span>
                  </div>
                </template>
              </Column>

              <!-- Monto y Estado -->
              <Column header="Monto / Estado" class="text-right">
                <template #body="{ data }">
                  <div v-if="cargando" class="flex flex-col items-end gap-1">
                    <Skeleton width="3.5rem" height="1rem" />
                    <Skeleton width="4rem" height="1.2rem" borderRadius="12px" />
                  </div>
                  <div v-else class="flex flex-col items-end gap-1">
                    <span class="font-bold text-[#2b5e3b] text-xs font-mono">
                      ${{ data.total.toFixed(2) }}
                    </span>
                    <Tag
                      :value="data.estado"
                      :severity="data.status === 'Pagado' || data.estado === 'PROCESADA' ? 'success' : 'danger'"
                      rounded
                      class="!text-[9px] !px-2 !py-0 whitespace-nowrap"
                    />
                  </div>
                </template>
              </Column>

              <!-- Plantilla de Expansión Móvil -->
              <template #expansion="{ data }">
                <div class="p-3 bg-[#f1f5f0] border-y border-[#e2e8dd] text-sm">
                  <div class="bg-white p-3.5 rounded-xl border border-[#e2e8dd] shadow-2xs space-y-2.5">
                    
                    <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
                      <span class="text-[10px] font-bold uppercase text-[#6b7280]">N° Factura</span>
                      <span class="font-mono text-xs text-[#2b5e3b] font-bold">{{ data.factura }}</span>
                    </div>

                    <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
                      <span class="text-[10px] font-bold uppercase text-[#6b7280]">Fecha Transacción</span>
                      <span class="font-mono text-xs text-[#334155] font-semibold">{{ data.date }}</span>
                    </div>

                    <div class="flex justify-between items-center">
                      <span class="text-[10px] font-bold uppercase text-[#6b7280]">Monto Total</span>
                      <span class="font-mono text-xs text-[#2b5e3b] font-bold">${{ data.total.toFixed(2) }}</span>
                    </div>

                  </div>

                  <!-- Botón Móvil -->
                  <div class="mt-3 flex justify-end">
                    <Button
                      icon="pi pi-eye"
                      label="Ver Detalle"
                      class="!bg-white hover:!bg-[#f4f7f2] !text-[#2b5e3b] !border !border-[#2b5e3b] rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer shadow-2xs w-full justify-center"
                      @click="abrirDetalleCompra(data)"
                    />
                  </div>

                </div>
              </template>
            </DataTable>
          </div>

          <!-- ======================================================= -->
          <!-- VISTA ESCRITORIO: Tabla Completa Tradicional (>= 1024px)-->
          <!-- ======================================================= -->
          <div class="hidden lg:block w-full overflow-x-auto">
            <DataTable
              :value="cargando ? Array.from({ length: filas }) : purchasesFiltradas"
              responsiveLayout="scroll"
              class="p-datatable-custom text-sm w-full min-w-[45rem]"
              :rows="filas"
              :paginator="purchasesFiltradas.length > filas"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} compras"
              :rowsPerPageOptions="[10, 20, 50]"
            >
              <template #empty>
                <div class="flex flex-col items-center justify-center py-12 text-gray-400">
                  <i class="pi pi-inbox text-[48px] mb-3 text-gray-300" />
                  <span class="text-[15px] font-medium">No se encontraron facturas</span>
                </div>
              </template>

              <Column field="factura" header="N° Factura" class="min-w-[10rem]">
                <template #body="{ data }">
                  <Skeleton v-if="cargando" width="5rem" height="1.2rem" />
                  <span v-else class="font-mono text-xs bg-[#f1f5f0] text-[#334155] px-2 py-0.5 rounded border border-[#e2e8dd] font-bold uppercase">
                    {{ data.factura }}
                  </span>
                </template>
              </Column>

              <Column field="date" header="Fecha" class="min-w-[9rem]">
                <template #body="{ data }">
                  <Skeleton v-if="cargando" width="5.5rem" height="1.2rem" />
                  <span v-else class="text-gray-600 font-mono text-xs">{{ data.date }}</span>
                </template>
              </Column>

              <Column field="total" header="Monto Total" class="text-right min-w-[9rem]">
                <template #body="{ data }">
                  <Skeleton v-if="cargando" width="4rem" height="1.2rem" class="ml-auto" />
                  <span v-else class="font-bold text-[#2b5e3b] font-mono">${{ data.total.toFixed(2) }}</span>
                </template>
              </Column>

              <Column field="status" header="Estado" class="text-center min-w-[8.5rem]">
                <template #body="{ data }">
                  <Skeleton v-if="cargando" width="5.5rem" height="1.5rem" borderRadius="20px" class="mx-auto" />
                  <Tag
                    v-else
                    :value="data.estado"
                    :severity="data.status === 'Pagado' || data.estado === 'PROCESADA' ? 'success' : 'danger'"
                    rounded
                    class="!text-xs !px-2.5 whitespace-nowrap uppercase"
                  />
                </template>
              </Column>

              <Column header="Acciones" class="w-[6rem] shrink-0 text-center">
                <template #body="{ data }">
                  <div class="flex gap-2 justify-center">
                    <Skeleton v-if="cargando" shape="circle" size="2rem" />
                    <Button
                      v-else
                      icon="pi pi-eye"
                      v-tooltip.top="'Ver detalle'"
                      class="!bg-[#2b5e3b] hover:!bg-[#1f482d] border-none text-white w-8 h-8 rounded-full p-0 transition-colors shadow-sm cursor-pointer"
                      @click="abrirDetalleCompra(data)"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>

      </div>

    <DetalleFacturaDialogo v-model:visible="mostrarDetalleCompra" :compra="compraSeleccionada" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Skeleton from 'primevue/skeleton'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import DetalleFacturaDialogo from './DetalleFacturaDialogo.vue'
import { getVentas, getDetallesVenta } from '@/services/ventaService'
import { 
  mostrarError, 
  mostrarAccesoDenegado, 
  mostrarCargando 
} from '@/utils/SweetAlertService'

const route = useRoute()
const router = useRouter()

const clientName = route.query.nombre || '—'
const clientId = route.params.id || route.query.clienteId

const expandedRows = ref({})
const mostrarDetalleCompra = ref(false)
const compraSeleccionada = ref(null)
const purchases = ref([])
const cargando = ref(false)
const filtroFactura = ref('')
const filas = 10

const cargarHistorial = async () => {
  cargando.value = true
  try {
    const { data } = await getVentas({ cliente: clientId, per_page: 50 })
    const lista = data.data || data

    purchases.value = lista.map((venta) => ({
      id: venta.id,
      factura: venta.numero_factura,
      date: new Date(venta.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      total: parseFloat(venta.total),
      estado: venta.estado,
      status: venta.estado,
    }))
  } catch (error) {
    const status = error.response?.status
    if (status === 403) {
      mostrarAccesoDenegado()
    } else {
      mostrarError('Error', 'No se pudo obtener el historial de compras del cliente.')
    }
  } finally {
    cargando.value = false
  }
}

async function abrirDetalleCompra(compra) {
  mostrarCargando('Cargando detalles...', 'Consultando información de la factura')
  try {
    const [{ data }] = await Promise.all([
      getDetallesVenta(compra.id),
      new Promise((resolve) => setTimeout(resolve, 300))
    ])
    const detalles = data.data || data

    compraSeleccionada.value = {
      ...compra,
      detalles: detalles.map((d) => ({
        nombre: d.nombre_producto,
        cantidad: parseFloat(d.cantidad),
        precio: parseFloat(d.precio_unitario),
      })),
    }
    Swal.close()
    mostrarDetalleCompra.value = true
  } catch (error) {
    const status = error.response?.status
    if (status === 403) {
      mostrarAccesoDenegado()
    } else {
      mostrarError('Error', 'No se pudieron obtener los detalles de la factura.')
    }
  }
}

const purchasesFiltradas = computed(() => {
  if (!filtroFactura.value.trim()) return purchases.value
  const query = filtroFactura.value.trim().toLowerCase()
  return purchases.value.filter((p) => p.factura.toLowerCase().includes(query))
})

onMounted(cargarHistorial)
</script>

<style>
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #fbfdf9 !important;
  color: #2b5e3b !important;
  font-weight: 600 !important;
  font-size: 0.8rem !important;
  padding: 0.75rem 1rem !important;
  border-bottom: 1px solid #e2e8dd !important;
  white-space: nowrap !important;
}

.p-datatable-custom .p-datatable-tbody > tr > td {
  padding: 0.75rem 1rem !important;
  font-size: 0.85rem !important;
  border-bottom: 1px solid #f1f5f0 !important;
}

.p-datatable-custom .p-datatable-tbody > tr:hover {
  background-color: #f4f8f3 !important;
}
</style>