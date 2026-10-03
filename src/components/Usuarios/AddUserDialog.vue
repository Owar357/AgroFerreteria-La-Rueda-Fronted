<template>
  <Dialog
    v-model:visible="visibleLocal"
    modal
    header="AGREGAR USUARIO"
    :draggable="false"
    :closable="false"
    :style="{ width: 'min(calc(100vw - 2rem), 34rem)' }"
    class="custom-dialog"
    :pt="{ root: { class: '!rounded-2xl overflow-hidden shadow-2xl' } }"
    @hide="reiniciarFormulario"
  >
    <!-- ======================================================= -->
    <!-- CONTENIDO - VISTA MÓVIL (< 640px)                       -->
    <!-- ======================================================= -->
    <div class="block sm:hidden bg-white p-4 text-[#1a2e1f] space-y-4 font-['Inter',sans-serif]">
      <BaseInput
        v-model="form.name"
        label="Nombre"
        size="xl"
        placeholder="Nombre completo"
        filter="alpha"
        :error="errors.name"
        @input="validarCampo('name')"
      />

      <BaseInput
        v-model="form.email"
        label="Email"
        size="xl"
        placeholder="correo@ejemplo.com"
        autocomplete="off"
        :error="errors.email"
        @input="validarCampo('email')"
      />

      <BasePassword
        v-model="form.password"
        label="Contraseña"
        size="xl"
        placeholder="********"
        :error="errors.password"
        @input="validarCampo('password')"
      />

      <div class="flex flex-col gap-1.5 w-full">
        <label class="text-xs font-semibold text-[#1a2e1f]">Rol</label>
        <Select
          v-model="form.role"
          :options="roles"
          placeholder="Seleccionar rol"
          @change="validarCampo('role')"
          class="w-full !bg-[#f9fafb] !border-[#d1d5db] text-[#1a2e1f] text-xs h-[2.5rem] flex items-center px-2 rounded-xl"
          :class="{ '!border-red-500': errors.role }"
        />
        <small v-if="errors.role" class="text-red-600 text-[11px] font-medium">
          {{ errors.role }}
        </small>
      </div>

      <!-- Botones Móvil (Vertical - Full Width) -->
      <div class="pt-3 flex flex-col gap-2 w-full">
        <Button
          label="Guardar"
          :loading="cargando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-xs font-bold py-3 rounded-xl border-none cursor-pointer shadow-md w-full"
          @click="guardarUsuario"
        />
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-xs !py-3 !border-[#cbd5e1] !text-gray-600 !rounded-xl  !w-full font-semibold cursor-pointer"
          @click="visibleLocal = false"
        />
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- CONTENIDO - VISTA ESCRITORIO (>= 640px)                -->
    <!-- ======================================================= -->
    <div class="hidden sm:flex bg-white p-6 text-[#1a2e1f] flex-col gap-5 font-['Inter',sans-serif]">
      <BaseInput
        v-model="form.name"
        label="Nombre"
        size="xl"
        placeholder="Nombre completo"
        filter="alpha"
        :error="errors.name"
        @input="validarCampo('name')"
      />

      <BaseInput
        v-model="form.email"
        label="Email"
        size="xl"
        placeholder="correo@ejemplo.com"
        autocomplete="off"
        :error="errors.email"
        @input="validarCampo('email')"
      />

      <BasePassword
        v-model="form.password"
        label="Contraseña"
        size="xl"
        placeholder="********"
        :error="errors.password"
        @input="validarCampo('password')"
      />

      <div class="flex flex-col gap-2 w-full">
        <label class="text-sm font-medium text-[#1a2e1f]">Rol</label>
        <Select
          v-model="form.role"
          :options="roles"
          placeholder="Seleccionar rol"
          @change="validarCampo('role')"
          class="w-full !bg-[#f9fafb] !border-[#d1d5db] text-[#1a2e1f] text-sm h-[2.75rem] flex items-center px-2 rounded-lg"
          :class="{ '!border-red-500': errors.role }"
        />
        <small v-if="errors.role" class="text-red-600 text-xs font-medium">
          {{ errors.role }}
        </small>
      </div>

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
          label="Guardar"
          :loading="cargando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold !py-2.5 rounded-xl border-none cursor-pointer shadow-lg transition-colors w-[47%] flex justify-center items-center"
          @click="guardarUsuario"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useUserStore } from '@/stores/usuarioStore'
