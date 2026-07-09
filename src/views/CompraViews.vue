<template>
  <div>
    <ComprasTable
      v-if="!showForm"
      :compras="compras"
      :loading="loading"
      :paginacion="paginacion"
      @open-add="showForm = true"
      @cambiar-pagina="cargarCompras"
      @filtrar="aplicarFiltros"
      @ver-detalle="verDetalleCompra"
      @anular-compra="marcarCompraComoAnulada"
    />

    <AddCompra
      v-if="showForm"
      @close="cerrarFormulario"
    />

    <!-- Diálogo de detalle de compra -->
    <DetalleCompraDialogo
      v-model:visible="mostrarDetalleDialog"
      :compra="selectedCompra"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { compras as comprasService, VerDetallesCompra} from '@/services/compraService.js'
import ComprasTable from '../components/Compras/ComprasTable.vue'
import AddCompra from '../components/Compras/AddCompra.vue'
import DetalleCompraDialogo from '../components/Compras/DetalleCompraDialog.vue'

const showForm = ref(false)
const loading = ref(false)
const compras = ref([])
const mostrarDetalleDialog = ref(false)
const selectedCompra = ref(null)

const paginacion = ref({
  currentPage: 1,
  lastPage: 1,
  perPage: 5,
  total: 0,
})

const filtrosActivos = ref({
  estado_pago: null,
  proveedor: null,
  fecha_desde: null,
  fecha_hasta: null,
})

const cargarCompras = async (pagina = 1) => {
  loading.value = true
  try {
    const { data } = await comprasService({
      page: pagina,
      ...filtrosActivos.value,
    })
    compras.value = data.compras
    paginacion.value = {
      currentPage: data.current_page,
      lastPage: data.last_page,
      perPage: data.per_page,
      total: data.total,
    }
  } catch (error) {
    console.error('Error al cargar compras:', error)
  } finally {
    loading.value = false
  }
}

const aplicarFiltros = (filtros) => {
  filtrosActivos.value = filtros
  cargarCompras(1)
}

const cerrarFormulario = () => {
  showForm.value = false
  cargarCompras()
}

const verDetalleCompra = async (compraRow) => {
  try {
    const response = await VerDetallesCompra( compraRow.id)
    selectedCompra.value = response.data.data 
    mostrarDetalleDialog.value = true
  } catch (error) {
    console.error('Error al cargar detalle de compra:', error)
  }
}

const marcarCompraComoAnulada = (compraId) => {
  const compra = compras.value.find(c => c.id === compraId)
  if (compra) {
    compra.estadoPago = 'ANULADA'
  }
}
onMounted(() => cargarCompras())
</script>