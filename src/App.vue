<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- Este div asegura que el contenido ocupe toda la pantalla -->
  <div class="min-h-screen bg-slate-50">
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

