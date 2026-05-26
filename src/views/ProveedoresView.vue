<template>
  <div>
    <!-- La tabla siempre visible -->
    <SupplierTable
      @open-add="showForm = true"
    />

    <!-- El modal se abre encima de la tabla -->
    <AgreProveedor
      v-model="showForm"
      @guardar="onGuardar"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SupplierTable from '../components/Usuarios/SupplierTable.vue'
import AgreProveedor from '../views/AgreProveedor.vue'  

const showForm = ref(false)

function onGuardar(payload) {
  console.log('Nuevo proveedor:', payload)
  // aquí puedes agregar el proveedor a tu lista
}
</script>