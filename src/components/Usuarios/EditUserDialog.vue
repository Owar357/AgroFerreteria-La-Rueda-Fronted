<template>
  <Dialog
    v-model:visible="visibleLocal"
    modal
    header="EDITAR USUARIO"
    :draggable="false"
    :closable="false"
    :style="{ width: 'min(calc(100vw - 2rem), 34rem)' }"
    class="custom-dialog"
    :pt="{ root: { class: '!rounded-2xl overflow-hidden shadow-2xl' } }"
    @hide="reiniciarFormulario"
  >
    <!-- ======================================================= -->
    <!-- VISTA MÓVIL (< 640px)                                   -->
    <!-- ======================================================= -->
    <div class="block sm:hidden bg-white p-4 text-[#1a2e1f] space-y-4 font-['Inter',sans-serif]">
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
      <BaseInput
        v-model.trim="form.email"
        label="Email"
        placeholder="correo@ejemplo.com"
        autocomplete="off"
        maxlength="50"
        :error="errors.email"
        @input="validarEmail"
      />

      <BasePassword
        v-model="form.password"
        label="Contraseña nueva"
        size="xl"
        placeholder="********"
        help="(Opcional — dejar vacío para no cambiar)"
        :error="errors.password"
        @input="validarContrasena"
      />

      <BasePassword
        v-model="form.confirmPassword"
        label="Confirmar contraseña"
        placeholder="********"
        :error="errors.confirmPassword"
        @input="validarConfirmarContrasena"
      />

      <!-- Botones Móvil -->
      <div class="pt-3 flex flex-col gap-2 w-full">
        <Button
          label="Guardar datos"
          :loading="cargando"
          :disabled="!tieneCambios"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-xs font-bold py-3 rounded-xl border-none cursor-pointer shadow-md w-full disabled:!opacity-50"
          @click="procesarActualizacion"
        />
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-xs !py-3 !border-[#cbd5e1] !text-gray-600 !rounded-xl !w-full font-semibold cursor-pointer"
          @click="visibleLocal = false"
        />
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO (>= 640px)                             -->
    <!-- ======================================================= -->
    <div
      class="hidden sm:flex bg-white p-6 text-[#1a2e1f] flex-col gap-5 font-['Inter',sans-serif]"
    >
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

      <BaseInput
        v-model.trim="form.email"
        label="Email"
        placeholder="correo@ejemplo.com"
        autocomplete="off"
        maxlength="50"
        :error="errors.email"
        @input="validarEmail"
      />

      <BasePassword
        v-model="form.password"
        label="Contraseña nueva"
        size="xl"
        placeholder="********"
        help="(Opcional — dejar vacío para no cambiar la contraseña)"
        :error="errors.password"
        @input="validarContrasena"
      />

      <BasePassword
        v-model="form.confirmPassword"
        label="Confirmar contraseña"
        placeholder="********"
        :error="errors.confirmPassword"
        @input="validarConfirmarContrasena"
      />

      <!-- Botones Escritorio -->
      <div class="flex justify-between items-center mt-1 pt-4 border-t border-[#e2e8dd] w-full">
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-sm !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl font-semibold cursor-pointer w-[47%] flex justify-center items-center"
          @click="visibleLocal = false"
        />
        <Button
          label="Guardar datos"
          :loading="cargando"
          :disabled="!tieneCambios"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold !py-2.5 rounded-xl border-none cursor-pointer shadow-lg transition-colors w-[47%] flex justify-center items-center disabled:!opacity-50"
          @click="procesarActualizacion"
        />
      </div>
    </div>
  </Dialog>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { useUserStore } from '@/stores/usuarioStore'
import BaseInput from '../base/BaseInput.vue'
import BasePassword from '../base/BasePassword.vue'
import {
  mostrarExito,
  mostrarError,
  mostrarAccesoDenegado,
  mostrarAlertaConfirmar,
  mostrarCargando,
} from '@/utils/SweetAlertService'

const props = defineProps({
  visible: { type: Boolean, default: false },
  user: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:visible'])

const store = useUserStore()
const visibleLocal = ref(false)
const cargando = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const limpiarErrores = () => {
  Object.keys(errors).forEach((clave) => (errors[clave] = ''))
}

const cargarDatosUsuario = () => {
  form.name = props.user?.name ?? ''
  form.email = props.user?.email ?? ''
  form.password = ''
  form.confirmPassword = ''
  limpiarErrores()
}

watch(
  () => props.visible,
  (esVisible) => {
    visibleLocal.value = esVisible

    if (esVisible) {
      cargarDatosUsuario()
    }
  },
  { immediate: true },
)

watch(
  () => props.user,
  () => {
    if (visibleLocal.value) {
      cargarDatosUsuario()
    }
  },
  { deep: true },
)

watch(visibleLocal, (esVisible) => {
  emit('update:visible', esVisible)
})

const reiniciarFormulario = () => {
  form.name = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  limpiarErrores()
}

const regexEmail =
  /^[A-Za-z0-9]+([._-][A-Za-z0-9]+)*@[A-Za-z0-9]+(-[A-Za-z0-9]+)*(\.[A-Za-z]{2,3})?\.[A-Za-z]{2,}$/

const validarNombre = () => {
  const nombre = form.name.trim()

  if (!nombre) {
    errors.name = 'El nombre es obligatorio.'
    return false
  }

  if (nombre.length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres.'
    return false
  }

  if (nombre.length > 50) {
    errors.name = 'El nombre no debe exceder los 50 caracteres.'
    return false
  }

  const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/

  if (!regexLetras.test(nombre)) {
    errors.name = 'El nombre no puede contener números ni caracteres especiales.'
    return false
  }

  errors.name = ''
  return true
}

const validarEmail = () => {
  const email = form.email.trim()

  if (!email) {
    errors.email = 'El correo electrónico es obligatorio.'
    return false
  }

  if (email.length > 255) {
    errors.email = 'El correo no puede superar los 255 caracteres.'
    return false
  }

  if (!regexEmail.test(email)) {
    errors.email = 'Correo inválido. Solo se permiten letras, números y los símbolos . _ -'
    return false
  }

  errors.email = ''
  return true
}

const validarContrasena = () => {
  const clave = form.password
  if (!clave) {
    errors.password = ''
    return true
  }
  if (clave.length < 8) {
    errors.password = 'Mínimo 8 caracteres.'
    return false
  }
  if (/\s/.test(clave)) {
    errors.password = 'No puede contener espacios.'
    return false
  }
  if (
    !/[A-Z]/.test(clave) ||
    !/[a-z]/.test(clave) ||
    !/[0-9]/.test(clave) ||
    !/[^A-Za-z0-9]/.test(clave)
  ) {
    errors.password = 'Debe incluir mayúscula, minúscula, número y símbolo.'
    return false
  }
  errors.password = ''
  if (form.confirmPassword) validarConfirmarContrasena()
  return true
}

const validarConfirmarContrasena = () => {
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

const cambioNombre = computed(() => form.name.trim() !== (props.user?.name ?? '').trim())
const cambioEmail = computed(() => form.email.trim() !== (props.user?.email ?? '').trim())
const cambioPassword = computed(() => form.password.length > 0)

const tieneCambios = computed(() => cambioNombre.value || cambioEmail.value || cambioPassword.value)

const procesarActualizacion = async () => {
  if (!tieneCambios.value) {
    mostrarAlertaConfirmar({
      tipo: 'advertencia',
      titulo: 'Sin cambios',
      mensajeHtml: 'No se editó ningún campo.',
    })
    return
  }

  const nombreValido = validarNombre()
  const emailValido = validarEmail()
  const contrasenaValida = validarContrasena()
  const confirmacionValida = validarConfirmarContrasena()

  if (form.password && !form.confirmPassword) {
    errors.confirmPassword = 'Debes confirmar la contraseña.'
    return
  }

  if (!nombreValido || !emailValido || !contrasenaValida || !confirmacionValida) return

  cargando.value = true
  mostrarCargando('Guardando cambios...', 'Actualizando información del usuario')

  const cargaUtil = {
    name: form.name.trim(),
    rol: props.user?.roles?.[0]?.name || '',
  }

  // El email solo se envía si cambió (evita validaciones innecesarias en el servidor)
  if (cambioEmail.value) {
    cargaUtil.email = form.email.trim()
  }

  if (form.password) {
    cargaUtil.password = form.password
    cargaUtil.password_confirmation = form.confirmPassword
  }

  try {
    const [resultado] = await Promise.all([
      store.updateUser(props.user?.id, cargaUtil),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ])

    if (resultado.ok) {
      visibleLocal.value = false
      await mostrarExito(
        '¡Datos actualizados!',
        'Los datos del usuario fueron actualizados exitosamente.',
      )
    } else if (resultado.status === 403) {
      mostrarAccesoDenegado()
    } else if (resultado.status === 422 && resultado.errors) {
      errors.name = resultado.errors.name?.[0] ?? ''
      errors.email = resultado.errors.email?.[0] ?? ''
      errors.password = resultado.errors.password?.[0] ?? ''
      // Reemplaza el modal de "Guardando cambios..." para que no quede abierto
      mostrarError('Datos inválidos', 'Revisa los campos marcados en el formulario.')
    } else if (resultado.error) {
      mostrarError('Error al actualizar', resultado.error)
    } else {
      mostrarError('Error inesperado', 'No se pudieron guardar los cambios.')
    }
  } catch (err) {
    mostrarError('Error de conexión', 'Ocurrió un problema de red al procesar la actualización.')
  } finally {
    cargando.value = false
  }
}
</script>

<style>
.swal2-container {
  z-index: 999999 !important;
}

.custom-dialog .p-dialog-header {
  background-color: #1a3323 !important;
  color: #ffffff !important;
  border-bottom: 1px solid #2b5e3b !important;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 1.1rem 1.5rem !important;
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
