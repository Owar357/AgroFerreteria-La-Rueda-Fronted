import { defineStore } from 'pinia'
import { ref } from 'vue'
import { abrirCaja, abrirVenta, cuadrarVenta, cerrarVentaCaja } from '../services/cajaService'

export const useCajaStore = defineStore('caja', () => {
  const cajaAbierta = ref(false)
  const ventaAbierta = ref(false)
  const montoInicial = ref(0)
  const cargando = ref(false)

  const abrirTurnoCaja = async (payload) => {
    cargando.value = true
    try {
      const response = await abrirCaja(payload)
      if (response.data.status === 'ok') {
        cajaAbierta.value = true
        return { ok: true }
      }
      return { ok: false, error: response.data.message }
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data
      if (status === 401) return { ok: false, status, error: 'Credenciales inválidas.' }
      if (status === 403)
        return { ok: false, status, error: 'No tiene permisos para abrir la caja.' }
      if (status === 422)
        return {
          ok: false,
          status,
          error: responseData?.message || 'Ya existe una apertura de caja activa.',
        }
      return { ok: false, status, error: responseData?.message || 'Error interno del servidor.' }
    } finally {
      cargando.value = false
    }
  }

  const abrirTurnoVenta = async (montoInicialValue) => {
    cargando.value = true
    try {
      const response = await abrirVenta({ monto_inicial: montoInicialValue })
      if (response.data.status === 'ok') {
        ventaAbierta.value = true
        montoInicial.value = montoInicialValue
        return { ok: true }
      }
      return { ok: false, error: response.data.message }
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data
      if (status === 422)
        return { ok: false, status, error: responseData?.message || 'Error al aperturar la venta.' }
      return { ok: false, status, error: responseData?.message || 'Error interno del servidor.' }
    } finally {
      cargando.value = false
    }
  }

  const cuadrarTurnoVenta = async (payload) => {
    cargando.value = true
    try {
      const response = await cuadrarVenta(payload)
      if (response.data.status === 'ok') {
        return { ok: true, data: response.data }
      }
      return { ok: false, error: response.data.message }
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data
      if (status === 401) return { ok: false, status, error: 'Credenciales inválidas.' }
      if (status === 403) return { ok: false, status, error: 'No tiene permisos.' }
      if (status === 404)
        return {
          ok: false,
          status,
          error: responseData?.message || 'No tiene una apertura de venta activa.',
        }
      return { ok: false, status, error: responseData?.message || 'Error interno del servidor.' }
    } finally {
      cargando.value = false
    }
  }

  const cerrarTurnoVentaCaja = async (payload) => {
    cargando.value = true
    try {
      const response = await cerrarVentaCaja(payload)
      if (response.data.status === 'ok') {
        cajaAbierta.value = false
        ventaAbierta.value = false
        montoInicial.value = 0
        return { ok: true }
      }
      return { ok: false, error: response.data.message }
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data
      if (status === 401) return { ok: false, status, error: 'Token inválido o expirado.' }
      if (status === 404)
        return {
          ok: false,
          status,
          error: responseData?.message || 'No se encontró una apertura activa.',
        }
      return { ok: false, status, error: responseData?.message || 'Error interno del servidor.' }
    } finally {
      cargando.value = false
    }
  }

  const cerrarTurno = () => {
    cajaAbierta.value = false
    ventaAbierta.value = false
    montoInicial.value = 0
  }

  return {
    cajaAbierta,
    ventaAbierta,
    montoInicial,
    cargando,
    abrirTurnoCaja,
    abrirTurnoVenta,
    cerrarTurno,
    cuadrarTurnoVenta,
    cerrarTurnoVentaCaja,
  }
})
