<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="AUTORIZACIÓN DE ADMINISTRADOR"
    :style="{ width: '420px' }"
    :draggable="false"
    class="custom-dialog"
    :pt="{ root: { class: 'rounded-2xl overflow-hidden' } }"
    @hide="resetForm"
  >
    <div class="bg-[#ffffff] p-2 text-[#1a2e1f] flex flex-col gap-5 font-['Inter',sans-serif]">

      <p class="text-[14px] text-[#6b7280]">
        {{ descripcion }} <!--cambio-->
      </p>

      <!-- Email -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Correo electrónico <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="form.email"
          placeholder="admin@correo.com"
          autocomplete="off"
          @input="errors.email = ''"
          :class="[
            'w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg',
            errors.email ? 'border-red-500 border' : 'border-[#d1d5db]'
          ]"
        />
        <small v-if="errors.email" class="text-red-600 text-[12px] font-medium">{{ errors.email }}</small>
      </div>

      <!-- Contraseña -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Contraseña <span class="text-red-500">*</span>
        </label>
        <Password
          v-model="form.password"
          toggleMask
          :feedback="false"
          placeholder="********"
          :inputProps="{ autocomplete: 'current-password' }"
          @input="errors.password = ''"
          class="w-full"
          :inputClass="[
            'w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg',
            errors.password ? 'border-red-500 border' : 'border-[#d1d5db]'
          ].join(' ')"
        />
        <small v-if="errors.password" class="text-red-600 text-[12px] font-medium">{{ errors.password }}</small>
      </div>

      
      <div v-if="errorGeneral" class="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
        <small class="text-red-600 text-[13px] font-medium">{{ errorGeneral }}</small>
      </div>

      <div class="flex justify-between gap-4 mt-2">
        <Button
          label="Cancelar"
          class="!bg-white hover:!bg-[#e2e8dd] !text-[#1a2e1f] text-[14px] font-semibold px-6 py-4 rounded-lg !border !border-[#cbd5e1] cursor-pointer transition-colors"
          :disabled="cargando"
          @click="localVisible = false"
        />
        
        <Button
          :label="labelBoton"
          icon="pi pi-unlock"
          :loading="cargando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-6 py-4 rounded-lg border-none cursor-pointer shadow-md transition-colors"
          @click="handleConfirmar"
        />
      </div>

    </div>
  </Dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import Dialog    from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password  from 'primevue/password'
import Button    from 'primevue/button'

const props = defineProps({
  visible: { type: Boolean, default: false },
  labelBoton: {type: String, default: 'Abrir caja' },
  descripcion: { type: String, default: 'Para aperturar la caja ingrese las credenciales del Administrado. '}
})

const emit = defineEmits(['update:visible', 'credenciales-confirmadas'])

const localVisible = ref(false)
const cargando     = ref(false)
const errorGeneral = ref('')

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

watch(() => props.visible, (val) => (localVisible.value = val))
watch(localVisible,        (val) => emit('update:visible', val))

const resetForm = () => {
  form.email    = ''
  form.password = ''
  errors.email  = ''
  errors.password = ''
  errorGeneral.value = ''
}

const validar = () => {
  let ok = true
  errors.email    = ''
  errors.password = ''

  if (!form.email.trim()) {
    errors.email = 'El correo es obligatorio.'
    ok = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Formato de correo inválido.'
    ok = false
  }

  if (!form.password) {
    errors.password = 'La contraseña es obligatoria.'
    ok = false
  }

  return ok
}

const handleConfirmar = () => {
  errorGeneral.value = ''
  if (!validar()) return

  // Emitimos las credenciales al padre para que las use junto al monto
  emit('credenciales-confirmadas', {
    email:    form.email.trim(),
    password: form.password
  })
}

// El padre puede llamar este método para mostrar un error de credenciales
const mostrarError = (mensaje) => {
  errorGeneral.value = mensaje
  cargando.value     = false
}

// El padre puede llamar este método para indicar que está cargando
const setLoading = (val) => { cargando.value = val }

defineExpose({ mostrarError, setLoading, resetForm })
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
.p-password-toggle-icon { color: #6b7280 !important; }
</style>