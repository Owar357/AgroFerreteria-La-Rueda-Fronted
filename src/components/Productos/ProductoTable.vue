<template>
  <div class="bg-[#eef2e9] min-h-screen p-4 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <!-- Encabezado de la página -->
    <div class="flex items-center gap-3 mb-6">
      <div
        class="!w-10 !h-10 rounded-xl bg-white border border-[#e2e8dd] shadow-sm flex items-center justify-center shrink-0">
        <i class="pi pi-book text-[#2b5e3b] text-xl"></i>
      </div>
      <div>
        <h1 class="text-[1.75rem] md:text-[2rem] font-bold text-[#1a2e1f] leading-tight m-0">
          Catálogo de productos
        </h1>
        <p class="text-sm text-gray-500 mt-0.5 m-0">Gestión general del inventario</p>
      </div>
    </div>

    <!-- Contenedor Principal -->
    <div class="bg-white rounded-2xl border border-[#dce4d7] shadow-sm overflow-hidden w-full">

      <!-- Apartado de Filtros Estático Superior -->
      <div class="p-4 sm:p-5 border-b border-[#e2e8dd] bg-[#fbfdf9]">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <!-- Filtros (Izquierda) -->
          <div class="flex flex-col sm:flex-row items-center gap-3 w-full">
            <!-- Búsqueda -->
            <IconField class="w-full lg:w-[30rem]">
              <InputIcon class="pi pi-search text-[#6b7280]" />
              <InputText 
                v-model="searchQuery" 
                @input="onSearchInput" 
                placeholder="Buscar nombre, código..."
                class="w-full !bg-white !border-[#cbd5e1] text-[#1a2e1f] text-sm rounded-lg h-[2.625rem]" 
              />
            </IconField>

            <!-- Categorías con búsqueda integrada -->
            <Select 
              v-model="filtroCategoria" 
              :options="opcionesCategorias" 
              optionLabel="nombre" 
              optionValue="nombre"
              filter 
              filterPlaceholder="Buscar..." 
              placeholder="Todas las categorías" 
              @change="onCategoriaChange"
              class="w-full sm:w-[15rem] !border-[#cbd5e1] !bg-white  text-[#1a2e1f] text-sm rounded-lg h-[2.625rem] flex items-center px-3" 
            />
          </div>

          <!-- Botón Acción Principal (Derecha) -->
          <Button 
            label="Nuevo Producto" 
            icon="pi pi-plus"
            class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold px-6 h-[2.625rem] rounded-lg border-none cursor-pointer transition-all shadow-sm w-full md:w-auto whitespace-nowrap flex justify-center items-center gap-2 shrink-0"
            @click="$emit('open-add')" 
          />
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- VISTA MÓVIL: 2 Columnas + Desplegable (< 768px)          -->
      <!-- ======================================================= -->
      <div class="block md:hidden w-full">
        <DataTable 
          v-model:expandedRows="expandedRows"
          :value="store.cargando ? Array.from({ length: store.perPage }) : store.productos" 
          lazy 
          :paginator="!store.cargando"
          :rows="store.perPage" 
          :totalRecords="store.totalRecords" 
          dataKey="id"
          class="p-datatable-custom text-sm w-full"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
          currentPageReportTemplate="{first}-{last} de {totalRecords}" 
          @page="onPageChange"
        >
          <template #empty>
            <div class="text-center py-8 text-[#6b7280]">
              <i class="pi pi-inbox text-3xl mb-2 block opacity-40"></i>
              No se encontraron productos coincidentes.
            </div>
          </template>

          <!-- Botón de Expansión (Flecha) -->
          <Column expander style="width: 2.5rem" />

          <!-- Columna 1: Nombre -->
          <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f]">
            <template #body="slotProps">
              <Skeleton v-if="store.cargando" width="75%" height="1.2rem" />
              <span v-else class="font-semibold text-[#1a2e1f] capitalize block leading-tight">
                {{ slotProps.data.nombre }}
              </span>
            </template>
          </Column>

          <!-- Columna 2: Código -->
          <Column field="codigo" header="Código" class="text-[#6b7280]">
            <template #body="slotProps">
              <Skeleton v-if="store.cargando" width="45%" height="1.2rem" />
              <span v-else class="font-mono text-[11px] bg-[#f1f5f0] px-2 py-0.5 rounded text-[#334155] border border-[#e2e8dd] uppercase whitespace-nowrap">
                {{ slotProps.data.codigo }}
              </span>
            </template>
          </Column>

          <!-- Plantilla de Expansión (Móvil) -->
          <template #expansion="slotProps">
            <div class="p-4 bg-[#f8faf7] border-y border-[#e2e8dd] text-sm">
              <div class="grid grid-cols-2 gap-x-4 gap-y-3 bg-white p-3.5 rounded-lg border border-[#e2e8dd] shadow-xs">
                <!-- Tipo de Producto (Ahora en el desplegable) -->
                <div class="col-span-1">
                  <span class="text-[0.7rem] font-bold tracking-wider uppercase text-gray-500 block mb-1">
                    Tipo
                  </span>
                  <span :class="[
                    'px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase inline-block whitespace-nowrap',
                    slotProps.data.tipo_producto === 'GRANEL'
                      ? 'bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]'
                      : 'bg-[#dff0e0] text-[#2b5e3b] border border-[#c1e1c2]',
                  ]">
                    {{ slotProps.data.tipo_producto }}
                  </span>
                </div>

                <!-- Fabricante -->
                <div class="col-span-1">
                  <span class="text-[0.7rem] font-bold tracking-wider uppercase text-gray-500 block mb-0.5">
                    Fabricante
                  </span>
                  <span class="text-gray-800 font-medium capitalize block truncate">
                    {{ slotProps.data.fabricante || '—' }}
                  </span>
                </div>

                <!-- Categoría -->
                <div class="col-span-2 pt-1 border-t border-gray-100">
                  <span class="text-[0.7rem] font-bold tracking-wider uppercase text-gray-500 block mb-0.5">
                    Categoría
                  </span>
                  <span class="text-gray-800 font-medium block">
                    {{ slotProps.data.categoria?.nombre ?? '—' }}
                  </span>
                </div>

                <!-- % Ganancia Mínimo -->
                <div class="col-span-2 pt-1 border-t border-gray-100">
                  <span class="text-[0.7rem] font-bold tracking-wider uppercase text-gray-500 block mb-1">
                    % Ganancia Mínimo
                  </span>
                  <div>
                    <span v-if="slotProps.data.porcentaje_ganancia_minimo !== null"
                      class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#eef7f0] text-[#2b5e3b] border border-[#c2e3c8]">
                      {{ parseFloat(slotProps.data.porcentaje_ganancia_minimo).toFixed(2) }}%
                    </span>
                    <span v-else
                      class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      {{ slotProps.data.categoria?.porcentaje_ganancia_minimo !== null ?
                        parseFloat(slotProps.data.categoria.porcentaje_ganancia_minimo).toFixed(2) : '15.00' }}% (Heredado)
                    </span>
                  </div>
                </div>
              </div>

              <!-- Botones de Acción Móvil -->
              <div class="mt-3 pt-2 flex gap-2 justify-end items-center">
                <Button 
                  icon="pi pi-pencil" 
                  label="Editar"
                  class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                  @click="handleEdit(slotProps.data)" 
                />
                <Button 
                  icon="pi pi-box" 
                  label="Presentaciones"
                  class="!bg-white hover:!bg-[#f0f4ee] !text-[#2b5e3b] !border !border-[#cfe0d2] rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                  @click="handleDetail(slotProps.data)" 
                />
              </div>
            </div>
          </template>
        </DataTable>
      </div>

      <!-- ======================================================= -->
      <!-- VISTA ESCRITORIO: Tabla Completa Tradicional (>= 768px)  -->
      <!-- ======================================================= -->
      <div class="hidden md:block w-full overflow-x-auto">
        <DataTable 
          :value="store.cargando ? Array.from({ length: store.perPage }) : store.productos" 
          lazy 
          :paginator="!store.cargando"
          :rows="store.perPage" 
          :totalRecords="store.totalRecords" 
          responsiveLayout="scroll"
          class="p-datatable-custom text-sm w-full min-w-[58rem]"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos" 
          @page="onPageChange"
        >
          <template #empty>
            <div class="text-center py-10 text-[#6b7280]">
              <i class="pi pi-inbox text-3xl mb-2 block opacity-40"></i>
              No se encontraron productos coincidentes.
            </div>
          </template>

          <!-- Columna: Nombre -->
          <Column field="nombre" header="Nombre" class="font-medium text-[#1a2e1f] min-w-[10rem]">
            <template #body="slotProps">
              <Skeleton v-if="store.cargando" width="75%" height="1.2rem" />
              <span v-else class="font-semibold text-[#1a2e1f] capitalize">{{ slotProps.data.nombre }}</span>
            </template>
          </Column>

          <!-- Columna: Fabricante -->
          <Column field="fabricante" header="Fabricante" class="text-[#4b5563] min-w-[8rem]">
            <template #body="slotProps">
              <Skeleton v-if="store.cargando" width="55%" height="1.2rem" />
              <span v-else class="capitalize">{{ slotProps.data.fabricante || '—' }}</span>
            </template>
          </Column>

          <!-- Columna: Código -->
          <Column field="codigo" header="Código" class="text-[#6b7280] min-w-[7.5rem]">
            <template #body="slotProps">
              <Skeleton v-if="store.cargando" width="45%" height="1.2rem" />
              <span v-else
                class="font-mono text-xs bg-[#f1f5f0] px-2 py-0.5 rounded text-[#334155] border border-[#e2e8dd] uppercase whitespace-nowrap inline-block">
                {{ slotProps.data.codigo }}
              </span>
            </template>
          </Column>

          <!-- Columna: Categoría -->
          <Column header="Categoría" class="text-[#4b5563] min-w-[9rem]">
            <template #body="slotProps">
              <Skeleton v-if="store.cargando" width="60%" height="1.2rem" />
              <span v-else>{{ slotProps.data.categoria?.nombre ?? '—' }}</span>
            </template>
          </Column>

          <!-- Columna: % Ganancia Mínimo -->
          <Column header="% Ganancia Mínimo" class="text-center min-w-[8.5rem]">
            <template #body="slotProps">
              <Skeleton v-if="store.cargando" width="50%" height="1.2rem" class="mx-auto" />
              <template v-else>
                <span v-if="slotProps.data.porcentaje_ganancia_minimo !== null"
                  class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#eef7f0] text-[#2b5e3b] border border-[#c2e3c8] whitespace-nowrap"
                  v-tooltip.top="'Definido individualmente en el producto'">
                  {{ parseFloat(slotProps.data.porcentaje_ganancia_minimo).toFixed(2) }}%
                </span>
                <span v-else
                  class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap"
                  v-tooltip.top="'Heredado de la categoría'">
                  {{ slotProps.data.categoria?.porcentaje_ganancia_minimo !== null ?
                    parseFloat(slotProps.data.categoria.porcentaje_ganancia_minimo).toFixed(2) : '15.00' }}% (Heredado)
                </span>
              </template>
            </template>
          </Column>

          <!-- Columna: Tipo -->
          <Column header="Tipo" class="text-[#4b5563] min-w-[7.5rem]">
            <template #body="slotProps">
              <Skeleton v-if="store.cargando" width="4.5rem" height="1.5rem" borderRadius="20px" />
              <span v-else :class="[
                'px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase whitespace-nowrap inline-block',
                slotProps.data.tipo_producto === 'GRANEL'
                  ? 'bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]'
                  : 'bg-[#dff0e0] text-[#2b5e3b] border border-[#c1e1c2]',
              ]">
                {{ slotProps.data.tipo_producto }}
              </span>
            </template>
          </Column>

          <!-- Columna: Acciones -->
          <Column header="Acciones" class="w-[12rem] shrink-0">
            <template #body="slotProps">
              <div class="flex gap-2 justify-end whitespace-nowrap">
                <template v-if="store.cargando">
                  <Skeleton width="4rem" height="2rem" borderRadius="6px" />
                  <Skeleton width="3.5rem" height="2rem" borderRadius="6px" />
                </template>

                <template v-else>
                  <Button icon="pi pi-pencil" label="Editar"
                    class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                    @click="handleEdit(slotProps.data)" v-tooltip.top="'Editar producto'" />

                  <Button icon="pi pi-box" label="Presentaciones"
                    class="!bg-white hover:!bg-[#f0f4ee] !text-[#2b5e3b] !border !border-[#cfe0d2] rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                    @click="handleDetail(slotProps.data)" v-tooltip.top="'Ver presentaciones del producto'" />
                </template>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useproductoStore } from '@/stores/productoStore'
import { mostrarAccesoDenegado, mostrarError } from '@/utils/SweetAlertService'

const emit = defineEmits(['open-add', 'open-edit', 'open-detail'])
const store = useproductoStore()

const searchQuery = ref('')
const filtroCategoria = ref(null)
const expandedRows = ref({})
let searchTimer = null

onMounted(async () => {
  store.cargarCategorias()

  const resultado = await store.cargarProductos(1, store.perPage)
  if (resultado?.status === 403) {
    mostrarAccesoDenegado()
  } else if (resultado?.error) {
    mostrarError('Error de conexión', resultado.error)
  }
})

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
.p-datatable-custom .p-datatable-thead>tr>th {
  background-color: #fcfdfe !important;
  border-bottom: 1px solid #e2e8dd !important;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem;
  white-space: nowrap !important;
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
}

.p-select:not(.p-disabled).p-focus,
.p-inputtext:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>