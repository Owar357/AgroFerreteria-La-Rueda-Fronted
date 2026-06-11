<template>
  <div>
    <TablaCliente
      @view-detail="onViewDetail"
      @view-history="onViewHistory"
    />

    <ClienteDetalleDialogo
      v-model:visible="detailVisible"
      :client="selectedClient"
    />
    
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import TablaCliente from '@/components/Clientes/TablaCliente.vue'
import ClienteDetalleDialogo from '@/components/Clientes/ClienteDetalleDialogo.vue'



const router = useRouter()

const detailVisible  = ref(false)
const selectedClient = ref(null)

const onViewHistory = (cliente) => {
  router.push({
    name:   'ClienteHistorial',        
    params: { id: cliente.id },
    query:  { nombre: cliente.nombre, doc: cliente.numero_documento }
  })
}


const onViewDetail = (cliente) => {
  selectedClient.value = cliente
  detailVisible.value  = true
}
</script>