<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-[26px] font-semibold tracking-tight !text-black">Registro de usuarios</h1>
        
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
            placeholder="Buscar usuario..."
            class="w-full bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px] focus:ring-1 focus:ring-[#2b5e3b]"
          />
        </IconField>

        <Dropdown
          v-model="filters['status'].value"
          :options="statusOptions"
          showClear
          placeholder="Todos los estados"
          class="w-56 bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px] flex items-center px-2 focus:ring-1 focus:ring-[#2b5e3b]"
        />
      </div>
    </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <DataTable
        :value="users"
        v-model:filters="filters"
        :globalFilterFields="['name', 'role']"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]"
        :paginator="true"
        :rows="5"
        :rowsPerPageOptions="[5,15,20]"
        currentPageReportTemplate="Monstrando {first} a {last} de {totalRecord} ususarios"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
      >
        <Column field="name" header="Nombre" class="font-semibold text-[#1a2e1f]" />
        
        <Column field="email" header="Email" class="text-[#4b5563]" />

        <Column field="status" header="Estado">
          <template #body="slotProps">
            <span
              :class="[
                'px-3 py-1 rounded text-[13px] font-semibold uppercase tracking-wide',
                slotProps.data.status === 'Activo'
                  ? 'bg-[#dff0e0] text-[#2b5e3b]'
                  : 'bg-[#fee2e2] text-[#b91c1c]'
              ]"
            >
              {{ slotProps.data.status }}
            </span>
          </template>
        </Column>

        <Column field="role" header="Rol" />
        <Column field="createdBy" header="Creado por" class="text-[#4b5563]" />
        
        <Column field="date" header="fecha" class="text-[#6b7280]" />

        <Column header="Acciones" class="text-center w-[150px]">
          <template #body="slotProps">
            <div class="flex gap-2 justify-center">
              <Button
                icon="pi pi-pencil"
                class="!bg-[#e0b354] hover:!bg-[#cda03f] border-none text-[#1a2e1f] w-8 h-8 rounded-full p-0 transition-colors shadow-sm"
                @click="editUser(slotProps.data)"
              />
              <Button
                :icon="slotProps.data.visible ? 'pi pi-eye' : 'pi pi-eye-slash'"
                class="bg-[#eef2e9] hover:bg-[#e2e8dd] border border-[#cbd5e1] text-[#1a2e1f] w-8 h-8 rounded-full p-0 transition-colors"
                @click="toggleVisibility(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IconField from 'primevue/iconfield' 
import InputIcon from 'primevue/inputicon' 
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown' 
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const users = ref([
  { id: 1, name: 'Daniel Melgar', email: '@dniel.email.com', status: 'Activo', role: 'Administrador', createdBy: 'Samuel lara', date: '10-02-2025', visible: true },
  { id: 2, name: 'Maria Lopez', email: '@mlopez.email.com', status: 'Activo', role: 'Cajero', createdBy: 'Samuel lara', date: '11-02-2025', visible: true },
  { id: 3, name: 'Carlos Ruiz', email: '@cruiz.email.com', status: 'Inactivo', role: 'Administrador', createdBy: 'Daniel Melgar', date: '12-02-2025', visible: false },
  { id: 4, name: 'Ana Beltrán', email: '@abeltran.email.com', status: 'Activo', role: 'Contador', createdBy: 'Samuel lara', date: '13-02-2025', visible: true },
  { id: 5, name: 'Roberto Sosa', email: '@rsosa.email.com', status: 'Inactivo', role: 'Contador', createdBy: 'Daniel Melgar', date: '14-02-2025', visible: false },
  { id: 6, name: 'Daniel Melgar', email: '@dniel.email.com', status: 'Activo', role: 'Administrador', createdBy: 'Samuel lara', date: '10-02-2025', visible: true },
  { id: 7, name: 'Maria Lopez', email: '@mlopez.email.com', status: 'Activo', role: 'Cajero', createdBy: 'Samuel lara', date: '11-02-2025', visible: true },
  { id: 8, name: 'Carlos Ruiz', email: '@cruiz.email.com', status: 'Inactivo', role: 'Administrador', createdBy: 'Daniel Melgar', date: '12-02-2025', visible: false },
  { id: 9, name: 'Ana Beltrán', email: '@abeltran.email.com', status: 'Activo', role: 'Contador', createdBy: 'Samuel lara', date: '13-02-2025', visible: true },
  { id: 10, name: 'Roberto Sosa', email: '@rsosa.email.com', status: 'Inactivo', role: 'Contador', createdBy: 'Daniel Melgar', date: '14-02-2025', visible: false }
])

const statusOptions = ref(['Activo', 'Inactivo'])

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  status: { value: null, matchMode: 'equals' }
})

const emit = defineEmits(['open-add','open-edit'])

const editUser = (user) => {
  emit('open-edit', user)
}

const toggleVisibility = (user) => {
  user.visible = !user.visible
}
</script>

<style

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


.p-inputtext:enabled:focus, .p-dropdown:not(.p-disabled).p-focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}

.p-dropdown {
  background-color: #ffffff !important;
  border-color: #cbd5e1 !important;
}

.p-dropdown-label {
  color: #1a2e1f !important;
}

.p-dropdown-overlay {
  background-color: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
}

.p-dropdown-item {
  color: #1a2e1f !important;
}

.p-dropdown-item:not(.p-highlight):not(.p-disabled):hover {
  background-color: #eef2e9 !important;
}
</style>