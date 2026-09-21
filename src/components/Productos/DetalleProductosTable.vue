<template>
  <div class="bg-[#eef2e9] min-h-screen p-6 mx-auto font-['Inter',sans-serif]">
    <!-- BOTÓN VOLVER MODERADO -->
    <div class="flex items-center justify-between mb-4">
      <Button icon="pi pi-arrow-left" label="Volver a productos" severity="secondary" text
        class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white !px-4 !py-2 !rounded-xl transition-all duration-200 cursor-pointer text-sm font-semibold"
        @click="volver" />
    </div>

    <!-- TARJETA CABECERA PRODUCTO (BALANCEADA) -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-5 mb-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl font-bold text-[#1a2e1f] capitalize leading-tight">{{ producto.nombre }}</h1>
            <span class="bg-[#2b5e3b]/10 text-[#2b5e3b] text-xs font-bold px-2.5 py-1 rounded-md uppercase font-mono tracking-wider">
              {{ producto.codigo }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-500">
            <span>Categoría: <strong class="text-gray-800 capitalize">{{ producto.categoria }}</strong></span>
            <span class="hidden sm:inline text-gray-300">•</span>
            <span>Fabricante: <strong class="text-gray-800 capitalize">{{ producto.fabricante }}</strong></span>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTENEDOR UNIFICADO (PESTAÑAS + TABLA) -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm overflow-hidden">
      <Tabs value="0">
        <!-- TABS NAV INTEGRADO -->
        <TabList class="bg-[#fbfdf9] border-b border-[#e2e8dd] px-4 pt-2">
          <Tab value="0" class="!text-[#1a2e1f] font-semibold flex items-center gap-2 px-4 py-3 cursor-pointer text-sm">
            <i class="pi pi-box text-[#e0b354]"></i> Presentaciones
          </Tab>
          <Tab value="1" class="!text-[#1a2e1f] font-semibold flex items-center gap-2 px-4 py-3 cursor-pointer text-sm">
            <i class="pi pi-history text-[#2b5e3b]"></i> Historial Kardex
          </Tab>
        </TabList>

        <TabPanels class="!bg-white !p-6">
          <!-- PESTAÑA 1: PRESENTACIONES -->
          <TabPanel value="0">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
              <div>
                <h2 class="text-lg font-bold text-[#1a2e1f] flex items-center gap-2 m-0">
                  <i class="pi pi-box text-[#e0b354]"></i> Presentaciones Registradas
                </h2>
                <p class="text-xs text-gray-500 m-0 mt-0.5">Gestión de unidades de venta y empaques</p>
              </div>
              <Button
                class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white text-sm font-semibold !px-4 !py-2.5 !rounded-xl !border-none shadow-sm transition-all duration-200 cursor-pointer"
                label="Agregar presentación" icon="pi pi-plus" @click="abrirAñadir()" />
            </div>

            <div class="border border-[#e2e8dd] rounded-xl overflow-hidden shadow-xs">
              <DataTable :value="presentaciones" responsiveLayout="scroll" class="p-datatable-sm">
                <Column field="nombre" header="Nombre" class="text-sm font-medium text-gray-800 capitalize"></Column>
                <Column header="Equivalencia" class="text-sm text-gray-600">
                  <template #body="{ data }">
                    <span class="font-mono text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {{ data.factor_conversion }} {{ data.unidadMedida?.nombre || '—' }}
                    </span>
                  </template>
                </Column>
                <Column field="precio" header="Precio" class="text-sm font-semibold text-gray-800">
                  <template #body="{ data }"> ${{ formatNumber(data.precio) }} </template>
                </Column>
                <Column field="stock" header="Stock" class="text-sm text-gray-700">
                  <template #body="{ data }"> {{ data.stock }} </template>
                </Column>
                <Column field="estado" header="Estado" class="text-sm">
                  <template #body="{ data }">
                    <Tag :value="data.estado" :severity="data.estado === 'ACTIVO' ? 'success' : 'danger'" rounded class="!text-xs !px-2.5" />
                  </template>
                </Column>

                <!-- ACCIONES COMPACTAS Y BALANCEADAS -->
                <Column header="Acciones" :exportable="false" class="text-sm">
                  <template #body="{ data }">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <Button icon="pi pi-pencil" label="Editar"
                        class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer"
                        v-tooltip.top="'Editar presentación'" @click="abrirEditar(data)" />
                      <Button icon="pi pi-barcode" label="Código"
                        class="!bg-white hover:!bg-[#eef2e9] !text-[#1e3a2f] !border !border-[#cfe0d2] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer"
                        v-tooltip.top="'Ver códigos de barra'" @click="abrirCodigos(data)" />
                      <Button :icon="data.estado === 'ACTIVO' ? 'pi pi-ban' : 'pi pi-check-circle'"
                        :label="data.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'" :class="data.estado === 'ACTIVO'
                          ? '!bg-white hover:!bg-[#fde8e8] !text-[#9c2a2a] !border !border-[#f0c9c9]'
                          : '!bg-white hover:!bg-[#eef2e9] !text-[#2b5e3b] !border !border-[#cfe0d2]'
                          " class="rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer"
                        v-tooltip.top="data.estado === 'ACTIVO' ? 'Desactivar presentación' : 'Activar presentación'"
                        @click="toggleEstadoPresentacion(data)" />
                      <Button icon="pi pi-box" label="Lotes"
                        class="!bg-white hover:!bg-[#eef2e9] !text-[#3c674b] !border !border-[#cfe0d2] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer"
                        v-tooltip.top="'Ver lotes'" @click="abrirLotes(data)" />
                    </div>
                  </template>
                </Column>
                <template #empty>
                  <div class="text-center py-8 text-gray-400 text-sm">No hay presentaciones registradas</div>
                </template>
              </DataTable>
            </div>
          </TabPanel>

          <!-- PESTAÑA 2: KARDEX -->
          <TabPanel value="1">
            <KardexTable :productoId="producto.id" :unidadBase="unidadBaseNombre" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>

    <!-- DIÁLOGOS -->
    <AñadirPresentacionDialog v-model:visible="AgregarVisible" :unidadBase="unidadBaseProducto"
      :productoId="producto.id" @guardar="onGuardar" />
    <EditarPresentacionDialog v-model:visible="editarVisible" :presentacion="presentacionSeleccionada"
      :presentacionesExistentes="presentaciones" @guardar="onGuardarEdicion" />
    <CodigosBarraDialog v-model:visible="codigosVisible" :presentacion="presentacionCodigos" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

import AñadirPresentacionDialog from '@/components/Productos/AddPresentacion.vue'
import EditarPresentacionDialog from '@/components/Productos/EditPresentacion.vue'
import CodigosBarraDialog from '@/components/Productos/AddBarCode.vue'
import KardexTable from '@/components/Productos/KardexTable.vue'
import Swal from 'sweetalert2'
import { getPresentacionesByProducto, togglePresentacion } from '@/services/productoService'

const props = defineProps({
  producto: { type: Object, required: true },
})

const emit = defineEmits(['volver', 'open-lotes'])

const editarVisible = ref(false)
const presentacionSeleccionada = ref(null)
const codigosVisible = ref(false)
const presentacionCodigos = ref(null)
const AgregarVisible = ref(false)
const cargando = ref(false)
const presentaciones = ref([])

const unidadBaseNombre = computed(() => {
  const um = props.producto.unidad_medida
  if (um && typeof um === 'object' && um.nombre) return um.nombre
  if (typeof um === 'string') return um
  if (props.producto.unidad_base) return props.producto.unidad_base
  return 'Unidad Base'
})

const producto = ref({
  id: props.producto.id,
  nombre: props.producto.nombre,
  codigo: props.producto.codigo,
  categoria: props.producto.categoria?.nombre ?? props.producto.categoria ?? '—',
  fabricante: props.producto.fabricante,
})

const unidadBaseProducto = computed(() => {
  if (presentaciones.value[0]?.unidadMedida?.nombre) {
    return presentaciones.value[0].unidadMedida.nombre
  }
  if (producto.value?.unidad_medida?.nombre) {
    return producto.value.unidad_medida.nombre
  }
  return '—'
})

onMounted(async () => {
  await cargarPresentaciones()
})

const cargarPresentaciones = async () => {
  cargando.value = true
  try {
    const res = await getPresentacionesByProducto(props.producto.id)
    const data = res.data.data ?? []

    presentaciones.value = data.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      unidadMedida: p.unidad_medida,
      factor_conversion: Number(p.factor_conversion) || 0,
      precio: parseFloat(p.precio_venta ?? 0),
      stock: (p.stock !== null && p.stock !== undefined) ? Number(p.stock) : 0,
      estado: p.activo ? 'ACTIVO' : 'INACTIVO',
      es_base: p.es_base ?? false,
    }))
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 200) {
      presentaciones.value = []
      return
    }
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las presentaciones.',
      confirmButtonColor: '#2b5e3b',
    })
  } finally {
    cargando.value = false
  }
}

