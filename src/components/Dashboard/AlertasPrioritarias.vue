<template>
  <section class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-5 flex flex-col gap-4 min-w-0">
    <header class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-[#1e3a2f] m-0">Alertas prioritarias</h2>
        <p class="text-sm text-[#6b7280] m-0 mt-1">Primero las de prioridad alta.</p>
      </div>
      <button
        type="button"
        class="text-sm font-medium text-[#2b5e3b] hover:underline bg-transparent border-none cursor-pointer p-0"
        @click="router.push('/admin/alertas')"
      >
        Ver todas
      </button>
    </header>

    <ul v-if="alertas.length" class="list-none m-0 p-0 flex flex-col">
      <li
        v-for="alerta in alertas"
        :key="alerta.id"
        class="flex items-start gap-3 py-3 border-b border-[#eef2e9] last:border-b-0"
      >
        <span
          class="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
          :class="prioridades[alerta.prioridad]?.punto"
          :title="`Prioridad ${alerta.prioridad.toLowerCase()}`"
        ></span>
        <div class="min-w-0 flex-1">
          <p class="m-0 text-sm text-[#1a2e1f] line-clamp-2">{{ alerta.mensaje }}</p>
          <p class="m-0 text-xs mt-1" :class="prioridades[alerta.prioridad]?.texto">
            <span class="capitalize">{{ alerta.tipo.toLowerCase() }}</span>
          </p>
        </div>
      </li>
    </ul>

    <div v-else class="py-10 flex flex-col items-center text-center text-[#6b7280] gap-2">
      <i class="pi pi-check-circle text-3xl text-[#4A8C3F]"></i>
      <p class="m-0 text-sm">No hay alertas activas. Todo en orden.</p>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  alertas: { type: Array, default: () => [] },
})

const router = useRouter()

const prioridades = {
  ALTA: { punto: 'bg-[#C0392B]', texto: 'text-[#C0392B]' },
  MEDIA: { punto: 'bg-[#D48A1A]', texto: 'text-[#D48A1A]' },
  BAJA: { punto: 'bg-[#2196F3]', texto: 'text-[#2196F3]' },
}
</script>