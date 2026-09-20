import { api } from './authService'

export const registrarAjusteInventario = (data) => {
  return api.post('/ajuste-inventario', data)
}