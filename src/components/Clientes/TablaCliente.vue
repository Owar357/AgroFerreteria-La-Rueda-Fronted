<template>
  <div class="bg-[#eef2e9] min-h-screen p-3 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <!-- ======================================================= -->
    <!-- VISTA MÓVIL ENCABEZADO (Solo Teléfono / Tablet < 1024px)-->
    <!-- ======================================================= -->
    <div class="block lg:hidden mb-4">
      <div class="flex items-center gap-3">
        <div
          class="!w-[2.5rem] !h-[2.5rem] rounded-xl bg-white border border-[#e2e8dd] shadow-2xs flex items-center justify-center shrink-0"
        >
          <i class="pi pi-users text-[#2b5e3b] text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[#1a2e1f] leading-tight m-0">Historial de Clientes</h1>
          <p class="text-xs text-gray-500 mt-0.5 m-0">Directorio general y registro de compras</p>
        </div>
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO ENCABEZADO (Solo PC >= 1024px)        -->
    <!-- ======================================================= -->
    <div class="hidden lg:flex items-center gap-3 mb-6">
      <div
        class="!w-[2.5rem] !h-[2.5rem] rounded-xl bg-white border border-[#e2e8dd] shadow-sm flex items-center justify-center shrink-0"
      >
        <i class="pi pi-users text-[#2b5e3b] text-xl"></i>
      </div>
      <div>
        <h1 class="text-[1.75rem] md:text-[2rem] font-bold text-[#1a2e1f] leading-tight m-0">
          Historial de Clientes
        </h1>
        <p class="text-sm text-gray-500 mt-0.5 m-0">
          Directorio general de clientes y registro de compras
        </p>
      </div>
    </div>

    <!-- TARJETA CONTENEDORA PRINCIPAL -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm overflow-hidden w-full">
      <!-- ======================================================= -->
      <!-- VISTA MÓVIL FILTROS (Solo Teléfono / Tablet)           -->
      <!-- ======================================================= -->
      <div class="block lg:hidden p-4 border-b border-[#e2e8dd] bg-[#fbfdf9] space-y-3">
        <div class="flex flex-col gap-3">
          <IconField class="w-full relative flex items-center h-[2.5rem]">
            <InputIcon class="pi pi-search text-gray-400 pointer-events-none z-10" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Buscar por nombre o N° documento..."
              class="w-full !h-[2.5rem] !bg-white !border-gray-300 text-[#1a2e1f] text-xs rounded-xl !pl-9 focus:!border-[#2b5e3b] box-border"
            />
          </IconField>

          <Select
            v-model="filters['tipo_persona'].value"
            :options="tipoPersonaOpciones"
            optionLabel="label"
            optionValue="value"
            showClear
            placeholder="Todos los tipos de persona"
            class="w-full !h-[2.5rem] !bg-white !border-gray-300 text-xs rounded-xl flex items-center px-2"
          />
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- VISTA ESCRITORIO FILTROS (Solo PC - 1 Sola Fila)        -->
      <!-- ======================================================= -->
      <div class="hidden lg:block p-5 border-b border-[#e2e8dd] bg-[#fbfdf9]">
        <div class="flex items-center gap-3 w-full">
          <!-- Buscador -->
          <IconField class="w-[60%] shrink-0">
            <InputIcon class="pi pi-search text-gray-400 text-sm" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Buscar por nombre o N° documento..."
              class="w-full !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-10 focus:!border-[#2b5e3b]"
            />
          </IconField>

          <!-- Tipo Persona -->
          <Select
            v-model="filters['tipo_persona'].value"
            :options="tipoPersonaOpciones"
            optionLabel="label"
            optionValue="value"
            showClear
            placeholder="Todos los tipos de persona"
            class="w-[40%] !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-10 flex items-center px-2 shrink-0"
          />
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- VISTA MÓVIL: Tabla con Desplegable (< 1024px)           -->
      <!-- ======================================================= -->
      <div class="block lg:hidden w-full">
        <DataTable
          v-model:expandedRows="expandedRows"
          :value="cargando ? Array.from({ length: porPagina || 5 }) : clientesFiltrados"
          v-model:filters="filters"
          :globalFilterFields="['nombre', 'numero_documento']"
          dataKey="numero_documento"
          class="p-datatable-custom text-sm w-full"
          :paginator="!cargando"
          :rows="porPagina"
          currentPageReportTemplate="{first}-{last} de {totalRecords}"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center py-8 text-gray-400">
              <i class="pi pi-inbox text-3xl mb-2 opacity-40" />
              <span class="text-sm font-medium">No hay clientes registrados</span>
            </div>
          </template>

          <Column expander style="width: 2.2rem" />

          <!-- Cliente y Documento -->
          <Column header="Cliente / Documento">
            <template #body="slotProps">
              <div v-if="cargando" class="space-y-1">
                <Skeleton width="75%" height="1rem" />
                <Skeleton width="45%" height="0.8rem" />
              </div>
              <div v-else class="flex flex-col gap-0.5 items-start">
                <span class="font-semibold text-xs text-[#1a2e1f] block truncate max-w-[170px]">
                  {{ slotProps.data.nombre || slotProps.data.razon_social }}
                </span>
                <span
                  class="font-mono text-[11px] bg-[#f1f5f0] text-[#334155] px-2 py-0.5 rounded border border-[#e2e8dd] font-bold uppercase whitespace-nowrap"
                >
                  {{ slotProps.data.numero_documento }}
                </span>
              </div>
            </template>
          </Column>

          <!-- Tipo Persona -->
          <Column header="Tipo Persona" class="text-right">
            <template #body="slotProps">
              <div v-if="cargando" class="flex justify-end">
                <Skeleton width="4.5rem" height="1.4rem" borderRadius="12px" />
              </div>
              <Tag
                v-else
                :value="slotProps.data.tipo_persona"
               :severity="slotProps.data.tipo_persona?.toUpperCase() === 'NATURAL' ? 'info' : 'warn'"
                rounded
                class="!text-[9px] !px-2 !py-0.5 whitespace-nowrap uppercase"
              />
            </template>
          </Column>

          <!-- Plantilla de Expansión Móvil -->
          <template #expansion="slotProps">
            <div class="p-3 bg-[#f1f5f0] border-y border-[#e2e8dd] text-sm">
              <div class="bg-white p-3.5 rounded-xl border border-[#e2e8dd] shadow-2xs space-y-2.5">
                <!-- Nombre -->
                <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
                  <span class="text-[10px] font-bold uppercase text-[#6b7280]"
                    >Nombre Completo</span
                  >
                  <span class="text-xs text-[#334155] font-semibold">{{
                    slotProps.data.nombre || slotProps.data.razon_social
                  }}</span>
                </div>

                <!-- N° Documento -->
                <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
                  <span class="text-[10px] font-bold uppercase text-[#6b7280]">N° Documento</span>
                  <span class="font-mono text-xs text-[#2b5e3b] font-bold">{{
                    slotProps.data.numero_documento
                  }}</span>
                </div>

                <!-- Tipo de Persona -->
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-bold uppercase text-[#6b7280]">Tipo Persona</span>
                  <Tag
                    :value="slotProps.data.tipo_persona"
                    :severity="slotProps.data.tipo_persona?.toUpperCase() === 'NATURAL' ? 'info' : 'warn'"
                    class="!text-[10px] !px-2.5 !py-0.5 uppercase"
                  />
                </div>
              </div>

              <!-- Botones Móvil Outlined -->
              <div class="mt-3 flex gap-2 justify-end items-center">
                <Button
                  icon="pi pi-eye"
                  label="Ver Detalles"
                  outlined
                  class="!border-[#2b5e3b] !text-[#2b5e3b] hover:!bg-[#f4f7f2] rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer shadow-2xs flex-1 justify-center"
                  @click="$emit('view-detail', slotProps.data)"
                />

                <Button
                  icon="pi pi-history"
                  label="Historial"
                  outlined
                  class="!border-[#a17923] !text-[#a17923] hover:!bg-[#fefce8] rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer shadow-2xs flex-1 justify-center"
                  @click="$emit('view-history', slotProps.data)"
                />
              </div>
            </div>
          </template>
        </DataTable>
      </div>

      <!-- ======================================================= -->
      <!-- VISTA ESCRITORIO: Tabla Completa Tradicional (>= 1024px)-->
      <!-- ======================================================= -->
      <div class="hidden lg:block w-full overflow-x-auto">
        <DataTable
          :value="cargando ? Array.from({ length: porPagina || 5 }) : clientesFiltrados"
          v-model:filters="filters"
          :globalFilterFields="['nombre', 'numero_documento']"
          responsiveLayout="scroll"
          class="p-datatable-custom text-sm w-full min-w-[50rem]"
          :paginator="!cargando"
          :rows="porPagina"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} clientes"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center py-12 text-gray-400">
              <i class="pi pi-inbox text-[48px] mb-3 text-gray-300" />
              <span class="text-[15px] font-medium">No hay clientes registrados</span>
            </div>
          </template>

          <!-- Tipo de persona -->
          <Column field="tipo_persona" header="Tipo de Persona" class="min-w-[11rem]">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="5.5rem" height="1.5rem" borderRadius="4px" />
              <Tag
                v-else
                :value="slotProps.data.tipo_persona"
               :severity="slotProps.data.tipo_persona?.toUpperCase() === 'NATURAL' ? 'info' : 'warn'"
                rounded
                class="!text-xs !px-2.5 whitespace-nowrap uppercase"
              />
            </template>
          </Column>

          <!-- Nombre -->
          <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f] min-w-[14rem]">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="75%" height="1.2rem" />
              <span v-else class="capitalize block">{{ slotProps.data.nombre || slotProps.data.razon_social }}</span>
            </template>
          </Column>

          <!-- N° Documento -->
          <Column field="numero_documento" header="N° Documento" class="min-w-[11rem]">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="6rem" height="1.2rem" />
              <span
                v-else
                class="font-mono text-xs bg-[#f1f5f0] text-[#334155] px-2 py-0.5 rounded border border-[#e2e8dd] font-bold uppercase"
              >
                {{ slotProps.data.numero_documento }}
              </span>
            </template>
          </Column>

          <!-- Acciones Outlined -->
          <Column header="Acciones" class="w-[8rem] shrink-0 text-center">
            <template #body="slotProps">
              <div class="flex items-center gap-2 justify-center">
                <template v-if="cargando">
                  <Skeleton shape="circle" size="2rem" />
                  <Skeleton shape="circle" size="2rem" />
                </template>

                <template v-else>
                  <Button
                    icon="pi pi-eye"
                    outlined
                    class="!border-[#2b5e3b] !text-[#2b5e3b] hover:!bg-[#f4f7f2] w-8 h-8 rounded-full p-0 transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
                    v-tooltip.top="'Ver detalles'"
                    @click="$emit('view-detail', slotProps.data)"
                  />
                  <Button
                    icon="pi pi-history"
                    outlined
                    class="!border-[#a17923] !text-[#a17923] hover:!bg-[#fefce8] w-8 h-8 rounded-full p-0 transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
                    v-tooltip.top="'Ver historial de compras'"
                    @click="$emit('view-history', slotProps.data)"
                  />
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
import { ref, onMounted, computed } from 'vue'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useClienteStore } from '@/stores/clienteStore'
import { storeToRefs } from 'pinia'
import { mostrarError, mostrarAccesoDenegado } from '@/utils/SweetAlertService'

