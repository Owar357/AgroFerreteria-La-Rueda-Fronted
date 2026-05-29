<template>
  <div>
    <!-- 1. Escuchamos los eventos que vienen de los botones de la tabla -->
    <SupplierTable
      @open-add="showAddForm = true"
      @open-edit="abrirModalEditar"
    />

    
    <AgreProveedor
      v-model="showAddForm"
      @guardar="onGuardarNuevo"
    />

  
    <EditProveedor
      v-model="showEditForm"
      :proveedor="proveedorSeleccionado"
      @actualizar="onActualizarExistente"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SupplierTable from '../components/Usuarios/SupplierTable.vue'
import AgreProveedor from '../views/AgreProveedor.vue'  
import EditProveedor from '../components/Usuarios/EditProveeDialog.vue'

// Control de visibilidad de los modales
const showAddForm = ref(false)
const showEditForm = ref(false)

// Variable que guardará el proveedor seleccionado para editar
const proveedorSeleccionado = ref(null)


// Función que se ejecuta al dar clic en el lápiz de la tabla
function abrirModalEditar(proveedor) {
  // Guardamos una copia del proveedor seleccionado
  proveedorSeleccionado.value = { ...proveedor }
  
  // Abrimos el modal de edición
  showEditForm.value = true
}

// Lógica para guardar el nuevo (Tu lógica actual)
function onGuardarNuevo(payload) {
  console.log('Guardando nuevo:', payload)
  showAddForm.value = false
}

// Lógica para guardar la edición
function onActualizarExistente(payload) {
  console.log('Datos editados listos para enviar a la base de datos:', payload)
  // Aquí puedes buscar el objeto en tu lista por payload.id y actualizarlo, o enviarlo a tu API
  
  showEditForm.value = false // Cierra el modal
}
</script>
