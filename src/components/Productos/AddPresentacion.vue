<template>
  <Dialog v-model:visible="localVisible" modal header="AÑADIR NUEVA PRESENTACIÓN" :style="{ width: '450px' }"
    :draggable="false" class="custom-dialog" :pt="{ root: { class: 'rounded-2xl overflow-hidden' } }" @hide="resetForm">
    <div class="bg-white p-2 text-[#1a2e1f] flex flex-col gap-5 font-['Inter',sans-serif]">

      <!-- Nombre -->
      <BaseInput
        v-model="form.nombre"
        label="Nombre *"
        placeholder="Ej: Bolsa 1kg"
        filter="alphanum"
      />

      <!-- Factor de conversión -->
      <BaseInputNumber
        v-model="form.factor_conversion"
        :label="`¿Cuántos <span class='bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded border border-amber-200 mx-0.5 shadow-sm text-[13px]'>${unidadBase || 'unidades'}</span> contiene tu presentación? *`"
        placeholder="Ej: 10"
        :min="1"
        :max="1000000"
        :max-fraction-digits="0"
        :use-grouping="true"
      />

      <!-- Precio -->
      <BaseInputNumberMoney
        v-model="form.precio"
        label="Precio *"
        placeholder="$ 0.00"
      />
      
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
import Button from 'primevue/button'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseInputNumber from '@/components/base/BaseInputNumber.vue'
import BaseInputNumberMoney from '@/components/base/BaseInputNumberMoney.vue'
import { añadirPresentacion } from '@/services/productoService'
import { useproductoStore } from '@/stores/productoStore' // <- Importamos el store de productos/unidades
import Swal from 'sweetalert2'

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

  // 1. Intentamos obtener el ID enviado por prop directas o dentro de presentacion
  let idUnidad = props.unidadMedidaId || props.presentacion?.unidad_medida_id || props.presentacion?.unidad_medida?.id

  // 2. Si no viene el ID pero tenemos la cadena visual "Libra", lo buscamos en las unidades cargadas del store
  if (!idUnidad && props.unidadBase) {
    const unidadEncontrada = store.unidades?.find(
      (u) => u.nombre.toLowerCase().trim() === props.unidadBase.toLowerCase().trim()
    )
    if (unidadEncontrada) {
      idUnidad = unidadEncontrada.id
    }
  }

  if (!idUnidad) {
    mostrarAlerta('warning', 'Unidad requerida', 'No se pudo determinar el ID de la unidad de medida.')
    return
  }

  guardando.value = true

  const payload = {
    nombre: form.value.nombre,
    unidad_medida_id: Number(idUnidad), // Mandamos explícitamente el ID recuperado
    factor_conversion: form.value.factor_conversion,
    precio_venta: form.value.precio,
    producto_id: props.productoId
  }

  try {
    const response = await añadirPresentacion(payload)
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
</style>