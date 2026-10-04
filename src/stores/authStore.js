import { defineStore } from 'pinia'
import api from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
  }),


  persist: true,

  getters: {
    isAuthenticated: (state) => !!state.token,

    isAdmin: (state) => {
      return state.user?.roles?.some((role) => role.name === 'ADMINISTRADOR')
    },
    isCajero: (state) => {
      return state.user?.roles?.some((role) => role.name === 'CAJERO')
    },
    isContador: (state) => {
      return state.user?.roles?.some((role) => role.name === 'CONTADOR')
    },
  },

  actions: {
    async login(credentials) {
      try {
        const { data } = await api.post('/auth/login', credentials)

        this.token = data.access_token
        this.user = data.user

    
        if (this.isAdmin || this.isContador || this.isCajero) {
          router.push('/admin/dashboard')
        } else {
          router.push('/')
        }

        return { ok: true, data }
      } catch (error) {
        console.error('Error en login:', error)
        const status = error.response?.status
        const msg = error.response?.data?.message || 'Credenciales inválidas o error de conexión'
        return { ok: false, status, error: msg }
      }
    },

    async register(payload) {
      try {
        const { data } = await api.post('/auth/register', payload)
        this.token = data.access_token
        this.user = data.user
        router.push('/')
        return { ok: true, data }
      } catch (error) {
        console.error('Error al registrarse:', error)
        const status = error.response?.status
        const msg = error.response?.data?.message || 'No se pudo completar el registro'
        return { ok: false, status, error: msg }
      }
    },

    async logout() {
      try {
        if (this.token) {
          await api.post('/auth/logout')
        }
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      } finally {
        this.$reset()
        router.push('/login')
      }
    },
  },
})