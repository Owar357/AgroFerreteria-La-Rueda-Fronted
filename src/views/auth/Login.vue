<template>
  <div
    class="min-h-screen bg-[#839370] flex items-center justify-center p-4 sm:p-6 md:p-8 font-['Inter',sans-serif]"
  >
    <!-- Contenedor principal adaptativo -->
    <div
      class="w-full max-w-[56.25rem] bg-[#ffffff] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[32.5rem] border border-[#e2e8dd]"
    >
      <!-- Panel izquierdo -->
      <div
        class="relative w-full md:w-5/12 bg-[#14291d] flex flex-col justify-between items-center p-6 md:p-8 text-center overflow-hidden"
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
            class="bg-[#1e3a2f] p-2 rounded-2xl w-[9rem] h-[9rem] flex items-center justify-center shadow-md overflow-hidden border border-white/10"
          >
            <img
              src="/src/assets/logo.png"
              alt="Logo La Rueda"
              class="w-full h-full object-contain"
            />
          </div>

          <h2 class="text-white text-[1.625rem] md:text-[1.875rem] font-bold leading-tight tracking-wide drop-shadow-sm">
            AgroFerretería<br />La Rueda
          </h2>

          <!-- Badge panel administrativo -->
          <div
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20"
          >
            <i class="pi pi-shield text-[#d9c98a] text-xs"></i>
            <span class="text-[#d9c98a] text-xs font-medium tracking-wide">
              Panel administrativo
            </span>
          </div>
        </div>

        <div class="relative z-10 text-[#f4f1e8]/50 text-sm font-medium tracking-wide mt-4 md:mt-0">
          Aguilares, El Salvador 2026
        </div>
      </div>

      <!-- Panel derecho -->
      <div class="w-full md:w-7/12 flex flex-col justify-between items-center p-6 md:p-8 gap-6">
        <div class="hidden md:block"></div>

        <div class="w-full max-w-[23.75rem] flex flex-col gap-5 my-auto">
          <div class="text-center md:text-left">
            <h1 class="text-[#1a2e1f] text-[1.875rem] font-bold tracking-tight">Inicio de sesión</h1>
            <p class="text-[#6b7280] text-sm mt-1 leading-relaxed">
              Ingresá tu correo y contraseña para continuar.
            </p>
          </div>

          <div
            v-if="errorMessage"
            class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-[0.8125rem] px-4 py-3 rounded-xl"
          >
            <i class="pi pi-exclamation-circle text-red-500"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
            <div class="w-full">
              <label class="block text-xs font-medium text-[#6b7280] mb-1.5">Correo</label>
              <IconField class="w-full">
                <InputIcon class="pi pi-envelope text-[#9ca3af] text-sm" />
                <InputText
                  v-model="form.identity"
                  placeholder="correo@gmail.com"
                  class="w-full custom-login-input text-sm"
                  :disabled="loading"
                />
              </IconField>
            </div>

            <div class="w-full">
              <label class="block text-xs font-medium text-[#6b7280] mb-1.5">Contraseña</label>
              <IconField class="w-full">
                <InputIcon class="pi pi-lock text-[#9ca3af] text-sm" />
                <Password
                  v-model="form.password"
                  placeholder="contraseña"
                  toggleMask
                  :feedback="false"
                  class="w-full"
                  inputClass="w-full custom-login-input text-sm"
                  :disabled="loading"
                />
              </IconField>
            </div>

            <div class="flex justify-center mt-4 w-full">
              <Button
                type="submit"
                label="Ingresar"
                :loading="loading"
                icon="pi pi-arrow-right"
                iconPos="right"
                class="w-full !bg-[#14291d] hover:!bg-[#1f482d] text-white text-sm font-semibold py-3.5 px-6 rounded-xl border-none shadow-lg tracking-wide transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
              />
            </div>
          </form>

          <div class="flex items-center justify-center gap-1.5 mt-2">
            <i class="pi pi-info-circle text-[#9ca3af] text-[0.6875rem]"></i>
            <span class="text-[0.6875rem] text-[#9ca3af]">
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
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import authService from '@/services/authService'
import { mostrarExito, mostrarError } from '@/utils/SweetAlertService'

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
  if (!validate()) return
  loading.value = true

  try {
    const response = await authService.login(form.identity, form.password)

    if (!response.success) {
      mostrarError('Acceso denegado', response.message, {
        timer: 3500,
        customClass: {
          container: '!z-[9999]',
          popup: '!rounded-2xl',
        }
      })
      return
    }

    mostrarExito('¡Bienvenido!', 'Iniciando sesión correctamente...')

    setTimeout(() => {
      router.push(response.route)
    }, 1200)

  } catch (error) {
    console.error('Error en login:', error)
    const msg = error.response?.data?.message || 'Hubo un inconveniente al conectar con el servidor.'
    mostrarError('Acceso denegado', msg)
  } finally {
    loading.value = false
  }
}
</script>

<style>
.custom-login-input {
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border: 0.09375rem solid #e2e5e0 !important;
  border-radius: 0.625rem !important;
  padding: 0.7rem 1rem 0.7rem 2.6rem !important;
  height: auto !important;
}

.custom-login-input:enabled:focus {
  box-shadow: 0 0 0 0.1875rem rgba(30, 58, 47, 0.12) !important;
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