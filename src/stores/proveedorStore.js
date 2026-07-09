import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProveedores, createProveedor, updateProveedor } from '../services/proveedorService'

export const useProveedorStore = defineStore('proveedor', () => {
  const proveedores  = ref([])
  const cargando     = ref(false)
  const totalRecords = ref(0)
  const currentPage  = ref(1)
  const perPage      = ref(7)

  const cargarProveedores = async (page = 1, rows = perPage.value) => {
    cargando.value = true
    try {
      const response     = await getProveedores(page, rows)
      proveedores.value  = response.data.proveedores
      totalRecords.value = response.data.total
      currentPage.value  = response.data.current_page
      perPage.value      = response.data.per_page
    } catch (error) {
      if (error.response?.status === 404) {
        proveedores.value  = []
        totalRecords.value = 0
        return
      }
      return {
        ok: false,
        status: error.response?.status,
        error: error.response?.data?.message || 'Error de conexión'
      }
    } finally {
      cargando.value = false
    }
  }

  const crearProveedor = async (data) => {
    try {
      const response = await createProveedor(data)
      await cargarProveedores(1, perPage.value)
      return { ok: true, proveedor: response.data.data }
    } catch (error) {
      const status       = error.response?.status
      const responseData = error.response?.data
      if (status === 422) {
        const mensajes = Object.values(responseData.errors).flat()
        return { ok: false, status, error: mensajes[0] }
      }
      return { ok: false, status, error: responseData?.message || 'Error en el servidor.' }
    }
  }

  const actualizarProveedor = async (id, data) => {
    try {
      await updateProveedor(id, data)
      const index = proveedores.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        proveedores.value[index] = { ...proveedores.value[index], ...data }
      }
      return { ok: true }
    } catch (error) {
      const status       = error.response?.status
      const responseData = error.response?.data
      if (status === 422) {
        const mensajes = Object.values(responseData.errors).flat()
        return { ok: false, status, error: mensajes[0] }
      }
      return { ok: false, status, error: responseData?.message || 'Error en el servidor.' }
    }
  }

  const toggleEstado = async (proveedor) => {
    const nuevoEstado = proveedor.activo ? 'Inactivo' : 'Activo'
    try {
      await updateProveedor(proveedor.id, { ...proveedor, estado: nuevoEstado })
      const index = proveedores.value.findIndex((p) => p.id === proveedor.id)
      if (index !== -1) proveedores.value[index].activo = !proveedor.activo
      return { ok: true, nuevoEstado }
    } catch (error) {
      const status       = error.response?.status
      const responseData = error.response?.data
      return { ok: false, status, error: responseData?.message || 'Error al cambiar estado.' }
    }
  }

  return {
    proveedores, cargando, totalRecords, currentPage, perPage,
    cargarProveedores, crearProveedor, actualizarProveedor, toggleEstado,
  }
})