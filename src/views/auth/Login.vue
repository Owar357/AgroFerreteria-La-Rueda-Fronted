<template>
  <div
    class="min-h-screen bg-[#839370] flex items-center justify-center p-4 md:p-8 font-['Inter',sans-serif]"
  >
    <div
      class="w-full max-w-[900px] bg-[#ffffff] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[520px] border border-[#e2e8dd]"
    >
      <!-- Panel izquierdo -->
      <div
        class="relative w-full md:w-5/12 bg-[#14291d] flex flex-col justify-between items-center p-8 text-center min-h-[280px] md:min-h-auto overflow-hidden"
      >
        <!-- Textura de fondo sutil -->
        <svg
          class="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="loginGrid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#ffffff" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loginGrid)" />
        </svg>

        <div class="hidden md:block"></div>

        <div class="relative z-10 flex flex-col items-center gap-4 my-auto">
          <div
            class="bg-[#1e3a2f] p-2 rounded-2xl w-36 h-36 flex items-center justify-center shadow-md overflow-hidden border border-white/10"
          >
            <img
              src="/src/assets/logo.png"
              alt="Logo La Rueda"
              class="w-full h-full object-contain"
            />
          </div>

          <h2 class="text-white text-[26px] md:text-[30px] font-bold leading-tight tracking-wide drop-shadow-sm">
            AgroFerretería<br />La Rueda
          </h2>

          <!-- Badge panel administrativo -->
          <div
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20"
          >
            <i class="pi pi-shield text-[#d9c98a] text-[12px]"></i>
            <span class="text-[#d9c98a] text-[12px] font-medium tracking-wide">
              Panel administrativo
            </span>
          </div>
        </div>

        <div class="relative z-10 text-[#f4f1e8]/50 text-[14px] font-medium tracking-wide">
          Aguilares, El Salvador 2026
        </div>
      </div>

      <!-- Panel derecho -->
      <div class="w-full md:w-7/12 flex flex-col justify-between items-center p-8 gap-6">
        <div class="hidden md:block"></div>

        <div class="w-full max-w-[380px] flex flex-col gap-5 my-auto">
          <div class="text-center md:text-left">
            <h1 class="text-[#1a2e1f] text-[30px] font-bold tracking-tight">Inicio de sesión</h1>
            <p class="text-[#6b7280] text-[14px] mt-1 leading-relaxed">
              Ingresá tu correo y contraseña para continuar.
            </p>
          </div>

          <div
            v-if="errorMessage"
            class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-xl"
          >
            <i class="pi pi-exclamation-circle text-red-500"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
            <div class="w-full">
              <label class="block text-[12px] font-medium text-[#6b7280] mb-1.5">Correo</label>
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
              <label class="block text-[12px] font-medium text-[#6b7280] mb-1.5">Contraseña</label>
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

            <div class="flex justify-center mt-4">
              <Button
                type="submit"
                label="Ingresar"
                :loading="loading"
                icon="pi pi-arrow-right"
                iconPos="right"
                class="w-full !bg-[#14291d] hover:!bg-[#1f482d] text-white text-[14px] font-semibold py-3.5 px-6 rounded-xl border-none shadow-lg tracking-wide transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
              />
            </div>
          </form>

          <div class="flex items-center justify-center gap-1.5 mt-2">
            <i class="pi pi-info-circle text-[#9ca3af] text-[11px]"></i>
            <span class="text-[11px] text-[#9ca3af]">
              Acceso restringido a personal autorizado
            </span>
          </div>
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
    const response = await authService.login(form.identity, form.password)

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
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border: 1.5px solid #e2e5e0 !important;
  border-radius: 10px !important;
  padding: 0.7rem 1rem 0.7rem 2.6rem !important;
  height: auto !important;
}

.custom-login-input:enabled:focus {
  box-shadow: 0 0 0 3px rgba(30, 58, 47, 0.12) !important;
  border-color: #2b5e3b !important;
}

.p-password-toggle {
  right: 1.1rem !important;
  color: #9ca3af !important;
}

.p-password input {
  width: 100%;
}
</style>