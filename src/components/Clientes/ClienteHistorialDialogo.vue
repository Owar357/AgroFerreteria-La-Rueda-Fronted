<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 font-sans">


      <!-- Header -->



      <div class="flex justify-between items-start mb-8 pb-5 border-b border-[#e2e8dd]">
  
  <div class="flex flex-col gap-3">
    <button
      @click="router.back()"
      class="w-7 h-7 rounded-full bg-[#1e3a2f] flex items-center justify-center hover:bg-[#2b5e3b] transition-colors shadow-sm self-start"
    >
      <i class="pi pi-arrow-left text-[11px] text-white" />
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
        
    <!-- Tabla -->
    <div class="border border-[#e2e8dd] rounded-xl overflow-hidden shadow-sm">
      <DataTable
        :value="purchases"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]"
        :rows="10"
        :paginator="purchases.length > 10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} compras"
        :rowsPerPageOptions="[10, 20, 50]"
      >
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

        <Column field="producto" header="Producto">
          <template #body="{ data }">
            <span class="font-semibold text-[#1a2e1f]">{{ data.producto }}</span>
          </template>
        </Column>

        <Column field="cantidad" header="Cant.">
          <template #body="{ data }">
            <span class="text-[#4b5563]">{{ data.cantidad }}</span>
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
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const route  = useRoute()
const router = useRouter()

// Recibe el nombre y documento del cliente via query params
const clientName = route.query.name || '—'
const clientDoc  = route.query.doc  || '—'

const purchases = ref([
  { factura: 'FAC-00124', date: '2026-05-10', producto: 'Abono',       cantidad: 2, total: 350.75, status: 'Pagado',    estado: 'Pagado'    },
  { factura: 'FAC-00139', date: '2026-05-24', producto: 'Maiz',        cantidad: 1, total: 12.00,  status: 'Pagado',    estado: 'Pagado'    },
  { factura: 'FAC-00155', date: '2026-06-02', producto: 'Concentrado', cantidad: 3, total: 35.00,  status: 'Pendiente', estado: 'Pendiente' }
])
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