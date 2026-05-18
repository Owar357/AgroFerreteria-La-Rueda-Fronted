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
    <div class="bg-[#09180a] p-2 text-[#EAEAEA] flex flex-col gap-5 font-[Poppins]">
      
      <div class="flex flex-col gap-2">
        <label class="text-[18px] font-medium popins">Clave de caja</label>
        <InputText
          v-model="form.cashKey"
          placeholder="Ingrese código de caja"
          class="w-full bg-[#323232] border-[#444] text-[#EAEAEA] text-[18px] h-12 px-4 rounded-lg focus:border-[#f59e0b]"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[18px] font-medium popins">Contraseña nueva</label>
        <Password
          v-model="form.password"
          toggleMask
          :feedback="false"
          placeholder="********"
          class="w-full"
          inputClass="w-full bg-[#323232] border-[#444] text-[#EAEAEA] text-[18px] h-12 px-4 rounded-lg"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[18px] font-medium popins">Confirmar contraseña</label>
        <Password
          v-model="form.confirmPassword"
          toggleMask
          :feedback="false"
          placeholder="********"
          class="w-full"
          inputClass="w-full bg-[#323232] border-[#444] text-[#EAEAEA] text-[18px] h-12 px-4 rounded-lg"
        />
      </div>

      <div class="flex justify-between mt-6 gap-6">
        <Button
          label="Cancelar"
          class="!bg-[#074e09] text-white text-[20px] px-8 py- rounded-lg border-none font-bold popins shadow-md transition-colors"
          @click="localVisible = false"
        />
        
        <Button
          label="Guardar datos"
          class="!bg-[#074e09] text-white text-[18px] px-8 py-3 rounded-lg border-none font-bold popins shadow-lg"
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
/* Estilos estructurales del cuadro de diálogo */
.custom-dialog .p-dialog-header {
  background-color: #053807 !important;
  color: #fff !important;
  border-bottom: 1px solid #333;
  font-style: italic;
  font-family: 'Poppins', sans-serif;
}

.custom-dialog .p-dialog-content {
  background-color: #0a5a12 !important;
  padding: 1.5rem !important;
}

/* Color naranja enfocado específico para mantener la coherencia visual al editar */
.p-inputtext:enabled:focus {
  box-shadow: none;
  border-color: #f59e0b !important;
}
</style>