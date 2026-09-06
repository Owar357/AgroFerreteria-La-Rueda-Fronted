<template>
  <div class="overflow-hidden relative">
    <!-- 1. LISTA — SIEMPRE montada, solo se oculta -->
    <div v-show="vistaActual === 'lista'" class="w-full">
      <ProductoTable
        @open-add="abrirFormularioCrear"
        @open-edit="abrirFormularioEditar"
        @open-detail="abrirDetalle"
      />
    </div>

    <!-- Las demás vistas sí se destruyen entre sí, con su transición -->
    <transition :name="transitionName" mode="out-in">
      <div v-if="vistaActual !== 'lista'" :key="vistaActual" class="w-full">
        <!-- 2. CREAR -->
        <AddProductos
          v-if="vistaActual === 'formulario'"
          :producto="productoSeleccionado"
          @close="cerrarFormulario"
        />

        <!-- 3. EDITAR -->
        <EditProducto
          v-else-if="vistaActual === 'editar'"
          :producto="productoSeleccionado"
          @close="cerrarFormulario"
        />

        <!-- 4. DETALLE -->
        <DetalleProductosTable
          v-else-if="vistaActual === 'detalle'"
          :producto="productoSeleccionado"
          @volver="cerrarDetalle"
          @open-lotes="abrirLotes"
        />

        <!-- 5. LOTES -->
        <LotesPresentacionTable
          v-else-if="vistaActual === 'lotes'"
          :presentacionId="presentacionSeleccionada?.id"
          :nombrePresentacion="presentacionSeleccionada?.nombre"
          @volver="cerrarLotes"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductoTable from '../components/Productos/ProductoTable.vue'
import AddProductos from '../components/Productos/AddProductos.vue'
import EditProducto from '@/components/Productos/EditProducto.vue'
import DetalleProductosTable from '../components/Productos/DetalleProductosTable.vue'
import LotesPresentacionTable from '../components/Productos/LotesPresentacionTable.vue'
import { useproductoStore } from '../stores/productoStore.js'

const store = useproductoStore()

const vistaActual = ref('lista')
const productoSeleccionado = ref(null)
const presentacionSeleccionada = ref(null)
const transitionName = ref('slide-forward')

const abrirFormularioCrear = () => {
  transitionName.value = 'slide-forward'
  productoSeleccionado.value = null
  vistaActual.value = 'formulario'
}

const abrirFormularioEditar = (producto) => {
  transitionName.value = 'slide-forward'
  productoSeleccionado.value = producto
  vistaActual.value = 'editar'
}

const abrirDetalle = (producto) => {
  transitionName.value = 'slide-forward'
  productoSeleccionado.value = producto
  vistaActual.value = 'detalle'
}

const abrirLotes = (presentacion) => {
  transitionName.value = 'slide-forward'
  presentacionSeleccionada.value = presentacion
  vistaActual.value = 'lotes'
}

const cerrarFormulario = () => {
  transitionName.value = 'slide-backward'
  vistaActual.value = 'lista'
  productoSeleccionado.value = null
  store.cargarProductos(1, store.perPage) // aquí SÍ quieres refrescar (creaste/editaste algo)
}

const cerrarDetalle = () => {
  transitionName.value = 'slide-backward'
  vistaActual.value = 'lista'
  productoSeleccionado.value = null
  // ❌ sin store.cargarProductos() — ProductoTable nunca se destruyó, conserva su página
}

const cerrarLotes = () => {
  transitionName.value = 'slide-backward'
  vistaActual.value = 'detalle'
  presentacionSeleccionada.value = null
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