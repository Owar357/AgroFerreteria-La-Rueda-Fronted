<template>
  <section class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-5 flex flex-col gap-4 min-w-0">
    <header>
      <h2 class="text-lg font-semibold text-[#1e3a2f] m-0">Ventas por método de pago</h2>
      <p class="text-sm text-[#6b7280] m-0 mt-1">Mes actual.</p>
    </header>

    <template v-if="hayDatos">
      <Chart type="doughnut" :data="datosGrafica" :options="opciones" class="h-48" />

      <ul class="list-none m-0 p-0 flex flex-col gap-3">
        <li v-for="m in metodos" :key="m.tipo" class="flex items-center gap-3">
          <span
            class="w-3 h-3 rounded-full shrink-0"
            :style="{ backgroundColor: colores[m.tipo] }"
          ></span>
          <span class="text-sm text-[#1a2e1f] flex-1 capitalize">{{ m.tipo.toLowerCase() }}</span>
          <span class="text-sm font-semibold text-[#1a2e1f]">{{ moneda(m.total) }}</span>
          <span class="text-xs text-[#6b7280] w-12 text-right">{{ m.porcentaje }}%</span>
        </li>
      </ul>
    </template>

    <div v-else class="py-10 flex flex-col items-center text-center text-[#6b7280] gap-2">
      <i class="pi pi-chart-pie text-3xl text-[#9ca3af]"></i>
      <p class="m-0 text-sm">Sin ventas procesadas este mes.</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import Chart from 'primevue/chart'
import { moneda } from '@/utils/formatters'

const props = defineProps({
  metodos: { type: Array, default: () => [] },
})

const colores = {
  EFECTIVO: '#4A8C3F',
  TARJETA: '#2196F3',
  TRANSFERENCIA: '#D48A1A',
}

const hayDatos = computed(() => props.metodos.some((m) => m.total > 0))

const datosGrafica = computed(() => ({
  labels: props.metodos.map((m) => m.tipo.charAt(0) + m.tipo.slice(1).toLowerCase()),
  datasets: [
    {
      data: props.metodos.map((m) => m.total),
      backgroundColor: props.metodos.map((m) => colores[m.tipo]),
      borderColor: '#ffffff',
      borderWidth: 3,
    },
  ],
}))

const opciones = {
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.label}: ${moneda(ctx.parsed)}`,
      },
    },
  },
}
</script>