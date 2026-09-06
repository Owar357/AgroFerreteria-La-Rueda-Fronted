import { api } from './authService'

export const obtenerAlertas = () => api.get('/alertas')

export const toggleLeida = (id) => api.patch(`/alertas/${id}/marcar-leida`)