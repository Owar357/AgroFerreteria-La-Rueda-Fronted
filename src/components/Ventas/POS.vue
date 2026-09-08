<template>
  <div class="flex flex-col" style="
      font-family: 'Inter', sans-serif;
      background-color: #eef2e9;
      height: 100vh;
      overflow: hidden;
      padding: 12px;
    ">
    <div v-if="!cajaStore.cajaAbierta" class="flex flex-col items-center justify-center h-full gap-6">
      <div class="bg-white rounded-2xl p-10 border border-[#e2e8dd] shadow-lg flex flex-col items-center gap-4 max-w-md w-full">
        <i class="pi pi-lock text-[#b91c1c]" style="font-size: 48px"></i>
        <h2 class="text-[22px] font-semibold text-[#1a2e1f] text-center">Caja no aperturada</h2>
        <p class="text-[14px] text-[#6b7280] text-center">
          El administrador debe aperturar la caja para poder realizar ventas.
        </p>
        <Button label="Ir a Caja" icon="pi pi-arrow-right" class="!bg-[#2b5e3b] !border-[#2b5e3b] text-white font-semibold px-6 py-3 rounded-lg" @click="irACaja" />
      </div>
    </div>

    <div v-else class="rounded-2xl overflow-hidden flex-1 min-h-0" style="
        background-color: #ffffff;
        border: 1px solid #e2e8dd;
        display: grid;
        grid-template-columns: 2.5fr 2px 1fr;
      ">
      <!-- COLUMNA IZQUIERDA -->
      <div class="flex flex-col overflow-hidden" style="padding: 20px">
        <div class="flex items-center justify-between mb-4 pb-4" style="border-bottom: 1px solid #e2e8dd">
          <div class="flex items-center gap-3">
            <i class="pi pi-shopping-cart" style="color: #e0b354; font-size: 20px"></i>
            <div>
              <span style="font-size: 18px; font-weight: 600; color: #1a2e1f; display: block">Punto de Venta</span>
              <span style="font-size: 12px; color: #6b7280">{{ fechaActual }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span :class="[
              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold',
              cajaStore.ventaAbierta ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
            ]">
              <i class="pi pi-circle-fill text-[8px]" :class="cajaStore.ventaAbierta ? 'text-green-600' : 'text-yellow-500'"></i>
              {{ cajaStore.ventaAbierta ? 'Venta abierta' : 'Sin apertura de venta' }}
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-4 flex-1 overflow-y-auto">
          <!-- Tipo de factura -->
          <div class="flex flex-col gap-1.5">
            <label style="font-size: 13px; font-weight: 500; color: #4b5563">Tipo de factura</label>
            <Select v-model="posStore.tipoFactura" :options="tiposFactura" optionLabel="label" optionValue="value" class="w-full" />
          </div>

          <!-- Buscar producto -->
          <div class="flex flex-col gap-1.5">
            <AutoComplete v-model="productoSeleccionado" optionLabel="nombre" :suggestions="sugerencias" @complete="buscarProducto" @item-select="alSeleccionarProducto" placeholder="Escribe nombre, cód. interno o cód. de barra" class="w-full" fluid />
          </div>

          <!-- Presentación -->
          <div class="flex gap-2">
            <Select v-model="presentacionSeleccionada" :options="presentaciones" optionLabel="nombre" placeholder="Seleccionar presentación" class="flex-1" />
            <Button label="+ Agregar" style="
                font-size: 13px;
                font-weight: 600;
                padding: 8px 16px;
                background-color: #2b5e3b;
                border-color: #2b5e3b;
                color: #ffffff;
                white-space: nowrap;
              " @click="handleAgregarProducto" />
          </div>

          <!-- Tabla productos -->
          <div class="flex-1 min-h-0">
            <DataTable :value="posStore.productosVenta" style="font-size: 12px" emptyMessage="No hay ningún producto registrado">
              <Column header="#" style="width: 40px">
                <template #body="slotProps">{{ slotProps.index + 1 }}</template>
              </Column>
              <Column field="nombre" header="Producto" />
              <Column header="Cantidad">
                <template #body="slotProps">
                  <InputNumber v-model="slotProps.data.cantidad" @update:modelValue="posStore.recalcularSubtotal(slotProps.data)" :min="1" :maxFractionDigits="0" showButtons buttonLayout="horizontal" :inputStyle="{ width: '80px', textAlign: 'center' }" />
                </template>
              </Column>
              <Column header="Precio Unit.">
                <template #body="slotProps">
                  <div v-if="slotProps.data.porcentaje_descuento > 0" class="flex flex-col">
                    <span class="text-[11px] text-gray-400 line-through">${{ parseFloat(slotProps.data.precio).toFixed(2) }}</span>
                    <span class="text-xs font-bold text-amber-700">
                      ${{ (slotProps.data.precio - (slotProps.data.descuento / slotProps.data.cantidad)).toFixed(2) }}
                      <span class="text-[10px] bg-amber-100 text-amber-800 px-1 rounded ml-0.5">-{{ slotProps.data.porcentaje_descuento }}%</span>
                    </span>
                  </div>
                  <span v-else>${{ parseFloat(slotProps.data.precio).toFixed(2) }}</span>
                </template>
              </Column>
              <Column header="Descuento">
                <template #body="slotProps">
                  <span :class="slotProps.data.descuento > 0 ? 'text-amber-700 font-bold' : ''">
                    ${{ parseFloat(slotProps.data.descuento).toFixed(2) }}
                  </span>
                </template>
              </Column>
              <Column header="Subtotal">
                <template #body="slotProps">${{ parseFloat(slotProps.data.subtotal).toFixed(2) }}</template>
              </Column>
              <Column header="" style="width: 40px">
                <template #body="slotProps">
                  <Button icon="pi pi-trash" severity="danger" text rounded size="small" @click="posStore.eliminarProducto(slotProps.index)" />
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <!-- LÍNEA DIVISORIA -->
      <div style="background-color: #e2e8dd"></div>

      <!-- COLUMNA DERECHA -->
      <div class="flex flex-col overflow-hidden" style="padding: 20px">
        <div class="flex items-center gap-3 mb-4 pb-4" style="border-bottom: 1px solid #e2e8dd">
          <i class="pi pi-credit-card" style="color: #e0b354; font-size: 20px"></i>
          <span style="font-size: 18px; font-weight: 600; color: #1a2e1f">Cobro y Pago</span>
        </div>

        <div class="flex flex-col gap-4 flex-1">
          <!-- Cliente -->
          <div class="flex gap-2 items-center">
            <InputText v-model="posStore.busquedaCliente" placeholder="DUI, NRC u otro número..." class="flex-1 text-[13px] px-3.5 py-2" @keypress="(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault() }" @keyup.enter="posStore.buscarCliente" />
            <Button icon="pi pi-search" @click="posStore.buscarCliente" style="
                background-color: #ffffff;
                border: 1px solid #d1d5db;
                border-radius: 10px;
                color: #1a2e1f;
                padding: 8px 12px;
              " />
          </div>
          <p class="text-[12px] text-[#2b5e3b] m-0">
            Nombre: <span class="text-[#6b7280] italic">{{ posStore.nombreCliente || '—' }}</span>
          </p>

          <!-- Forma de pago -->
          <div class="flex flex-col gap-1.5">
            <label style="font-size: 13px; font-weight: 500; color: #4b5563">Forma de pago</label>
            <Select v-model="posStore.tipoPago" :options="tiposPago" optionLabel="label" optionValue="value" class="w-full" />
          </div>

          <!-- Totales -->
          <div class="flex justify-between items-center">
            <span style="font-size: 13px; color: #4b5563">Subtotal gravado</span>
            <span style="font-size: 13px; color: #1a2e1f">${{ posStore.subtotalGravado.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span style="font-size: 13px; color: #4b5563">Subtotal exento</span>
            <span style="font-size: 13px; color: #1a2e1f">${{ posStore.subtotalExento.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span style="font-size: 13px; color: #4b5563">IVA 13%</span>
            <span style="font-size: 13px; color: #1a2e1f">${{ posStore.iva.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span style="font-size: 15px; font-weight: 700; color: #1a2e1f">Total a pagar</span>
            <span style="font-size: 15px; font-weight: 700; color: #1a2e1f">${{ posStore.total.toFixed(2) }}</span>
          </div>

          <!-- Efectivo recibido -->
          <div v-if="posStore.tipoPago === 'efectivo'" class="flex flex-col gap-1.5">
            <label style="font-size: 13px; font-weight: 500; color: #4b5563">Efectivo entregado</label>
            <div class="flex justify-between items-center gap-4">
              <div class="flex items-center gap-2 flex-1">
                <span style="font-size: 13px; color: #4b5563; white-space: nowrap">Recibido</span>
                <InputNumber v-model="posStore.efectivoRecibido" mode="currency" currency="USD" locale="en-US" :min="0" :minFractionDigits="2" :maxFractionDigits="2" :inputStyle="{ fontSize: '13px', padding: '8px 12px', width: '120px' }" />
              </div>
              <div class="flex items-center gap-2">
                <span style="font-size: 13px; color: #4b5563">Cambio:</span>
                <span style="font-size: 15px; font-weight: 700; color: #2b5e3b">${{ posStore.cambio.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2" style="margin-top: 24px">
            <Button label="Registrar venta" icon="pi pi-check" @click="posStore.procesarVenta(router)" style="
                background-color: #2b5e3b;
                border: 1px solid #2b5e3b;
                border-radius: 10px;
                color: #ffffff;
                font-size: 14px;
                font-weight: 600;
                padding: 12px 24px;
                width: 100%;
              " />
            <Button label="Anular venta" icon="pi pi-times" @click="posStore.resetVenta" style="
                background-color: #eef2e9;
                border: 1px solid #e2e8dd;
                border-radius: 10px;
                color: #1a2e1f;
                font-size: 14px;
                font-weight: 600;
                padding: 12px 24px;
                width: 100%;
              " />
          </div>
        </div>
      </div>
    </div>
  </div>

  <DialogAddCliente v-model="posStore.mostrarModalCliente" @cliente-registrado="onClienteRegistrado" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import AutoComplete from 'primevue/autocomplete'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import DialogAddCliente from '@/components/Clientes/AddClienteDialog.vue'
import { useCajaStore } from '@/stores/cajaStore'
import { usePosStore } from '@/stores/posStore'
import { buscarProductos } from '@/services/ventaService'

const router = useRouter()
const cajaStore = useCajaStore()
const posStore = usePosStore()

const fechaActual = new Date().toLocaleDateString('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const irACaja = () => router.push({ name: 'caja' })

onMounted(() => {
  cajaStore.cargarEstadoCaja()
  posStore.recuperarVentaLocal()
})

const productoSeleccionado = ref(null)
const presentacionSeleccionada = ref('')
const presentaciones = ref([])
const sugerencias = ref([])

const tiposFactura = [
  { label: 'Consumidor Final', value: '01' },
  { label: 'Crédito Fiscal', value: '02' },
]

const tiposPago = [
  { label: 'Efectivo', value: 'efectivo' },
  { label: 'Tarjeta', value: 'tarjeta' },
  { label: 'Transferencia', value: 'transferencia' },
]

const buscarProducto = async (event) => {
  const q = event.query.trim()
  if (q.length < 2) {
    sugerencias.value = []
    return
  }
  try {
    const response = await buscarProductos(q)
    sugerencias.value = response.data.data
  } catch {
    sugerencias.value = []
  }
}

const alSeleccionarProducto = (event) => {
  presentaciones.value = event.value.presentaciones
  presentacionSeleccionada.value = ''
}

const handleAgregarProducto = () => {
  if (!productoSeleccionado.value || !presentacionSeleccionada.value) return
  const exito = posStore.agregarProducto(productoSeleccionado.value, presentacionSeleccionada.value)
  if (exito) {
    productoSeleccionado.value = null
    presentacionSeleccionada.value = ''
    presentaciones.value = []
  }
}

const onClienteRegistrado = (cliente) => {
  posStore.nombreCliente = cliente.nombre || cliente.razon_social
  posStore.clienteId = cliente.id
  posStore.mostrarModalCliente = false
}
</script>