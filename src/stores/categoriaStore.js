import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategorias, createCategoria, updateCategoria } from '../services/categoriaService'

export const useCategoriaStore = defineStore('categoria', () => {
  const categorias = ref([])
  const cargando = ref(false)
  const totalRegistros = ref(0)
  const paginaActual = ref(1)
  const porPagina = ref(5)
  const terminoBusqueda = ref('')

  let debounceTimeout = null

  const cargarCategorias = async (page = 1, rows = porPagina.value) => {

    if (cargando.value) return
    cargando.value = true
    try {
      const response = await getCategorias(page, rows, terminoBusqueda.value)
      categorias.value = response.data.data
      totalRegistros.value = response.data.total
      paginaActual.value = response.data.current_page
      porPagina.value = response.data.per_page
    } catch (error) {
      if (error.response?.status === 404) {
        categorias.value = []
        totalRegistros.value = 0
        return
      }
      return { ok: false, status: error.response?.status, error: error.response?.data?.message }
    } finally {
      cargando.value = false
    }
  }

  const buscarCategorias = (term) => {
    terminoBusqueda.value = term

    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      paginaActual.value = 1
      cargarCategorias(1, porPagina.value)
    }, 400)
  }

  const crearCategoria = async (data) => {
    try {
      const response = await createCategoria(data)
      await cargarCategorias(1, porPagina.value)
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
    totalRegistros,
    paginaActual,
    porPagina,
    terminoBusqueda,
    cargarCategorias,
    buscarCategorias,
    crearCategoria,
    actualizarCategoria,
  }
})