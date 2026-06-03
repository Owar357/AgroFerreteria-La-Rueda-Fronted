<template>
    <div class="min-h-screen p-8" style="font-family: 'Inter', sans-serif; background-color: #eef2e9; color: #1a2e1f;">

        <!-- Header -->
        <div class="mb-8">
            <h1 style="font-size: 26px; font-weight: 600; color: #1a2e1f; margin: 0; line-height: 1.1;">Nueva Venta</h1>
            <p style="font-size: 14px; color: #6b7280; margin: 6px 0 0;">Completa la información para registrar la venta</p>
        </div>

        <!-- Layout dos columnas -->
        <div class="rounded-2xl overflow-hidden" style="background-color: #ffffff; border: 1px solid #e2e8dd; display: grid; grid-template-columns: 1fr 1px 1fr;">

            <!-- ══ COLUMNA IZQUIERDA: Punto de Venta ══ -->
            <div class="p-8">
                <div class="flex items-center gap-3 mb-6 pb-5" style="border-bottom: 1px solid #e2e8dd;">
                    <i class="pi pi-shopping-cart" style="color: #e0b354; font-size: 20px;"></i>
                    <span style="font-size: 20px; font-weight: 600; color: #1a2e1f;">Punto de Venta</span>
                </div>

                <div class="flex flex-col gap-6">

                    <!-- Tipo de factura -->
                    <div class="flex flex-col gap-2">
                        <label style="font-size: 14px; font-weight: 500; color: #4b5563;">Tipo de factura</label>
                        <div class="relative">
                            <select v-model="tipoFactura" class="w-full rounded-xl outline-none appearance-none cursor-pointer"
                                style="background-color: #ffffff; border: 1px solid #d1d5db; color: #1a2e1f; font-size: 14px; padding: 10px 14px; font-family: 'Inter', sans-serif;"
                                onfocus="this.style.borderColor='#2b5e3b'; this.style.borderWidth='2px';"
                                onblur="this.style.borderColor='#d1d5db'; this.style.borderWidth='1px';">
                                <option value="" disabled>Seleccionar</option>
                                <option value="consumidor_final">Consumidor Final</option>
                                <option value="credito_fiscal">Crédito Fiscal</option>
                            </select>
                            <i class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                style="color: #6b7280; font-size: 12px;"></i>
                        </div>
                    </div>

                    <!-- Buscar producto -->
                    <div class="flex flex-col gap-2">
                        <label style="font-size: 14px; font-weight: 500; color: #4b5563;">Buscar producto</label>
                        <InputText v-model="busquedaProducto" placeholder="Escribe nombre o cód. interno..." class="w-full"
                            style="background-color: #ffffff; border-color: #d1d5db; color: #1a2e1f; font-size: 14px; padding: 10px 14px; font-family: 'Inter', sans-serif;"
                            onfocus="this.style.borderColor='#2b5e3b'; this.style.borderWidth='2px'; this.style.boxShadow='none';"
                            onblur="this.style.borderColor='#d1d5db'; this.style.borderWidth='1px'; this.style.boxShadow='none';" />
                    </div>

                    <!-- Elegir presentación -->
                    <div class="flex flex-col gap-2">
                        <label style="font-size: 14px; font-weight: 500; color: #4b5563;">Elegir presentación a vender</label>
                        <div class="flex gap-3">
                            <div class="relative flex-1">
                                <select v-model="presentacionSeleccionada" class="w-full rounded-xl outline-none appearance-none cursor-pointer"
                                    style="background-color: #ffffff; border: 1px solid #d1d5db; color: #1a2e1f; font-size: 14px; padding: 10px 14px; font-family: 'Inter', sans-serif;"
                                    onfocus="this.style.borderColor='#2b5e3b'; this.style.borderWidth='2px';"
                                    onblur="this.style.borderColor='#d1d5db'; this.style.borderWidth='1px';">
                                    <option value="" disabled>Seleccionar presentación</option>
                                    <option value="unidad">Unidad</option>
                                    <option value="caja">Caja</option>
                                    <option value="bolsa">Bolsa</option>
                                </select>
                                <i class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                    style="color: #6b7280; font-size: 12px;"></i>
                            </div>
                            <Button label="+ Agregar"
                                style="font-size: 14px; font-weight: 600; padding: 10px 20px; background-color: #2b5e3b; border-color: #2b5e3b; color: #ffffff; font-family: 'Inter', sans-serif; white-space: nowrap;"
                                @click="agregarProducto" />
                        </div>
                    </div>

                    <!-- Tabla productos -->
                    <DataTable :value="productosVenta"
                        style="font-family: 'Inter', sans-serif; font-size: 13px;"
                        emptyMessage="No hay ningún producto registrado">
                        <Column header="#" style="width: 48px;">
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

            <!-- ══ LÍNEA DIVISORIA VERTICAL ══ -->
            <div style="background-color: #e2e8dd;"></div>

            <!-- ══ COLUMNA DERECHA: Cobro y Pago ══ -->
            <div class="p-8">
                <div class="flex items-center gap-3 mb-6 pb-5" style="border-bottom: 1px solid #e2e8dd;">
                    <i class="pi pi-credit-card" style="color: #e0b354; font-size: 20px;"></i>
                    <span style="font-size: 20px; font-weight: 600; color: #1a2e1f;">Cobro y Pago</span>
                </div>

                <div class="flex flex-col gap-6">

                    <!-- Cliente -->
                    <div class="flex flex-col gap-2">
                        <label style="font-size: 14px; font-weight: 500; color: #4b5563;">Cliente</label>
                        <div class="flex gap-2 items-center">
                            <InputText v-model="busquedaCliente" placeholder="DUI, NRC u otro número..." class="flex-1"
                                style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 10px; color: #1a2e1f; font-size: 14px; padding: 10px 14px; font-family: 'Inter', sans-serif;"
                                onfocus="this.style.borderColor='#2b5e3b'; this.style.borderWidth='2px'; this.style.boxShadow='none';"
                                onblur="this.style.borderColor='#d1d5db'; this.style.borderWidth='1px'; this.style.boxShadow='none';" />
                            <Button icon="pi pi-search" @click="buscarCliente"
                                style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 10px; color: #1a2e1f; padding: 10px 14px;" />
                        </div>
                        <p style="font-size: 13px; color: #2b5e3b; margin: 2px 0 0;">
                            Nombre: <span style="color: #6b7280; font-style: italic;">{{ nombreCliente || '—' }}</span>
                        </p>
                    </div>

                    <!-- Forma de pago -->
                    <div class="flex flex-col gap-2">
                        <label style="font-size: 14px; font-weight: 500; color: #4b5563;">Forma de pago</label>
                        <div class="relative">
                            <select v-model="tipoPago" class="w-full outline-none appearance-none cursor-pointer"
                                style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 10px; color: #1a2e1f; font-size: 14px; padding: 10px 14px; font-family: 'Inter', sans-serif;"
                                onfocus="this.style.borderColor='#2b5e3b'; this.style.borderWidth='2px';"
                                onblur="this.style.borderColor='#d1d5db'; this.style.borderWidth='1px';">
                                <option value="efectivo">Efectivo</option>
                                <option value="tarjeta">Tarjeta</option>
                                <option value="transferencia">Transferencia</option>
                            </select>
                            <i class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                style="color: #6b7280; font-size: 12px;"></i>
                        </div>
                    </div>

                    <!-- Totales -->
                    <div class="flex flex-col gap-3"
                        style="background-color: #f2f5ef; border: 1px solid #e2e8dd; border-radius: 12px; padding: 20px;">
                        <div class="flex justify-between items-center">
                            <span style="font-size: 14px; color: #4b5563;">Subtotal</span>
                            <span style="font-size: 14px; color: #1a2e1f;">${{ subtotal.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span style="font-size: 14px; color: #4b5563;">IVA 13%</span>
                            <span style="font-size: 14px; color: #1a2e1f;">${{ iva.toFixed(2) }}</span>
                        </div>
                        <div style="border-top: 1px solid #e2e8dd; margin: 4px 0;"></div>
                        <div class="flex justify-between items-center">
                            <span style="font-size: 16px; font-weight: 700; color: #1a2e1f;">Total a pagar</span>
                            <span style="font-size: 16px; font-weight: 700; color: #1a2e1f;">${{ total.toFixed(2) }}</span>
                        </div>
                    </div>

                    <!-- Efectivo recibido (solo si pago en efectivo) -->
                    <div v-if="tipoPago === 'efectivo'" class="flex flex-col gap-2">
                        <label style="font-size: 14px; font-weight: 500; color: #4b5563;">Efectivo entregado</label>
                        <div class="flex justify-between items-center gap-4">
                            <div class="flex items-center gap-3 flex-1">
                                <span style="font-size: 14px; color: #4b5563; white-space: nowrap;">Recibido</span>
                                <InputNumber v-model="efectivoRecibido" :min="0" :minFractionDigits="2" :maxFractionDigits="2"
                                    inputStyle="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 10px; color: #1a2e1f; font-size: 14px; padding: 10px 14px; font-family: 'Inter', sans-serif; width: 140px;"
                                    :pt="{ input: { onfocus: (e) => { e.target.style.borderColor='#2b5e3b'; e.target.style.borderWidth='2px'; e.target.style.boxShadow='none'; }, onblur: (e) => { e.target.style.borderColor='#d1d5db'; e.target.style.borderWidth='1px'; } } }" />
                            </div>
                            <div class="flex items-center gap-2">
                                <span style="font-size: 14px; color: #4b5563;">Cambio:</span>
                                <span style="font-size: 16px; font-weight: 700; color: #2b5e3b;">${{ cambio.toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Botones -->
                    <div class="flex flex-col gap-3 mt-2">
                        <Button label="Registrar venta" icon="pi pi-check" @click="registrarVenta"
                            style="background-color: #2b5e3b; border: 1px solid #2b5e3b; border-radius: 10px; color: #ffffff; font-size: 14px; font-weight: 600; padding: 14px 24px; font-family: 'Inter', sans-serif; width: 100%;" />
                        <Button label="Anular venta" icon="pi pi-times" @click="anularVenta"
                            style="background-color: #eef2e9; border: 1px solid #e2e8dd; border-radius: 10px; color: #1a2e1f; font-size: 14px; font-weight: 600; padding: 14px 24px; font-family: 'Inter', sans-serif; width: 100%;" />
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

const tipoFactura             = ref('')
const busquedaProducto        = ref('')
const presentacionSeleccionada = ref('')
const productosVenta          = ref([])

const busquedaCliente  = ref('')
const nombreCliente    = ref('')
const tipoPago         = ref('efectivo')
const efectivoRecibido = ref(0)

const subtotal = computed(() =>
    productosVenta.value.reduce((acc, p) => acc + (p.subtotal || 0), 0)
)
const iva     = computed(() => subtotal.value * 0.13)
const total   = computed(() => subtotal.value + iva.value)
const cambio  = computed(() => Math.max(0, efectivoRecibido.value - total.value))

const agregarProducto = () => {}
const buscarCliente   = () => {}
const registrarVenta  = () => {}
const anularVenta = () => {
    productosVenta.value    = []
    busquedaCliente.value   = ''
    nombreCliente.value     = ''
    efectivoRecibido.value  = 0
    tipoFactura.value       = ''
    tipoPago.value          = 'efectivo'
}
</script>