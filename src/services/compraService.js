import { api } from './authService'

export const buscarProductoCompra = (q) => {
  return api.get('productos/buscar-producto/compra', { params: { q } })
}

export const registrarCompra = (data) => api.post('/compras', data)

export const compras = (params) => api.get('/compras', { params })
export const anularCompra = (id) => api.patch(`/compras/${id}/anular`)

export const VerDetallesCompra = (id) => {
  return api.get(`/compras/${id}`)
}
