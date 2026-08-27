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
      <!-- NOMBRE -->
      <!-- Nombre -->
<div class="flex flex-col gap-2">
  <label class="text-[14px] font-medium text-[#1a2e1f]">Nombre</label>

  <InputText
    v-model.trim="form.name"
    placeholder="Ingrese el nombre del usuario"
    maxlength="100"
    autocomplete="name"
    @input="validarNombre"
    :class="[
      'w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg',
      errors.name ? 'border-red-500 border' : 'border-[#d1d5db]',
    ]"
  />

  <small v-if="errors.name" class="text-red-600 text-[12px] font-medium">
    {{ errors.name }}
  </small>
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
          :inputProps="{ autocomplete: 'new-password' }"
          class="w-full"
          :inputClass="
            [
              'w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg',
              errors.password ? 'border-red-500 border' : 'border-[#d1d5db]',
            ].join(' ')
          "
        />
        <small v-if="errors.password" class="text-red-600 text-[12px] font-medium">{{
          errors.password
        }}</small>
        <small class="text-[13px] text-[#6b7280]"
          >(Opcional — dejar vacío para no cambiar la contraseña)</small
        >
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
          :inputProps="{ autocomplete: 'new-password' }"
          :inputClass="
            [
              'w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg',
              errors.confirmPassword ? 'border-red-500 border' : 'border-[#d1d5db]',
            ].join(' ')
          "
        />
        <small v-if="errors.confirmPassword" class="text-red-600 text-[12px] font-medium">{{
          errors.confirmPassword
        }}</small>
      </div>

      <div class="flex justify-between mt-6 gap-6">
        <Button
          label="Cancelar"
          class="!bg-white hover:!bg-[#e2e8dd] !text-[#1a2e1f] text-[14px] font-semibold px-6 py-4 rounded-lg !border !border-[#cbd5e1] cursor-pointer transition-colors"
          :disabled="loading"
          @click="localVisible = false"
        />
        <Button
          label="Guardar datos"
          :loading="loading"
          :disabled="!tieneCambios"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-5 py-4 rounded-lg border-none cursor-pointer shadow-lg transition-colors"
          @click="handleUpdate"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Swal from 'sweetalert2'
import { useUserStore } from '@/stores/usuarioStore'

const props = defineProps({
  visible: { type: Boolean, default: false },
  user: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:visible'])

const store = useUserStore()
const localVisible = ref(false)
const loading = ref(false)

const form = reactive({
  name: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  name: '',
  password: '',
  confirmPassword: '',
})

const cargarDatosUsuario = () => {
  form.name = props.user?.name ?? ''
  form.password = ''
  form.confirmPassword = ''

  errors.name = ''
  errors.password = ''
  errors.confirmPassword = ''
}

watch(
  () => props.visible,
  (visible) => {
    localVisible.value = visible

    if (visible) {
      cargarDatosUsuario()
     
    }
  },
  { immediate: true },
)

watch(
  () => props.user,
  () => {
    if (localVisible.value) {
      cargarDatosUsuario()
       console.log('Usuario a editar:', props.user)
    }
  },
  { deep: true },
)

watch(localVisible, (visible) => {
  emit('update:visible', visible)
})

const resetForm = () => {
  form.name = ''
  form.password = ''
  form.confirmPassword = ''

  errors.name = ''
  errors.password = ''
  errors.confirmPassword = ''
}
//validaciones para el nombre
const validarNombre = () => {
  const nombre = form.name.trim()

  if (!nombre) {
    errors.name = 'El nombre es obligatorio.'
    return false
  }

  if (nombre.length < 10) {
    errors.name = 'El nombre debe tener al menos 10 caracteres.'
    return false
  }

  // Expresión regular: Solo letras (con tildes/ñ) y espacios
  const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  
  if (!regexLetras.test(nombre)) {
    errors.name = 'El nombre no puede contener números ni caracteres especiales.'
    return false
  }

  errors.name = ''
  return true
}

const validarPassword = () => {
  const v = form.password
  if (!v) {
    errors.password = ''
    return true
  }
  if (v.length < 8) {
    errors.password = 'Mínimo 8 caracteres.'
    return false
  }
  if (/\s/.test(v)) {
    errors.password = 'No puede contener espacios.'
    return false
  }
  if (!/[A-Z]/.test(v) || !/[a-z]/.test(v) || !/[0-9]/.test(v) || !/[^A-Za-z0-9]/.test(v)) {
    errors.password = 'Debe incluir mayúscula, minúscula, número y símbolo.'
    return false
  }
  errors.password = ''
  if (form.confirmPassword) validarConfirmPassword()
  return true
}

const validarConfirmPassword = () => {
  if (!form.confirmPassword && !form.password) {
    errors.confirmPassword = ''
    return true
  }
  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden.'
    return false
  }
  errors.confirmPassword = ''
  return true
}


const tieneCambios = computed(() => {
  const nombreOriginal = props.user?.name ?? ''
  
  // Si cambió el nombre, o si escribió algo en el campo de contraseña
  const cambioNombre = form.name.trim() !== nombreOriginal.trim()
  const cambioPassword = form.password.length > 0

  return cambioNombre || cambioPassword
})

// Guardamos
const handleUpdate = async () => {

  //  NUEVA VALIDACIÓN: Si no se modificó nada, frena y avisa
  if (!tieneCambios.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin cambios',
      text: 'No se editó ningún campo.',
      confirmButtonColor: '#2b5e3b',
      confirmButtonText: 'Entendido'
    })
    return
  }
  const nombreOk = validarNombre()
  const passwordOk = validarPassword()
  const confirmOk = validarConfirmPassword()

  if (form.password && !form.confirmPassword) {
    errors.confirmPassword = 'Debes confirmar la contraseña.'
    return
  }

  if (!nombreOk || !passwordOk || !confirmOk) return

  loading.value = true

  const payload = {
    name: form.name.trim(),
    rol: props.user?.roles?.[0]?.name || '',
  }

  if (form.password) {
    payload.password = form.password
    payload.password_confirmation = form.confirmPassword
  }

  const resultado = await store.updateUser(props.user?.id, payload)

  loading.value = false

  if (resultado.ok) {
    localVisible.value = false

    await Swal.fire({
      icon: 'success',
      title: '¡Datos actualizados!',
      text: 'Los datos del usuario fueron actualizados exitosamente.',
      confirmButtonColor: '#2b5e3b',
      confirmButtonText: 'Aceptar',
    })
  } else if (resultado.error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al actualizar',
      text: resultado.error,
      confirmButtonColor: '#2b5e3b',
    })
  }
}
</script>

<style>
.swal2-container {
  z-index: 999999 !important;
}

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

.p-password-toggle-icon {
  color: #6b7280 !important;
}
</style>
