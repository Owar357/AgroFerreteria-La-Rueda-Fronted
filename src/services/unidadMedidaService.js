import  api  from './axios'

export const getUnidades = (params = {}) => {
  return api.get('/unidades', { params })
}

export const getUnidadesByMagnitud = (magnitud) => {
  return api.get('/unidades', { params: { magnitud } })
}