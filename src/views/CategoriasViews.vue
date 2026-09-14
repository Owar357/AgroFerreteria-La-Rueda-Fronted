<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#090909] font-['Inter',sans-serif]">

    <div class="flex items-center gap-3 mb-5">
        <div
          class="!w-11 !h-11 rounded-lg bg-[#f4f7f2] border border-[#dce4d7] shadow-sm flex items-center justify-center shrink-0">
          <i class="pi pi-book text-[#2b5e3b] text-lg"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-[#1a2e1f]">Catálogo de categorias</h1>
          <p class="text-1xl text-[#526356] mt-0.5">Gestión general de las categorías y ganacias </p>
        </div>
      </div>

    <div class="bg-[#ffffff] rounded-xl overflow-hidden shadow-lg">
      <CategoriasTable
        :categorias="store.categorias"
        :cargando="store.cargando"
        @open-edit="abrirEditar"
        @open-add="modalAddVisible = true"
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

import CategoriasTable from '../components/Categorias/CategoriasTable.vue'
import AddCategoriaDialog from '../components/Categorias/AddCategoriaDialog.vue'
import EditCategoriaDialog from '../components/Categorias/EditCategoriaDialog.vue'
import { useCategoriaStore } from '../stores/categoriaStore.js'

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