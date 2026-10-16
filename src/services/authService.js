import api from '../services/axios' 
// Claves locales (se mantienen intactas para preservar tu localStorage)
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'
const ROLE_KEY = 'auth_role'

function normalizeRole(roles) {
  if (!roles || roles.length === 0) return null
  return roles[0]
}

function saveSession(token, user, role) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(ROLE_KEY, role)
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(ROLE_KEY)
}

function getHomeRouteByRole(role) {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard'
    case 'CONTADOR':
      return '/admin/reportes'
    case 'CAJERO':
      return '/admin/venta/venta'
    default:
      return '/login'
  }
}

// El objeto authService y sus métodos (login, logout, isAuthenticated, etc.) 
// permanecen exactamente igual, consumiendo el objeto "api" importado.
const authService = {
  async login(identity, password) {
    try {
      const { data } = await api.post('/auth/login', {
        email: identity,
        password,
      })

      const role = normalizeRole(data.roles)
      if (!role) {
        return { success: false, message: 'El usuario no tiene un rol asignado.' }
      }

      saveSession(data.access_token, data.user, role)

      return {
        success: true,
        route: getHomeRouteByRole(role),
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al conectar con el servidor.'
      return { success: false, message }
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (_) {
    } finally {
      clearSession()
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY)
  },

  getUserRole() {
    return localStorage.getItem(ROLE_KEY)
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY))
    } catch {
      return null
    }
  },

  getHomeRoute() {
    return getHomeRouteByRole(this.getUserRole())
  },
}

export default authService
