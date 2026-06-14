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

    <!-- Grid de cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

      <!-- CARD VENTAS — funcional -->
      <div class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer">
        <div class="flex items-start justify-between mb-3">
          <div class="bg-[#eef2e9] p-2 rounded-xl">
            <i class="pi pi-shopping-cart text-[22px] text-[#2b5e3b]"></i>
          </div>
          <span class="text-xs bg-[#dff0e0] text-[#2b5e3b] font-medium px-2 py-1 rounded-full">finanzas</span>
        </div>
        <h3 class="font-bold text-[#1e3a2f] text-lg">Ventas</h3>
        <p class="text-gray-500 text-sm mt-1">Resumen general y tendencias de ventas.</p>
        <div class="flex gap-2 mt-4 pt-3 border-t border-[#e2e8dd]">
          <button
            class="text-xs bg-[#2b5e3b] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f482d] transition-all duration-200 flex items-center gap-1 font-medium"
            @click="$emit('ver-ventas')"
          >
            <i class="pi pi-eye text-[11px]"></i> Visualizar
          </button>
        </div>
      </div>

      <!-- CARDS SOLO DISEÑO -->
      <div
        v-for="card in cardsSoloDiseno"
        :key="card.titulo"
        class="bg-white rounded-2xl p-5 border border-[#e2e8dd] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="bg-[#eef2e9] p-2 rounded-xl">
            <i :class="`pi ${card.icono} text-[22px] text-[#2b5e3b]`"></i>
          </div>
          <span class="text-xs font-medium px-2 py-1 rounded-full" :class="card.tagClass">
            {{ card.tag }}
          </span>
        </div>
        <h3 class="font-bold text-[#1e3a2f] text-lg">{{ card.titulo }}</h3>
        <p class="text-gray-500 text-sm mt-1">{{ card.descripcion }}</p>
        <div class="flex gap-2 mt-4 pt-3 border-t border-[#e2e8dd]">
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
const emit = defineEmits(['ver-ventas'])

const cardsSoloDiseno = [
  {
    titulo: 'Ventas por período',
    icono: 'pi-calendar',
    tag: 'ventas',
    tagClass: 'bg-[#dff0e0] text-[#2b5e3b]',
    descripcion: 'Comparativa de ventas entre fechas.',
  },
  {
    titulo: 'Productos más vendidos',
    icono: 'pi-star',
    tag: 'productos',
    tagClass: 'bg-[#fef9c3] text-[#854d0e]',
    descripcion: 'Top productos del período seleccionado.',
  },
  {
    titulo: 'Compras por proveedor',
    icono: 'pi-truck',
    tag: 'compras',
    tagClass: 'bg-[#dbeafe] text-[#1e40af]',
    descripcion: 'Análisis de abastecimiento por proveedor.',
  },
  {
    titulo: 'Productos menos vendidos',
    icono: 'pi-arrow-down',
    tag: 'productos',
    tagClass: 'bg-[#fef9c3] text-[#854d0e]',
    descripcion: 'Productos con menor rotación en el período.',
  },
  {
    titulo: 'Ganancias por período',
    icono: 'pi-chart-bar',
    tag: 'finanzas',
    tagClass: 'bg-[#dff0e0] text-[#2b5e3b]',
    descripcion: 'Rentabilidad neta del período seleccionado.',
  },
]
</script>