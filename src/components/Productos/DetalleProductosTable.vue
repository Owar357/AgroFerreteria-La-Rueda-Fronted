<template>
  <div class="bg-[#eef2e9] min-h-screen p-4 sm:p-6 md:p-8 mx-auto font-['Inter',sans-serif]">
    <!-- BOTÓN VOLVER MODERADO -->
    <div class="flex items-center justify-between mb-4">
      <Button icon="pi pi-arrow-left" label="Volver a productos" severity="secondary" text
        class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white !px-3.5 !py-2 !rounded-xl transition-all duration-200 cursor-pointer text-xs sm:text-sm font-semibold"
        @click="volver" />
    </div>

    <!-- TARJETA CABECERA PRODUCTO (RESPONSIVA) -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-4 sm:p-5 mb-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h1 class="text-xl sm:text-2xl font-bold text-[#1a2e1f] capitalize leading-tight m-0">
              {{ producto.nombre }}
            </h1>
            <span class="bg-[#2b5e3b]/10 text-[#2b5e3b] text-xs font-bold px-2.5 py-1 rounded-md uppercase font-mono tracking-wider whitespace-nowrap">
              {{ producto.codigo }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1 text-xs sm:text-sm text-gray-500">
            <span>Categoría: <strong class="text-gray-800 capitalize">{{ producto.categoria }}</strong></span>
            <span class="hidden sm:inline text-gray-300">•</span>
            <span>Fabricante: <strong class="text-gray-800 capitalize">{{ producto.fabricante }}</strong></span>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTENEDOR UNIFICADO (PESTAÑAS + CONTENIDO) -->
    <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm overflow-hidden">
      <Tabs value="0">
        <!-- TABS NAV INTEGRADO -->
        <TabList class="bg-[#fbfdf9] border-b border-[#e2e8dd] px-2 sm:px-4 pt-2">
          <Tab value="0" class="!text-[#1a2e1f] font-semibold flex items-center gap-2 px-3 sm:px-4 py-3 cursor-pointer text-xs sm:text-sm">
            <i class="pi pi-box text-[#e0b354]"></i> Presentaciones
          </Tab>
          <Tab value="1" class="!text-[#1a2e1f] font-semibold flex items-center gap-2 px-3 sm:px-4 py-3 cursor-pointer text-xs sm:text-sm">
            <i class="pi pi-history text-[#2b5e3b]"></i> Historial Kardex
          </Tab>
        </TabList>

        <TabPanels class="!bg-white !p-4 sm:!p-6">
          <!-- PESTAÑA 1: PRESENTACIONES -->
          <TabPanel value="0">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
              <div>
                <h2 class="text-base sm:text-lg font-bold text-[#1a2e1f] flex items-center gap-2 m-0">
                  <i class="pi pi-box text-[#e0b354]"></i> Presentaciones Registradas
                </h2>
                <p class="text-xs text-gray-500 m-0 mt-0.5">Gestión de unidades de venta y empaques</p>
              </div>
              <Button
                class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white text-xs sm:text-sm font-semibold !px-4 !py-2.5 !rounded-xl !border-none shadow-sm transition-all duration-200 cursor-pointer w-full sm:w-auto"
                label="Agregar presentación" icon="pi pi-plus" @click="abrirAñadir()" />
            </div>

            <!-- ======================================================= -->
            <!-- VISTA MÓVIL: Fila Desplegable (< 768px)                  -->
            <!-- ======================================================= -->
            <div class="block md:hidden w-full border border-[#e2e8dd] rounded-xl overflow-hidden shadow-xs">
              <DataTable 
                v-model:expandedRows="expandedRows" 
                :value="presentaciones" 
                dataKey="id" 
                class="p-datatable-custom text-sm w-full"
              >
                <template #empty>
                  <div class="text-center py-8 text-gray-400 text-sm">No hay presentaciones registradas</div>
                </template>

                <!-- Flecha de Expansión -->
                <Column expander style="width: 2.5rem" />

                <!-- Columna: Nombre -->
                <Column field="nombre" header="Nombre" class="text-xs font-semibold text-gray-800 capitalize">
                  <template #body="{ data }">
                    <span class="block leading-tight font-semibold text-[#1a2e1f]">{{ data.nombre }}</span>
                  </template>
                </Column>

                <!-- Columna: Precio -->
                <Column field="precio" header="Precio" class="text-xs font-bold text-gray-800">
                  <template #body="{ data }"> ${{ formatNumber(data.precio) }} </template>
                </Column>

                <!-- Plantilla de Expansión Móvil -->
                <template #expansion="{ data }">
                  <div class="p-3.5 bg-[#f8faf7] border-y border-[#e2e8dd] text-sm">
                    <div class="bg-white p-3.5 rounded-lg border border-[#e2e8dd] shadow-xs space-y-3">
                      
                      <!-- Fila 1: Equivalencia y Stock -->
                      <div class="grid grid-cols-2 gap-2">
                        <div>
                          <span class="text-[0.6875rem] font-bold tracking-wider uppercase text-gray-500 block mb-0.5">
                            Equivalencia
                          </span>
                          <span class="font-mono text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded inline-block">
                            {{ data.factor_conversion }} {{ data.unidadMedida?.nombre || '—' }}
                          </span>
                        </div>
                        <div>
                          <span class="text-[0.6875rem] font-bold tracking-wider uppercase text-gray-500 block mb-0.5">
                            Stock
                          </span>
                          <span class="text-xs font-bold text-gray-800 block">
                            {{ data.stock }}
                          </span>
                        </div>
                      </div>

                      <!-- Fila 2: Estado -->
                      <div class="pt-2 border-t border-gray-100">
                        <span class="text-[0.6875rem] font-bold tracking-wider uppercase text-gray-500 block mb-1">
                          Estado
                        </span>
                        <Tag :value="data.estado" :severity="data.estado === 'ACTIVO' ? 'success' : 'danger'" rounded class="!text-[10px] !px-2.5" />
                      </div>

                    </div>

                    <!-- Botones de Acción Móvil Adaptados (Grid 2x2) -->
                    <div class="mt-3 pt-1 grid grid-cols-2 gap-2">
                      <Button icon="pi pi-pencil" label="Editar"
                        class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer shadow-xs flex justify-center items-center w-full"
                        v-tooltip.top="'Editar presentación'" @click="abrirEditar(data)" />

                      <Button icon="pi pi-barcode" label="Código"
                        class="!bg-white hover:!bg-[#eef2e9] !text-[#1e3a2f] !border !border-[#cfe0d2] rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer shadow-xs flex justify-center items-center w-full"
                        v-tooltip.top="'Ver códigos de barra'" @click="abrirCodigos(data)" />

                      <Button :icon="data.estado === 'ACTIVO' ? 'pi pi-ban' : 'pi pi-check-circle'"
                        :label="data.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'" :class="data.estado === 'ACTIVO'
                          ? '!bg-white hover:!bg-[#fde8e8] !text-[#9c2a2a] !border !border-[#f0c9c9]'
                          : '!bg-white hover:!bg-[#eef2e9] !text-[#2b5e3b] !border !border-[#cfe0d2]'" 
                        class="rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer shadow-xs flex justify-center items-center w-full"
                        @click="toggleEstadoPresentacion(data)" />

                      <Button icon="pi pi-box" label="Lotes"
                        class="!bg-white hover:!bg-[#eef2e9] !text-[#3c674b] !border !border-[#cfe0d2] rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer shadow-xs flex justify-center items-center w-full"
                        v-tooltip.top="'Ver lotes'" @click="abrirLotes(data)" />
                    </div>
                  </div>
                </template>
              </DataTable>
            </div>

            <!-- ======================================================= -->
            <!-- VISTA ESCRITORIO: Tabla Completa Tradicional (>= 768px)  -->
            <!-- ======================================================= -->
            <div class="hidden md:block border border-[#e2e8dd] rounded-xl overflow-x-auto shadow-xs">
              <DataTable :value="presentaciones" responsiveLayout="scroll" class="p-datatable-custom text-sm w-full min-w-[50rem]">
                <Column field="nombre" header="Nombre" class="text-sm font-medium text-gray-800 capitalize min-w-[10rem]">
                  <template #body="{ data }">
                    <span class="block leading-tight font-semibold text-[#1a2e1f]">{{ data.nombre }}</span>
                  </template>
                </Column>

                <Column header="Equivalencia" class="text-sm text-gray-600 min-w-[9rem]">
                  <template #body="{ data }">
                    <span class="font-mono text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded whitespace-nowrap">
                      {{ data.factor_conversion }} {{ data.unidadMedida?.nombre || '—' }}
                    </span>
                  </template>
                </Column>

                <Column field="precio" header="Precio" class="text-sm font-semibold text-gray-800 min-w-[6rem]">
                  <template #body="{ data }"> ${{ formatNumber(data.precio) }} </template>
                </Column>

                <Column field="stock" header="Stock" class="text-sm text-gray-700 min-w-[5rem]">
                  <template #body="{ data }"> {{ data.stock }} </template>
                </Column>

                <Column field="estado" header="Estado" class="text-sm min-w-[6rem]">
                  <template #body="{ data }">
                    <Tag :value="data.estado" :severity="data.estado === 'ACTIVO' ? 'success' : 'danger'" rounded class="!text-xs !px-2.5 whitespace-nowrap" />
                  </template>
                </Column>

                <!-- ACCIONES COMPACTAS Y BALANCEADAS -->
                <Column header="Acciones" :exportable="false" class="text-sm w-[18rem] shrink-0">
                  <template #body="{ data }">
                    <div class="flex items-center gap-1.5 justify-end whitespace-nowrap">
                      <Button icon="pi pi-pencil" label="Editar"
                        class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                        v-tooltip.top="'Editar presentación'" @click="abrirEditar(data)" />

                      <Button icon="pi pi-barcode" label="Código"
                        class="!bg-white hover:!bg-[#eef2e9] !text-[#1e3a2f] !border !border-[#cfe0d2] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                        v-tooltip.top="'Ver códigos de barra'" @click="abrirCodigos(data)" />

                      <Button :icon="data.estado === 'ACTIVO' ? 'pi pi-ban' : 'pi pi-check-circle'"
                        :label="data.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'" :class="data.estado === 'ACTIVO'
                          ? '!bg-white hover:!bg-[#fde8e8] !text-[#9c2a2a] !border !border-[#f0c9c9]'
                          : '!bg-white hover:!bg-[#eef2e9] !text-[#2b5e3b] !border !border-[#cfe0d2]'" 
                        class="rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                        v-tooltip.top="data.estado === 'ACTIVO' ? 'Desactivar presentación' : 'Activar presentación'"
                        @click="toggleEstadoPresentacion(data)" />

                      <Button icon="pi pi-box" label="Lotes"
                        class="!bg-white hover:!bg-[#eef2e9] !text-[#3c674b] !border !border-[#cfe0d2] rounded-lg !px-2.5 !py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
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
    <AñadirPresentacionDialog 
      v-model:visible="AgregarVisible" 
      :unidadBase="unidadBaseProducto"
      :unidadMedidaId="idUnidadBase"
      :productoId="producto.id" 
      @guardar="onGuardar" 
    />
    <EditarPresentacionDialog v-model:visible="editarVisible" :presentacion="presentacionSeleccionada"
      :presentacionesExistentes="presentaciones" @guardar="onGuardarEdicion" />
    <CodigosBarraDialog v-model:visible="codigosVisible" :presentacion="presentacionCodigos" />
  </div>
</template>

<script setup>
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
import { getPresentacionesByProducto, togglePresentacion } from '@/services/productoService'
import { 
  mostrarExito, 
  mostrarError, 
  mostrarConfirmacion, 
  mostrarCargando 
} from '@/utils/SweetAlertService'

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
const expandedRows = ref({})

const producto = ref({
  id: props.producto.id,
  nombre: props.producto.nombre,
  codigo: props.producto.codigo,
  categoria: props.producto.categoria?.nombre ?? props.producto.categoria ?? '—',
  fabricante: props.producto.fabricante,
  unidad_medida_id: props.producto.unidad_medida_id || props.producto.unidad_medida?.id || null,
  unidad_medida: props.producto.unidad_medida || null,
})

const idUnidadBase = computed(() => {
  if (presentaciones.value[0]?.unidadMedida?.id) {
    return presentaciones.value[0].unidadMedida.id
  }
  return producto.value.unidad_medida_id || producto.value.unidad_medida?.id || null
})

const unidadBaseNombre = computed(() => {
  const um = props.producto.unidad_medida
  if (um && typeof um === 'object' && um.nombre) return um.nombre
  if (typeof um === 'string') return um
  if (props.producto.unidad_base) return props.producto.unidad_base
  return 'Unidad Base'
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
    mostrarError('Atención', 'No se pudieron cargar las presentaciones registradas.')
  } finally {
    cargando.value = false
  }
}

const formatNumber = (value) => value?.toFixed(2) ?? '0.00'
const volver = () => emit('volver')

const toggleEstadoPresentacion = async (pres) => {
  const esActivo = pres.estado === 'ACTIVO'
  const resultado = await mostrarConfirmacion({
    titulo: esActivo ? '¿Desactivar presentación?' : '¿Activar presentación?',
    mensajeHtml: esActivo 
      ? 'La presentación dejará de estar disponible para la venta.' 
      : 'La presentación volverá a estar disponible para la venta.',
    icono: esActivo ? 'pi-ban' : 'pi-check-circle',
    bgIcono: esActivo ? '#fee2e2' : '#dff0e0',
    colorIcono: esActivo ? '#b91c1c' : '#2b5e3b',
    confirmButtonText: esActivo ? 'Sí, desactivar' : 'Sí, activar',
    confirmButtonColor: esActivo ? '#b91c1c' : '#2b5e3b',
  })

  if (!resultado.isConfirmed) return

  mostrarCargando(
    esActivo ? 'Desactivando presentación...' : 'Activando presentación...', 
    'Por favor espera un momento'
  )

  try {
    const [res] = await Promise.all([
      togglePresentacion(pres.id),
      new Promise((resolve) => setTimeout(resolve, 500))
    ])

    const index = presentaciones.value.findIndex((p) => p.id === pres.id)
    if (index !== -1) {
      presentaciones.value[index].estado = res.data.activo ? 'ACTIVO' : 'INACTIVO'
    }

    mostrarExito(
      esActivo ? '¡Presentación desactivada!' : '¡Presentación activada!',
      'El estado fue actualizado correctamente.'
    )
  } catch {
    mostrarError('No se pudo cambiar el estado', 'Inténtalo de nuevo en un momento.')
  }
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

:deep(.p-datatable-custom .p-datatable-thead > tr > th) {
  background-color: #fbfdf9 !important;
  color: #2b5e3b !important;
  font-weight: 600 !important;
  font-size: 0.8rem !important;
  padding: 0.75rem 1rem !important;
  border-bottom: 1px solid #e2e8dd !important;
  white-space: nowrap !important;
}

:deep(.p-datatable-custom .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem !important;
  font-size: 0.85rem !important;
  border-bottom: 1px solid #f1f5f0 !important;
}

:deep(.p-datatable-custom .p-datatable-tbody > tr:hover) {
  background-color: #f4f8f3 !important;
}
</style>