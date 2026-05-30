<template>
  <div>
    <!-- 1. Escuchamos los eventos que vienen de los botones de la tabla -->
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
import SupplierTable from '../components/Usuarios/SupplierTable.vue'
import AgreProveedor from '../views/AgreProveedor.vue'  
import EditProveedor from '../components/Usuarios/EditProveeDialog.vue'
import DetallesProve from '@/components/Usuarios/DetallesProve.vue'

const showAddForm  = ref(false)
const showEditForm = ref(false)
const detalleVisible = ref(false)          // ← faltaba
const proveedorSeleccionado = ref(null)

function abrirModalEditar(proveedor) {
  proveedorSeleccionado.value = { ...proveedor }
  showEditForm.value = true
}

function abrirModalDetalle(proveedor) {    // ← faltaba
  proveedorSeleccionado.value = { ...proveedor }
  detalleVisible.value = true
}

function handleEdit(proveedor) {           // ← faltaba
  detalleVisible.value = false
  proveedorSeleccionado.value = { ...proveedor }
  showEditForm.value = true
}

function onGuardarNuevo(payload) {
  console.log('Guardando nuevo:', payload)
  showAddForm.value = false
}

function onActualizarExistente(payload) {
  console.log('Datos editados:', payload)
  showEditForm.value = false
}
</script>