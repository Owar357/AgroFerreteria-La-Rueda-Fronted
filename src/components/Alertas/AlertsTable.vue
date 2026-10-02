<template>
  <div class="bg-[#eef2e9] min-h-screen p-3 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <!-- ======================================================= -->
    <!-- VISTA MÓVIL / TABLET (< 1024px)                        -->
    <!-- ======================================================= -->
    <div class="block lg:hidden space-y-4">

      <!-- Encabezado Móvil -->
      <div class="flex items-center gap-3">
        <div class="!!w-10 !h-10 rounded-4xl p-2 bg-white border border-[#e2e8dd] shadow-2xs flex items-center justify-center shrink-0">
          <i class="pi pi-bell text-[#2b5e3b] text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[#1a2e1f] leading-tight m-0">
            Centro de Alertas
          </h1>
          <p class="text-xs text-gray-500 mt-0.5 m-0">
            Notificaciones y eventos críticos ({{ sinLeer }} sin leer)
          </p>
        </div>
      </div>

      <!-- Filtros Horizontales Móvil (Scrollable) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="f in filtros"
          :key="'movil-' + f.value"
          @click="filtroActivo = f.value"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer',
            filtroActivo === f.value
              ? 'bg-[#2b5e3b] text-white border-[#2b5e3b] shadow-2xs'
              : 'bg-white text-[#1a2e1f] border-[#e2e8dd]'
          ]"
        >
          <span>{{ f.label }}</span>
          <span
            :class="[
              'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
              filtroActivo === f.value ? 'bg-white/20 text-white' : 'bg-[#eef2e9] text-[#2b5e3b]'
            ]"
          >
            {{ f.count }}
          </span>
        </button>
      </div>

      <!-- Estado de carga Móvil -->
      <div v-if="cargando && alertas.length === 0" class="text-center py-8 text-gray-400">
        <i class="pi pi-spin pi-spinner text-2xl mb-2 block"></i>
        <span class="text-xs">Cargando alertas...</span>
      </div>

      <!-- Estado de error Móvil -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
        {{ error }}
      </div>

      <!-- Contenido Alertas Móvil -->
      <template v-else>
        <div v-for="grupoPrioridad in gruposPorPrioridad" :key="'movil-' + grupoPrioridad.prioridad" class="space-y-2.5">
          <div class="flex items-center gap-2 px-1">
            <i :class="['pi text-xs', prioridadIcono(grupoPrioridad.prioridad)]" :style="{ color: prioridadColor(grupoPrioridad.prioridad) }"></i>
            <span class="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">{{ grupoPrioridad.prioridad }}</span>
            <span class="text-[11px] text-[#9ca3af]">({{ grupoPrioridad.alertas.length }})</span>
          </div>

          <div
            v-for="alerta in grupoPrioridad.alertas"
            :key="'movil-' + alerta.id"
            class="bg-white rounded-2xl border border-[#e2e8dd] shadow-2xs overflow-hidden"
            :style="{ opacity: alerta.leida ? 0.6 : 1 }"
          >
            <div class="flex">
              <div class="w-1.5 shrink-0" :style="{ backgroundColor: prioridadLineaColor(alerta.prioridad) }"></div>
              <div class="flex-1 p-3.5 space-y-2">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-[9px] font-bold px-2 py-0.5 rounded-full" :class="tipoTagClass(alerta.tipo)">
                    {{ formatearTipo(alerta.tipo) }}
                  </span>
                  <span v-if="!alerta.leida" class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309]">Nueva</span>
                  <span :class="['text-[9px] font-bold px-2 py-0.5 rounded-full', prioridadTagClass(alerta.prioridad)]">
                    {{ alerta.prioridad }}
                  </span>
                </div>

                <p class="text-xs text-[#1a2e1f] font-semibold m-0 leading-snug">{{ alerta.mensaje }}</p>

                <div class="flex items-center gap-3 text-[10px] text-gray-500 font-mono flex-wrap">
                  <span v-if="alerta.compra_id" class="flex items-center gap-1"><i class="pi pi-shopping-cart text-[9px]"></i> #{{ alerta.compra_id }}</span>
                  <span v-if="alerta.lote_id" class="flex items-center gap-1"><i class="pi pi-box text-[9px]"></i> #{{ alerta.lote_id }}</span>
                  <span v-if="alerta.producto_id" class="flex items-center gap-1"><i class="pi pi-tag text-[9px]"></i> #{{ alerta.producto_id }}</span>
                  <span class="flex items-center gap-1"><i class="pi pi-calendar text-[9px]"></i> {{ formatearTiempo(alerta.created_at) }}</span>
                </div>

                <div class="pt-2 border-t border-[#f1f5f0] flex justify-end">
                  <button
                    v-if="!alerta.leida || puedeDesmarcar(alerta.tipo)"
                    @click="manejarToggleLeida(alerta)"
                    :disabled="procesandoId === alerta.id"
                    :class="[
                      'w-full flex items-center justify-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border cursor-pointer transition-all disabled:opacity-50',
                      alerta.leida ? 'bg-white text-gray-600 border-[#e2e8dd]' : 'bg-white text-[#2b5e3b] border-[#2b5e3b]'
                    ]"
                  >
                    <i :class="['pi text-xs', procesandoId === alerta.id ? 'pi-spin pi-spinner' : (alerta.leida ? 'pi-eye-slash' : 'pi-check')]"></i>
                    {{ alerta.leida ? 'Marcar no leída' : 'Marcar leída' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="alertasFiltradas.length === 0" class="text-center py-8 text-gray-400">
          <i class="pi pi-bell-slash text-2xl mb-2 block opacity-40"></i>
          <span class="text-xs font-medium">No hay alertas en esta categoría</span>
        </div>
      </template>

    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO / PC (>= 1024px)                      -->
    <!-- ======================================================= -->
    <div class="hidden lg:flex gap-6">

      <!-- Sidebar Filtros PC -->
      <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-2xs p-5 flex flex-col gap-4 shrink-0 w-64 h-fit">
        <div>
          <p class="text-sm font-bold text-[#1a2e1f] mb-2 m-0">Filtros</p>
          <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#fef3c7] text-[#b45309]">
            {{ sinLeer }} sin leer
          </span>
        </div>
        <div class="flex flex-col gap-1">
          <button
            v-for="f in filtros"
            :key="'pc-' + f.value"
            @click="filtroActivo = f.value"
            :class="[
              'flex justify-between items-center px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none',
              filtroActivo === f.value ? 'bg-[#2b5e3b] text-white' : 'text-gray-600 hover:bg-[#f4f7f2]'
            ]"
          >
            <span>{{ f.label }}</span>
            <span
              :class="[
                'text-[10px] px-2 py-0.5 rounded-full font-mono',
                filtroActivo === f.value ? 'bg-white/20 text-white' : 'bg-[#eef2e9] text-[#2b5e3b]'
              ]"
            >
              {{ f.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Contenido Principal PC -->
      <div class="flex-1 flex flex-col gap-5">

        <!-- Encabezado PC -->
        <div class="flex items-center gap-3">
          <div class="!w-11 !h-11 rounded-xl bg-white border border-[#e2e8dd] shadow-sm flex items-center justify-center shrink-0">
            <i class="pi pi-bell text-[#2b5e3b] text-xl"></i>
          </div>
          <div>
            <h1 class="text-[2rem] font-bold text-[#1a2e1f] leading-tight m-0">
              Centro de Alertas
            </h1>
            <p class="text-sm text-gray-500 mt-0.5 m-0">
              Gestión de notificaciones y eventos críticos del sistema
            </p>
          </div>
        </div>

        <!-- Estado de carga PC -->
        <div v-if="cargando && alertas.length === 0" class="text-center py-12 text-gray-400">
          <i class="pi pi-spin pi-spinner text-3xl mb-2 block"></i>
          <span class="text-sm font-medium">Cargando alertas...</span>
        </div>

        <!-- Estado de error PC -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
          {{ error }}
        </div>

        <!-- Lista Alertas PC -->
        <template v-else>
          <div v-for="grupoPrioridad in gruposPorPrioridad" :key="'pc-' + grupoPrioridad.prioridad" class="flex flex-col gap-3">

            <div class="flex justify-between items-center px-1">
              <div class="flex items-center gap-2">
                <i :class="['pi text-sm', prioridadIcono(grupoPrioridad.prioridad)]" :style="{ color: prioridadColor(grupoPrioridad.prioridad) }"></i>
                <span class="text-xs font-bold text-[#6b7280] uppercase tracking-wider">{{ grupoPrioridad.prioridad }}</span>
                <span class="text-xs text-[#9ca3af]">({{ grupoPrioridad.alertas.length }})</span>
              </div>
            </div>

            <div
              v-for="alerta in grupoPrioridad.alertas"
              :key="'pc-' + alerta.id"
              class="bg-white rounded-2xl border border-[#e2e8dd] shadow-2xs overflow-hidden transition-all duration-200 hover:shadow-md"
              :style="{ opacity: alerta.leida ? 0.6 : 1 }"
            >
              <div class="flex">
                <div class="w-1.5 shrink-0" :style="{ backgroundColor: prioridadLineaColor(alerta.prioridad) }"></div>

                <div class="flex-1 p-4">
                  <div class="flex justify-between items-start gap-4 flex-wrap">

                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase" :class="tipoTagClass(alerta.tipo)">
                          {{ formatearTipo(alerta.tipo) }}
                        </span>
                        <span v-if="!alerta.leida" class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309]">Nueva</span>
                        <span :class="['text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase', prioridadTagClass(alerta.prioridad)]">
                          {{ alerta.prioridad }}
                        </span>
                      </div>

                      <p class="text-sm text-[#1a2e1f] font-semibold m-0 leading-snug">{{ alerta.mensaje }}</p>

                      <div class="flex items-center gap-4 mt-2 text-xs text-gray-500 font-mono">
                        <span v-if="alerta.compra_id" class="flex items-center gap-1"><i class="pi pi-shopping-cart text-[10px]"></i> Compra #{{ alerta.compra_id }}</span>
                        <span v-if="alerta.lote_id" class="flex items-center gap-1"><i class="pi pi-box text-[10px]"></i> Lote #{{ alerta.lote_id }}</span>
                        <span v-if="alerta.producto_id" class="flex items-center gap-1"><i class="pi pi-tag text-[10px]"></i> Producto #{{ alerta.producto_id }}</span>
                        <span class="flex items-center gap-1"><i class="pi pi-calendar text-[10px]"></i> {{ formatearTiempo(alerta.created_at) }}</span>
                      </div>

                      <p v-if="esReNotificable(alerta.tipo)" class="text-[10px] text-gray-400 italic mt-1 m-0">
                        <i class="pi pi-info-circle text-[9px] mr-0.5"></i>
                        Se notificará de nuevo si el problema persiste
                      </p>
                    </div>

                    <div class="flex gap-2 shrink-0">
                      <button
                        v-if="!alerta.leida || puedeDesmarcar(alerta.tipo)"
                        @click="manejarToggleLeida(alerta)"
                        :disabled="procesandoId === alerta.id"
                        :class="[
                          'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer disabled:opacity-50',
                          alerta.leida ? 'bg-white text-gray-600 border-[#e2e8dd] hover:bg-gray-50' : 'bg-white text-[#2b5e3b] border-[#2b5e3b] hover:bg-[#f4f7f2]'
                        ]"
                      >
                        <i :class="['pi text-xs', procesandoId === alerta.id ? 'pi-spin pi-spinner' : (alerta.leida ? 'pi-eye-slash' : 'pi-check')]"></i>
                        {{ alerta.leida ? 'Marcar como no leída' : 'Marcar como leída' }}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>

          <div v-if="alertasFiltradas.length === 0" class="text-center py-12 text-gray-400">
            <i class="pi pi-bell-slash text-3xl mb-2 block opacity-40"></i>
            <span class="text-sm font-medium">No hay alertas en esta categoría</span>
          </div>
        </template>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAlertaStore } from '@/stores/alertaStore'

