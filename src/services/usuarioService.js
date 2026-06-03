<<<<<<< HEAD
//mportamos la intancia de axio que ya tiene el token configurado
import { api } from './authService'

//aquio btenemos todos los usuarios
export const getUsuarios = (page = 1, perPage =  5) => api.get('/usuarios', { params: {page, per_page: perPage} })

//esto es para cera un nuevo usuario
export const createUsuario = (data) => api.post('/usuarios', data)

//para actualizar a un usuario
export const updateUsuario = (id, data) => api.put('/usuarios/${id}', data)
=======
import { api } from './authService'

export const getUsuarios    = (page = 1, perPage = 5) => api.get('/usuarios', { params: { page, per_page: perPage } })

export const createUsuario  = (data) => api.post('/usuarios', data)

export const updateUsuario  = (id, data) => api.put(`/usuarios/${id}`, data)
>>>>>>> rama_prueba
