<template>
  <div class="overflow-hidden relative">
    <transition :name="transitionName" mode="out-in">
      <div :key="vistaActual" class="w-full">
        
        <!-- Vista 1: Lista de productos (CRUD) -->
        <ProducTable 
          v-if="vistaActual === 'lista'"
          @open-add="abrirFormularioCrear"
          @open-edit="abrirFormularioEditar"
          @open-detail="abrirDetalle"
        />

        <!-- Vista 2 Formulario de producto (crear/editar) -->
        <Producto 
          v-else-if="vistaActual === 'formulario'"
          :producto="productoSeleccionado"
          @close="cerrarFormulario"
        />

        <!-- Vista 3: Detalle del producto con las presentaciones -->
        <DetalleProducto 
          v-else-if="vistaActual === 'detalle'"
          :producto="productoSeleccionado"
          @volver="cerrarDetalle"
        />

      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProducTable from '../components/Usuarios/ProducTable.vue'
import Producto from '../views/Producto.vue'
import { useproductoStore } from '../stores/productoStore.js'
import DetalleProducto from '../components/Productos/ProductDetailsTable.vue'


const store = useproductoStore()

// Control de vista actual
const vistaActual = ref('lista') 
const productoSeleccionado = ref(null)


// Control de dirección de la transición
const transitionName = ref('slide-forward')

// Navegación hacia adelante (abrir)
const abrirFormularioCrear = () => {
  transitionName.value = 'slide-forward'
  productoSeleccionado.value = null
  vistaActual.value = 'formulario'
}

const abrirFormularioEditar = (producto) => {
  transitionName.value = 'slide-forward'
  productoSeleccionado.value = producto
  vistaActual.value = 'formulario'
}

const abrirDetalle = (producto) => {
  transitionName.value = 'slide-forward'
  productoSeleccionado.value = producto
  vistaActual.value = 'detalle'
}

// Navegación hacia atrás cerrar
const cerrarFormulario = () => {
  transitionName.value = 'slide-backward'
  vistaActual.value = 'lista'
  productoSeleccionado.value = null
  store.cargarProductos(1, store.perPage)
}

const cerrarDetalle = () => {
  transitionName.value = 'slide-backward'
  vistaActual.value = 'lista'
  productoSeleccionado.value = null
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