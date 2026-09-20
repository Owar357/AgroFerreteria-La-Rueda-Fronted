import { api } from './authService'

export const getKardexByProducto = (productoId, page = 1, perPage = 10, filtros = {}) => {
  const params = {
    page,
    per_page: perPage,
    fecha_inicio: filtros.fecha_inicio || null,
    fecha_fin: filtros.fecha_fin || null,
    tipo_movimiento: filtros.tipo_movimiento || null,
    modo_costeo: filtros.modo_costeo || 'PEPS'
  }

  return api.get(`/kardex/${productoId}`, { params })
}