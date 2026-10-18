import  api  from './axios'

export const getUsuarios = (page = 1, perPage = 5, filtros = {}) => {
  return api.get('/usuarios', { 
    params: { 
      page, 
      per_page: perPage,
      search: filtros.search || null,
      estado: filtros.estado !== 'TODOS' ? filtros.estado : null
    } 
  })
}

export const createUsuario  = (data) => api.post('/usuarios', data)

export const updateUsuario  = (id, data) => api.put(`/usuarios/${id}`, data)

export const desactivarUsuario = (id) => api.patch(`/usuarios/${id}/desactivar`)