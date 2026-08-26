import { api } from './authService'

export const getMovimientos = (params) => api.get('/caja/movimientoExterno', { params })

export const createMovimiento = (data) => api.post('/caja/movimientoExterno', data)

export const anularMovimiento = (id, data) => api.patch(`/caja/movimientos/${id}/anular`, data)