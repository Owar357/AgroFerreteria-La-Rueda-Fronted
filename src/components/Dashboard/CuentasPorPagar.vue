<template>
  <section class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-5 flex flex-col gap-4 min-w-0">
    <header class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-[#1e3a2f] m-0">Cuentas por pagar</h2>
        <p class="text-sm text-[#6b7280] m-0 mt-1">Compras a proveedores con saldo pendiente.</p>
      </div>
      <button
        type="button"
        class="text-sm font-medium text-[#2b5e3b] hover:underline bg-transparent border-none cursor-pointer p-0"
        @click="router.push('/admin/compras-realizadas')"
      >
        Ver compras
      </button>
    </header>

    <div v-if="datos.cantidad > 0" class="cuentas-layout">
      <div class="flex flex-col gap-2">
        <p class="m-0 text-xs text-[#6b7280]">Saldo total por pagar</p>
        <p class="m-0 text-3xl font-bold text-[#1a2e1f]">{{ moneda(datos.saldo_total) }}</p>
        <p class="m-0 text-sm text-[#6b7280]">
          {{ datos.cantidad }} {{ datos.cantidad === 1 ? 'compra pendiente' : 'compras pendientes' }}
        </p>
        <p
          v-if="datos.vencidas > 0"
          class="m-0 inline-flex items-center gap-2 text-sm font-medium text-[#C0392B]"
        >
          <i class="pi pi-exclamation-circle"></i>
          {{ datos.vencidas }} {{ datos.vencidas === 1 ? 'vencida' : 'vencidas' }}
        </p>
      </div>

      <ul class="list-none m-0 p-0 flex flex-col">
        <li
          v-for="compra in datos.proximas"
          :key="compra.id"
          class="flex items-center gap-3 py-3 border-b border-[#eef2e9] last:border-b-0"
        >
          <div class="min-w-0 flex-1">
            <p class="m-0 text-sm font-medium text-[#1a2e1f] truncate">
              {{ compra.proveedor || 'Proveedor sin nombre' }}
            </p>
            <p class="m-0 text-xs text-[#6b7280] truncate">
              {{ compra.numero_documento || 'Sin documento' }}, vence
              {{ fechaCorta(compra.fecha_vencimiento) }}
            </p>
          </div>
          <span
            class="text-xs font-semibold px-2 py-1 rounded-md shrink-0"
            :class="estados[compra.estado_pago]"
          >
            <span class="capitalize">{{ compra.estado_pago.toLowerCase() }}</span>
          </span>
          <span class="text-sm font-semibold text-[#1a2e1f] w-24 text-right shrink-0">
            {{ moneda(compra.saldo) }}
          </span>
        </li>
      </ul>
    </div>

    <div v-else class="py-8 flex flex-col items-center text-center text-[#6b7280] gap-2">
      <i class="pi pi-check-circle text-3xl text-[#4A8C3F]"></i>
      <p class="m-0 text-sm">No tienes compras con saldo pendiente.</p>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { moneda, fechaCorta } from '@/utils/formatters'

defineProps({
  datos: {
    type: Object,
    default: () => ({ saldo_total: 0, cantidad: 0, vencidas: 0, proximas: [] }),
  },
})

const router = useRouter()

const estados = {
  PENDIENTE: 'bg-[#fbf0dc] text-[#9a6410]',
  ABONADO: 'bg-[#e3f1fd] text-[#1769b3]',
  VENCIDO: 'bg-[#f9e5e2] text-[#C0392B]',
}
</script>

<style scoped>
/* No se usa la clase "grid" de Tailwind: tailwind.css la redefine como flex. */
.cuentas-layout {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .cuentas-layout {
    grid-template-columns: 16rem 1fr;
    align-items: start;
  }
}
</style>