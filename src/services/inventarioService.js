import api from './axios'

export const registrarAjusteInventario = (data) => {
  return api.post('/ajuste-inventario', data)
}
