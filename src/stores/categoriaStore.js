import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategorias, createCategoria, updateCategoria } from '../services/categoriaService'

export const useCategoriaStore = defineStore('categoria', () => {
  const categorias = ref([])
  const cargando = ref(false)
  const totalRecords = ref(0)
  const currentPage = ref(1)
  const perPage = ref(5)

  const cargarCategorias = async (page = 1, rows = perPage.value) => {
    cargando.value = true
    try {
      const response = await getCategorias(page, rows)
      categorias.value = response.data.data
      totalRecords.value = response.data.total
      currentPage.value = response.data.current_page
      perPage.value = response.data.per_page
    } catch (error) {
      if (error.response?.status === 404) {
        categorias.value = []
        totalRecords.value = 0
        return
      }
      // Devolvemos el error para que el componente lo maneje
      return { ok: false, status: error.response?.status, error: error.response?.data?.message }
    } finally {
      cargando.value = false
    }
  }

  const crearCategoria = async (data) => {
    try {
      const response = await createCategoria(data)
      await cargarCategorias(1, perPage.value)
      return { ok: true, categoria: response.data.categoria }
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data

      if (status === 422) {
        const mensajes = Object.values(responseData.errors).flat()
        return { ok: false, error: mensajes[0] }
      }
      return { ok: false, status, error: responseData?.message || 'Error en el servidor.' }
    }
  }

  const actualizarCategoria = async (id, data) => {
    try {
      const response = await updateCategoria(id, data)
      const index = categorias.value.findIndex((c) => c.id === id)
      if (index !== -1) categorias.value[index] = response.data.categoria
      return { ok: true }
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data

      if (status === 422) {
        const mensajes = Object.values(responseData.errors).flat()
        return { ok: false, error: mensajes[0] }
      }
      return { ok: false, status, error: responseData?.message || 'Error en el servidor.' }
    }
  }

  return {
    categorias,
    cargando,
    totalRecords,
    currentPage,
    perPage,
    cargarCategorias,
    crearCategoria,
    actualizarCategoria,
  }
})
