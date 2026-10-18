<script setup>
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useSessionTimeout } from '@/composables/useSessionTimeout'

const router = useRouter()
const { programar } = useSessionTimeout()

// Programa el aviso al cargar la app (por si recargan la página)
onMounted(programar)
// Y después de cada navegación (login, logout, cambio de vista)
router.afterEach(() => programar())
</script>

<template>
 <div class="h-dvh max-h-screen overflow-hidden bg-slate-50">
    <RouterView />
  </div>
</template>

<style>
/* Estilos globales mínimos */
body {
  margin: 0;
  padding: 0;
  background-color: #f8fafc; /* Un gris muy claro de fondo */
  font-family: Arial, sans-serif;
}
</style>