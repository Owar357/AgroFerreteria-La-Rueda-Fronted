import { api } from './authService'

export const abrirCaja = (data) => api.post('/caja/apertura', data)

//aqui obtengoel esado actualde la caja
export const getEstadoCaja = () => api.get('/caja/estado')

//para la apertura de la venta
export const abrirVenta = (data) => api.post('/caja/venta/apertura', data)

export const cuadrarVenta    = (data) => api.post('/caja/venta/cuadre', data)

export const cerrarVentaCaja = (data) => api.patch('/caja/venta/cierre', data)
