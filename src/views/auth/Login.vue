<template>
  <div class="min-h-screen bg-[#072908] flex items-center justify-center p-4 md:p-8 font-[Poppins]">
    
    <div class="w-full max-w-[850px] bg-[#000000] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">

      <div class="w-full md:w-5/12 bg-[#094a0b] flex flex-col justify-between items-center p-8 text-center min-h-[250px] md:min-h-auto">
        <div class="hidden md:block"></div>

        <div class="flex flex-col items-center gap-4 my-auto">
          <div class="bg-[#092e0b] p-4 rounded-2xl w-20 h-20 flex items-center justify-center shadow-inner">
            <i class="pi pi-user text-white text-[32px]" />
          </div>
          
          <h2 class="text-white text-[28px] md:text-[32px] font-bold leading-tight tracking-wide">
            Agro-Ferreteria<br>La Rueda
          </h2>
        </div>

        <div class="text-[#dae9da] text-[16px] font-medium tracking-wide">
          Aguilares, El Salvador 2026
        </div>
      </div>

      <div class="w-full md:w-7/12 flex flex-col justify-between items-center p-8 gap-6">
        <div class="hidden md:block"></div>

        <div class="w-full max-w-[380px] flex flex-col gap-6 my-auto">
          <div class="text-center md:text-left">
            <h1 class="text-white text-[32px] font-bold tracking-tight">Iniciar sesión</h1>
            <p class="text-[#B0B0B0] text-[15px] mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
            
            <div class="w-full">
              <IconField>
                <InputIcon class="pi pi-envelope text-[#B0B0B0]" />
                <InputText
                  v-model="form.identity"
                  placeholder="correo o usuario"
                  class="w-full custom-login-input text-[16px]"
                  :disabled="loading"
                />
              </IconField>
            </div>

            <div class="w-full">
              <IconField>
                <InputIcon class="pi pi-lock text-[#B0B0B0] text-[16px]" />
                <Password
                  v-model="form.password"
                  placeholder="contraseña"
                  toggleMask
                  :feedback="false"
                  class="w-full"
                  inputClass="w-full custom-login-input text-[16px]"
                  :disabled="loading"
                />
              </IconField>
            </div>

            <div class="flex justify-center mt-8    ">
              <Button
                type="submit"
                label="Ingresar"
                :loading="loading"
                class="!bg-[#0a5a12] hover:bg-[#59a34c] text-white text-[20px] font-semibold py-3 px-8 rounded-full border-none shadow-lg tracking-wide transition-colors duration-200"
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
import { reactive, ref } from 'vue'
import IconField from 'primevue/iconfield' // Requerido en v4
import InputIcon from 'primevue/inputicon' // Requerido en v4
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const loading = ref(false)

const form = reactive({
  identity: '',
  password: ''
})

const handleLogin = () => {
  if (!form.identity || !form.password) return
  
  loading.value = true
  console.log('Login JS activado:', { ...form })

  setTimeout(() => {
    loading.value = false
  }, 1500)
}
</script>

<style>
/* Estilos especializados para los inputs ovalados de Penpot */
.custom-login-input {
  background-color: #323232 !important;
  color: #EAEAEA !important;
  border: 1.5px solid #8A8A8A !important;
  border-radius: 9999px !important;
  padding: 0.75rem 1.25rem 0.75rem 2.8rem !important;
  height: auto !important;
}

.custom-login-input:enabled:focus {
  box-shadow: 0 0 0 2px rgba(111, 175, 101, 0.4) !important;
  border-color: #6FAF65 !important;
}

.p-password-toggle {
  right: 1.25rem !important;
  color: #B0B0B0 !important;
}

.p-password input {
  width: 100%;
}
</style>