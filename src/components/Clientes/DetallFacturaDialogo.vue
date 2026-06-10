<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="'Detalle de Factura — ' + (compra?.factura || '')"
    :style="{ width: '620px' }"
    :pt="{
      root: { style: 'border-radius: 12px; overflow: hidden;' },
      header: { style: 'background:#1e3a2f; color:white; font-family:Poppins,sans-serif;' },
      closeButton: { style: 'color:white;' }
    }"
  >
    <div class="p-4">

      <!-- Tabla -->
      <DataTable
        :value="productos"
        class="p-datatable-custom text-[13px]"
        responsiveLayout="scroll"
      >
        <template #empty>
          <div class="text-center py-6 text-[#6b7280] text-[13px]">
            No hay productos registrados.
          </div>
        </template>

        <Column field="nombre" header="Producto">
          <template #body="{ data }">
            <span class="font-medium text-[#1a2e1f]">{{ data.nombre }}</span>
          </template>
        </Column>

        <Column field="cantidad" header="Cantidad" class="w-[90px]">
          <template #body="{ data }">
            <span class="text-[#4b5563]">{{ data.cantidad }}</span>
          </template>
        </Column>

        <Column field="precio" header="Precio Unit." class="w-[110px]">
          <template #body="{ data }">
            <span class="text-[#4b5563]">${{ data.precio.toFixed(2) }}</span>
          </template>
        </Column>

        <Column header="Subtotal" class="w-[110px]">
          <template #body="{ data }">
            <span class="font-semibold text-[#2b5e3b]">
              ${{ (data.cantidad * data.precio).toFixed(2) }}
            </span>
          </template>
        </Column>
      </DataTable>

      <!-- Resumen -->
      <div class="mt-5 flex justify-end">
        <div class="flex flex-col gap-2 min-w-[200px]">

          <div class="flex justify-between text-[13px] text-[#4b5563]">
            <span>Grabado</span>
            <span>$0.00</span>
          </div>

          <div class="flex justify-between text-[13px] text-[#4b5563]">
            <span>Exento</span>
            <span>$0.00</span>
          </div>

          <div class="flex justify-between text-[13px] text-[#4b5563]">
            <span>IVA (13%)</span>
            <span>$0.00</span>
          </div>

          <div class="border-t border-[#e2e8dd] my-1" />

          <div class="flex justify-between items-center">
            <span class="text-[15px] font-bold text-[#1a2e1f]" style="font-family:'Poppins',sans-serif;">
              Total
            </span>
            <span class="text-[20px] font-bold text-[#1e3a2f]" style="font-family:'Poppins',sans-serif;">
              ${{ compra?.total?.toFixed(2) || '0.00' }}
            </span>
          </div>

        </div>
      </div>

    </div>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const props = defineProps({
  visible: Boolean,
  compra: Object
})

defineEmits(['update:visible'])

const productosPorFactura = {
  'FAC-00124': [
    { nombre: 'Fertilizante NPK 20kg',    cantidad: 3, precio: 45.00 },
    { nombre: 'Herbicida Glifosato 1L',   cantidad: 2, precio: 18.50 },
  ],
  'FAC-00139': [
    { nombre: 'Insecticida Cipermetrina', cantidad: 1, precio: 12.00 },
  ],
  'FAC-00155': [
    { nombre: 'Semillas de Maíz 5kg',     cantidad: 4, precio: 8.75  },
    { nombre: 'Abono Orgánico 10kg',      cantidad: 2, precio: 9.00  },
  ],
}

const productos = computed(() =>
  props.compra ? (productosPorFactura[props.compra.factura] || []) : []
)
</script>

<style>
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #f4f7f2 !important;
  color: #1e3a2f !important;
  border-bottom: 2px solid #c8d8c0 !important;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.75rem 1rem;
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