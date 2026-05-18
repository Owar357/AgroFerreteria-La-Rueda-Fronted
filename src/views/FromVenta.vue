<template>
    <div class="min-h-screen p-8" style="font-family: 'Poppins', sans-serif; background-color: #121212; color: #EAEAEA;">

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

    </div>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const tipoFactura = ref('')
const busquedaProducto = ref('')
const presentacionSeleccionada = ref('')
const productosVenta = ref([])

const agregarProducto = () => {
    // lógica después
}
</script>