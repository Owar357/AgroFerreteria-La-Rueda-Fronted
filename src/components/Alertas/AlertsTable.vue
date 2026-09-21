<template>
  <div class="flex gap-6 p-6" style="font-family: 'Inter', sans-serif; background-color: #eef2e9; min-height: 100vh;">

    <!-- Sidebar filtros -->
    <div class="bg-white rounded-2xl border border-[#e8efe1] shadow-sm p-5 flex flex-col gap-4 h-fit"
      style="min-width: 200px;">
      <div>
        <p class="text-sm font-semibold text-[#1a2e1f] mb-3">Filtros</p>
        <span class="text-xs font-semibold px-2 py-1 rounded-full bg-[#fef3c7] text-[#b45309]">{{ sinLeer }} sin
          leer</span>
      </div>
      <div class="flex flex-col gap-1">
        <button v-for="f in filtros" :key="f.value" @click="filtroActivo = f.value"
          :class="['flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-all', filtroActivo === f.value ? 'bg-[#e0b354] text-[#1a2e1f] font-semibold' : 'text-[#4b5563] hover:bg-[#f0f7ee]']">
          <span>{{ f.label }}</span>
          <span
            :class="['text-xs px-1.5 py-0.5 rounded-full', filtroActivo === f.value ? 'bg-white text-[#1a2e1f]' : 'bg-[#eef2e9] text-[#2b5e3b]']">{{
              f.count }}</span>
        </button>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col gap-5">

      <!-- Header -->
      <div class="flex items-center gap-3">
        <i class="pi pi-bell text-[#e0b354] text-2xl"></i>
        <div>
          <h1 class="text-xl font-semibold text-[#1a2e1f] m-0">Centro de Alertas</h1>
          <span class="text-sm text-[#6b7280]">Gestión de notificaciones y eventos críticos</span>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="cargando && alertas.length === 0" class="text-center py-12 text-gray-400">
        <i class="pi pi-spin pi-spinner text-3xl mb-2 block"></i>
        Cargando alertas...
      </div>

      <!-- Estado de error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
        {{ error }}
      </div>

      <template v-else>

        <div v-for="grupoPrioridad in gruposPorPrioridad" :key="grupoPrioridad.prioridad" class="flex flex-col gap-3">

          <!-- Header -->
          <div class="flex justify-between items-center px-1">
            <div class="flex items-center gap-2">
              <i :class="['pi text-sm', prioridadIcono(grupoPrioridad.prioridad)]"
                :style="{ color: prioridadColor(grupoPrioridad.prioridad) }"></i>
              <span class="text-xs font-bold text-[#6b7280] uppercase tracking-wider">{{ grupoPrioridad.prioridad
              }}</span>
              <span class="text-xs text-[#9ca3af]">({{ grupoPrioridad.alertas.length }})</span>
            </div>
          </div>

          <!-- Tarjetas de alerta -->
          <div v-for="alerta in grupoPrioridad.alertas" :key="alerta.id"
            class="bg-white rounded-2xl border border-[#e8efe1] shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:bg-[#fefcf5]"
            :style="{ opacity: alerta.leida ? 0.6 : 1 }">
            <div class="flex">
              <!-- Línea de prioridad -->
              <div class="w-1.5 flex-shrink-0 rounded-l-2xl"
                :style="{ backgroundColor: prioridadLineaColor(alerta.prioridad) }"></div>

              <div class="flex-1 p-4">
                <div class="flex justify-between items-start gap-4 flex-wrap">

                  <!-- Info de la alerta -->
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <!-- Tipo de alerta (etiqueta) -->
                      <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        :class="tipoTagClass(alerta.tipo)">
                        {{ formatearTipo(alerta.tipo) }}
                      </span>
                      <!-- Badge "Nueva" -->
                      <span v-if="!alerta.leida"
                        class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309]">Nueva</span>
                      <!-- Prioridad (opcional) -->
                      <span
                        :class="['text-[10px] font-semibold px-2 py-0.5 rounded-full', prioridadTagClass(alerta.prioridad)]">
                        {{ alerta.prioridad }}
                      </span>
                    </div>

                    <p class="text-sm text-[#1a2e1f] font-medium m-0">{{ alerta.mensaje }}</p>

                    <!-- Metadatos adicionales (según el tipo) -->
                    <div class="flex items-center gap-4 mt-2 text-xs text-[#6b7280]">
                      <span v-if="alerta.compra_id" class="flex items-center gap-1">
                        <i class="pi pi-shopping-cart text-[10px]"></i> Compra #{{ alerta.compra_id }}
                      </span>
                      <span v-if="alerta.lote_id" class="flex items-center gap-1">
                        <i class="pi pi-box text-[10px]"></i> Lote #{{ alerta.lote_id }}
                      </span>
                      <span v-if="alerta.producto_id" class="flex items-center gap-1">
                        <i class="pi pi-tag text-[10px]"></i> Producto #{{ alerta.producto_id }}
                      </span>
                      <span class="flex items-center gap-1">
                        <i class="pi pi-calendar text-[10px]"></i> {{ formatearTiempo(alerta.created_at) }}
                      </span>
                    </div>

                    <p v-if="esReNotificable(alerta.tipo)" class="text-[10px] text-[#9ca3af] italic mt-1">
                      <i class="pi pi-info-circle text-[9px] mr-0.5"></i>
                      Se notificará de nuevo si el problema persiste
                    </p>
                  </div>

                  <!-- Botón de acción -->
                  <div class="flex gap-2 flex-shrink-0">
                    <button v-if="!alerta.leida || puedeDesmarcar(alerta.tipo)" @click="manejarToggleLeida(alerta)"
                      :disabled="procesandoId === alerta.id"
                      :class="['flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50', alerta.leida ? 'bg-white text-[#6b7280] border-[#dee6d6] hover:bg-[#f5f5f5]' : 'bg-white text-[#2b5e3b] border-[#2b5e3b] hover:bg-[#f0f7ee]']">
                      <i
                        :class="['pi text-xs', procesandoId === alerta.id ? 'pi-spin pi-spinner' : (alerta.leida ? 'pi-eye-slash' : 'pi-check')]"></i>
                      {{ alerta.leida ? 'Marcar como no leída' : 'Marcar como leída' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div v-if="alertasFiltradas.length === 0" class="text-center py-12 text-gray-400">
          <i class="pi pi-bell-slash text-3xl mb-2 block"></i>
          No hay alertas en esta categoría
        </div>
      </template>

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

// Funciones de formato y estilos
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