<template>
  <div class="bg-[#eef2e9] min-h-screen p-6 mx-auto">
    <!-- Botón volver -->
    <Button icon="pi pi-arrow-left" label="Volver a productos" severity="secondary" text
      class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white mb-4 !px-4 !py-2 !rounded-lg transition-all duration-200"
      @click="volver" />

    <!-- Tarjeta del producto -->
    <div class="bg-white rounded-2xl border border-[#e8efe1] shadow-sm p-6 mb-6">
      <div class="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 class="text-2xl font-bold text-[#1e3a2f]">{{ producto.nombre }}</h1>
          <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 mt-2">
            <span><span class="font-medium text-[#3c674b]">Código:</span> {{ producto.codigo }}</span>
            <span><span class="font-medium text-[#3c674b]">Categoría:</span>
              {{ producto.categoria }}</span>
            <span><span class="font-medium text-[#3c674b]">Fabricante:</span>
              {{ producto.fabricante }}</span>
          </div>
        </div>
      </div>
    </div>


    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-[#1e3a2f] flex items-center gap-2">
        <i class="pi pi-box text-[#e0b354]"></i> Presentaciones
      </h2>
      <Button
        class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white text-[14px] font-semibold !px-4 !py-3 !rounded-lg !border-none shadow-md transition-all duration-200"
        label="Agregar presentación" icon="pi pi-plus" @click="abrirAñadir()" />
    </div>

    <!-- Tabla de presentaciones con botones -->
    <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm">
      <DataTable :value="presentaciones" responsiveLayout="scroll" class="p-datatable-sm">
        <Column field="nombre" header="Nombre" class="text-sm"></Column>

        <Column header="Equivalencia" class="text-sm">
          <template #body="{ data }">
          {{ data.factor_conversion }} {{ data.unidadMedida }}
          </template>
        </Column>
        <Column field="precio" header="Precio" class="text-sm">
          <template #body="{ data }"> ${{ formatNumber(data.precio) }} </template>
        </Column>
        <Column field="stock" header="Stock" class="text-sm"></Column>
        <Column field="estado" header="Estado" class="text-sm">
          <template #body="{ data }">
            <Tag :value="data.estado" :severity="data.estado === 'ACTIVO' ? 'success' : 'danger'" rounded />
          </template>
        </Column>


        <!-- ACCIONES-->
        <Column header="Acciones" :exportable="false" class="text-sm">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" label="Editar"
                class="!bg-white hover:!bg-[#fdf6e8] !text-[#b8860b] !border !border-[#e8d9b5] rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
                v-tooltip.top="'Editar presentación'" @click="abrirEditar(data)" />

              <Button icon="pi pi-barcode" label="Código"
                class="!bg-white hover:!bg-[#eef2e9] !text-[#1e3a2f] !border !border-[#cfe0d2] rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
                v-tooltip.top="'Ver códigos de barra'" @click="abrirCodigos(data)" />

              <Button :icon="data.estado === 'ACTIVO' ? 'pi pi-ban' : 'pi pi-check-circle'"
                :label="data.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'" :class="data.estado === 'ACTIVO'
                  ? '!bg-white hover:!bg-[#fde8e8] !text-[#9c2a2a] !border !border-[#f0c9c9]'
                  : '!bg-white hover:!bg-[#eef2e9] !text-[#2b5e3b] !border !border-[#cfe0d2]'"
                class="rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
                v-tooltip.top="data.estado === 'ACTIVO' ? 'Desactivar presentación' : 'Activar presentación'"
                @click="toggleEstadoPresentacion(data)" />
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="text-center py-8 text-gray-400">No hay presentaciones registradas</div>
        </template>
      </DataTable>

      <AñadirPresentacionDialog v-model:visible="AgregarVisible" :unidadBase="producto.unidad_base"
        :productoId="producto.id" @guardar="onGuardar" />

      <EditarPresentacionDialog v-model:visible="editarVisible" :presentacion="presentacionSeleccionada"
        :unidadBase="producto.unidad_base" @guardar="onGuardarEdicion" />

      <CodigosBarraDialog v-model:visible="codigosVisible" :presentacion="presentacionCodigos" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import AñadirPresentacionDialog from '@/components/Productos/AddPresentation.vue'
import EditarPresentacionDialog from '@/components/Productos/EditPresentation.vue'
import CodigosBarraDialog from '@/components/Productos/AddBarCode.vue'
import Swal from 'sweetalert2'
import { getPresentacionesByProducto, togglePresentacion } from '@/services/productoService'

const props = defineProps({
  producto: { type: Object, required: true }
})

const emit = defineEmits(['volver'])

const editarVisible = ref(false)
const presentacionSeleccionada = ref(null)
const codigosVisible = ref(false)
const presentacionCodigos = ref(null)
const AgregarVisible = ref(false)
const cargando = ref(false)
const presentaciones = ref([])

// Los datos de la tarjeta vienen directo del prop (ya los tiene la tabla)
const producto = ref({
  id: props.producto.id,
  nombre: props.producto.nombre,
  codigo: props.producto.codigo,
  categoria: props.producto.categoria?.nombre ?? props.producto.categoria ?? '—',
  fabricante: props.producto.fabricante,
  unidad_base: props.producto.unidad_base ?? '—',
})

onMounted(async () => {
  await cargarPresentaciones()
})

const cargarPresentaciones = async () => {
  cargando.value = true
  try {
    const res = await getPresentacionesByProducto(props.producto.id)
    const data = res.data.data ?? []

    // Fallback: sacar unidad_base desde la presentación
    if (data.length > 0 && data[0].producto?.unidad_base) {
      producto.value.unidad_base = data[0].producto.unidad_base
    }

    presentaciones.value = data.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      unidadMedida: p.producto?.unidad_base ?? '—',
      factor_conversion: Number(p.factor_conversion) || 0,
      precio: parseFloat(p.precio_venta ?? 0),
      stock: p.stock !== null && p.stock !== undefined ? Number(p.stock) : 0,
      estado: p.activo ? 'ACTIVO' : 'INACTIVO',
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
          toast: true, position: 'top-end', icon: 'success',
          title: esActivo ? '¡Presentación desactivada!' : '¡Presentación activada!',
          showConfirmButton: false, timer: 1500, timerProgressBar: true,
          background: '#ffffff', color: '#1e3a2f', iconColor: '#2b5e3b',
        })
      } catch {
        Swal.fire({
          icon: 'error', title: 'Error',
          text: 'No se pudo cambiar el estado.',
          confirmButtonColor: '#2b5e3b',
        })
      }
    }
  })
}

const abrirAñadir = () => { AgregarVisible.value = true }

const onGuardar = (nuevaPresentacion) => {
  presentaciones.value.push(nuevaPresentacion)
}

const abrirEditar = (presentacion) => {
  presentacionSeleccionada.value = { ...presentacion }
  editarVisible.value = true
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
</script>

<style scoped>
/* Ajustes adicionales */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #fafdf7;
  color: #3c674b;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.75rem 1rem;
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  transition: background-color 0.2s;
}

/* Hover en fila completa - verde muy suave */
:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #eef5e9 !important;
  /* verde suave agro */
}

/* Opcional: si quieres hover por celda (más intenso al pasar por cada celda) */
:deep(.p-datatable .p-datatable-tbody > tr:hover > td) {
  background-color: transparent;
  /* para que herede el de la fila, no es necesario */
}

:deep(.p-button.p-button-text) {
  font-weight: 500;
}
</style>
