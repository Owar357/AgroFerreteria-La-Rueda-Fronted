import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLotesByPresentacion, updateDescuentoLote } from '@/services/productoService'

export const useLoteStore = defineStore('lote', () => {
  const lotes = ref([])
  const cargando = ref(false)
  const totalRecords = ref(0)
  const stockTotalActivo = ref(0)
  const currentPage = ref(1)
  const perPage = ref(5)

  const fetchLotesByPresentacion = async (presentacionId, page = 1, rows = perPage.value) => {
    cargando.value = true
    try {
      const res = await getLotesByPresentacion(presentacionId, page, rows)
      lotes.value = res.data.data
      totalRecords.value = res.data.total
      stockTotalActivo.value = res.data.stock_total_activo ?? 0
      currentPage.value = res.data.current_page
      perPage.value = res.data.per_page

      return { ok: true, data: res.data.data }
    } catch (error) {
      const status = error.response?.status
      const msg = error.response?.data?.message || 'No se pudieron cargar los lotes.'

      if (status === 404) {
        lotes.value = []
        totalRecords.value = 0
        stockTotalActivo.value = 0
      }

      return {
        ok: false,
        status,
        error: msg
      }
    } finally {
      cargando.value = false
    }
  }

  const actualizarDescuento = async (loteId, porcentajeDescuento, presentacionId) => {
    try {
      const res = await updateDescuentoLote(loteId, porcentajeDescuento)
      await fetchLotesByPresentacion(presentacionId, currentPage.value, perPage.value)
      return { ok: true, data: res.data }
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data

      if (status === 422 && responseData?.errors) {
        const mensajes = Object.values(responseData.errors).flat()
        return { ok: false, status, error: mensajes[0] }
      }

      return {
        ok: false,
        status,
        error: responseData?.message || 'Error al actualizar el descuento del lote.'
      }
    }
  }

  return {
    lotes,
    cargando,
    totalRecords,
    stockTotalActivo,
    currentPage,
    perPage,
    fetchLotesByPresentacion,
    actualizarDescuento
  }
})