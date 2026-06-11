<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-[26px] font-semibold tracking-tight !text-black">Registro de Productos</h1>
        <Button
          label="+ Agregar"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-7 py-5 rounded-lg border-none cursor-pointer shadow-md transition-all"
          @click="$emit('open-add')"
        />
      </div>

      <div class="flex justify-start items-center w-full gap-8">
        <IconField class="w-80">
          <InputIcon class="pi pi-search text-[#6b7280]" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Buscar por nombre, código..."
            class="w-full bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px]"
          />
        </IconField>

        <Select
          v-model="filtroCategoria"
          :options="uniqueCategories"
          showClear
          placeholder="Todas las categorías"
          class="w-56 bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px] flex items-center px-2"
        />
      </div>
    </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <DataTable
        :value="productosFiltrados"
        :loading="store.cargando"
        lazy
        :paginator="true"
        :rows="store.perPage"
        :totalRecords="store.totalRecords"
        v-model:filters="filters"
        :globalFilterFields="['nombre', 'fabricante', 'codigo']"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
        @page="onPageChange"
      >
        <template #empty>
          <div class="text-center py-6 text-[#6b7280] text-[14px]">
            No hay productos registrados.
          </div>
        </template>

        <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f]" />
        <Column field="codigo" header="Código" class="text-[#6b7280]" />

        <Column header="Categoría" class="text-[#4b5563]">
          <template #body="slotProps">
            {{ slotProps.data.categoria?.nombre ?? '—' }}
          </template>
        </Column>

        <Column header="Tipo" class="text-[#4b5563]">
          <template #body="slotProps">
            <span
              :class="[
                'px-2 py-1 rounded text-[12px] font-semibold uppercase',
                slotProps.data.tipo_producto === 'GRANEL'
                  ? 'bg-[#fef9c3] text-[#854d0e]'
                  : 'bg-[#dff0e0] text-[#2b5e3b]',
              ]"
            >
              {{ slotProps.data.tipo_producto }}
            </span>
          </template>
        </Column>

        <Column header="Acciones" class="w-[200px]">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                label="Editar"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip="'Editar producto'"
                @click="handleEdit(slotProps.data)"
              />
              <Button
                icon="pi pi-eye"
                label="Ver"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip="'Ver presentaciones'"
                @click="handleDetail(slotProps.data)"
              />
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
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { FilterMatchMode } from '@primevue/core/api'
import { useproductoStore } from '@/stores/productoStore'

const emit = defineEmits(['open-add', 'open-edit', 'open-detail'])
const store = useproductoStore()

onMounted(() => store.cargarProductos())

const filtroCategoria = ref(null)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

// Categorías únicas de la página actual
const uniqueCategories = computed(() => {
  return [...new Set(store.productos.map((p) => p.categoria?.nombre).filter(Boolean))].sort()
})

// Filtro local sobre la página actual
const productosFiltrados = computed(() => {
  return store.productos.filter((p) => {
    const coincideBusqueda =
      !filters.value.global.value ||
      p.nombre?.toLowerCase().includes(filters.value.global.value.toLowerCase()) ||
      p.codigo?.toLowerCase().includes(filters.value.global.value.toLowerCase()) ||
      p.fabricante?.toLowerCase().includes(filters.value.global.value.toLowerCase())

    const coincideCategoria =
      !filtroCategoria.value || p.categoria?.nombre === filtroCategoria.value

    return coincideBusqueda && coincideCategoria
  })
})

const onPageChange = (event) => {
  store.cargarProductos(event.page + 1, event.rows)
}

const handleEdit = (product) => emit('open-edit', product)
const handleDetail = (product) => emit('open-detail', product)
</script>

<style>
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #ffffff !important;
  color: #1e3a2f !important;
  border-bottom: 2px solid #e2e8dd !important;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.25rem 1rem;
}
.p-datatable-custom .p-datatable-tbody > tr {
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border-bottom: 1px solid #e2e8dd !important;
}
.p-datatable-custom .p-datatable-tbody > tr:hover {
  background-color: #f4f7f2 !important;
}
.p-inputtext:enabled:focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>
