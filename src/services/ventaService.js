import { api } from './authService'

export const buscarProductos = (q) => {
  return api.get('/productos/buscar-venta', { params: { q } })
}

export const buscarClientePorDocumento = (documento) => {
  return api.get('clientes/buscar', { params: { numero_documento: documento } })
}

export const crearCliente = (data) => {
  return api.post('/clientes', data)
}

export const registerVenta = (data) => {
  return api.post('/ventas', data)
}

export const getVentas = (params = {}) => {
  return api.get('/ventas', { params })
}

export const getDetallesVenta = (id) => {
  return api.get(`/ventas/${id}`)
}

// PENDIENTE: la anulación de ventas se implementará después de cerrar el módulo de caja.
export const anularVenta = (id) => {
  return api.patch(`/ventas/${id}/anular`)
}

// El ticket exige token (auth:api), por eso NO se puede abrir con window.open(url):
// se pide por axios como blob y se abre desde un object URL.
export const imprimirTicketPDF = (ventaId) => {
  return api.get(`/reportes/ticket/${ventaId}`, { responseType: 'blob' })
}