<template>
  <div>
    <ProveedoresTable
      @open-add="showAddForm = true"
      @open-edit="abrirModalEditar"
      @open-detail="abrirModalDetalle"
    />

    <AddProveedores
      v-model="showAddForm"
      @guardar="onGuardarNuevo"
    />

    <EditProveedores
      v-model="showEditForm"
      :proveedor="proveedorSeleccionado"
      @actualizar="onActualizarExistente"
    />

    <DetalleProveedores
      v-model="detalleVisible"
      :proveedor="proveedorSeleccionado"
      @open-edit="handleEdit"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProveedorStore } from '@/stores/proveedorStore'
import ProveedoresTable    from '../components/Proveedores/ProveedoresTable.vue'
import AddProveedores    from '../components/Proveedores/AddProveedores.vue'
import EditProveedores    from '../components/Proveedores/EditProveedores.vue'
import DetalleProveedores    from '@/components/Proveedores/DetalleProveedores.vue'

const store = useProveedorStore()

const showAddForm          = ref(false)
const showEditForm         = ref(false)
const detalleVisible       = ref(false)
const proveedorSeleccionado = ref(null)

function abrirModalEditar(proveedor) {
  proveedorSeleccionado.value = { ...proveedor }
  showEditForm.value = true
}

function abrirModalDetalle(proveedor) {
  proveedorSeleccionado.value = { ...proveedor }
  detalleVisible.value = true
}

function handleEdit(proveedor) {
  detalleVisible.value = false
  proveedorSeleccionado.value = { ...proveedor }
  showEditForm.value = true
}


async function onGuardarNuevo(payload) {
  const result = await store.crearProveedor(payload)
  if (result?.ok) showAddForm.value = false
}



async function onActualizarExistente(payload) {
  console.log('>>> payload en vista:', payload)
  const result = await store.actualizarProveedor(payload.id, payload)
  if (result?.ok) showEditForm.value = false
}
</script>
