import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getProductos,
  createProducto,
  updateProducto,
  getAllCategorias,
} from '../services/productoService'
import { getUnidades } from '@/services/unidadMedidaService'

export const useproductoStore = defineStore('producto', () => {
  // Estado
  const productos = ref([])
  const cargando = ref(false)
  const totalRecords = ref(0)
  const currentPage = ref(1)
  const perPage = ref(8)
  const categorias = ref([])
  const unidades = ref([])

  // Cargar Unidades de Medida
  const cargarUnidades = async (magnitud = null) => {
    try {
      const params = magnitud ? { magnitud } : {}
      const response = await getUnidades(params)
      const data = response.data?.data ?? response.data
      unidades.value = data
      return { ok: true, data }
    } catch (error) {
      console.error('Error al cargar unidades:', error)
      return {
        ok: false,
        status: error.response?.status,
        error: error.response?.data?.message || 'No se pudieron cargar las unidades de medida.',
      }
    }
  }

  // Cargar Productos (Paginados y con Filtros)
  const cargarProductos = async (page = 1, rows = perPage.value, search = '', categoria = null) => {
    cargando.value = true

    try {
      const response = await getProductos(page, rows, search, categoria)

      if (response.data?.status === 'ok' || response.data?.data) {
        productos.value = response.data.data
        totalRecords.value = response.data.total
        currentPage.value = response.data.current_page
        perPage.value = response.data.per_page
        return { ok: true, data: response.data.data }
      }

      return { ok: true, data: [] }
    } catch (error) {
      if (error.response?.status === 404) {
        productos.value = []
        totalRecords.value = 0
        return { ok: true, data: [] }
      }
      return {
        ok: false,
        status: error.response?.status,
        error: error.response?.data?.message || 'No se pudo cargar la lista de productos.',
      }
    } finally {
      cargando.value = false
    }
  }

  // Cargar Categorías
  const cargarCategorias = async () => {
    try {
      const response = await getAllCategorias()
      const data = response.data?.data ?? response.data
      categorias.value = data
      return { ok: true, data }
    } catch (error) {
      if (error.response?.status === 404) {
        categorias.value = []
        return { ok: true, data: [] }
      }
      return {
        ok: false,
        status: error.response?.status,
        error: error.response?.data?.message || 'No se pudieron cargar las categorías.',
      }
    }
  }

  // Crear Producto
  const crearProducto = async (data) => {
    try {
      const response = await createProducto(data)
      await cargarProductos(1, perPage.value)
      return { ok: true, data: response.data }
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data

      if (status === 422 && responseData?.errors) {
        const mensajes = Object.values(responseData.errors).flat()
        return { ok: false, status, error: mensajes[0], mensajes }
      }
      return {
        ok: false,
        status,
        error: responseData?.message || 'Error del servidor al crear producto.',
      }
    }
  }

  // Actualizar Producto
  const actualizarProducto = async (id, data) => {
    try {
      const response = await updateProducto(id, data)

      const index = productos.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        productos.value[index] = { ...productos.value[index], ...response.data.data }
      }

      return { ok: true, data: response.data.data }
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data

      if (status === 422 && responseData?.errors) {
        const mensajes = Object.values(responseData.errors).flat()
        return { ok: false, status, error: mensajes[0], mensajes }
      }
      return {
        ok: false,
        status,
        error: responseData?.message || 'Error del servidor al actualizar producto.',
      }
    }
  }

  return {
    productos,
    cargando,
    totalRecords,
    currentPage,
    perPage,
    categorias,
    unidades,
    cargarUnidades,
    cargarProductos,
    cargarCategorias,
    crearProducto,
    actualizarProducto,
  }
})