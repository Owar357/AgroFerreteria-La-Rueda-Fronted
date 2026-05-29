import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Claves locales
const TOKEN_KEY = 'auth_token'
const USER_KEY  = 'auth_user'
const ROLE_KEY  = 'auth_role'

// ── Instancia personalizada de Axios (Exportada para los demás servicios) ────
export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor de petición: Adjunta el token en tiempo real en cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de respuesta: Captura de forma global sesiones expiradas (401)
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(ROLE_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Helpers internos ──────────────────────────────────────────────────────────
function normalizeRole(roles) {
  if (!roles || roles.length === 0) return null
  return roles[0].toLowerCase()
}

function saveSession(token, user, role) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY,  JSON.stringify(user))
  localStorage.setItem(ROLE_KEY,  role)
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(ROLE_KEY)
}

function getHomeRouteByRole(role) {
  switch (role) {
    case 'admin':    return '/admin/usuarios'
    case 'contador': return '/admin/reportes'
    default:         return '/login'
  }
}

// ── API pública del servicio ──────────────────────────────────────────────────
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