<template>
  <div class="bg-[#eef2e9] min-h-screen p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-3">
        <div
          class="!w-11 !h-11 rounded-lg bg-[#f4f7f2] border border-[#dce4d7] shadow-sm flex items-center justify-center shrink-0">
          <i class="pi pi-book text-[#2b5e3b] text-lg"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-[#1a2e1f]">Catálogo de productos</h1>
          <p class="text-1xl text-[#526356] mt-0.5">Gestión general del inventario</p>
        </div>
      </div>
    </div>

    <!-- 2.(Card) -->
    <div class="bg-white rounded-2xl border border-[#dce4d7] shadow-sm overflow-hidden">

      <!-- Toolbar Superior / Filtros integrados -->
      <div
        class="p-5 border-b border-[#e2e8dd] bg-[#fbfdf9] flex flex-col md:flex-row justify-between items-center gap-4">

        <!-- Filtros (Izquierda) -->
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full ">
          <!-- Búsqueda -->
          <IconField class="w-full sm:w-[500px]">
            <InputIcon class="pi pi-search text-[#6b7280] text-sm" />
            <InputText v-model="searchQuery" @input="onSearchInput" placeholder="Buscar nombre, código..."
              class="w-full !bg-white !border-[#cbd5e1] text-[#1a2e1f] text-sm rounded-lg h-[40px] focus:!border-[#2b5e3b] !pl-9" />
          </IconField>

          <!-- Categorías con búsqueda integrada -->
          <Select v-model="filtroCategoria" :options="opcionesCategorias" optionLabel="nombre" optionValue="nombre"
            filter filterPlaceholder="Buscar..." placeholder="Todas las categorías" @change="onCategoriaChange"
            class="w-full sm:w-[220px] !bg-white !border-[#cbd5e1] text-[#1a2e1f] text-sm rounded-lg h-[40px] flex items-center px-3" />
        </div>

        <!-- Botón Acción Principal (Derecha) -->
        <Button label="Nuevo Producto" icon="pi pi-plus"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-medium px-4 h-[40px] rounded-lg border-none cursor-pointer transition-all shadow-sm w-full md:w-auto flex justify-center items-center gap-2"
          @click="$emit('open-add')" />
      </div>

      <!-- 3. Tabla de Datos -->
      <DataTable :value="store.cargando ? Array.from({ length: 5 }) : store.productos" lazy :paginator="!store.cargando"
        :rows="store.perPage" :totalRecords="store.totalRecords" responsiveLayout="scroll"
        class="p-datatable-custom text-sm"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos" @page="onPageChange">
        <template #empty>
          <div class="text-center py-10 text-[#6b7280]">
            <i class="pi pi-inbox text-3xl mb-2 block opacity-40"></i>
            No se encontraron productos coincidentes.
          </div>
        </template>

        <!-- Columna: Nombre -->
        <Column field="nombre" header="Nombre" class="font-medium text-[#1a2e1f]">
          <template #body="slotProps">
            <Skeleton v-if="store.cargando" width="75%" height="1.2rem" />
            <span v-else class="font-semibold text-[#1a2e1f]">{{ slotProps.data.nombre }}</span>
          </template>
        </Column>

        <!-- Columna: Fabricante -->
        <Column field="fabricante" header="Fabricante" class="text-[#4b5563]">
          <template #body="slotProps">
            <Skeleton v-if="store.cargando" width="55%" height="1.2rem" />
            <span v-else>{{ slotProps.data.fabricante || '—' }}</span>
          </template>
        </Column>

        <!-- Columna: Código -->
        <Column field="codigo" header="Código" class="text-[#6b7280]">
          <template #body="slotProps">
            <Skeleton v-if="store.cargando" width="45%" height="1.2rem" />
            <span v-else
              class="font-mono text-xs bg-[#f1f5f0] px-2 py-0.5 rounded text-[#334155] border border-[#e2e8dd]">
              {{ slotProps.data.codigo }}
            </span>
          </template>
        </Column>

        <!-- Columna: Categoría -->
        <Column header="Categoría" class="text-[#4b5563]">
          <template #body="slotProps">
            <Skeleton v-if="store.cargando" width="60%" height="1.2rem" />
            <span v-else>{{ slotProps.data.categoria?.nombre ?? '—' }}</span>
          </template>
        </Column>

        <!-- Columna: Tipo -->
        <Column header="Tipo" class="text-[#4b5563]">
          <template #body="slotProps">
            <Skeleton v-if="store.cargando" width="4.5rem" height="1.5rem" borderRadius="20px" />
            <span v-else :class="[
              'px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase',
              slotProps.data.tipo_producto === 'GRANEL'
                ? 'bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]'
                : 'bg-[#dff0e0] text-[#2b5e3b] border border-[#c1e1c2]',
            ]">
              {{ slotProps.data.tipo_producto }}
            </span>
          </template>
        </Column>

        <!-- Columna: Acciones -->
        <Column header="Acciones" class="w-[180px]">
          <template #body="slotProps">
            <div class="flex gap-2 justify-end">
              <template v-if="store.cargando">
                <Skeleton width="4rem" height="2rem" borderRadius="6px" />
                <Skeleton width="3.5rem" height="2rem" borderRadius="6px" />
              </template>

              <template v-else>
                <Button icon="pi pi-pencil" label="Editar"
                  class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer"
                  @click="handleEdit(slotProps.data)" " v-tooltip.top="'Editar productos'"/>

                <Button icon="pi pi-box" label="Presentaciones"
                  class="!bg-white hover:!bg-[#f0f4ee] !text-[#2b5e3b] !border !border-[#cfe0d2] rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer"
                  @click="handleDetail(slotProps.data)" v-tooltip.top="'Ver presentaciones del producto'" />
              </template>
            </div>
          </template>
        </Column>
      </DataTable>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'
