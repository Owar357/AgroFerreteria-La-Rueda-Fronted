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
      <div class="rounded-xl overflow-hidden border border-[#e8efe1]">
        <table class="min-w-full">
          <thead class="bg-[#fafdf7]">
            <tr>
              <th class="px-3 py-2.5 text-left text-xs font-semibold text-[#3c674b] tracking-wider">
                CÓDIGO
              </th>
              <th class="px-3 py-2.5 text-right text-xs font-semibold text-[#3c674b] tracking-wider">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(codigo, index) in codigos"
              :key="codigo.id"
              :class="['border-t border-[#f0f5ea]', index % 2 === 0 ? 'bg-white' : 'bg-[#fafdf7]']"
            >
              <td class="px-3 py-2 text-xs text-[#1a2e1f] font-mono">{{ codigo.codigo }}</td>
              <td class="px-3 py-2 text-right">
                <Button
                  icon="pi pi-trash"
                  label="Eliminar"
                  severity="danger"
                  text
                  rounded
                  size="small"
                  class="!text-xs"
                  @click="eliminarCodigo(codigo.id)"
                />
              </td>
            </tr>
            <tr v-if="codigos.length === 0">
              <td colspan="2" class="text-center py-6 text-gray-400 text-xs">
                <i class="pi pi-barcode text-xl mb-1 block"></i>
                No hay códigos registrados
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Input para agregar código Móvil -->
      <div class="flex gap-2 w-full">
        <BaseInput
          v-model="nuevoCodigo"
          placeholder="Ej: 7501234567890"
          filter="int"
          class="flex-1"
          @keyup.enter="agregarCodigo"
        />
        <Button
          label="Agregar"
          icon="pi pi-plus"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white !border-none !rounded-xl !px-3.5 text-xs font-bold shadow-md cursor-pointer shrink-0"
          @click="agregarCodigo"
        />
      </div>

      <!-- Botón de Cierre Móvil -->
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
      
      <!-- Tabla de códigos Escritorio -->
      <div class="rounded-xl overflow-hidden border border-[#e8efe1]">
        <table class="min-w-full">
          <thead class="bg-[#fafdf7]">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#3c674b] tracking-wider">
                CÓDIGO
              </th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-[#3c674b] tracking-wider">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(codigo, index) in codigos"
              :key="codigo.id"
              :class="['border-t border-[#f0f5ea]', index % 2 === 0 ? 'bg-white' : 'bg-[#fafdf7]']"
            >
              <td class="px-4 py-3 text-sm text-[#1a2e1f] font-mono">{{ codigo.codigo }}</td>
              <td class="px-4 py-3 text-right">
                <Button
                  icon="pi pi-trash"
                  label="Eliminar"
                  severity="danger"
                  text
                  rounded
                  size="small"
                  v-tooltip="'Eliminar código'"
                  @click="eliminarCodigo(codigo.id)"
                />
              </td>
            </tr>
            <tr v-if="codigos.length === 0">
              <td colspan="2" class="text-center py-6 text-gray-400 text-sm">
                <i class="pi pi-barcode text-2xl mb-1 block"></i>
                No hay códigos registrados
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Input para agregar código Escritorio -->
      <div class="flex gap-2 w-full">
        <BaseInput
          v-model="nuevoCodigo"
          placeholder="Ej: 7501234567890"
          filter="int"
          class="flex-1"
          @keyup.enter="agregarCodigo"
        />
        <Button
          label="Agregar"
          icon="pi pi-plus"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white !border-none !rounded-xl !px-5 text-sm font-semibold shadow-md cursor-pointer transition-colors shrink-0 flex items-center gap-1.5"
          @click="agregarCodigo"
        />
      </div>

      <!-- Botones Escritorio -->
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
import Swal from 'sweetalert2'
import {
  getCodigosByPresentacion,
  createCodigoBarra,
  deleteCodigoBarra,
} from '@/services/productoService'

const props = defineProps({
  visible: { type: Boolean, default: false },
  presentacion: { type: Object, default: null },
})

const emit = defineEmits(['update:visible'])

const localVisible = ref(false)
const nuevoCodigo = ref('')
const codigos = ref([])
const cargando = ref(false)

watch(
  () => props.visible,
  async (val) => {
    localVisible.value = val
    if (val && props.presentacion?.id) {
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
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los códigos.',
      confirmButtonColor: '#2b5e3b',
    })
  } finally {
    cargando.value = false
  }
}

const agregarCodigo = async () => {
  const valor = nuevoCodigo.value.trim()
  if (!valor) return

  try {
    const res = await createCodigoBarra({
      codigo: valor,
      presentacion_id: props.presentacion.id,
    })

    codigos.value.unshift({
      id: res.data.codigo_barra.id,
      codigo: res.data.codigo_barra.codigo,
    })

    nuevoCodigo.value = ''

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: '¡Código de barra agregado!',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: '#ffffff',
      color: '#1e3a2f',
      iconColor: '#2b5e3b',
    })
  } catch (error) {
    const msg =
      error.response?.data?.errors?.codigo?.[0] ??
      error.response?.data?.message ??
      'Error al agregar el código.'
    Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#2b5e3b', customClass: { container: '!z-[9999]' } })
  }
}

const eliminarCodigo = (id) => {
  Swal.fire({
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
        <div style="width:56px; height:56px; border-radius:50%; background:#fee2e2; display:flex; align-items:center; justify-content:center;">
          <i class="pi pi-trash" style="font-size:24px; color:#b91c1c;"></i>
        </div>
        <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">¿Eliminar código de barra?</h3>
        <p style="font-size:14px; color:#6b7280; margin:0;">Esta acción no se puede deshacer.</p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonColor: '#b91c1c',
    cancelButtonColor: '#e2e8dd',
    confirmButtonText: 'Sí, eliminar',
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
        await deleteCodigoBarra(id)
        codigos.value = codigos.value.filter((c) => c.id !== id)

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: '¡Código eliminado!',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          background: '#ffffff',
          color: '#1e3a2f',
          iconColor: '#2b5e3b',
          customClass: { container: '!z-[9999]' },
        })
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el código.',
          confirmButtonColor: '#2b5e3b',
          customClass: { container: '!z-[9999]' },
        })
      }
    }
  })
}
</script>

<style>
/* Encabezado sin 'X' y paleta AgroFerretería */
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

/* Limpieza del contenedor de contenido */
.custom-dialog .p-dialog-content {
  background-color: #ffffff !important;
  padding: 0 !important;
}

/* Enfoques y bordes para componentes PrimeVue dentro del modal */
.p-inputtext:enabled:focus,
.p-inputnumber-input:enabled:focus,
.p-select:not(.p-disabled).p-focus,
.p-password-input:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>