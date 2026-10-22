<template>
  <section class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-5 flex flex-col gap-4 min-w-0">
    <header class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-[#1e3a2f] m-0">Últimas ventas</h2>
        <p class="text-sm text-[#6b7280] m-0 mt-1">Las 8 más recientes.</p>
      </div>
      <button class="text-sm font-medium text-[#6b7280] hover:text-[#1e3a2f] transition-colors">
        Ver historial
      </button>
    </header>

    <div class="flex flex-col gap-3">
      <!-- Bucle de las ventas con la corrección estructural implementada -->
      <div 
        v-for="venta in ventas" 
        :key="venta.id" 
        class="flex items-center justify-between p-3 rounded-xl border border-[#e9ede4] bg-white gap-3"
      >
        <!-- CONTENEDOR DEL ICONO FIJO (shrink-0 previene que se estire a lo largo) -->
        <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-500 shrink-0">
          <i class="pi pi-credit-card"></i>
        </div>

        <!-- CONTENEDOR DE TEXTO FLEXIBLE -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-[#1e3a2f] truncate m-0">
            Venta...
          </p>
          <p class="text-xs text-[#6b7280] m-0">
            1...
          </p>
        </div>

        <!-- PRECIO / MONTO -->
        <div class="text-right shrink-0">
          <p class="text-sm font-bold text-[#1e3a2f] m-0">
            $50.00
          </p>
        </div>
      </div>
    </div>
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