import { defineStore } from 'pinia'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { getCategorias, createCategoria, updateCategoria } from '../services/categoriaService'

export const useCategoriaStore = defineStore('categoria', () => {

  // ── Estado ─────────────────────────────────────────────────────────────────
  const categorias   = ref([])
  const cargando     = ref(false)
  const totalRecords = ref(0)
  const currentPage  = ref(1)
  const perPage      = ref(5)

  // ── Cargar categorías con paginación del servidor ─────────────────────────
  const cargarCategorias = async (page = 1, rows = perPage.value) => {
    cargando.value = true
    try {
      const response = await getCategorias(page, rows)
      categorias.value   = response.data.data
      totalRecords.value = response.data.total
      currentPage.value  = response.data.current_page
      perPage.value      = response.data.per_page

    } catch (error) {
      if (error.response?.status === 404) {
        categorias.value   = []
        totalRecords.value = 0
        return
      }
      if (error.response?.status === 403) {
        await Swal.fire({ icon: 'error', title: 'Sin autorización', text: 'No tienes permisos para ver las categorías.', confirmButtonColor: '#2b5e3b' })
        return
      }
      await Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo cargar la lista de categorías.', confirmButtonColor: '#2b5e3b' })
    } finally {
      cargando.value = false
    }
  }

  // ── Crear categoría ───────────────────────────────────────────────────────
  const crearCategoria = async (data) => {
    try {
      const response = await createCategoria(data)

      // Recargamos la primera página para reflejar el nuevo registro
      await cargarCategorias(1, perPage.value)

      await Swal.fire({
        icon: 'success',
        title: '¡Categoría creada!',
        text: `La categoría "${response.data.categoria.nombre}" fue registrada exitosamente.`,
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
      await Swal.fire({ icon: 'error', title: 'Error al crear categoría', text: error.response?.data?.message || 'Error en el servidor.', confirmButtonColor: '#2b5e3b' })
      return { ok: false }
    }
  }

  // ── Actualizar categoría ──────────────────────────────────────────────────
  const actualizarCategoria = async (id, data) => {
    try {
      const response = await updateCategoria(id, data)
      const index = categorias.value.findIndex((c) => c.id === id)
      if (index !== -1) categorias.value[index] = response.data.categoria

      await Swal.fire({
        icon: 'success',
        title: '¡Categoría actualizada!',
        text: 'La categoría fue actualizada exitosamente.',
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

  return {
    categorias, cargando, totalRecords, currentPage, perPage,
    cargarCategorias, crearCategoria, actualizarCategoria
  }
})