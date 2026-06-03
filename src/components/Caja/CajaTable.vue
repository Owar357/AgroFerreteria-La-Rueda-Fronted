<template>
  <div class="p-6" style="font-family: 'Inter', sans-serif; background-color: #eef2e9; min-height: 100vh;">

    <!-- ================= HEADER ================= -->
    <div class="flex justify-between items-center mb-8 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-[#1a2e1f]">Turno de caja</h1>
        <p class="text-sm text-[#6d8f60] mt-1">Control y gestión del turno actual</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#e8efe1]">
          <i class="pi pi-calendar text-[#6d8f60] text-sm"></i>
          <span class="text-sm text-[#1a2e1f]">{{ currentDate }}</span>
        </div>
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#e8efe1]">
          <span class="text-sm text-[#6d8f60]">Estado:</span>
          <span
            :class="['inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold', turnoAbierto ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
            <i class="pi pi-circle-fill text-[8px]" :class="turnoAbierto ? 'text-green-600' : 'text-red-500'"></i>
            {{ turnoAbierto ? 'TURNO ABIERTO' : 'TURNO CERRADO' }}
          </span>
        </div>
      </div>
    </div>

    <!-- ================= BLOQUE 1: 4 TARJETAS ================= -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
      <div class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex justify-between items-start mb-3">
          <p class="text-sm font-medium text-[#6d8f60]"><i class="pi pi-wallet mr-2"></i> Monto Inicial</p>
        </div>
        <p class="text-3xl font-bold text-[#1a2e1f]">${{ formatNumber(montoInicial) }}</p>
        <p class="text-xs text-[#819b74] mt-2">Efectivo al abrir caja</p>
      </div>

      <div class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex justify-between items-start mb-3">
          <p class="text-sm font-medium text-[#6d8f60]"><i class="pi pi-chart-line mr-2"></i> Monto Esperado</p>
        </div>
        <p class="text-3xl font-bold text-[#1a2e1f]">${{ formatNumber(montoEsperado) }}</p>
        <p class="text-xs text-[#819b74] mt-2">Cuánto se estima que debe haber en caja</p>
      </div>

      <div class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex justify-between items-start mb-3">
          <p class="text-sm font-medium text-[#6d8f60]"><i class="pi pi-money-bill mr-2"></i> Monto en Caja</p>
        </div>
        <p class="text-3xl font-bold text-[#2b5e3b]">
          ${{ formatNumber(turnoAbierto ? montoEnCaja : montoRealFinal) }}
        </p>
        <p class="text-xs text-green-600 mt-2">
          {{ turnoAbierto ? 'Cantidad actual' : 'Valor contado al cierre' }}
        </p>
      </div>

      <div class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex justify-between items-start mb-3">
          <p class="text-sm font-medium text-[#6d8f60]"><i class="pi pi-chart-line mr-2"></i> Diferencia</p>
        </div>
        <p
          :class="['text-3xl font-bold', (turnoAbierto ? diferencia : diferenciaFinal) === 0 ? 'text-gray-500' : ((turnoAbierto ? diferencia : diferenciaFinal) > 0 ? 'text-green-700' : 'text-red-600')]">
          ${{ formatNumber(Math.abs(turnoAbierto ? diferencia : diferenciaFinal)) }}
          <span class="text-sm ml-1">
            {{ (turnoAbierto ? diferencia : diferenciaFinal) < 0 ? '(Faltante)' : ((turnoAbierto ? diferencia : diferenciaFinal) > 0 ? '(Sobrante)' : '') }}
          </span>
        </p>
        <p class="text-xs text-gray-500 mt-2">
          {{ (turnoAbierto ? diferencia : diferenciaFinal) === 0 ? 'Sin desfase' : ((turnoAbierto ? diferencia : diferenciaFinal) < 0 ? 'Falta dinero' : 'Sobra dinero') }}
        </p>
      </div>
    </div>

    <!-- ================= BLOQUE 2: ACCIONES + RESUMEN ================= -->
    <div class="flex gap-6 mb-8">
      <div class="w-72 flex-shrink-0">
        <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm">
          <div class="bg-[#fafdf7] px-6 py-4 border-b border-[#e8efe1]">
            <h2 class="font-semibold text-[#1a2e1f] text-lg"><i class="pi pi-cog mr-2 text-[#e0b354]"></i> Acciones</h2>
            <p class="text-xs text-[#6d8f60] mt-1">Operaciones del turno</p>
          </div>
          <div class="p-5 space-y-3">
            <button v-if="!turnoAbierto" @click="abrirCaja"
              class="w-full py-3 rounded-xl font-semibold text-white bg-[#2b5e3b] hover:bg-[#1f482d] transition-all flex items-center justify-center gap-2">
              <i class="pi pi-unlock"></i> Apertura de caja
            </button>
            <button v-else @click="cerrarCaja"
              class="w-full py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-all flex items-center justify-center gap-2">
              <i class="pi pi-lock"></i> Cerrar caja
            </button>
            <button @click="showSalesDetail"
              class="w-full py-3 rounded-xl font-semibold bg-[#eef2e9] text-[#1a2e1f] border border-[#d4decb] hover:bg-[#e2e8dd] transition-all flex items-center justify-center gap-2">
              <i class="pi pi-chart-simple"></i> Ver ventas del día
            </button>
            <button @click="showExternalMovements"
              class="w-full py-3 rounded-xl font-semibold bg-[#eef2e9] text-[#1a2e1f] border border-[#d4decb] hover:bg-[#e2e8dd] transition-all flex items-center justify-center gap-2">
              <i class="pi pi-truck"></i> Ver otros movimientos
            </button>
          </div>
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm">
          <div class="bg-[#fafdf7] px-6 py-4 border-b border-[#e8efe1]">
            <h2 class="font-semibold text-[#1a2e1f] text-lg"><i class="pi pi-chart-pie mr-2 text-[#e0b354]"></i> Resumen de movimientos</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 gap-5">
              <div class="flex justify-between items-center p-4 bg-[#f9fbf7] rounded-xl border border-[#dee6d6]">
                <span class="text-sm text-[#5f7b58]"><i class="pi pi-dollar mr-2"></i> Ventas al contado:</span>
                <span class="ml-2 font-semibold text-[#1a2e1f] text-lg">${{ formatNumber(ventasContado) }}</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-[#f9fbf7] rounded-xl border border-[#dee6d6]">
                <span class="text-sm text-[#5f7b58]"><i class="pi pi-credit-card mr-2"></i> Ventas por tarjeta:</span>
                <span class="ml-2 font-semibold text-[#1a2e1f] text-lg">${{ formatNumber(ventasTarjeta) }}</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-[#f9fbf7] rounded-xl border border-[#dee6d6]">
                <span class="text-sm text-[#5f7b58]"><i class="pi pi-mobile mr-2"></i> Transferencia bancaria:</span>
                <span class="ml-2 font-semibold text-[#1a2e1f] text-lg">${{ formatNumber(ventasTransferencia) }}</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-[#fefcf5] rounded-xl border border-[#dee6d6]">
                <span class="text-sm text-[#5f7b58]"><i class="pi pi-plus mr-2"></i> Otras entradas de dinero</span>
                <span class="ml-2 font-semibold text-green-600 text-lg">+${{ formatNumber(entradas) }}</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-[#fefcf5] rounded-xl border border-[#dee6d6] col-span-2">
                <span class="text-sm text-[#5f7b58]"><i class="pi pi-arrow-down mr-2"></i> Retiros / Gastos:</span>
                <span class="ml-2 font-semibold text-red-600 text-lg">-${{ formatNumber(retiros) }}</span>
              </div>
            </div>
            <div class="mt-6 pt-4 border-t-2 border-[#e8efe1] flex justify-between items-center">
              <span class="text-base font-semibold text-[#1a2e1f]"><i class="pi pi-chart-line mr-2 text-[#e0b354]"></i> Total en caja</span>
              <span class="text-3xl font-bold text-[#2b5e3b]">${{ formatNumber(totalEnCaja) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= BLOQUE 3: TABLA DE MOVIMIENTOS ================= -->
    <div class="bg-white rounded-2xl shadow-sm border border-[#e8efe1] overflow-hidden">
      <div class="bg-[#fafdf7] px-6 py-4 border-b border-[#e8efe1]">
        <h3 class="font-semibold text-[#1a2e1f]"><i class="pi pi-history mr-2 text-[#e0b354]"></i> Últimos movimientos</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-[#e8f0e2]">
          <thead class="bg-[#fafdf7] text-[#3c674b] text-xs font-semibold">
            <tr>
              <th class="px-6 py-4 text-left">Hora</th>
              <th class="px-6 py-4 text-left">Concepto</th>
              <th class="px-6 py-4 text-left">Monto</th>
              <th class="px-6 py-4 text-left">Tipo</th>
              <th class="px-6 py-4 text-left">Saldo después</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#f0f5ea] text-sm">
            <tr v-for="mov in movimientosRecientes" :key="mov.hora + mov.concepto" class="hover:bg-[#fefcf5] transition-colors">
              <td class="px-6 py-3.5 font-medium text-[#1a2e1f]">{{ mov.hora }}</td>
              <td class="px-6 py-3.5 text-gray-600">{{ mov.concepto }}</td>
              <td class="px-6 py-3.5" :class="mov.tipo === 'Ingreso' ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'">
                {{ mov.monto }}
              </td>
              <td class="px-6 py-3.5">
                <span :class="['text-xs px-2.5 py-1 rounded-full font-medium', mov.tipo === 'Ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                  {{ mov.tipo }}
                </span>
              </td>
              <td class="px-6 py-3.5 font-medium text-[#1a2e1f]">{{ mov.saldo }}</td>
            </tr>
            <tr v-if="movimientosRecientes.length === 0">
              <td colspan="5" class="text-center py-10 text-gray-400">No hay movimientos registrados</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AperturaCajaDialog v-model:visible="aperturaCajaVisible" @turnoAbierto="onTurnoAbierto" />
    <CerrarCajaDialog v-model:visible="cerrarCajaVisible" :montoEsperado="montoEsperado" @cerrar="finalizarCierre" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AperturaCajaDialog from './OpenCashierDialog.vue'
import CerrarCajaDialog from './CloseCashierDialog.vue'
import Swal from 'sweetalert2'

const currentDate = ref(new Date().toLocaleDateString('es-ES', { day:'2-digit', month:'2-digit', year:'numeric' }))

// Estado del turno
const turnoAbierto = ref(false)
let montoInicial = ref(0)
let ventasContado = ref(0)
let ventasTarjeta = ref(0)
let ventasTransferencia = ref(0)
let entradas = ref(0)
let retiros = ref(0)
const aperturaCajaVisible = ref(false)
const cerrarCajaVisible = ref(false)
const montoRealFinal = ref(0)
const diferenciaFinal = ref(0)

// Movimientos base de demostración (fijos)
const todosMovimientos = ref([
  { hora: '09:45', concepto: 'Venta contado - Fertilizante', monto: '+$45.00', tipo: 'Ingreso', saldo: '$145.00' },
  { hora: '10:20', concepto: 'Venta contado - Herramientas', monto: '+$40.00', tipo: 'Ingreso', saldo: '$185.00' },
  { hora: '11:00', concepto: 'Pago a proveedor (semillas)', monto: '-$50.00', tipo: 'Egreso', saldo: '$135.00' },
  { hora: '11:45', concepto: 'Venta contado - Fungicida', monto: '+$30.00', tipo: 'Ingreso', saldo: '$165.00' },
  { hora: '12:30', concepto: 'Transferencia recibida (cliente)', monto: '+$25.00', tipo: 'Ingreso', saldo: '$190.00' },
])

const movimientosRecientes = computed(() => [...todosMovimientos.value].slice(-5).reverse())

// Computed que dependen del estado del turno
const totalVentas = computed(() => ventasContado.value + ventasTarjeta.value + ventasTransferencia.value)
const totalIngresos = computed(() => totalVentas.value + entradas.value)
const montoEsperado = computed(() => montoInicial.value + totalIngresos.value - retiros.value)
const totalEnCaja = computed(() => montoInicial.value + totalIngresos.value - retiros.value)
const montoEnCaja = computed(() => totalEnCaja.value)
const diferencia = computed(() => montoEnCaja.value - montoEsperado.value)

const formatNumber = (value) => (value || 0).toFixed(2)

// Función para recalcular los acumuladores a partir de los movimientos fijos
const calcularResumenDesdeMovimientos = (montoInicialApertura) => {
  let ventasContadoSum = 0
  let ventasTarjetaSum = 0
  let ventasTransferenciaSum = 0
  let retirosSum = 0
  for (const mov of todosMovimientos.value) {
    if (mov.concepto.includes('Venta contado')) ventasContadoSum += parseFloat(mov.monto.replace('+$', ''))
    else if (mov.concepto.includes('Venta por tarjeta')) ventasTarjetaSum += parseFloat(mov.monto.replace('+$', ''))
    else if (mov.concepto.includes('Transferencia recibida')) ventasTransferenciaSum += parseFloat(mov.monto.replace('+$', ''))
    else if (mov.tipo === 'Egreso') retirosSum += parseFloat(mov.monto.replace('-$', ''))
  }
  // Asignar a las refs
  ventasContado.value = ventasContadoSum
  ventasTarjeta.value = ventasTarjetaSum
  ventasTransferencia.value = ventasTransferenciaSum
  retiros.value = retirosSum
  // entradas.value se mantiene 0 en esta demo
}

const onTurnoAbierto = (monto) => {
  montoInicial.value = monto
  turnoAbierto.value = true
  // Calcular los acumuladores a partir de los movimientos fijos
  calcularResumenDesdeMovimientos(monto)
  // Agregar el movimiento de apertura a la tabla (aunque ya existe uno fijo, lo duplicamos intencionalmente?)
  // Para evitar duplicados, puedes comentar el push si el fijo ya está. Pero lo dejamos para mostrar el registro.
  todosMovimientos.value.push({
    hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    concepto: 'Apertura de turno',
    monto: `+$${formatNumber(monto)}`,
    tipo: 'Ingreso',
    saldo: `$${formatNumber(monto)}`
  })
  Swal.fire({
    toast: true, position: 'top-end', icon: 'success',
    title: `Turno abierto con $${formatNumber(monto)}`,
    showConfirmButton: false, timer: 1500,
    background: '#ffffff', color: '#1e3a2f', iconColor: '#2b5e3b'
  })
}

const abrirCaja = () => { aperturaCajaVisible.value = true }

const cerrarCaja = () => { cerrarCajaVisible.value = true }

const finalizarCierre = (montoRealContado, diferenciaReal) => {
  montoRealFinal.value = montoRealContado
  diferenciaFinal.value = diferenciaReal
  let mensaje = '', icono = 'info'
  if (diferenciaReal === 0) {
    mensaje = '¡El arqueo cuadra perfectamente! ✅'
    icono = 'success'
  } else if (diferenciaReal > 0) {
    mensaje = `Atención: Hay un sobrante de $${formatNumber(Math.abs(diferenciaReal))} 💰`
    icono = 'warning'
  } else {
    mensaje = `Atención: Hay un faltante de $${formatNumber(Math.abs(diferenciaReal))} ❌`
    icono = 'error'
  }
  Swal.fire({
    title: 'Cierre de turno',
    html: `
      <div style="text-align: left; font-family: 'Inter', sans-serif;">
        <p><i class="pi pi-chart-line"></i> <strong>Monto esperado:</strong> $${formatNumber(montoEsperado.value)}</p>
        <p><i class="pi pi-money-bill"></i> <strong>Monto real contado:</strong> $${formatNumber(montoRealContado)}</p>
        <p><strong>Diferencia:</strong> $${formatNumber(Math.abs(diferenciaReal))} ${diferenciaReal < 0 ? '(Faltante)' : (diferenciaReal > 0 ? '(Sobrante)' : '')}</p>
        <hr><p>${mensaje}</p>
      </div>
    `,
    icon: icono,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#2b5e3b',
    background: '#ffffff',
  }).then(() => {
    turnoAbierto.value = false
  })
}

const showSalesDetail = () => {
  Swal.fire({
    title: 'Ventas del día',
    html: `
      <p><i class="pi pi-dollar"></i> Contado: $${formatNumber(ventasContado.value)}</p>
      <p><i class="pi pi-credit-card"></i> Tarjeta: $${formatNumber(ventasTarjeta.value)}</p>
      <p><i class="pi pi-mobile"></i> Transferencia: $${formatNumber(ventasTransferencia.value)}</p>
      <hr><p><strong>Total ventas:</strong> $${formatNumber(totalVentas.value)}</p>
    `,
    icon: 'info',
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#2b5e3b',
  })
}

const showExternalMovements = () => {
  const externos = todosMovimientos.value.filter(m =>
    m.concepto.toLowerCase().includes('proveedor') ||
    m.concepto.toLowerCase().includes('gasto') ||
    m.concepto.toLowerCase().includes('compra') ||
    m.concepto.toLowerCase().includes('retiro')
  )
  if (externos.length === 0) {
    Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'No hay movimientos externos', showConfirmButton: false, timer: 1500 })
    return
  }
  let listaHtml = '<ul style="text-align: left;">'
  externos.forEach(m => listaHtml += `<li>${m.hora} - ${m.concepto} - ${m.monto}</li>`)
  listaHtml += '</ul>'
  Swal.fire({ title: 'Movimientos externos', html: listaHtml, icon: 'info', confirmButtonText: 'Cerrar', confirmButtonColor: '#2b5e3b' })
}
</script>