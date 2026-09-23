<template>
  <div class="bg-[#eef2e9] min-h-screen p-4 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <!-- ENCABEZADO DE MÓDULO UNIFICADO -->
    <div class="flex items-center gap-3 mb-6">
      <div
        class="!w-10 !h-10 rounded-xl bg-white border border-[#e2e8dd] shadow-sm flex items-center justify-center shrink-0">
        <i class="pi pi-users text-[#2b5e3b] text-xl"></i>
      </div>
      <div>
        <h1 class="text-[1.75rem] md:text-[2rem] font-bold text-[#1a2e1f] leading-tight m-0">
          Registro de Proveedores
        </h1>
        <p class="text-sm text-gray-500 mt-0.5 m-0">Gestión de contactos, directorio y comerciales</p>
      </div>
    </div>

    <!-- TARJETA CONTENEDORA PRINCIPAL -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm overflow-hidden w-full">

      <!-- APARTADO DE FILTROS ESTÁTICO SUPERIOR -->
      <div class="p-4 sm:p-5 border-b border-[#e2e8dd] bg-[#fbfdf9]">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          
          <div class="flex flex-col sm:flex-row items-center gap-3 w-full">
            <!-- Búsqueda Responsiva -->
            <IconField class="w-full sm:w-[20rem] lg:w-[30rem]">
              <InputIcon class="pi pi-search text-gray-400 text-sm" />
              <InputText 
                v-model="filters['global'].value" 
                placeholder="Buscar por nombre o correo..."
                class="w-full !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-[2.625rem] focus:!border-[#2b5e3b]" 
              />
            </IconField>

            <!-- Selector de Estado -->
            <Select 
              v-model="filtroEstado" 
              :options="estadoOptions" 
              optionLabel="label" 
              optionValue="value" 
              showClear
              placeholder="Todos los estados"
              class="w-full sm:w-[13.75rem] !bg-white !border-gray-300 text-[#1a2e1f] text-sm rounded-xl h-[2.625rem] flex items-center px-2 focus:!border-[#2b5e3b]" 
            />
          </div>

          <!-- Botón Agregar Proveedor -->
          <Button 
            label="Agregar Proveedor" 
            icon="pi pi-plus"
            class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold px-6 h-[2.625rem] rounded-xl border-none cursor-pointer shadow-sm transition-all w-full md:w-auto whitespace-nowrap flex justify-center items-center gap-2 shrink-0"
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
          :value="loading ? Array.from({ length: 5 }) : proveedoresFiltrados" 
          :lazy="false"
          :totalRecords="totalProveedores" 
          v-model:filters="filters" 
          :globalFilterFields="['nombre', 'correo']"
          dataKey="id"
          class="p-datatable-custom text-sm w-full" 
          :paginator="!loading" 
          :rows="7"
          currentPageReportTemplate="{first}-{last} de {totalRecords}"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center py-8 text-gray-400">
              <i class="pi pi-inbox text-3xl mb-2 opacity-40" />
              <span class="text-sm font-medium">No hay proveedores registrados</span>
            </div>
          </template>

      
          <Column expander style="width: 2.5rem" />

          <!-- Columna: Nombre -->
          <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f]">
            <template #body="slotProps">
              <Skeleton v-if="loading" width="70%" height="1.2rem" />
              <span v-else class="capitalize block leading-tight">{{ slotProps.data.nombre }}</span>
            </template>
          </Column>

          <!-- Columna: Estado -->
          <Column field="estado" header="Estado">
            <template #body="slotProps">
              <Skeleton v-if="loading" width="4rem" height="1.4rem" borderRadius="20px" />
              <Tag 
                v-else 
                :value="slotProps.data.activo ? 'ACTIVO' : 'INACTIVO'"
                :severity="slotProps.data.activo ? 'success' : 'danger'" 
                rounded 
                class="!text-[10px] !px-2 py-0.5 whitespace-nowrap" 
              />
            </template>
          </Column>

          <!-- Plantilla de Expansión (Móvil) -->
          <template #expansion="slotProps">
            <div class="p-4 bg-[#f8faf7] border-y border-[#e2e8dd] text-sm">
              <div class="grid grid-cols-2 gap-x-4 gap-y-3 bg-white p-3.5 rounded-lg border border-[#e2e8dd] shadow-xs">
                
                <!-- Correo (2 columnas) -->
                <div class="col-span-2">
                  <span class="text-[0.7rem] font-bold tracking-wider uppercase text-gray-500 block mb-0.5">
                    Correo
                  </span>
                  <span class="text-gray-800 font-medium break-all block">
                    {{ slotProps.data.correo || '—' }}
                  </span>
                </div>

                <!-- Teléfono (2 columnas) -->
                <div class="col-span-2 pt-1 border-t border-gray-100">
                  <span class="text-[0.7rem] font-bold tracking-wider uppercase text-gray-500 block mb-0.5">
                    Teléfono
                  </span>
                  <span class="text-gray-800 font-mono font-medium block">
                    {{ slotProps.data.telefono || '—' }}
                  </span>
                </div>
              </div>

              <!-- Botones de Acción Móvil -->
              <div class="mt-3 pt-2 flex gap-2 justify-end items-center flex-wrap">
                <template v-if="slotProps.data.activo">
                  <Button 
                    icon="pi pi-pencil" 
                    label="Editar"
                    class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                    @click="handleEdit(slotProps.data)" 
                  />

                  <Button 
                    icon="pi pi-eye" 
                    label="Ver"
                    class="!bg-white hover:!bg-[#eef2e9] !text-[#1e3a2f] !border !border-[#cfe0d2] rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                    @click="handleDetail(slotProps.data)" 
                  />

                  <Button 
                    icon="pi pi-ban" 
                    label="Desactivar"
                    class="!bg-white hover:!bg-[#fde8e8] !text-[#9c2a2a] !border !border-[#f0c9c9] rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                    @click="confirmarDesactivar(slotProps.data)" 
                  />
                </template>

                <template v-else>
                  <Button 
                    icon="pi pi-eye" 
                    label="Ver"
                    class="!bg-white hover:!bg-[#eef2e9] !text-[#1e3a2f] !border !border-[#cfe0d2] rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                    @click="handleDetail(slotProps.data)" 
                  />
                </template>
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
          :value="loading ? Array.from({ length: 5 }) : proveedoresFiltrados" 
          :lazy="false"
          :totalRecords="totalProveedores" 
          v-model:filters="filters" 
          :globalFilterFields="['nombre', 'correo']"
          responsiveLayout="scroll" 
          class="p-datatable-custom text-sm w-full min-w-[50rem]" 
          :paginator="!loading" 
          :rows="7"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} proveedores"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center py-12 text-gray-400">
              <i class="pi pi-inbox text-[48px] mb-3 text-gray-300" />
              <span class="text-[15px] font-medium">No hay proveedores registrados</span>
            </div>
          </template>

          <!-- Columna: Nombre -->
          <Column field="nombre" header="Nombre" class="font-semibold text-[#1a2e1f] min-w-[12rem]">
            <template #body="slotProps">
              <Skeleton v-if="loading" width="70%" height="1.2rem" />
              <span v-else class="capitalize block">{{ slotProps.data.nombre }}</span>
            </template>
          </Column>

          <!-- Columna: Correo -->
          <Column field="correo" header="Correo" class="text-gray-600 min-w-[12rem]">
            <template #body="slotProps">
              <Skeleton v-if="loading" width="80%" height="1.2rem" />
              <span v-else>{{ slotProps.data.correo || '—' }}</span>
            </template>
          </Column>

          <!-- Columna: Teléfono -->
          <Column field="telefono" header="Teléfono" class="text-gray-600 font-mono min-w-[8.5rem]">
            <template #body="slotProps">
              <Skeleton v-if="loading" width="50%" height="1.2rem" />
              <span v-else class="whitespace-nowrap">{{ slotProps.data.telefono || '—' }}</span>
            </template>
          </Column>

          <!-- Columna: Estado -->
          <Column field="estado" header="Estado" class="min-w-[7rem]">
            <template #body="slotProps">
              <Skeleton v-if="loading" width="5rem" height="1.4rem" borderRadius="20px" />
              <Tag 
                v-else 
                :value="slotProps.data.activo ? 'ACTIVO' : 'INACTIVO'"
                :severity="slotProps.data.activo ? 'success' : 'danger'" 
                rounded 
                class="!text-xs !px-2.5 whitespace-nowrap" 
              />
            </template>
          </Column>

          <!-- Columna: Acciones -->
          <Column header="Acciones" class="w-[14rem] shrink-0">
            <template #body="slotProps">
              <div class="flex items-center gap-1.5 justify-end whitespace-nowrap">
                <template v-if="loading">
                  <Skeleton width="4.5rem" height="2rem" borderRadius="8px" />
                  <Skeleton width="3.5rem" height="2rem" borderRadius="8px" />
                </template>

                <template v-else>
                  <template v-if="slotProps.data.activo">
                    <Button 
                      icon="pi pi-pencil" 
                      label="Editar"
                      class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                      v-tooltip.top="'Editar proveedor'" 
                      @click="handleEdit(slotProps.data)" 
                    />

                    <Button 
                      icon="pi pi-eye" 
                      label="Ver"
                      class="!bg-white hover:!bg-[#eef2e9] !text-[#1e3a2f] !border !border-[#cfe0d2] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                      v-tooltip.top="'Ver detalles'" 
                      @click="handleDetail(slotProps.data)" 
                    />

                    <Button 
                      icon="pi pi-ban" 
                      label="Desactivar"
                      class="!bg-white hover:!bg-[#fde8e8] !text-[#9c2a2a] !border !border-[#f0c9c9] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                      v-tooltip.top="'Desactivar proveedor'" 
                      @click="confirmarDesactivar(slotProps.data)" 
                    />
                  </template>

                  <template v-else>
                    <Button 
                      icon="pi pi-eye" 
                      label="Ver"
                      class="!bg-white hover:!bg-[#eef2e9] !text-[#1e3a2f] !border !border-[#cfe0d2] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                      v-tooltip.top="'Ver detalles'" 
                      @click="handleDetail(slotProps.data)" 
                    />
                  </template>
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
import { Select } from 'primevue'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useProveedorStore } from '@/stores/proveedorStore'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'

