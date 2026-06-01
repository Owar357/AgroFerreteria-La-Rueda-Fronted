<template>
  <div class="flex gap-6 p-6" style="font-family: 'Inter', sans-serif; background-color: #eef2e9; min-height: 100vh;">

    <!-- Sidebar filtros (sin cambios importantes) -->
    <div class="bg-white rounded-2xl border border-[#e8efe1] shadow-sm p-5 flex flex-col gap-4 h-fit" style="min-width: 200px;">
      <div>
        <p class="text-sm font-semibold text-[#1a2e1f] mb-3">Filtros</p>
        <span class="text-xs font-semibold px-2 py-1 rounded-full bg-[#fef3c7] text-[#b45309]">{{ sinLeer }} sin leer</span>
      </div>
      <div class="flex flex-col gap-1">
        <button v-for="f in filtros" :key="f.value"
          @click="filtroActivo = f.value"
          :class="['flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-all', filtroActivo === f.value ? 'bg-[#e0b354] text-[#1a2e1f] font-semibold' : 'text-[#4b5563] hover:bg-[#f0f7ee]']"
        >
          <span>{{ f.label }}</span>
          <span :class="['text-xs px-1.5 py-0.5 rounded-full', filtroActivo === f.value ? 'bg-white text-[#1a2e1f]' : 'bg-[#eef2e9] text-[#2b5e3b]']">{{ f.count }}</span>
        </button>
      </div>
      <button
        @click="marcarTodoLeido"
        class="flex items-center gap-2 text-sm text-[#2b5e3b] hover:text-[#1a2e1f] transition-all mt-2"
      >
        <i class="pi pi-check-circle text-sm"></i> Marcar todo como leído
      </button>
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

      <!-- Grupos por tipo -->
      <div v-for="grupo in gruposFiltrados" :key="grupo.tipo" class="flex flex-col gap-3">

        <!-- Header grupo -->
        <div class="flex justify-between items-center px-1">
          <div class="flex items-center gap-2">
            <i :class="['pi text-sm', iconoPorTipo(grupo.tipo)]" :style="{ color: colorIconoPorTipo(grupo.tipo) }"></i>
            <span class="text-xs font-bold text-[#6b7280] uppercase tracking-wider">{{ grupo.tipo }}</span>
          </div>
          <span class="text-xs text-[#9ca3af]">{{ grupo.alertas.length }} alerta(s)</span>
        </div>

        <!-- Tarjetas mejoradas -->
        <div
          v-for="alerta in grupo.alertas"
          :key="alerta.id"
          class="bg-white rounded-2xl border border-[#e8efe1] shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:bg-[#fefcf5]"
          :style="{ opacity: alerta.leida ? 0.7 : 1 }"
        >
          <div class="flex">
            <!-- Línea izquierda de prioridad: más gruesa y con colores vivos -->
            <div class="w-1.5 flex-shrink-0 rounded-l-2xl" :style="{ backgroundColor: colorLinea(alerta.prioridad) }"></div>

            <div class="flex-1 p-4">
              <div class="flex justify-between items-start gap-4 flex-wrap">

                <!-- Info de la alerta -->
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <p class="text-base font-semibold text-[#1a2e1f] m-0">{{ alerta.titulo }}</p>
                    <span v-if="!alerta.leida" class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309]">Nueva</span>
                    <!-- Tag de prioridad opcional (para mayor claridad) -->
                    <span :class="['text-[10px] font-semibold px-2 py-0.5 rounded-full', prioridadTagClass(alerta.prioridad)]">
                      {{ alerta.prioridad }}
                    </span>
                  </div>
                  <p class="text-sm text-[#6b7280] m-0">{{ alerta.descripcion }}</p>
                  <div class="flex items-center gap-4 mt-2">
                    <span class="text-xs text-[#9ca3af] flex items-center gap-1">
                      <i class="pi pi-calendar text-[10px]"></i> {{ alerta.tiempo }}
                    </span>
                  </div>
                </div>

                <!-- Botones de acción (dos botones claros) -->
                <div class="flex gap-2 flex-shrink-0">
                  <!-- Botón "Ver detalles" -->
                  
                  <!-- Botón "Marcar como leída/no leída" -->
                  <button
                    @click="toggleLeida(alerta)"
                    :class="['flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all', alerta.leida ? 'bg-white text-[#6b7280] border-[#dee6d6] hover:bg-[#f5f5f5]' : 'bg-white text-[#2b5e3b] border-[#2b5e3b] hover:bg-[#f0f7ee]']"
                  >
                    <i :class="['pi text-xs', alerta.leida ? 'pi-eye-slash' : 'pi-check']"></i>
                    {{ alerta.leida ? 'Marcar como no leída' : 'Marcar como leída' }}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-if="gruposFiltrados.length === 0" class="text-center py-12 text-gray-400">
        <i class="pi pi-bell-slash text-3xl mb-2 block"></i>
        No hay alertas en esta categoría
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filtroActivo = ref('todas')

