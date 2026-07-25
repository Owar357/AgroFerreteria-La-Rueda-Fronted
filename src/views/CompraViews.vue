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
      
      

      @anular-compra="anularCompra"
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
import ComprasTable from '../components/Compras/ComprasTable.vue'
import AddCompra from '../components/Compras/AddCompra.vue'
import DetalleCompraDialogo from '../components/Compras/DetalleCompraDialog.vue'
import Swal from 'sweetalert2'
import { compras as comprasService, VerDetallesCompra, anularCompra as anularCompraService } from '@/services/compraService.js'


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
// Funcion para el boton a amular la compra// kathi
const anularCompra = async (compraId) => {
  try {
    await anularCompraService(compraId)

    const compra = compras.value.find((c) => c.id === compraId)
    if (compra) {
      
      compra.esAnulado = true
    }

    Swal.fire({
      title: 'Anulación de la compra exitosa',
      html: `La compra con el número de documento: <strong>${compra?.numDocumento ?? ''}</strong> se ha anulado.`,
      icon: 'success',
      confirmButtonColor: '#2b5e3b',
      timer: 3000,
      timerProgressBar: true,
    })
  } catch (error) {
    const mensaje = error.response?.data?.message || 'No se pudo anular la compra'
    Swal.fire({
      title: 'No se pudo anular',
      text: mensaje,
      icon: 'error',
      confirmButtonColor: '#b91c1c',
    })
  }
}
onMounted(() => cargarCompras())
</script>