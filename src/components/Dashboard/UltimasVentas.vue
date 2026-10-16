<template>
  <section class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-5 flex flex-col gap-4 min-w-0">
    <header class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-[#1e3a2f] m-0">Últimas ventas</h2>
        <p class="text-sm text-[#6b7280] m-0 mt-1">Las 8 más recientes.</p>
      </div>
      <button
        type="button"
        class="text-sm font-medium text-[#2b5e3b] hover:underline bg-transparent border-none cursor-pointer p-0"
        @click="router.push('/admin/procesos/historial-ventas')"
      >
        Ver historial
      </button>
    </header>

    <ul v-if="ventas.length" class="list-none m-0 p-0 flex flex-col">
      <li
        v-for="venta in ventas"
        :key="venta.id"
        class="flex items-center gap-3 py-3 border-b border-[#eef2e9] last:border-b-0"
      >
        <span
          class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          :class="metodos[venta.tipo_pago]?.clase"
        >
          <i :class="metodos[venta.tipo_pago]?.icono"></i>
        </span>

        <div class="min-w-0 flex-1">
          <p class="m-0 text-sm font-medium text-[#1a2e1f] truncate">
            Venta {{ venta.numero_factura }}
          </p>
          <p class="m-0 text-xs text-[#6b7280] truncate">
            {{ fechaHora(venta.fecha) }}, {{ venta.cajero || 'Sin cajero' }}
          </p>
        </div>

        <div class="text-right shrink-0">
          <p
            class="m-0 text-sm font-semibold"
            :class="venta.estado === 'ANULADA' ? 'text-[#C0392B] line-through' : 'text-[#1a2e1f]'"
          >
            {{ moneda(venta.total) }}
          </p>
          <p v-if="venta.estado === 'ANULADA'" class="m-0 text-xs text-[#C0392B]">Anulada</p>
        </div>
      </li>
    </ul>

    <div v-else class="py-10 flex flex-col items-center text-center text-[#6b7280] gap-2">
      <i class="pi pi-shopping-cart text-3xl text-[#9ca3af]"></i>
      <p class="m-0 text-sm">Todavía no hay ventas registradas.</p>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { moneda, fechaHora } from '@/utils/formatters'

defineProps({
  ventas: { type: Array, default: () => [] },
})

const router = useRouter()

const metodos = {
  EFECTIVO: { icono: 'pi pi-money-bill', clase: 'bg-[#e6f1e2] text-[#4A8C3F]' },
  TARJETA: { icono: 'pi pi-credit-card', clase: 'bg-[#e3f1fd] text-[#2196F3]' },
  TRANSFERENCIA: { icono: 'pi pi-arrow-right-arrow-left', clase: 'bg-[#fbf0dc] text-[#D48A1A]' },
}
</script>