const emit = defineEmits(['open-add', 'open-edit', 'open-detail'])

const store = useProveedorStore()
const { proveedores, cargando: loading, totalRecords: totalProveedores } = storeToRefs(store)

const expandedRows = ref({})

const estadoOptions = ref([
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false },
])

const filtroEstado = ref(null)

const filters = ref({
  global: { value: null, matchMode: 'contains' },
})

const proveedoresFiltrados = computed(() => {
  const lista = proveedores.value ?? []

  return lista.filter((p) => {
    const textoBusqueda = filters.value.global.value?.toLowerCase() || ''
    const coincideBusqueda =
      !textoBusqueda ||
      p.nombre?.toLowerCase().includes(textoBusqueda) ||
      p.correo?.toLowerCase().includes(textoBusqueda)

    const coincideEstado =
      filtroEstado.value === null || filtroEstado.value === undefined
        ? true
        : p.activo === filtroEstado.value

    return coincideBusqueda && coincideEstado
  })
})

onMounted(async () => {
  const resultado = await store.cargarProveedores()
  if (resultado?.status === 403) {
    Swal.fire({
      html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
          <div style="width:56px; height:56px; border-radius:50%; background:#fee2e2; display:flex; align-items:center; justify-content:center;">
            <i class="pi pi-ban" style="font-size:24px; color:#b91c1c;"></i>
          </div>
          <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">Sin autorización</h3>
          <p style="font-size:14px; color:#6b7280; margin:0;">No tienes permisos para ver los proveedores.</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonColor: '#2b5e3b',
      confirmButtonText: 'Entendido',
      customClass: {
        confirmButton: '!rounded-lg !font-semibold !text-sm',
        popup: '!rounded-2xl',
      },
    })
  } else if (resultado?.error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: resultado.error,
      confirmButtonColor: '#2b5e3b',
    })
  }
})

