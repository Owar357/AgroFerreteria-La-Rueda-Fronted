<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <div class="flex flex-col mb-8 gap-4">
      <div class="flex justify-between items-center w-full">
        <h1 class="text-[26px] font-semibold tracking-tight !text-black">
          Registro de Proveedores
        </h1>

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
            placeholder="Buscar por nombre..."
            class="w-full bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px] focus:ring-1 focus:ring-[#2b5e3b]"
          />
        </IconField>

        <Dropdown
          v-model="filters['estado'].value"
          :options="estadoOptions"
          showClear
          placeholder="Todos los estados"
          class="w-56 bg-[#ffffff] border-[#cbd5e1] text-[#1a2e1f] text-[14px] rounded-lg h-[42px] flex items-center px-2 focus:ring-1 focus:ring-[#2b5e3b]"
        />
      </div>
    </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg">
      <DataTable
        :value="proveedores"
        :lazy="false"
        :totalRecords="totalProveedores"
        v-model:filters="filters"
        :globalFilterFields="['nombre', 'correo']"
        responsiveLayout="scroll"
        class="p-datatable-custom text-[14px]"
        :paginator="true"
        :rows="7"
        @page="onPage($event)"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} proveedores"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      >
        <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f] capitalize" />

        <Column field="correo" header="Correo" class="text-[#4b5563]" />

        <Column field="telefono" header="Teléfono" class="text-[#4b5563]" />

        <Column field="estado" header="Estado">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.estado === 'Activo' ? 'ACTIVO' : 'INACTIVO'"
              :severity="slotProps.data.estado === 'Activo' ? 'success' : 'danger'"
              rounded
            />
          </template>
        </Column>

        <Column header="Acciones">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                label="Editar"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip="'Editar proveedor'"
                @click="handleEdit(slotProps.data)"
              />
              <Button
                icon="pi pi-eye"
                label="Ver"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip="'Ver detalles'"
                @click="handleDetail(slotProps.data)"
              />
              <Button
                :label="slotProps.data.estado === 'Activo' ? 'Desactivar' : 'Activar'"
                :icon="slotProps.data.estado === 'Activo' ? 'pi pi-ban' : 'pi pi-check-circle'"
                :severity="slotProps.data.estado === 'Activo' ? 'danger' : 'success'"
                text
                rounded
                size="small"
                v-tooltip="
                  slotProps.data.estado === 'Activo' ? 'Desactivar proveedor' : 'Activar proveedor'
                "
                @click="toggleEstado(slotProps.data)"
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
import { Select } from 'primevue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const emit = defineEmits(['open-add', 'open-edit', 'open-detail', 'update-estado'])

const proveedores = ref([
  {
    id: 1,
    nombre: 'Proveedor Alfa',
    correo: 'alfa@mail.com',
    telefono: '7777-7777',
    estado: 'Activo',
  },
  {
    id: 2,
    nombre: 'Proveedor Beta',
    correo: 'beta@mail.com',
    telefono: '2222-2222',
    estado: 'Inactivo',
  },
  {
    id: 3,
    nombre: 'Proveedor Gamma',
    correo: 'gamma@mail.com',
    telefono: '3333-3333',
    estado: 'Activo',
  },
  {
    id: 4,
    nombre: 'Proveedor Delta',
    correo: 'delta@mail.com',
    telefono: '4444-4444',
    estado: 'Activo',
  },
   {
    id: 5,
    nombre: 'Proveedor Alianza',
    correo: 'Alianza@mail.com',
    telefono: '5678-0089',
    estado: 'Activo',
  },
  {
    id: 6,
    nombre: 'Proveedor Gamma',
    correo: 'gamma@mail.com',
    telefono: '3333-3333',
    estado: 'Activo',
  },
  {
    id: 7,
    nombre: 'Proveedor Gamma',
    correo: 'gamma@mail.com',
    telefono: '3333-3333',
    estado: 'Activo',
  },
  {
    id: 8,
    nombre: 'Proveedor Gamma',
    correo: 'gamma@mail.com',
    telefono: '3333-3333',
    estado: 'Activo',
  },
   {
    id: 9,
    nombre: 'Proveedor Barzil',
    correo: 'Barzil@mail.com',
    telefono: '7809-6654',
    estado: 'inactivo',
  },
   {
    id: 10,
    nombre: 'Proveedor ALianza',
    correo: 'Alianza@mail.com',
    telefono: '1276-5467',
    estado: 'inactivo',
  },
])

const totalProveedores = ref(4)

const estadoOptions = ref(['Activo', 'Inactivo'])

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  estado: { value: null, matchMode: 'equals' },
})

const handleEdit = (proveedor) => emit('open-edit', proveedor)
const handleDetail = (proveedor) => emit('open-detail', proveedor)

const toggleEstado = (proveedor) => {
  proveedor.estado = proveedor.estado === 'Activo' ? 'Inactivo' : 'Activo'
  emit('update-estado', proveedor)
}
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
