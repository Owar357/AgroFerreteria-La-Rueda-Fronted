<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    :header="`Códigos de barra - ${presentacion?.nombre ?? ''}`"
    :style="{ width: '480px' }"
    :draggable="false"
    class="custom-dialog"
    :pt="{ root: { class: 'rounded-2xl overflow-hidden' } }"
  >
    <div class="bg-white p-2 text-[#1a2e1f] flex flex-col gap-5 font-['Inter',sans-serif]">
      <!-- Tabla de códigos -->
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

      <!-- Input + botón agregar -->

      <div class="flex gap-2">
        <InputText
          v-model="nuevoCodigo"
          placeholder="Ej: 7501234567890"
          class="flex-1 bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg border-[#d1d5db]"
          @keyup.enter="agregarCodigo"
        />
        <Button
          label="Agregar"
          icon="pi pi-plus"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white !border-none !rounded-lg !px-4"
          @click="agregarCodigo"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <Button
          label="Cerrar"
          class="!bg-white hover:!bg-[#e2e8dd] !text-[#1a2e1f] !border !border-[#cbd5e1] !rounded-lg !px-4 !py-2"
          @click="localVisible = false"
        />
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
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
    Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#2b5e3b' })
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
      container: '!z-[9999]', // ← encima del Dialog
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
          customClass: { container: '!z-[9999]' }, // ← también en el toast
        })
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el código.',
          confirmButtonColor: '#2b5e3b',
          customClass: { container: '!z-[9999]' }, // ← encima del Dialog
        })
      }
    }
  })
}
</script>

<style>
.custom-dialog .p-dialog-header {
  background-color: #1e3a2f !important;
  color: #ffffff !important;
  border-bottom: 1px solid #e2e8dd;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 1.25rem 1.5rem !important;
}

.custom-dialog .p-dialog-content {
  background-color: #ffffff !important;
  padding: 1.5rem !important;
}

.custom-dialog .p-dialog-footer {
  background-color: #ffffff !important;
  padding: 1rem 1.5rem !important;
  border-top: 1px solid #e8efe1 !important;
}
</style>