import BaseInput from '../base/BaseInput.vue'
import BasePassword from '../base/BasePassword.vue'
import { 
  mostrarExito, 
  mostrarError, 
  mostrarAlertaConfirmar 
} from '@/utils/SweetAlertService'

const props = defineProps({
  visible: { type: Boolean, default: false },
  roles: {
    type: Array,
    default: () => ['Administrador', 'Contador', 'Cajero'],
  },
})

const emit = defineEmits(['update:visible'])

const store = useUserStore()
const visibleLocal = ref(false)
const cargando = ref(false)

watch(
  () => props.visible,
  (valor) => (visibleLocal.value = valor),
)
watch(visibleLocal, (valor) => emit('update:visible', valor))

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: null,
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  role: '',
})

const reiniciarFormulario = () => {
  form.name = ''
  form.email = ''
  form.password = ''
  form.role = null
  Object.keys(errors).forEach((clave) => (errors[clave] = ''))
}

const validarCampo = (campo) => {
  if (campo === 'name') {
    const valor = form.name.trim()
    if (!valor) errors.name = 'El nombre es obligatorio.'
    else if (valor.length > 70) errors.name = 'El nombre no debe exceder los 70 caracteres.'
    else if (!/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(valor))
      errors.name = 'Solo se permiten letras (sin números ni caracteres especiales).'
    else errors.name = ''
  }

  if (campo === 'email') {
    const valor = form.email.trim()
    if (!valor) errors.email = 'El correo electrónico es obligatorio.'
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor))
      errors.email = 'Formato de correo inválido.'
    else errors.email = ''
  }

  if (campo === 'password') {
    const valor = form.password
    if (!valor) errors.password = 'La contraseña es obligatoria.'
    else if (valor.length < 8) errors.password = 'Mínimo 8 caracteres.'
    else if (/\s/.test(valor)) errors.password = 'La contraseña no puede contener espacios.'
    else if (!/[A-Z]/.test(valor) || !/[a-z]/.test(valor) || !/[0-9]/.test(valor) || !/[^A-Za-z0-9]/.test(valor))
      errors.password = 'Debe incluir mayúscula, minúscula, número y símbolo.'
    else errors.password = ''
  }

  if (campo === 'role') {
    errors.role = form.role ? '' : 'Debe seleccionar un rol.'
  }
}

const guardarUsuario = async () => {
  if (!form.name.trim() && !form.email.trim() && !form.password && !form.role) {
    mostrarAlertaConfirmar({
      tipo: 'advertencia',
      titulo: 'Formulario vacío',
      mensajeHtml: 'Complete los campos requeridos antes de guardar.'
    })
    return
  }

  validarCampo('name')
  validarCampo('email')
  validarCampo('password')
  validarCampo('role')

  if (errors.name || errors.email || errors.password || errors.role) return

  cargando.value = true

  const resultado = await store.createUser({
    name: form.name.trim(),
    email: form.email.trim(),
    password: form.password,
    role: form.role,
  })

  cargando.value = false

  if (resultado.ok) {
    visibleLocal.value = false
    mostrarExito('¡Usuario creado!', `El usuario "${resultado.user.name}" fue registrado exitosamente.`)
  } else if (resultado.status === 403) {
    mostrarError('Sin autorización', 'No tienes permisos para crear usuarios.')
  } else if (resultado.error) {
    mostrarError('Error de validación', resultado.error)
  }
}
</script>

<style>
.swal2-container {
  z-index: 999999 !important;
}

/* Header del Modal sin botón X */
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

/* Form inputs & selects */
.p-inputtext:enabled:focus,
.p-select:not(.p-disabled).p-focus,
.p-password-input:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}

.p-select {
  background-color: #f9fafb !important;
  border-color: #d1d5db !important;
}

.p-select-label {
  color: #1a2e1f !important;
  font-size: 0.875rem !important;
}

.p-select-overlay {
  background-color: #ffffff !important;
  border: 0.0625rem solid #cbd5e1 !important;
  z-index: 999992 !important;
}

.p-select-item {
  color: #1a2e1f !important;
  font-size: 0.875rem !important;
}

.p-select-item:not(.p-highlight):not(.p-disabled):hover {
  background-color: #eef2e9 !important;
}

.p-password-toggle-icon {
  color: #6b7280 !important;
}
</style>