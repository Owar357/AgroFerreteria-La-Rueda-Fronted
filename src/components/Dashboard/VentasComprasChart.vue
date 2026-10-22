<template>
  <section class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-5 flex flex-col gap-4 min-w-0">
    <header class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-[#1e3a2f] m-0">Ventas y compras por mes</h2>
        <p class="text-sm text-[#6b7280] m-0 mt-1">
          Ventas procesadas frente a compras no anuladas.
        </p>
      </div>
      <Select
        v-model="anio"
        :options="aniosDisponibles"
        class="w-28"
        aria-label="Año"
        :disabled="cargando"
      />
    </header>

    <div class="flex flex-wrap gap-6">
      <div>
        <p class="text-xs text-[#6b7280] m-0">Ventas de {{ anio }}</p>
        <p class="text-xl font-bold text-[#4A8C3F] m-0">{{ moneda(totalVentas) }}</p>
      </div>
      <div>
        <p class="text-xs text-[#6b7280] m-0">Compras de {{ anio }}</p>
        <p class="text-xl font-bold text-[#C0392B] m-0">{{ moneda(totalCompras) }}</p>
      </div>
    </div>

    <div class="relative" :class="cargando ? 'opacity-50 transition-opacity' : ''">
      <Chart v-if="hayDatos" type="bar" :data="datosGrafica" :options="opciones" class="h-72" />
      <div
        v-else
        class="h-72 flex flex-col items-center justify-center text-center text-[#6b7280] gap-2"
      >
        <i class="pi pi-chart-bar text-3xl text-[#9ca3af]"></i>
        <p class="m-0 text-sm">Sin movimientos registrados en {{ anio }}.</p>
      </div>
    </div>

    <p v-if="error" class="m-0 text-sm text-[#C0392B]">{{ error }}</p>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Chart from 'primevue/chart'
import Select from 'primevue/select'
import { obtenerVentasCompras } from '@/services/DashboardService'
import { moneda, monedaCompacta } from '@/utils/formatters'

const props = defineProps({
  // Se incrementa desde el padre en cada actualización automática.
  refreshKey: { type: Number, default: 0 },
})

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const anio = ref(new Date().getFullYear())
const aniosDisponibles = ref([anio.value])
const ventas = ref(Array(12).fill(0))
const compras = ref(Array(12).fill(0))
const cargando = ref(false)
const error = ref('')

const suma = (arr) => arr.reduce((acc, n) => acc + n, 0)
const totalVentas = computed(() => suma(ventas.value))
const totalCompras = computed(() => suma(compras.value))
const hayDatos = computed(() => totalVentas.value > 0 || totalCompras.value > 0)

const datosGrafica = computed(() => ({
  labels: MESES,
  datasets: [
    {
      type: 'bar',
      label: 'Ventas',
      data: ventas.value,
      backgroundColor: '#4A8C3F',
      hoverBackgroundColor: '#6FAF65',
      borderRadius: 6,
      maxBarThickness: 28,
      order: 2,
    },
    {
      type: 'line',
      label: 'Compras',
      data: compras.value,
      borderColor: '#C0392B',
      backgroundColor: '#C0392B',
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 3,
      order: 1,
    },
  ],
}))

const opciones = {
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: { usePointStyle: true, boxWidth: 8, color: '#374151' },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${moneda(ctx.parsed.y)}`,
      },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#6b7280' } },
    y: {
      beginAtZero: true,
      grid: { color: '#e9ede4' },
      ticks: { color: '#6b7280', callback: (valor) => monedaCompacta(valor) },
    },
  },
}

async function cargar({ silencioso = false } = {}) {
  // En una actualización automática no se atenúa la gráfica ni se bloquea el selector.
  if (!silencioso) {
    cargando.value = true
    error.value = ''
  }
  try {
    const data = await obtenerVentasCompras(anio.value)
    ventas.value = data.ventas
    compras.value = data.compras
    aniosDisponibles.value = data.anios_disponibles
    error.value = ''
  } catch (e) {
    if (!silencioso) {
      error.value = e.response?.data?.message || 'No se pudo cargar la gráfica. Intenta de nuevo.'
    }
  } finally {
    if (!silencioso) cargando.value = false
  }
}

watch(anio, () => cargar())
watch(() => props.refreshKey, () => cargar({ silencioso: true }))
onMounted(() => cargar())
</script>