const formatNumber = (value) => value?.toFixed(2) ?? '0.00'
const volver = () => emit('volver')

const toggleEstadoPresentacion = (pres) => {
  const esActivo = pres.estado === 'ACTIVO'
  Swal.fire({
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
        <div style="width:56px; height:56px; border-radius:50%; background:${esActivo ? '#fee2e2' : '#dff0e0'}; display:flex; align-items:center; justify-content:center;">
          <i class="pi ${esActivo ? 'pi-ban' : 'pi-check-circle'}" style="font-size:24px; color:${esActivo ? '#b91c1c' : '#2b5e3b'};"></i>
        </div>
        <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">
          ${esActivo ? '¿Desactivar presentación?' : '¿Activar presentación?'}
        </h3>
        <p style="font-size:14px; color:#6b7280; margin:0;">
          ${esActivo ? 'La presentación dejará de estar disponible para la venta.' : 'La presentación volverá a estar disponible para la venta.'}
        </p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonColor: esActivo ? '#b91c1c' : '#2b5e3b',
    cancelButtonColor: '#e2e8dd',
    confirmButtonText: esActivo ? 'Sí, desactivar' : 'Sí, activar',
    cancelButtonText: 'Cancelar',
    customClass: {
      container: '!z-[9999]',
      confirmButton: '!rounded-lg !font-semibold !text-sm',
      cancelButton: '!rounded-lg !font-semibold !text-sm !text-[#1a2e1f]',
      popup: '!rounded-2xl',
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await togglePresentacion(pres.id)
        const index = presentaciones.value.findIndex((p) => p.id === pres.id)
        if (index !== -1) {
          presentaciones.value[index].estado = res.data.activo ? 'ACTIVO' : 'INACTIVO'
        }
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: esActivo ? '¡Presentación desactivada!' : '¡Presentación activada!',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          background: '#ffffff',
          color: '#1e3a2f',
          iconColor: '#2b5e3b',
        })
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cambiar el estado.',
          confirmButtonColor: '#2b5e3b',
        })
      }
    }
  })
}

const abrirAñadir = () => { AgregarVisible.value = true }
const abrirEditar = (presentacion) => {
  presentacionSeleccionada.value = { ...presentacion }
  editarVisible.value = true
}

const onGuardar = (nuevaPresentacion) => {
  presentaciones.value.push(nuevaPresentacion)
}
const onGuardarEdicion = (presentacionEditada) => {
  const index = presentaciones.value.findIndex((p) => p.id === presentacionEditada.id)
  if (index !== -1) {
    presentaciones.value[index] = { ...presentacionEditada }
  }
}

const abrirCodigos = (presentacion) => {
  presentacionCodigos.value = { ...presentacion }
  codigosVisible.value = true
}

const abrirLotes = (presentacion) => {
  emit('open-lotes', presentacion)
}
</script>

<style scoped>
:deep(.p-tablist-tab-list) {
  border-bottom-color: #e2e8dd !important;
}

:deep(.p-tab) {
  border-bottom: 2px solid transparent !important;
  color: #6b7280 !important;
}

:deep(.p-tab-active) {
  border-bottom-color: #2b5e3b !important;
  color: #2b5e3b !important;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #fbfdf9;
  color: #2b5e3b;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 0.75rem 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f4f8f3 !important;
}
</style>