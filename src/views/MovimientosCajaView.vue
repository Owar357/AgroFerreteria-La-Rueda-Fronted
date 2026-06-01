<template>
  <div class="p-6" style="font-family: 'Inter', sans-serif; background-color: #eef2e9; min-height: 100vh;">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-[#1a2e1f]">Movimientos de caja</h1>
        <p class="text-sm text-[#6d8f60] mt-1">Historial de entradas y salidas de efectivo</p>
      </div>
      <button @click="dialogVisible  = true "
        class="flex items-center gap-2 bg-[#2b5e3b] hover:bg-[#1f482d] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">
        <i class="pi pi-plus"></i> Agregar
      </button>
    </div>

    <!-- BÚSQUEDA + FILTROS -->
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="relative w-64">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#819b74] text-sm"></i>
          <input v-model="searchText" placeholder="Buscar por concepto o usuario..."
            class="w-full pl-9 pr-4 py-2 rounded-lg border border-[#dee6d6] bg-white text-sm outline-none focus:border-[#e0b354]" />
        </div>

        <div class="flex items-center gap-2 bg-white border border-[#dee6d6] rounded-lg px-3 py-2">
          <i class="pi pi-calendar text-[#819b74] text-sm"></i>
          <span class="text-xs text-[#819b74] font-medium">Desde</span>
          <input type="date" v-model="fechaDesde" class="text-sm text-[#1a2e1f] outline-none bg-transparent" />
        </div>

        <div class="flex items-center gap-2 bg-white border border-[#dee6d6] rounded-lg px-3 py-2">
          <i class="pi pi-calendar text-[#819b74] text-sm"></i>
          <span class="text-xs text-[#819b74] font-medium">Hasta</span>
          <input type="date" v-model="fechaHasta" class="text-sm text-[#1a2e1f] outline-none bg-transparent" />
        </div>

        <button @click="fechaDesde = ''; fechaHasta = ''"
          class="px-4 py-1.5 rounded-lg text-sm font-medium border transition-all flex items-center gap-1 bg-white text-[#6d8f60] border-[#dee6d6] hover:bg-red-600 hover:text-white hover:border-red-600">
          <i class="pi pi-times text-xs"></i> Limpiar fechas
        </button>
      </div>

      <div class="flex gap-2">
        <button @click="filtroTipo = 'todos'"
          :class="['px-4 py-1.5 rounded-lg text-sm font-medium border transition-all', filtroTipo === 'todos' ? 'bg-[#e0b354] text-[#1a2e1f] border-[#e0b354]' : 'bg-white text-[#6d8f60] border-[#dee6d6] hover:bg-[#f5f9f0]']">Todos</button>
        <button @click="filtroTipo = 'ENTRADA'"
          :class="['px-4 py-1.5 rounded-lg text-sm font-medium border transition-all flex items-center gap-1', filtroTipo === 'ENTRADA' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-[#6d8f60] border-[#dee6d6] hover:bg-[#f5f9f0]']">
          <i class="pi pi-arrow-up text-xs"></i> Entradas</button>
        <button @click="filtroTipo = 'SALIDA'"
          :class="['px-4 py-1.5 rounded-lg text-sm font-medium border transition-all flex items-center gap-1', filtroTipo === 'SALIDA' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-[#6d8f60] border-[#dee6d6] hover:bg-[#f5f9f0]']">
          <i class="pi pi-arrow-down text-xs"></i> Salidas</button>
      </div>
    </div>

    <!-- TABLA -->
    <div class="bg-white rounded-2xl shadow-sm border border-[#e8efe1] overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-white border-b border-[#e8efe1]">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-semibold text-[#3c674b] tracking-wider">TIPO</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-[#3c674b] tracking-wider">MONTO</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-[#3c674b] tracking-wider">CONCEPTO</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-[#3c674b] tracking-wider">USUARIO</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-[#3c674b] tracking-wider">FECHA / HORA</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mov, index) in movimientosPaginados" :key="mov.id"
            :class="['border-b border-[#f0f5ea] transition-colors', index % 2 === 0 ? 'bg-white' : 'bg-[#fafdf7]']">
            <td class="px-6 py-4">
              <span
                :class="['inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold', mov.tipo === 'ENTRADA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                <i :class="mov.tipo === 'ENTRADA' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-[10px]"></i>
                {{ mov.tipo }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm font-semibold"
              :class="mov.tipo === 'ENTRADA' ? 'text-green-700' : 'text-red-600'">
              {{ mov.tipo === 'ENTRADA' ? '+' : '-' }}${{ formatNumber(mov.monto) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{{ mov.concepto }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ mov.usuario }}</td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-600">{{ formatFecha(mov.fecha) }}</div>
              <div class="text-xs text-gray-400">{{ mov.hora }}</div>
            </td>
          </tr>

          <tr v-if="movimientosFiltrados.length === 0">
            <td colspan="5" class="text-center py-12 text-gray-400">
              <i class="pi pi-inbox text-3xl mb-2 block"></i>
              No hay movimientos registrados
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <Paginator v-model:first="paginaFirst" :rows="7" :totalRecords="movimientosFiltrados.length"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        class="border-t border-[#e8efe1] !bg-white" />

      <!-- Footer -->
      <div class="bg-[#fefcf5] px-6 py-3 border-t border-[#e8efe1] flex justify-between items-center flex-wrap gap-3">
        <div class="text-xs text-[#6d8f60]">Mostrando {{ movimientosPaginados.length }} de {{
          movimientosFiltrados.length }} movimientos</div>
        <div class="flex gap-4 text-xs">
          <span class="flex items-center gap-1"><i class="pi pi-arrow-up text-green-600"></i> Entradas: <strong>${{
            formatNumber(totalEntradas) }}</strong></span>
          <span class="flex items-center gap-1"><i class="pi pi-arrow-down text-red-600"></i> Salidas: <strong>${{
            formatNumber(totalSalidas) }}</strong></span>
          <span class="flex items-center gap-1"><i class="pi pi-chart-line text-[#e0b354]"></i> Balance: <strong
              :class="balance >= 0 ? 'text-green-700' : 'text-red-600'">${{ formatNumber(balance) }}</strong></span>
        </div>
      </div>
    </div>


    <AddMovimientoCaja v-model:visible="dialogVisible" :usuarioActual="'Samuel Lara'" :turnoActual="'Turno 1'"
      @movimientoRegistrado="onMovimientoRegistrado" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Paginator from 'primevue/paginator'
import AddMovimientoCaja from '@/components/Caja/AddMovimientoCajaDialog.vue'

const movimientos = ref([
  { id: 1, tipo: 'ENTRADA', monto: 100.00, concepto: 'Apertura de caja - Turno matutino', usuario: 'Samuel Lara', fecha: '2026-05-25', hora: '08:30' },
  { id: 2, tipo: 'ENTRADA', monto: 45.00, concepto: 'Venta contado - Fertilizante (cliente Juan Pérez)', usuario: 'Samuel Lara', fecha: '2026-05-22', hora: '09:45' },
  { id: 3, tipo: 'ENTRADA', monto: 40.00, concepto: 'Venta contado - Herramientas (cliente María López)', usuario: 'Samuel Lara', fecha: '2026-05-21', hora: '10:20' },
  { id: 4, tipo: 'SALIDA', monto: 50.00, concepto: 'Pago a proveedor - Semillas (AgroSemillas SA)', usuario: 'Samuel Lara', fecha: '2026-05-01', hora: '11:00' },
  { id: 5, tipo: 'ENTRADA', monto: 30.00, concepto: 'Venta contado - Fungicida (cliente Carlos Ruiz)', usuario: 'Samuel Lara', fecha: '2026-05-25', hora: '11:45' },
  { id: 6, tipo: 'ENTRADA', monto: 250.00, concepto: 'Transferencia bancaria recibida - Cliente mayorista', usuario: 'Daniel Melgar', fecha: '2026-03-25', hora: '14:30' },
  { id: 7, tipo: 'SALIDA', monto: 30.00, concepto: 'Gasto menor - Compra de café para oficina', usuario: 'Daniel Melgar', fecha: '2026-02-23', hora: '16:00' },
  { id: 8, tipo: 'ENTRADA', monto: 120.00, concepto: 'Venta con tarjeta (POS) - Abono foliar', usuario: 'María López', fecha: '2026-05-25', hora: '20:45' },
])

const searchText = ref('')
const filtroTipo = ref('todos')
const fechaDesde = ref('')
const fechaHasta = ref('')
const paginaFirst = ref(0)

watch([searchText, filtroTipo, fechaDesde, fechaHasta], () => {
  paginaFirst.value = 0
})

const formatFecha = (fecha) => {
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y}`
}


const dialogVisible = ref(false)

const onMovimientoRegistrado = (nuevoMovimiento) => {
  movimientos.value.unshift(nuevoMovimiento)
}


const movimientosFiltrados = computed(() => {
  let resultado = movimientos.value
  if (filtroTipo.value !== 'todos')
    resultado = resultado.filter(m => m.tipo === filtroTipo.value)
  if (searchText.value.trim()) {
    const b = searchText.value.toLowerCase()
    resultado = resultado.filter(m => m.concepto.toLowerCase().includes(b) || m.usuario.toLowerCase().includes(b))
  }
  if (fechaDesde.value)
    resultado = resultado.filter(m => m.fecha >= fechaDesde.value)
  if (fechaHasta.value)
    resultado = resultado.filter(m => m.fecha <= fechaHasta.value)
  return resultado
})

const movimientosPaginados = computed(() => {
  return movimientosFiltrados.value.slice(paginaFirst.value, paginaFirst.value + 7)
})

const totalEntradas = computed(() => movimientosFiltrados.value.filter(m => m.tipo === 'ENTRADA').reduce((s, m) => s + m.monto, 0))
const totalSalidas = computed(() => movimientosFiltrados.value.filter(m => m.tipo === 'SALIDA').reduce((s, m) => s + m.monto, 0))
const balance = computed(() => totalEntradas.value - totalSalidas.value)

const formatNumber = (value) => value?.toFixed(2) ?? '0.00'
</script>