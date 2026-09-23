<template>
  <div class="bg-[#eef2e9] min-h-full p-4 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <!-- Encabezado de la página -->
    <div class="flex items-center gap-3 mb-6">
      <div
        class="!w-[2.5rem] !h-[2.5rem] rounded-xl bg-white border border-[#e2e8dd] shadow-sm flex items-center justify-center shrink-0">
        <i class="pi pi-users text-[#2b5e3b] text-xl"></i>
      </div>
      <div>
        <h1 class="text-[1.75rem] md:text-[2rem] font-bold text-[#1a2e1f] leading-tight m-0">
          Registro de usuarios
        </h1>
        <p class="text-sm text-gray-500 mt-0.5 m-0">Gestión de cuentas, roles y permisos del sistema</p>
      </div>
    </div>

    <!-- Contenedor Principal y Tabla Responsiva -->
    <div class="bg-[#ffffff] rounded-xl overflow-hidden shadow-lg w-full">
      <!-- Regla 3: Contenedor con overflow-x-auto para garantizar scroll horizontal fluido en móvil -->
      <div class="w-full overflow-x-auto">
        <DataTable
          :value="store.users"
          lazy
          :rows="store.perPage"
          paginator
          :totalRecords="store.totalRecords"
          responsiveLayout="scroll"
          class="p-datatable-custom text-sm min-w-[40rem] sm:min-w-full"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
          @page="onPageChange"
        >
          <template #header>
            <div class="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
              <div class="flex flex-col sm:flex-row items-center gap-3 w-full">
                <!-- Búsqueda Mobile-First -->
                <IconField class="w-full sm:w-[20rem]">
                  <InputIcon class="pi pi-search text-[#6b7280]" />
                  <InputText
                    v-model="busqueda"
                    placeholder="Buscar usuario..."
                    class="w-full !bg-white !border-[#cbd5e1] text-[#1a2e1f] text-sm rounded-lg h-[2.625rem]"
                  />
                </IconField>

                <!-- Filtro de Estado Mobile-First -->
                <Select
                  v-model="filtroEstado"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  showClear
                  placeholder="Todos los estados"
                  class="w-full sm:w-[14rem] !bg-white !border-[#cbd5e1] text-[#1a2e1f] text-sm rounded-lg h-[2.625rem] flex items-center"
                />
              </div>

              <!-- Botón de Agregar -->
              <Button
                label="+ Agregar"
                class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold px-7 py-3 rounded-lg border-none cursor-pointer shadow-md transition-all w-full md:w-auto whitespace-nowrap shrink-0"
                @click="$emit('open-add')"
              />
            </div>
          </template>

          <template #empty>
            <div class="text-center py-6 text-[#6b7280] text-sm">
              No hay usuarios registrados.
            </div>
          </template>

          <!-- Columna: Nombre -->
          <Column field="name" header="Nombre" class="font-semibold text-[#1a2e1f]">
            <template #body="slotProps">
              <Skeleton v-if="store.loading" width="60%" height="1.2rem" />
              <span v-else>{{ slotProps.data.name }}</span>
            </template>
          </Column>

          <!-- Columna: Email -->
          <Column field="email" header="Email" class="text-[#4b5563]">
            <template #body="slotProps">
              <Skeleton v-if="store.loading" width="80%" height="1.2rem" />
              <span v-else>{{ slotProps.data.email }}</span>
            </template>
          </Column>

          <!-- Columna: Estado -->
          <Column field="activo" header="Estado">
            <template #body="slotProps">
              <Skeleton v-if="store.loading" width="4rem" height="1.5rem" borderRadius="0.25rem" />
              <span
                v-else
                :class="[
                  'px-3 py-1 rounded text-[0.8125rem] font-semibold uppercase tracking-wide',
                  slotProps.data.activo
                    ? 'bg-[#dff0e0] text-[#2b5e3b]'
                    : 'bg-[#fee2e2] text-[#b91c1c]',
                ]"
              >
                {{ slotProps.data.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </template>
          </Column>

          <!-- Columna: Rol -->
          <Column header="Rol">
            <template #body="slotProps">
              <Skeleton v-if="store.loading" width="50%" height="1.2rem" />
              <span v-else>{{ slotProps.data.roles?.[0]?.name ?? '—' }}</span>
            </template>
          </Column>

          <!-- Columna: Creado por -->
          <Column header="Creado por" class="text-[#4b5563]">
            <template #body="slotProps">
              <Skeleton v-if="store.loading" width="55%" height="1.2rem" />
              <span v-else>{{ slotProps.data.registrado_por?.name ?? '—' }}</span>
            </template>
          </Column>

          <!-- Columna: Fecha -->
          <Column field="created_at" header="Fecha" class="text-[#6b7280]">
            <template #body="slotProps">
              <Skeleton v-if="store.loading" width="5rem" height="1.2rem" />
              <span v-else>
                {{
                  slotProps.data.created_at
                    ? new Date(slotProps.data.created_at).toLocaleDateString('es-SV')
                    : '—'
                }}
              </span>
            </template>
          </Column>

          <!-- Columna: Acciones -->
          <Column header="Acciones" class="text-center w-[11.25rem]">
            <template #body="slotProps">
              <div v-if="store.loading" class="flex gap-2 justify-center">
                <Skeleton width="4rem" height="2rem" borderRadius="0.5rem" />
                <Skeleton width="5rem" height="2rem" borderRadius="0.5rem" />
              </div>
              
              <div v-else class="flex gap-2 justify-center">
                <template v-if="slotProps.data.activo">
                  <Button
                    icon="pi pi-pencil"
                    label="Editar"
                    class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
                    v-tooltip.top="'Editar usuario'"
                    @click="$emit('open-edit', slotProps.data)"
                  />

                  <Button
                    v-if="usuarioActual?.id !== slotProps.data.id"
                    icon="pi pi-eye-slash"
                    label="Desactivar"
                    class="!bg-white hover:!bg-[#fde8e8] !text-[#9c2a2a] !border !border-[#f0c9c9] rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
                    v-tooltip.top="'Desactivar usuario'"
                    @click="confirmarDesactivar(slotProps.data)"
                  />
                </template>
                <span v-else class="text-[#9ca3af] text-sm italic">Inactivo</span>
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
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Skeleton from 'primevue/skeleton' 
import Column from 'primevue/column'
import Swal from 'sweetalert2'
import authService from '@/services/authService'
import { useUserStore } from '@/stores/usuarioStore'

const usuarioActual = authService.getUser()
const store = useUserStore()

const busqueda = ref('')
const filtroEstado = ref(null)

const statusOptions = ref([
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false },
])

const confirmarDesactivar = async (user) => {
  if (usuarioActual?.id === user.id) {
    Swal.fire({
      icon: 'warning',
      title: 'Acción no permitida',
      text: 'No puedes desactivar tu propio usuario.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#2b5e3b',
      customClass: {
        popup: '!rounded-xl !p-4 sm:!p-6',
        confirmButton: '!px-5 !py-2.5 !rounded-lg !text-sm !font-semibold',
      }
    })
    return
  }

  const confirmacion = await Swal.fire({
    icon: 'question',
    title: '¿Desactivar usuario?',
    text: `¿Deseas desactivar a ${user.name}? Esta acción no se puede revertir.`,
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#9c2a2a',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    customClass: {
      popup: '!rounded-xl !p-4 sm:!p-6',
      actions: '!gap-3 flex-col sm:flex-row !w-full sm:!w-auto',
      confirmButton: '!w-full sm:!w-auto !px-5 !py-2.5 !rounded-lg !text-sm !font-semibold',
      cancelButton: '!w-full sm:!w-auto !px-5 !py-2.5 !rounded-lg !text-sm !font-semibold',
    }
  })

  if (!confirmacion.isConfirmed) return

  const resultado = await store.desactivarUsuario(user.id)

  if (resultado?.ok) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Usuario desactivado correctamente',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: resultado?.error || 'No se pudo desactivar el usuario.',
      confirmButtonColor: '#2b5e3b',
      customClass: {
        popup: '!rounded-xl !p-4 sm:!p-6',
        confirmButton: '!px-5 !py-2.5 !rounded-lg !text-sm !font-semibold',
      }
    })
  }
}

