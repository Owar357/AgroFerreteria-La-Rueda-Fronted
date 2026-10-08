<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    :header="`CÓDIGOS DE BARRA - ${(presentacion?.nombre ?? '').toUpperCase()}`"
    :draggable="false"
    :closable="false"
    :style="{ width: 'min(calc(100vw - 2rem), 34rem)' }"
    class="custom-dialog"
    :pt="{ root: { class: '!rounded-2xl overflow-hidden shadow-2xl' } }"
    @hide="resetForm"
  >
    <!-- ======================================================= -->
    <!-- VISTA MÓVIL (< 640px)                                   -->
    <!-- ======================================================= -->
    <div class="block sm:hidden bg-white p-4 text-[#1a2e1f] space-y-4 font-['Inter',sans-serif]">
      
      <!-- Tabla de códigos Móvil -->
      <DataTable
        :value="codigos"
        dataKey="id"
        stripedRows
        class="tabla-codigos rounded-xl overflow-hidden border border-[#e8efe1]"
      >
        <Column
          field="codigo"
          header="CÓDIGO"
          headerClass="!bg-[#fafdf7] !px-3 !py-2.5 !text-xs !font-semibold !text-[#3c674b] !tracking-wider"
          bodyClass="!px-3 !py-2 !text-xs !text-[#1a2e1f] !font-mono"
        />
        <Column
          header="ACCIONES"
          headerClass="!bg-[#fafdf7] !px-3 !py-2.5 !text-xs !font-semibold !text-[#3c674b] !tracking-wider"
          bodyClass="!px-3 !py-2 !text-right"
          :pt="{ columnHeaderContent: { class: '!justify-end' } }"
        >
          <template #body="{ data }">
            <Button
              icon="pi pi-trash"
              label="Eliminar"
              severity="danger"
              text
              rounded
              size="small"
              class="!text-xs"
              @click="eliminarCodigo(data.id)"
            />
          </template>
        </Column>
        <template #empty>
          <div v-if="cargando" class="text-center py-6 text-gray-400 text-xs">
            <i class="pi pi-spin pi-spinner text-xl mb-1 block"></i>
            Cargando códigos...
          </div>
          <div v-else class="text-center py-6 text-gray-400 text-xs">
            <i class="pi pi-barcode text-xl mb-1 block"></i>
            No hay códigos registrados
          </div>
        </template>
      </DataTable>


      <div class="flex gap-2 w-full">
        <BaseInput
          v-model="nuevoCodigo"
          placeholder="Ej: 7501234567890"
          filter="int"
          class="flex-1"
          maxlength="13"
          @keyup.enter="agregarCodigo"
        />
        <Button
          label="Agregar"
          icon="pi pi-plus"
          :loading="guardando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white !border-none !rounded-xl !px-3.5 text-xs font-bold shadow-md cursor-pointer shrink-0"
          @click="agregarCodigo"
        />
      </div>


      <div class="pt-3 flex flex-col gap-2 w-full">
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-xs !py-3 !border-[#cbd5e1] !text-gray-600 !rounded-xl !w-full font-semibold cursor-pointer"
          @click="localVisible = false"
        />
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO (>= 640px)                             -->
    <!-- ======================================================= -->
    <div class="hidden sm:flex bg-white p-6 text-[#1a2e1f] flex-col gap-5 font-['Inter',sans-serif]">
      

      <DataTable
        :value="codigos"
        dataKey="id"
        stripedRows
        class="tabla-codigos rounded-xl overflow-hidden border border-[#e8efe1]"
      >
        <Column
          field="codigo"
          header="CÓDIGO"
          headerClass="!bg-[#fafdf7] !px-4 !py-3 !text-xs !font-semibold !text-[#3c674b] !tracking-wider"
          bodyClass="!px-4 !py-3 !text-sm !text-[#1a2e1f] !font-mono"
        />
        <Column
          header="ACCIONES"
          headerClass="!bg-[#fafdf7] !px-4 !py-3 !text-xs !font-semibold !text-[#3c674b] !tracking-wider"
          bodyClass="!px-4 !py-3 !text-right"
          :pt="{ columnHeaderContent: { class: '!justify-end' } }"
        >
          <template #body="{ data }">
            <Button
              icon="pi pi-trash"
              label="Eliminar"
              severity="danger"
              text
              rounded
              size="small"
              v-tooltip="'Eliminar código'"
              @click="eliminarCodigo(data.id)"
            />
          </template>
        </Column>
        <template #empty>
          <div v-if="cargando" class="text-center py-6 text-gray-400 text-sm">
            <i class="pi pi-spin pi-spinner text-2xl mb-1 block"></i>
            Cargando códigos...
          </div>
          <div v-else class="text-center py-6 text-gray-400 text-sm">
            <i class="pi pi-barcode text-2xl mb-1 block"></i>
            No hay códigos registrados
          </div>
        </template>
      </DataTable>

   
      <div class="flex gap-2 w-full">
        <BaseInput
          v-model="nuevoCodigo"
          placeholder="Ej: 7501234567890"
          filter="int"
          maxlength="13"
          class="flex-1"
        
          @keyup.enter="agregarCodigo"
        />
        <Button
          label="Agregar"
          icon="pi pi-plus"
          :loading="guardando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white !border-none !rounded-xl !px-5 text-sm font-semibold shadow-md cursor-pointer transition-colors shrink-0 flex items-center gap-1.5"
          @click="agregarCodigo"
        />
      </div>

   
      <div class="flex justify-end items-center mt-1 pt-4 border-t border-[#e2e8dd] w-full">
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-sm !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl font-semibold cursor-pointer w-[47%] flex justify-center items-center"
          @click="localVisible = false"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import BaseInput from '@/components/base/BaseInput.vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import {
  getCodigosByPresentacion,
  createCodigoBarra,
  deleteCodigoBarra,
} from '@/services/productoService'
import {
  mostrarExito,
  mostrarError,
  mostrarConfirmacion,
  mostrarCargando,
} from '@/utils/SweetAlertService'

