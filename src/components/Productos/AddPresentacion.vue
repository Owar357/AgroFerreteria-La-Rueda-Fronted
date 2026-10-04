<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="AÑADIR NUEVA PRESENTACIÓN"
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
        label="Nombre"
        placeholder="Ej: Bolsa 1kg"
        filter="alphanum"
      />

      <BaseInputNumber
      v-model="form.factor_conversion"
      :label="`¿Cuántas <span class='inline-flex items-center align-baseline whitespace-nowrap bg-amber-100 text-amber-800 font-semibold  py-0.5 rounded border border-amber-200 mx-1 shadow-sm text-[13px]'>${unidadBase || 'unidades'} </span>contiene tu presentación?`"
      placeholder="Ej: 10"
      :min="1"
      :max="1000000"
      :max-fraction-digits="0"
      :use-grouping="true"
      />

      <BaseInputNumberMoney
        v-model="form.precio"
        label="Precio *"
        placeholder="$ 0.00"
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
      />

      <BaseInputNumber
        v-model="form.factor_conversion"
        :label="`¿Cuántos <span class='bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded border border-amber-200 mx-0.5 shadow-sm text-[13px]'>${unidadBase || 'unidades'}</span> contiene tu presentación? *`"
        placeholder="Ej: 10"
        :min="1"
        :max="1000000"
        :max-fraction-digits="0"
        :use-grouping="true"
      />

      <BaseInputNumberMoney
        v-model="form.precio"
        label="Precio *"
        placeholder="$ 0.00"
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
import { ref, watch } from 'vue'
import Button from 'primevue/button'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseInputNumber from '@/components/base/BaseInputNumber.vue'
import BaseInputNumberMoney from '@/components/base/BaseInputNumberMoney.vue'
import { añadirPresentacion } from '@/services/productoService'
import { useproductoStore } from '@/stores/productoStore'
import {
  mostrarExito,
  mostrarError,
  mostrarAlertaConfirmar,
  mostrarCargando
} from '@/utils/SweetAlertService'

const props = defineProps({
  visible: { type: Boolean, default: false },
  presentacion: { type: Object, default: null },
  unidadBase: { type: String, default: '' },
  unidadMedidaId: { type: [Number, String], default: null },
  productoId: { type: [Number, String], required: true }
})

const emit = defineEmits(['update:visible', 'guardar'])

const store = useproductoStore()
const localVisible = ref(false)
const guardando = ref(false)
const form = ref({
  nombre: '',
  factor_conversion: null,
  precio: null,
})

watch(() => props.visible, (val) => { localVisible.value = val })
watch(localVisible, (val) => { emit('update:visible', val) })
watch(() => props.presentacion, (val) => {
  if (val) form.value = { ...val }
}, { immediate: true })

const resetForm = () => {
  form.value = { nombre: '', factor_conversion: null, precio: null }
  guardando.value = false
}

const guardar = async () => {
  if (!form.value.nombre || !form.value.factor_conversion || !form.value.precio) {
    mostrarAlertaConfirmar({
      tipo: 'advertencia',
      titulo: 'Campos incompletos',
      mensajeHtml: 'Completa todos los campos requeridos.'
    })
    return
  }

  let idUnidad = props.unidadMedidaId || props.presentacion?.unidad_medida_id || props.presentacion?.unidad_medida?.id

  if (!idUnidad && props.unidadBase) {
    const unidadEncontrada = store.unidades?.find(
      (u) => u.nombre.toLowerCase().trim() === props.unidadBase.toLowerCase().trim()
    )
    if (unidadEncontrada) {
      idUnidad = unidadEncontrada.id
    }
  }

  if (!idUnidad) {
    mostrarAlertaConfirmar({
      tipo: 'advertencia',
      titulo: 'Unidad requerida',
      mensajeHtml: 'No se pudo determinar la unidad de medida.'
    })
    return
  }

  guardando.value = true
  mostrarCargando('Guardando presentación...', 'Por favor espera un momento')

  const payload = {
    nombre: form.value.nombre,
    unidad_medida_id: Number(idUnidad),
    factor_conversion: form.value.factor_conversion,
    precio_venta: form.value.precio,
    producto_id: props.productoId
  }

  try {
    const [response] = await Promise.all([
      añadirPresentacion(payload),
      new Promise((resolve) => setTimeout(resolve, 500))
    ])

    const nueva = response.data.data ?? response.data

    emit('guardar', {
      id: nueva.id,
      nombre: nueva.nombre,
      unidadMedida: props.unidadBase,
      factor_conversion: Number(nueva.factor_conversion),
      precio: parseFloat(nueva.precio_venta),
      stock: 0,
      estado: 'ACTIVO',
    })

    localVisible.value = false
    mostrarExito('¡Presentación creada!', 'La nueva presentación fue registrada exitosamente.')
  } catch (error) {
    const status = error.response?.status
    if (status === 422) {
      mostrarAlertaConfirmar({
        tipo: 'advertencia',
        titulo: 'Error de validación',
        mensajeHtml: 'Revisa los datos enviados e intenta nuevamente.'
      })
    } else {
      mostrarError('Error al guardar', error.response?.data?.message || 'No se pudo crear la presentación.')
    }
  } finally {
    guardando.value = false
  }
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