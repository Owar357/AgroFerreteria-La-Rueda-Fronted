import { api } from './authService'

export const getUnidades = (params = {}) => {
  return api.get('/unidades', { params })
}

export const getUnidadesByMagnitud = (magnitud) => {
  return api.get('/unidades', { params: { magnitud } })
}