const props = defineProps({
  visible: { type: Boolean, default: false },
  presentacion: { type: Object, default: null },
})

const emit = defineEmits(['update:visible'])

const localVisible = ref(false)
const nuevoCodigo = ref('')
const codigos = ref([])
const cargando = ref(false)
const guardando = ref(false)

// Guarda la última presentación abierta para saber cuándo limpiar la lista
let ultimaPresentacionId = null

watch(
  () => props.visible,
  async (val) => {
    localVisible.value = val
    if (val && props.presentacion?.id) {
      // Si es otra presentación, se limpia la lista para no mostrar códigos ajenos.
      // Si es la misma, se mantienen los que ya había y se refrescan en segundo plano.
      if (ultimaPresentacionId !== props.presentacion.id) {
        codigos.value = []
        ultimaPresentacionId = props.presentacion.id
      }
      await cargarCodigos()
    }
  },
)

watch(localVisible, (val) => emit('update:visible', val))

const resetForm = () => {
  nuevoCodigo.value = ''
}

const cargarCodigos = async () => {
  cargando.value = true
  try {
    const res = await getCodigosByPresentacion(props.presentacion.id)
    codigos.value = res.data.data ?? []
  } catch {
    mostrarError('Error', 'No se pudieron cargar los códigos de barra.')
  } finally {
    cargando.value = false
  }
}

const agregarCodigo = async () => {
  const valor = nuevoCodigo.value.trim()
  if (!valor) return

  guardando.value = true
  mostrarCargando('Guardando código...', 'Registrando el nuevo código de barra')

  try {
    const [res] = await Promise.all([
      createCodigoBarra({
        codigo: valor,
        presentacion_id: props.presentacion.id,
      }),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ])

    codigos.value.unshift({
      id: res.data.codigo_barra.id,
      codigo: res.data.codigo_barra.codigo,
    })

    nuevoCodigo.value = ''
    mostrarExito('¡Código de barra agregado!', 'El código fue registrado exitosamente.')
  } catch (error) {
    const msg =
      error.response?.data?.errors?.codigo?.[0] ??
      error.response?.data?.message ??
      'Error al agregar el código.'
    mostrarError('Error al guardar', msg)
  } finally {
    guardando.value = false
  }
}

const eliminarCodigo = async (id) => {
  const confirmacion = await mostrarConfirmacion({
    titulo: '¿Eliminar código de barra?',
    mensajeHtml: 'Esta acción no se puede deshacer.',
    icono: 'pi-trash',
    confirmButtonText: 'Sí, eliminar',
    confirmButtonColor: '#b91c1c',
  })

  if (!confirmacion.isConfirmed) return

  mostrarCargando('Eliminando código...', 'Por favor espera un momento')

  try {
    await Promise.all([
      deleteCodigoBarra(id),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ])

    codigos.value = codigos.value.filter((c) => c.id !== id)
    mostrarExito('¡Código eliminado!', 'El código de barra fue removido correctamente.')
  } catch {
    mostrarError('Error', 'No se pudo eliminar el código de barra.')
  }
}
</script>

<style>

.custom-dialog .p-dialog-header {
  background-color: #1a3323 !important;
  color: #ffffff !important;
  border-bottom: 1px solid #2b5e3b !important;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 1.1rem 1.5rem !important;
}


.custom-dialog .p-dialog-content {
  background-color: #ffffff !important;
  padding: 0 !important;
}

.p-inputtext:enabled:focus,
.p-inputnumber-input:enabled:focus,
.p-select:not(.p-disabled).p-focus,
.p-password-input:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}


.tabla-codigos .p-datatable-tbody > tr {
  background-color: #ffffff;
}
.tabla-codigos .p-datatable-tbody > tr:nth-child(even) {
  background-color: #fafdf7;
}
.tabla-codigos .p-datatable-tbody > tr > td {
  border-top: 1px solid #f0f5ea;
}
</style>