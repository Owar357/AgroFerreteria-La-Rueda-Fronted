<template>
  <div
    class="min-h-full bg-[#eef2e9] p-3 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif] w-full overflow-x-hidden"
  >
    <!-- Encabezado Corregido (Sin botón de actualización) -->
    <div class="flex flex-row items-center gap-4 mb-8 w-full">
      
      <!-- Icono: Cuadrado perfecto 1:1 con bordes redondeados armónicos -->
      <div
        class="w-14 h-14 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#1e3a2f] flex-shrink-0 border border-gray-200/50"
      >
        <i class="pi pi-chart-line text-2xl"></i>
      </div>
      
      <!-- Textos: Título más grande y descripción horizontal sin encimarse -->
      <div class="flex flex-col min-w-0">
        <h1 class="text-3xl font-bold text-[#1e3a2f] m-0 tracking-tight">Dashboard</h1>
        <p class="text-sm text-[#6b7280] m-0 mt-0.5 whitespace-nowrap">
          Resumen del negocio, actualizado automáticamente.
          <span v-if="horaActualizacion" class="ml-1">Última lectura a las {{ horaActualizacion }}.</span>
        </p>
      </div>

    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="flex flex-wrap items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4"
    >
      <i class="pi pi-exclamation-circle"></i>
      <span class="flex-1">{{ error }}</span>
      <Button label="Reintentar" size="small" text severity="danger" @click="cargar" />
    </div>

    <!-- Primera carga -->
    <div v-if="!datos && cargando" class="flex justify-center py-24">
      <ProgressSpinner style="width: 3rem; height: 3rem" strokeWidth="4" />
    </div>

    <template v-else-if="datos">
      <!-- KPIs -->
      <div class="dash-kpis">
        <KpiCard
          title="Ventas de hoy"
          icon="pi pi-dollar"
          tone="green"
          :value="moneda(kpis.ventas_hoy.valor)"
          :variacion="kpis.ventas_hoy.variacion"
          comparacion="frente a ayer a esta hora"
        />
        <KpiCard
          title="Ticket promedio"
          icon="pi pi-ticket"
          tone="blue"
          :value="moneda(kpis.ticket_promedio.valor)"
          :variacion="kpis.ticket_promedio.variacion"
          comparacion="frente a ayer"
          :hint="textoTransacciones"
        />
        <KpiCard
          title="Ganancia del mes"
          icon="pi pi-chart-line"
          tone="yellow"
          :value="moneda(kpis.ganancia_mes.valor)"
          :variacion="kpis.ganancia_mes.variacion"
          comparacion="frente al mes anterior"
        />
        <KpiCard
          title="Alertas activas"
          icon="pi pi-bell"
          tone="red"
          :value="kpis.alertas.total"
          :hint="textoAlertas"
          clickable
          @click="router.push('/admin/alertas')"
        />
      </div>

      <!-- Gráfica y últimas ventas -->
      <div class="dash-main">
        <VentasComprasChart :refresh-key="refreshKey" />
        <UltimasVentas :ventas="datos.ultimas_ventas" />
      </div>

      <!-- Métodos de pago, top productos, alertas -->
      <div class="dash-trio">
        <MetodosPagoChart :metodos="datos.metodos_pago" />
        <TopProductos :productos="datos.top_productos" />
        <AlertasPrioritarias :alertas="datos.alertas" />
      </div>

      <!-- Cuentas por pagar -->
      <div class="dash-full">
        <CuentasPorPagar :datos="datos.cuentas_por_pagar" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import KpiCard from '@/components/Dashboard/KipCard.vue'
import VentasComprasChart from '@/components/Dashboard/VentasComprasChart.vue'
import UltimasVentas from '@/components/Dashboard/UltimasVentas.vue'
import MetodosPagoChart from '@/components/Dashboard/MetodosPagoChart.vue'
import TopProductos from '@/components/Dashboard/TopProductos.vue'
import AlertasPrioritarias from '@/components/Dashboard/AlertasPrioritarias.vue'
import CuentasPorPagar from '@/components/Dashboard/CuentasPorPagar.vue'
import { obtenerResumenDashboard } from '@/services/DashboardService'
import { moneda, soloHora } from '@/utils/formatters'

const router = useRouter()

const datos = ref(null)
const cargando = ref(false)
const error = ref('')
const refreshKey = ref(0)

const kpis = computed(() => datos.value?.kpis)
const horaActualizacion = computed(() => soloHora(datos.value?.generado_en))

const textoTransacciones = computed(() => {
  const n = kpis.value.transacciones_hoy.valor
  return `${n} ${n === 1 ? 'venta hoy' : 'ventas hoy'}`
})

const textoAlertas = computed(() => {
  const altas = kpis.value.alertas.altas
  if (altas === 0) return 'Ninguna de prioridad alta'
  return `${altas} de prioridad alta`
})

// Cada cuántos milisegundos se vuelven a pedir los datos.
const INTERVALO_MS = 30000
let temporizador = null

async function cargar({ silencioso = false } = {}) {
  if (cargando.value) return
  cargando.value = true
  if (!silencioso) error.value = ''
  try {
    datos.value = await obtenerResumenDashboard()
    error.value = ''
    refreshKey.value++
  } catch (e) {
    // En una actualización automática se conservan los datos que ya se ven en pantalla.
    if (!datos.value) {
      error.value = e.response?.data?.message || 'No se pudo cargar el dashboard. Intenta de nuevo.'
    }
  } finally {
    cargando.value = false
  }
}

const actualizarSiEstaVisible = () => {
  if (document.visibilityState === 'visible') cargar({ silencioso: true })
}

onMounted(() => {
  cargar()
  // Actualiza solo, y únicamente mientras la pestaña está a la vista.
  temporizador = setInterval(actualizarSiEstaVisible, INTERVALO_MS)
  // Al volver a la pestaña, se refresca de inmediato.
  document.addEventListener('visibilitychange', actualizarSiEstaVisible)
})

onUnmounted(() => {
  clearInterval(temporizador)
  document.removeEventListener('visibilitychange', actualizarSiEstaVisible)
})
</script>

<style scoped>
/* No se usa la clase "grid" de Tailwind: tailwind.css la redefine como flex (parche de PrimeFlex). */
.dash-kpis,
.dash-main,
.dash-trio,
.dash-full {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
  margin-bottom: 1rem;
}

.dash-kpis > *,
.dash-main > *,
.dash-trio > *,
.dash-full > * {
  min-width: 0;
}

@media (min-width: 640px) {
  .dash-kpis {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .dash-trio {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .dash-kpis {
    grid-template-columns: repeat(4, 1fr);
  }

  .dash-main {
    grid-template-columns: 2fr 1fr;
  }
}
</style>