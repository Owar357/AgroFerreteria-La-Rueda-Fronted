<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="EDITAR USUARIO"
    :style="{ width: '500px' }"
    :draggable="false"
    class="custom-dialog"
    :pt="{ root: { class: 'rounded-2xl overflow-hidden' } }"
    @hide="resetForm"
  >
    <div class="bg-[#ffffff] p-2 text-[#1a2e1f] flex flex-col gap-5 font-['Inter',sans-serif]">

      <!-- Clave de caja -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Clave de caja</label>
        <InputText
          v-model="form.cashKey"
          placeholder="Ingrese código de caja"
          maxlength="6"
          @input="validarCashKey"
          :class="[
            'w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg',
            errors.cashKey ? 'border-red-500 border' : 'border-[#d1d5db]'
          ]"
        />
        <small v-if="errors.cashKey" class="text-red-600 text-[12px] font-medium">{{ errors.cashKey }}</small>
        <small class="text-[13px] text-[#6b7280]">(solo si el usuario apertura caja)</small>
      </div>

      <!-- Contraseña nueva -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Contraseña nueva</label>
        <Password
          v-model="form.password"
          toggleMask
          :feedback="false"
          placeholder="********"
          @input="validarPassword"
          class="w-full"
          :inputClass="[
            'w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg',
            errors.password ? 'border-red-500 border' : 'border-[#d1d5db]'
          ].join(' ')"
        />
        <small v-if="errors.password" class="text-red-600 text-[12px] font-medium">{{ errors.password }}</small>
        <small class="text-[13px] text-[#6b7280]"></small>
      </div>

      <!-- Confirmar contraseña -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Confirmar contraseña</label>
        <Password
          v-model="form.confirmPassword"
          toggleMask
          :feedback="false"
          placeholder="********"
          @input="validarConfirmPassword"
          class="w-full"
          :inputClass="[
            'w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg',
            errors.confirmPassword ? 'border-red-500 border' : 'border-[#d1d5db]'
          ].join(' ')"
        />
        <small v-if="errors.confirmPassword" class="text-red-600 text-[12px] font-medium">{{ errors.confirmPassword }}</small>
      </div>

      <div class="flex justify-between mt-6 gap-6">
        <Button
          label="Cancelar"
          class="!bg-white hover:!bg-[#e2e8dd] !text-[#1a2e1f] text-[14px] font-semibold px-6 py-4 rounded-lg !border !border-[#cbd5e1] cursor-pointer transition-colors"
          @click="localVisible = false"
        />
        <Button
          label="Guardar datos"
          :loading="loading"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-5 py-4 rounded-lg border-none cursor-pointer shadow-lg transition-colors"
          @click="handleUpdate"
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
import Swal      from 'sweetalert2'

const props = defineProps({
  visible: { type: Boolean, default: false },
  user:    { type: Object,  default: () => ({}) }
})

const emit = defineEmits(['update:visible', 'update'])

const localVisible = ref(false)
const loading      = ref(false)

const form = reactive({
  cashKey:  '',
  password:  '',
  confirmPassword: ''
})

const errors = reactive({
  cashKey:  '',
  password: '',
  confirmPassword: ''
})

watch(() => props.visible, (val) => (localVisible.value = val))
watch(localVisible, (val) => emit('update:visible', val))

watch(
  () => props.user,
  (val) => {
    if (val) {
      form.cashKey = val.cashKey || ''
      form.password = ''
      form.confirmPassword = ''
      errors.cashKey = errors.password = errors.confirmPassword = ''
    }
  },
  { immediate: true, deep: true }
)

const resetForm = () => {
  form.cashKey = form.password = form.confirmPassword = ''
  errors.cashKey = errors.password = errors.confirmPassword = ''
}

// ── Validaciones individuales ────────────────────────────────────────────────
const validarCashKey = () => {
  const v = form.cashKey.trim()
  if (!v) { errors.cashKey = ''; return true } // es opcional
  if (!/^\d+$/.test(v)) { errors.cashKey = 'La clave de caja solo puede contener números.'; return false }
  if (v.length !== 6)   { errors.cashKey = 'La clave de caja debe tener exactamente 6 dígitos.'; return false }
  errors.cashKey = ''
  return true
}

const validarPassword = () => {
  const v = form.password
  if (!v) { errors.password = ''; return true } // es opcional
  if (v.length < 8) { errors.password = 'Mínimo 8 caracteres.'; return false }
  if (/\s/.test(v)) { errors.password = 'No puede contener espacios.'; return false }
  if (!/[A-Z]/.test(v) || !/[a-z]/.test(v) || !/[0-9]/.test(v) || !/[^A-Za-z0-9]/.test(v)) { errors.password = 'Debe incluir mayúscula, minúscula, número y símbolo.'; return false }
  errors.password = ''
  // Re-validar confirmación si ya tiene algo escrito
  if (form.confirmPassword) validarConfirmPassword()
  return true
}

const validarConfirmPassword = () => {
  if (!form.confirmPassword && !form.password) { errors.confirmPassword = ''; return true }
  if (form.confirmPassword !== form.password)  { errors.confirmPassword = 'Las contraseñas no coinciden.'; return false }
  errors.confirmPassword = ''
  return true
}

// ── Guardar (simulación local) ───────────────────────────────────────────────
const handleUpdate = async () => {
  // Validar que al menos un campo tenga datos
  if (!form.cashKey.trim() && !form.password && !form.confirmPassword) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin cambios',
      text: 'Debes modificar al menos un campo para guardar.',
      confirmButtonColor: '#2b5e3b'
    })
    return
  }

  // Ejecutar todas las validaciones
  const cashKeyOk = validarCashKey()
  const passwordOk = validarPassword()
  const confirmOk  = validarConfirmPassword()

  // Si se escribió contraseña, la confirmación es obligatoria
  if (form.password && !form.confirmPassword) {
    errors.confirmPassword = 'Debes confirmar la contraseña.'
    return
  }

  if (!cashKeyOk || !passwordOk || !confirmOk) return

  // Cerrar modal antes del SweetAlert
  localVisible.value = false
  loading.value = true

  // Simulamos un pequeño delay como si fuera una llamada real
  await new Promise(resolve => setTimeout(resolve, 600))
  loading.value = false

  // Emitimos para que el store actualice localmente
  emit('update', {
    id:      props.user?.id,
    cashKey: form.cashKey.trim() || null,
    password: form.password || null
  })

  await Swal.fire({
    icon: 'success',
    title: '¡Datos actualizados!',
    text: 'Los cambios fueron guardados exitosamente.',
    confirmButtonColor: '#2b5e3b',
    confirmButtonText: 'Aceptar',
    timer: 3000,
    timerProgressBar: true,
    
  })
}
</script>

<style>
.swal2-container { z-index: 999999 !important; }

.custom-dialog .p-dialog-header {
  background-color: #1e3a2f !important;
  color: #ffffff !important;
  border-bottom: 1px solid #e2e8dd;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 1.25rem 1.5rem !important;
}

.custom-dialog .p-dialog-content {
  background-color: #ffffff !important;
  padding: 1.5rem !important;
}

.p-inputtext:enabled:focus,
.p-password-input:enabled:focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}

.p-password-toggle-icon { color: #6b7280 !important; }
</style>