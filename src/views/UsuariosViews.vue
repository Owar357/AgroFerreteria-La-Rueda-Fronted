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

import UserTable from '../components/Usuarios/UserTable.vue'
import AddUserDialog from '../components/Usuarios/AddUserDialog.vue'
import EditUserDialog from '../components/Usuarios/EditUserDialog.vue'
import { mostrarError, mostrarAccesoDenegado } from '@/utils/SweetAlertService'

const store = useUserStore()

const showAddModal = ref(false)
const showEditModal = ref(false)
const userToEdit = ref(null)

onMounted(async () => {
  try {
    const res = await store.fetchUsers()
    if (res && res.status === 403) {
      mostrarAccesoDenegado()
    } else if (res && !res.ok && res.error) {
      mostrarError('Error de carga', res.error)
    }
  } catch (err) {
    if (err.response?.status === 403) {
      mostrarAccesoDenegado()
    } else {
      mostrarError('Error de conexión', 'No se pudo obtener el listado de usuarios.')
    }
  }
})

const prepararEdicion = (user) => {
  userToEdit.value = { ...user }
  showEditModal.value = true
}
</script>