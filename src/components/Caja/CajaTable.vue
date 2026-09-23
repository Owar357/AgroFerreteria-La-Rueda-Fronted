<template>
  <div
    class="p-6"
    style="font-family: 'Inter', sans-serif; background-color: #eef2e9; min-height: 100vh"
  >
    <!-- ENCABEZADO -->
    <div class="flex justify-between items-center mb-8 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-[#1a2e1f]">Turno de caja</h1>
        <p class="text-sm text-[#6d8f60] mt-1">Control y gestión del turno actual</p>
      </div>
      <div class="flex items-center gap-4 flex-wrap">
        <div
          class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#e8efe1]"
        >
          <i class="pi pi-calendar text-[#6d8f60] text-sm"></i>
          <span class="text-sm text-[#1a2e1f]">{{ currentDate }}</span>
        </div>
        <div
          class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#e8efe1]"
        >
          <span class="text-sm text-[#6d8f60]">Estado:</span>
          <span
            :class="[
              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold',
              turnoAbierto ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
            ]"
          >
            <i
              class="pi pi-circle-fill text-[8px]"
              :class="turnoAbierto ? 'text-green-600' : 'text-red-500'"
            ></i>
            {{ turnoAbierto ? 'TURNO ABIERTO' : 'TURNO CERRADO' }}
          </span>
          <span v-if="turnoAbierto" class="text-xs text-[#6d8f60]">
            · {{ cajaStore.turnoActivo.cajero_nombre }}
          </span>
        </div>
      </div>
    </div>

    <!-- ADMINISTRADOR: 4 tarjetas -->
    <div v-if="esAdministrador" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
      <div
        class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200"
      >
        <p class="text-sm font-medium text-[#6d8f60] mb-3">
          <i class="pi pi-wallet mr-2"></i> Monto Inicial
        </p>
        <p class="text-3xl font-bold text-[#1a2e1f]">${{ formatNumber(cajaStore.montoInicial) }}</p>
        <p class="text-xs text-[#819b74] mt-2">Efectivo al abrir el turno</p>
      </div>

      <div
        class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200"
      >
        <p class="text-sm font-medium text-[#6d8f60] mb-3">
          <i class="pi pi-chart-line mr-2"></i> Monto Esperado
        </p>
        <p class="text-3xl font-bold text-[#1a2e1f]">${{ formatNumber(montoEsperado) }}</p>
        <p class="text-xs text-[#819b74] mt-2">Cuánto se estima que debe haber en caja</p>
      </div>

      <div
        class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200"
      >
        <p class="text-sm font-medium text-[#6d8f60] mb-3">
          <i class="pi pi-money-bill mr-2"></i> Efectivo en Gaveta
        </p>
        <p class="text-3xl font-bold text-[#2b5e3b]">${{ formatNumber(montoEnCaja) }}</p>
        <p class="text-xs text-green-600 mt-2">Fondo + ventas en efectivo + entradas - salidas</p>
      </div>

      <div
        class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200"
      >
        <p class="text-sm font-medium text-[#6d8f60] mb-3">
          <i class="pi pi-lock mr-2"></i> Fondo Fijo
        </p>
        <p class="text-3xl font-bold text-[#1a2e1f]">${{ formatNumber(cajaStore.fondoFijo) }}</p>
        <p class="text-xs text-[#819b74] mt-2">Base obligatoria para cada turno</p>
      </div>
    </div>

    <!-- ADMINISTRADOR: resumen -->
    <div v-if="esAdministrador" class="mb-8">
      <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm">
        <div class="bg-[#fafdf7] px-6 py-4 border-b border-[#e8efe1]">
          <h2 class="font-semibold text-[#1a2e1f] text-lg">
            <i class="pi pi-chart-pie mr-2 text-[#e0b354]"></i> Resumen de movimientos
          </h2>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div
              class="flex justify-between items-center p-4 bg-[#f9fbf7] rounded-xl border border-[#dee6d6]"
            >
              <span class="text-sm text-[#5f7b58]">
                <i class="pi pi-dollar mr-2"></i> Ventas al contado:
              </span>
              <span class="ml-2 font-semibold text-[#1a2e1f] text-lg">
                ${{ formatNumber(ventasContado) }}
              </span>
            </div>

            <div
              class="flex justify-between items-center p-4 bg-[#f9fbf7] rounded-xl border border-[#dee6d6]"
            >
              <span class="text-sm text-[#5f7b58]">
                <i class="pi pi-credit-card mr-2"></i> Ventas por tarjeta:
              </span>
              <span class="ml-2 font-semibold text-[#1a2e1f] text-lg">
                ${{ formatNumber(ventasTarjeta) }}
              </span>
            </div>

            <div
              class="flex justify-between items-center p-4 bg-[#f9fbf7] rounded-xl border border-[#dee6d6]"
            >
              <span class="text-sm text-[#5f7b58]">
                <i class="pi pi-mobile mr-2"></i> Transferencia bancaria:
              </span>
              <span class="ml-2 font-semibold text-[#1a2e1f] text-lg">
                ${{ formatNumber(ventasTransferencia) }}
              </span>
            </div>

            <div
              class="flex justify-between items-center p-4 bg-[#fefcf5] rounded-xl border border-[#dee6d6]"
            >
              <span class="text-sm text-[#5f7b58]">
                <i class="pi pi-plus mr-2"></i> Otras entradas
              </span>
              <span class="ml-2 font-semibold text-green-600 text-lg">
                +${{ formatNumber(entradas) }}
              </span>
            </div>

            <div
              class="flex justify-between items-center p-4 bg-[#fefcf5] rounded-xl border border-[#dee6d6] md:col-span-2"
            >
              <span class="text-sm text-[#5f7b58]">
                <i class="pi pi-arrow-down mr-2"></i> Retiros / Gastos:
              </span>
              <span class="ml-2 font-semibold text-red-600 text-lg">
                -${{ formatNumber(retiros) }}
              </span>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t-2 border-[#e8efe1] flex justify-between items-center">
            <span class="text-base font-semibold text-[#1a2e1f]">
              <i class="pi pi-chart-line mr-2 text-[#e0b354]"></i> Total vendido y movimientos del turno
            </span>
            <span class="text-3xl font-bold text-[#2b5e3b]">${{ formatNumber(totalEnCaja) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- CAJERO: acciones + movimientos | ADMIN: solo movimientos -->
    <div :class="esCajero ? 'grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8' : 'mb-8'">
      <!-- Columna izquierda (solo cajero) -->
      <div v-if="esCajero" class="xl:col-span-1 flex flex-col gap-6">
        <div
          class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200"
        >
          <p class="text-sm font-medium text-[#6d8f60] mb-3">
            <i class="pi pi-wallet mr-2"></i> Monto Inicial
          </p>
          <p class="text-3xl font-bold text-[#1a2e1f]">${{ formatNumber(cajaStore.montoInicial) }}</p>
          <p class="text-xs text-[#819b74] mt-2">Efectivo al abrir el turno</p>
        </div>

        <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm">
          <div class="bg-[#fafdf7] px-6 py-4 border-b border-[#e8efe1]">
            <h2 class="font-semibold text-[#1a2e1f] text-lg">
              <i class="pi pi-cog mr-2 text-[#e0b354]"></i> Acciones
            </h2>
            <p class="text-xs text-[#6d8f60] mt-1">Operaciones del turno</p>
          </div>

          <div class="p-5 space-y-3">
            <button
              v-if="!cajaStore.cajaAbierta"
              @click="abrirCaja"
              class="w-full py-3 rounded-xl font-semibold text-white bg-[#2b5e3b] hover:bg-[#1f482d] transition-all flex items-center justify-center gap-2"
            >
              <i class="pi pi-unlock"></i> Apertura de caja
            </button>

            <!-- Otro cajero tiene el turno abierto -->
            <div
              v-else-if="cajaStore.turnoDeOtroCajero"
              class="w-full py-3 px-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm flex items-start gap-2"
            >
              <i class="pi pi-user mt-0.5"></i>
              <span>
                El turno está abierto por
                <strong>{{ cajaStore.turnoActivo.cajero_nombre }}</strong>. Solo ese cajero puede
                operar y cerrarlo.
              </span>
            </div>

            <button
              v-else-if="!cajaStore.ventaAbierta"
              @click="abrirVenta"
              class="w-full py-3 rounded-xl font-semibold text-white bg-[#2b5e3b] hover:bg-[#1f482d] transition-all flex items-center justify-center gap-2"
            >
              <i class="pi pi-shopping-cart"></i> Aperturar venta
            </button>

            <button
              v-else
              @click="cerrarCaja"
              class="w-full py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
            >
              <i class="pi pi-lock"></i> Cerrar caja
            </button>
          </div>
        </div>
      </div>

      <!-- Movimientos del turno (ambos roles) -->
      <div :class="esCajero ? 'xl:col-span-2' : ''">
        <div class="bg-white rounded-2xl shadow-sm border border-[#e8efe1] overflow-hidden">
          <div class="bg-[#fafdf7] px-6 py-4 border-b border-[#e8efe1]">
            <h3 class="font-semibold text-[#1a2e1f]">
              <i class="pi pi-history mr-2 text-[#e0b354]"></i> Movimientos del turno
            </h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-[#e8f0e2]">
              <thead class="bg-[#fafdf7] text-[#3c674b] text-xs font-semibold">
                <tr>
                  <th class="px-6 py-4 text-left">Hora</th>
                  <th class="px-6 py-4 text-left">Concepto</th>
                  <th class="px-6 py-4 text-left">Monto</th>
                  <th class="px-6 py-4 text-left">Tipo</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-[#f0f5ea] text-sm">
                <tr
                  v-for="mov in movimientosRecientes"
                  :key="mov.id"
                  class="hover:bg-[#fefcf5] transition-colors"
                  :class="{ 'opacity-60': mov.esAnulado }"
                >
                  <td class="px-6 py-3.5 font-medium text-[#1a2e1f]">
                    {{ mov.hora }}
                  </td>
                  <td class="px-6 py-3.5 text-gray-600" :class="{ 'line-through': mov.esAnulado }">
                    {{ mov.concepto }}
                  </td>
                  <td
                    class="px-6 py-3.5"
                    :class="[
                      mov.tipo === 'Ingreso'
                        ? 'text-green-700 font-semibold'
                        : 'text-red-600 font-semibold',
                      { 'line-through': mov.esAnulado },
                    ]"
                  >
                    {{ mov.monto }}
                  </td>
                  <td class="px-6 py-3.5">
                    <div class="flex items-center gap-2">
                      <span
                        :class="[
                          'text-xs px-2.5 py-1 rounded-full font-medium',
                          mov.tipo === 'Ingreso'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800',
                        ]"
                      >
                        {{ mov.tipo }}
                      </span>
                      <span
                        v-if="mov.esAnulado"
                        class="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-200 text-gray-700"
                      >
                        Anulado
                      </span>
                    </div>
                  </td>
                </tr>

                <tr v-if="movimientosRecientes.length === 0">
                  <td colspan="4" class="text-center py-10 text-gray-400">
                    {{ turnoAbierto ? 'No hay movimientos en este turno' : 'No hay un turno abierto' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Credenciales de admin: apertura de caja -->
    <AdminAuthDialog
      ref="adminAuthRef"
      v-model:visible="adminAuthVisible"
      @credenciales-confirmadas="onCredencialesConfirmadas"
    />

    <!-- Denominaciones: apertura de venta -->
    <OpenCashierDialog
      ref="openCashierRef"
      v-model:visible="aperturaVentaVisible"
      :isShiftOpen="cajaStore.ventaAbierta"
      :fondoFijo="cajaStore.fondoFijo"
      :loading="cajaStore.cargando"
      @open-cash-register="onAbrirVenta"
    />

    <!-- Denominaciones: conteo de cierre -->
    <CloseCashierDialog
      ref="closeCashierRef"
      v-model:visible="conteoVisible"
      @cuadrar="onConteoListo"
    />

    <!-- Credenciales de admin: cuadre -->
    <AdminAuthDialog
      ref="adminAuthCierreRef"
      v-model:visible="adminAuthCierreVisible"
      label-boton="Abrir Cuadre"
      descripcion="Para realizar el cuadre de caja, ingrese las credenciales del administrador."
      @credenciales-confirmadas="onCredencialesCierre"
    />

    <!-- Resumen del cuadre y cierre -->
    <CierreCajaDialog
      v-model:visible="cierreVisible"
      :datos="datosCierre"
      @cierre-exitoso="onCierreExitoso"
      @cancelar="onCancelarCierre"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { useCajaStore } from '@/stores/cajaStore'
import { usePosStore } from '@/stores/posStore'
import authService from '@/services/authService'
import { getMovimientos } from '@/services/movimientoCajaService'
import { getResumenTurno } from '@/services/cajaService'

import AdminAuthDialog from '@/components/Caja/AdminAuthDialog.vue'
import OpenCashierDialog from '@/components/Caja/OpenCashierDialog.vue'
import CloseCashierDialog from '@/components/Caja/CloseCashierDialog.vue'
import CierreCajaDialog from '@/components/Caja/CierreCajaDialog.vue'

const cajaStore = useCajaStore()
const posStore = usePosStore()

// --- Rol ---
const rolUsuario = ref((authService.getUserRole() || '').replace(/[^a-zA-Z]/g, '').toLowerCase())

const esAdministrador = computed(
  () => rolUsuario.value === 'admin' || rolUsuario.value === 'administrador',
)
const esCajero = computed(() => rolUsuario.value === 'cajero')

// Hay un turno abierto (de cualquier cajero): es lo que ve el administrador
const turnoAbierto = computed(() => !!cajaStore.turnoActivo)

const currentDate = ref(
  new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
)

// --- Visibilidad de modales y refs ---
const adminAuthVisible = ref(false)
const aperturaVentaVisible = ref(false)
const conteoVisible = ref(false)
const adminAuthCierreVisible = ref(false)
const cierreVisible = ref(false)

const adminAuthRef = ref(null)
const adminAuthCierreRef = ref(null)
const openCashierRef = ref(null)
const closeCashierRef = ref(null)

// --- Datos del cierre ---
const datosCierre = ref({})
const denominacionesGuardadas = ref([]) 
const conteoGuardado = ref({}) 


const ventasContado = ref(0)
const ventasTarjeta = ref(0)
const ventasTransferencia = ref(0)
const entradas = ref(0)
const retiros = ref(0)
const montoEnCajaReal = ref(0)
const montoEsperadoReal = ref(0)
const totalEnCajaReal = ref(0)

const montoEsperado = computed(() => montoEsperadoReal.value)
const montoEnCaja = computed(() => montoEnCajaReal.value)
const totalEnCaja = computed(() => totalEnCajaReal.value)

const formatNumber = (value) => parseFloat(value || 0).toFixed(2)

// --- Movimientos del turno (tabla) ---
const movimientosRecientes = ref([])

const formatearHora = (fechaISO) =>
  new Date(fechaISO).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

const mapearMovimiento = (mov) => ({
  id: mov.id,
  hora: formatearHora(mov.created_at),
  concepto: mov.motivo,
  monto: `${mov.tipo_movimiento === 'ENTRADA' ? '+' : '-'}$${formatNumber(mov.monto)}`,
  tipo: mov.tipo_movimiento === 'ENTRADA' ? 'Ingreso' : 'Egreso',
  esAnulado: !!mov.es_anulado,
})

const cargarMovimientosRecientes = async () => {
  try {
    // turno_actual=1: solo los movimientos del turno abierto (no los de otros turnos o cajeros)
    const { data } = await getMovimientos({ per_page: 5, turno_actual: 1 })
    movimientosRecientes.value = (data.data ?? []).map(mapearMovimiento)
  } catch (error) {
    console.error('Error al cargar movimientos del turno:', error)
    movimientosRecientes.value = []
  }
}

const cargarResumenTurno = async () => {
  try {
    const { data } = await getResumenTurno()
    ventasContado.value = parseFloat(data.ventas_contado)
    ventasTarjeta.value = parseFloat(data.ventas_tarjeta)
    ventasTransferencia.value = parseFloat(data.ventas_transferencia)
    entradas.value = parseFloat(data.total_entradas)
    retiros.value = parseFloat(data.total_salidas)
    montoEnCajaReal.value = parseFloat(data.monto_en_caja)
    montoEsperadoReal.value = parseFloat(data.monto_esperado)
    totalEnCajaReal.value = parseFloat(data.total_en_caja)
  } catch (error) {
    console.error('Error al cargar el resumen del turno:', error)
  }
}

// Refresca estado de caja + movimientos + resumen. Llamar tras cualquier acción que cambie los datos.
const refrescarDatosTurno = async () => {
  await Promise.all([cajaStore.cargarEstadoCaja(), cargarMovimientosRecientes(), cargarResumenTurno()])
}

onMounted(refrescarDatosTurno)

// Permite refrescar desde fuera (ej. tras registrar un movimiento o una venta en otra vista)
defineExpose({ refrescarDatosTurno })

watch(
  () => cajaStore.necesitaActualizarResumen,
  (necesitaActualizar) => {
    if (necesitaActualizar) {
      refrescarDatosTurno()
      cajaStore.necesitaActualizarResumen = false
    }
  },
)

const toast = (title) =>
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title,
    showConfirmButton: false,
    timer: 2000,
    background: '#ffffff',
    color: '#1e3a2f',
    iconColor: '#2b5e3b',
  })

// --- Apertura de caja (admin) ---
const abrirCaja = () => {
  adminAuthVisible.value = true
}

const onCredencialesConfirmadas = async (credenciales) => {
  adminAuthRef.value?.setLoading(true)
  const resultado = await cajaStore.abrirTurnoCaja(credenciales)
  adminAuthRef.value?.setLoading(false)

  if (resultado.ok) {
    adminAuthVisible.value = false
    toast('Caja aperturada correctamente')
  } else {
    adminAuthRef.value?.mostrarError(resultado.error)
  }
}

// --- Apertura de venta (cajero) ---
const abrirVenta = () => {
  aperturaVentaVisible.value = true
}

const onAbrirVenta = async ({ total, denominaciones, justificacion }) => {
  // El modal permanece abierto hasta que el backend confirme, para no perder el conteo si falla
  const resultado = await cajaStore.abrirTurnoVenta({ denominaciones, justificacion })

  if (resultado.ok) {
    aperturaVentaVisible.value = false
    openCashierRef.value?.reset()
    await refrescarDatosTurno()
    toast(`Venta aperturada con $${formatNumber(total)}`)
    return
  }

  Swal.fire({
    icon: 'error',
    title: resultado.requiereJustificacion ? 'Justificación requerida' : 'Error al aperturar venta',
    text: resultado.error,
    confirmButtonColor: '#2b5e3b',
  })
}

// --- Cierre: conteo -> credenciales -> cuadre -> confirmación ---
const cerrarCaja = () => {
  conteoVisible.value = true
}

const onConteoListo = ({ denominaciones, conteo }) => {
  denominacionesGuardadas.value = denominaciones
  conteoGuardado.value = conteo

  conteoVisible.value = false
  adminAuthCierreVisible.value = true
}

const onCredencialesCierre = async (credenciales) => {
  adminAuthCierreRef.value?.setLoading(true)

  const resultado = await cajaStore.cuadrarTurnoVenta({
    email: credenciales.email,
    password: credenciales.password,
    denominaciones: conteoGuardado.value,
  })

  adminAuthCierreRef.value?.setLoading(false)

  if (resultado.ok) {
    adminAuthCierreVisible.value = false
    datosCierre.value = resultado.data
    cierreVisible.value = true
    await refrescarDatosTurno()
  } else {
    adminAuthCierreRef.value?.mostrarError(resultado.error)
  }
}

const onCancelarCierre = () => {
  cierreVisible.value = false
  closeCashierRef.value?.restaurar(denominacionesGuardadas.value)
  conteoVisible.value = true
}

const onCierreExitoso = async () => {
  cierreVisible.value = false
  closeCashierRef.value?.reset()
  denominacionesGuardadas.value = []
  conteoGuardado.value = {}
  datosCierre.value = {}

  // El carrito en proceso no debe quedar disponible para el siguiente turno
  posStore.resetVenta()

  await refrescarDatosTurno()
}
</script>