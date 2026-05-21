<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="EDITAR USUARIO"
    :style="{ width: '500px' }"
    :draggable="false"
    class="custom-dialog"
    :pt="{
      root: { class: 'rounded-2xl overflow-hidden' }
    }"
  >
    <div class="bg-[#ffffff] p-2 text-[#1a2e1f] flex flex-col gap-5 font-['Inter',sans-serif]">
      
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Clave de caja</label>
        <InputText
          v-model="form.cashKey"
          placeholder="Ingrese código de caja"
          class="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg focus:border-[#2b5e3b]"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Contraseña nueva</label>
        <Password
          v-model="form.password"
          toggleMask
          :feedback="false"
          placeholder="********"
          class="w-full"
          inputClass="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg focus:border-[#2b5e3b]"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Confirmar contraseña</label>
        <Password
          v-model="form.confirmPassword"
          toggleMask
          :feedback="false"
          placeholder="********"
          class="w-full"
          inputClass="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg focus:border-[#2b5e3b]"
        />
      </div>

      <div class="flex justify-between mt-6 gap-6">
        <Button
          label="Cancelar"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-[#1a2e1f] text-[14px] font-semibold px-6 py-4 rounded-lg border border-[#cbd5e1] cursor-pointer shadow-sm transition-colors"
          @click="localVisible = false"
        />
        
        <Button
          label="Guardar datos"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-5 py-4 rounded-lg border-none cursor-pointer shadow-lg transition-colors"
          @click="handleUpdate"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const props = defineProps({
  visible: { type: Boolean, default: false },
  user: {
    type: Object,
    default: () => ({ }) 
  }
})

const emit = defineEmits(['update:visible', 'update'])

const localVisible = ref(props.visible)

watch(() => props.visible, (val) => localVisible.value = val)
watch(localVisible, (val) => emit('update:visible', val))

const form = reactive({
  cashKey: '',
  password: '',
  confirmPassword: ''
})

watch(
  () => props.user,
  (val) => {
    if (val) {
      form.cashKey = val.cashKey || ''
    }
  },
  { immediate: true, deep: true }
)

const handleUpdate = () => {
  emit('update', { ...form })
  localVisible.value = false
}
</script>

<style>
/* Estilos estructurales del cuadro de diálogo adaptados a la nueva paleta clara */
.custom-dialog .p-dialog-header {
  background-color: #1e3a2f !important; /* Sidebar fondo / Header modal */
  color: #ffffff !important;
  border-bottom: 1px solid #e2e8dd;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 1.25rem 1.5rem !important;
}

.custom-dialog .p-dialog-content {
  background-color: #ffffff !important; /* Modal tarjetas/fondo interno blanco */
  padding: 1.5rem !important;
}

/* Color principal para enfoques en inputs dentro del modal */
.p-inputtext:enabled:focus, .p-password-input:enabled:focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}

.p-password-toggle-icon {
  color: #6b7280 !important;
}
</style>