const alertaStore = useAlertaStore()
const { alertas, cargando, error } = storeToRefs(alertaStore)

const filtroActivo = ref('todas')
const procesandoId = ref(null)

onMounted(() => {
  alertaStore.fetchAlertas()
})

const sinLeer = computed(() => alertas.value.filter(a => !a.leida).length)

const puedeDesmarcar = (tipo) => !['STOCK MINIMO', 'STOCK AGOTADO'].includes(tipo)

const tiposUnicos = [
  'COMPRA PENDIENTE DE PAGO',
  'COMPRA VENCIDA',
  'LOTE POR VENCER',
  'LOTE VENCIDO',
  'STOCK MINIMO',
  'STOCK AGOTADO',
]

const filtros = computed(() => [
  { label: 'Todas', value: 'todas', count: alertas.value.length },
  { label: 'No leídas', value: 'no_leidas', count: sinLeer.value },
  { label: 'Leídas', value: 'leidas', count: alertas.value.filter(a => a.leida).length },
  ...tiposUnicos.map(tipo => ({
    label: formatearTipo(tipo),
    value: tipo,
    count: alertas.value.filter(a => a.tipo === tipo).length,
  })),
])

const alertasFiltradas = computed(() => {
  if (filtroActivo.value === 'todas') return alertas.value
  if (filtroActivo.value === 'no_leidas') return alertas.value.filter(a => !a.leida)
  if (filtroActivo.value === 'leidas') return alertas.value.filter(a => a.leida)
  return alertas.value.filter(a => a.tipo === filtroActivo.value)
})

