import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { abrirCaja, abrirVenta, cuadrarVenta, cerrarVentaCaja, getEstadoCaja } from '../services/cajaService'

// Solo se usa hasta que llega el valor real desde el backend (/caja/estado)
const FONDO_FIJO_DEFECTO = '75.00'

const mensajeDeError = (error, porDefecto) => {
  if (!error.response) return 'No se pudo conectar con el servidor.'
  const data = error.response.data
  const primerError = data?.errors ? Object.values(data.errors).flat()[0] : null
  return primerError || data?.message || porDefecto
}

// Forma única de error para todas las acciones: { ok: false, status, error, data }
const resultadoError = (error, porDefecto = 'Error interno del servidor.') => ({
  ok: false,
  status: error.response?.status,
  error: mensajeDeError(error, porDefecto),
  data: error.response?.data ?? null,
})

export const useCajaStore = defineStore('caja', () => {
  const cajaAbierta = ref(false)
  const ventaAbierta = ref(false) // true = el turno abierto es MÍO
  const montoInicial = ref(0)
  const fondoFijo = ref(FONDO_FIJO_DEFECTO)
  const turnoActivo = ref(null) // { id, cajero_id, cajero_nombre, es_mio, fecha_hora_apertura } | null
  const cargando = ref(false)
  const estadoCargado = ref(false)
  const errorEstado = ref(false)
  const necesitaActualizarResumen = ref(false)

  // Hay un turno abierto, pero es de otro cajero
  const turnoDeOtroCajero = computed(() => !!turnoActivo.value && !turnoActivo.value.es_mio)

  // Puede registrar ventas y movimientos
  const puedeOperar = computed(() => cajaAbierta.value && ventaAbierta.value)

  const marcarActualizacionPendiente = () => {
    necesitaActualizarResumen.value = true
  }

  const cargarEstadoCaja = async () => {
    try {
      const { data } = await getEstadoCaja()
      cajaAbierta.value = !!data.caja_abierta
      ventaAbierta.value = !!data.venta_abierta
      montoInicial.value = data.monto_inicial ?? 0
      fondoFijo.value = data.fondo_fijo ?? FONDO_FIJO_DEFECTO
      turnoActivo.value = data.turno_activo ?? null
      errorEstado.value = false
      return { ok: true, data }
    } catch (error) {
      errorEstado.value = true
      return resultadoError(error, 'No se pudo obtener el estado de la caja.')
    } finally {
      estadoCargado.value = true
    }
  }

  // payload: { email, password } del administrador
  const abrirTurnoCaja = async (payload) => {
    cargando.value = true
    try {
      const { data } = await abrirCaja(payload)
      if (data.status === 'ok') {
        cajaAbierta.value = true
        await cargarEstadoCaja()
        return { ok: true, data }
      }
      return { ok: false, error: data.message }
    } catch (error) {
      return resultadoError(error)
    } finally {
      cargando.value = false
    }
  }

  const abrirTurnoVenta = async (conteo) => {
    cargando.value = true

    const payload =
      conteo !== null && typeof conteo === 'object'
        ? {
            denominaciones: conteo.denominaciones,
            justificacion_apertura: conteo.justificacion || undefined,
          }
        : { monto_inicial: conteo }

    try {
      const { data } = await abrirVenta(payload)
      if (data.status === 'ok') {
        ventaAbierta.value = true
        montoInicial.value = data.monto_inicial ?? montoInicial.value
        await cargarEstadoCaja()
        return { ok: true, data }
      }
      return { ok: false, error: data.message }
    } catch (error) {
      const resultado = resultadoError(error, 'Error al aperturar la venta.')

      if (resultado.data?.requiere_justificacion) {
        return {
          ...resultado,
          requiereJustificacion: true,
          fondoFijo: resultado.data.fondo_fijo,
          montoContado: resultado.data.monto_contado,
          tipo: resultado.data.tipo,
        }
      }

      return resultado
    } finally {
      cargando.value = false
    }
  }

  // payload: { email, password, denominaciones }
  const cuadrarTurnoVenta = async (payload) => {
    cargando.value = true
    try {
      const { data } = await cuadrarVenta(payload)
      if (data.status === 'ok') {
        return { ok: true, data }
      }
      return { ok: false, error: data.message }
    } catch (error) {
      return resultadoError(error, 'No se pudo realizar el cuadre.')
    } finally {
      cargando.value = false
    }
  }

  // payload: { token_autorizacion, justificacion? }
  const cerrarTurnoVentaCaja = async (payload) => {
    cargando.value = true
    try {
      const { data } = await cerrarVentaCaja(payload)
      if (data.status === 'ok') {
        cerrarTurno()
        await cargarEstadoCaja()
        return { ok: true, data }
      }
      return { ok: false, error: data.message }
    } catch (error) {
      return resultadoError(error, 'No se pudo cerrar la caja.')
    } finally {
      cargando.value = false
    }
  }

  const cerrarTurno = () => {
    cajaAbierta.value = false
    ventaAbierta.value = false
    montoInicial.value = 0
    turnoActivo.value = null
  }

  return {
    cajaAbierta,
    ventaAbierta,
    montoInicial,
    fondoFijo,
    turnoActivo,
    cargando,
    estadoCargado,
    errorEstado,
    necesitaActualizarResumen,
    turnoDeOtroCajero,
    puedeOperar,
    marcarActualizacionPendiente,
    cargarEstadoCaja,
    abrirTurnoCaja,
    abrirTurnoVenta,
    cuadrarTurnoVenta,
    cerrarTurnoVentaCaja,
    cerrarTurno,
  }
})