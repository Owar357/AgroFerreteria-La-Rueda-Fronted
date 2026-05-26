<template>
    <div class="bg-[#eef2e9] min-h-screen p-8 font-['Inter']">
        <!-- Header y Botón Agregar -->
        <div class="flex flex-col mb-8 gap-4">
            <div class="flex justify-between items-center w-full">
                <h1 class="text-[26px] font-semibold tracking-tight text-[#1a2e1f]">Registro de Proveedores</h1>

                <button
                    class="bg-[#2b5e3b] hover:bg-[#1f482d] text-white text-[14px] font-semibold px-6 py-4.5 rounded-lg transition-colors duration-260 cursor-pointer"
                    @click="$emit('open-add')"
                >
                    + Agregar
                </button>
            </div>

            <!-- Filtros -->
            <div class="flex justify-start items-center w-full gap-4">
                <!-- Búsqueda por Nombre -->
                <div class="relative w-80">
                    <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm"></i>
                    <input
                        v-model="filters.searchName"
                        type="text"
                        placeholder="Buscar por nombre..."
                        class="w-full bg-white border border-gray-200 text-[#1a2e1f] text-[14px] rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#2b5e3b] focus:border-[#2b5e3b]"
                    />
                </div>

                <!-- Filtro por Estado -->
                <div class="relative">
                    <select
                        v-model="filters.selectedEstado"
                        class="w-54 bg-white border border-gray-200 text-[#1a2e1f] text-[14px] rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#2b5e3b] focus:border-[#2b5e3b] appearance-none cursor-pointer"
                    >
                        <option :value="null">Todos los estados</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                    <i class="pi pi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-xs pointer-events-none"></i>
                </div>

                <!-- Botón limpiar filtros -->
                <button
                    v-if="hasActiveFilters"
                    @click="clearFilters"
                    class="text-[#6b7280] hover:text-[#2b5e3b] text-sm font-medium transition-colors duration-200"
                >
                    Limpiar filtros
                </button>
            </div>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th class="text-left py-3 px-4 text-[13px] font-semibold text-[#4b5563]">Nombre</th>
                        <th class="text-left py-3 px-4 text-[13px] font-semibold text-[#4b5563]">Correo</th>
                        <th class="text-left py-3 px-4 text-[13px] font-semibold text-[#4b5563]">Teléfono</th>
                        <th class="text-center py-3 px-4 text-[13px] font-semibold text-[#4b5563]">Estado</th>
                        <th class="text-center py-3 px-4 text-[13px] font-semibold text-[#4b5563] w-[100px]">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="filteredProveedores.length === 0">
                        <td colspan="5" class="py-12 text-center text-[#6b7280]">
                            No se encontraron proveedores
                        </td>
                    </tr>
                    <tr
                        v-for="proveedor in filteredProveedores"
                        :key="proveedor.id"
                        class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                        <td class="py-3 px-4 text-[14px] font-medium text-[#1a2e1f]">{{ proveedor.nombre }}</td>
                        <td class="py-3 px-4 text-[14px] text-[#4b5563]">{{ proveedor.correo }}</td>
                        <td class="py-3 px-4 text-[14px] text-[#4b5563]">{{ proveedor.telefono }}</td>
                        <td class="py-3 px-4 text-center">
                            <span
                                :class="proveedor.estado === 'Activo'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-600'"
                                class="text-[12px] font-semibold px-3 py-1 rounded-full"
                            >
                                {{ proveedor.estado }}
                            </span>
                        </td>
                        <td class="py-3 px-4 text-center">
                            <button
                                @click="toggleEstado(proveedor)"
                                :title="proveedor.estado === 'Activo' ? 'Desactivar' : 'Activar'"
                                class="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-[#6b7280] hover:text-[#2b5e3b] transition-colors duration-200 flex items-center justify-center mx-auto"
                            >
                                <i :class="proveedor.estado === 'Activo' ? 'pi pi-eye' : 'pi pi-eye-slash'" class="text-sm"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Datos de ejemplo
const proveedores = ref([
    { id: 1, nombre: 'AgroSem S.A.',      correo: 'contacto@agrosem.com',   telefono: '2222-1111', estado: 'Activo' },
    { id: 2, nombre: 'NutriGreen',         correo: 'ventas@nutrigreen.com',  telefono: '2233-4455', estado: 'Activo' },
    { id: 3, nombre: 'CropCare Ltda.',     correo: 'info@cropcare.com',      telefono: '2244-6677', estado: 'Inactivo' },
    { id: 4, nombre: 'BioSem Corp.',       correo: 'biosem@correo.com',      telefono: '2255-8899', estado: 'Activo' },
    { id: 5, nombre: 'AgroProtect',        correo: 'agroprotect@mail.com',   telefono: '2266-0011', estado: 'Inactivo' },
])

// Filtros
const filters = ref({
    searchName: '',
    selectedEstado: null,
})

// Filtros activos
const hasActiveFilters = computed(() =>
    filters.value.searchName !== '' || filters.value.selectedEstado !== null
)

// Proveedores filtrados
const filteredProveedores = computed(() => {
    let result = proveedores.value

    if (filters.value.searchName.trim()) {
        const term = filters.value.searchName.toLowerCase().trim()
        result = result.filter(p => p.nombre.toLowerCase().includes(term))
    }

    if (filters.value.selectedEstado) {
        result = result.filter(p => p.estado === filters.value.selectedEstado)
    }

    return result
})

// Limpiar filtros
const clearFilters = () => {
    filters.value.searchName = ''
    filters.value.selectedEstado = null
}

// Emits
const emit = defineEmits(['open-add', 'open-edit'])

// Cambiar estado Activo/Inactivo
const toggleEstado = (proveedor) => {
    proveedor.estado = proveedor.estado === 'Activo' ? 'Inactivo' : 'Activo'
    emit('open-edit', proveedor)
}
</script>

<style scoped>
.rounded-xl { border-radius: 0.75rem; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }

button { transition: all 0.2s ease; cursor: pointer; }
button:active { transform: scale(0.98); }

input::placeholder { color: #9ca3af; font-weight: 400; }

table { border-collapse: separate; border-spacing: 0; }
tbody tr:last-child { border-bottom: none; }
</style>