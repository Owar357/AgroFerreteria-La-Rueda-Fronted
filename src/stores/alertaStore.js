import { defineStore } from 'pinia'
import { obtenerAlertas, toggleLeida } from '@/services/alertaService'

export const useAlertaStore = defineStore('alerta', {
  state: () => ({
    alertas: [],
    noLeidas: 0,
    cargando: false,
    error: null,
    intervaloActualizacion: null,
    intervaloConfigurado: 600000, 
  }),

  persist: true,

  getters: {
    alertasPorTipo: (state) => {
      const grupos = {}
      state.alertas.forEach(alerta => {
        const tipo = alerta.tipo
        if (!grupos[tipo]) grupos[tipo] = []
        grupos[tipo].push(alerta)
      })
      return grupos
    },

    noLeidasList: (state) => state.alertas.filter(a => !a.leida),
    leidasList: (state) => state.alertas.filter(a => a.leida),
    porTipo: (state) => (tipo) => state.alertas.filter(a => a.tipo === tipo),
  },

  actions: {
    async fetchAlertas() {
      this.cargando = true
      this.error = null
      try {
        const response = await obtenerAlertas()
        if (response.data.status === 'ok') {
          this.alertas = response.data.data
          this.noLeidas = response.data.no_leidas
        } else {
          throw new Error(response.data.message || 'Error al obtener alertas')
        }
      } catch (error) {
        console.error('Error en fetchAlertas:', error)
        this.error = error.message || 'Error al cargar alertas'
      } finally {
        this.cargando = false
      }
    },

    async toggleLeida(id) {
      try {
        const response = await toggleLeida(id)
        if (response.data.status === 'ok') {
          const index = this.alertas.findIndex(a => a.id === id)
          if (index !== -1) {
            this.alertas[index].leida = response.data.data.leida
            this.alertas[index].leida_por = response.data.data.leida_por
          }
          this.noLeidas = this.alertas.filter(a => !a.leida).length
          return response.data
        }
      } catch (error) {
        console.error('Error en toggleLeida:', error)
        throw error
      }
    },

    iniciarActualizacionAutomatica(interval = 600000) {
      this.intervaloConfigurado = interval

      if (this.intervaloActualizacion) {
        clearInterval(this.intervaloActualizacion)
      }

      this.fetchAlertas()

      if (document.visibilityState === 'visible') {
        this.intervaloActualizacion = setInterval(() => {
          this.fetchAlertas()
        }, this.intervaloConfigurado)
      }

      
      document.addEventListener('visibilitychange', this.manejarCambioVisibilidad)
    },

    manejarCambioVisibilidad() {
      if (document.visibilityState === 'hidden') {
        
        if (this.intervaloActualizacion) {
          clearInterval(this.intervaloActualizacion)
          this.intervaloActualizacion = null
        }
      } else {
        
        this.fetchAlertas()
        if (!this.intervaloActualizacion) {
          this.intervaloActualizacion = setInterval(() => {
            this.fetchAlertas()
          }, this.intervaloConfigurado)
        }
      }
    },

    detenerActualizacionAutomatica() {
      if (this.intervaloActualizacion) {
        clearInterval(this.intervaloActualizacion)
        this.intervaloActualizacion = null
      }
      document.removeEventListener('visibilitychange', this.manejarCambioVisibilidad)
    },

    reset() {
      this.alertas = []
      this.noLeidas = 0
      this.cargando = false
      this.error = null
      this.detenerActualizacionAutomatica()
    }
  }
})