const alertas = ref([
  { id: 1, tipo: 'LOTE POR VENCER', prioridad: 'ALTA', leida: false, titulo: 'Fungicida Total - Lote #A-2024', descripcion: 'Vence en 3 días · 45 unidades afectadas', tiempo: 'hace 1h' },
  { id: 2, tipo: 'STOCK MÍNIMO', prioridad: 'MEDIA', leida: false, titulo: 'Maíz Híbrido - Bolsa 1kg', descripcion: 'Solo quedan 5 unidades en bodega', tiempo: 'hace 3h' },
  { id: 3, tipo: 'FACTURA POR VENCER', prioridad: 'ALTA', leida: false, titulo: 'Compra CF-9945 - Fertilizantes del Norte', descripcion: 'Monto: $1,430.00 · Vence mañana', tiempo: 'hace 1d' },
  { id: 4, tipo: 'STOCK AGOTADO', prioridad: 'ALTA', leida: false, titulo: 'Herbicida Total - Saco 25kg', descripcion: 'Sin unidades disponibles en inventario', tiempo: 'hace 2d' },
  { id: 5, tipo: 'STOCK MÍNIMO', prioridad: 'BAJA', leida: true, titulo: 'Fertilizante 20-20-20 - Bolsa 500g', descripcion: 'Solo quedan 12 unidades en bodega', tiempo: 'hace 3d' },
])

const sinLeer = computed(() => alertas.value.filter(a => !a.leida).length)

const tiposUnicos = ['LOTE POR VENCER', 'STOCK MÍNIMO', 'STOCK AGOTADO', 'FACTURA POR VENCER']

const filtros = computed(() => [
  { label: 'Todas', value: 'todas', count: alertas.value.length },
  { label: 'No leídas', value: 'no_leidas', count: sinLeer.value },
  { label: 'Leídas', value: 'leidas', count: alertas.value.filter(a => a.leida).length },
  { label: 'Stock mínimo', value: 'STOCK MÍNIMO', count: alertas.value.filter(a => a.tipo === 'STOCK MÍNIMO').length },
  { label: 'Agotado', value: 'STOCK AGOTADO', count: alertas.value.filter(a => a.tipo === 'STOCK AGOTADO').length },
  { label: 'Lote por vencer', value: 'LOTE POR VENCER', count: alertas.value.filter(a => a.tipo === 'LOTE POR VENCER').length },
  { label: 'Factura', value: 'FACTURA POR VENCER', count: alertas.value.filter(a => a.tipo === 'FACTURA POR VENCER').length },
])

const alertasFiltradas = computed(() => {
  if (filtroActivo.value === 'todas') return alertas.value
  if (filtroActivo.value === 'no_leidas') return alertas.value.filter(a => !a.leida)
  if (filtroActivo.value === 'leidas') return alertas.value.filter(a => a.leida)
  return alertas.value.filter(a => a.tipo === filtroActivo.value)
})

const gruposFiltrados = computed(() => {
  return tiposUnicos
    .map(tipo => ({
      tipo,
      alertas: alertasFiltradas.value.filter(a => a.tipo === tipo)
    }))
    .filter(g => g.alertas.length > 0)
})

const toggleLeida = (alerta) => { alerta.leida = !alerta.leida }
const marcarTodoLeido = () => { alertas.value.forEach(a => a.leida = true) }


// Colores de la línea izquierda (más representativos)
const colorLinea = (prioridad) => {
  if (prioridad === 'ALTA') return '#dc2626'   // rojo intenso
  if (prioridad === 'MEDIA') return '#f59e0b'  // ámbar
  return '#10b981'                             // verde (baja prioridad)
}

// Clase CSS para la etiqueta de prioridad (opcional)
const prioridadTagClass = (prioridad) => {
  if (prioridad === 'ALTA') return 'bg-red-100 text-red-700'
  if (prioridad === 'MEDIA') return 'bg-amber-100 text-amber-700'
  return 'bg-green-100 text-green-700'
}

// Iconos y colores por tipo
const iconoPorTipo = (tipo) => {
  if (tipo === 'STOCK MÍNIMO') return 'pi-exclamation-triangle'
  if (tipo === 'STOCK AGOTADO') return 'pi-times-circle'
  if (tipo === 'LOTE POR VENCER') return 'pi-clock'
  if (tipo === 'FACTURA POR VENCER') return 'pi-file-edit'
  return 'pi-bell'
}

const colorIconoPorTipo = (tipo) => {
  if (tipo === 'STOCK MÍNIMO') return '#e0b354'
  if (tipo === 'STOCK AGOTADO') return '#ef4444'
  if (tipo === 'LOTE POR VENCER') return '#f59e0b'
  if (tipo === 'FACTURA POR VENCER') return '#3b82f6'
  return '#6b7280'
}
</script>