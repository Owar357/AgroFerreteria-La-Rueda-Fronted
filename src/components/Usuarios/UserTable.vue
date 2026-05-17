<template>
  <div class="bg-[#111311] min-h-screen p-8 text-[#EAEAEA] font-[Poppins]">

    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-[32px] font-bold popins tracking-tight text-white">Registro de usuarios</h1>
        
        <Button
          label="+ Agregar"
          class="!bg-[#074e09] hover:bg-[#4A8C3F] text-white text-[20px] px-7 py-4 rounded-lg border-none popins font-bold cursor-pointer"
          @click="$emit('open-add')"
        />
      </div>

      <div class="flex justify-start items-center w-full gap-8">
        
        <IconField class="w-80">
          <InputIcon class="pi pi-search text-[#B0B0B0]" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Buscar usuario..."
            class="w-full bg-[#323232] border-[#444] text-[#EAEAEA] text-[18px] rounded-lg focus:ring-1 focus:ring-[#4A8C3F]"
          />
        </IconField>

        <Dropdown
          v-model="filters['status'].value"
          :options="statusOptions"
          showClear
          placeholder="Todos los estados"
          class="w-56 bg-[#323232] border-[#444] text-[#EAEAEA] text-[18px] rounded-lg h-[46px] flex items-center px-2 focus:ring-1 focus:ring-[#4A8C3F]"
        />
      </div>
    </div>

    <div class="bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333] shadow-2xl">
      <DataTable
        :value="users"
        v-model:filters="filters"
        :globalFilterFields="['name', 'role']"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[18px]"
      >
        <Column field="name" header="Nombre" class="popins font-semibold" />
        <Column field="email" header="Email" />

        <Column field="status" header="Estado">
          <template #body="slotProps">
            <span
              :class="[
                'px-4 py-1 rounded text-[14px] font-bold popins uppercase',
                slotProps.data.status === 'Activo'
                  ? 'bg-[#3e7a33] text-white'
                  : 'bg-[#7a3333] text-white'
              ]"
            >
              {{ slotProps.data.status }}
            </span>
          </template>
        </Column>

        <Column field="role" header="Rol" />
        <Column field="createdBy" header="Creado por" />
        <Column field="date" header="fecha" />

        <Column header="Aciones" class="text-center w-\[150px]">
          <template #body="slotProps">
            <div class="flex gap-2 justify-center">
              <Button
                icon="pi pi-pencil"
                class="!bg-[#f59e0b] hover:bg-[#d97706] border-none text-white w-8 h-8 rounded-full p-0"
                @click="editUser(slotProps.data)"
              />
              <Button
                :icon="slotProps.data.visible ? 'pi pi-eye' : 'pi pi-eye-slash'"
                class="bg-[#121212] hover:bg-[#222] border border-[#444] text-white w-8 h-8 rounded-full p-0"
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
import IconField from 'primevue/iconfield' // Requerido en v4
import InputIcon from 'primevue/inputicon' // Requerido en v4
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown' // Corregido minúscula
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const users = ref([
  { id: 1, name: 'Daniel Melgar', email: '@dniel.email.com', status: 'Activo', role: 'Administrador', createdBy: 'Samuel lara', date: '10-02-2025', visible: true },
  { id: 2, name: 'Maria Lopez', email: '@mlopez.email.com', status: 'Activo', role: 'Cajero', createdBy: 'Samuel lara', date: '11-02-2025', visible: true },
  { id: 3, name: 'Carlos Ruiz', email: '@cruiz.email.com', status: 'Inactivo', role: 'Administrador', createdBy: 'Daniel Melgar', date: '12-02-2025', visible: false },
  { id: 4, name: 'Ana Beltrán', email: '@abeltran.email.com', status: 'Activo', role: 'Contador', createdBy: 'Samuel lara', date: '13-02-2025', visible: true },
  { id: 5, name: 'Roberto Sosa', email: '@rsosa.email.com', status: 'Inactivo', role: 'Contador', createdBy: 'Daniel Melgar', date: '14-02-2025', visible: false }
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

<style>
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #1a1a1a !important;
  color: #fff !important;
  border-bottom: 1px solid #333 !important;
  font-style: italic;
  font-weight: 600;
  padding: 1.25rem 1rem;
}

.p-datatable-custom .p-datatable-tbody > tr {
  background-color: #1a1a1a !important;
  color: #ccc !important;
  border-bottom: 1px solid #222 !important;
}

.p-datatable-custom .p-datatable-tbody > tr:hover {
  background-color: #242424 !important;
}

.p-inputtext:enabled:focus, .p-dropdown:not(.p-disabled).p-focus {
  box-shadow: none !important;
  border-color: #4A8C3F !important;
}
</style>