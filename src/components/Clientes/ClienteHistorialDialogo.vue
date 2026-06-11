<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 font-sans">

    <!-- Header -->
    <div class="flex justify-between items-start mb-8 pb-5 border-b border-[#e2e8dd]">
      <div class="flex flex-col gap-3">
        <button
           @click="router.back()"
            class="flex items-center gap-3.5 px-3 py-3.5 rounded-full bg-[#1e3a2f] hover:bg-[#2b5e3b] transition-colors shadow-sm self-start"
          >
        <i class="pi pi-arrow-left text-[11px] text-white" />
         <span class="text-[12px] text-white font-medium">Regresar</span>
        </button>
       

        <div class="flex flex-col gap-2">
          <h1 class="text-[26px] font-bold text-[#1a2e1f] m-0 leading-tight" style="font-family: 'Poppins', sans-serif;">
            Historial de Compras
          </h1>

          <div
            class="flex items-center gap-2.5 bg-[#fcfdfa] border border-[#e0b354] px-3 py-1.5 rounded-xl shadow-sm self-start"
          >
            <i class="pi pi-user text-[20px] text-[#1a2e1f]" />
            <span class="text-[18px] text-[#1a2e1f] font-semibold" style="font-family: 'Poppins', sans-serif;">
              {{ clientName }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtro -->
    <div class="mb-4 flex items-center gap-2 max-w-sm">
      <span class="p-input-icon-left w-full">
         <InputText
          v-model="filtroFactura"
          placeholder="Buscar por N° Factura..."
          class="w-full !border-[#c8d8c0] !rounded-lg !text-[14px] focus:!border-[#1e3a2f] focus:!ring-1 focus:!ring-[#1e3a2f]"
        />
      </span>
      <span
            v-if="filtroFactura"
            @click="filtroFactura = ''"
            class="text-[13px] text-[#1e3a2f] font-semibold cursor-pointer hover:text-[#2b5e3b] underline underline-offset-2 whitespace-nowrap"
             >
        limpiar filtroo
   </span>
      
    </div>

    <!-- Tabla -->
    <div class="border border-[#e2e8dd] rounded-xl overflow-hidden shadow-sm">
      <DataTable
        :value="purchasesFiltradas"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]"
        :rows="10"
        :paginator="purchasesFiltradas.length > 10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} compras"
        :rowsPerPageOptions="[10, 20, 50]"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-10 text-[#6b7280]">
            <i class="pi pi-search text-[32px] mb-3 text-[#c8d8c0]" />
            <span class="text-[14px]">No se encontraron facturas con ese número.</span>
          </div>
        </template>

        <Column field="factura" header="N° Factura">
          <template #body="{ data }">
            <span class="font-mono font-semibold text-[#1a2e1f]">{{ data.factura }}</span>
          </template>
        </Column>

        <Column field="date" header="Fecha">
          <template #body="{ data }">
            <span class="text-[#4b5563]">{{ data.date }}</span>
          </template>
        </Column>

        <Column field="total" header="Monto Total">
          <template #body="{ data }">
            <span class="font-semibold text-[#2b5e3b]">${{ data.total.toFixed(2) }}</span>
          </template>
        </Column>

        <Column field="status" header="Estado">
          <template #body="{ data }">
            <span
              :class="data.status === 'Pagado' ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-[#fee2e2] text-[#991b1b]'"
              class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide"
            >
              {{ data.estado }}
            </span>
          </template>
        </Column>

        <Column header="Acciones" class="text-center w-[130px]">
          <template #body="{ data }">
            <div class="flex gap-2 justify-center">
              <Button
                icon="pi pi-history"
                v-tooltip.top="'Ver historial'"
                class="!bg-[#fbf5e6] hover:!bg-[#f5e6c4] !text-[#cda03f] border-none w-8 h-8 rounded-full p-0 transition-colors shadow-sm"
               @click="abrirDetalleCompra(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <!-- Al final del template, antes del </div> de cierre -->
<DetalleFacturaDialogo
  v-model:visible="mostrarDetalleCompra"
  :compra="compraSeleccionada"
/>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'

import DetalleFacturaDialogo from '../Clientes/DetallFacturaDialogo.vue'

const mostrarDetalleCompra = ref(false)
const compraSeleccionada   = ref(null)

function abrirDetalleCompra(compra) {
  compraSeleccionada.value = compra
  mostrarDetalleCompra.value = true
}
const route  = useRoute()
const router = useRouter()

const clientName = route.query.name || '—'
const clientDoc  = route.query.doc  || '—'

// ── Filtro 
const filtroFactura = ref('')

const purchases = ref([
  { factura: 'FAC-00124', date: '2026-05-10', total: 350.75, status: 'Pagado',    estado: 'Pagado'    },
  { factura: 'FAC-00139', date: '2026-05-24', total: 12.00,  status: 'Pagado',    estado: 'Pagado'    },
  { factura: 'FAC-00155', date: '2026-06-02', total: 35.00,  status: 'Pendiente', estado: 'Pendiente' },
])

defineEmits(['view-history'])

const purchasesFiltradas = computed(() => {
  if (!filtroFactura.value.trim()) return purchases.value
  const query = filtroFactura.value.trim().toLowerCase()
  return purchases.value.filter(p =>
    p.factura.toLowerCase().includes(query)
  )
})
</script>

<style>
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #ffffff !important;
  color: #1e3a2f !important;
  border-bottom: 2px solid #e2e8dd !important;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem;
}
.p-datatable-custom .p-datatable-tbody > tr {
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border-bottom: 1px solid #e2e8dd !important;
}
.p-datatable-custom .p-datatable-tbody > tr:hover {
  background-color: #f4f7f2 !important;
}
</style>