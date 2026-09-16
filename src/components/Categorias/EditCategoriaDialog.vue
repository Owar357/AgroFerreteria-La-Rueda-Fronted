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

      <!-- Nombre -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Nombre: <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="form.nombre"
          placeholder="Modifique el nombre..."
          :class="[
            'w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg',
            errorNombre ? 'border-red-500 border' : 'border-[#d1d5db]'
          ]"
          @input="validarNombre"
          @keyup.enter="dispararActualizar"
        />
        <small v-if="errorNombre" class="text-red-500 text-[12px]">{{ errorNombre }}</small>
      </div>

      <!-- % Ganancia Mínimo -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          % Ganancia Mínimo Deseado:
        </label>
        <InputNumber
          v-model="form.porcentaje_ganancia_minimo"
          placeholder="Ej: 15.00"
          suffix="%"
          :min="0"
          :max="100"
          :minFractionDigits="1"
          :maxFractionDigits="2"
          :class="[
            'w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 rounded-lg',
            errorGanancia ? 'border-red-500 border' : 'border-[#d1d5db]',
          ]"
          @input="validarGanancia"
          @keyup.enter="dispararActualizar"
        />
        <small class="text-[#6b7280] text-[14px]">Si se deja vacío, se aplicará el 15.00% por defecto. Esta ganancia se aplicara a todos los productos
          que pertenezcan a esta categoría
        </small>
        <small v-if="errorGanancia" class="text-red-500 text-[12px]">{{ errorGanancia }}</small>
      </div>

      <!-- Acciones -->
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
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import { useCategoriaStore } from '../../stores/categoriaStore'
import { mostrarConfirmacion, mostrarAlertaConfirmar, mostrarExito } from '@/utils/SweetAlertService'

const props = defineProps({
  visible:   { type: Boolean, default: false },
  categoria: { type: Object,  default: () => null }
})

const emit = defineEmits(['update:visible'])

const store        = useCategoriaStore()
const localVisible = ref(false)
const form         = reactive({ id: null, nombre: '', porcentaje_ganancia_minimo: 15.00 })
const errorNombre   = ref('')
const errorGanancia = ref('')
const guardando    = ref(false)

watch(() => props.visible, (val) => { localVisible.value = val })
watch(localVisible, (val) => { emit('update:visible', val) })

watch(
  () => props.categoria,
  (val) => {
    if (val) {
      form.id                         = val.id
      form.nombre                     = val.nombre
      form.porcentaje_ganancia_minimo = val.porcentaje_ganancia_minimo !== null ? parseFloat(val.porcentaje_ganancia_minimo) : 15.00
      errorNombre.value               = ''
      errorGanancia.value             = ''
    }
  }
)

const validarNombre = () => {
  const valor = form.nombre

  if (!valor) { errorNombre.value = ''; return false }

  if (/\d/.test(valor)) {
    errorNombre.value = 'El nombre no puede contener números.'
    return false
  }

  if (valor.trim().length < 2) {
    errorNombre.value = 'El nombre debe tener al menos 2 caracteres.'
    return false
  }

  if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(valor)) {
    errorNombre.value = 'El nombre no puede contener caracteres especiales.'
    return false
  }

  errorNombre.value = ''
  return true
}

const validarGanancia = () => {
  const val = form.porcentaje_ganancia_minimo
  if (val !== null && val !== undefined) {
    if (val < 0 || val > 100) {
      errorGanancia.value = 'El porcentaje debe estar entre 0% y 100%.'
      return false
    }
  }
  errorGanancia.value = ''
  return true
}

const dispararActualizar = async () => {
  if (!form.nombre.trim()) {
    errorNombre.value = 'El nombre de la categoría es obligatorio.'
    return
  }
  if (!validarNombre() || !validarGanancia()) return

  const confirmacion = await mostrarConfirmacion({
    titulo: '¿Guardar cambios?',
    mensajeHtml: `Se actualizará la categoría a "<strong>${form.nombre.trim()}</strong>"`,
    icono: 'pi-pencil',
    confirmButtonText: 'Sí, guardar',
  })

  if (!confirmacion.isConfirmed) return

  guardando.value = true
  
  const payload = {
    nombre: form.nombre.trim(),
    porcentaje_ganancia_minimo: form.porcentaje_ganancia_minimo !== null ? form.porcentaje_ganancia_minimo : 15.00
  }

  const resultado = await store.actualizarCategoria(form.id, payload)
  guardando.value = false

  if (resultado.ok) {
    localVisible.value = false
    mostrarExito(
      '¡Categoría actualizada!',
      'La categoría fue actualizada exitosamente.'
    )
  } else if (resultado.status === 403) {
    mostrarAlertaConfirmar({
      tipo: 'ban',
      icono: 'pi-bell',
      titulo: 'Sin autorización',
      mensajeHtml: 'No tiene permisos para editar este registro',
      confirmButtonText : 'Entendido'
    })
  } else if (resultado.error) {
    errorNombre.value = resultado.error
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

.p-inputtext:enabled:focus,
.p-inputnumber:enabled:focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>