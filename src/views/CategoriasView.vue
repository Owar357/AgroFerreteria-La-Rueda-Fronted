<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#090909] font-['Inter',sans-serif]">

    <div class="flex justify-between items-center w-full mb-8">
      <h1 class="text-[26px] font-semibold tracking-tight !text-black">Registro de Categorías</h1>

      <Button
        label="+ Agregar"
        class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-6 py-4 rounded-lg border-none cursor-pointer shadow-md transition-colors"
        @click="modalAddVisible = true"
      />
    </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] shadow-lg p-1">
      <CategoriasTable
        :categorias="store.categorias"
        :cargando="store.cargando"
        @open-edit="abrirEditar"
      />
    </div>

    <AddCategoriaDialog
      v-model:visible="modalAddVisible"
    />

    <EditCategoriaDialog
      v-model:visible="modalEditarVisible"
      :categoria="categoriaSeleccionada"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'

import CategoriasTable from '../components/Categorias/CategoriasTable.vue'
import AddCategoriaDialog from '../components/Categorias/AddCategoriaDialog.vue'
import EditCategoriaDialog from '../components/Categorias/EditCategoriaDialog.vue'
import { useCategoriaStore } from '../stores/categoriaStore'

const store = useCategoriaStore()

const modalAddVisible    = ref(false)
const modalEditarVisible = ref(false)
const categoriaSeleccionada = ref(null)

const abrirEditar = (categoria) => {
  categoriaSeleccionada.value = { ...categoria }
  modalEditarVisible.value = true
}

onMounted(store.cargarCategorias)
</script>