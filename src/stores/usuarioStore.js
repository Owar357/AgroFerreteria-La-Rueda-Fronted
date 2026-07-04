import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUsuarios, createUsuario, updateUsuario } from '../services/usuarioService'

export const useUserStore = defineStore('userStore', () => {
  const users        = ref([])
  const loading      = ref(false)
  const totalRecords = ref(0)
  const currentPage  = ref(1)
  const perPage      = ref(5)

  const fetchUsers = async (page = 1, rows = perPage.value) => {
    loading.value = true
    try {
      const response     = await getUsuarios(page, rows)
      users.value        = response.data.data
      totalRecords.value = response.data.total
      currentPage.value  = response.data.current_page
      perPage.value      = response.data.per_page
    } catch (error) {
      if (error.response?.status === 404) {
        users.value        = []
        totalRecords.value = 0
        return
      }
      return {
        ok: false,
        status: error.response?.status,
        error: error.response?.data?.message || 'No se pudo cargar la lista de usuarios.'
      }
    } finally {
      loading.value = false
    }
  }

  const createUser = async (formData) => {
    const payload = {
      name:     formData.name,
      email:    formData.email,
      password: formData.password,
      pin_caja: formData.cashKey || null,
      rol:      formData.role === 'Administrador' ? 'ADMIN' : formData.role?.toUpperCase(),
    }

    try {
      const response = await createUsuario(payload)
      await fetchUsers(1, perPage.value)
      return { ok: true, user: response.data.user }
    } catch (error) {
      const status       = error.response?.status
      const responseData = error.response?.data

      if (status === 422) {
        const mensajes = Object.values(responseData.errors).flat()
        return { ok: false, status, error: mensajes[0] }
      }
      return {
        ok: false,
        status,
        error: responseData?.message || 'Error en el servidor.'
      }
    }
  }

  // Segunda fase — conectar al backend
  const updateUser = async (id, formData) => {
    const payload = {
      name:     formData.name,
      email:    formData.email,
      pin_caja: formData.cashKey || null,
      rol:      formData.role === 'Administrador' ? 'ADMIN' : formData.role?.toUpperCase(),
      ...(formData.password ? { password: formData.password } : {}),
    }

    try {
      const response = await updateUsuario(id, payload)
      const index    = users.value.findIndex((u) => u.id === id)
      if (index !== -1) users.value[index] = response.data.user
      return { ok: true }
    } catch (error) {
      const status       = error.response?.status
      const responseData = error.response?.data

      if (status === 422) {
        const mensajes = Object.values(responseData.errors).flat()
        return { ok: false, status, error: mensajes[0] }
      }
      return {
        ok: false,
        status,
        error: responseData?.message || 'Error en el servidor.'
      }
    }
  }

  // Local — se mantiene para la segunda fase
  const simulateUpdateUser = (updateData) => {
    const index = users.value.findIndex((u) => u.id === updateData.id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updateData }
    }
  }

  return {
    users, loading, totalRecords, currentPage, perPage,
    fetchUsers, createUser, updateUser, simulateUpdateUser,
  }
})