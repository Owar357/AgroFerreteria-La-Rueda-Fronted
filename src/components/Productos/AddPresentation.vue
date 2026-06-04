<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="CREAR PRESENTACIÓN"
    :style="{ width: '450px' }"
    :draggable="false"
    class="custom-dialog"
    :pt="{ root: { class: 'rounded-2xl overflow-hidden' } }"
    @hide="resetForm"
  >
    <div class="bg-white p-2 text-[#1a2e1f] flex flex-col gap-5 font-['Inter',sans-serif]">

      <!-- Nombre -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Nombre <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="form.nombre"
          placeholder="Ej: Bolsa 1kg"
          class="w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg border-[#d1d5db]"
        />
      </div>

      <!-- Unidad de medida -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Unidad de medida <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="form.unidadMedida"
          placeholder="Ej: kg, unidad, litro"
          class="w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg border-[#d1d5db]"
        />
      </div>

      <!-- Precio -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Precio <span class="text-red-500">*</span>
        </label>
        <InputNumber
          v-model="form.precio"
          mode="currency"
          currency="USD"
          locale="es-US"
          :min="0.01"
          inputClass="w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg border-[#d1d5db]"
          class="w-full"
        />
      </div>



      <!-- Botones -->
      <div class="flex justify-between gap-4 mt-2">
        <Button
          label="Cancelar"
          class="!bg-white hover:!bg-[#e2e8dd] !text-[#1a2e1f] text-[14px] font-semibold px-4 py-4 rounded-lg !border !border-[#cbd5e1] cursor-pointer transition-colors"
          @click="localVisible = false"
        />
        <Button
          label="Guardar"
          :loading="guardando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-4 py-4 rounded-lg border-none cursor-pointer shadow-md transition-colors"
          @click="guardar"
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
import Swal from 'sweetalert2'

const props = defineProps({
  visible: { type: Boolean, default: false },
  presentacion: { type: Object, default: null }
})

const emit = defineEmits(['update:visible', 'guardar'])

const localVisible = ref(false)
const guardando = ref(false)

const form = ref({
  nombre: '',
  unidadMedida: '',
  precio: null,
  estado: 'ACTIVO'
})

watch(() => props.visible, (val) => { localVisible.value = val })
watch(localVisible, (val) => { emit('update:visible', val) })

// Cuando llega la presentación a editar, llena el form
watch(() => props.presentacion, (val) => {
  if (val) {
    form.value = { ...val }
  }
}, { immediate: true })

const resetForm = () => {
  form.value = { nombre: '', unidadMedida: '', precio: null, estado: 'ACTIVO' }
  guardando.value = false
}

const guardar = () => {
  guardando.value = true
  emit('guardar', { ...form.value })
  localVisible.value = false
  guardando.value = false

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