<template>
  <div>
    <SupplierTable
      @open-add="showAddForm = true"
      @open-edit="abrirModalEditar"
      @open-detail="abrirModalDetalle"
    />

    <AgreProveedor
      v-model="showAddForm"
      @guardar="onGuardarNuevo"
    />

    <EditProveedor
      v-model="showEditForm"
      :proveedor="proveedorSeleccionado"
      @actualizar="onActualizarExistente"
    />

    <DetallesProve
      v-model="detalleVisible"
      :proveedor="proveedorSeleccionado"
      @open-edit="handleEdit"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProveedorStore } from '@/stores/proveedorStore'
import SupplierTable    from '../components/Usuarios/SupplierTable.vue'
import AgreProveedor    from '../views/AgreProveedor.vue'
import EditProveedor    from '../components/Usuarios/EditProveeDialog.vue'
import DetallesProve    from '@/components/Usuarios/DetallesProve.vue'

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
