<template>
  <div class="p-6" style="font-family: 'Inter', sans-serif; background-color: #eef2e9; min-height: 100vh;">
    
    <!-- ================= HEADER: Título + Fecha + Estado ================= -->
    <div class="flex justify-between items-center mb-8 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-[#1a2e1f]">Turno de caja</h1>
        <p class="text-sm text-[#6d8f60] mt-1">Control y gestión del turno actual</p>
      </div>
      <div class="flex items-center gap-4">
        <!-- Fecha -->
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#e8efe1]">
          <i class="pi pi-calendar text-[#6d8f60] text-sm"></i>
          <span class="text-sm text-[#1e3a2f]">{{ currentDate }}</span>
        </div>
        <!-- Estado del turno -->
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#e8efe1]">
          <span class="text-sm text-[#6d8f60]">Estado:</span>
          <span :class="['inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold', turnoAbierto ? 'bg-green-100 text-green-800' : 'bg-red-300 text-red-800']">
            <i class="pi pi-circle-fill text-[8px]" :class="turnoAbierto ? 'text-green-600' : 'text-red-500'"></i>
            {{ turnoAbierto ? 'TURNO ABIERTO' : 'TURNO CERRADO' }}
          </span>
        </div>
      </div>
    </div>

   
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
      <!-- Monto Inicial -->
     <div class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200 w-2xs">
        <div class="flex justify-between items-start mb-3">
          <p class="text-sm font-medium text-[#6d8f60]"><i class="pi pi-wallet mr-2"></i> Monto Inicial</p>
        </div>
        <p class="text-3xl font-bold text-[#1a2e1f]">${{ formatNumber(montoInicial) }}</p>
        <p class="text-xs text-[#819b74] mt-2">Efectivo al abrir caja</p>
      </div>
      
      <!-- Monto Esperado -->
      <div class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200 w-2xs">
        <div class="flex justify-between items-start mb-3">
          <p class="text-sm font-medium text-[#6d8f60]"><i class="pi pi-chart-line mr-2"></i> Monto Esperado</p>
        </div>
        <p class="text-3xl font-bold text-[#1a2e1f]">${{ formatNumber(montoEsperado) }}</p>
        <p class="text-xs text-[#819b74] mt-2">Cuánto se estima que debe haber en caja</p>
      </div>
      
      <!-- Monto en Caja -->
      <div class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200 w-2xs">
        <div class="flex justify-between items-start mb-3">
          <p class="text-sm font-medium text-[#6d8f60]"><i class="pi pi-money-bill mr-2"></i> Monto en Caja</p>
        </div>
        <p class="text-3xl font-bold text-[#2b5e3b]">${{ formatNumber(montoEnCaja) }}</p>
        <p class="text-xs text-green-600 mt-2">Cantidad registrada al final del día</p>
      </div>
      
      <!-- Diferencia -->
      <div class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200 w-2xs">
        <div class="flex justify-between items-start mb-3">
          <p class="text-sm font-medium text-[#6d8f60]"><i class="pi pi-chart-line mr-2"></i> Diferencia</p>
        </div>
        <!-- Mejora visual: Color gris neutro cuando la diferencia es exactamente 0 -->
        <p :class="['text-3xl font-bold', diferencia === 0 ? 'text-gray-500' : (diferencia > 0 ? 'text-green-700' : 'text-red-600')]">
          ${{ formatNumber(Math.abs(diferencia)) }}
          <span class="text-sm ml-1">{{ diferencia < 0 ? '(Faltante)' : (diferencia > 0 ? '(Sobrante)' : '') }}</span>
        </p>
        <p class="text-xs text-gray-500 mt-2">{{ diferencia === 0 ? 'Sin desfase' : (diferencia < 0 ? 'Falta dinero' : 'Sobra dinero') }}</p>
      </div>
    </div>

    <!-- ================= BLOQUE 2: ACCIONES (izquierda) + RESUMEN MOVIMIENTOS (derecha) ================= -->
  <div class="flex gap-6 mb-8">
  
  <!-- Acciones: ancho fijo -->
  <div class="w-72 flex-shrink-0">
    <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm">
      <div class="bg-[#fafdf7] px-6 py-4 border-b border-[#e8efe1]">
        <h2 class="font-semibold text-[#1a2e1f] text-lg">
          <i class="pi pi-cog mr-2 text-[#e0b354]"></i> Acciones
        </h2>
        <p class="text-xs text-[#6d8f60] mt-1">Operaciones del turno</p>
      </div>
      <div class="p-5 space-y-3">
        <button 
          @click="toggleTurno"
          :class="['w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2', turnoAbierto ? 'bg-red-600 hover:bg-red-700' : 'bg-[#2b5e3b] hover:bg-[#1f482d]']"
        >
          <i :class="turnoAbierto ? 'pi pi-lock' : 'pi pi-unlock'"></i>
          {{ turnoAbierto ? 'Cerrar caja' : 'Apertura de caja' }}
        </button>
        <button 
          @click="showSalesDetail"
          class="w-full py-3 rounded-xl font-semibold bg-[#eef2e9] text-[#1a2e1f] border border-[#d4decb] hover:bg-[#e2e8dd] transition-all flex items-center justify-center gap-2"
        >
          <i class="pi pi-chart-simple"></i>
          Ver ventas del día
        </button>
        <button 
          @click="showExternalMovements"
          class="w-full py-3 rounded-xl font-semibold bg-[#eef2e9] text-[#1a2e1f] border border-[#d4decb] hover:bg-[#e2e8dd] transition-all flex items-center justify-center gap-2"
        >
          <i class="pi pi-truck"></i>
          Ver otros movimientos
        </button>
      </div>
    </div>
  </div>

  <!-- Resumen: ocupa el resto -->
  <div class="flex-1 min-w-0">
    <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm">
      <div class="bg-[#fafdf7] px-6 py-4 border-b border-[#e8efe1]">
        <h2 class="font-semibold text-[#1a2e1f] text-lg">
          <i class="pi pi-chart-pie mr-2 text-[#e0b354]"></i> Resumen de movimientos
        </h2>
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
    <!-- ================= BLOQUE 3: TABLA DE ÚLTIMOS MOVIMIENTOS ================= -->
    <div class="bg-white rounded-2xl shadow-sm border border-[#e8efe1] overflow-hidden">
      <div class="bg-[#fafdf7] px-6 py-4 border-b border-[#e8efe1]">
        <h3 class="font-semibold text-[#1a2e1f]">
          <i class="pi pi-history mr-2 text-[#e0b354]"></i> Últimos movimientos
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
              <td colspan="5" class="text-center py-10 text-gray-400">
                <i class="pi pi-info-circle text-lg"></i>
                <p class="mt-1">No hay movimientos registrados</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="bg-[#fefcf5] px-6 py-3 border-t border-[#e8efe1] text-right text-xs text-[#6d8f60]">
         Mostrando ultimos movimientos realizados
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ========== FECHA ACTUAL ==========
const currentDate = ref(new Date().toLocaleDateString('es-ES', { 
  day: '2-digit', 
  month: '2-digit', 
  year: 'numeric' 
}))

