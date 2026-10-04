<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="EDITAR PRESENTACIÓN"
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
      
      <!-- Campos del formulario para Móvil -->
      <BaseInput
        v-model="form.nombre"
        label="Nombre *"
        placeholder="Ej: Bolsa 1kg"
        filter="alphanum"
        :error="errores.nombre"
      />

      <div class="flex flex-col gap-2">
        <label class="text-xs font-medium text-[#1a2e1f] flex items-center gap-1 flex-wrap">
          ¿Cuánto equivale esta presentación en
          <span class="whitespace-nowrap inline-block bg-[#dff0e0] text-[#2b5e3b] text-[12px] font-semibold px-2 py-0.5 rounded-md">
            {{ presentacion?.unidadMedida?.nombre || '—' }} ?
          </span>
        </label>

        <BaseInputNumber
          v-model="form.factor_conversion"
          placeholder="0"
          :min="1"
          :max="999999"
          :max-fraction-digits="0"
          :use-grouping="true"
          :disabled="factorBloqueado"
        />

        <small v-if="factorBloqueado" class="text-[11px] text-[#2b5e3b] flex items-center gap-1">
          <i class="pi pi-lock" style="font-size: 10px"></i>
          Es la unidad base de este producto, el factor de conversión fijo es (1).
        </small>
        <small v-else-if="errores.factor_conversion" class="text-red-500 text-[11px]">
          {{ errores.factor_conversion }}
        </small>
        <small v-else class="text-[11px] text-gray-400">
          Debe ser un número entero entre 1 y 999,999.
        </small>
      </div>

      <BaseInputNumberMoney
        v-model="form.precio"
        label="Precio *"
        placeholder="$ 0.00"
        :error="errores.precio"
      />

      <!-- Botones Móvil -->
      <div class="pt-3 flex flex-col gap-2 w-full">
        <Button
          label="Guardar"
          :loading="guardando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-xs font-bold py-3 rounded-xl border-none cursor-pointer shadow-md w-full"
          @click="guardar"
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
      
      <!-- Campos del formulario para Escritorio -->
      <BaseInput
        v-model="form.nombre"
        label="Nombre *"
        placeholder="Ej: Bolsa 1kg"
        filter="alphanum"
        :error="errores.nombre"
      />

      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#1a2e1f] flex items-center gap-1 flex-wrap">
          ¿Cuánto equivale esta presentación en
          <span class="whitespace-nowrap inline-block bg-[#dff0e0] text-[#2b5e3b] text-[13px] font-semibold px-2 py-0.5 rounded-md">
            {{ presentacion?.unidadMedida?.nombre || '—' }} ?
          </span>
        </label>

        <BaseInputNumber
          v-model="form.factor_conversion"
          placeholder="0"
          :min="1"
          :max="999999"
          :max-fraction-digits="0"
          :use-grouping="true"
          :disabled="factorBloqueado"
        />

        <small v-if="factorBloqueado" class="text-[12px] text-[#2b5e3b] flex items-center gap-1">
          <i class="pi pi-lock" style="font-size: 11px"></i>
          Es la unidad base de este producto, el factor de conversión fijo es (1).
        </small>
        <small v-else-if="errores.factor_conversion" class="text-red-500 text-[12px]">
          {{ errores.factor_conversion }}
        </small>
        <small v-else class="text-[12px] text-gray-400">
          Debe ser un número entero entre 1 y 999,999.
        </small>
      </div>

      <BaseInputNumberMoney
        v-model="form.precio"
        label="Precio *"
        placeholder="$ 0.00"
        :error="errores.precio"
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
          @click="guardar"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { updatePresentacion } from '@/services/productoService'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseInputNumber from '@/components/base/BaseInputNumber.vue'
import BaseInputNumberMoney from '@/components/base/BaseInputNumberMoney.vue'
import { 
  mostrarExito, 
  mostrarError, 
  mostrarAlertaConfirmar, 
  mostrarCargando 
} from '@/utils/SweetAlertService'

const props = defineProps({
  visible: { type: Boolean, default: false },
  presentacion: { type: Object, default: null },
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

const factorBloqueado = computed(() => {
  const unidadNombre = (props.presentacion?.unidadMedida?.nombre || '').toLowerCase().trim()
  const esBase = props.presentacion?.es_base === true

  const unidadesUnidadFija = ['unidad', 'pieza']

  const unidadesMasaConBase = [
    'gramo',
    'libra',
    'kilogramo',
    'arroba',
    'quintal',
    'mililitro',
    'litro',
    'galón',
    'centímetro',
    'metro'
  ]

  if (unidadesUnidadFija.includes(unidadNombre)) return true
  if (unidadesMasaConBase.includes(unidadNombre) && esBase) return true

  return false
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
      let factor = Number(val.factor_conversion) || null
      if (factorBloqueado.value) {
        factor = 1
      }
      form.value = {
        nombre: val.nombre || '',
        factor_conversion: factor,
        precio: parseFloat(val.precio) || null,
      }
    }
  },
  { immediate: true },
)

const resetForm = () => {
  form.value = { nombre: '', factor_conversion: null, precio: null }
  errores.value = { nombre: '', factor_conversion: '', precio: '' }
  guardando.value = false
}

const guardar = async () => {
  errores.value = { nombre: '', factor_conversion: '', precio: '' }

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

  if (!factorBloqueado.value) {
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
  }

  if (!form.value.precio || form.value.precio <= 0) {
    errores.value.precio = 'El precio debe ser mayor a 0.'
  }

  if (errores.value.nombre || errores.value.factor_conversion || errores.value.precio) return

  guardando.value = true


  mostrarCargando('Actualizando presentación...', 'Por favor espera un momento')

  const factorParaEnviar = factorBloqueado.value ? 1 : Number(form.value.factor_conversion)
  const payload = {
    nombre: form.value.nombre.trim(),
    factor_conversion: factorParaEnviar,
    precio_venta: Number(form.value.precio),
  }

  try {
 

    const [response] = await Promise.all([
      updatePresentacion(props.presentacion.id, payload),
      new Promise((resolve) => setTimeout(resolve, 500)) 
    ])

    const actualizada = response.data.presentación ?? response.data.data ?? response.data

    emit('guardar', {
      ...props.presentacion,
      nombre: actualizada.nombre,
      factor_conversion: Number(actualizada.factor_conversion),
      precio: parseFloat(actualizada.precio_venta),
    })

    localVisible.value = false


    mostrarExito('¡Presentación actualizada!', 'Los datos se guardaron correctamente.')

  } catch (error) {
    const status = error.response?.status

    if (status === 422) {
      mostrarAlertaConfirmar({
        tipo: 'advertencia',
        titulo: 'Error de validación',
        mensajeHtml: 'Revisa los datos enviados e intenta nuevamente.'
      })
    } else if (status === 404) {
      mostrarError('No encontrada', 'La presentación ya no existe en el sistema.')
    } else {
      mostrarError('Error al actualizar', error.response?.data?.message || 'No se pudo actualizar la presentación.')
    }
  } finally {
    guardando.value = false
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
</style>