import Swal from 'sweetalert2'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useproductoStore } from '@/stores/productoStore'

const emit = defineEmits(['open-add', 'open-edit', 'open-detail'])
const store = useproductoStore()

const searchQuery = ref('')
const filtroCategoria = ref(null)
let searchTimer = null

onMounted(async () => {
  store.cargarCategorias()

  const resultado = await store.cargarProductos(1, store.perPage)
  if (resultado?.status === 403) {
    Swal.fire({
      icon: 'error',
      title: 'Sin autorización',
      text: 'No tiene los permisos para ver los productos.',
      confirmButtonColor: '#2b5e3b',
    })
  } else if (resultado?.error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: resultado.error,
      confirmButtonColor: '#2b5e3b',
    })
  }
})

// Opciones de categorías con "Todas" por defecto
const opcionesCategorias = computed(() => [
  { nombre: 'Todas las categorías', id: null },
  ...store.categorias
])

const onSearchInput = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    const cat = filtroCategoria.value === 'Todas las categorías' ? null : filtroCategoria.value
    store.cargarProductos(1, store.perPage, searchQuery.value, cat)
  }, 350)
}

const onCategoriaChange = (e) => {
  const cat = e.value === 'Todas las categorías' ? null : e.value
  store.cargarProductos(1, store.perPage, searchQuery.value, cat)
}

const onPageChange = (event) => {
  const cat = filtroCategoria.value === 'Todas las categorías' ? null : filtroCategoria.value
  store.cargarProductos(event.page + 1, event.rows, searchQuery.value, cat)
}

const handleEdit = (product) => emit('open-edit', product)
const handleDetail = (product) => emit('open-detail', product)
</script>

<style>
/* Estilos para alinear el Footer de Paginación de PrimeVue correctamente */
.p-datatable-custom .p-datatable-thead>tr>th {
  background-color: #fcfdfe !important;
  color: #1e3a2f !important;
  border-bottom: 1px solid #e2e8dd !important;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem;
}

.p-datatable-custom .p-datatable-tbody>tr>td {
  padding: 0.85rem 1rem !important;
  border-bottom: 1px solid #f1f5f0 !important;
}

.p-datatable-custom .p-datatable-paginator-bottom {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  background-color: #fbfdf9 !important;
  border-top: 1px solid #e2e8dd !important;
  padding: 0.75rem 1.25rem !important;
}

.p-paginator-current {
  font-size: 13px !important;
  color: #64748b !important;
  order: -1;
  /* Pone "Mostrando 1 a 2 de 2" a la izquierda */
}
</style>