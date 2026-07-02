import { defineStore } from 'pinia'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { getUsuarios, createUsuario, updateUsuario } from '../services/usuarioService'

export const useUserStore = defineStore('userStore', () => {

  //  Estado 
  const users        = ref([])
  const loading      = ref(false)
  const totalRecords = ref(0)
  const currentPage  = ref(1)
  const perPage      = ref(5)

  // Cargar usuarios con paginación del servidor
  const fetchUsers = async (page = 1, rows = perPage.value) => {
    loading.value = true
    try {
      const response = await getUsuarios(page, rows)
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
      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo cargar la lista de usuarios.',
        confirmButtonColor: '#2b5e3b'
      })
    } finally {
      loading.value = false
    }
  }

  // ── Crear usuario ─────────────────────────────────────────────────────────
  const createUser = async (formData) => {
    const payload = {
      name:     formData.name,
      email:    formData.email,
      password: formData.password,
      pin_caja: formData.cashKey || null,
      rol:      formData.role === 'Administrador' ? 'ADMIN' : formData.role?.toUpperCase()
    }

    try {
      const response = await createUsuario(payload)

      // Recargamos la primera página para reflejar el nuevo registro
      await fetchUsers(1, perPage.value)

      await Swal.fire({
        icon: 'success',
        title: '¡Usuario creado!',
        text: `El usuario "${response.data.user.name}" fue registrado exitosamente.`,
        confirmButtonColor: '#2b5e3b',
        confirmButtonText: 'Aceptar',
        timer: 3000,
        timerProgressBar: true
      })
      return { ok: true }

    } catch (error) {
      if (error.response?.status === 422) {
        const mensajes = Object.values(error.response.data.errors).flat()
        return { ok: false, error: mensajes[0] }
      }
      if (error.response?.status === 403) {
        await Swal.fire({ icon: 'error', title: 'Sin autorización', text: 'No tienes permisos.', confirmButtonColor: '#2b5e3b' })
        return { ok: false }
      }
      await Swal.fire({ icon: 'error', title: 'Error al crear usuario', text: error.response?.data?.message || 'Error en el servidor.', confirmButtonColor: '#2b5e3b' })
      return { ok: false }
    }
  }

  // ── Actualizar usuario ────────────────────────────────────────────────────
  const updateUser = async (id, formData) => {
    const payload = {
      name:     formData.name,
      email:    formData.email,
      pin_caja: formData.cashKey || null,
      rol:      formData.role === 'Administrador' ? 'ADMIN' : formData.role?.toUpperCase(),
      ...(formData.password ? { password: formData.password } : {})
    }

    try {
      const response = await updateUsuario(id, payload)
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) users.value[index] = response.data.user

      await Swal.fire({
        icon: 'success',
        title: '¡Usuario actualizado!',
        text: 'Los datos fueron actualizados exitosamente.',
        confirmButtonColor: '#2b5e3b',
        timer: 3000,
        timerProgressBar: true
      })
      return { ok: true }

    } catch (error) {
      if (error.response?.status === 422) {
        const mensajes = Object.values(error.response.data.errors).flat()
        return { ok: false, error: mensajes[0] }
      }
      await Swal.fire({ icon: 'error', title: 'Error al actualizar', text: error.response?.data?.message || 'Error en el servidor.', confirmButtonColor: '#2b5e3b' })
      return { ok: false }
    }
  }

  // ── Simulación local (prototipo) ──────────────────────────────────────────
  const simulateUpdateUser = (updateData) => {
    const index = users.value.findIndex(u => u.id === updateData.id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updateData }
    }
  }

  return {
    users, loading, totalRecords, currentPage, perPage,
    fetchUsers, createUser, updateUser, simulateUpdateUser
  }
})