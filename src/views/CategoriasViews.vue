<template>
  <div class="bg-[#eef2e9] min-h-screen p-8 text-[#090909] font-['Inter',sans-serif]">

      <div class="flex items-center gap-3 mb-6">
      <div
        class="!w-10 !h-10 rounded-xl bg-white border border-[#e2e8dd] shadow-sm flex items-center justify-center shrink-0">
        <i class="pi pi-book text-[#2b5e3b] text-xl "></i>
      </div>
      <div>
        <h1 class="text-[28px] md:text-[32px] font-bold text-[#1a2e1f] leading-tight m-0">
          Catálogo de categorias
        </h1>
        <p class="text-[14px] text-gray-500 mt-0.5 m-0">Gestión general de las categorías y ganacias</p>
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