import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// son las claves ocales
const TOKEN_KEY = 'auth_token'
const USER_KEY  = 'auth_user'
const ROLE_KEY  = 'auth_role'

// ── Aqui axios crea el token automatico
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Helpers internos ──────────────────────────────────────────────────────────

/**
 * qui los roles  venian com ADMIN Y CAJERO // falra el del contado porque los bichos no han eho las intefaces
 * los normalizamos  para que cabien a las minisculas
 */
function normalizeRole(roles) {
  if (!roles || roles.length === 0) return null
  return roles[0].toLowerCase() // 'ADMIN' a 'admin'
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

// ── Redirección según rol ─────────────────────────────────────────────────────
/**
 * Devuelve la ruta inicial según el rol del usuario.
 * - ADMIN    → /admin/usuarios  (acceso total)
 * - CAJERO   → /admin/venta/turno-caja
 * - CONTADOR → /admin/reportes
 */
function getHomeRouteByRole(role) {
  switch (role) {
    case 'admin':    return '/admin/usuarios'
    //case 'cajero':   return '/admin/venta/turno-caja'
    case 'contador': return '/admin/reportes'
    default:         return '/login'
  }
}

// ── API pública del servicio ──────────────────────────────────────────────────
const authService = {

  /**
   * Hace login contra el backend Laravel/JWT.
   * @param {string} identity  - correo o usuario
   * @param {string} password
   * @returns {{ success: boolean, route?: string, message?: string }}
   */
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
      const message =
        error.response?.data?.message || 'Error al conectar con el servidor.'
      return { success: false, message }
    }
  },

  /**
   * Cierra sesión: invalida el token en el backend y limpia localStorage.
   */
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (_) {
      // Si falla el backend igual limpiamos local
    } finally {
      clearSession()
    }
  },

  /**
   * Verifica si hay una sesión activa.
   */
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY)
  },

  /**
   * Devuelve el rol normalizado ('admin' | 'cajero' | 'contador' | null).
   */
  getUserRole() {
    return localStorage.getItem(ROLE_KEY)
  },

  /**
   * Devuelve los datos del usuario guardados en localStorage.
   */
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY))
    } catch {
      return null
    }
  },

  /**
   * Devuelve la ruta home según el rol actual.
   */
  getHomeRoute() {
    return getHomeRouteByRole(this.getUserRole())
  },
}

export default authService