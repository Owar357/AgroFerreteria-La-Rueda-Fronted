import api from './axios'

export const getClientes = (page = 1, porPagina = 10, search = '', tipo_persona = 'TODOS') => {
  return api.get('/clientes', {
    params: {
      page,
      per_page: porPagina,
      search: search || undefined,
      tipo_persona: tipo_persona !== 'TODOS' ? tipo_persona : undefined,
    },
  })
}

export const createCliente = (data) => api.post('/clientes', data)
