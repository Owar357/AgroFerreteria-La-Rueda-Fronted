<template>
  <div class="bg-[#eef2e9] min-h-screen p-3 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <!-- ======================================================= -->
    <!-- VISTA MÓVIL ENCABEZADO (Solo Teléfono / Tablet < 1024px)-->
    <!-- ======================================================= -->
    <div class="block lg:hidden mb-4">
      <div class="flex items-center gap-3">
        <div
          class="!w-[2.5rem] !h-[2.5rem] rounded-xl bg-white border border-[#e2e8dd] shadow-2xs flex items-center justify-center shrink-0"
        >
          <i class="pi pi-shopping-bag text-[#2b5e3b] text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[#1a2e1f] leading-tight m-0">Registro de Compras</h1>
          <p class="text-xs text-gray-500 mt-0.5 m-0">Adquisiciones, comprobantes y pagos</p>
        </div>
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO ENCABEZADO (Solo PC >= 1024px)        -->
    <!-- ======================================================= -->
    <div class="hidden lg:flex items-center gap-3 mb-6">
      <div
        class="!w-[2.5rem] !h-[2.5rem] rounded-xl bg-white border border-[#e2e8dd] shadow-sm flex items-center justify-center shrink-0"
      >
        <i class="pi pi-shopping-bag text-[#2b5e3b] text-xl"></i>
      </div>
      <div>
        <h1 class="text-[1.75rem] md:text-[2rem] font-bold text-[#1a2e1f] leading-tight m-0">
          Registro de Compras Realizadas
        </h1>
        <p class="text-sm text-gray-500 mt-0.5 m-0">
          Gestión de adquisiciones, comprobantes y estados de pago
        </p>
      </div>
    </div>

    <!-- COTENEDOR -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm overflow-hidden w-full">
      <!-- ======================================================= -->
      <!-- VISTA MÓVIL FILTROS (Solo Teléfono / Tablet)           -->
      <!-- ======================================================= -->
      <div class="block lg:hidden p-4 border-b border-[#e2e8dd] bg-[#fbfdf9] space-y-3">
        <div class="flex flex-col gap-3">
          <!-- Botón Agregar Compra Móvil -->
          <Button
            v-if="!isContador"
            label="Agregar Compra"
            icon="pi pi-plus"
            class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold h-11 rounded-xl border-none cursor-pointer shadow-sm w-full flex justify-center items-center gap-2"
            @click="emit('open-add')"
          />

          <!-- Filtro estado -->
          <Select
            v-model="estadoSeleccionado"
            :options="estadosPago"
            placeholder="Filtrar por Estado..."
            class="w-full !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-10 flex items-center px-2"
            showClear
            @change="emitirFiltros"
            @clear="emitirFiltros"
          />

          <!-- Filtro proveedor -->
          <AutoComplete
            v-model="proveedorSeleccionado"
            optionLabel="nombre"
            :suggestions="proveedoresFiltrados"
            @complete="buscarProveedor"
            @item-select="emitirFiltros"
            @clear="emitirFiltros"
            placeholder="Buscar proveedor..."
            class="w-full"
            fluid
            :pt="{
              pcInputText: {
                root: {
                  class:
                    '!bg-white !border-gray-300 !text-[#1a2e1f] !text-sm !h-10 rounded-xl w-full',
                },
              },
            }"
          />

          <!-- Rango Fechas Móvil (Alineación a 100% de Ancho) -->
          <div class="flex flex-col gap-2.5 pt-2 border-t border-[#e2e8dd]/60">
            <span class="text-xs font-bold text-[#2b5e3b] uppercase tracking-wider block">
              Filtrar por fecha:
            </span>

            <!-- Desde 100% -->
            <div class="flex flex-col gap-1 w-full">
              <span class="text-[11px] font-semibold text-gray-500">Desde:</span>
              <DatePicker
                v-model="fechaInicio"
                placeholder="dd-mm-aaaa"
                dateFormat="dd-mm-yy"
                class="w-full !bg-white !border-gray-300 text-[#1a2e1f] text-xs rounded-xl h-10"
                showClear
                :pt="{ pcInputText: { root: { readonly: true } } }"
                @update:modelValue="emitirFiltros"
              />
            </div>

            <!-- Hasta 100% -->
            <div class="flex flex-col gap-1 w-full">
              <span class="text-[11px] font-semibold text-gray-500">Hasta:</span>
              <DatePicker
                v-model="fechaFin"
                placeholder="dd-mm-aaaa"
                dateFormat="dd-mm-yy"
                class="w-full !bg-white !border-gray-300 text-[#1a2e1f] text-xs rounded-xl h-10"
                showClear
                :pt="{ pcInputText: { root: { readonly: true } } }"
                @update:modelValue="emitirFiltros"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- VISTA ESCRITORIO FILTROS  -->
      <!-- ======================================================= -->
      <div class="hidden lg:block p-5 border-b border-[#e2e8dd] bg-[#fbfdf9]">
        <div class="flex flex-col gap-3.5 w-full">
          <!-- FILA 1: Estado, Proveedor y Botón Agregar Compra -->
          <div class="flex items-center justify-between gap-4 w-full">
            <div class="flex items-center gap-3 flex-1">
              <!-- Estado -->
              <Select
                v-model="estadoSeleccionado"
                :options="estadosPago"
                placeholder="Estado..."
                class="!bg-white !border-gray-300 text-[#1a2e1f] w-[30%] text-sm rounded-xl h-10 flex items-center px-2"
                showClear
                @change="emitirFiltros"
                @clear="emitirFiltros"
              />

              <!-- Proveedor -->
              <div class="w-[70%]">
                <AutoComplete
                  v-model="proveedorSeleccionado"
                  optionLabel="nombre"
                  :suggestions="proveedoresFiltrados"
                  @complete="buscarProveedor"
                  @item-select="emitirFiltros"
                  @clear="emitirFiltros"
                  placeholder="Buscar proveedor..."
                  fluid
                  :pt="{
                    pcInputText: {
                      root: {
                        class:
                          '!bg-white !border-gray-300 !text-[#1a2e1f] !text-sm !h-10 rounded-xl w-full',
                      },
                    },
                  }"
                />
              </div>
            </div>

            <!-- Botón Agregar Compra a la Derecha -->
            <Button
              v-if="!isContador"
              label="Agregar Compra"
              icon="pi pi-plus"
              class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold px-5 h-10 rounded-xl border-none cursor-pointer shadow-sm transition-all whitespace-nowrap flex items-center gap-2 shrink-0"
              @click="emit('open-add')"
            />
          </div>

          <!-- FILA 2: Fechas en su propia línea inferior -->
          <div class="flex items-center gap-4 pt-2 border-t border-[#e2e8dd]/60">
            <!-- Título al inicio de la fila -->
            <span class="text-xs font-bold text-[#2b5e3b] uppercase tracking-wider shrink-0">
              Filtrar por fecha:
            </span>

            <!-- Desde -->
            <div class="flex items-center gap-2 w-[22%] shrink-0">
              <span class="text-[1rem] font-semibold text-gray-500 shrink-0">Desde:</span>
              <DatePicker
                v-model="fechaInicio"
                placeholder="dd-mm-aaaa"
                dateFormat="dd-mm-yy"
                class="w-full !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-10"
                showClear
                :pt="{ pcInputText: { root: { readonly: true } } }"
                @update:modelValue="emitirFiltros"
              />
            </div>

            <!-- Hasta -->
            <div class="flex items-center gap-2 w-[22%] shrink-0">
              <span class="text-[1rem] font-semibold text-gray-500 shrink-0">Hasta:</span>
              <DatePicker
                v-model="fechaFin"
                placeholder="dd-mm-aaaa"
                dateFormat="dd-mm-yy"
                class="w-full !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-10"
                showClear
                :pt="{ pcInputText: { root: { readonly: true } } }"
                @update:modelValue="emitirFiltros"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- VISTA MÓVIL: Tabla con Desplegable (< 1024px)           -->
      <!-- ======================================================= -->
      <div class="block lg:hidden w-full">
        <DataTable
          v-model:expandedRows="expandedRows"
          :value="loading ? Array.from({ length: 5 }) : compras"
          dataKey="id"
          class="p-datatable-custom text-sm w-full"
          :paginator="!loading"
          :rows="5"
          :totalRecords="paginacion.total"
          :lazy="true"
          @page="(e) => emit('cambiar-pagina', e.page + 1)"
          currentPageReportTemplate="{first}-{last} de {totalRecords}"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center py-8 text-gray-400">
              <i class="pi pi-inbox text-3xl mb-2 opacity-40" />
              <span class="text-sm font-medium">No se encontraron compras</span>
            </div>
          </template>

          <Column expander style="width: 2.2rem" />

          <!-- Documento y Proveedor -->
          <Column header="Documento / Proveedor">
            <template #body="slotProps">
              <div v-if="loading" class="space-y-1">
                <Skeleton width="60%" height="1rem" />
                <Skeleton width="40%" height="0.8rem" />
              </div>
              <div v-else class="flex flex-col gap-0.5 items-start">
                <span
                  class="font-mono text-[11px] bg-[#f1f5f0] text-[#334155] px-2 py-0.5 rounded border border-[#e2e8dd] font-bold uppercase whitespace-nowrap"
                >
                  {{ slotProps.data.numDocumento }}
                </span>
                <span class="text-xs text-gray-600 truncate max-w-[150px] block">
                  {{ slotProps.data.proveedor }}
                </span>
              </div>
            </template>
          </Column>

          <!-- Monto y Estado -->
          <Column header="Monto / Estado" class="text-right">
            <template #body="slotProps">
              <div v-if="loading" class="flex flex-col items-end gap-1">
                <Skeleton width="3.5rem" height="1rem" />
                <Skeleton width="4rem" height="1.2rem" borderRadius="12px" />
              </div>
              <div v-else class="flex flex-col items-end gap-1">
                <span class="font-bold text-[#2b5e3b] text-xs font-mono">
                  ${{ slotProps.data.precioFactura }}
                </span>
                <Tag
                  :value="slotProps.data.estadoPago"
                  :severity="obtenerSeveridadPago(slotProps.data.estadoPago)"
                  rounded
                  class="!text-[9px] !px-2 !py-0 whitespace-nowrap"
                />
              </div>
            </template>
          </Column>

          <!-- Plantilla de Expansión Móvil -->
          <template #expansion="slotProps">
            <div class="p-3 bg-[#f1f5f0] border-y border-[#e2e8dd] text-sm">
              <div class="bg-white p-3.5 rounded-xl border border-[#e2e8dd] shadow-2xs space-y-2.5">
                <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#6b7280] block"
                      >Fecha Emisión</span
                    >
                    <span class="font-mono text-xs text-[#334155] font-semibold">{{
                      slotProps.data.fechaEmision
                    }}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-bold uppercase text-[#6b7280] block"
                      >Tipo Documento</span
                    >
                    <span class="text-xs text-[#334155] font-semibold">{{
                      slotProps.data.tipoDocumento
                    }}</span>
                  </div>
                </div>

                <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#6b7280] block"
                      >Estado Registro</span
                    >
                    <Tag
                      :value="slotProps.data.esAnulado ? 'ANULADA' : 'ACTIVA'"
                      :severity="slotProps.data.esAnulado ? 'secondary' : 'success'"
                      rounded
                      class="!text-[10px] !px-2 !py-0.5"
                    />
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-bold uppercase text-[#6b7280] block"
                      >Proveedor</span
                    >
                    <span class="text-xs text-[#334155] font-medium">{{
                      slotProps.data.proveedor
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Botones Móvil -->
              <div class="mt-3 flex gap-2 justify-end items-center">
                <Button
                  icon="pi pi-eye"
                  label="Ver"
                  class="!bg-white hover:!bg-[#f4f7f2] !text-[#2b5e3b] !border !border-[#2b5e3b] rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer shadow-2xs flex-1 justify-center"
                  @click="verDetalles(slotProps.data)"
                />

                <Button
                  v-if="!slotProps.data.esAnulado && !isContador"
                  icon="pi pi-ban"
                  label="Anular"
                  class="!bg-white hover:!bg-[#fde8e8] !text-[#9c2a2a] !border !border-[#f0c9c9] rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer shadow-2xs flex-1 justify-center"
                  @click="anularCompra(slotProps.data)"
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
          :value="loading ? Array.from({ length: 5 }) : compras"
          responsiveLayout="scroll"
          class="p-datatable-custom text-sm w-full min-w-[55rem]"
          :paginator="!loading"
          :rows="5"
          :totalRecords="paginacion.total"
          :lazy="true"
          @page="(e) => emit('cambiar-pagina', e.page + 1)"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} compras"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center py-12 text-gray-400">
              <i class="pi pi-inbox text-[48px] mb-3 text-gray-300" />
              <span class="text-[15px] font-medium">No se encontraron compras</span>
            </div>
          </template>

          <Column field="fechaEmision" header="Fecha Emisión" class="min-w-[8.5rem]">
            <template #body="slotProps">
              <Skeleton v-if="loading" width="5.5rem" height="1.2rem" />
              <span v-else class="font-mono text-xs">{{ slotProps.data.fechaEmision }}</span>
            </template>
          </Column>

          <Column
            field="proveedor"
            header="Proveedor"
            class="text-gray-700 font-medium min-w-[12rem]"
          >
            <template #body="slotProps">
              <Skeleton v-if="loading" width="75%" height="1.2rem" />
              <span v-else class="capitalize block">{{ slotProps.data.proveedor }}</span>
            </template>
          </Column>

          <Column field="tipoDocumento" header="Tipo Documento" class="min-w-[9.5rem]">
            <template #body="slotProps">
              <Skeleton v-if="loading" width="4.5rem" height="1.2rem" />
              <span v-else>{{ slotProps.data.tipoDocumento }}</span>
            </template>
          </Column>

          <Column field="numDocumento" header="Nº Documento" class="min-w-[9.5rem]">
            <template #body="slotProps">
              <Skeleton v-if="loading" width="5rem" height="1.2rem" />
              <span
                v-else
                class="font-mono text-xs bg-[#f1f5f0] text-[#334155] px-2 py-0.5 rounded border border-[#e2e8dd] font-bold uppercase"
              >
                {{ slotProps.data.numDocumento }}
              </span>
            </template>
          </Column>

          <Column field="precioFactura" header="Precio Factura" class="text-right min-w-[8.5rem]">
            <template #body="slotProps">
              <Skeleton v-if="loading" width="4rem" height="1.2rem" class="ml-auto" />
              <span v-else class="font-bold text-[#2b5e3b] font-mono"
                >${{ slotProps.data.precioFactura }}</span
              >
            </template>
          </Column>

          <Column field="estadoPago" header="Estado de Pago" class="text-center min-w-[9rem]">
            <template #body="slotProps">
              <Skeleton
                v-if="loading"
                width="5.5rem"
                height="1.5rem"
                borderRadius="20px"
                class="mx-auto"
              />
              <Tag
                v-else
                :value="slotProps.data.estadoPago"
                :severity="obtenerSeveridadPago(slotProps.data.estadoPago)"
                rounded
                class="!text-xs !px-2.5 whitespace-nowrap"
              />
            </template>
          </Column>

          <Column header="Estado Compra" class="text-center min-w-[8.5rem]">
            <template #body="slotProps">
              <Skeleton
                v-if="loading"
                width="4.5rem"
                height="1.5rem"
                borderRadius="20px"
                class="mx-auto"
              />
              <Tag
                v-else
                :value="slotProps.data.esAnulado ? 'ANULADA' : 'ACTIVA'"
                :severity="slotProps.data.esAnulado ? 'secondary' : 'success'"
                rounded
                class="!text-xs !px-2.5 whitespace-nowrap"
              />
            </template>
          </Column>

          <Column header="Acciones" class="w-[11rem] shrink-0">
            <template #body="slotProps">
              <div class="flex items-center gap-1.5 justify-end whitespace-nowrap">
                <template v-if="loading">
                  <Skeleton width="3.8rem" height="2rem" borderRadius="8px" />
                  <Skeleton width="4.5rem" height="2rem" borderRadius="8px" />
                </template>

                <template v-else>
                  <Button
                    icon="pi pi-eye"
                    label="Ver"
                    class="!bg-white hover:!bg-[#f4f7f2] !text-[#2b5e3b] !border !border-[#2b5e3b] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                    v-tooltip.top="'Ver detalles'"
                    @click="verDetalles(slotProps.data)"
                  />
                  <Button
                    v-if="!slotProps.data.esAnulado && !isContador"
                    icon="pi pi-ban"
                    label="Anular"
                    class="!bg-white hover:!bg-[#fde8e8] !text-[#9c2a2a] !border !border-[#f0c9c9] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                    v-tooltip.top="'Anular compra'"
                    @click="anularCompra(slotProps.data)"
                  />
                </template>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Select from 'primevue/select'
import AutoComplete from 'primevue/autocomplete'
import Skeleton from 'primevue/skeleton'
import Tag from 'primevue/tag'
import { DatePicker } from 'primevue'
import { proveedores as getProveedores } from '@/services/proveedorService'
import authService from '@/services/authService'
import {
  mostrarConfirmacion,
  mostrarCargando,
  mostrarExito,
  mostrarError,
} from '@/utils/SweetAlertService'

const props = defineProps({
  compras: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  paginacion: {
    type: Object,
    default: () => ({ currentPage: 1, lastPage: 1, perPage: 5, total: 0 }),
  },
})

const isContador = authService.getUserRole() === 'CONTADOR'
const emit = defineEmits(['open-add', 'cambiar-pagina', 'filtrar', 'anular-compra', 'ver-detalle'])

const expandedRows = ref({})
const estadoSeleccionado = ref(null)
const proveedorSeleccionado = ref(null)
const fechaInicio = ref(null)
const fechaFin = ref(null)
const estadosPago = ref(['PAGADO', 'PENDIENTE', 'ABONADO', 'VENCIDO', 'ANULADA'])
const proveedoresOptions = ref([])
const proveedoresFiltrados = ref([])

const obtenerSeveridadPago = (estado) => {
  switch (estado) {
    case 'PAGADO':
      return 'success'
    case 'PENDIENTE':
      return 'warn'
    case 'ABONADO':
      return 'info'
    case 'VENCIDO':
      return 'danger'
    case 'ANULADA':
      return 'secondary'
    default:
      return 'contrast'
  }
}

const buscarProveedor = (event) => {
  const q = event.query.toLowerCase().trim()
  if (!q) {
    proveedoresFiltrados.value = [...proveedoresOptions.value]
  } else {
    proveedoresFiltrados.value = proveedoresOptions.value.filter((p) =>
      p.nombre.toLowerCase().includes(q),
    )
  }
}

const formatearFecha = (fecha) => {
  if (!fecha) return null
  const d = new Date(fecha)
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const anio = d.getFullYear()
  return `${anio}-${mes}-${dia}`
}

const emitirFiltros = () => {
  emit('filtrar', {
    estado_pago: estadoSeleccionado.value ?? null,
    proveedor: proveedorSeleccionado.value?.id ?? null,
    fecha_desde: formatearFecha(fechaInicio.value),
    fecha_hasta: formatearFecha(fechaFin.value),
  })
}

const verDetalles = (compra) => {
  emit('ver-detalle', compra)
}

const anularCompra = async (compra) => {
  const confirmacion = await mostrarConfirmacion({
    titulo: '¿Anular compra?',
    mensajeHtml: `
      <div style="text-align:left; font-size:14px; color:#374151">
        <p>Esta acción <strong>no se puede deshacer</strong> y afectará:</p>
        <ul style="margin-top:8px; padding-left:20px; line-height: 1.6;">
          <li>• El stock de los productos (se restará del inventario).</li>
          <li>• Si ocurrió algún movimiento contable asociado no se podrá anular.</li>
          <li>• El estado de pago de la compra cambiará a anulado.</li>
        </ul>
        <div style="background:#f9fafb; border:1px solid #e2e8dd; border-radius:8px; padding:12px; margin-top:12px">
          <p><strong>Documento:</strong> ${compra.numDocumento}</p>
          <p><strong>Proveedor:</strong> ${compra.proveedor}</p>
          <p><strong>Total:</strong> $${compra.precioFactura}</p>
        </div>
      </div>
    `,
    icono: 'pi-ban',
    bgIcono: '#fee2e2',
    colorIcono: '#b91c1c',
    confirmButtonText: 'Sí, anular compra',
    confirmButtonColor: '#b91c1c',
  })

  if (confirmacion.isConfirmed) {
    mostrarCargando('Anulando compra...', 'Procesando reversión de lotes y montos')
    emit('anular-compra', compra.id)
  }
}

onMounted(async () => {
  try {
    const response = await getProveedores()
    proveedoresOptions.value = response.data.data
  } catch {
    proveedoresOptions.value = []
  }
})
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
