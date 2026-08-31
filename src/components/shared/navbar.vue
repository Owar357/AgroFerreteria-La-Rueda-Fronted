<template>
  <header class="flex items-center justify-between px-5 h-25 bg-[#1C3A1A] border-b border-[#2a4a28] flex-shrink-0">

    <div class="flex items-center gap-4">
      <!-- Boton hamburguesa -->
      <button @click="$emit('toggleSidebar')"
        class="bg-transparent border-none cursor-pointer text-[#EAEAEA] text-xl p-1.5 rounded-md flex items-center transition-colors duration-200 hover:bg-[#2a4a28]">
        <i class="pi pi-bars"></i>
      </button>

     
      
      <!-- Contenedor del Logo y Texto alineados -->
      <div class="flex items-center gap-3">
        
        <!-- Contenedor para controlar el tamaño de la imagen -->
        <div class="w-12 h-12 flex items-center justify-center">
          <img
            src="/src/assets/logo.png"
            alt="Logo La Rueda"
             class="w-full h-full object-contain rounded-md" 
          />
        </div>

        
        <div class="flex flex-col justify-center">
          
          <span class="text-[#EAEAEA] text-lg font-bold leading-tight mt-1">Agrofereteria
                <!--  PANEL {{ authStore.isAdmin ? 'ADMIN' : 'CLIENTE' }} -->
          </span>
          <span class="text-[#EAEAEA] text-lg font-bold leading-tight mt-1">La Rueda
             
          </span>
       
        </div>
      </div>
    </div>

          <!-- Info del usuario logueado -->
    <div class="flex items-center gap-3">
      <i class="pi pi-user text-[#EAEAEA] text-xl bg-[#2a4a28] p-2 rounded-full"></i>

      <div class="flex flex-col justify-center leading-tight">
        <span class="text-[#EAEAEA] text-sm font-semibold">
          {{ user?.name }}
        </span>
        <span class="text-[#A9C6A5] text-xs">
           {{ roleLabel }}
        </span>
      </div>
    </div>
  </header>
</template>

<script setup>

defineEmits(['toggleSidebar'])

import authService from '@/services/authService';
import { computed } from 'vue';

const user = computed(() => authService.getUser())
const role = computed(() => authService.getUserRole())


//Mapeamos el rol interno a texto para que lo vea el usuario
const roleLabels = {

  ADMIN: 'Administrador',
  CAJERO: 'Cajero',
  CONTADOR: 'Contador',
}

const roleLabel = computed(() => roleLabels[role.value] || role.value)
</script>