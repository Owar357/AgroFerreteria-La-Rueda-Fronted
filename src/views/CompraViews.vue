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
      @compra-actualizada="onCompraActualizada"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ComprasTable from '../components/Compras/ComprasTable.vue'
import AddCompra from '../components/Compras/AddCompra.vue'
import DetalleCompraDialogo from '../components/Compras/DetalleCompraDialog.vue'
import { compras as comprasService, VerDetallesCompra, anularCompra as anularCompraService } from '@/services/compraService.js'
import { 
  mostrarExito, 
  mostrarError, 
  mostrarAccesoDenegado, 
  mostrarCargando 
} from '@/utils/SweetAlertService'

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
    compras.value = await Promise.all(data.compras.map(async (compra) => {
      try {
        const respuestaDetalle = await VerDetallesCompra(compra.id)
        const compraCompleta = respuestaDetalle.data.data
        return { ...compra, esAnulado: Boolean(compraCompleta.es_anulado) }
      } catch {
        return { ...compra, esAnulado: false }
      }
    }))
    paginacion.value = {
      currentPage: data.current_page,
      lastPage: data.last_page,
      perPage: data.per_page,
      total: data.total,
    }
  } catch (error) {
    if (error.response?.status === 403) {
      mostrarAccesoDenegado()
    } else {
      mostrarError('Error de carga', 'No se pudieron obtener las compras.')
    }
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
    const response = await VerDetallesCompra(compraRow.id)
    selectedCompra.value = response.data.data 
    mostrarDetalleDialog.value = true
  } catch (error) {
    if (error.response?.status === 403) {
      mostrarAccesoDenegado()
    } else {
      mostrarError('Error', 'No se pudo obtener el detalle de la compra.')
    }
  }
}

const onCompraActualizada = async () => {
  await cargarCompras(paginacion.value.currentPage)
  if (selectedCompra.value) {
    await verDetalleCompra(selectedCompra.value)
  }
}

const anularCompra = async (compraId) => {
  const compra = compras.value.find((c) => c.id === compraId)
  
  mostrarCargando('Anulando compra...', 'Procesando la anulación del documento')

  try {
    const [resultado] = await Promise.all([
      anularCompraService(compraId),
      new Promise((resolve) => setTimeout(resolve, 500))
    ])

    if (compra) {
      compra.esAnulado = true
    }

    mostrarExito(
      'Anulación exitosa',
      `La compra con número de documento <strong>${compra?.numDocumento ?? ''}</strong> fue anulada.`
    )
    
    await cargarCompras(paginacion.value.currentPage)
  } catch (error) {
    if (error.response?.status === 403) {
      mostrarAccesoDenegado()
    } else {
      const mensaje = error.response?.data?.message || 'No se pudo anular la compra.'
      mostrarError('No se pudo anular', mensaje)
    }
  }
}

onMounted(() => cargarCompras())
</script>
