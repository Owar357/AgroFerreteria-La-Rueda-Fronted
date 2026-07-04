<template>
  <div class="overflow-hidden relative">
    <transition :name="transitionName" mode="out-in">
      <div :key="vistaActual" class="w-full">

        <ReportesCentro
          v-if="vistaActual === 'centro'"
          @ver-ventas="abrirReporteVentas"
        />

        <ReporteDetalleVenta
          v-else-if="vistaActual === 'ventas'"
          @volver="volver"
        />

      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReportesCentro from '@/components/Reportes/ReportesCentro.vue'
import ReporteDetalleVenta from '@/components/Reportes/ReporteDetalleVenta.vue'

const vistaActual   = ref('centro')
const transitionName = ref('slide-forward')

const abrirReporteVentas = () => {
  transitionName.value = 'slide-forward'
  vistaActual.value = 'ventas'
}

const volver = () => {
  transitionName.value = 'slide-backward'
  vistaActual.value = 'centro'
}
</script>

<style scoped>
.slide-forward-enter-active,
.slide-forward-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-forward-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-forward-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-backward-enter-active,
.slide-backward-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-backward-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-backward-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.overflow-hidden {
  overflow-x: hidden;
}
</style>