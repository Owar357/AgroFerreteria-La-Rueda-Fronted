import { api } from './authService'

export const getUsuarios    = (page = 1, perPage = 5) => api.get('/usuarios', { params: { page, per_page: perPage } })

export const createUsuario  = (data) => api.post('/usuarios', data)

export const updateUsuario  = (id, data) => api.put(`/usuarios/${id}`, data)
