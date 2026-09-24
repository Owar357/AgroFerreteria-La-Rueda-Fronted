<template>
  <Dialog
    v-model:visible="visible"
    :header="esEntrada ? 'Registrar ingreso a caja' : 'Registrar salida de caja'"
    :modal="true"
    :closable="!guardando"
    class="w-full max-w-md"
    :breakpoints="{ '960px': '90vw' }"
    :style="{ borderRadius: '1rem' }"
    @hide="cerrarDialog"
  >
    <div v-if="cargando" class="space-y-6 p-4">
      <Skeleton width="100%" height="2.6rem" borderRadius="12px" />
      <Skeleton width="85%" height="1rem" />

      <div class="space-y-2">
        <Skeleton width="30%" height="1.1rem" />
        <Skeleton width="100%" height="2.6rem" borderRadius="8px" />
        <Skeleton width="55%" height="0.9rem" />
      </div>

      <div class="space-y-2">
        <Skeleton width="35%" height="1.1rem" />
        <Skeleton width="100%" height="2.6rem" borderRadius="8px" />
        <Skeleton width="60%" height="0.9rem" />
      </div>

      <div class="space-y-2">
        <Skeleton width="45%" height="1.1rem" />
        <Skeleton width="100%" height="5.5rem" borderRadius="8px" />
        <div class="flex justify-between">
          <Skeleton width="50%" height="0.9rem" />
          <Skeleton width="15%" height="0.9rem" />
        </div>
      </div>
    </div>

    <div v-else class="space-y-5 p-1">
      <div class="flex w-full rounded-xl overflow-hidden border border-[#dee6d6]">
        <button
          @click="tipoMovimiento = 'ENTRADA'"
          :class="[
            'flex-1 py-2.5 text-sm font-semibold transition-all',
            tipoMovimiento === 'ENTRADA' ? 'bg-green-600 text-white' : 'bg-white text-[#6d8f60]',
          ]"
        >
          <i class="pi pi-arrow-up mr-1 text-xs"></i> ENTRADA
        </button>
        <button
          @click="tipoMovimiento = 'SALIDA'"
          :class="[
            'flex-1 py-2.5 text-sm font-semibold transition-all',
            tipoMovimiento === 'SALIDA' ? 'bg-red-600 text-white' : 'bg-white text-[#6d8f60]',
          ]"
        >
          <i class="pi pi-arrow-down mr-1 text-xs"></i> SALIDA
        </button>
      </div>
      <p class="text-xs text-[#6d8f60] mt-1">
        <i class="pi pi-question-circle mr-1"></i>
        {{
          tipoMovimiento === 'ENTRADA'
            ? 'Dinero que INGRESA a la caja (depósitos, o más dinero para dar cambio.) '
            : 'Dinero que SALE de la caja (pagos a proveedores, otros pagos, o gastos menores etc.)'
        }}
      </p>

      <!-- Saldo retirable: solo aplica a salidas. El fondo fijo NUNCA se puede tocar. -->
      <div
        v-if="tipoMovimiento === 'SALIDA'"
        class="flex items-center gap-2 rounded-lg bg-[#f2f5ef] border border-[#e2e8dd] px-3 py-2"
      >
        <i class="pi pi-info-circle text-[#2b5e3b]"></i>
        <span class="text-[12px] text-[#1e3a2f]">
          Saldo disponible para retiro:
          <strong>${{ formatearMoneda(saldoRetirable) }}</strong>
          (se protege el fondo fijo de ${{ formatearMoneda(fondoFijo) }}, no se puede tocar)
        </span>
      </div>

      <div>
        <label class="block text-sm font-medium text-[#1e3a2f] mb-2">
          <i class="pi pi-dollar mr-1 text-[#e0b354]"></i> Monto
        </label>
        <InputNumber
          v-model="monto"
          mode="currency"
          currency="USD"
          locale="es-US"
          :min="0.01"
          :max="999999.99"
          inputClass="w-full"
          class="w-full"
          :class="{
            'border-green-300 focus:border-green-500': tipoMovimiento === 'ENTRADA',
            'border-red-300 focus:border-red-500': tipoMovimiento === 'SALIDA',
          }"
          placeholder="$0.00"
        />
        <p class="text-xs text-[#6d8f60] mt-1">
          <i class="pi pi-info-circle mr-1"></i>
          Ingrese el monto en dólares (ej: 150.00)
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-[#1e3a2f] mb-2">
          <i class="pi pi-wallet mr-1 text-[#e0b354]"></i> Origen del dinero
        </label>
        <Select
          v-model="origen"
          :options="opcionesOrigen"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          disabled
          :pt="{ dropdownIcon: 'hidden' }"
        />
        <p class="text-xs text-[#6d8f60] mt-1">
          <i class="pi pi-info-circle mr-1"></i>
          {{
            tipoMovimiento === 'ENTRADA'
              ? 'El dinero ingresa a las ventas del turno.'
              : 'El dinero sale de las ventas del turno.'
          }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-[#1e3a2f] mb-2">
          <i class="pi pi-file-edit mr-1 text-[#e0b354]"></i> Concepto / Descripción
        </label>
        <Textarea
          v-model="concepto"
          rows="3"
          autoResize
          class="w-full"
          placeholder="Ej: Venta contado - Fertilizante"
          :maxlength="200"
        />
        <div class="flex justify-between items-center mt-1">
          <p class="text-xs text-[#6d8f60]">
            <i class="pi pi-info-circle mr-1"></i>
            Describa el motivo del movimiento
          </p>
          <span
            :class="[
              'text-xs font-medium',
              concepto.length >= 180 ? 'text-red-500' : 'text-[#6d8f60]',
            ]"
          >
            {{ concepto.length }}/200
          </span>
        </div>
      </div>

      <!-- El monto excede el saldo retirable: la salida se bloquea, no hay autorización posible -->
      <div
        v-if="excedeSaldoRetirable"
        class="rounded-xl border border-red-300 bg-red-50 p-4 flex items-start gap-3"
      >
        <i class="pi pi-ban text-red-600 text-[20px] mt-0.5"></i>
        <div class="flex flex-col gap-1">
          <span class="text-[14px] font-semibold text-red-700">
            Este monto supera el saldo disponible para retiro
          </span>
          <span class="text-[13px] text-red-700">
          Dejaría la caja por debajo del fondo fijo protegido (${{ formatearMoneda(fondoFijo) }}), 
          el cual resguarda el cambio del próximo turno. Si la operación es urgente, 
          se debe registrar primero una <strong>ENTRADA DE EFECTIVO</strong> externa bajo el concepto de 
          "Aportación temporal para pago" para cubrir la diferencia, y posteriormente procesar esta salida.
      </span>

        </div>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex gap-3 justify-end">
        <template v-if="cargando">
          <Skeleton width="5.5rem" height="2.4rem" borderRadius="8px" />
          <Skeleton width="9rem" height="2.4rem" borderRadius="8px" />
        </template>

        <template v-else>
          <Button
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            text
            :disabled="guardando"
            @click="cerrarDialog"
            class="rounded-lg"
          />
          <Button
            :label="tipoMovimiento === 'ENTRADA' ? 'Registrar ingreso' : 'Registrar salida'"
            :icon="tipoMovimiento === 'ENTRADA' ? 'pi pi-plus-circle' : 'pi pi-minus-circle'"
            :severity="tipoMovimiento === 'ENTRADA' ? 'success' : 'danger'"
            :loading="guardando"
            :disabled="excedeSaldoRetirable"
            @click="registrarMovimiento"
            class="rounded-lg"
          />
        </template>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import Swal from 'sweetalert2'
import { createMovimiento, getResumenTurno } from '@/services/movimientoCajaService'

const cargando = ref(false)
const guardando = ref(false)

const props = defineProps({
  visible: { type: Boolean, default: false },
})
const emit = defineEmits(['update:visible', 'movimientoRegistrado'])

const tipoMovimiento = ref('ENTRADA')
const monto = ref(null)
const concepto = ref('')

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

// El origen queda fijo: en la gaveta única todo entra o sale de las ventas del turno
const origen = ref('VENTAS')
const opcionesOrigen = [{ label: 'Ventas', value: 'VENTAS' }]

const esEntrada = computed(() => tipoMovimiento.value === 'ENTRADA')

// --- Saldo retirable: fondo fijo protegido, sin excepción posible ---
const fondoFijo = ref(0)
const efectivoDisponible = ref(0)
const saldoRetirable = computed(() => Math.max(0, efectivoDisponible.value - fondoFijo.value))

const excedeSaldoRetirable = computed(
  () => tipoMovimiento.value === 'SALIDA' && (monto.value || 0) > saldoRetirable.value,
)

const cargarResumenTurno = async () => {
  try {
    const { data } = await getResumenTurno()
    efectivoDisponible.value = parseFloat(data.monto_en_caja) || 0
    fondoFijo.value = parseFloat(data.fondo_fijo ?? 75) || 0
  } catch {
    efectivoDisponible.value = 0
  }
}

watch(visible, (val) => {
  if (val) cargarResumenTurno()
})

const formatearMoneda = (val) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    val || 0,
  )

// --- Registro del movimiento ---
const registrarMovimiento = async () => {
  const montoVacio = monto.value === null || monto.value <= 0
  const conceptoVacio = concepto.value.trim().length < 3

  if (montoVacio || conceptoVacio) {
    Swal.fire({
      icon: 'warning',
      title: montoVacio ? 'Monto requerido' : 'Motivo requerido',
      text: montoVacio
        ? 'El monto es requerido para registrar el movimiento.'
        : 'El motivo es obligatorio para registrar el movimiento.',
      confirmButtonColor: '#2b5e3b',
      customClass: { container: '!z-[9999]' },
    })
    return
  }

  if (excedeSaldoRetirable.value) return

  guardando.value = true
  try {
    await createMovimiento({
      tipo_movimiento: tipoMovimiento.value,
      monto: monto.value,
      motivo: concepto.value.trim(),
    })

    const tipoRegistrado = tipoMovimiento.value

    emit('movimientoRegistrado')
    cerrarDialog()
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: tipoRegistrado === 'ENTRADA' ? '¡Ingreso registrado!' : '¡Salida registrada!',
      showConfirmButton: false,
      timer: 2000,
      background: '#ffffff',
      color: '#1e3a2f',
      iconColor: '#2b5e3b',
      customClass: { container: '!z-[9999]' },
    })
  } catch (error) {
    // El backend vuelve a validar el fondo fijo; si el saldo cambió entre que se abrió
    // el modal y se envió el movimiento, este es el mensaje real y actualizado.
    const msg = error.response?.data?.message || 'Error al registrar el movimiento.'
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: msg,
      confirmButtonColor: '#2b5e3b',
      customClass: { container: '!z-[9999]' },
    })
    cargarResumenTurno()
  } finally {
    guardando.value = false
  }
}

const cerrarDialog = () => {
  tipoMovimiento.value = 'ENTRADA'
  monto.value = null
  concepto.value = ''
  origen.value = 'VENTAS'
  visible.value = false
}

watch(visible, (nuevoValor) => {
  if (!nuevoValor) {
    tipoMovimiento.value = 'ENTRADA'
    monto.value = null
    concepto.value = ''
    origen.value = 'VENTAS'
  }
})
</script>

<style scoped>
:deep(.p-selectbutton .p-button) {
  flex: 1;
  border-radius: 0.75rem;
  font-weight: 500;
}

:deep(.p-inputnumber-input) {
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
}

:deep(.p-inputtext) {
  border-radius: 0.75rem;
}

:deep(.p-textarea) {
  border-radius: 0.75rem;
}
</style>
