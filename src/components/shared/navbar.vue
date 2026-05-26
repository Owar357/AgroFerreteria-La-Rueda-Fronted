<template>
  <header class="flex items-center justify-between px-5 h-25 bg-[#1C3A1A] border-b border-[#2a4a28] flex-shrink-0">

    <div class="flex items-center gap-4">
      <!-- Botón hamburguesa -->
      <button @click="$emit('toggleSidebar')"
        class="bg-transparent border-none cursor-pointer text-[#EAEAEA] text-xl p-1.5 rounded-md flex items-center transition-colors duration-200 hover:bg-[#2a4a28]">
        <i class="pi pi-bars"></i>
      </button>

      <!-- Logo -->
      <div class="flex items-center gap-2.5">
        <i class="pi pi-home text-[#4A8C3F] text-[25px]"></i>
        <div class="flex flex-col justify-center">
          <span class="text-[#EAEAEA] text-lg font-bold leading-tight mt-1">Agrofereteria
                <!--  PANEL {{ authStore.isAdmin ? 'ADMIN' : 'CLIENTE' }} -->
          </span>
          <p class="text-[#B0B0B0] text-xs m-0 leading-none">La Rueda</p>
        </div>
      </div>
    </div>

  

  </header>
</template>

<script setup>
defineEmits(['toggleSidebar'])
</script>