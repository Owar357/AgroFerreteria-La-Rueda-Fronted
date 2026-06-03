<template>
  <div class="flex flex-col" style="font-family: 'Inter', sans-serif; background-color: #eef2e9; height: 100vh; overflow: hidden; padding: 12px;">

    <!-- dos columnas ocupando toda la altura -->
    <div class="rounded-2xl overflow-hidden flex-1 min-h-0" style="background-color: #ffffff; border: 1px solid #e2e8dd; display: grid; grid-template-columns: 1fr 1px 1fr;">

      <!-- COLUMNA IZQUIERDA -->
      <div class="flex flex-col overflow-hidden" style="padding: 20px;">

        <!-- Header izquierdo -->
        <div class="flex items-center justify-between mb-4 pb-4" style="border-bottom: 1px solid #e2e8dd;">
          <div class="flex items-center gap-3">
            <i class="pi pi-shopping-cart" style="color: #e0b354; font-size: 20px;"></i>
            <div>
              <span style="font-size: 18px; font-weight: 600; color: #1a2e1f; display: block;">Punto de Venta</span>
              <span style="font-size: 12px; color: #6b7280;">{{ fechaActual }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4 flex-1 overflow-y-auto">

          <!-- Tipo de factura -->
          <div class="flex flex-col gap-1.5">
            <label style="font-size: 13px; font-weight: 500; color: #4b5563;">Tipo de factura</label>
            <div class="relative">
              <select v-model="tipoFactura" class="w-full rounded-xl outline-none appearance-none cursor-pointer"
                style="background-color: #ffffff; border: 1px solid #d1d5db; color: #1a2e1f; font-size: 13px; padding: 8px 14px; font-family: 'Inter', sans-serif;">
                <option value="" disabled>Seleccionar</option>
                <option value="consumidor_final">Consumidor Final</option>
                <option value="credito_fiscal">Crédito Fiscal</option>
              </select>
              <i class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style="color: #6b7280; font-size: 11px;"></i>
            </div>
          </div>

          <!-- Buscar producto -->
          <div class="flex flex-col gap-1.5">
            <label style="font-size: 13px; font-weight: 500; color: #4b5563;">Buscar producto</label>
            <InputText v-model="busquedaProducto" placeholder="Escribe nombre o cód. interno..." class="w-full"
              style="font-size: 13px; padding: 8px 14px;" />
          </div>

          <!-- Elegir presentación -->
          <div class="flex flex-col gap-1.5">
            <label style="font-size: 13px; font-weight: 500; color: #4b5563;">Elegir presentación a vender</label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <select v-model="presentacionSeleccionada" class="w-full rounded-xl outline-none appearance-none cursor-pointer"
                  style="background-color: #ffffff; border: 1px solid #d1d5db; color: #1a2e1f; font-size: 13px; padding: 8px 14px; font-family: 'Inter', sans-serif;">
                  <option value="" disabled>Seleccionar presentación</option>
                  <option value="unidad">Unidad</option>
                  <option value="caja">Caja</option>
                  <option value="bolsa">Bolsa</option>
                </select>
                <i class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style="color: #6b7280; font-size: 11px;"></i>
              </div>
              <Button label="+ Agregar"
                style="font-size: 13px; font-weight: 600; padding: 8px 16px; background-color: #2b5e3b; border-color: #2b5e3b; color: #ffffff; white-space: nowrap;"
                @click="agregarProducto" />
            </div>
          </div>

          <!-- Tabla productos -->
          <div class="flex-1 min-h-0">
            <DataTable :value="productosVenta" style="font-size: 12px;" emptyMessage="No hay ningún producto registrado">
              <Column header="#" style="width: 40px;">
                <template #body="slotProps">{{ slotProps.index + 1 }}</template>
              </Column>
              <Column field="nombre" header="Producto" />
              <Column field="cantidad" header="Cantidad" />
              <Column field="precio" header="Precio" />
              <Column field="descuento" header="Descuento" />
              <Column field="subtotal" header="Subtotal" />
            </DataTable>
          </div>

        </div>
      </div>

      <!-- LÍNEA DIVISORIA -->
      <div style="background-color: #e2e8dd;"></div>

      <!-- COLUMNA DERECHA -->
      <div class="flex flex-col overflow-hidden" style="padding: 20px;">

        <!-- Header derecho -->
        <div class="flex items-center gap-3 mb-4 pb-4" style="border-bottom: 1px solid #e2e8dd;">
          <i class="pi pi-credit-card" style="color: #e0b354; font-size: 20px;"></i>
          <span style="font-size: 18px; font-weight: 600; color: #1a2e1f;">Cobro y Pago</span>
        </div>

        <div class="flex flex-col gap-4 flex-1">

          <!-- Cliente -->
          <div class="flex flex-col gap-1.5">
            <label style="font-size: 13px; font-weight: 500; color: #4b5563;">Cliente</label>
            <div class="flex gap-2 items-center">
              <InputText v-model="busquedaCliente" placeholder="DUI, NRC u otro número..." class="flex-1"
                style="font-size: 13px; padding: 8px 14px;" />
              <Button icon="pi pi-search" @click="buscarCliente"
                style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 10px; color: #1a2e1f; padding: 8px 12px;" />
            </div>
            <p style="font-size: 12px; color: #2b5e3b; margin: 0;">
              Nombre: <span style="color: #6b7280; font-style: italic;">{{ nombreCliente || '—' }}</span>
            </p>
          </div>

          <!-- Forma de pago -->
          <div class="flex flex-col gap-1.5">
            <label style="font-size: 13px; font-weight: 500; color: #4b5563;">Forma de pago</label>
            <div class="relative">
              <select v-model="tipoPago" class="w-full outline-none appearance-none cursor-pointer"
                style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 10px; color: #1a2e1f; font-size: 13px; padding: 8px 14px; font-family: 'Inter', sans-serif;">
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
              <i class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style="color: #6b7280; font-size: 11px;"></i>
            </div>
          </div>

          <!-- Totales -->
          <div class="flex flex-col gap-2" style="background-color: #f2f5ef; border: 1px solid #e2e8dd; border-radius: 12px; padding: 16px;">
            <div class="flex justify-between items-center">
              <span style="font-size: 13px; color: #4b5563;">Subtotal</span>
              <span style="font-size: 13px; color: #1a2e1f;">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span style="font-size: 13px; color: #4b5563;">IVA 13%</span>
              <span style="font-size: 13px; color: #1a2e1f;">${{ iva.toFixed(2) }}</span>
            </div>
            <div style="border-top: 1px solid #e2e8dd; margin: 2px 0;"></div>
            <div class="flex justify-between items-center">
              <span style="font-size: 15px; font-weight: 700; color: #1a2e1f;">Total a pagar</span>
              <span style="font-size: 15px; font-weight: 700; color: #1a2e1f;">${{ total.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Efectivo recibido -->
          <div v-if="tipoPago === 'efectivo'" class="flex flex-col gap-1.5">
            <label style="font-size: 13px; font-weight: 500; color: #4b5563;">Efectivo entregado</label>
            <div class="flex justify-between items-center gap-4">
              <div class="flex items-center gap-2 flex-1">
                <span style="font-size: 13px; color: #4b5563; white-space: nowrap;">Recibido</span>
                <InputNumber v-model="efectivoRecibido" :min="0" :minFractionDigits="2" :maxFractionDigits="2"
                  inputStyle="font-size: 13px; padding: 8px 12px; width: 120px;" />
              </div>
              <div class="flex items-center gap-2">
                <span style="font-size: 13px; color: #4b5563;">Cambio:</span>
                <span style="font-size: 15px; font-weight: 700; color: #2b5e3b;">${{ cambio.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Botones al fondo -->
          <div class="flex flex-col gap-2 mt-auto">
            <Button label="Registrar venta" icon="pi pi-check" @click="registrarVenta"
              style="background-color: #2b5e3b; border: 1px solid #2b5e3b; border-radius: 10px; color: #ffffff; font-size: 14px; font-weight: 600; padding: 12px 24px; width: 100%;" />
            <Button label="Anular venta" icon="pi pi-times" @click="anularVenta"
              style="background-color: #eef2e9; border: 1px solid #e2e8dd; border-radius: 10px; color: #1a2e1f; font-size: 14px; font-weight: 600; padding: 12px 24px; width: 100%;" />
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const fechaActual = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })

const tipoFactura              = ref('consumidor_final')
const busquedaProducto         = ref('')
const presentacionSeleccionada = ref('')
const productosVenta           = ref([])
const busquedaCliente          = ref('')
const nombreCliente            = ref('')
const tipoPago                 = ref('efectivo')
const efectivoRecibido         = ref(0)

const subtotal = computed(() => productosVenta.value.reduce((acc, p) => acc + (p.subtotal || 0), 0))
const iva      = computed(() => subtotal.value * 0.13)
const total    = computed(() => subtotal.value + iva.value)
const cambio   = computed(() => Math.max(0, efectivoRecibido.value - total.value))

const agregarProducto = () => {}
const buscarCliente   = () => {}
const registrarVenta  = () => {}
const anularVenta = () => {
  productosVenta.value   = []
  busquedaCliente.value  = ''
  nombreCliente.value    = ''
  efectivoRecibido.value = 0
  tipoFactura.value      = ''
  tipoPago.value         = 'efectivo'
}
</script>