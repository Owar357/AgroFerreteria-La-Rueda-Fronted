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
    <div class="bg-[#ffffff] p-2 text-[#1a2e1f] flex flex-col gap-5 font-['Inter',sans-serif]">
      
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Nombre</label>
        <InputText
          v-model="form.name"
          placeholder="Nombre completo"
          class="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg focus:border-[#2b5e3b]"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Email</label>
        <InputText
          v-model="form.email"
          placeholder="correo@ejemplo.com"
          class="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg focus:border-[#2b5e3b]"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Contraseña</label>
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
        <label class="text-[14px] font-medium text-[#1a2e1f]">Rol</label>
        <Dropdown
          v-model="form.role"
          :options="roles"
          placeholder="Seleccionar rol"
          class="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] text-[14px] h-11 flex items-center px-2 rounded-lg"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Clave de caja</label>
        <InputText
          v-model="form.cashKey"
          placeholder="Código de apertura"
          class="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg focus:border-[#2b5e3b]"
        />
        <small class="text-[13px] text-[#6b7280] font-normal mt-1">
          (Si el usuario podrá aperturar caja, ingresar código)
        </small>
      </div>

      <div class="flex justify-center mt-4">
        <Button
          label="Guardar"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-5 py-3 rounded-lg border-none cursor-pointer shadow-lg transition-colors"
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
import Dropdown from 'primevue/dropdown'
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
/* Estilos estructurales del cuadro de diálogo adaptados a la nueva línea visual */
.custom-dialog .p-dialog-header {
  background-color: #1e3a2f !important; /* Sidebar fondo / Cabecera de modales */
  color: #ffffff !important;
  border-bottom: 1px solid #e2e8dd;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 1.25rem 1.5rem !important;
}

.custom-dialog .p-dialog-content {
  background-color: #ffffff !important; /* Contenedor interno en Blanco Puro */
  padding: 1.5rem !important;
}

/* Enfoque global de inputs en color principal #2b5e3b */
.p-inputtext:enabled:focus, .p-dropdown:not(.p-disabled).p-focus, .p-password-input:enabled:focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}

.p-dropdown {
  background-color: #f9fafb !important;
  border-color: #d1d5db !important;
}

.p-dropdown-label {
  color: #1a2e1f !important;
}

.p-dropdown-overlay {
  background-color: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
}

.p-dropdown-item {
  color: #1a2e1f !important;
  font-size: 14px !important;
}

.p-dropdown-item:not(.p-highlight):not(.p-disabled):hover {
  background-color: #eef2e9 !important;
}

.p-password-toggle-icon {
  color: #6b7280 !important;
}
</style>