// ========== ESTADO DEL TURNO ==========
const turnoAbierto = ref(false)
const montoInicial = ref(0)
const ventasContado = ref(0)
const ventasTarjeta = ref(0)
const ventasTransferencia = ref(0)
const retiros = ref(0)

// ========== MOVIMIENTOS (datos de ejemplo) ==========
const todosMovimientos = ref([
  { hora: '08:30', concepto: 'Apertura de caja', monto: '+$100.00', tipo: 'Ingreso', saldo: '$100.00' },
  { hora: '09:45', concepto: 'Venta contado - Fertilizante', monto: '+$45.00', tipo: 'Ingreso', saldo: '$145.00' },
  { hora: '10:20', concepto: 'Venta contado - Herramientas', monto: '+$40.00', tipo: 'Ingreso', saldo: '$185.00' },
  { hora: '11:00', concepto: 'Pago a proveedor (semillas)', monto: '-$50.00', tipo: 'Egreso', saldo: '$135.00' },
  { hora: '11:45', concepto: 'Venta contado - Fungicida', monto: '+$30.00', tipo: 'Ingreso', saldo: '$165.00' },
  { hora: '12:30', concepto: 'Transferencia recibida (cliente)', monto: '+$25.00', tipo: 'Ingreso', saldo: '$190.00' },
])

