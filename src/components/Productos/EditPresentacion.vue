<template>
  <Dialog v-model:visible="localVisible" modal header="EDITAR PRESENTACIÓN" :style="{ width: '450px' }"
    :draggable="false" class="custom-dialog" :pt="{ root: { class: 'rounded-2xl overflow-hidden' } }" @hide="resetForm">
    <div class="bg-white p-2 text-[#1a2e1f] flex flex-col gap-5 font-['Inter',sans-serif]">
      <!-- Nombre -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Nombre <span class="text-red-500">*</span>
        </label>
        <InputText v-model="form.nombre" placeholder="Ej: Bolsa 1kg"
          class="w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg border-[#d1d5db]" />
        <small v-if="errores.nombre" class="text-red-500 text-[12px]">{{ errores.nombre }}</small>
      </div>

      <!-- Factor de conversión con unidad base -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f] flex items-center gap-1 flex-wrap">
          ¿Cuánto equivale esta presentación en
          <span class="inline-block bg-[#dff0e0] text-[#2b5e3b] text-[13px] font-semibold px-2 py-0.5 rounded-md">
            {{ unidadBase || presentacion?.unidad_medida?.nombre || '—' }} ?
          </span>
        </label>
        <InputText v-model="form.factor_conversion" placeholder="0" maxlength="6"
          class="w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg border-[#d1d5db] focus:!border-[#2b5e3b]" />
        <small v-if="errores.factor_conversion" class="text-red-500 text-[12px]">{{ errores.factor_conversion }}</small>
        <small v-else class="text-[12px] text-gray-400">Debe ser un número entero entre 1 y 999,999.</small>
      </div>

      <!-- Precio -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Precio <span class="text-red-500">*</span>
        </label>
        <InputNumber v-model="form.precio" mode="currency" currency="USD" locale="es-US" :min="0.01"
          inputClass="w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg border-[#d1d5db]"
          class="w-full" />
        <small v-if="errores.precio" class="text-red-500 text-[12px]">{{ errores.precio }}</small>
      </div>

      <!-- Botones -->
      <div class="flex justify-between gap-4 mt-2">
        <Button label="Cancelar"
          class="!bg-white hover:!bg-[#e2e8dd] !text-[#1a2e1f] text-[14px] font-semibold px-4 py-4 rounded-lg !border !border-[#cbd5e1] cursor-pointer transition-colors"
          @click="localVisible = false" />
        <Button label="Guardar" :loading="guardando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-4 py-4 rounded-lg border-none cursor-pointer shadow-md transition-colors"
          @click="guardar" />
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
import Swal from 'sweetalert2'
import { updatePresentacion } from '@/services/productoService'

const props = defineProps({
  visible: { type: Boolean, default: false },
  presentacion: { type: Object, default: null },
  unidadBase: { type: String, default: '' },
  presentacionesExistentes: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:visible', 'guardar'])

const localVisible = ref(false)
const guardando = ref(false)
const errores = ref({ nombre: '', factor_conversion: '', precio: '' })

const form = ref({
  nombre: '',
  factor_conversion: null,
  precio: null,
})

watch(
  () => props.visible,
  (val) => { localVisible.value = val },
)
watch(localVisible, (val) => {
  emit('update:visible', val)
})

watch(
  () => props.presentacion,
  (val) => {
    if (val) {
      form.value = {
        nombre: val.nombre || '',
        factor_conversion: Number(val.factor_conversion) || null,
        precio: parseFloat(val.precio_venta) || null,
      }
    }
  },
  { immediate: true },
)

// Filtro para solo números y límite 999999
watch(() => form.value.factor_conversion, (nuevoValor) => {
  if (nuevoValor !== undefined && nuevoValor !== null) {
    let soloNumeros = nuevoValor.toString().replace(/[^0-9]/g, '')
    if (soloNumeros === '') {
      form.value.factor_conversion = ''
      return
    }
    let numeroMaximo = parseInt(soloNumeros, 10)
    if (numeroMaximo > 999999) {
      form.value.factor_conversion = 999999
    } else {
      form.value.factor_conversion = numeroMaximo
    }
  }
})

const resetForm = () => {
  form.value = { nombre: '', factor_conversion: null, precio: null }
  errores.value = { nombre: '', factor_conversion: '', precio: '' }
  guardando.value = false
}

const guardar = async () => {
  // Reiniciar errores
  errores.value = { nombre: '', factor_conversion: '', precio: '' }

  // --- Validar Nombre ---
  if (!form.value.nombre.trim()) {
    errores.value.nombre = 'El nombre es obligatorio.'
  } else {
    const nombreDuplicado = props.presentacionesExistentes.some(
      (p) => p.nombre.trim().toLowerCase() === form.value.nombre.trim().toLowerCase() && p.id !== props.presentacion?.id
    )
    if (nombreDuplicado) {
      errores.value.nombre = 'Ya existe una presentación con este nombre.'
    }
  }

  // --- Validar Factor de conversión ---
  const factor = form.value.factor_conversion
  if (factor === null || factor === '' || factor === undefined) {
    errores.value.factor_conversion = 'El factor de conversión es obligatorio.'
  } else {
    const num = Number(factor)
    if (!Number.isInteger(num)) {
      errores.value.factor_conversion = 'Debe ser un número entero.'
    } else if (num <= 0) {
      errores.value.factor_conversion = 'Debe ser mayor a 0.'
    } else if (num > 999999) {
      errores.value.factor_conversion = 'No puede superar los 999,999.'
    }
  }

  // --- Validar Precio ---
  if (!form.value.precio || form.value.precio <= 0) {
    errores.value.precio = 'El precio debe ser mayor a 0.'
  }

  // Si hay errores, detener
  if (errores.value.nombre || errores.value.factor_conversion || errores.value.precio) {
    return
  }

  // --- Envío ---
  guardando.value = true
  const payload = {
    nombre: form.value.nombre.trim(),
    factor_conversion: Number(form.value.factor_conversion),
    precio_venta: Number(form.value.precio),
  }

  try {
    const response = await updatePresentacion(props.presentacion.id, payload)
    const actualizada = response.data.presentación ?? response.data.data ?? response.data

    emit('guardar', {
      ...props.presentacion,
      nombre: actualizada.nombre,
      factor_conversion: Number(actualizada.factor_conversion),
      precio: parseFloat(actualizada.precio_venta),
    })

    localVisible.value = false

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: '¡Presentación actualizada!',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: '#ffffff',
      color: '#1e3a2f',
      iconColor: '#2b5e3b',
      customClass: { container: '!z-[9999]' },
    })
  } catch (error) {
    const status = error.response?.status
    if (status === 422) {
      // Los errores de backend podrías mostrarlos también debajo de cada campo, pero por ahora dejamos Swal
      Swal.fire({
        icon: 'warning',
        title: 'Error de validación',
        text: 'Revisa los datos enviados e intenta nuevamente.',
        confirmButtonColor: '#2b5e3b',
        customClass: { container: '!z-[9999]' },
      })
    } else if (status === 404) {
      Swal.fire({
        icon: 'error',
        title: 'No encontrada',
        text: 'La presentación ya no existe.',
        confirmButtonColor: '#2b5e3b',
        customClass: { container: '!z-[9999]' },
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la presentación.',
        confirmButtonColor: '#2b5e3b',
        customClass: { container: '!z-[9999]' },
      })
    }
  } finally {
    guardando.value = false
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
:deep(.p-inputnumber-input) {
  width: 100%;
  background: #f9fafb;
  border-radius: 0.5rem;
  border-color: #d1d5db;
  height: 44px;
  padding: 0 1rem;
  font-size: 14px;
}
</style>