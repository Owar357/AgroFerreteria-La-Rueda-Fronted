<template>
  <div class="min-h-screen bg-[#839370] flex items-center justify-center p-4">
    <div class="w-full max-w-[480px] bg-white rounded-3xl shadow-2xl p-10 text-center flex flex-col items-center gap-5 border border-[#e2e8dd]">
      <div class="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
        <i class="pi pi-lock text-red-500 text-[34px]"></i>
      </div>

      <h1 class="text-[#1a2e1f] text-[24px] font-bold">Acceso no autorizado</h1>

      <p class="text-[#6b7280] text-[14px] leading-relaxed">
        No tenés permisos para acceder a
        <strong v-if="modulo">{{ modulo }}</strong>
        <span v-else>esta funcionalidad</span>.
        Si creés que esto es un error, contactá al administrador.
      </p>

      <Button
        label="Volver al inicio"
        icon="pi pi-arrow-left"
        @click="volver"
        class="w-full !bg-[#14291d] hover:!bg-[#1f482d] text-white text-[14px] font-semibold py-3 px-6 rounded-xl border-none"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import authService from '@/services/authService'
import { mostrarError } from '@/utils/SweetAlertService'
import Button from 'primevue/button'

const route = useRoute()
const router = useRouter()

const modulo = computed(() => route.query.intento || null)

onMounted(() => {
  mostrarError(
    'Acceso denegado',
    'No tenés permisos para ver esta sección.'
  )
})

function volver() {
  router.push(authService.getHomeRoute())
}
</script>