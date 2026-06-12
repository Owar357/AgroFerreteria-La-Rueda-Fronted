import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json' 
  }
})


api.interceptors.request.use(
  (config) => {
    // Leemos el token directamente como lo configuramos en el authService
    const token = localStorage.getItem('token')

    if (token) {
      
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)



export default api