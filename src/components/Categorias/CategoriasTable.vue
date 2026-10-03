<template>
  <!-- Contenedor Principal -->
  <div class="w-full">
    
    <!-- Apartado de Filtros Estático Superior (Móvil y PC) -->
    <div class="p-4 sm:p-5 border-b border-[#e2e8dd] bg-white">
      <div class="flex flex-col md:flex-row items-center justify-between w-full gap-4">
        <IconField class="w-full sm:w-[20rem] md:w-[25rem] lg:w-[35rem]">
          <InputIcon class="pi pi-search text-[#6b7280]" />
          <InputText
            v-model="textoBusqueda"
            placeholder="Buscar categoría"
            class="w-full !bg-white !border-[#cbd5e1] text-[#1a2e1f] text-sm rounded-lg h-[2.625rem]"
            @input="store.buscarCategorias(textoBusqueda)"
          />
        </IconField>

        <Button
          label="+ Nueva Categoría"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold px-6 py-3 rounded-lg border-none cursor-pointer shadow-md transition-colors w-full md:w-auto whitespace-nowrap shrink-0"
          @click="emit('open-add')"
        />
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA MÓVIL: 2 Columnas + Desplegable (< 768px)          -->
    <!-- ======================================================= -->
    <div class="block md:hidden w-full">
      <DataTable
        v-model:expandedRows="expandedRows"
        :value="store.cargando ? Array.from({ length: store.porPagina }) : store.categorias"
        :paginator="!store.cargando"
        :lazy="true"
        :rows="store.porPagina"
        :totalRecords="store.totalRegistros"
        :first="(store.paginaActual - 1) * store.porPagina"
        dataKey="id"
        class="p-datatable-custom text-sm w-full"
        currentPageReportTemplate="{first}-{last} de {totalRecords}"
        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        @page="cambiarPagina"
      >
        <template #empty>
          <div class="text-center py-6 text-[#6b7280] text-sm">
            No hay categorías registradas.
          </div>
        </template>

        <!-- Flecha de Expansión -->
        <Column expander style="width: 2.5rem" />

        <!-- Columna: Nombre -->
        <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f]">
          <template #body="slotProps">
            <Skeleton v-if="store.cargando" width="70%" height="1.2rem" />
            <span v-else class="capitalize block leading-tight">{{ slotProps.data.nombre }}</span>
          </template>
        </Column>

        <!-- Plantilla de Expansión Móvil (Grid Ordenado) -->
        <template #expansion="slotProps">
          <div class="p-4 bg-[#f8faf7] border-y border-[#e2e8dd] text-sm">
            <div class="grid grid-cols-1 gap-3 bg-white p-3.5 rounded-lg border border-[#e2e8dd] shadow-xs">
              <div>
                <span class="text-[0.7rem] font-bold tracking-wider uppercase text-gray-500 block mb-1">
                  % Ganancia Mínima
                </span>
                <span
                  v-if="!store.cargando"
                  class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#eef7f0] text-[#2b5e3b] border border-[#c2e3c8]"
                >
                  {{ slotProps.data.porcentaje_ganancia_minimo !== null ? parseFloat(slotProps.data.porcentaje_ganancia_minimo).toFixed(2) : '15.00' }}%
                </span>
              </div>
            </div>

            <!-- Acciones Móvil -->
            <div class="mt-3 pt-2 flex gap-2 justify-end items-center">
              <Button
                icon="pi pi-pencil"
                label="Editar"
                class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                v-tooltip.top="'Editar categoría'"
                @click="emit('open-edit', slotProps.data)"
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
        :value="store.cargando ? Array.from({ length: store.porPagina }) : store.categorias"
        responsiveLayout="scroll"
        class="p-datatable-custom text-sm w-full min-w-[35rem]"
        :paginator="!store.cargando"
        :lazy="true"
        :rows="store.porPagina"
        :totalRecords="store.totalRegistros"
        :first="(store.paginaActual - 1) * store.porPagina"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categorías"
        @page="cambiarPagina"
      >
        <template #empty>
          <div class="text-center py-6 text-[#6b7280] text-sm">
            No hay categorías registradas.
          </div>
        </template>

        <!-- Columna: Nombre -->
        <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f] min-w-[12rem]">
          <template #body="slotProps">
            <Skeleton v-if="store.cargando" width="70%" height="1.2rem" />
            <span v-else class="capitalize block">{{ slotProps.data.nombre }}</span>
          </template>
        </Column>

        <!-- Columna: % Ganancia Mínimo -->
        <Column header="% Ganancia Mínima" class="text-center w-[11.25rem] min-w-[9rem]">
          <template #body="slotProps">
            <Skeleton v-if="store.cargando" width="60%" height="1.2rem" class="mx-auto" />
            <span
              v-else
              class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#eef7f0] text-[#2b5e3b] border border-[#c2e3c8] whitespace-nowrap"
            >
              {{ slotProps.data.porcentaje_ganancia_minimo !== null ? parseFloat(slotProps.data.porcentaje_ganancia_minimo).toFixed(2) : '15.00' }}%
            </span>
          </template>
        </Column>

        <!-- Columna: Acciones -->
        <Column header="Acciones" class="text-right w-[9.375rem] shrink-0">
          <template #body="slotProps">
            <div class="flex gap-2 justify-end whitespace-nowrap">
              <Skeleton v-if="store.cargando" width="5.5rem" height="2rem" borderRadius="0.5rem" />
              
              <Button
                v-else
                icon="pi pi-pencil"
                label="Editar"
                class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
                v-tooltip.top="'Editar categoría'"
                @click="emit('open-edit', slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Skeleton from 'primevue/skeleton'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { useCategoriaStore } from '../../stores/categoriaStore'

const textoBusqueda = ref('')
const expandedRows = ref({})

const emit = defineEmits(['open-edit', 'open-view', 'open-add'])
const store = useCategoriaStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  const pageFromUrl = Number(route.query.page) || 1
  store.paginaActual = pageFromUrl
  store.cargarCategorias(pageFromUrl, store.porPagina)
})

const cambiarPagina = (event) => {
  const page = event.page + 1
  
  if (page !== store.paginaActual) {
    router.push({ query: { ...route.query, page } })
    store.cargarCategorias(page, event.rows)
  }
}
</script>

<style>
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #ffffff !important;
  color: #1e3a2f !important;
  border-bottom: 0.125rem solid #e2e8dd !important;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.25rem 1rem;
  white-space: nowrap !important;
}

.p-datatable-custom .p-datatable-tbody > tr {
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border-bottom: 0.0625rem solid #e2e8dd !important;
}

.p-datatable-custom .p-datatable-tbody > tr:hover {
  background-color: #f4f7f2 !important;
}

.p-inputtext:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>