// ========== COMPUTADAS ==========
const movimientosRecientes = computed(() => {
  return [...todosMovimientos.value].slice(-5).reverse()
})

const totalVentas = computed(() => ventasContado.value + ventasTarjeta.value + ventasTransferencia.value)
const montoEsperado = computed(() => montoInicial.value + totalVentas.value - retiros.value)
const totalEnCaja = computed(() => montoInicial.value + totalVentas.value - retiros.value)
const montoEnCaja = computed(() => totalEnCaja.value)
const diferencia = computed(() => montoEnCaja.value - montoEsperado.value)

// ========== MÉTODOS ==========
const formatNumber = (value) => value.toFixed(2)

const toggleTurno = () => {
  if (!turnoAbierto.value) {
    const inicial = prompt('Ingrese el monto inicial en caja (efectivo):', '100.00')
    if (inicial !== null && !isNaN(parseFloat(inicial))) {
      montoInicial.value = parseFloat(inicial)
      turnoAbierto.value = true
      todosMovimientos.value.push({
        hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        concepto: 'Apertura de turno',
        monto: `+$${formatNumber(montoInicial.value)}`,
        tipo: 'Ingreso',
        saldo: `$${formatNumber(montoInicial.value)}`
      })
      alert(`✅ Turno abierto con monto inicial: $${formatNumber(montoInicial.value)}`)
    } else {
      alert('Por favor ingrese un monto válido')
    }
  } else {
    const resumen = `📊 CIERRE DE TURNO\n\n` +
      `Monto Inicial: $${formatNumber(montoInicial.value)}\n` +
      `Ventas contado: $${formatNumber(ventasContado.value)}\n` +
      `Ventas tarjeta: $${formatNumber(ventasTarjeta.value)}\n` +
      `Transferencias: $${formatNumber(ventasTransferencia.value)}\n` +
      `Retiros/Gastos: $${formatNumber(retiros.value)}\n` +
      `Total en caja: $${formatNumber(totalEnCaja.value)}\n` +
      `Diferencia: $${formatNumber(Math.abs(diferencia.value))} ${diferencia.value < 0 ? '(Faltante)' : (diferencia.value > 0 ? '(Sobrante)' : '(Perfecto)')}`
    alert(resumen)
    turnoAbierto.value = false
  }
}

const showSalesDetail = () => {
  alert(`📈 VENTAS DEL DÍA\n\n` +
    `Contado: $${formatNumber(ventasContado.value)}\n` +
    `Tarjeta (POS): $${formatNumber(ventasTarjeta.value)}\n` +
    `Transferencia: $${formatNumber(ventasTransferencia.value)}\n` +
    `Total ventas: $${formatNumber(totalVentas.value)}`)
}

const showExternalMovements = () => {
  const externos = todosMovimientos.value.filter(m => 
    m.concepto.toLowerCase().includes('proveedor') || 
    m.concepto.toLowerCase().includes('gasto') ||
    m.concepto.toLowerCase().includes('compra') ||
    m.concepto.toLowerCase().includes('retiro')
  )
  
  if (externos.length === 0) {
    alert('📋 No hay movimientos externos registrados (pagos a proveedores o compras pequeñas).')
  } else {
    let lista = '📋 MOVIMIENTOS EXTERNOS\n\n'
    externos.forEach(m => {
      lista += `${m.hora} - ${m.concepto} - ${m.monto}\n`
    })
    alert(lista)
  }
}
</script>