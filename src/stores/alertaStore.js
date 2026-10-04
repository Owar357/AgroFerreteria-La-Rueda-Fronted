import { defineStore } from 'pinia'
import { obtenerAlertas, toggleLeida } from '@/services/alertaService'

export const useAlertaStore = defineStore('alerta', {
  state: () => ({
    alertas: [],
    noLeidas: 0,
    cargando: false,
    error: null,
  }),

  persist: true,

  getters: {
    alertasPorTipo: (state) => {
      const grupos = {}
      state.alertas.forEach((alerta) => {
        const tipo = alerta.tipo
        if (!grupos[tipo]) grupos[tipo] = []
        grupos[tipo].push(alerta)
      })
      return grupos
    },

    noLeidasList: (state) => state.alertas.filter((a) => !a.leida),
    leidasList: (state) => state.alertas.filter((a) => a.leida),
    porTipo: (state) => (tipo) => state.alertas.filter((a) => a.tipo === tipo),
  },

  actions: {
    async fetchAlertas() {
      if (this.cargando) return

      this.cargando = true
      this.error = null

      try {
        const response = await obtenerAlertas()
        if (response.data?.status === 'ok') {
          this.alertas = response.data.data
          this.noLeidas = response.data.no_leidas
          return { ok: true, data: response.data.data }
        }
        return { ok: false, error: 'Respuesta inesperada del servidor' }
      } catch (error) {
        const status = error.response?.status
        const msg = error.response?.data?.message || error.message || 'Error al cargar alertas'
        this.error = msg
        return { ok: false, status, error: msg }
      } finally {
        this.cargando = false
      }
    },

    async toggleLeida(id) {
      try {
        const response = await toggleLeida(id)
        if (response.data?.status === 'ok') {
          const index = this.alertas.findIndex((a) => a.id === id)
          if (index !== -1) {
            this.alertas[index].leida = response.data.data.leida
            this.alertas[index].leida_por = response.data.data.leida_por
          }
          this.noLeidas = this.alertas.filter((a) => !a.leida).length
          return { ok: true, data: response.data }
        }
        return { ok: false, error: 'No se pudo actualizar la alerta' }
      } catch (error) {
        const status = error.response?.status
        const msg = error.response?.data?.message || 'Error al cambiar estado de alerta'
        return { ok: false, status, error: msg }
      }
    },

    reset() {
      this.alertas = []
      this.noLeidas = 0
      this.cargando = false
      this.error = null
    },
  },
})