<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="EDITAR CATEGORÍA"
    :style="{ width: '450px' }"
    :draggable="false"
    class="custom-dialog"
    :pt="{ root: { class: 'rounded-2xl overflow-hidden' } }"
  >
    <div class="bg-[#ffffff] p-2 text-[#1a2e1f] flex flex-col gap-6 font-['Inter',sans-serif]">

      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Nombre: <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="form.nombre"
          placeholder="Modifique el nombre..."
          :class="[
            'w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg',
            error ? 'border-red-500 border' : 'border-[#d1d5db]'
          ]"
          @input="validarInput"
          @keyup.enter="dispararActualizar"
        />
        <small v-if="error" class="text-red-500 text-[12px]">{{ error }}</small>
      </div>

      <div class="flex justify-between gap-4 mt-2">
        <Button
          label="Cancelar"
          class="!bg-white hover:!bg-[#e2e8dd] !text-[#1a2e1f] text-[14px] font-semibold px-4 py-4 rounded-lg !border !border-[#cbd5e1] cursor-pointer transition-colors"
          :disabled="guardando"
          @click="localVisible = false"
        />
        <Button
          label="Guardar"
          :loading="guardando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-4 py-4 rounded-lg border-none cursor-pointer shadow-md transition-colors"
          @click="dispararActualizar"
        />
      </div>

    </div>
  </Dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Swal from 'sweetalert2'
import { useCategoriaStore } from '../../stores/categoriaStore'

const props = defineProps({
  visible:   { type: Boolean, default: false },
  categoria: { type: Object,  default: () => null }
})

const emit = defineEmits(['update:visible'])

const store        = useCategoriaStore()
const localVisible = ref(false)
const form         = reactive({ id: null, nombre: '', estado: '' })
const error        = ref('')
const guardando    = ref(false)

// ── Sync visible prop → localVisible ────────────────────────────────────────
watch(() => props.visible, (val) => { localVisible.value = val })

// ── Sync localVisible → emit para v-model ───────────────────────────────────
watch(localVisible, (val) => { emit('update:visible', val) })

// ── Cargar datos de la categoría seleccionada ────────────────────────────────
// SIN immediate:true para evitar que se dispare al montar con null
watch(
  () => props.categoria,
  (val) => {
    if (val) {
      form.id     = val.id
      form.nombre = val.nombre
      form.estado = val.estado
      error.value = ''
    }
  }
)

const validarInput = () => {
  const valor = form.nombre

  if (!valor) { error.value = ''; return false }

  if (/\d/.test(valor)) {
    error.value = 'El nombre no puede contener números.'
    return false
  }

  if (valor.trim().length < 2) {
    error.value = 'El nombre debe tener al menos 2 caracteres.'
    return false
  }

  error.value = ''
  return true
}

const dispararActualizar = async () => {
  if (!form.nombre.trim()) {
    error.value = 'El nombre de la categoría es obligatorio.'
    return
  }
  if (!validarInput()) return

  // Cerramos el modal ANTES del SweetAlert de confirmación
  // para que no quede detrás del diálogo
  localVisible.value = false

  const confirmacion = await Swal.fire({
    icon: 'question',
    title: '¿Guardar cambios?',
    text: `¿Deseas actualizar la categoría a "${form.nombre.trim()}"?`,
    showCancelButton: true,
    confirmButtonColor: '#2b5e3b',
    cancelButtonColor:  '#6b7280',
    confirmButtonText:  'Sí, guardar',
    cancelButtonText:   'Cancelar'
  })

  // Si cancela, volvemos a abrir el modal
  if (!confirmacion.isConfirmed) {
    localVisible.value = true
    return
  }

  guardando.value = true
  const resultado = await store.actualizarCategoria(form.id, { nombre: form.nombre.trim() })
  guardando.value = false

  // Si hubo error de validación del servidor, volvemos a abrir el modal con el error
  if (!resultado.ok && resultado.error) {
    error.value        = resultado.error
    localVisible.value = true
  }
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

.p-inputtext:enabled:focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>