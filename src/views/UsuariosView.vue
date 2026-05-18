<template>
  <div>
    <UserTable 
      @open-add="showAddModal = true" 
      @open-edit="prepareEdit" 
    />

    <AddUserDialog 
      v-model:visible="showAddModal" 
      @save="onSaveNewUser"
    />

    <EditUserDialog 
      v-model:visible="showEditModal" 
      :user="userToEdit"
      @update="onUpdateUser"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Importamos los componentes desde su carpeta correspondiente
import UserTable from '../components/Usuarios/UserTable.vue'
import AddUserDialog from '../components/Usuarios/AddUserDialog.vue'
import EditUserDialog from '../components/Usuarios/EditUserDialog.vue'

// Control de visibilidad de los modales
const showAddModal = ref(false)
const showEditModal = ref(false)

// Objeto para almacenar temporalmente al usuario que se va a editar
const userToEdit = ref(null)

// Función que se ejecuta cuando tocas el lápiz en la tabla
const prepareEdit = (user) => {
  userToEdit.value = { ...user } // Clonamos el objeto para trabajar seguros
  showEditModal.value = true     // Abrimos el modal de edición
}

// Funciones para cuando se guardan los datos (lógica JS)
const onSaveNewUser = (newData) => {
  console.log('Datos del nuevo usuario listos para guardar:', newData)
  showAddModal.value = false
}

const onUpdateUser = (updatedData) => {
  console.log('Datos del usuario listos para actualizar:', updatedData)
  showEditModal.value = false
}
</script>