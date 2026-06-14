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

const onViewDetail = (cliente) => {
  selectedClient.value = {
    name: cliente.nombre || cliente.razon_social,
    personType: cliente.tipo_persona === 'NATURAL' ? 'Natural' : 'Jurídica',
    documentNumber: cliente.numero_documento,
    nrc: cliente.nrc,
    phone: cliente.telefono,
    email: cliente.correo,
  }
  detailVisible.value = true
}

const onViewHistory = (cliente) => {
  router.push({
    name:   'ClienteHistorial',
    params: { id: cliente.id },
    query:  { clienteId: cliente.id, nombre: cliente.nombre, doc: cliente.numero_documento }
  })
}
</script>