onMounted(async () => {})

const usuariosFiltrados = computed(() => {
  return (store.users ?? []).filter((u) => {
    const coincideBusqueda =
      !busqueda.value ||
      u.name?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.value.toLowerCase())

    const coincideEstado =
      filtroEstado.value === null || filtroEstado.value === undefined
        ? true
        : u.activo === filtroEstado.value

    return coincideBusqueda && coincideEstado
  })
})

const onPageChange = async (event) => {
  const page = event.page + 1
  const rows = event.rows
  
  const resultado = await store.fetchUsers(page, rows)
  
  if (resultado?.status === 403) {
    Swal.fire({
      icon: 'error',
      title: 'Sin autorización',
      text: 'No tienes permisos para ver los usuarios.',
      confirmButtonColor: '#2b5e3b',
      customClass: {
        popup: '!rounded-xl !p-4 sm:!p-6',
        confirmButton: '!px-5 !py-2.5 !rounded-lg !text-sm !font-semibold',
      }
    })
  } else if (resultado?.error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: resultado.error,
      confirmButtonColor: '#2b5e3b',
      customClass: {
        popup: '!rounded-xl !p-4 sm:!p-6',
        confirmButton: '!px-5 !py-2.5 !rounded-lg !text-sm !font-semibold',
      }
    })
  }
}

defineEmits(['open-add', 'open-edit'])
</script>

<style>
.p-datatable-custom .p-datatable-header {
  background-color: #ffffff !important;
  border: none !important;
  border-bottom: 0.125rem solid #e2e8dd !important;
  padding: 1.25rem 1.25rem 1rem 1.25rem;
}

.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #ffffff !important;
  color: #1e3a2f !important;
  border-bottom: 0.125rem solid #e2e8dd !important;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.25rem 1rem;
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