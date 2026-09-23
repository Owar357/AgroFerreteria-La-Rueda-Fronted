<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    :draggable="false"
    :closable="!cargando"
    :style="{ width: '580px' }"
    :pt="{
      root: { class: 'rounded-2xl overflow-hidden border border-[#e2e8dd]' },
      header: { class: 'bg-white border-b border-[#eef2e9] px-6 py-4' },
      content: { class: 'bg-white px-6 py-4 max-h-[75vh] overflow-y-auto' },
      footer: { class: 'bg-white border-t border-[#eef2e9] px-6 py-4' },
    }"
    @hide="onHide"
  >
    <template #header>
      <span class="text-[20px] font-semibold text-[#1a2e1f]">Cierre de Caja - Cuadre Completo</span>
    </template>

    <div class="flex flex-col gap-5 font-['Inter',sans-serif]">

      <!-- Datos del turno -->
      <div class="border border-[#e2e8dd] rounded-xl p-4">
        <div class="flex items-center gap-2 mb-3">
          <i class="pi pi-info-circle text-[#2b5e3b] text-[15px]"></i>
          <span class="text-[12px] font-semibold text-[#2b5e3b] uppercase tracking-wider">Datos del Turno</span>
        </div>
        <div class="grid grid-cols-4 gap-4">
          <div class="flex flex-col gap-1">
            <span class="text-[12px] text-[#6b7280]">Cajero</span>
            <span class="text-[14px] font-semibold text-[#1a2e1f]">{{ datos.nombre_cajero ?? '—' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[12px] text-[#6b7280]">Número de Caja</span>
            <span class="text-[14px] font-semibold text-[#1a2e1f]">{{ datos.numero_caja ?? '—' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[12px] text-[#6b7280]">Fecha/Hora</span>
            <span class="text-[14px] font-semibold text-[#1a2e1f]">{{ datos.fecha_hora ?? '—' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[12px] text-[#6b7280]">Fondo Inicial (Base)</span>
            <span class="text-[14px] font-semibold text-[#2b5e3b]">{{ fmt(datos.monto_inicial) }}</span>
            <span class="text-[11px] text-[#6b7280]">No editable - Valor del sistema</span>
          </div>
        </div>
      </div>

      <!-- Resumen de movimientos -->
      <div class="border border-[#e2e8dd] rounded-xl p-4">
        <div class="flex items-center gap-2 mb-3">
          <i class="pi pi-arrows-h text-[#2b5e3b] text-[15px]"></i>
          <span class="text-[12px] font-semibold text-[#2b5e3b] uppercase tracking-wider">Resumen de Movimientos</span>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-[#f0faf0] border border-[#c3e6c3] rounded-xl p-4">
            <div class="flex items-center gap-1 mb-1">
              <i class="pi pi-arrow-up text-green-600 text-[12px]"></i>
              <span class="text-[12px] text-green-700 font-medium">Entradas Manuales</span>
            </div>
            <span class="text-[22px] font-bold text-green-700">{{ fmt(datos.total_entradas) }}</span>
            <p class="text-[11px] text-green-600 mt-1">Total acumulado de entradas de efectivo</p>
          </div>
          <div class="bg-[#fff5f5] border border-[#fecaca] rounded-xl p-4">
            <div class="flex items-center gap-1 mb-1">
              <i class="pi pi-arrow-down text-red-500 text-[12px]"></i>
              <span class="text-[12px] text-red-600 font-medium">Salidas Manuales</span>
            </div>
            <span class="text-[22px] font-bold text-red-600">{{ fmt(datos.total_salidas) }}</span>
            <p class="text-[11px] text-red-500 mt-1">Total acumulado de retiros o gastos</p>
          </div>
        </div>
      </div>

      <!-- Ventas del sistema -->
      <div class="border border-[#e2e8dd] rounded-xl p-4">
        <div class="flex items-center gap-2 mb-3">
          <i class="pi pi-barcode text-[#2b5e3b] text-[15px]"></i>
          <span class="text-[12px] font-semibold text-[#2b5e3b] uppercase tracking-wider">Registro de Ventas del Sistema</span>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="border border-[#e2e8dd] rounded-xl p-3">
            <span class="text-[12px] text-[#6b7280]">Ventas en Efectivo</span>
            <p class="text-[18px] font-bold text-[#1a2e1f] mt-1">{{ fmt(datos.total_ventas_efectivo) }}</p>
            <span class="text-[11px] text-[#6b7280]">Valor neto de las ventas cobradas en efectivo</span>
          </div>
          <div class="border border-[#e2e8dd] rounded-xl p-3">
            <span class="text-[12px] text-[#6b7280]">Ventas por Tarjeta/Digital</span>
            <p class="text-[18px] font-bold text-[#1a2e1f] mt-1">{{ fmt(ventasDigitales) }}</p>
            <span class="text-[11px] text-[#6b7280]">Tarjeta + transferencias (no entran a la gaveta)</span>
          </div>
          <div class="bg-[#eef2e9] border border-[#c8d8c0] rounded-xl p-3">
            <span class="text-[12px] text-[#4b5563]">Total Esperado en Caja</span>
            <p class="text-[18px] font-bold text-[#2b5e3b] mt-1">{{ fmt(datos.monto_esperado) }}</p>
            <span class="text-[11px] text-[#6b7280]">Fondo inicial + Ventas EF + Entradas - Salidas</span>
          </div>
        </div>
      </div>

      <!-- Validación y diferencias -->
      <div class="border border-[#e2e8dd] rounded-xl p-4">
        <div class="flex items-center gap-2 mb-3">
          <i class="pi pi-balance-scale text-[#2b5e3b] text-[15px]"></i>
          <span class="text-[12px] font-semibold text-[#2b5e3b] uppercase tracking-wider">Validación y Diferencias</span>
        </div>
        <div class="border border-[#e2e8dd] rounded-xl p-4 mb-4">
          <span class="text-[13px] text-[#6b7280]">Diferencia de Efectivo</span>
          <div class="flex items-center gap-3 mt-1">
            <span class="text-[22px] font-bold" :class="diferenciaColor">{{ fmt(datos.diferencia) }}</span>
            <span class="text-[12px] px-2 py-0.5 rounded-full font-semibold" :class="diferenciaTagClass">
              {{ datos.tipo_diferencia }}
            </span>
          </div>
          <span class="text-[12px] text-[#6b7280]">Efectivo Contado ({{ fmt(datos.monto_contado) }}) - Total Esperado</span>
        </div>

        <div v-if="hayDiferencia" class="flex flex-col gap-2">
          <label class="text-[13px] font-medium text-[#1a2e1f]">
            Justificación <span class="text-red-500 text-[12px]">*Obligatorio</span>
          </label>
          <Textarea
            v-model="justificacion"
            placeholder="Explica las diferencias encontradas..."
            :rows="3"
            :maxlength="255"
            class="w-full !text-[13px] !border-[#d1d5db] !rounded-lg resize-none"
            :class="{ '!border-red-500': errorJustificacion }"
          />
          <small v-if="errorJustificacion" class="text-red-500 text-[12px]">{{ errorJustificacion }}</small>
          <small class="text-[12px] text-[#6b7280]">La justificación es obligatoria cuando hay diferencias ({{ justificacion.length }}/255)</small>
        </div>
      </div>

      <!-- Escenario B: día incompleto -->
      <div
        v-if="esEscenarioB"
        class="rounded-xl border border-red-300 bg-red-50 p-4 flex items-start gap-3"
      >
        <i class="pi pi-exclamation-triangle text-red-600 text-[20px] mt-0.5"></i>
        <div class="flex flex-col gap-1">
          <span class="text-[14px] font-semibold text-red-700">Día incompleto: no se puede retirar efectivo</span>
          <span class="text-[13px] text-red-700">
            El efectivo contado ({{ fmt(datos.monto_contado) }}) es menor al fondo fijo de
            {{ fmt(datos.fondo_fijo) }}. El retiro queda bloqueado en $0.00 y todo el dinero
            se queda en la gaveta como fondo del siguiente turno.
          </span>
        </div>
      </div>

      <!-- Destino del dinero -->
      <div class="border border-[#e2e8dd] rounded-xl p-4">
        <div class="flex items-center gap-2 mb-3">
          <i class="pi pi-wallet text-[#2b5e3b] text-[15px]"></i>
          <span class="text-[12px] font-semibold text-[#2b5e3b] uppercase tracking-wider">Destino del Dinero</span>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="border border-[#e2e8dd] rounded-xl p-3" :class="{ 'bg-red-50 border-red-200': esEscenarioB }">
            <span class="text-[12px] text-[#6b7280]">Efectivo a Retirar</span>
            <p class="text-[18px] font-bold mt-1" :class="esEscenarioB ? 'text-red-600' : 'text-[#1a2e1f]'">
              {{ fmt(datos.retiro_efectivo) }}
            </p>
            <span class="text-[11px] text-[#6b7280]">
              {{ esEscenarioB ? 'Bloqueado: el fondo no alcanza la base' : 'Monto a depositar o guardar en caja fuerte' }}
            </span>
          </div>
          <div class="border border-[#e2e8dd] rounded-xl p-3">
            <span class="text-[12px] text-[#6b7280]">Fondo para el Siguiente Turno</span>
            <p class="text-[18px] font-bold text-[#1a2e1f] mt-1">{{ fmt(datos.fondo_siguiente_turno) }}</p>
            <span class="text-[11px] text-[#6b7280]">Monto que queda en la gaveta como base</span>
          </div>
        </div>
      </div>

    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          :disabled="cargando"
          class="!bg-white !border !border-[#d1d5db] !text-[#1a2e1f] !text-[14px] !font-semibold !px-5 !py-2.5 !rounded-lg"
          @click="onCancelar"
        />
        <Button
          label="Confirmar y Cerrar Caja"
          icon="pi pi-check-circle"
          :loading="cargando"
          class="!bg-[#2b5e3b] !border-[#2b5e3b] !text-white !text-[14px] !font-semibold !px-5 !py-2.5 !rounded-lg"
          @click="onConfirmar"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Swal from 'sweetalert2'
import { useCajaStore } from '@/stores/cajaStore'

const props = defineProps({
  visible: { type: Boolean, default: false },
  datos: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:visible', 'cierre-exitoso', 'cancelar'])

const store = useCajaStore()
const localVisible = ref(false)
const justificacion = ref('')
const errorJustificacion = ref('')
const cargando = ref(false)

watch(() => props.visible, (val) => (localVisible.value = val))
watch(localVisible, (val) => emit('update:visible', val))

// Al abrir se limpia la justificación
watch(
  () => props.visible,
  (val) => {
    if (val) {
      justificacion.value = ''
      errorJustificacion.value = ''
    }
  },
)

const fmt = (val) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(parseFloat(val) || 0)

// Tarjeta + transferencia (en centavos para no arrastrar decimales flotantes)
const ventasDigitales = computed(() => {
  const tarjeta = Math.round((parseFloat(props.datos.total_ventas_tarjeta) || 0) * 100)
  const transferencia = Math.round((parseFloat(props.datos.total_ventas_transferencia) || 0) * 100)
  return (tarjeta + transferencia) / 100
})

const hayDiferencia = computed(
  () => !!props.datos.tipo_diferencia && props.datos.tipo_diferencia !== 'CUADRADO',
)

const esEscenarioB = computed(() => props.datos.escenario === 'B')

const diferenciaColor = computed(() => {
  if (!props.datos.tipo_diferencia) return 'text-[#1a2e1f]'
  if (props.datos.tipo_diferencia === 'SOBRANTE') return 'text-green-600'
  if (props.datos.tipo_diferencia === 'FALTANTE') return 'text-red-600'
  return 'text-[#1a2e1f]'
})

const diferenciaTagClass = computed(() => {
  if (!props.datos.tipo_diferencia) return 'bg-gray-100 text-gray-600'
  if (props.datos.tipo_diferencia === 'SOBRANTE') return 'bg-green-100 text-green-700'
  if (props.datos.tipo_diferencia === 'FALTANTE') return 'bg-red-100 text-red-600'
  return 'bg-[#eef2e9] text-[#2b5e3b]'
})

const onHide = () => {
  justificacion.value = ''
  errorJustificacion.value = ''
}

const onCancelar = () => {
  localVisible.value = false
  emit('cancelar')
}

const onConfirmar = async () => {
  if (hayDiferencia.value && !justificacion.value.trim()) {
    errorJustificacion.value = 'La justificación es obligatoria cuando hay diferencias.'
    return
  }

  errorJustificacion.value = ''
  cargando.value = true

  // El monto contado NO se envía: el backend lo toma del token del cuadre
  const resultado = await store.cerrarTurnoVentaCaja({
    token_autorizacion: props.datos.token_autorizacion,
    justificacion: justificacion.value.trim() || null,
  })

  cargando.value = false

  if (resultado.ok) {
    localVisible.value = false

    const retiro = fmt(resultado.data?.retiro_efectivo)
    const fondo = fmt(resultado.data?.fondo_siguiente_turno)

    await Swal.fire({
      icon: 'success',
      title: '¡Caja cerrada!',
      html: `
        <div style="text-align:left; font-size:14px; color:#374151">
          <p style="margin:4px 0;"><strong>Efectivo a retirar:</strong> ${retiro}</p>
          <p style="margin:4px 0;"><strong>Queda en la gaveta (siguiente turno):</strong> ${fondo}</p>
        </div>
      `,
      confirmButtonColor: '#2b5e3b',
      confirmButtonText: 'Aceptar',
    })
    emit('cierre-exitoso')
    return
  }

  // 409: hubo ventas o movimientos después del cuadre. 422 con token_invalido: token vencido.
  // En ambos casos hay que volver al conteo y repetir el cuadre.
  if (resultado.status === 409 || resultado.data?.token_invalido) {
    await Swal.fire({
      icon: 'warning',
      title: 'Repite el cuadre',
      text: resultado.error,
      confirmButtonColor: '#2b5e3b',
    })
    localVisible.value = false
    emit('cancelar')
    return
  }

  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: resultado.error || 'No se pudo cerrar la caja.',
    confirmButtonColor: '#2b5e3b',
  })
}
</script>