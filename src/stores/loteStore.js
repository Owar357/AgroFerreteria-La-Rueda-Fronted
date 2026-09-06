import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLotesByPresentacion, updateDescuentoLote } from '@/services/productoService'
import Swal from 'sweetalert2'

export const useLoteStore = defineStore('lote', () => {

  const lotes = ref([])
  const cargando = ref(false)
  const totalRecords = ref(0)
  const currentPage = ref(1)
  const perPage = ref(5)

  const fetchLotesByPresentacion = async (presentacionId, page = 1, rows = perPage.value) => {
    cargando.value = true
    try {
      const res = await getLotesByPresentacion(presentacionId, page, rows)
      lotes.value = res.data.data
      totalRecords.value = res.data.total
      currentPage.value = res.data.current_page
      perPage.value = res.data.per_page
    } catch (error) {
      const status = error.response?.status
      if (status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Presentación no encontrada',
          text: 'Esta presentación ya no existe.',
          confirmButtonColor: '#2b5e3b',
        })
      } else if (status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Sin autorización',
          text: 'No tiene permisos para ver los lotes.',
          confirmButtonColor: '#2b5e3b',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los lotes.',
          confirmButtonColor: '#2b5e3b',
        })
      }
      throw error
    } finally {
      cargando.value = false
    }
  }

  const actualizarDescuento = async (loteId, porcentajeDescuento, presentacionId) => {
    try {
      const res = await updateDescuentoLote(loteId, porcentajeDescuento)
      
      Swal.fire({
        icon: 'success',
        title: 'Descuento actualizado',
        text: res.data.message || 'El porcentaje de descuento ha sido actualizado correctamente.',
        confirmButtonColor: '#2b5e3b',
        timer: 2000,
        showConfirmButton: false
      })

      
      await fetchLotesByPresentacion(presentacionId, currentPage.value, perPage.value)
      return res.data
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al actualizar el descuento del lote'
      Swal.fire({
        icon: 'error',
        title: 'Error al aplicar descuento',
        text: mensaje,
        confirmButtonColor: '#2b5e3b',
      })
      throw error
    }
  }

  return {
    lotes,
    cargando,
    totalRecords,
    currentPage,
    perPage,
    fetchLotesByPresentacion,
    actualizarDescuento
  }
})