const gruposPorPrioridad = computed(() => {
  const prioridades = ['ALTA', 'MEDIA']
  return prioridades
    .map((prioridad) => {
      const alertasGrupo = alertasFiltradas.value
        .filter((a) => a.prioridad === prioridad)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      return { prioridad, alertas: alertasGrupo }
    })
    .filter((g) => g.alertas.length > 0)
})

const manejarToggleLeida = async (alerta) => {
  procesandoId.value = alerta.id
  try {
    await alertaStore.toggleLeida(alerta.id)
  } catch (err) {
    console.error('No se pudo actualizar la alerta:', err)
  } finally {
    procesandoId.value = null
  }
}

const formatearTiempo = (fechaISO) => {
  if (!fechaISO) return ''
  const ahora = new Date()
  const fecha = new Date(fechaISO)
  const segundos = Math.floor((ahora - fecha) / 1000)

  if (segundos < 60) return 'hace un momento'
  const minutos = Math.floor(segundos / 60)
  if (minutos < 60) return `hace ${minutos}min`
  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `hace ${horas}h`
  const dias = Math.floor(horas / 24)
  return `hace ${dias}d`
}

function formatearTipo(tipo) {
  const map = {
    'COMPRA PENDIENTE DE PAGO': 'Compra pendiente',
    'COMPRA VENCIDA': 'Compra vencida',
    'LOTE POR VENCER': 'Lote por vencer',
    'LOTE VENCIDO': 'Lote vencido',
    'STOCK MINIMO': 'Stock mínimo',
    'STOCK AGOTADO': 'Stock agotado',
  }
  return map[tipo] || tipo
}

