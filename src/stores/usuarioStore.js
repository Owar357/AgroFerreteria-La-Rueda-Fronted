import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  desactivarUsuario as desactivarUsuarioService,
} from '../services/usuarioService'
import { reroute } from 'vue-router/dist/experimental/index.js'

export const useUserStore = defineStore('userStore', () => {
  const users = ref([])
  const loading = ref(false)
  const totalRecords = ref(0)
  const currentPage = ref(1)
  const perPage = ref(5)

  //devolvemos los erros
  const formatearError = (error, mensajeDefault) => {
    const status = error.response?.status
    const data = error.response?.data

    if (status === 422 && data?.errors) {
      return {
        ok: false,
        status,
        errors: data.errors,
        error: Object.values(data.errors).flat()[0],
      }
    }

    return { ok: false, status, error: data?.message || mensajeDefault }
  }
  const fetchUsers = async (page = 1, rows = perPage.value) => {
    if (loading.value) return

    loading.value = true
    try {
      const response = await getUsuarios(page, rows)
      users.value = response.data.data
      totalRecords.value = response.data.total
      currentPage.value = response.data.current_page
      perPage.value = response.data.per_page

      return { ok: true, data: response.data.data }
    } catch (error) {
      if (error.response?.status === 404) {
        users.value = []
        totalRecords.value = 0
        return { ok: true, data: [] }
      }
      return {
        ok: false,
        status: error.response?.status,
        error: error.response?.data?.message || 'No se pudo cargar la lista de usuarios.',
      }
    } finally {
      loading.value = false
    }
  }

  const createUser = async (formData) => {
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      rol: formData.role === 'Administrador' ? 'ADMIN' : formData.role?.toUpperCase(),
    }

    try {
      const response = await createUsuario(payload)
      await fetchUsers(1, perPage.value)
      return { ok: true, user: response.data.user }
    } catch (error) {
      return formatearError(error, 'Error en el servidor.')
    }
  }

  
  const updateUser = async (id, payload) => {
    try {
      const response = await updateUsuario(id, payload)
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) users.value[index] = response.data.user
      return { ok: true, user: response.data.user }
    } catch (error) {
      return formatearError(error, 'Error en el servidor.')
    }
  }


  const desactivarUsuario = async (id) => {
    try {
      const response = await desactivarUsuarioService(id)

      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) users.value[index].activo = false

      return { ok: true, data: response?.data }
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data

      return {
        ok: false,
        status,
        error: responseData?.message || 'Error al desactivar el usuario.',
      }
    }
  }

  return {
    users,
    loading,
    totalRecords,
    currentPage,
    perPage,
    fetchUsers,
    createUser,
    updateUser,
    desactivarUsuario,
  }
})
