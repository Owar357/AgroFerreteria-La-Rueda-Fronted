import  api  from './axios'

export const getProveedores = (page = 1, perPage = 7, search = '', estado = 'TODOS') => {
  return api.get('/proveedores', { 
    params: { 
      page, 
      per_page: perPage,
      search: search || undefined,
      estado: estado !== 'TODOS' ? estado : undefined
    } 
  })
}

export const createProveedor = (data) => api.post(`/proveedores`, data)
export const updateProveedor = (id, data) => api.put(`/proveedores/${id}`, data)
export const desactivarProveedor = (id) => api.patch(`/proveedores/${id}/desactivar`)
export const activarProveedor = (id) => api.patch(`/proveedores/${id}/activar`)
export const proveedores = () => api.get('/proveedor/proveedores')