import { defineStore } from 'pinia'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { getClientes, createCliente } from '../services/clienteService'

const handleApiError = async (error, customTitle = 'Error') => {
  const status       = error.response?.status
  const responseData = error.response?.data

  if (status === 422) {
    const mensajes = Object.values(responseData.errors).flat()
    return { ok: false, error: mensajes[0] }
  }

  await Swal.fire({
    icon: 'error',
    title: customTitle,
    text: responseData?.message || 'Error en el servidor.',
    confirmButtonColor: '#2b5e3b',
  })
  return { ok: false, error: responseData?.message || 'Error en el servidor.' }
}

export const useClienteStore = defineStore('cliente', () => {
  const clientes     = ref([])
  const cargando     = ref(false)
  const totalRecords = ref(0)
  const paginaActual = ref(1)
  const porPagina    = ref(10)

  const cargarClientes = async (page = 1, rows = porPagina.value) => {
    cargando.value = true
    try {
      const response     = await getClientes(page, rows)
        
      const paginacion   = response.data.data

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
      await handleApiError(error, 'Error de conexión')
    } finally {
      cargando.value = false
    }
  }

  const crearCliente = async (data) => {
    try {
      await createCliente(data)
      await cargarClientes(1, porPagina.value)
      await Swal.fire({
        icon: 'success',
        title: '¡Cliente registrado!',
        text: 'El cliente fue registrado exitosamente.',
        confirmButtonColor: '#2b5e3b',
        timer: 3000,
        timerProgressBar: true,
      })
      return { ok: true }
    } catch (error) {
      return await handleApiError(error, 'Error al crear cliente')
    }
  }

  return {
    clientes, cargando, totalRecords, paginaActual, porPagina,
    cargarClientes, crearCliente,
  }
})