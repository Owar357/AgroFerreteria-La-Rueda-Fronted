<template>
  <div>
    <UserTable
      @open-add="showAddModal = true"
      @open-edit="prepareEdit"
    />

    <AddUserDialog
      v-model:visible="showAddModal"
    />

    <EditUserDialog
      v-model:visible="showEditModal"
      :user="userToEdit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
<<<<<<< HEAD
import { useUserStore } from '../stores/userStore'
=======
import { useUserStore } from '../stores/usuarioStore'
>>>>>>> rama_prueba

import UserTable     from '../components/Usuarios/UserTable.vue'
import AddUserDialog from '../components/Usuarios/AddUserDialog.vue'
import EditUserDialog from '../components/Usuarios/EditUserDialog.vue'

const store = useUserStore()

const showAddModal  = ref(false)
const showEditModal = ref(false)
const userToEdit    = ref(null)

onMounted(() => store.fetchUsers())

const prepareEdit = (user) => {
  userToEdit.value  = { ...user }
  showEditModal.value = true
}
</script>