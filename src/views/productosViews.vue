  <template>
    <div class="overflow-hidden relative">
      <transition :name="transitionName" mode="out-in">
        <div :key="vistaActual" class="w-full">
          
        
          <ProductoTable 
            v-if="vistaActual === 'lista'"
            @open-add="abrirFormularioCrear"
            @open-edit="abrirFormularioEditar"
            @open-detail="abrirDetalle"
          />

        
          <AddProductos
            v-else-if="vistaActual === 'formulario'"
            :producto="productoSeleccionado"
            @close="cerrarFormulario"
          />

          <EditProducto
            v-else-if="vistaActual === 'editar'"
            :producto="productoSeleccionado"
            @close="cerrarFormulario"
          />
          
        
          <DetalleProductosTable
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
  import ProductoTable from '../components/Productos/ProductoTable.vue'
  import AddProductos from '../components/Productos/AddProductos.vue'
  import { useproductoStore } from '../stores/productoStore.js'
  import DetalleProductosTable from '../components/Productos/DetalleProductosTable.vue'
import EditProducto from '@/components/Productos/EditProducto.vue'



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
    vistaActual.value = 'editar'
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