import { api } from './authService'

export const getClientes   = (page = 1, porPagina = 10) =>
  api.get('/clientes', { params: { page, per_page: porPagina } })

export const createCliente = (data) => api.post('/clientes', data)

