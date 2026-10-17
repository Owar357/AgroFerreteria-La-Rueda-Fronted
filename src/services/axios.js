import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})


// Interceptor de Petición: Busca el token en localStorage y lo inyecta automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)


// Interceptor de Respuesta: Detecta cierres de sesión forzados o tokens inválidos
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const mensaje = (error.response?.data?.message || '').toLowerCase()
    const esPeticionLogin = error.config?.url?.includes('/auth/login')

    const esTokenInvalido =
      status === 401 ||
      mensaje.includes('token expirado') ||
      mensaje.includes('token inválido') ||
      mensaje.includes('no autenticado')

    // Si el token falló y no estamos intentando loguearnos, limpiamos y redirigimos
    if (esTokenInvalido && !esPeticionLogin) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_role')
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api