import { api } from './authService'

export const getMovimientos = (params) => api.get('/caja/movimientoExterno', { params })

export const createMovimiento = (data) => api.post('/caja/movimientoExterno', data)




//para anulra un movimiento, se piden las credencial es del admin por medio del modal
export const anularMovimiento = (id, data) => api.patch(`/caja/movimientos/${id}/anular`, data)

export { getResumenTurno } from './cajaService'