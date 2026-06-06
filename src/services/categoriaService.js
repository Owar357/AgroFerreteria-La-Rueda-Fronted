import { api } from './authService'

export const getCategorias   = (page = 1, perPage = 5) => api.get('/categorias', { params: { page, per_page: perPage } })

export const createCategoria = (data)        => api.post('/categorias', data)

export const updateCategoria = (id, data)    => api.put(`/categorias/${id}`, data)
