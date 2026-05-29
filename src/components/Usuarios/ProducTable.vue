<template>
    <div class="bg-[#eef2e9] min-h-screen p-8 font-['Inter']">
        <div class="flex flex-col mb-8 gap-4">
            <div class="flex justify-between items-center w-full">
                <h1 class="text-[26px] font-semibold tracking-tight text-[#1a2e1f]">Registro de Productos</h1>
                
                <button
                    class="bg-[#2b5e3b] hover:bg-[#1f482d] text-white text-[14px] font-semibold px-7 py-4 rounded-lg transition-colors duration-200 cursor-pointer"
                    @click="$emit('open-add')"
                >
                    + Agregar
                </button>
            </div>

            <div class="flex justify-start items-center w-full gap-4">
                <div class="relative w-80">
                    <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm"></i>
                    <input
                        v-model="filters.searchName"
                        type="text"
                        placeholder="Buscar por nombre..."
                        class="w-full bg-white border border-gray-200 text-[#1a2e1f] text-[14px] rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#2b5e3b] focus:border-[#2b5e3b]"
                    />
                </div>

                <div class="relative">
                    <select
                        v-model="filters.selectedCategory"
                        class="w-56 bg-white border border-gray-200 text-[#1a2e1f] text-[14px] rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#2b5e3b] focus:border-[#2b5e3b] appearance-none cursor-pointer"
                    >
                        <option :value="null">Todas las categorías</option>
                        <option v-for="category in uniqueCategories" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>
                    <i class="pi pi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-xs pointer-events-none"></i>
                </div>

                <button
                    v-if="hasActiveFilters"
                    @click="clearFilters"
                    class="text-[#6b7280] hover:text-[#2b5e3b] text-sm font-medium transition-colors duration-200"
                >
                    Limpiar filtros
                </button>
            </div>
        </div>

        <div class="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th class="text-left py-3 px-4 text-[13px] font-semibold text-[#4b5563]">Nombre</th>
                        <th class="text-left py-3 px-4 text-[13px] font-semibold text-[#4b5563]">Categoría</th>
                        <th class="text-left py-3 px-4 text-[13px] font-semibold text-[#4b5563]">Fabricante</th>
                        <th class="text-left py-3 px-4 text-[13px] font-semibold text-[#4b5563]">Código</th>
                        <th class="text-center py-3 px-4 text-[13px] font-semibold text-[#4b5563] w-[100px]">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="filteredProducts.length === 0">
                        <td colspan="5" class="py-12 text-center text-[#6b7280]">
                            No se encontraron productos
                        </td>
                    </tr>
                    <tr v-for="product in paginatedProducts" :key="product.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td class="py-3 px-4 text-[14px] font-medium text-[#1a2e1f]">{{ product.name }}</td>
                        <td class="py-3 px-4 text-[14px] text-[#4b5563]">{{ product.categoria }}</td>
                        <td class="py-3 px-4 text-[14px] text-[#4b5563]">{{ product.fabricante }}</td>
                        <td class="py-3 px-4 text-[14px] text-[#6b7280] font-mono text-sm">{{ product.codigo }}</td>
                        <td class="py-3 px-4 text-center">
                            <button
                                @click="toggleVisibility(product)"
                                class="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-[#6b7280] hover:text-[#2b5e3b] transition-colors duration-200 flex items-center justify-center"
                            >
                                <i :class="product.visible ? 'pi pi-eye' : 'pi pi-eye-slash'" class="text-sm"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mt-4">
            <Paginator 
                v-model:first="first" 
                v-model:rows="rows" 
                :totalRecords="filteredProducts.length" 
                :rowsPerPageOptions="[5, 15, 25]"
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// Importación del componente Paginator de PrimeVue 4
import Paginator from 'primevue/paginator'

// Datos de ejemplo
const products = ref([
    { id: 1, name: 'Maíz Híbrido', categoria: 'Semilla', fabricante: 'Agrosem', codigo: 'PRN-908-789', visible: true },
    { id: 2, name: 'Fertilizante 20-20-20', categoria: 'Fertilizante', fabricante: 'NutriGreen', codigo: 'FER-234-567', visible: true },
    { id: 3, name: 'Herbicida Total', categoria: 'Herbicida', fabricante: 'CropCare', codigo: 'HER-876-543', visible: false },
    { id: 4, name: 'Maíz Tolerant', categoria: 'Semilla', fabricante: 'Biosem', codigo: 'PRN-345-123', visible: true },
    { id: 5, name: 'Fungicida Protector', categoria: 'Fungicida', fabricante: 'AgroProtect', codigo: 'FUN-654-321', visible: true },
    { id: 6, name: 'Insecticida Natural', categoria: 'Insecticida', fabricante: 'BioProtect', codigo: 'INS-123-456', visible: true },
    { id: 7, name: 'Insecticida Natural', categoria: 'Insecticida', fabricante: 'BioProtect', codigo: 'INS-123-456', visible: true },
    { id: 8, name: 'Insecticida Natural', categoria: 'Insecticida', fabricante: 'BioProtect', codigo: 'INS-123-456', visible: true },
])

// Variables reactivas para el control de la paginación
const first = ref(0)
const rows = ref(5) // Bloque inicial por defecto

// Filtros actualizados
const filters = ref({
    searchName: '',  // Búsqueda solo por nombre
    selectedCategory: null  // Categoría seleccionada
})

// Obtener categorías únicas de los productos
const uniqueCategories = computed(() => {
    const categories = products.value.map(product => product.categoria)
    return [...new Set(categories)].sort()
})

// Verificar si hay filtros activos
const hasActiveFilters = computed(() => {
    return filters.value.searchName !== '' || filters.value.selectedCategory !== null
})

// Productos filtrados por los buscadores (Base de datos local filtrada)
const filteredProducts = computed(() => {
    let result = products.value
    
    // Filtro por nombre
    if (filters.value.searchName && filters.value.searchName.trim()) {
        const searchTerm = filters.value.searchName.toLowerCase().trim()
        result = result.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        )
    }
    
    // Filtro por categoría
    if (filters.value.selectedCategory) {
        result = result.filter(product => 
            product.categoria === filters.value.selectedCategory
        )
    }
    
    return result
})

// Segmentación de productos para la vista actual (Paginación)
const paginatedProducts = computed(() => {
    return filteredProducts.value.slice(first.value, first.value + rows.value)
})

// Limpiar todos los filtros y reiniciar paginación
const clearFilters = () => {
    filters.value.searchName = ''
    filters.value.selectedCategory = null
    first.value = 0 // Regresa a la primera página al limpiar
}

// Emits
const emit = defineEmits(['open-add', 'open-edit'])

// Funciones
const toggleVisibility = (product) => {
    product.visible = !product.visible
    emit('open-edit', product)
}
</script>

<style scoped>
/* Estilos adicionales para mejorar la apariencia */
.rounded-xl {
    border-radius: 0.75rem;
}

.shadow-sm {
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* Transiciones suaves */
button {
    transition: all 0.2s ease;
}

/* Placeholder color */
input::placeholder {
    color: #9ca3af;
    font-weight: 400;
}

/* Scrollbar personalizada para la tabla si es necesario */
table {
    border-collapse: separate;
    border-spacing: 0;
}

tbody tr:last-child {
    border-bottom: none;
}

/* Animación para el botón de limpiar */
button {
    cursor: pointer;
}

button:active {
    transform: scale(0.98);
}
</style>