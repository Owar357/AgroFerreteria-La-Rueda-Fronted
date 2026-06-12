<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-[26px] font-semibold tracking-tight !text-black">Registro de usuarios</h1>
        <Button label="+ Agregar"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-7 py-5 rounded-lg border-none cursor-pointer shadow-md transition-all"
          @click="$emit('open-add')" />
      </div>

      <div class="flex justify-start items-center w-full gap-8">
        <IconField class="w-80">
          <InputIcon class="pi pi-search text-[#6b7280]" />
          <InputText v-model="busqueda" placeholder="Buscar usuario..."
            class="w-full bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px]" />
        </IconField>

        <Select v-model="filtroEstado" :options="statusOptions" optionLabel="label" optionValue="value" showClear
          placeholder="Todos los estados"
          class="w-56 bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px] flex items-center" />
      </div>
    </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <DataTable :value="usuariosFiltrados" :loading="store.loading" lazy :paginator="true" :rows="store.perPage"
        :totalRecords="store.totalRecords" responsiveLayout="scroll" class="p-datatable-custom text-[14px]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        @page="onPageChange">
        <template #empty>
          <div class="text-center py-6 text-[#6b7280] text-[14px]">No hay usuarios registrados.</div>
        </template>

        <Column field="name" header="Nombre" class="font-semibold text-[#1a2e1f]" />
        <Column field="email" header="Email" class="text-[#4b5563]" />

        <Column field="activo" header="Estado">
          <template #body="slotProps">
            <span
              :class="['px-3 py-1 rounded text-[13px] font-semibold uppercase tracking-wide', slotProps.data.activo ? 'bg-[#dff0e0] text-[#2b5e3b]' : 'bg-[#fee2e2] text-[#b91c1c]']">
              {{ slotProps.data.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </template>
        </Column>

        <Column header="Rol">
          <template #body="slotProps">{{ slotProps.data.roles?.[0]?.name ?? '—' }}</template>
        </Column>

        <Column header="Creado por" class="text-[#4b5563]">
          <template #body="slotProps">{{ slotProps.data.registrado_por?.name ?? '—' }}</template>
        </Column>

        <Column field="created_at" header="Fecha" class="text-[#6b7280]">
          <template #body="slotProps">
            {{ slotProps.data.created_at ? new Date(slotProps.data.created_at).toLocaleDateString('es-SV') : '—' }}
          </template>
        </Column>


        <Column header="Acciones" class="text-center w-[180px]">
          <template #body="slotProps">
            <div class="flex gap-2 justify-center">
              <Button icon="pi pi-pencil" label="Editar"
                class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
                v-tooltip.top="'Editar categoría'" @click="$emit('open-edit', slotProps.data)" />

              <Button :icon="slotProps.data.activo ? 'pi pi-eye-slash' : 'pi pi-eye'"
                :label="slotProps.data.activo ? 'Desactivar' : 'Activar'" :class="slotProps.data.activo
                  ? '!bg-white hover:!bg-[#fde8e8] !text-[#9c2a2a] !border !border-[#f0c9c9]'
                  : '!bg-white hover:!bg-[#eef2e9] !text-[#2b5e3b] !border !border-[#cfe0d2]'"
                class="rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
                v-tooltip.top="slotProps.data.activo ? 'Desactivar' : 'Activar'"
                @click="toggleVisibility(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useUserStore } from '@/stores/usuarioStore'

const store = useUserStore()

const busqueda = ref('')
const filtroEstado = ref(null)

const statusOptions = ref([
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false }
])

// Filtro local sobre los registros de la página actual
const usuariosFiltrados = computed(() => {
  return store.users.filter(u => {
    const coincideBusqueda = !busqueda.value ||
      u.name?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.value.toLowerCase())

    const coincideEstado = filtroEstado.value === null || filtroEstado.value === undefined
      ? true
      : u.activo === filtroEstado.value

    return coincideBusqueda && coincideEstado
  })
})

// Cuando PrimeVue cambia de página llama al backend
const onPageChange = (event) => {
  const page = event.page + 1        // PrimeVue empieza en 0
  const perPage = event.rows
  store.fetchUsers(page, perPage)
}

defineEmits(['open-add', 'open-edit'])

const toggleVisibility = (user) => { user.activo = !user.activo }
</script>

<style>
.p-datatable-custom .p-datatable-thead>tr>th {
  background-color: #ffffff !important;
  color: #1e3a2f !important;
  border-bottom: 2px solid #e2e8dd !important;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.25rem 1rem;
}

.p-datatable-custom .p-datatable-tbody>tr {
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border-bottom: 1px solid #e2e8dd !important;
}

.p-datatable-custom .p-datatable-tbody>tr:hover {
  background-color: #f4f7f2 !important;
}

.p-inputtext:enabled:focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>