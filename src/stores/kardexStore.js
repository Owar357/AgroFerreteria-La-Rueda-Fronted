import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getKardexByProducto } from '@/services/kardexService'

export const useKardexStore = defineStore('kardex', () => {
  const movimientos  = ref([])
  const metricas     = ref({
    total_entradas: 0,
    total_salidas: 0,
    monto_total_entradas: 0,
    monto_total_salidas: 0
  })
  const cargando     = ref(false)
  const totalRecords = ref(0)
  const currentPage  = ref(1)
  const perPage      = ref(10)

  const cargarKardex = async (productoId, page = 1, rows = perPage.value, filtros = {}) => {
    cargando.value = true

    try {
      const response = await getKardexByProducto(productoId, page, rows, filtros)
      const paginacion = response.data.data

      movimientos.value  = paginacion.data ?? []
      totalRecords.value = paginacion.total ?? 0
      currentPage.value  = paginacion.current_page ?? page
      perPage.value      = paginacion.per_page ?? rows

      if (response.data.metricas) {
        metricas.value = response.data.metricas
      }

      return { ok: true }
    } catch (error) {
      movimientos.value  = []
      totalRecords.value = 0
      metricas.value     = {
        total_entradas: 0,
        total_salidas: 0,
        monto_total_entradas: 0,
        monto_total_salidas: 0
      }
      return {
        ok: false,
        status: error.response?.status,
        error: error.response?.data?.message || 'No se pudo cargar el historial del Kardex.'
      }
    } finally {
      cargando.value = false
    }
  }

  const limpiarKardex = () => {
    movimientos.value  = []
    totalRecords.value = 0
    currentPage.value  = 1
    metricas.value     = {
      total_entradas: 0,
      total_salidas: 0,
      monto_total_entradas: 0,
      monto_total_salidas: 0
    }
  }

  return {
    movimientos,
    metricas,
    cargando,
    totalRecords,
    currentPage,
    perPage,
    cargarKardex,
    limpiarKardex
  }
})