import { defineStore } from 'pinia'
import { ref } from 'vue'
import { abrirCaja, abrirVenta, cuadrarVenta, cerrarVentaCaja, getEstadoCaja } from '../services/cajaService'

export const useCajaStore = defineStore('caja', () => {

  // ── Estado ─────────────────────────────────────────────────────────────────
  const cajaAbierta  = ref(false)
  const ventaAbierta = ref(false)
  const montoInicial = ref(0)
  const cargando     = ref(false)
  const estadoCargado = ref(false) // true cuando ya se consultó el estado al backend

  // ── Cargar estado real desde el backend ───────────────────────────────────
  // Se llama al montar el POS y la vista de Caja para sincronizar el estado
  const cargarEstadoCaja = async () => {
    try {
      const response = await getEstadoCaja()
      cajaAbierta.value  = response.data.caja_abierta
      ventaAbierta.value = response.data.venta_abierta
      montoInicial.value = response.data.monto_inicial ?? 0
      estadoCargado.value = true
    } catch {
      // Si falla la consulta dejamos el estado en false por seguridad
      cajaAbierta.value   = false
      ventaAbierta.value  = false
      estadoCargado.value = true
    }
  }

  // ── Apertura de caja ──────────────────────────────────────────────────────
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
      const status       = error.response?.status
      const responseData = error.response?.data
      if (status === 401) return { ok: false, status, error: 'Credenciales inválidas.' }
      if (status === 403) return { ok: false, status, error: 'No tiene permisos para abrir la caja.' }
      if (status === 422) return { ok: false, status, error: responseData?.message || 'Ya existe una apertura de caja activa.' }
      return { ok: false, status, error: responseData?.message || 'Error interno del servidor.' }
    } finally {
      cargando.value = false
    }
  }

  // ── Apertura de venta ─────────────────────────────────────────────────────
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
      const status       = error.response?.status
      const responseData = error.response?.data
      if (status === 422) return { ok: false, status, error: responseData?.message || 'Error al aperturar la venta.' }
      return { ok: false, status, error: responseData?.message || 'Error interno del servidor.' }
    } finally {
      cargando.value = false
    }
  }

  // ── Cuadre de venta ───────────────────────────────────────────────────────
  const cuadrarTurnoVenta = async (payload) => {
    cargando.value = true
    try {
      const response = await cuadrarVenta(payload)
      if (response.data.status === 'ok') {
        return { ok: true, data: response.data }
      }
      return { ok: false, error: response.data.message }
    } catch (error) {
      const status       = error.response?.status
      const responseData = error.response?.data
      if (status === 401) return { ok: false, status, error: 'Credenciales inválidas.' }
      if (status === 403) return { ok: false, status, error: 'No tiene permisos.' }
      if (status === 404) return { ok: false, status, error: responseData?.message || 'No tiene una apertura de venta activa.' }
      return { ok: false, status, error: responseData?.message || 'Error interno del servidor.' }
    } finally {
      cargando.value = false
    }
  }

  // ── Cierre de venta y caja ────────────────────────────────────────────────
  const cerrarTurnoVentaCaja = async (payload) => {
    cargando.value = true
    try {
      const response = await cerrarVentaCaja(payload)
      if (response.data.status === 'ok') {
        cajaAbierta.value  = false
        ventaAbierta.value = false
        montoInicial.value = 0
        return { ok: true }
      }
      return { ok: false, error: response.data.message }
    } catch (error) {
      const status       = error.response?.status
      const responseData = error.response?.data
      if (status === 401) return { ok: false, status, error: 'Token inválido o expirado.' }
      if (status === 404) return { ok: false, status, error: responseData?.message || 'No se encontró una apertura activa.' }
      return { ok: false, status, error: responseData?.message || 'Error interno del servidor.' }
    } finally {
      cargando.value = false
    }
  }

  // ── Cierre local (fallback) ───────────────────────────────────────────────
  const cerrarTurno = () => {
    cajaAbierta.value  = false
    ventaAbierta.value = false
    montoInicial.value = 0
  }

  return {
    cajaAbierta, ventaAbierta, montoInicial, cargando, estadoCargado,
    cargarEstadoCaja,
    abrirTurnoCaja, abrirTurnoVenta,
    cuadrarTurnoVenta, cerrarTurnoVentaCaja,
    cerrarTurno
  }
})