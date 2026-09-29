<template>
  <div>
    <UserTable
      @open-add="showAddModal = true"
      @open-edit="prepararEdicion"
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
import { useUserStore } from '../stores/usuarioStore'

import UserTable     from '../components/Usuarios/UserTable.vue'
import AddUserDialog from '../components/Usuarios/AddUserDialog.vue'
import EditUserDialog from '../components/Usuarios/EditUserDialog.vue'

const store = useUserStore()

const showAddModal  = ref(false)
const showEditModal = ref(false)
const userToEdit    = ref(null)

onMounted(() => store.fetchUsers())

const prepararEdicion = (user) => {
  userToEdit.value   = { ...user }
  showEditModal.value = true
}
</script>