const tipoTagClass = (tipo) => {
  const map = {
    'COMPRA PENDIENTE DE PAGO': 'bg-blue-100 text-blue-700',
    'COMPRA VENCIDA': 'bg-red-100 text-red-700',
    'LOTE POR VENCER': 'bg-amber-100 text-amber-700',
    'LOTE VENCIDO': 'bg-red-100 text-red-700',
    'STOCK MINIMO': 'bg-yellow-100 text-yellow-700',
    'STOCK AGOTADO': 'bg-red-100 text-red-700',
  }
  return map[tipo] || 'bg-gray-100 text-gray-700'
}

const esReNotificable = (tipo) => ['STOCK MINIMO', 'STOCK AGOTADO'].includes(tipo)

const prioridadTagClass = (prioridad) => {
  if (prioridad === 'ALTA') return 'bg-red-100 text-red-700'
  if (prioridad === 'MEDIA') return 'bg-amber-100 text-amber-700'
  return 'bg-gray-100 text-gray-700'
}

const prioridadLineaColor = (prioridad) => {
  if (prioridad === 'ALTA') return '#dc2626'
  if (prioridad === 'MEDIA') return '#f59e0b'
  return '#10b981'
}

const prioridadIcono = (prioridad) => {
  if (prioridad === 'ALTA') return 'pi-exclamation-circle'
  if (prioridad === 'MEDIA') return 'pi-info-circle'
  return 'pi-circle'
}

const prioridadColor = (prioridad) => {
  if (prioridad === 'ALTA') return '#dc2626'
  if (prioridad === 'MEDIA') return '#f59e0b'
  return '#10b981'
}
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>