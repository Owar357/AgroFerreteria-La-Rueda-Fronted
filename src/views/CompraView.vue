<template>
  <div>
    <ComprasTable
      v-if="!showForm"
      :compras="compras"
      :loading="loading"
      :paginacion="paginacion"
      :filtros="filtros"
      @open-add="showForm = true"
      @cambiar-pagina="cargarCompras"
    />

    <RegistroComprasView
      v-if="showForm"
      @close="cerrarFormulario"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { compras as comprasService} from '@/services/compraService.js'
import ComprasTable from '@/components/Compras/ComprasTable.vue'
import RegistroComprasView from './RegistroComprasView.vue'

const showForm = ref(false)
const loading = ref(false)
const compras = ref([])

const paginacion = ref({
  currentPage: 1,
  lastPage: 1,
  perPage: 5,
  total: 0,
})

const filtros = ref({
  estadoPago: { value: null, matchMode: FilterMatchMode.EQUALS },
  fechaEmision: { value: null, matchMode: FilterMatchMode.CUSTOM },
})

const cargarCompras = async (pagina = 1) => {
  loading.value = true
  try {
    const { data } = await comprasService({ page: pagina })
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

const cerrarFormulario = () => {
  showForm.value = false
  cargarCompras()
}

onMounted(() => cargarCompras())
</script>