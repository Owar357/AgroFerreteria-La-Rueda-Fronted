<template>
  <Dialog v-model:visible="localVisible" modal header="AÑADIR NUEVA PRESENTACIÓN" :style="{ width: '450px' }"
    :draggable="false" class="custom-dialog" :pt="{ root: { class: 'rounded-2xl overflow-hidden' } }" @hide="resetForm">
    <div class="bg-white p-2 text-[#1a2e1f] flex flex-col gap-5 font-['Inter',sans-serif]">

      <!-- Nombre -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Nombre <span class="text-red-500">*</span>
        </label>
        <InputText v-model="form.nombre" placeholder="Ej: Bolsa 1kg"
          class="w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg border-[#d1d5db]" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f] flex items-center gap-1 flex-wrap">
          ¿Cuántos
          <span class="inline-block bg-[#dff0e0] text-[#2b5e3b] text-[13px] font-semibold px-2 py-0.5 rounded-md">
            {{ unidadBase || '—' }}
          </span>
          contiene tu presentación? <span class="text-red-500">*</span>
        </label>
        <InputNumber v-model="form.factor_conversion" :min="1" :useGrouping="false"
          inputClass="w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg border-[#d1d5db]"
          class="w-full" />
      </div>
      <!-- Precio -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Precio <span class="text-red-500">*</span>
        </label>
        <InputNumber v-model="form.precio" mode="currency" currency="USD" locale="es-US" :min="0.01"
          inputClass="w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg border-[#d1d5db]"
          class="w-full" />
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
import InputText from 'primevue/inputtext'        // ⬅️ te faltaba importar
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import { añadirPresentacion } from '@/services/productoService'
import Swal from 'sweetalert2'

const props = defineProps({
  visible: { type: Boolean, default: false },
  presentacion: { type: Object, default: null },
  unidadBase: { type: String, default: '' },
  productoId: { type: [Number, String], required: true }
})

const emit = defineEmits(['update:visible', 'guardar'])

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


const mostrarAlerta = (tipo, titulo, texto) => {
  Swal.fire({
    icon: tipo,
    title: titulo,
    text: texto,
    confirmButtonColor: '#2b5e3b',
    customClass: {
      container: '!z-[9999]',
    },
  })
}

const guardar = async () => {
  if (!form.value.nombre || !form.value.factor_conversion || !form.value.precio) {
    mostrarAlerta('warning', 'Campos incompletos', 'Completa todos los campos requeridos.')
    return
  }

  guardando.value = true

  const payload = {
    nombre: form.value.nombre,
    factor_conversion: form.value.factor_conversion,
    precio_venta: form.value.precio,
    producto_id: props.productoId
  }

  try {

    const response = await añadirPresentacion(payload)
    console.log('respuesta backend:', JSON.stringify(response.data, null, 2))
    const nueva = response.data.data ?? response.data
    console.log('nueva:', JSON.stringify(nueva, null, 2))

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

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: '¡Presentación creada con éxito!',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: '#ffffff',
      color: '#1e3a2f',
      iconColor: '#2b5e3b',
      customClass: {
        container: '!z-[9999]',
      },
    })
  } catch (error) {
    const status = error.response?.status
    if (status === 422) {
      mostrarAlerta('warning', 'Error de validación', 'Revisa los datos enviados e intenta nuevamente.')
    } else {
      mostrarAlerta('error', 'Error', 'No se pudo crear la presentación.')
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