import { api } from './authService'

export const getProveedores   = (page = 1, perPage = 7) => api.get('/proveedores', { params: { page, per_page: perPage } })
export const createProveedor  = (data)        => api.post('/proveedores', data)
export const updateProveedor  = (id, data)    => api.put(`/proveedores/${id}`, data)
export const deleteProveedor  = (id)          => api.delete(`/proveedores/${id}`)