<template>
  <header class="flex-shrink-0 w-full font-['Inter',sans-serif]">

    <!-- ======================================================= -->
    <!-- VISTA MÓVIL (< 640px)                                   -->
    <!-- ======================================================= -->
    <div class="block sm:hidden bg-[#1C3A1A] border-b border-[#2a4a28] px-3 py-2.5">
      <div class="flex items-center justify-between">
        
        <!-- Izquierda: Hamburguesa + Logo + Nombre Corto -->
        <div class="flex items-center gap-2">
          <button 
            @click="$emit('toggleSidebar')"
            class="bg-transparent border-none cursor-pointer text-[#EAEAEA] text-lg p-1.5 rounded-md flex items-center transition-colors duration-200 hover:bg-[#2a4a28]"
            aria-label="Toggle Sidebar"
          >
            <i class="pi pi-bars"></i>
          </button>

          <div class="flex items-center gap-2">
            <div class="w-8 h-8 flex items-center justify-center shrink-0">
              <img
                src="/src/assets/logo.png"
                alt="Logo La Rueda"
                class="w-full h-full object-contain rounded-md" 
              />
            </div>
            <div class="flex flex-col justify-center leading-tight">
              <span class="text-[#EAEAEA] text-xs font-bold">Agroferretería</span>
              <span class="text-[#EAEAEA] text-xs font-bold">La Rueda</span>
            </div>
          </div>
        </div>

        <!-- Derecha: Avatar + Nombre/Rol Compacto -->
        <div class="flex items-center gap-2">
          <div class="flex flex-col justify-center text-right leading-tight max-w-[100px]">
            <span class="text-[#EAEAEA] text-[11px] font-semibold truncate">
              {{ user?.name }}
            </span>
            <span class="text-[#A9C6A5] text-[9px] font-medium">
              {{ roleLabel }}
            </span>
          </div>
          <i class="pi pi-user text-[#EAEAEA] text-sm bg-[#2a4a28] p-1.5 rounded-full shrink-0"></i>
        </div>

      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO (>= 640px)                             -->
    <!-- ======================================================= -->
    <div class="hidden sm:flex items-center justify-between px-5 h-25 bg-[#1C3A1A] border-b border-[#2a4a28]">
      
      <div class="flex items-center gap-4">
        <!-- Boton hamburguesa -->
        <button 
          @click="$emit('toggleSidebar')"
          class="bg-transparent border-none cursor-pointer text-[#EAEAEA] text-xl p-1.5 rounded-md flex items-center transition-colors duration-200 hover:bg-[#2a4a28]"
        >
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
            <span class="text-[#EAEAEA] text-lg font-bold leading-tight mt-1">
              Agroferretería
            </span>
            <span class="text-[#EAEAEA] text-lg font-bold leading-tight mt-1">
              La Rueda
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

    </div>

  </header>
</template>

<script setup>
import { computed } from 'vue'
import authService from '@/services/authService'

defineEmits(['toggleSidebar'])

const user = computed(() => authService.getUser())
const role = computed(() => authService.getUserRole())

const roleLabels = {
  ADMIN: 'Administrador',
  CAJERO: 'Cajero',
  CONTADOR: 'Contador',
}

const roleLabel = computed(() => roleLabels[role.value] || role.value)
</script>