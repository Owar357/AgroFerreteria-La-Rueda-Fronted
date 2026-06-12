<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-[26px] font-semibold tracking-tigh !text-black">
          Registro de Compras Realizadas
        </h1>
        <Button label="+ Agregar compra"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-4 py-4 rounded-lg border-none cursor-pointer shadow-md transition-all"
          @click="emit('open-add')" />
      </div>

      <div class="flex justify-start items-center w-full gap-8 flex-wrap">

        <!-- Filtro estado -->
        <Select v-model="estadoSeleccionado" :options="estadosPago" placeholder="Filtrar por Estado..."
          class="w-52 bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg" showClear
          @change="emitirFiltros" @clear="emitirFiltros" />

        <!-- Filtro proveedor -->
        <AutoComplete v-model="proveedorSeleccionado" optionLabel="nombre" :suggestions="proveedoresFiltrados"
          @complete="buscarProveedor" @item-select="emitirFiltros" @clear="emitirFiltros"
          placeholder="Buscar proveedor..." class="w-56" fluid />

        <!-- Fecha inicio -->
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-[#4b5563]">Fecha Inicio:</span>
          <DatePicker v-model="fechaInicio" placeholder="dd-mm-aaaa" dateFormat="dd-mm-yy"
            class="w-44 bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg" showClear
            @update:modelValue="emitirFiltros" />
        </div>

        <!-- Fecha fin -->
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-[#4b5563]">Fecha Fin:</span>
          <DatePicker v-model="fechaFin" placeholder="dd-mm-aaaa" dateFormat="dd-mm-yy"
            class="w-44 bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg" showClear
            @update:modelValue="emitirFiltros" />
        </div>

      </div>
    </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <DataTable :value="compras" :loading="loading" responsiveLayout="scroll" class="p-datatable-custom text-[14px]"
        :paginator="true" :rows="5" :totalRecords="paginacion.total" :lazy="true"
        @page="(e) => emit('cambiar-pagina', e.page + 1)"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} compras"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport">
        <template #empty>
          <div class="text-center py-6 text-gray-400">No se encontraron compras.</div>
        </template>

        <Column field="fechaEmision" header="Fecha Emisión" />
        <Column field="proveedor" header="Proveedor" class="text-[#6b7280]" />
        <Column field="tipoDocumento" header="Tipo Documento" />
        <Column field="numDocumento" header="Nº Documento" />

        <Column field="precioFactura" header="Precio Factura">
          <template #body="slotProps">
            <span class="font-bold text-[#2b5e3b]">${{ slotProps.data.precioFactura }}</span>
          </template>
        </Column>

        <Column field="estadoPago" header="Estado de Pago">
          <template #body="slotProps">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" :class="{
              'bg-green-100 text-green-800': slotProps.data.estadoPago === 'PAGADO',
              'bg-yellow-100 text-yellow-800': slotProps.data.estadoPago === 'PENDIENTE',
              'bg-blue-100 text-blue-800': slotProps.data.estadoPago === 'ABONADO',
              'bg-red-100 text-red-800': slotProps.data.estadoPago === 'VENCIDO',
              'bg-gray-200 text-gray-800': slotProps.data.estadoPago === 'ANULADA',
            }">
              {{ slotProps.data.estadoPago }}
            </span>
          </template>
        </Column>


        <Column header="Acciones" class="text-right w-[200px]">
          <template #body="slotProps">
            <div class="flex gap-2 justify-end">
              <Button icon="pi pi-eye" label="Ver"
                class="!bg-white hover:!bg-[#eef2e9] !text-[#1e3a2f] !border !border-[#cfe0d2] rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
                v-tooltip.top="'Ver detalles'" @click="verDetalles(slotProps.data)" />

              <Button v-if="slotProps.data.estadoPago !== 'ANULADA'" icon="pi pi-ban" label="Anular"
                class="!bg-white hover:!bg-[#fde8e8] !text-[#9c2a2a] !border !bogrder-[#f0c9c9] rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
                v-tooltip.top="'Anular compra'" @click="anularCompra(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
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
import { DatePicker } from 'primevue'
import { proveedores as getProveedores } from '@/services/proveedorService'
import Swal from 'sweetalert2'

