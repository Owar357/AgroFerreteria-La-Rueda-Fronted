import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUnidades } from '@/services/unidadMedidaService'

export const useUnidadMedidaStore = defineStore('unidadMedida', () => {
  const unidades = ref([])
  const cargando = ref(false)

  const cargarUnidades = async (params = {}) => {
    cargando.value = true
    try {
      const response = await getUnidades(params)
      unidades.value = response.data.data || []
      return { ok: true, data: unidades.value }
    } catch (error) {
      const status = error.response?.status
      const msg = error.response?.data?.message || 'Error al cargar unidades de medida.'
      return {
        ok: false,
        status,
        error: msg
      }
    } finally {
      cargando.value = false
    }
  }

  const getUnidadesByMagnitud = (magnitud) => {
    return unidades.value.filter((u) => u.magnitud === magnitud)
  }

  return {
    unidades,
    cargando,
    cargarUnidades,
    getUnidadesByMagnitud
  }
})