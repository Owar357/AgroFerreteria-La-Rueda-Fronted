import { defineStore } from 'pinia'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { getCategorias, createCategoria, updateCategoria } from '../services/categoriaService'

export const useCategoriaStore = defineStore('categoria', () => {

  const categorias = ref([])
  const cargando   = ref(false)

  /**
   * Carga todas las categorías desde la API
   */
  const cargarCategorias = async () => {
    cargando.value = true
    try {
      const response = await getCategorias()
      categorias.value = response.data
    } catch (error) {
      const status = error.response?.status
      
      if (status === 404) {
        categorias.value = []
        return
      }

      if (status === 403) {
        await Swal.fire({
          icon: 'error',
          title: 'Sin autorización',
          text: 'No tienes permisos para ver las categorías.',
          confirmButtonColor: '#2b5e3b'
        })
        return
      }

      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo cargar la lista de categorías. Verifica tu conexión.',
        confirmButtonColor: '#2b5e3b'
      })
    } finally {
      cargando.value = false
    }
  }

  /**
   * Crea una nueva categoría y la agrega al inicio de la lista
   */
  const crearCategoria = async (data) => {
    try {
      const response = await createCategoria(data)
      
      if (response.status === 201 || response.status === 200) {
        const categoriaCreada = response.data.categoria
        categorias.value.unshift(categoriaCreada)

        await Swal.fire({
          icon: 'success',
          title: '¡Categoría creada!',
          text: `La categoría "${categoriaCreada.nombre}" fue registrada exitosamente.`,
          confirmButtonColor: '#2b5e3b',
          confirmButtonText: 'Aceptar',
          timer: 3000,
          timerProgressBar: true
        })
        return { ok: true }
      }
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data

      if (status === 422) {
        const mensajes = Object.values(responseData.errors).flat()
        return { ok: false, error: mensajes[0] }
      }

      if (status === 403) {
        await Swal.fire({
          icon: 'error',
          title: 'Sin autorización',
          text: 'No tienes permisos para realizar esta acción.',
          confirmButtonColor: '#2b5e3b'
        })
        return { ok: false }
      }

      return { ok: false, error: responseData?.message || 'Ocurrió un problema en el servidor.' }
    }
  }

  /**
   * Actualiza una categoría existente y sincroniza la lista local
   */
  const actualizarCategoria = async (id, data) => {
    try {
      const response = await updateCategoria(id, data)

      if (response.status === 200 || response.status === 204) {
        const categoriaActualizada = response.data.categoria
        const index = categorias.value.findIndex((c) => c.id === id)
        
        if (index !== -1) {
          categorias.value[index] = categoriaActualizada
        }

        await Swal.fire({
          icon: 'success',
          title: '¡Categoría actualizada!',
          text: 'La categoría fue actualizada exitosamente.',
          confirmButtonColor: '#2b5e3b',
          confirmButtonText: 'Aceptar',
          timer: 3000,
          timerProgressBar: true
        })
        return { ok: true }
      }
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data

      if (status === 422) {
        const mensajes = Object.values(responseData.errors).flat()
        return { ok: false, error: mensajes[0] }
      }

      if (status === 403) {
        await Swal.fire({
          icon: 'error',
          title: 'Sin autorización',
          text: 'No tienes permisos para realizar esta acción.',
          confirmButtonColor: '#2b5e3b'
        })
        return { ok: false }
      }

      return { ok: false, error: responseData?.message || 'Ocurrió un problema en el servidor.' }
    }
  }

  return {
    categorias,
    cargando,
    cargarCategorias,
    crearCategoria,
    actualizarCategoria
  }
})