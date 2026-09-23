import { api } from './authService'

export const abrirCaja = (data) => api.post('/caja/apertura', data)

//aqui obtengoel esado actualde la caja, caja_abierya ya cajaabierta 
//el cual es le turno del cajero copn el fondo fijo
export const getEstadoCaja = () => api.get('/caja/estado')

//para la apertura de la venta, ingreando el dinero
//por medio del mdoal de las denomianciones
export const abrirVenta = (data) => api.post('/caja/venta/apertura', data)

export const cuadrarVenta    = (data) => api.post('/caja/venta/cuadre', data)


//aqui en el cierre exige el token de autorizacion del ADMIN
//y la justificacion
export const cerrarVentaCaja = (data) => api.patch('/caja/venta/cierre', data)

//este lo agrege porque el admin ve el resumen del turno del cajero, por medio del modal
export const getResumenTurno = () => api.get('/caja/resumen-turno')
