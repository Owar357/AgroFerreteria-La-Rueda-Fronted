<template>
  <section class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-5 flex flex-col gap-4 min-w-0">
    <header>
      <h2 class="text-lg font-semibold text-[#1e3a2f] m-0">Productos más vendidos</h2>
      <p class="text-sm text-[#6b7280] m-0 mt-1">Por monto vendido en el mes actual.</p>
    </header>

    <ul v-if="productos.length" class="list-none m-0 p-0 flex flex-col gap-4">
      <li v-for="(p, i) in productos" :key="p.producto" class="flex flex-col gap-1.5">
        <div class="flex items-baseline justify-between gap-3">
          <span class="text-sm font-medium text-[#1a2e1f] truncate" :title="p.producto">
            {{ i + 1 }}. {{ p.producto }}
          </span>
          <span class="text-sm font-semibold text-[#1a2e1f] shrink-0">{{ moneda(p.monto) }}</span>
        </div>
        <div class="h-2 rounded-full bg-[#eef2e9] overflow-hidden">
          <div
            class="h-full rounded-full bg-[#4A8C3F]"
            :style="{ width: `${porcentajeDe(p.monto)}%` }"
          ></div>
        </div>
        <span class="text-xs text-[#6b7280]">
          {{ p.ventas }} {{ p.ventas === 1 ? 'venta' : 'ventas' }}
        </span>
      </li>
    </ul>

    <div v-else class="py-10 flex flex-col items-center text-center text-[#6b7280] gap-2">
      <i class="pi pi-tag text-3xl text-[#9ca3af]"></i>
      <p class="m-0 text-sm">Aún no hay productos vendidos este mes.</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { moneda } from '@/utils/formatters'

const props = defineProps({
  productos: { type: Array, default: () => [] },
})

const maximo = computed(() => Math.max(...props.productos.map((p) => p.monto), 0))

const porcentajeDe = (monto) => (maximo.value > 0 ? Math.max((monto / maximo.value) * 100, 3) : 0)
</script>