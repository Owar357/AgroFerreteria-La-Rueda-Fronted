<template>
    <div class="min-h-screen p-8" style="font-family: 'Poppins', sans-serif; background-color: #1a1a1a; color: #EAEAEA;">

        <!-- Header -->
        <div class="flex justify-between items-start mb-8">
            <div>
                <h1 style="font-size: 48px; font-weight: 600; color: #EAEAEA; margin: 0; line-height: 1.1;">Nueva Venta</h1>
                <p style="font-size: 20px; color: #B0B0B0; margin: 8px 0 0;">Completa la información para registrar la venta</p>
            </div>
        </div>

        <!-- Sección 1: Punto de Venta -->
        <div class="rounded-2xl p-8 mb-6" style="background-color: #1E1E1E; border: 1px solid #2a2a2a;">
            <div class="flex items-center gap-3 mb-6 pb-5" style="border-bottom: 1px solid #2a2a2a;">
                <i class="pi pi-shopping-cart" style="color: #4A8C3F; font-size: 22px;"></i>
                <span style="font-size: 32px; font-weight: 600; color: #EAEAEA;">Punto de Venta</span>
            </div>

            <div class="flex flex-col gap-6">

                <!-- 1. Tipo de factura -->
                <div class="flex flex-col gap-2">
                    <label style="font-size: 20px; font-weight: 500; color: #B0B0B0;"> Tipo de factura</label>
                    <div class="relative">
                        <select v-model="tipoFactura" class="w-full rounded-xl outline-none appearance-none cursor-pointer"
                            style="background-color: #323232; border: 1px solid #8A8A8A; color: #EAEAEA; font-size: 20px; padding: 14px 18px; font-family: 'Poppins', sans-serif;"
                            onfocus="this.style.borderColor='#4A8C3F'; this.style.borderWidth='2px';"
                            onblur="this.style.borderColor='#8A8A8A'; this.style.borderWidth='1px';">
                            <option value="" disabled style="background:#323232;">Seleccionar</option>
                            <option value="consumidor_final" style="background:#323232;">Consumidor Final</option>
                            <option value="credito_fiscal" style="background:#323232;">Crédito Fiscal</option>
                        </select>
                        <i class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                            style="color: #B0B0B0; font-size: 14px;"></i>
                    </div>
                </div>

                <!-- 2. Buscar producto -->
                <div class="flex flex-col gap-2">
                    <label style="font-size: 20px; font-weight: 500; color: #B0B0B0;">Buscar producto</label>
                    <InputText v-model="busquedaProducto" placeholder="Escribe nombre o cód. interno..." class="w-full"
                        style="background-color: #323232; border-color: #8A8A8A; color: #EAEAEA; font-size: 20px; padding: 14px 18px; font-family: 'Poppins', sans-serif;"
                        onfocus="this.style.borderColor='#4A8C3F'; this.style.borderWidth='2px'; this.style.boxShadow='none';"
                        onblur="this.style.borderColor='#8A8A8A'; this.style.borderWidth='1px'; this.style.boxShadow='none';" />
                </div>

                <!-- 3. Elegir presentación -->
                <div class="flex flex-col gap-2">
                    <label style="font-size: 20px; font-weight: 500; color: #B0B0B0;"> Elegir presentación a vender</label>
                    <div class="flex gap-4">
                        <div class="relative flex-1">
                            <select v-model="presentacionSeleccionada" class="w-full rounded-xl outline-none appearance-none cursor-pointer"
                                style="background-color: #323232; border: 1px solid #8A8A8A; color: #EAEAEA; font-size: 20px; padding: 14px 18px; font-family: 'Poppins', sans-serif;"
                                onfocus="this.style.borderColor='#4A8C3F'; this.style.borderWidth='2px';"
                                onblur="this.style.borderColor='#8A8A8A'; this.style.borderWidth='1px';">
                                <option value="" disabled style="background:#323232;">Seleccionar presentación</option>
                                <option value="unidad" style="background:#323232;">Unidad</option>
                                <option value="caja" style="background:#323232;">Caja</option>
                                <option value="bolsa" style="background:#323232;">Bolsa</option>
                            </select>
                            <i class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                style="color: #B0B0B0; font-size: 14px;"></i>
                        </div>
                        <Button label="+ Agregar producto"
                            style="font-size: 20px; padding: 14px 24px; background-color: #4A8C3F; border-color: #4A8C3F; font-family: 'Poppins', sans-serif; white-space: nowrap;"
                            @click="agregarProducto" />
                    </div>
                </div>

                <!-- Tabla -->
                <DataTable :value="productosVenta"
                    style="font-family: 'Poppins', sans-serif; font-size: 20px;"
                    emptyMessage="No hay ningún producto registrado por el momento">
                    <Column header="#" style="font-size: 20px; width: 60px;">
                        <template #body="slotProps">
                            {{ slotProps.index + 1 }}
                        </template>
                    </Column>
                    <Column field="nombre" header="Producto" style="font-size: 20px;" />
                    <Column field="cantidad" header="Cantidad" style="font-size: 20px;" />
                    <Column field="precio" header="Precio" style="font-size: 20px;" />
                    <Column field="descuento" header="Descuento" style="font-size: 20px;" />
                    <Column field="subtotal" header="Subtotal" style="font-size: 20px;" />
                </DataTable>

            </div>
        

    </div>
    <!-- Sección 2: Cobro y Pago -->
