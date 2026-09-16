<template>
  <div class="overflow-hidden relative">
    <transition :name="transitionName" mode="out-in">
      <div :key="vistaActual" class="w-full">

        <ReportesCentro
          v-if="vistaActual === 'centro'"
          @ver-ventas="abrirReporteVentas"
          @ver-compras-proveedor="abrirReporteProveedor"
          @ver-resumen-ventas="abrirReporteResumenVentas"
          @ver-productos-mas-vendidos="abrirProductosmasvendidos"
          @ver-ventas-cajero="abrirVentasCajero"
          @ver-ventas-categoria="abrirventascategoria" 
          @ver-resumen-comparativo="abrirresumencomparativo"
          @ver-margen-ganancia="abrimargenganancia"
          @ver-flujo-compras-ventas="abrircompraventa"
          @ver-inventario-valorizado="abririnventariovalorizado"
          @ver-productos-por-vencer="abrirproductosporvencer"
        />

        <ReporteDetalleVenta
          v-else-if="vistaActual === 'ventas'"
          @volver="volver"
        />
        <ReporteComprasPorProveedor 
          v-else-if="vistaActual === 'proveedor'"
          @volver="volver"
        />
        
        <ReporteResumenVentas 
        v-else-if="vistaActual === 'resumen-ventas'"
        @volver="volver"
        />

        <ProductosMasVendidos 
        v-else-if="vistaActual ==='productos-mas-vendidos'"
        @volver="volver"
        />

        <ReporteVentasCajero 
        v-else-if="vistaActual === 'ventas-cajero'"
        @volver="volver"
        />

        <ReporteVentasCategoria 
        v-else-if="vistaActual === 'ventas-categoria'"
        @volver="volver"
        />

        <ResumenComparativoVentas 
        v-else-if="vistaActual === 'resumen-comparativo'"
        @volver="volver"
        />

        <ReporteMargenGanancia 
        v-else-if="vistaActual === 'margen-ganancia'"
        @volver="volver"
        />

        <ReporteComprasVentas 
        v-else-if="vistaActual === 'compra-venta'"
        @volver="volver"
        />

        <ReporteInventarioValorizado 
        v-else-if="vistaActual === 'inventario-valorizado'"
        @volver="volver"
        />

        <ReporteProductosPorVencer 
        v-else-if="vistaActual === 'productos-por-vencer'"
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
import ReporteComprasPorProveedor from '@/components/Reportes/ReporteComprasPorProveedor.vue'
import ReporteResumenVentas from '@/components/Reportes/ReporteResumenVentas.vue'
import ProductosMasVendidos from '@/components/Reportes/ProductosMasVendidos.vue'
import ReporteVentasCajero from '@/components/Reportes/ReporteVentasCajero.vue'
import ReporteVentasCategoria from '@/components/Reportes/ReporteVentasCategoria.vue'
import ResumenComparativoVentas from '@/components/Reportes/ResumenComparativoVentas.vue'
import ReporteMargenGanancia from '@/components/Reportes/ReporteMargenGanancia.vue'
import ReporteComprasVentas from '@/components/Reportes/ReporteComprasVentas.vue'
import ReporteInventarioValorizado from '@/components/Reportes/ReporteInventarioValorizado.vue'
import ReporteProductosPorVencer from '@/components/Reportes/ReporteProductosPorVencer.vue'

const vistaActual   = ref('centro')
const transitionName = ref('slide-forward')

const abrirReporteVentas = () => {
  transitionName.value = 'slide-forward'
  vistaActual.value = 'ventas'
}

//para abriri la compras pro proveedor
const abrirReporteProveedor = () => {
  transitionName.value = 'slide-forward'
  vistaActual.value = 'proveedor'
}


const volver = () => {
  transitionName.value = 'slide-backward'
  vistaActual.value = 'centro'
}

//Para abriri al resumen de ventas
const abrirReporteResumenVentas = () => {
  transitionName.value = 'slide-forward'
  vistaActual.value = 'resumen-ventas'
}

//funcion para abriri la card de poductos mas vendidos
const abrirProductosmasvendidos = () => {
transitionName.value = 'slide-forward'
vistaActual.value = 'productos-mas-vendidos'
}

//Funcion para ver las ver la vista de ventas por cajeri
const abrirVentasCajero = () => {
  transitionName.value = 'slide-forward'
  vistaActual.value = 'ventas-cajero'
}

//Funccion para ver las vebtas pr categoria
const abrirventascategoria = () => {
  transitionName.value = 'slide-forward'
  vistaActual.value = 'ventas-categoria'
}

//funcion para abriri el resumen comparativo de las venas
const abrirresumencomparativo = () => {
  transitionName.value = 'slide-forward'
  vistaActual.value = 'resumen-comparativo'
}

//funcion para verla vista del magen de gabancia
const abrimargenganancia = () => {
  transitionName.value = 'slide-forward'
  vistaActual.value = 'margen-ganancia'
}

//funccion para abriri la interfaz de comprasventas
const abrircompraventa = () => {
  transitionName.value = 'slide-forward'
  vistaActual.value = 'compra-venta'
}

//funccion para abrir la interfaz de inventario-valorizado
const abririnventariovalorizado = () => {
  transitionName.value = 'slide-forward'
  vistaActual.value = 'inventario-valorizado'
}

//funcccion para productos por vencsder
const abrirproductosporvencer = () => {
  transitionName.value = 'slide-forward'
  vistaActual.value = 'productos-por-vencer'
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