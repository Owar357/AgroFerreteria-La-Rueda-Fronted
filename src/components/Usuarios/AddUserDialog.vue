<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="AGREGAR USUARIO"
    :style="{ width: '500px' }"
    :draggable="false"
    class="custom-dialog"
    :pt="{ root: { class: 'rounded-2xl overflow-hidden' } }"
    @hide="resetForm"
  >
    <div class="bg-[#ffffff] p-2 text-[#1a2e1f] flex flex-col gap-5 font-['Inter',sans-serif]">

      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Nombre</label>
        <InputText
          v-model="form.name"
          placeholder="Nombre completo"
          @input="validateField('name')"
          class="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg"
          :class="{ 'border-red-500 focus:border-red-500': errors.name }"
        />
        <small v-if="errors.name" class="text-red-600 text-[12px] font-medium">{{ errors.name }}</small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Email</label>
        <InputText
          v-model="form.email"
          placeholder="correo@ejemplo.com"
          @input="validateField('email')"
          class="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg"
          :class="{ 'border-red-500 focus:border-red-500': errors.email }"
        />
        <small v-if="errors.email" class="text-red-600 text-[12px] font-medium">{{ errors.email }}</small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Contraseña</label>
        <Password
          v-model="form.password"
          toggleMask
          :feedback="false"
          placeholder="********"
          @input="validateField('password')"
          class="w-full"
          inputClass="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg"
          :class="{ 'border-red-500': errors.password }"
        />
        <small v-if="errors.password" class="text-red-600 text-[12px] font-medium">{{ errors.password }}</small>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Rol</label>
        <Select
          v-model="form.role"
          :options="roles"
          placeholder="Seleccionar rol"
          @change="validateField('role')"
          class="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] text-[14px] h-11 flex items-center px-2 rounded-lg"
          :class="{ 'border-red-500': errors.role }"
        />
        <small v-if="errors.role" class="text-red-600 text-[12px] font-medium">{{ errors.role }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Clave de caja</label>
        <InputText
          v-model="form.cashKey"
          placeholder="Código de apertura"
          class="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg"
        />
        <small class="text-[13px] text-[#6b7280] font-normal mt-1">
          (Si el usuario podrá aperturar caja, ingresar código)
        </small>
      </div>

      <div class="flex justify-center mt-4">
        <Button
          label="Guardar"
          :loading="loading"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-5 py-3 rounded-lg border-none cursor-pointer shadow-lg transition-colors"
          @click="handleSave"
        />
      </div>

    </div>
  </Dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import Dialog    from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password  from 'primevue/password'
import Select    from 'primevue/select'
import Button    from 'primevue/button'
import Swal      from 'sweetalert2'
<<<<<<< HEAD
import { useUserStore } from '@/stores/userStore'
=======
import { useUserStore } from '@/stores/usuarioStore'
>>>>>>> rama_prueba

const props = defineProps({
  visible: { type: Boolean, default: false },
  roles: {
    type: Array,
    default: () => ['Administrador', 'Contador', 'Cajero']
  }
})

const emit = defineEmits(['update:visible'])

const store        = useUserStore()
const localVisible = ref(false)
const loading      = ref(false)

watch(() => props.visible, (val) => (localVisible.value = val))
watch(localVisible,        (val) => emit('update:visible', val))

const form = reactive({
  name: '', email: '', password: '', role: null, cashKey: ''
})

const errors = reactive({
  name: '', email: '', password: '', role: ''
})

const resetForm = () => {
  form.name = ''; form.email = ''; form.password = ''
  form.role = null; form.cashKey = ''
  Object.keys(errors).forEach(k => (errors[k] = ''))
}

const validateField = (field) => {
  if (field === 'name') {
    const v = form.name.trim()
    if (!v) errors.name = 'El nombre es obligatorio.'
    else if (v.length > 70) errors.name = 'El nombre no debe exceder los 70 caracteres.'
    else if (!/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(v)) errors.name = 'Solo se permiten letras (sin números ni caracteres especiales).'
    else errors.name = ''
  }

  if (field === 'email') {
    const v = form.email.trim()
<<<<<<< HEAD
    if (!v)                                                                          errors.email = 'El correo electrónico es obligatorio.'
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v))          errors.email = 'Formato de correo inválido.'
    else                                                                             errors.email = ''
=======
    if (!v) errors.email = 'El correo electrónico es obligatorio.'
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)) 
    errors.email = 'Formato de correo inválido.'
    else                                                                            
    errors.email = ''
