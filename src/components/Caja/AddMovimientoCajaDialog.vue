<template>
  <Dialog
    v-model:visible="visibleLocal"
    modal
    :header="esEntrada ? 'REGISTRAR INGRESO A CAJA' : 'REGISTRAR SALIDA DE CAJA'"
    :draggable="false"
    :closable="false"
    :style="{ width: 'min(calc(100vw - 2rem), 34rem)' }"
    class="custom-dialog"
    :pt="{ root: { class: '!rounded-2xl overflow-hidden shadow-2xl' } }"
    @hide="cerrarDialog"
  >
    <!-- ======================================================= -->
    <!-- VISTA MÓVIL (< 640px)                                   -->
    <!-- ======================================================= -->
    <div class="block sm:hidden bg-white p-4 text-[#1a2e1f] space-y-4 font-['Inter',sans-serif]">
      
      <!-- Selector Entrada/Salida -->
      <div class="flex w-full rounded-xl overflow-hidden border border-[#dee6d6]">
        <button
          @click="tipoMovimiento = 'ENTRADA'"
          :class="[
            'flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer',
            tipoMovimiento === 'ENTRADA' ? 'bg-[#2b5e3b] text-white' : 'bg-white text-[#6d8f60]',
          ]"
        >
          <i class="pi pi-arrow-up mr-1 text-xs"></i> ENTRADA
        </button>
        <button
          @click="tipoMovimiento = 'SALIDA'"
          :class="[
            'flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer',
            tipoMovimiento === 'SALIDA' ? 'bg-red-600 text-white' : 'bg-white text-[#6d8f60]',
          ]"
        >
          <i class="pi pi-arrow-down mr-1 text-xs"></i> SALIDA
        </button>
      </div>

      <p class="text-[11px] text-[#6d8f60]">
        <i class="pi pi-question-circle mr-1"></i>
        {{
          tipoMovimiento === 'ENTRADA'
            ? 'Dinero que INGRESA a la caja (depósitos, más dinero para cambio).'
            : 'Dinero que SALE de la caja (pagos a proveedores, gastos menores).'
        }}
      </p>

      <!-- Saldo retirable para salidas -->
      <div
        v-if="tipoMovimiento === 'SALIDA'"
        class="flex items-center gap-2 rounded-xl bg-[#f2f5ef] border border-[#e2e8dd] px-3 py-2"
      >
        <i class="pi pi-info-circle text-[#2b5e3b] text-xs"></i>
        <span class="text-[11px] text-[#1e3a2f]">
          Disponible para retiro: <strong>${{ formatearMoneda(saldoRetirable) }}</strong> (Fondo fijo protegido:${{ formatearMoneda(fondoFijo) }}).
        </span>
      </div>

      <!-- Monto -->
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-[#1a2e1f]">Monto</label>
        <InputNumber
          v-model="monto"
          mode="currency"
          currency="USD"
          locale="es-US"
          :min="0.01"
          :max="999999.99"
          inputClass="w-full !text-xs !py-2.5 !px-3 !rounded-xl"
          class="w-full"
          placeholder="$0.00"
        />
      </div>

      <!-- Concepto -->
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-[#1a2e1f]">Concepto / Descripción</label>
        <Textarea
          v-model="concepto"
          rows="2"
          autoResize
          class="w-full !text-xs !p-2.5 !rounded-xl !border-[#d1d5db]"
          placeholder="Ej: Cambio inicial turno"
          :maxlength="200"
        />
        <div class="flex justify-between items-center text-[10px] text-[#6d8f60]">
          <span>Describa el motivo</span>
          <span :class="concepto.length >= 180 ? 'text-red-500 font-bold' : ''">{{ concepto.length }}/200</span>
        </div>
      </div>

      <!-- Advertencia de saldo insuficiente -->
      <div
        v-if="excedeSaldoRetirable"
        class="rounded-xl border border-red-300 bg-red-50 p-3 flex items-start gap-2"
      >
        <i class="pi pi-ban text-red-600 text-base mt-0.5"></i>
        <div class="flex flex-col gap-0.5">
          <span class="text-xs font-bold text-red-700">Monto excede saldo disponible</span>
          <span class="text-[11px] text-red-700">Dejaría la caja por debajo del fondo fijo de resguardo.</span>
        </div>
      </div>

      <!-- Botones Móvil -->
      <div class="pt-3 flex flex-col gap-2 w-full">
        <Button
          :label="tipoMovimiento === 'ENTRADA' ? 'Registrar ingreso' : 'Registrar salida'"
          :loading="guardando"
          :disabled="excedeSaldoRetirable"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-xs font-bold py-3 rounded-xl border-none cursor-pointer shadow-md w-full disabled:!opacity-50"
          @click="registrarMovimiento"
        />
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-xs !py-3 !border-[#cbd5e1] !text-gray-600 !rounded-xl !w-full font-semibold cursor-pointer"
          @click="visibleLocal = false"
        />
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO (>= 640px)                             -->
    <!-- ======================================================= -->
    <div class="hidden sm:flex bg-white p-5 text-[#1a2e1f] flex-col gap-4 font-['Inter',sans-serif]">
      
      <!-- Selector Entrada/Salida -->
      <div class="flex w-full rounded-xl overflow-hidden border border-[#dee6d6]">
        <button
          @click="tipoMovimiento = 'ENTRADA'"
          :class="[
            'flex-1 py-2.5 text-sm font-semibold transition-all cursor-pointer',
            tipoMovimiento === 'ENTRADA' ? 'bg-[#2b5e3b] text-white' : 'bg-white text-[#6d8f60] hover:bg-gray-50',
          ]"
        >
          <i class="pi pi-arrow-up mr-1 text-xs"></i> ENTRADA
        </button>
        <button
          @click="tipoMovimiento = 'SALIDA'"
          :class="[
            'flex-1 py-2.5 text-sm font-semibold transition-all cursor-pointer',
            tipoMovimiento === 'SALIDA' ? 'bg-red-600 text-white' : 'bg-white text-[#6d8f60] hover:bg-gray-50',
          ]"
        >
          <i class="pi pi-arrow-down mr-1 text-xs"></i> SALIDA
        </button>
      </div>

      <p class="text-xs text-[#6d8f60]">
        <i class="pi pi-info-circle"></i>
        {{
          tipoMovimiento === 'ENTRADA'
            ? 'Dinero que INGRESA a la caja (depósitos o más dinero para cambio).'
            : 'Dinero que SALE de la caja (pagos a proveedores o gastos menores).'
        }}
      </p>

      <!-- Saldo retirable para salidas -->
      <div
        v-if="tipoMovimiento === 'SALIDA'"
        class="flex items-center gap-2 rounded-xl bg-[#f2f5ef] border border-[#e2e8dd] px-3.5 py-2.5"
      >
        <i class="pi pi-info-circle text-[#2b5e3b] text-sm"></i>
        <span class="text-xs text-[#1e3a2f]">
          Saldo disponible para retiro: <strong>${{ formatearMoneda(saldoRetirable) }}</strong> (fondo fijo protegido de${{ formatearMoneda(fondoFijo) }}).
        </span>
      </div>

      <!-- Monto -->
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-[#1a2e1f]">
          <i class="pi pi-dollar mr-1 text-[#e0b354]"></i> Monto
        </label>
        <InputNumber
          v-model="monto"
          mode="currency"
          currency="USD"
          locale="es-US"
          :min="0.01"
          :max="999999.99"
          inputClass="w-full !text-sm !py-2.5 !px-3.5 !rounded-xl"
          class="w-full"
          placeholder="$0.00"
        />
      </div>

      <!-- Concepto -->
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-[#1a2e1f]">
          <i class="pi pi-file-edit mr-1 text-[#e0b354]"></i> Concepto / Descripción
        </label>
        <Textarea
          v-model="concepto"
          rows="3"
          autoResize
          class="w-full !text-sm !p-3 !rounded-xl !border-[#d1d5db]"
          placeholder="Ej: Aportación inicial para cambio"
          :maxlength="200"
        />
        <div class="flex justify-between items-center text-xs text-[#6d8f60]">
          <span>Describa el motivo del movimiento</span>
          <span :class="concepto.length >= 180 ? 'text-red-500 font-semibold' : ''">{{ concepto.length }}/200</span>
        </div>
      </div>

      <!-- Advertencia de saldo insuficiente -->
      <div
        v-if="excedeSaldoRetirable"
        class="rounded-xl border border-red-300 bg-red-50 p-4 flex items-start gap-3"
      >
        <i class="pi pi-ban text-red-600 text-lg mt-0.5"></i>
        <div class="flex flex-col gap-1">
          <span class="text-xs font-bold text-red-700">Monto excede el saldo disponible para retiro</span>
          <span class="text-xs text-red-700">Dejaría la caja por debajo del fondo fijo protegido (${{ formatearMoneda(fondoFijo) }}).</span>
        </div>
      </div>

      <!-- Botones Escritorio -->
      <div class="flex justify-between items-center mt-1 pt-4 border-t border-[#e2e8dd] w-full">
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-sm !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl font-semibold cursor-pointer w-[47%] flex justify-center items-center"
          @click="visibleLocal = false"
        />
        <Button
          :label="tipoMovimiento === 'ENTRADA' ? 'Registrar ingreso' : 'Registrar salida'"
          :loading="guardando"
          :disabled="excedeSaldoRetirable"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold !py-2.5 rounded-xl border-none cursor-pointer shadow-lg transition-colors w-[47%] flex justify-center items-center disabled:!opacity-50"
          @click="registrarMovimiento"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { createMovimiento, getResumenTurno } from '@/services/movimientoCajaService'
import { 
  mostrarExito, 
  mostrarError, 
  mostrarAccesoDenegado, 
  mostrarAlertaConfirmar, 
  mostrarCargando 
} from '@/utils/SweetAlertService'

const props = defineProps({
  visible: { type: Boolean, default: false },
})
const emit = defineEmits(['update:visible', 'movimientoRegistrado'])

const guardando = ref(false)
const visibleLocal = ref(false)
const tipoMovimiento = ref('ENTRADA')
const monto = ref(null)
const concepto = ref('')

const esEntrada = computed(() => tipoMovimiento.value === 'ENTRADA')
  
const fondoFijo = ref(0)
const efectivoDisponible = ref(0)
const saldoRetirable = computed(() => Math.max(0, efectivoDisponible.value - fondoFijo.value))

const excedeSaldoRetirable = computed(
  () => tipoMovimiento.value === 'SALIDA' && (monto.value || 0) > saldoRetirable.value,
)

watch(
  () => props.visible,
  (val) => {
    visibleLocal.value = val
    if (val) cargarResumenTurno()
  },
  { immediate: true }
)

watch(visibleLocal, (val) => {
  emit('update:visible', val)
})

const cargarResumenTurno = async () => {
  try {
    const { data } = await getResumenTurno()
    efectivoDisponible.value = parseFloat(data.monto_en_caja) || 0
    fondoFijo.value = parseFloat(data.fondo_fijo ?? 75) || 0
  } catch (error) {
    const status = error.response?.status
    efectivoDisponible.value = 0
    if (status === 403) {
      mostrarAccesoDenegado()
    }
  }
}

const formatearMoneda = (val) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    val || 0,
  )

const registrarMovimiento = async () => {
  const montoVacio = monto.value === null || monto.value <= 0
  const conceptoVacio = concepto.value.trim().length < 3

  if (montoVacio || conceptoVacio) {
    mostrarAlertaConfirmar({
      tipo: 'advertencia',
      titulo: montoVacio ? 'Monto requerido' : 'Motivo requerido',
      mensajeHtml: montoVacio
        ? 'El monto es requerido para registrar el movimiento.'
        : 'El motivo debe tener al menos 3 caracteres.'
    })
    return
  }

  if (excedeSaldoRetirable.value) return

  guardando.value = true
  mostrarCargando('Registrando movimiento...', 'Procesando entrada/salida de efectivo')

  try {
    await createMovimiento({
      tipo_movimiento: tipoMovimiento.value,
      monto: monto.value,
      motivo: concepto.value.trim(),
    })

    const tipoRegistrado = tipoMovimiento.value

    emit('movimientoRegistrado')
    cerrarDialog()

    mostrarExito(
      tipoRegistrado === 'ENTRADA' ? '¡Ingreso registrado!' : '¡Salida registrada!',
      `El movimiento por $${formatearMoneda(monto.value)} fue guardado correctamente.`
    )
  } catch (error) {
    const status = error.response?.status
    const msg = error.response?.data?.message || 'Error al registrar el movimiento.'

    if (status === 403) {
      mostrarAccesoDenegado()
    } else {
      mostrarError('Error al registrar', msg)
    }
    cargarResumenTurno()
  } finally {
    guardando.value = false
  }
}

const cerrarDialog = () => {
  tipoMovimiento.value = 'ENTRADA'
  monto.value = null
  concepto.value = ''
  visibleLocal.value = false
}
</script>

<style>
/* Header del Modal sin botón X */
.custom-dialog .p-dialog-header {
  background-color: #1a3323 !important;
  color: #ffffff !important;
  border-bottom: 1px solid #2b5e3b !important;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 1.1rem 1.5rem !important;
}

.custom-dialog .p-dialog-content {
  background-color: #ffffff !important;
  padding: 0 !important;
}

.p-inputtext:enabled:focus,
.p-inputnumber-input:enabled:focus,
.p-textarea:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>