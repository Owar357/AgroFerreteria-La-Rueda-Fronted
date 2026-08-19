import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getClientes, createCliente } from '../services/clienteService'

export const useClienteStore = defineStore('cliente', () => {
  const clientes     = ref([])
  const cargando     = ref(false)
  const totalRecords = ref(0)
  const paginaActual = ref(1)
  const porPagina    = ref(10)

  const cargarClientes = async (page = 1, rows = porPagina.value) => {
    cargando.value = true
    try {
      const response   = await getClientes(page, rows)
      const paginacion = response.data.data

      clientes.value     = paginacion.data
      totalRecords.value = paginacion.total
      paginaActual.value = paginacion.current_page
      porPagina.value    = paginacion.per_page
    } catch (error) {
      if (error.response?.status === 404) {
        clientes.value     = []
        totalRecords.value = 0
        return
      }
      // Devolvemos el error para que el componente lo maneje
      return {
        ok: false,
        status: error.response?.status,
        error: error.response?.data?.message || 'Error de conexión'
      }
    } finally {
      cargando.value = false
    }
  }

  const crearCliente = async (data) => {
    try {
      const response = await createCliente(data)
      await cargarClientes(1, porPagina.value)
      return { ok: true, cliente: response.data.data }
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

  return {
    clientes, cargando, totalRecords, paginaActual, porPagina,
    cargarClientes, crearCliente,
  }
})