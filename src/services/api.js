import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // <- Corregido a 'baseURL' con U mayúscula
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json' // <- Corregido typo 'aplication'
  }
})


api.interceptors.request.use(
  (config) => {
    // Leemos el token directamente como lo configuramos en el authService
    const token = localStorage.getItem('token')

    if (token) {
      // CORREGIDO: Usamos comillas invertidas (backticks) para que inyecte la variable real
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api