<div class="rounded-2xl p-8 mb-6" style="background-color: #1E1E1E; border: 1px solid #2a2a2a;">
    <div class="flex items-center gap-3 mb-6 pb-5" style="border-bottom: 1px solid #2a2a2a;">
        <i class="pi pi-credit-card" style="color: #4A8C3F; font-size: 22px;"></i>
        <span style="font-size: 32px; font-weight: 600; color: #EAEAEA;">Cobro y Pago</span>
    </div>

    <div class="flex flex-col gap-6">

        <!-- 1. Cliente -->
        <div class="flex flex-col gap-2">
            <label style="font-size: 20px; font-weight: 500; color: #B0B0B0;"> Cliente</label>
            <div class="flex gap-3 items-center">
                <InputText v-model="busquedaCliente" placeholder="DUI, NRC u otro número..." class="flex-1"
                    style="background-color: #323232; border: 1px solid #8A8A8A; border-radius: 12px; color: #EAEAEA; font-size: 20px; padding: 14px 18px; font-family: 'Poppins', sans-serif;"
                    onfocus="this.style.borderColor='#4A8C3F'; this.style.borderWidth='2px'; this.style.boxShadow='none';"
                    onblur="this.style.borderColor='#8A8A8A'; this.style.borderWidth='1px'; this.style.boxShadow='none';" />
                <Button icon="pi pi-search" @click="buscarCliente"
                    style="background-color: #323232; border: 1px solid #8A8A8A; border-radius: 12px; color: #EAEAEA; font-size: 20px; padding: 14px 18px; font-family: 'Poppins', sans-serif;" />
            </div>
            <p style="font-size: 16px; color: #4A8C3F; margin: 4px 0 0;">
                Nombre: <span style="color: #8A8A8A; font-style: italic;">{{ nombreCliente || '' }}</span>
            </p>
        </div>

        <!-- 2. Forma de pago -->
        <div class="flex flex-col gap-2">
            <label style="font-size: 20px; font-weight: 500; color: #B0B0B0;">Forma de pago</label>
            <div class="flex items-center gap-4">
              
                <div class="relative flex-1">
                    <select v-model="tipoPago" class="w-full outline-none appearance-none cursor-pointer"
                        style="background-color: #323232; border: 1px solid #8A8A8A; border-radius: 12px; color: #EAEAEA; font-size: 20px; padding: 14px 18px; font-family: 'Poppins', sans-serif;"
                        onfocus="this.style.borderColor='#4A8C3F'; this.style.borderWidth='2px';"
                        onblur="this.style.borderColor='#8A8A8A'; this.style.borderWidth='1px';">
                        <option value="efectivo" style="background:#323232;">Efectivo</option>
                        <option value="tarjeta" style="background:#323232;">Tarjeta</option>
                        <option value="transferencia" style="background:#323232;">Transferencia</option>
                    </select>
                    <i class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        style="color: #B0B0B0; font-size: 14px;"></i>
                </div>
            </div>
        </div>

        <!-- 3. Totales -->
        <div class="flex flex-col gap-3"
            style="background-color: #252525; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px;">
            <div class="flex justify-between items-center">
                <span style="font-size: 20px; color: #B0B0B0; font-family: 'Poppins', sans-serif;">Subtotal</span>
                <span style="font-size: 20px; color: #EAEAEA; font-family: 'Poppins', sans-serif;">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center">
                <span style="font-size: 20px; color: #B0B0B0; font-family: 'Poppins', sans-serif;">IVA 13%</span>
                <span style="font-size: 20px; color: #EAEAEA; font-family: 'Poppins', sans-serif;">${{ iva.toFixed(2) }}</span>
            </div>
            <div style="border-top: 1px solid #2a2a2a; margin: 4px 0;"></div>
            <div class="flex justify-between items-center">
                <span style="font-size: 22px; font-weight: 700; color: #EAEAEA; font-family: 'Poppins', sans-serif;">Total a pagar</span>
                <span style="font-size: 22px; font-weight: 700; color: #EAEAEA; font-family: 'Poppins', sans-serif;">${{ total.toFixed(2) }}</span>
            </div>
        </div>

        <!-- 4. Efectivo entregado -->
        <div v-if="tipoPago === 'efectivo'" class="flex flex-col gap-2">
            <label style="font-size: 20px; font-weight: 500; color: #B0B0B0;"> Efectivo entregado</label>
            <div class="flex justify-between items-center gap-4">
                <div class="flex items-center gap-3">
                    <span style="font-size: 20px; color: #B0B0B0; white-space: nowrap;">Efectivo recibido</span>
                    <InputNumber v-model="efectivoRecibido" :min="0" :minFractionDigits="2" :maxFractionDigits="2"
                        inputStyle="background-color: #323232; border: 1px solid #8A8A8A; border-radius: 12px; color: #EAEAEA; font-size: 20px; padding: 14px 18px; font-family: 'Poppins', sans-serif; width: 160px;"
                        :pt="{ input: { onfocus: (e) => { e.target.style.borderColor='#4A8C3F'; e.target.style.borderWidth='2px'; e.target.style.boxShadow='none'; }, onblur: (e) => { e.target.style.borderColor='#8A8A8A'; e.target.style.borderWidth='1px'; } } }" />
                </div>
                <div class="flex items-center gap-3">
                    <span style="font-size: 20px; color: #B0B0B0; font-family: 'Poppins', sans-serif;">Cambio:</span>
                    <span style="font-size: 22px; font-weight: 700; font-family: 'Poppins', sans-serif;">${{ cambio.toFixed(2) }}</span>
                </div>
            </div>
        </div>

        <!-- 5. Botones -->
        <div class="flex gap-4 mt-2">
            <Button label="Registrar venta" icon="pi pi-check" class="flex-1" @click="registrarVenta"
                style="background-color: #4A8C3F; border: 1px solid #4A8C3F; border-radius: 12px; color: #EAEAEA; font-size: 20px; font-weight: 600; padding: 18px 24px; font-family: 'Poppins', sans-serif;" />
            <Button label="Anular venta" icon="pi pi-times" class="flex-1" @click="anularVenta"
                style="background-color: #C0392B ; border: 1px solid; border-radius: 12px; color: #EAEAEA; font-size: 20px; font-weight: 600; padding: 18px 24px; font-family: 'Poppins', sans-serif;" />
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

// --- refs existentes ---
const tipoFactura = ref('')
const busquedaProducto = ref('')
const presentacionSeleccionada = ref('')
const productosVenta = ref([])

// --- nuevos refs ---
const busquedaCliente = ref('')
const nombreCliente = ref('')
const tipoPago = ref('efectivo')
const efectivoRecibido = ref(0)

// --- computed totales ---
const subtotal = computed(() =>
    productosVenta.value.reduce((acc, p) => acc + (p.subtotal || 0), 0)
)
const iva = computed(() => subtotal.value * 0.13)
const total = computed(() => subtotal.value + iva.value)
const cambio = computed(() => Math.max(0, efectivoRecibido.value - total.value))

// --- métodos ---
const agregarProducto = () => { /* lógica */ }
const buscarCliente = () => { }
const añadirCliente = () => {  }
const registrarVenta = () => { }
const anularVenta = () => {
    productosVenta.value = []
    busquedaCliente.value = ''
    nombreCliente.value = ''
    efectivoRecibido.value = 0
    tipoFactura.value = ''
    tipoPago.value = 'efectivo'
}

</script>