const props = defineProps({
  compras: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  paginacion: {
    type: Object,
    default: () => ({ currentPage: 1, lastPage: 1, perPage: 5, total: 0 }),
  },
})

const emit = defineEmits(['open-add', 'cambiar-pagina', 'filtrar', 'anular-compra', 'ver-detalle'])

const estadoSeleccionado = ref(null)
const proveedorSeleccionado = ref(null)
const fechaInicio = ref(null)
const fechaFin = ref(null)
const estadosPago = ref(['PAGADO', 'PENDIENTE', 'ABONADO', 'VENCIDO', 'ANULADA'])
const proveedoresOptions = ref([])
const proveedoresFiltrados = ref([])

const buscarProveedor = (event) => {
  const q = event.query.toLowerCase().trim()
  if (!q) {
    proveedoresFiltrados.value = [...proveedoresOptions.value]
  } else {
    proveedoresFiltrados.value = proveedoresOptions.value.filter(p =>
      p.nombre.toLowerCase().includes(q)
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

const anularCompra = (compra) => {
  Swal.fire({
    title: 'Anular compra',
    html: `
      <div style="text-align:left; font-size:14px; color:#374151">
        <p>Esta acción <strong>no se puede deshacer</strong> y afectará:</p>
        <ul style="margin-top:8px; padding-left:20px;">
          <li>=>El stock de los productos(se restara del inventario).</li>
          <li>=>Si ocurrio algún movimiento contables asociado no se podrá anular.</li>
          <li>=>El estado de pago de la compra cambiara.</li>
        </ul>
        <div style="background:#f9fafb; border:1px solid #e2e8dd; border-radius:8px; padding:12px; margin-top:12px">
          <p><strong>Documento:</strong> ${compra.numDocumento}</p>
          <p><strong>Proveedor:</strong> ${compra.proveedor}</p>
          <p><strong>Total:</strong> $${compra.precioFactura}</p>
        </div>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, anular compra ',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#b91c1c',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      emit('anular-compra', compra.id)
      Swal.fire({
        title: 'Anulación de la compra exitosa',
        html: `La compra con el número de documento: <strong>${compra.numDocumento}</strong> se ha anulado.`,
        icon: 'success',
        confirmButtonColor: '#2b5e3b',
        timer: 3000,
        timerProgressBar: true
      })
    }
  })
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
.p-datatable-custom .p-datatable-thead>tr>th {
  background-color: #ffffff !important;
  color: #1e3a2f !important;
  border-bottom: 2px solid #e2e8dd !important;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.25rem 1rem;
}

.p-datatable-custom .p-datatable-tbody>tr {
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border-bottom: 1px solid #e2e8dd !important;
}

.p-datatable-custom .p-datatable-tbody>tr:hover {
  background-color: #f4f7f2 !important;
}

.p-select {
  background-color: #ffffff !important;
  border-color: #cbd5e1 !important;
  box-shadow: none !important;
  height: 40px !important;
  display: flex !important;
  align-items: center !important;
}

.p-select:not(.p-disabled).p-focus {
  border-color: #2b5e3b !important;
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
}

.p-select-label {
  color: #1a2e1f !important;
  font-size: 14px !important;
}

.p-select-overlay {
  background-color: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
}

.p-select-option {
  color: #1a2e1f !important;
  background: transparent !important;
  font-size: 14px !important;
}

.p-select-option:not(.p-placeholder-option):not(.p-select-option-selected):not(.p-disabled).p-focus,
.p-select-option:not(.p-placeholder-option):not(.p-select-option-selected):not(.p-disabled):hover {
  background-color: #eef2e9 !important;
  color: #1a2e1f !important;
}

.p-select-option-selected {
  background-color: #e2e8dd !important;
  color: #1a2e1f !important;
  font-weight: 600;
}
</style>