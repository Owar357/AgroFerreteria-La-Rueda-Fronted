<template>
  <div class="bg-[#eef2e9] min-h-screen p-6 font-['Inter',sans-serif]">

    <!-- Encabezado -->
    <div class="flex items-center gap-4 mb-8">
      <div class="bg-white p-3 rounded-2xl shadow-sm border border-[#e2e8dd]">
        <i class="pi pi-chart-line text-[28px] text-[#5F6B52]"></i>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-[#1e3a2f] tracking-tight">Centro de Reportes</h1>
        <p class="text-gray-500 text-sm mt-1">Consulta y descarga información estratégica de la agroferretería.</p>
      </div>
    </div>

   
    <div class="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-5 items-stretch">

      <!-- Tarjeta 1: Ventas -->
      <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
        <div class="flex items-start justify-between mb-3">
          <div class="bg-[#eef2e9] p-2 rounded-xl">
            <i class="pi pi-shopping-cart text-[22px] text-[#2b5e3b]"></i>
          </div>
          <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-medium px-2 py-1 rounded-full">finanzas</span>
        </div>
        
        <div class="mb-4">
          <h3 class="font-bold text-[#1e3a2f] text-lg">Ventas</h3>
          <p class="text-gray-500 text-sm mt-1 line-clamp-2">Resumen general y tendencias de ventas.</p>
        </div>

        <div class="flex gap-2 pt-3 border-t border-[#e2e8dd]">
          <button
            class="text-xs bg-[#2b5e3b] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f482d] transition-all duration-200 flex items-center gap-1 font-medium"
            @click="$emit('ver-ventas')"
          >
            <i class="pi pi-eye text-[11px]"></i> Visualizar
          </button>
        </div>
      </div>
      
      <!--REPORTE DE COMPRAS POR PROVEDOR-->


      <!-- Tarjeta 2: Compra Proveedor (NUEVA HABILITADA) -->
      <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
        <div class="flex items-start justify-between mb-3">
          <div class="bg-[#eef2e9] p-2 rounded-xl">
            <i class="pi pi-truck text-[22px] text-[#2b5e3b]"></i>
          </div>
          <span class="text-xs bg-[#dbeafe] text-[#1e40af] font-medium px-2 py-1 rounded-full">compras</span>
        </div>
        
        <div class="mb-4">
          <h3 class="font-bold text-[#1e3a2f] text-lg">Compra Proveedor</h3>
          <p class="text-gray-500 text-sm mt-1 line-clamp-2">Historial de compras realizadas a cada proveedor.</p>
        </div>

        <div class="flex gap-2 pt-3 border-t border-[#e2e8dd]">
          <button
            class="text-xs bg-[#2b5e3b] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f482d] transition-all duration-200 flex items-center gap-1 font-medium"
            @click="$emit('ver-compras-proveedor')"
          >
            <i class="pi pi-eye text-[11px]"></i> Visualizar
          </button>
        </div>
      </div>



      <!-- Tarjeta: Resumen de Ventas -->
    <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
      <div class="flex items-start justify-between mb-3">
        <div class="bg-[#eef2e9] p-2 rounded-xl">
          <i class="pi pi-chart-pie text-[22px] text-[#2b5e3b]"></i>
        </div>
        <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-medium px-2 py-1 rounded-full">ventas</span>
      </div>
      <div class="mb-4">
        <h3 class="font-bold text-[#1e3a2f] text-lg">Reporte de Resumen de Ventas</h3>
        <p class="text-gray-500 text-sm mt-1 line-clamp-2">Resumen general del comportamiento de ventas del negocio.</p>
      </div>
      <div class="flex gap-2 pt-3 border-t border-[#e2e8dd]">
        <button
          class="text-xs bg-[#2b5e3b] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f482d] transition-all duration-200 flex items-center gap-1 font-medium"
          @click="$emit('ver-resumen-ventas')"
        >
          <i class="pi pi-eye text-[11px]"></i> Visualizar
        </button>
      </div>
    </div>

    <!-- Tarjeta: Productos Más Vendidos -->
    <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
      <div class="flex items-start justify-between mb-3">
        <div class="bg-[#eef2e9] p-2 rounded-xl">
          <i class="pi pi-star text-[22px] text-[#2b5e3b]"></i>
        </div>
        <span class="text-xs bg-[#fef9c3] text-[#854d0e] font-medium px-2 py-1 rounded-full">productos</span>
      </div>
      <div class="mb-4">
        <h3 class="font-bold text-[#1e3a2f] text-lg">Productos Más Vendidos</h3>
        <p class="text-gray-500 text-sm mt-1 line-clamp-2">Ranking de los productos con mayor volumen de ventas.</p>
      </div>
      <div class="flex gap-2 pt-3 border-t border-[#e2e8dd]">
        <button
          class="text-xs bg-[#2b5e3b] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f482d] transition-all duration-200 flex items-center gap-1 font-medium"
          @click="$emit('ver-productos-mas-vendidos')"
        >
          <i class="pi pi-eye text-[11px]"></i> Visualizar
        </button>
      </div>
    </div>

        <!-- Tarjeta: Ventas por Usuario (Cajero) -->
    <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
      <div class="flex items-start justify-between mb-3">
        <div class="bg-[#eef2e9] p-2 rounded-xl">
          <i class="pi pi-user text-[22px] text-[#2b5e3b]"></i>
        </div>
        <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-medium px-2 py-1 rounded-full">ventas</span>
      </div>
      <div class="mb-4">
        <h3 class="font-bold text-[#1e3a2f] text-lg">Ventas por Usuario (Cajero)</h3>
        <p class="text-gray-500 text-sm mt-1 line-clamp-2">Desempeño de ventas registrado por cada cajero.</p>
      </div>
      <div class="flex gap-2 pt-3 border-t border-[#e2e8dd]">
        <button
          class="text-xs bg-[#2b5e3b] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f482d] transition-all duration-200 flex items-center gap-1 font-medium"
          @click="$emit('ver-ventas-cajero')"
        >
          <i class="pi pi-eye text-[11px]"></i> Visualizar
        </button>
      </div>
    </div>
    <!-- Tarjeta: Ventas por Categoría -->
    <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
      <div class="flex items-start justify-between mb-3">
        <div class="bg-[#eef2e9] p-2 rounded-xl">
          <i class="pi pi-tags text-[22px] text-[#2b5e3b]"></i>
        </div>
        <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-medium px-2 py-1 rounded-full">ventas</span>
      </div>
      <div class="mb-4">
        <h3 class="font-bold text-[#1e3a2f] text-lg">Reporte de Ventas por Categoría</h3>
        <p class="text-gray-500 text-sm mt-1 line-clamp-2">Ventas agrupadas por categoría de producto.</p>
      </div>
      <div class="flex gap-2 pt-3 border-t border-[#e2e8dd]">
        <button
          class="text-xs bg-[#2b5e3b] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f482d] transition-all duration-200 flex items-center gap-1 font-medium"
          @click="$emit('ver-ventas-categoria')"
        >
          <i class="pi pi-eye text-[11px]"></i> Visualizar
        </button>
      </div>
    </div>
    <!-- Tarjeta: Resumen Comparativo de Ventas -->
    <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
      <div class="flex items-start justify-between mb-3">
        <div class="bg-[#eef2e9] p-2 rounded-xl">
          <i class="pi pi-chart-line text-[22px] text-[#2b5e3b]"></i>
        </div>
        <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-medium px-2 py-1 rounded-full">ventas</span>
      </div>
      <div class="mb-4">
        <h3 class="font-bold text-[#1e3a2f] text-lg">Resumen Comparativo de Ventas</h3>
        <p class="text-gray-500 text-sm mt-1 line-clamp-2">Comparativa de ventas entre distintos períodos de tiempo.</p>
      </div>
      <div class="flex gap-2 pt-3 border-t border-[#e2e8dd]">
        <button
          class="text-xs bg-[#2b5e3b] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f482d] transition-all duration-200 flex items-center gap-1 font-medium"
          @click="$emit('ver-resumen-comparativo')"
        >
          <i class="pi pi-eye text-[11px]"></i> Visualizar
        </button>
      </div>
    </div>
    <!-- Tarjeta: Margen de Ganancia -->
  <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
    <div class="flex items-start justify-between mb-3">
      <div class="bg-[#eef2e9] p-2 rounded-xl">
        <i class="pi pi-percentage text-[22px] text-[#2b5e3b]"></i>
      </div>
      <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-medium px-2 py-1 rounded-full">finanzas</span>
    </div>
    <div class="mb-4">
      <h3 class="font-bold text-[#1e3a2f] text-lg">Reporte de Margen de Ganancia</h3>
      <p class="text-gray-500 text-sm mt-1 line-clamp-2">Análisis de la rentabilidad neta obtenida en los productos vendidos.</p>
    </div>
    <div class="flex gap-2 pt-3 border-t border-[#e2e8dd]">
      <button
        class="text-xs bg-[#2b5e3b] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f482d] transition-all duration-200 flex items-center gap-1 font-medium"
        @click="$emit('ver-margen-ganancia')"
      >
        <i class="pi pi-eye text-[11px]"></i> Visualizar
      </button>
    </div>
  </div>
      <!-- Tarjeta: Flujo Compras vs Ventas -->
    <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
      <div class="flex items-start justify-between mb-3">
        <div class="bg-[#eef2e9] p-2 rounded-xl">
          <i class="pi pi-arrow-right-arrow-left text-[22px] text-[#2b5e3b]"></i>
        </div>
        <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-medium px-2 py-1 rounded-full">finanzas</span>
      </div>
      <div class="mb-4">
        <h3 class="font-bold text-[#1e3a2f] text-lg">Reporte de Flujo (Compras vs Ventas)</h3>
        <p class="text-gray-500 text-sm mt-1 line-clamp-2">Balance comparativo entre las salidas por compras y entradas por ventas.</p>
      </div>
      <div class="flex gap-2 pt-3 border-t border-[#e2e8dd]">
        <button
          class="text-xs bg-[#2b5e3b] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f482d] transition-all duration-200 flex items-center gap-1 font-medium"
          @click="$emit('ver-flujo-compras-ventas')"
        >
          <i class="pi pi-eye text-[11px]"></i> Visualizar
        </button>
      </div>
    </div>
        <!-- Tarjeta: Inventario Valorizado -->
    <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
      <div class="flex items-start justify-between mb-3">
        <div class="bg-[#eef2e9] p-2 rounded-xl">
          <i class="pi pi-box text-[22px] text-[#2b5e3b]"></i>
        </div>
        <span class="text-xs bg-[#e0f2fe] text-[#075985] font-medium px-2 py-1 rounded-full">inventario</span>
      </div>
      <div class="mb-4">
        <h3 class="font-bold text-[#1e3a2f] text-lg">Reporte de Inventario Valorizado</h3>
        <p class="text-gray-500 text-sm mt-1 line-clamp-2">Valor total del inventario disponible según existencias actuales.</p>
      </div>
      <div class="flex gap-2 pt-3 border-t border-[#e2e8dd]">
        <button
          class="text-xs bg-[#2b5e3b] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f482d] transition-all duration-200 flex items-center gap-1 font-medium"
          @click="$emit('ver-inventario-valorizado')"
        >
          <i class="pi pi-eye text-[11px]"></i> Visualizar
        </button>
      </div>
    </div>
        <!-- Tarjeta: Productos Por Vencer -->
    <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
      <div class="flex items-start justify-between mb-3">
        <div class="bg-[#eef2e9] p-2 rounded-xl">
          <i class="pi pi-exclamation-triangle text-[22px] text-[#2b5e3b]"></i>
        </div>
        <span class="text-xs bg-[#e0f2fe] text-[#075985] font-medium px-2 py-1 rounded-full">inventario</span>
      </div>
      <div class="mb-4">
        <h3 class="font-bold text-[#1e3a2f] text-lg">Reporte de Productos Por Vencer</h3>
        <p class="text-gray-500 text-sm mt-1 line-clamp-2">Productos próximos a vencer según su fecha de caducidad.</p>
      </div>
      <div class="flex gap-2 pt-3 border-t border-[#e2e8dd]">
        <button
          class="text-xs bg-[#2b5e3b] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f482d] transition-all duration-200 flex items-center gap-1 font-medium"
          @click="$emit('ver-productos-por-vencer')"
        >
          <i class="pi pi-eye text-[11px]"></i> Visualizar
        </button>
      </div>
    </div>
      <!-- Tarjetas Dinámicas -->
      <div
        v-for="card in cardsSoloDiseno"
        :key="card.titulo"
        class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="bg-[#eef2e9] p-2 rounded-xl">
            <i :class="`pi ${card.icono} text-[22px] text-[#2b5e3b]`"></i>
          </div>
          <span class="text-xs font-medium px-2 py-1 rounded-full" :class="card.tagClass">
            {{ card.tag }}
          </span>
        </div>

        <div class="mb-4">
          <h3 class="font-bold text-[#1e3a2f] text-lg">{{ card.titulo }}</h3>
          <p class="text-gray-500 text-sm mt-1 line-clamp-3">{{ card.descripcion }}</p>
        </div>

        <div class="flex gap-2 pt-3 border-t border-[#e2e8dd]">
          <button
            class="text-xs bg-[#2b5e3b] text-white px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium opacity-50 cursor-not-allowed"
            disabled
          >
            <i class="pi pi-eye text-[11px]"></i> Visualizar
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const emit = defineEmits([
  'ver-ventas',
  'ver-compras-proveedor',
  'ver-resumen-ventas',
  'ver-productos-mas-vendidos',
  'ver-ventas-cajero',
  'ver-ventas-categoria',
  'ver-resumen-comparativo',
  'ver-margen-ganancia',
  'ver-flujo-compras-ventas',
  'ver-inventario-valorizado',
  'ver-productos-por-vencer'
])




const cardsSoloDiseno = [
  {
    titulo: 'Arqueo Caja Reporte',
    icono: 'pi-wallet',
    tag: 'caja',
    tagClass: 'bg-[#e0e7ff] text-[#3730a3]',
    descripcion: 'Cuadre y verificación del efectivo registrado en caja por turno.',
  },
  

]
</script>
