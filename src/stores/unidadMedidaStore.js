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
      return { ok: true }
    } catch (error) {
      return {
        ok: false,
        error: error.response?.data?.message || 'Error al cargar unidades'
      }
    } finally {
      cargando.value = false
    }
  }

  const getUnidadesByMagnitud = (magnitud) => {
    return unidades.value.filter(u => u.magnitud === magnitud)
  }

  return {
    unidades,
    cargando,
    cargarUnidades,
    getUnidadesByMagnitud
  }
})