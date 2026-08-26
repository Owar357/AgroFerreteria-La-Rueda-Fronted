import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProductos, createProducto, updateProducto, getAllCategorias } from '../services/productoService'
import { getUnidades } from '@/services/unidadMedidaService'


export const useproductoStore = defineStore('productos', () => {
  const productos     = ref([])
  const cargando      = ref(false)
  const totalRecords  = ref(0)
  const currentPage    = ref(1)
  const perPage       = ref(8)
  const categorias    = ref([])
  const unidades = ref([])

  const cargarUnidades = async (magnitud = null) => {
  try {
    const params = magnitud ? { magnitud } : {}
    const response = await getUnidades(params)
    unidades.value = response.data.data
  } catch (error) {
    // manejar error
  }
}

  const cargarProductos = async (page = 1, rows = perPage.value) => {
    cargando.value = true

    try {

      const response = await getProductos(page, rows)
     
      productos.value     = response.data.data
      totalRecords.value  = response.data.total
      currentPage.value = response.data.current_page
      perPage.value       = response.data.per_page

     
    } catch (error) {
      if (error.response?.status === 404) {
        productos.value    = []
        totalRecords.value = 0

        return
      }
      return {
        ok: false,
        status: error.response?.status,
        error: error.response?.data?.message || 'No se pudo cargar la lista de productos.'
      }
    } finally {
      cargando.value = false
    }
  }

  const cargarCategorias = async () => {
    try {
      const response      = await getAllCategorias()
      categorias.value    = response.data.data ?? response.data
    } catch (error) {
      if (error.response?.status === 404) {
        categorias.value = []
        return
      }
      return {
        ok: false,
        status: error.response?.status,
        error: error.response?.data?.message || 'No se pudieron cargar las categorías.'
      }
    }
  }

  const crearProducto = async (data) => {
    try {
      await createProducto(data)
      await cargarProductos(1, perPage.value)
      return { ok: true }
    } catch (error) {
      const status       = error.response?.status
      const responseData = error.response?.data

      if (status === 422) {
        const mensaje = Object.values(responseData.errors).flat()
        return { ok: false, status, error: mensaje[0] }
      }
      return {
        ok: false,
        status,
        error: responseData?.message || 'Error del servidor.'
      }
    }
  }

//agregamos lo de editar productos para que ya no sea local//kathii lo modifique para que conecte con el backend
const actualizarProducto = async (id, data) => {
  try {
    const response = await updateProducto(id, data)

    const index = productos.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      productos.value[index] = { ...productos.value[index], ...response.data.data }
    }

    return { ok: true }
  } catch (error) {
    const status = error.response?.status
    const responseData = error.response?.data

    if (status === 422) {
      const mensaje = Object.values(responseData.errors).flat()
      return { ok: false, status, error: mensaje[0] }
    }
    return {
      ok: false,
      status,
      error: responseData?.message || 'Error del servidor.'
    }
  }
}

return {
  productos, cargando, totalRecords, currentPage, perPage, categorias,
  cargarProductos, cargarCategorias, crearProducto, actualizarProducto,
}

  
})