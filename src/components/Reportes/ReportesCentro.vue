<template>
  <div class="bg-[#eef2e9] min-h-screen p-3 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <!-- ======================================================= -->
    <!-- VISTA MÓVIL / TABLET (< 1024px)                        -->
    <!-- ======================================================= -->
    <div class="block lg:hidden space-y-4">
      
      <!-- Encabezado Móvil -->
      <div class="flex items-center gap-3 mb-4">
        <div class="!w-10 !h-10 rounded-xl bg-white border border-[#e2e8dd] shadow-2xs flex items-center justify-center shrink-0">
          <i class="pi pi-chart-line text-[#2b5e3b] text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[#1a2e1f] leading-tight m-0">
            Centro de Reportes
          </h1>
          <h2 class="text-xs font-semibold text-[#2b5e3b] mt-0.5 m-0 tracking-wide">
            Consulta y descarga información estratégica
          </h2>
        </div>
      </div>

      <!-- Grid de Tarjetas Móvil (1 Columna Full Width) -->
      <div class="grid grid-cols-1 gap-3.5 w-full">

        <!-- Tarjeta 1: Ventas -->
        <div class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs flex flex-col justify-between w-full">
          <div>
            <div class="flex items-start justify-between mb-2.5">
              <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7]">
                <i class="pi pi-shopping-cart text-lg text-[#2b5e3b]"></i>
              </div>
              <span class="text-[10px] bg-[#dff0e0] text-[#2b5e3b] font-bold px-2 py-0.5 rounded-full uppercase">
                finanzas
              </span>
            </div>
            <h3 class="font-bold text-[#1a2e1f] text-base m-0">Ventas</h3>
            <p class="text-gray-500 text-xs mt-1 mb-3 line-clamp-2">
              Resumen general y tendencias de ventas.
            </p>
          </div>
          <div class="pt-2.5 border-t border-[#e2e8dd]">
            <button
              class="w-full text-xs bg-[#2b5e3b] text-white px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow-2xs"
              @click="$emit('ver-ventas')"
            >
              <i class="pi pi-eye text-xs"></i> Visualizar
            </button>
          </div>
        </div>

        <!-- Tarjeta 2: Compra Proveedor -->
        <div class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs flex flex-col justify-between w-full">
          <div>
            <div class="flex items-start justify-between mb-2.5">
              <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7]">
                <i class="pi pi-truck text-lg text-[#2b5e3b]"></i>
              </div>
              <span class="text-[10px] bg-[#dbeafe] text-[#1e40af] font-bold px-2 py-0.5 rounded-full uppercase">
                compras
              </span>
            </div>
            <h3 class="font-bold text-[#1a2e1f] text-base m-0">Compra Proveedor</h3>
            <p class="text-gray-500 text-xs mt-1 mb-3 line-clamp-2">
              Historial de compras realizadas a cada proveedor.
            </p>
          </div>
          <div class="pt-2.5 border-t border-[#e2e8dd]">
            <button
              class="w-full text-xs bg-[#2b5e3b] text-white px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow-2xs"
              @click="$emit('ver-compras-proveedor')"
            >
              <i class="pi pi-eye text-xs"></i> Visualizar
            </button>
          </div>
        </div>

        <!-- Tarjeta 3: Resumen de Ventas -->
        <div class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs flex flex-col justify-between w-full">
          <div>
            <div class="flex items-start justify-between mb-2.5">
              <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7]">
                <i class="pi pi-chart-pie text-lg text-[#2b5e3b]"></i>
              </div>
              <span class="text-[10px] bg-[#dff0e0] text-[#2b5e3b] font-bold px-2 py-0.5 rounded-full uppercase">
                ventas
              </span>
            </div>
            <h3 class="font-bold text-[#1a2e1f] text-base m-0">Resumen de Ventas</h3>
            <p class="text-gray-500 text-xs mt-1 mb-3 line-clamp-2">
              Resumen general del comportamiento de ventas del negocio.
            </p>
          </div>
          <div class="pt-2.5 border-t border-[#e2e8dd]">
            <button
              class="w-full text-xs bg-[#2b5e3b] text-white px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow-2xs"
              @click="$emit('ver-resumen-ventas')"
            >
              <i class="pi pi-eye text-xs"></i> Visualizar
            </button>
          </div>
        </div>

        <!-- Tarjeta 4: Productos Más Vendidos -->
        <div class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs flex flex-col justify-between w-full">
          <div>
            <div class="flex items-start justify-between mb-2.5">
              <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7]">
                <i class="pi pi-star text-lg text-[#2b5e3b]"></i>
              </div>
              <span class="text-[10px] bg-[#fef9c3] text-[#854d0e] font-bold px-2 py-0.5 rounded-full uppercase">
                productos
              </span>
            </div>
            <h3 class="font-bold text-[#1a2e1f] text-base m-0">Productos Más Vendidos</h3>
            <p class="text-gray-500 text-xs mt-1 mb-3 line-clamp-2">
              Ranking de los productos con mayor volumen de ventas.
            </p>
          </div>
          <div class="pt-2.5 border-t border-[#e2e8dd]">
            <button
              class="w-full text-xs bg-[#2b5e3b] text-white px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow-2xs"
              @click="$emit('ver-productos-mas-vendidos')"
            >
              <i class="pi pi-eye text-xs"></i> Visualizar
            </button>
          </div>
        </div>

        <!-- Tarjeta 5: Ventas por Usuario -->
        <div class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs flex flex-col justify-between w-full">
          <div>
            <div class="flex items-start justify-between mb-2.5">
              <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7]">
                <i class="pi pi-user text-lg text-[#2b5e3b]"></i>
              </div>
              <span class="text-[10px] bg-[#dff0e0] text-[#2b5e3b] font-bold px-2 py-0.5 rounded-full uppercase">
                ventas
              </span>
            </div>
            <h3 class="font-bold text-[#1a2e1f] text-base m-0">Ventas por Usuario</h3>
            <p class="text-gray-500 text-xs mt-1 mb-3 line-clamp-2">
              Desempeño de ventas registrado por cada cajero.
            </p>
          </div>
          <div class="pt-2.5 border-t border-[#e2e8dd]">
            <button
              class="w-full text-xs bg-[#2b5e3b] text-white px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow-2xs"
              @click="$emit('ver-ventas-cajero')"
            >
              <i class="pi pi-eye text-xs"></i> Visualizar
            </button>
          </div>
        </div>

        <!-- Tarjeta 6: Ventas por Categoría -->
        <div class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs flex flex-col justify-between w-full">
          <div>
            <div class="flex items-start justify-between mb-2.5">
              <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7]">
                <i class="pi pi-tags text-lg text-[#2b5e3b]"></i>
              </div>
              <span class="text-[10px] bg-[#dff0e0] text-[#2b5e3b] font-bold px-2 py-0.5 rounded-full uppercase">
                ventas
              </span>
            </div>
            <h3 class="font-bold text-[#1a2e1f] text-base m-0">Ventas por Categoría</h3>
            <p class="text-gray-500 text-xs mt-1 mb-3 line-clamp-2">
              Ventas agrupadas por categoría de producto.
            </p>
          </div>
          <div class="pt-2.5 border-t border-[#e2e8dd]">
            <button
              class="w-full text-xs bg-[#2b5e3b] text-white px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow-2xs"
              @click="$emit('ver-ventas-categoria')"
            >
              <i class="pi pi-eye text-xs"></i> Visualizar
            </button>
          </div>
        </div>

        <!-- Tarjeta 7: Resumen Comparativo -->
        <div class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs flex flex-col justify-between w-full">
          <div>
            <div class="flex items-start justify-between mb-2.5">
              <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7]">
                <i class="pi pi-chart-line text-lg text-[#2b5e3b]"></i>
              </div>
              <span class="text-[10px] bg-[#dff0e0] text-[#2b5e3b] font-bold px-2 py-0.5 rounded-full uppercase">
                ventas
              </span>
            </div>
            <h3 class="font-bold text-[#1a2e1f] text-base m-0">Resumen Comparativo</h3>
            <p class="text-gray-500 text-xs mt-1 mb-3 line-clamp-2">
              Comparativa de ventas entre distintos períodos de tiempo.
            </p>
          </div>
          <div class="pt-2.5 border-t border-[#e2e8dd]">
            <button
              class="w-full text-xs bg-[#2b5e3b] text-white px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow-2xs"
              @click="$emit('ver-resumen-comparativo')"
            >
              <i class="pi pi-eye text-xs"></i> Visualizar
            </button>
          </div>
        </div>

        <!-- Tarjeta 8: Margen de Ganancia -->
        <div class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs flex flex-col justify-between w-full">
          <div>
            <div class="flex items-start justify-between mb-2.5">
              <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7]">
                <i class="pi pi-percentage text-lg text-[#2b5e3b]"></i>
              </div>
              <span class="text-[10px] bg-[#dff0e0] text-[#2b5e3b] font-bold px-2 py-0.5 rounded-full uppercase">
                finanzas
              </span>
            </div>
            <h3 class="font-bold text-[#1a2e1f] text-base m-0">Margen de Ganancia</h3>
            <p class="text-gray-500 text-xs mt-1 mb-3 line-clamp-2">
              Análisis de la rentabilidad neta obtenida.
            </p>
          </div>
          <div class="pt-2.5 border-t border-[#e2e8dd]">
            <button
              class="w-full text-xs bg-[#2b5e3b] text-white px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow-2xs"
              @click="$emit('ver-margen-ganancia')"
            >
              <i class="pi pi-eye text-xs"></i> Visualizar
            </button>
          </div>
        </div>

        <!-- Tarjeta 9: Flujo Compras vs Ventas -->
        <div class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs flex flex-col justify-between w-full">
          <div>
            <div class="flex items-start justify-between mb-2.5">
              <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7]">
                <i class="pi pi-arrow-right-arrow-left text-lg text-[#2b5e3b]"></i>
              </div>
              <span class="text-[10px] bg-[#dff0e0] text-[#2b5e3b] font-bold px-2 py-0.5 rounded-full uppercase">
                finanzas
              </span>
            </div>
            <h3 class="font-bold text-[#1a2e1f] text-base m-0">Flujo Compras vs Ventas</h3>
            <p class="text-gray-500 text-xs mt-1 mb-3 line-clamp-2">
              Balance comparativo entre salidas y entradas.
            </p>
          </div>
          <div class="pt-2.5 border-t border-[#e2e8dd]">
            <button
              class="w-full text-xs bg-[#2b5e3b] text-white px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow-2xs"
              @click="$emit('ver-flujo-compras-ventas')"
            >
              <i class="pi pi-eye text-xs"></i> Visualizar
            </button>
          </div>
        </div>

        <!-- Tarjeta 10: Inventario Valorizado -->
        <div class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs flex flex-col justify-between w-full">
          <div>
            <div class="flex items-start justify-between mb-2.5">
              <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7]">
                <i class="pi pi-box text-lg text-[#2b5e3b]"></i>
              </div>
              <span class="text-[10px] bg-[#e0f2fe] text-[#075985] font-bold px-2 py-0.5 rounded-full uppercase">
                inventario
              </span>
            </div>
            <h3 class="font-bold text-[#1a2e1f] text-base m-0">Inventario Valorizado</h3>
            <p class="text-gray-500 text-xs mt-1 mb-3 line-clamp-2">
              Valor total del inventario disponible.
            </p>
          </div>
          <div class="pt-2.5 border-t border-[#e2e8dd]">
            <button
              class="w-full text-xs bg-[#2b5e3b] text-white px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow-2xs"
              @click="$emit('ver-inventario-valorizado')"
            >
              <i class="pi pi-eye text-xs"></i> Visualizar
            </button>
          </div>
        </div>

        <!-- Tarjeta 11: Productos Por Vencer -->
        <div class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs flex flex-col justify-between w-full">
          <div>
            <div class="flex items-start justify-between mb-2.5">
              <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7]">
                <i class="pi pi-exclamation-triangle text-lg text-[#2b5e3b]"></i>
              </div>
              <span class="text-[10px] bg-[#e0f2fe] text-[#075985] font-bold px-2 py-0.5 rounded-full uppercase">
                inventario
              </span>
            </div>
            <h3 class="font-bold text-[#1a2e1f] text-base m-0">Productos Por Vencer</h3>
            <p class="text-gray-500 text-xs mt-1 mb-3 line-clamp-2">
              Productos próximos a vencer según fecha de caducidad.
            </p>
          </div>
          <div class="pt-2.5 border-t border-[#e2e8dd]">
            <button
              class="w-full text-xs bg-[#2b5e3b] text-white px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow-2xs"
              @click="$emit('ver-productos-por-vencer')"
            >
              <i class="pi pi-eye text-xs"></i> Visualizar
            </button>
          </div>
        </div>

        <!-- Tarjetas Dinámicas Solo Diseño Móvil -->
        <div
          v-for="card in cardsSoloDiseno"
          :key="'movil-' + card.titulo"
          class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs flex flex-col justify-between w-full"
        >
          <div>
            <div class="flex items-start justify-between mb-2.5">
              <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7]">
                <i :class="`pi ${card.icono} text-lg text-[#2b5e3b]`"></i>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" :class="card.tagClass">
                {{ card.tag }}
              </span>
            </div>
            <h3 class="font-bold text-[#1a2e1f] text-base m-0">{{ card.titulo }}</h3>
            <p class="text-gray-500 text-xs mt-1 mb-3 line-clamp-2">{{ card.descripcion }}</p>
          </div>
          <div class="pt-2.5 border-t border-[#e2e8dd]">
            <button
              class="w-full text-xs bg-[#2b5e3b] text-white px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold opacity-50 cursor-not-allowed"
              disabled
            >
              <i class="pi pi-eye text-xs"></i> Visualizar
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO / PC (>= 1024px)                      -->
    <!-- ======================================================= -->
    <div class="hidden lg:block space-y-6">
      
      <!-- Encabezado PC -->
      <div class="flex items-center gap-4 mb-8">
        <div class="bg-white p-3 rounded-2xl shadow-sm border border-[#e2e8dd]">
          <i class="pi pi-chart-line text-[28px] text-[#5F6B52]"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e3a2f] tracking-tight m-0">Centro de Reportes</h1>
          <p class="text-gray-500 text-sm mt-1 m-0">Consulta y descarga información estratégica de la agroferretería.</p>
        </div>
      </div>

      <!-- Grid de Tarjetas PC (Tradicional Auto-Fill) -->
      <div class="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-5 items-stretch">

        <!-- Tarjeta 1: Ventas -->
        <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
          <div class="!flex !items-center !justify-between !w-full mb-3">
            <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7] shrink-0">
              <i class="pi pi-shopping-cart text-[20px] text-[#2b5e3b]"></i>
            </div>
            <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider !ml-auto">finanzas</span>
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

        <!-- Tarjeta 2: Compra Proveedor -->
        <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
          <div class="!flex !items-center !justify-between !w-full mb-3">
            <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7] shrink-0">
              <i class="pi pi-truck text-[20px] text-[#2b5e3b]"></i>
            </div>
            <span class="text-xs bg-[#dbeafe] text-[#1e40af] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider !ml-auto">compras</span>
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

        <!-- Tarjeta 3: Resumen de Ventas -->
        <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
          <div class="!flex !items-center !justify-between !w-full mb-3">
            <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7] shrink-0">
              <i class="pi pi-chart-pie text-[20px] text-[#2b5e3b]"></i>
            </div>
            <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider !ml-auto">ventas</span>
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

        <!-- Tarjeta 4: Productos Más Vendidos -->
        <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
          <div class="!flex !items-center !justify-between !w-full mb-3">
            <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7] shrink-0">
              <i class="pi pi-star text-[20px] text-[#2b5e3b]"></i>
            </div>
            <span class="text-xs bg-[#fef9c3] text-[#854d0e] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider !ml-auto">productos</span>
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

        <!-- Tarjeta 5: Ventas por Usuario -->
        <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
          <div class="!flex !items-center !justify-between !w-full mb-3">
            <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7] shrink-0">
              <i class="pi pi-user text-[20px] text-[#2b5e3b]"></i>
            </div>
            <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider !ml-auto">ventas</span>
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

        <!-- Tarjeta 6: Ventas por Categoría -->
        <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
          <div class="!flex !items-center !justify-between !w-full mb-3">
            <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7] shrink-0">
              <i class="pi pi-tags text-[20px] text-[#2b5e3b]"></i>
            </div>
            <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider !ml-auto">ventas</span>
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

        <!-- Tarjeta 7: Resumen Comparativo -->
        <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
          <div class="!flex !items-center !justify-between !w-full mb-3">
            <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7] shrink-0">
              <i class="pi pi-chart-line text-[20px] text-[#2b5e3b]"></i>
            </div>
            <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider !ml-auto">ventas</span>
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

        <!-- Tarjeta 8: Margen de Ganancia -->
        <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
          <div class="!flex !items-center !justify-between !w-full mb-3">
            <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7] shrink-0">
              <i class="pi pi-percentage text-[20px] text-[#2b5e3b]"></i>
            </div>
            <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider !ml-auto">finanzas</span>
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

        <!-- Tarjeta 9: Flujo Compras vs Ventas -->
        <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
          <div class="!flex !items-center !justify-between !w-full mb-3">
            <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7] shrink-0">
              <i class="pi pi-arrow-right-arrow-left text-[20px] text-[#2b5e3b]"></i>
            </div>
            <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider !ml-auto">finanzas</span>
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

        <!-- Tarjeta 10: Inventario Valorizado -->
        <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
          <div class="!flex !items-center !justify-between !w-full mb-3">
            <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7] shrink-0">
              <i class="pi pi-box text-[20px] text-[#2b5e3b]"></i>
            </div>
            <span class="text-xs bg-[#e0f2fe] text-[#075985] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider !ml-auto">inventario</span>
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

        <!-- Tarjeta 11: Productos Por Vencer -->
        <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]">
          <div class="!flex !items-center !justify-between !w-full mb-3">
            <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7] shrink-0">
              <i class="pi pi-exclamation-triangle text-[20px] text-[#2b5e3b]"></i>
            </div>
            <span class="text-xs bg-[#e0f2fe] text-[#075985] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider !ml-auto">inventario</span>
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

        <!-- Tarjetas Dinámicas Solo Diseño PC -->
        <div
          v-for="card in cardsSoloDiseno"
          :key="'pc-' + card.titulo"
          class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 grid grid-rows-[auto_1fr_auto] aspect-square max-w-[320px]"
        >
          <div class="!flex !items-center !justify-between !w-full mb-3">
            <div class="bg-[#f4f7f2] p-2 rounded-xl border border-[#dce4d7] shrink-0">
              <i :class="`pi ${card.icono} text-[20px] text-[#2b5e3b]`"></i>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider !ml-auto" :class="card.tagClass">
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

  </div>
</template>

<script setup>
defineEmits([
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
  'ver-productos-por-vencer',
  'ver-arqueo-caja'
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