defineEmits(['view-detail', 'view-history'])

const store = useClienteStore()
const { clientes, cargando, porPagina } = storeToRefs(store)

const expandedRows = ref({})
const tipoPersonaOpciones = ref([
  { label: 'Natural', value: 'NATURAL'},
  {label: 'Juridica', value: 'JURIDICA'},
])

const filters = ref({
  global: { value: null },
  tipo_persona: { value: null },
})

const clientesFiltrados = computed(() => {
  let lista = clientes.value ?? []

  const textoBusqueda = filters.value.global.value?.toLowerCase().trim() || ''
  if (textoBusqueda) {
    lista = lista.filter(
      (c) =>
        c.nombre?.toLowerCase().includes(textoBusqueda) ||
        c.razon_social?.toLowerCase().includes(textoBusqueda) ||
        c.numero_documento?.toLowerCase().includes(textoBusqueda),
    )
  }

  const tipoSeleccionado = filters.value.tipo_persona.value
  if (tipoSeleccionado) {
    lista = lista.filter((c) => c.tipo_persona?.toUpperCase() === tipoSeleccionado)
  }

  return lista
})
onMounted(async () => {
  const resultado = await store.cargarClientes()
  if (resultado?.status === 403) {
    mostrarAccesoDenegado()
  } else if (resultado?.error) {
    mostrarError('Error de conexión', resultado.error)
  }
})
</script>

<style>
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #fbfdf9 !important;
  color: #2b5e3b !important;
  font-weight: 600 !important;
  font-size: 0.8rem !important;
  padding: 0.75rem 1rem !important;
  border-bottom: 1px solid #e2e8dd !important;
  white-space: nowrap !important;
}

.p-datatable-custom .p-datatable-tbody > tr > td {
  padding: 0.75rem 1rem !important;
  font-size: 0.85rem !important;
  border-bottom: 1px solid #f1f5f0 !important;
}

.p-datatable-custom .p-datatable-tbody > tr:hover {
  background-color: #f4f8f3 !important;
}
</style>