>>>>>>> rama_prueba
  }

  if (field === 'password') {
    const v = form.password
<<<<<<< HEAD
    if (!v)                                                                                        errors.password = 'La contraseña es obligatoria.'
    else if (v.length < 8)                                                                         errors.password = 'Mínimo 8 caracteres.'
    else if (/\s/.test(v))                                                                         errors.password = 'La contraseña no puede contener espacios.'
    else if (!/[A-Z]/.test(v) || !/[a-z]/.test(v) || !/[0-9]/.test(v) || !/[^A-Za-z0-9]/.test(v)) errors.password = 'Debe incluir mayúscula, minúscula, número y símbolo.'
    else                                                                                           errors.password = ''
=======
    if (!v)                                                                                        
    errors.password = 'La contraseña es obligatoria.'
    else if (v.length < 8)
    errors.password = 'Mínimo 8 caracteres.'
    else if (/\s/.test(v)) 
    errors.password = 'La contraseña no puede contener espacios.'
    else if (!/[A-Z]/.test(v) || !/[a-z]/.test(v) || !/[0-9]/.test(v) || !/[^A-Za-z0-9]/.test(v)) 
    errors.password = 'Debe incluir mayúscula, minúscula, número y símbolo.'
    else                                                                                           
    errors.password = ''
>>>>>>> rama_prueba
  }

  if (field === 'role') {
    errors.role = form.role ? '' : 'Debe seleccionar un rol.'
  }
}

const handleSave = async () => {
  // Validar formulario vacío
  if (!form.name.trim() && !form.email.trim() && !form.password && !form.role) {
    Swal.fire({
      icon: 'error',
      title: 'Formulario vacío',
      text: 'Complete los campos requeridos antes de guardar.',
      confirmButtonColor: '#2b5e3b'
    })
    return
  }

  // Validar todos los campos
  validateField('name')
  validateField('email')
  validateField('password')
  validateField('role')

  if (errors.name || errors.email || errors.password || errors.role) return

  // Cerrar modal antes del SweetAlert para que no quede detrás
  localVisible.value = false
  loading.value = true

  const resultado = await store.createUser({
    name:     form.name.trim(),
    email:    form.email.trim(),
    password: form.password,
    role:     form.role,
    cashKey:  form.cashKey ? form.cashKey.trim() : null
  })

  loading.value = false

<<<<<<< HEAD
  
=======
  // Si hubo error de validación del servidor, volvemos a abrir el modal con el error
>>>>>>> rama_prueba
  if (!resultado.ok && resultado.error) {
    // Detectamos a qué campo pertenece el error del servidor
    const msg = resultado.error.toLowerCase()
    if (msg.includes('correo') || msg.includes('email')) errors.email = resultado.error
    else if (msg.includes('nombre') || msg.includes('name'))  errors.name  = resultado.error
<<<<<<< HEAD
    else errors.email = resultado.error
=======
    else errors.email = resultado.error // fallback
>>>>>>> rama_prueba
    localVisible.value = true
  }
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
.p-select:not(.p-disabled).p-focus,
.p-password-input:enabled:focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}

.p-select { background-color: #f9fafb !important; border-color: #d1d5db !important; }
.p-select-label { color: #1a2e1f !important; font-size: 14px !important; }
.p-select-overlay { background-color: #ffffff !important; border: 1px solid #cbd5e1 !important; z-index: 999992 !important; }
.p-select-item { color: #1a2e1f !important; font-size: 14px !important; }
.p-select-item:not(.p-highlight):not(.p-disabled):hover { background-color: #eef2e9 !important; }
.p-password-toggle-icon { color: #6b7280 !important; }
</style>