<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="AGREGAR CATEGORÍA"
    :draggable="false"
    :style="{ width: 'min(calc(100vw - 2rem), 34rem)' }"
    class="custom-dialog"
    :pt="{ root: { class: '!rounded-2xl overflow-hidden' } }"
    @hide="resetForm"
  >
    <div class="bg-[#ffffff] p-4 sm:p-6 text-[#1a2e1f] flex flex-col gap-5 font-['Inter',sans-serif]">
      
      <!-- Nombre de Categoría -->
      <div class="flex flex-col gap-2 w-full">
        <label class="text-sm font-medium text-[#1a2e1f]">
          Nombre: <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="nombreCategoria"
          placeholder="Escriba el nombre..."
          :class="[
            'w-full !bg-[#f9fafb] text-[#1a2e1f] text-sm h-[2.75rem] px-4 rounded-lg transition-colors',
            errorNombre ? '!border-red-500 border' : '!border-[#d1d5db]',
          ]"
          @input="validarNombre"
          @keyup.enter="dispararGuardar"
        />
        <small v-if="errorNombre" class="text-red-500 text-xs font-medium">{{ errorNombre }}</small>
      </div>

      <!-- Porcentaje Ganancia Mínimo -->
      <div class="flex flex-col gap-2 w-full">
        <label class="text-sm font-medium text-[#1a2e1f]">
          % Ganancia Mínima Deseada:
        </label>
        <InputNumber
          v-model="porcentajeGananciaMinimo"
          placeholder="Ej: 15.00"
          suffix="%"
          :min="0"
          :max="100"
          :minFractionDigits="1"
          :maxFractionDigits="2"
          class="w-full"
          :inputClass="[
            'w-full !bg-[#f9fafb] text-[#1a2e1f] text-sm h-[2.75rem] px-4 rounded-lg transition-colors',
            errorGanancia ? '!border-red-500 border' : '!border-[#d1d5db]',
          ]"
          @input="validarGanancia"
          @keyup.enter="dispararGuardar"
        />
        <small class="text-[#6b7280] text-xs leading-relaxed">
          Si se deja vacío, se aplicará el 15.00% por defecto. Esta ganancia se aplicará a todos los productos que pertenezcan a esta categoría.
        </small>
        <small v-if="errorGanancia" class="text-red-500 text-xs font-medium">{{ errorGanancia }}</small>
      </div>

      <!-- Botón de Acción Principal (Sección 7: w-full) -->
      <div class="flex justify-center mt-4 w-full">
        <Button
          label="Guardar"
          :loading="guardando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold px-7 py-3 rounded-lg border-none cursor-pointer shadow-lg transition-colors w-full"
          @click="dispararGuardar"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import { useCategoriaStore } from '../../stores/categoriaStore'
import { mostrarAccesoDenegado, mostrarError, mostrarExito } from '@/utils/SweetAlertService'

const props = defineProps({
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible'])

const store = useCategoriaStore()
const localVisible = ref(false)
const nombreCategoria = ref('')
const porcentajeGananciaMinimo = ref(null)
const errorNombre = ref('')
const errorGanancia = ref('')
const guardando = ref(false)

watch(
  () => props.visible,
  (val) => {
    localVisible.value = val
  },
)

watch(localVisible, (val) => {
  emit('update:visible', val)
})

const validarNombre = () => {
  const valor = nombreCategoria.value

  if (!valor) {
    errorNombre.value = ''
    return false
  }

  if (/\d/.test(valor)) {
    errorNombre.value = 'El nombre no puede contener números.'
    return false
  }

  if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(valor)) {
    errorNombre.value = 'El nombre no puede contener caracteres especiales.'
    return false
  }

  if (valor.trim().length < 2) {
    errorNombre.value = 'El nombre debe tener al menos 2 caracteres.'
    return false
  }

  errorNombre.value = ''
  return true
}

const validarGanancia = () => {
  const val = porcentajeGananciaMinimo.value
  if (val !== null && val !== undefined) {
    if (val < 0 || val > 100) {
      errorGanancia.value = 'El porcentaje debe estar entre 0% y 100%.'
      return false
    }
  }
  errorGanancia.value = ''
  return true
}

const resetForm = () => {
  nombreCategoria.value = ''
  porcentajeGananciaMinimo.value = null
  errorNombre.value = ''
  errorGanancia.value = ''
  guardando.value = false
}

const dispararGuardar = async () => {
  if (!nombreCategoria.value.trim()) {
    errorNombre.value = 'El nombre de la categoría es obligatorio.'
    return
  }
  if (!validarNombre() || !validarGanancia()) return

  errorNombre.value = ''
  errorGanancia.value = ''
  guardando.value = true

  const payload = {
    nombre: nombreCategoria.value.trim(),
    porcentaje_ganancia_minimo: porcentajeGananciaMinimo.value !== null ? porcentajeGananciaMinimo.value : 15.00
  }

  localVisible.value = false

  const resultado = await store.crearCategoria(payload)
  guardando.value = false

  if (resultado.ok) {
    resetForm()
    mostrarExito(
      '¡Categoría creada!',
      `La categoría "<strong>${resultado.categoria.nombre}</strong>" fue registrada exitosamente.`
    )
  } else if (resultado.status === 403) {
    resetForm()
    mostrarAccesoDenegado()
  } else if (resultado.error) {
    resetForm()
    mostrarError('Error al guardar', resultado.error)
  }
}
</script>

<style>
.custom-dialog .p-dialog-header {
  background-color: #1e3a2f !important;
  color: #ffffff !important;
  border-bottom: 0.0625rem solid #e2e8dd;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 1.25rem 1.5rem !important;
}

.custom-dialog .p-dialog-content {
  background-color: #ffffff !important;
  padding: 0 !important;
}

.p-inputtext:enabled:focus,
.p-inputnumber-input:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>