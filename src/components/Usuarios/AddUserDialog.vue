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
        placeholder="Nombre completo"
        filter="alpha"
        :error="errors.name"
        @input="validarCampo('name')"
      />

      <BaseInput
        v-model="form.email"
        label="Email"
        placeholder="correo@ejemplo.com"
        autocomplete="off"
        :error="errors.email"
        @input="validarCampo('email')"
      />

      <BasePassword
        v-model="form.password"
        label="Contraseña"
        placeholder="********"
        :error="errors.password"
        @input="validarCampo('password')"
      />

      <BaseSelect
        v-model="form.role"
        label="Rol"
        :options="roles"
        placeholder="Seleccionar rol"
        :error="errors.role"
        @update:model-value="validarCampo('role')"
      />

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
        placeholder="Nombre completo"
        filter="alpha"
        :error="errors.name"
        @input="validarCampo('name')"
      />

      <BaseInput
        v-model="form.email"
        label="Email"
        placeholder="correo@ejemplo.com"
        autocomplete="off"
        :error="errors.email"
        @input="validarCampo('email')"
      />

      <BasePassword
        v-model="form.password"
        label="Contraseña"
        placeholder="********"
        :error="errors.password"
        @input="validarCampo('password')"
      />

      <BaseSelect
        v-model="form.role"
        label="Rol"
        :options="roles"
        placeholder="Seleccionar rol"
        :error="errors.role"
        @update:model-value="validarCampo('role')"
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
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useUserStore } from '@/stores/usuarioStore'
import BaseInput from '../base/BaseInput.vue'
import BasePassword from '../base/BasePassword.vue'
import BaseSelect from '../base/BaseSelect.vue'
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
</style>