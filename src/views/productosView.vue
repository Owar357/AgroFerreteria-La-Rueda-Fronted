<template>
  <div>
    <!-- Muestra el CRUD o el Formulario según el estado -->
    <ProducTable
      v-if="!showForm"
      @open-add="showForm = true"
    />

    <Producto
      v-if="showForm"
      @close="showForm = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProducTable from '../components/Usuarios/ProducTable.vue'  // ajusta la ruta
import Producto from '../views/Producto.vue'  // ajusta la ruta

const showForm = ref(false)
</script>