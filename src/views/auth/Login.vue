<template>
  <div class="min-h-screen bg-[#839370] flex items-center justify-center p-4 md:p-8 font-['Inter',sans-serif]">
    
    <div class="w-full max-w-[850px] bg-[#ffffff] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px] border border-[#e2e8dd]">

      <div class="w-full md:w-5/12 bg-[#1e3a2f] flex flex-col justify-between items-center p-8 text-center min-h-[250px] md:min-h-auto">
        <div class="hidden md:block"></div>

        <div class="flex flex-col items-center gap-4 my-auto">
          <div class="bg-[#1e3a2f] p-2 rounded-2xl w-40 h-40 flex items-center justify-center shadow-md overflow-hidden">
            <img 
              src="/src/assets/logo.png" 
              alt="Logo La Rueda" 
              class="w-full h-full object-contain"
            />
          </div>
          
          <h2 class="text-white text-[28px] md:text-[32px] font-bold leading-tight tracking-wide">
            AgroFerretería<br>La Rueda
          </h2>
        </div>

        <div class="text-[#e2e8dd] text-[16px] font-medium tracking-wide">
          Aguilares, El Salvador 2026
        </div>
      </div>

      <div class="w-full md:w-7/12 flex flex-col justify-between items-center p-8 gap-6">
        <div class="hidden md:block"></div>

        <div class="w-full max-w-[380px] flex flex-col gap-6 my-auto">
          <div class="text-center md:text-left">
            <h1 class="text-[#1a2e1f] text-[32px] font-bold tracking-tight">Inicio de sesión</h1>
            <p class="text-[#6b7280] text-[15px] mt-1">Ingrese su correo y contraseña para continuar</p>
          </div>

          <div
            v-if="errorMessage"
            class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-xl"
          >
            <i class="pi pi-exclamation-circle text-red-500"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
            
            <div class="w-full">
              <IconField>
                <InputIcon class="pi pi-envelope text-[#9ca3af] text-[14px]" />
                <InputText
                  v-model="form.identity"
                  placeholder="correo@gmail.com"
                  class="w-full custom-login-input text-[14px]"
                  :disabled="loading"
                />
              </IconField>
            </div>

            <div class="w-full">
              <IconField>
                <InputIcon class="pi pi-lock text-[#9ca3af] text-[14px]" />
                <Password
                  v-model="form.password"
                  placeholder="contraseña"
                  toggleMask
                  :feedback="false"
                  class="w-full"
                  inputClass="w-full custom-login-input text-[14px]"
                  :disabled="loading"
                />
              </IconField>
            </div>

            <div class="flex justify-center mt-6">
              <Button
                type="submit"
                label="Ingresar"
                :loading="loading"
                class="!bg-[#1e3a2f] hover:!bg-[#1f482d] text-white text-[14px] font-semibold py-4 px-6 rounded-full border-none shadow-lg tracking-wide transition-colors duration-200 cursor-pointer"
              />
            </div>
          </form>
        </div>

        <div class="hidden md:block"></div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'

// Componentes de PrimeVue con rutas individuales correctas
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

import Swal from 'sweetalert2'

const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  identity: '',
  password: '',
})

function validate() {
  if (!form.identity.trim()) {
    errorMessage.value = 'El correo o usuario es requerido.'
    return false
  }
  if (!form.password) {
    errorMessage.value = 'La contraseña es requerida.'
    return false
  }
  return true
}

async function handleLogin() {
  errorMessage.value = ''
  if (!validate()) return

  loading.value = true

  try {

    const response = await authService.login(
      form.identity,
      form.password
    )

    if (!response.success) {
      errorMessage.value = response.message

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.message,
        confirmButtonColor: '#1e3a2f',
      })

      return
    }

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: '¡Sesión iniciada con éxito!',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: 'rgba(30, 58, 47, 0.85)',
      color: '#ffffff',
      iconColor: '#a7f3d0',
    })

    setTimeout(() => {
      router.push(response.route)
    }, 1200)

  } catch (error) {

    console.error('Error en login:', error)

    errorMessage.value = 'Error de conexión con el servidor.'

    Swal.fire({
      icon: 'warning',
      title: 'Error de respuesta',
      text: 'Hubo un inconveniente al conectar con el servidor backend.',
      confirmButtonColor: '#1e3a2f',
    })

  } finally {
    loading.value = false
  }
}
</script>

<style>
.custom-login-input {
  background-color: #f9fafb !important;
  color: #1a2e1f !important;
  border: 1.5px solid #d1d5db !important;
  border-radius: 9999px !important;
  padding: 0.75rem 1.25rem 0.75rem 2.8rem !important;
  height: auto !important;
}

.custom-login-input:enabled:focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}

.p-password-toggle {
  right: 1.25rem !important;
  color: #6b7280 !important;
}

.p-password input {
  width: 100%;
}
</style>