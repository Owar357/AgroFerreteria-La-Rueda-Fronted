<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="EDITAR USUARIO"
    :draggable="false"
    :style="{ width: 'min(calc(100vw - 2rem), 34rem)' }"
    class="custom-dialog"
    :pt="{ root: { class: '!rounded-2xl overflow-hidden' } }"
    @hide="resetForm"
  >
    <div class="bg-[#ffffff] p-4 sm:p-6 text-[#1a2e1f] flex flex-col gap-5 font-['Inter',sans-serif]">
      <!-- NOMBRE -->
      <BaseInput
        v-model.trim="form.name"
        label="Nombre"
        placeholder="Ingrese el nombre del usuario"
        filter="alpha"
        maxlength="100"
        autocomplete="name"
        :error="errors.name"
        @input="validarNombre"
      />

      <!-- CONTRASEÑA NUEVA -->
      <BasePassword
        v-model="form.password"
        label="Contraseña nueva"
        size="xl"
        placeholder="********"
        help="(Opcional — dejar vacío para no cambiar la contraseña)"
        :error="errors.password"
        @input="validarPassword"
      />

      <!-- CONFIRMAR CONTRASEÑA -->
      <BasePassword
        v-model="form.confirmPassword"
        label="Confirmar contraseña"
        placeholder="********"
        :error="errors.confirmPassword"
        @input="validarConfirmPassword"
      />

      <!-- BOTÓN PRINCIPAL (ANCHO COMPLETO W-FULL) -->
      <div class="flex justify-center mt-4 w-full">
        <Button
          label="Guardar datos"
          :loading="loading"
          :disabled="!tieneCambios"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold px-7 py-3 rounded-lg border-none cursor-pointer shadow-lg transition-colors w-full"
          @click="handleUpdate"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import Swal from 'sweetalert2'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { useUserStore } from '@/stores/usuarioStore'
import BaseInput from '../base/BaseInput.vue'
import BasePassword from '../base/BasePassword.vue'

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

// Validaciones para el nombre
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

  const cambioNombre = form.name.trim() !== nombreOriginal.trim()
  const cambioPassword = form.password.length > 0

  return cambioNombre || cambioPassword
})

const handleUpdate = async () => {
  if (!tieneCambios.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin cambios',
      text: 'No se editó ningún campo.',
      confirmButtonColor: '#2b5e3b',
      confirmButtonText: 'Entendido',
      customClass: {
        popup: '!rounded-xl !p-4 sm:!p-6',
        confirmButton: '!px-5 !py-2.5 !rounded-lg !text-sm !font-semibold',
      },
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
      customClass: {
        popup: '!rounded-xl !p-4 sm:!p-6',
        confirmButton: '!px-5 !py-2.5 !rounded-lg !text-sm !font-semibold',
      },
    })
  } else if (resultado.error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al actualizar',
      text: resultado.error,
      confirmButtonColor: '#2b5e3b',
      customClass: {
        popup: '!rounded-xl !p-4 sm:!p-6',
        confirmButton: '!px-5 !py-2.5 !rounded-lg !text-sm !font-semibold',
      },
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
  border-bottom: 0.0625rem solid #e2e8dd;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 1.25rem 1.5rem !important;
}

.custom-dialog .p-dialog-content {
  background-color: #ffffff !important;
  padding: 0 !important;
}

.p-inputtext:enabled:focus,
.p-password-input:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}

.p-password-toggle-icon {
  color: #6b7280 !important;
}
</style>