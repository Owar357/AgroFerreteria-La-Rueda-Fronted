<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="AGREGAR CATEGORÍA"
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
      <BaseInput
        v-model="nombreCategoria"
        label="Nombre: *"
        placeholder="Escriba el nombre..."
        filter="alpha"
        :error="errorNombre"
        @input="validarNombre"
        @keyup.enter="dispararGuardar"
      />
      <BaseInputPercent
        v-model="porcentajeGananciaMinimo"
        label="% Ganancia Mínima Deseada:"
        placeholder="Ej: 15.00"
        help="Si se deja vacío, se aplicará el 15.00% por defecto. Esta ganancia se aplicará a todos los productos que pertenezcan a esta categoría."
        :error="errorGanancia"
        @input="validarGanancia"
        @keyup.enter="dispararGuardar"
      />

      <!-- Botones Móvil -->
      <div class="pt-3 flex flex-col gap-2 w-full">
        <Button
          label="Guardar"
          :loading="guardando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-xs font-bold py-3 rounded-xl border-none cursor-pointer shadow-md w-full"
          @click="dispararGuardar"
        />
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
      <BaseInput
        v-model="nombreCategoria"
        label="Nombre: *"
        placeholder="Escriba el nombre..."
        filter="alpha"
        :error="errorNombre"
        @input="validarNombre"
        @keyup.enter="dispararGuardar"
      />
      <BaseInputPercent
        v-model="porcentajeGananciaMinimo"
        label="% Ganancia Mínima Deseada:"
        placeholder="Ej: 15.00"
        help="Si se deja vacío, se aplicará el 15.00% por defecto. Esta ganancia se aplicará a todos los productos que pertenezcan a esta categoría."
        :error="errorGanancia"
        @input="validarGanancia"
        @keyup.enter="dispararGuardar"
      />

      <!-- Botones Escritorio -->
      <div class="flex justify-between items-center mt-1 pt-4 border-t border-[#e2e8dd] w-full">
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-sm !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl font-semibold cursor-pointer w-[47%] flex justify-center items-center"
          @click="localVisible = false"
        />
        <Button
          label="Guardar"
          :loading="guardando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold !py-2.5 rounded-xl border-none cursor-pointer shadow-lg transition-colors w-[47%] flex justify-center items-center"
          @click="dispararGuardar"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { useCategoriaStore } from '../../stores/categoriaStore'
import { mostrarAccesoDenegado, mostrarError, mostrarExito } from '@/utils/SweetAlertService'
import BaseInput from '../base/BaseInput.vue'
import BaseInputPercent from '@/components/base/BaseInputPercent.vue'

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
.p-inputnumber-input:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>