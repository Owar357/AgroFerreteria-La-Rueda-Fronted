<template>
    <div class="bg-[#eef2e9]  min-h-screen p-6  mx-auto">

        <!-- Botón volver -->
        <Button icon="pi pi-arrow-left" label="Volver a productos" severity="secondary" text class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b]
         hover:!text-white mb-4 !px-4 !py-2 !rounded-lg transition-all duration-200" @click="volver" />




        <!-- Tarjeta del producto -->
        <div class="bg-white rounded-2xl border border-[#e8efe1] shadow-sm p-6 mb-6">
            <div class="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-[#1e3a2f]">{{ producto.nombre }}</h1>
                    <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 mt-2">
                        <span><span class="font-medium text-[#3c674b]">Código:</span> {{ producto.codigo }}</span>
                        <span><span class="font-medium text-[#3c674b]">Categoría:</span> {{ producto.categoria }}</span>
                        <span><span class="font-medium text-[#3c674b]">Fabricante:</span> {{ producto.fabricante
                            }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Encabezado Presentaciones + botón Agregar -->
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-[#1e3a2f] flex items-center gap-2">
                <i class="pi pi-box text-[#e0b354]"></i> Presentaciones
            </h2>
            <Button
                class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white text-[14px] font-semibold !px-4 !py-3 !rounded-lg !border-none shadow-md transition-all duration-200"
                label="Agregar presentación" icon="pi pi-plus" />
        </div>

        <!-- Tabla de presentaciones con botones mejorados -->
        <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm">
            <DataTable :value="presentaciones" responsiveLayout="scroll" class="p-datatable-sm">
                <Column field="nombre" header="Nombre" class="text-sm"></Column>
                <Column field="unidadMedida" header="Unidad medida" class="text-sm"></Column>
                <Column field="precio" header="Precio" class="text-sm">
                    <template #body="{ data }">
                        ${{ formatNumber(data.precio) }}
                    </template>
                </Column>
                <Column field="stock" header="Stock" class="text-sm"></Column>
                <Column field="estado" header="Estado" class="text-sm">
                    <template #body="{ data }">
                        <Tag :value="data.estado" :severity="data.estado === 'ACTIVO' ? 'success' : 'danger'" rounded />
                    </template>
                </Column>

                <!-- ACCIONES: 3 botones claros -->
                <Column header="Acciones" :exportable="false" class="text-sm">
                    <template #body="{ data }">
                        <div class="flex flex-wrap gap-2">
                            <!-- Botón Editar -->
                            <Button icon="pi pi-pencil" label="Editar" severity="secondary" text rounded size="small"
                                v-tooltip="'Editar presentación'" />

                            <!-- Botón Ver código de barras -->
                            <Button icon="pi pi-qrcode" label="Código" severity="secondary" text rounded size="small"
                                @click="verCodigoBarras(data)" v-tooltip="'Ver código de barras'" />

                            <!-- Botón dual Activar/Desactivar -->
                            <Button :label="data.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'"
                                :icon="data.estado === 'ACTIVO' ? 'pi pi-ban' : 'pi pi-check-circle'"
                                :severity="data.estado === 'ACTIVO' ? 'danger' : 'success'" text rounded size="small"
                                @click="toggleEstadoPresentacion(data)"
                                v-tooltip="data.estado === 'ACTIVO' ? 'Desactivar presentación' : 'Activar presentación'" />
                        </div>
                    </template>
                </Column>

                <template #empty>
                    <div class="text-center py-8 text-gray-400">No hay presentaciones registradas</div>
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

// ========== PROPS ==========
const props = defineProps({
    productoId: {
        type: [String, Number],
        default: null
    }
})

// ========== EMITS ==========
const emit = defineEmits(['volver'])

// ========== DATOS DEL PRODUCTO==========
const producto = ref({
    id: 1,
    nombre: 'Maíz Híbrido',
    codigo: 'PRN-908-789',
    categoria: 'Semilla',
    fabricante: 'Agrosem',
})

// ========== PRESENTACIONES==========
const presentaciones = ref([
    { id: 1, nombre: 'Bolsa 1kg', unidadMedida: 'kg', precio: 5.00, stock: 120, estado: 'ACTIVO' },
    { id: 2, nombre: 'Saco 25kg', unidadMedida: 'kg', precio: 95.00, stock: 40, estado: 'ACTIVO' },
    { id: 3, nombre: 'Saco 50kg', unidadMedida: 'kg', precio: 180.00, stock: 15, estado: 'INACTIVO' },
    { id: 4, nombre: 'Caja 10uds', unidadMedida: 'unidad', precio: 45.00, stock: 80, estado: 'ACTIVO' }
])

// ========== ESTADO DEL DIÁLOGO ==========
const dialogVisible = ref(false)
const editando = ref(false)
const form = ref({
    nombre: '',
    unidadMedida: '',
    precio: null,
    stock: null,
    estado: 'ACTIVO'
})


// ========== MÉTODOS ==========
const formatNumber = (value) => value?.toFixed(2) ?? '0.00'

const volver = () => {
    emit('volver')
}

// Botón dual: activar/desactivar
const toggleEstadoPresentacion = (pres) => {
    const nuevoEstado = pres.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
    const index = presentaciones.value.findIndex(p => p.id === pres.id)
    if (index !== -1) {
        presentaciones.value[index].estado = nuevoEstado
    }
}
</script>

<style scoped>
/* Ajustes adicionales */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #fafdf7;
  color: #3c674b;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.75rem 1rem;
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  transition: background-color 0.2s;
}

/* Hover en fila completa - verde muy suave */
:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #eef5e9 !important;  /* verde suave agro */
}

/* Opcional: si quieres hover por celda (más intenso al pasar por cada celda) */
:deep(.p-datatable .p-datatable-tbody > tr:hover > td) {
  background-color: transparent; /* para que herede el de la fila, no es necesario */
}


:deep(.p-button.p-button-text) {
  font-weight: 500;
}
</style>