<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <!-- Encabezado -->
    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-[26px] font-semibold tracking-tight !text-black">Historial de clientes</h1>
      </div>

      <div class="flex flex-wrap justify-start items-center w-full gap-4">
        <IconField class="w-80">
          <InputIcon class="pi pi-search text-[#6b7280]" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Buscar por nombre o N° documento..."
            class="w-full bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px]"
          />
        </IconField>

        <Select
          v-model="filters['tipo_persona'].value"
          :options="tipoPersonaOpciones"
          showClear
          placeholder="Tipo de persona"
          class="w-52 bg-[#ffffff] border-[#cbd5e1] text-[14px] rounded-lg h-[42px] flex items-center px-2"
        />
      </div>
    </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <!-- 🔄 Si cargando es true, pasamos un array de filas simuladas y ocultamos la paginación -->
      <DataTable
        :value="cargando ? Array.from({ length: porPagina || 5 }) : clientesFiltrados"
        v-model:filters="filters"
        :globalFilterFields="['nombre', 'numero_documento']"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]"
        :paginator="!cargando"
        :rows="porPagina"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} clientes"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      >
        <template #empty>
          <div class="text-center py-6 text-[#6b7280] text-[14px]">No hay clientes registrados.</div>
        </template>

        <!-- Columna: Tipo de persona -->
        <Column field="tipo_persona" header="Tipo de persona">
          <template #body="slotProps">
            <Skeleton v-if="cargando" width="5.5rem" height="1.5rem" borderRadius="4px" />
            <span
              v-else
              :class="slotProps.data.tipo_persona === 'Natural'
                ? 'bg-[#dbeafe] text-[#1d4ed8]'
                : 'bg-[#fef9ec] text-[#cda03f]'"
              class="px-3 py-1 rounded text-[12px] font-semibold uppercase tracking-wide inline-flex items-center gap-1"
            >
              <i :class="slotProps.data.tipo_persona === 'Natural' ? 'pi pi-user' : 'pi pi-building'" class="text-[11px]" />
              {{ slotProps.data.tipo_persona }}
            </span>
          </template>
        </Column>

        <!-- Columna: Nombre -->
        <Column field="nombre" header="Nombre">
          <template #body="slotProps">
            <Skeleton v-if="cargando" width="75%" height="1.2rem" />
            <span v-else class="font-semibold text-[#1a2e1f]">{{ slotProps.data.nombre }}</span>
          </template>
        </Column>

        <!-- Columna: N° Documento -->
        <Column field="numero_documento" header="N° Documento">
          <template #body="slotProps">
            <Skeleton v-if="cargando" width="6rem" height="1.2rem" />
            <span v-else class="font-mono text-[13px] text-[#2b5e3b] font-semibold">{{ slotProps.data.numero_documento }}</span>
          </template>
        </Column>

        <!-- Columna: Acciones -->
        <Column header="Acciones" class="text-center w-[130px]">
          <template #body="slotProps">
            <div class="flex gap-2 justify-center">
              <!-- Skeletons simétricos imitando las formas de tus dos botones -->
              <template v-if="cargando">
                <Skeleton shape="circle" size="2.2rem" />
                <Skeleton width="2.2rem" height="2.2rem" borderRadius="8px" />
              </template>
              
              <template v-else>
                <!-- Nota: Corregido un pequeño typo de tu clase original 'h-9mrounded-full' a 'h-9 rounded-full' -->
                <Button
                  icon="pi pi-eye"
                  v-tooltip.top="'Ver detalles'"
                  class="!bg-[#2b5e3b] hover:!bg-[#3f5c43] border-none text-white w-9 h-9 rounded-full p-0 transition-colors shadow-sm"
                  @click="$emit('view-detail', slotProps.data)"
                />
                <Button
                  icon="pi pi-history"
                  v-tooltip.top="'Ver historial de compras'"
                  class="!bg-[#a17923] hover:!bg-[#91843d] !text-[#ffffff] !border-none w-9 h-9 rounded-lg p-0 transition-all duration-200 shadow-md"
                  @click="$emit('view-history', slotProps.data)"
                />
              </template>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue' // 👈 Importamos computed
import IconField             from 'primevue/iconfield'
import InputIcon             from 'primevue/inputicon'
import InputText             from 'primevue/inputtext'
import Select                from 'primevue/select'
import Button                from 'primevue/button'
import Skeleton              from 'primevue/skeleton'
import DataTable             from 'primevue/datatable'
import Column                from 'primevue/column'
import { useClienteStore }   from '@/stores/clienteStore'
import { storeToRefs }       from 'pinia'

defineEmits(['view-detail', 'view-history'])

const store = useClienteStore()
const { clientes, cargando, porPagina } = storeToRefs(store)

const tipoPersonaOpciones = ref(['Natural', 'Jurídica'])


const filters = ref({
  global:       { value: null },
  tipo_persona: { value: null },
})


const clientesFiltrados = computed(() => {
  let lista = clientes.value ?? []

 
  const textoBusqueda = filters.value.global.value?.toLowerCase().trim() || ''
  if (textoBusqueda) {
    lista = lista.filter((c) => 
      c.nombre?.toLowerCase().includes(textoBusqueda) ||
      c.numero_documento?.toLowerCase().includes(textoBusqueda)
    )
  }

  
  const tipoSeleccionado = filters.value.tipo_persona.value
  if (tipoSeleccionado) {
    lista = lista.filter((c) => c.tipo_persona === tipoSeleccionado)
  }

  return lista
})

onMounted(() => store.cargarClientes())
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
.p-inputtext:enabled:focus,
.p-dropdown:not(.p-disabled).p-focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>