const handleEdit = (proveedor) => emit('open-edit', proveedor)
const handleDetail = (proveedor) => emit('open-detail', proveedor)

const confirmarDesactivar = async (proveedor) => {
  const confirmacion = await Swal.fire({
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
        <div style="width:56px; height:56px; border-radius:50%; background:#fee2e2; display:flex; align-items:center; justify-content:center;">
          <i class="pi pi-ban" style="font-size:24px; color:#b91c1c;"></i>
        </div>
        <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">Desactivar proveedor</h3>
        <p style="font-size:14px; color:#6b7280; margin:0;">
          ¿Estás seguro de que deseas desactivar a
          <strong style="color:#1e3a2f;">${proveedor.nombre}</strong>? Esta acción no se puede revertir.
        </p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonColor: '#b91c1c',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: '!rounded-lg !font-semibold !text-sm',
      cancelButton: '!rounded-lg !font-semibold !text-sm',
      popup: '!rounded-2xl',
    },
  })

  if (!confirmacion.isConfirmed) return

  const resultado = await store.desactivarProveedor(proveedor.id)

  if (resultado.ok) {
    Swal.fire({
      icon: 'success',
      title: 'Proveedor desactivado',
      text: `"${proveedor.nombre}" ha sido desactivado.`,
      confirmButtonColor: '#2b5e3b',
      timerProgressBar: true,
    })
  } else if (resultado.status === 403) {
    Swal.fire({
      html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
          <div style="width:56px; height:56px; border-radius:50%; background:#fee2e2; display:flex; align-items:center; justify-content:center;">
            <i class="pi pi-ban" style="font-size:24px; color:#b91c1c;"></i>
          </div>
          <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">Sin autorización</h3>
          <p style="font-size:14px; color:#6b7280; margin:0;">No tienes permisos para realizar esta acción.</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonColor: '#2b5e3b',
      confirmButtonText: 'Entendido',
      customClass: {
        confirmButton: '!rounded-lg !font-semibold !text-sm',
        popup: '!rounded-2xl',
      },
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: resultado.error,
      confirmButtonColor: '#2b5e3b',
    })
  }
}
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

.p-inputtext:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>