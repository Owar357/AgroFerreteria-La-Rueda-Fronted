<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="AGREGAR USUARIO"
    :style="{ width: '500px' }"
    :draggable="false"
    class="custom-dialog"
    :pt="{
      root: { class: 'rounded-2xl overflow-hidden' }
    }"
  >
    <div class="bg-[#101410] p-2 text-[#EAEAEA] flex flex-col gap-5 font-[Poppins]">
      
      <div class="flex flex-col gap-2">
        <label class="text-[18px] font-medium popins">Nombre</label>
        <InputText
          v-model="form.name"
          placeholder="Nombre completo"
          class="w-full bg-[#0d0c0c] border-[#444] text-[#EAEAEA] text-[18px] h-12 px-4 rounded-lg focus:border-[#4A8C3F]"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[18px] font-medium popins">Email</label>
        <InputText
          v-model="form.email"
          placeholder="correo@ejemplo.com"
          class="w-full bg-[#323232] border-[#444] text-[#EAEAEA] text-[18px] h-12 px-4 rounded-lg focus:border-[#4A8C3F]"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[18px] font-medium popins">Contraseña</label>
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
        <label class="text-[18px] font-medium popins">Rol</label>
        <dropdown
          v-model="form.role"
          :options="roles"
          placeholder="Seleccionar rol"
          class="w-full bg-[#323232] border-[#444] text-[#EAEAEA] text-[18px] h-12 flex items-center px-2 rounded-lg"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[18px] font-medium popins">Clave de caja</label>
        <InputText
          v-model="form.cashKey"
          placeholder="Código de apertura"
          class="w-full bg-[#323232] border-[#444] text-[#EAEAEA] text-[18px] h-12 px-4 rounded-lg"
        />
        <small class="text-[13px] text-[#888] popins mt-1">
          (Si el usuario podrá aperturar caja, ingresar código)
        </small>
      </div>

      <div class="flex justify-center mt-4">
        <Button
          label="Guardar"
          class="!bg-[#074e09] text-white text-[20px] px-7 py-3 rounded-lg border-none font-bold popins shadow-lg"
          @click="handleSave"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown' // Corregido minúscula
import Button from 'primevue/button'

const props = defineProps({
  visible: { type: Boolean, default: false },
  roles: {
    type: Array,
    default: () => ['Administrador', 'Contador', 'Cajero']
  }
})

const emit = defineEmits(['update:visible', 'save'])

const localVisible = ref(props.visible)

watch(() => props.visible, (val) => localVisible.value = val)
watch(localVisible, (val) => emit('update:visible', val))

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: null,
  cashKey: ''
})

const handleSave = () => {
  emit('save', { ...form })
  localVisible.value = false 
}
</script>

<style>
/* Estilos estructurales para el modal oscuro */
.custom-dialog .p-dialog-header {
  background-color: #0a5611 !important;
  color: #ffffff !important;
  border-bottom: 1px solid #333;
  font-style: italic;
}

.custom-dialog .p-dialog-content {
  background-color: #151715 !important;
  padding: 1.5rem !important;
}

.p-inputtext:enabled:focus, .p-dropdown:not(.p-disabled).p-focus {
  box-shadow: none !important;
  border-color: #4A8C3F !important;
}
</style>