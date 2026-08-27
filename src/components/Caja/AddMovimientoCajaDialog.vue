<template>
  <Dialog
    v-model:visible="visible"
    :header="esEntrada ? 'Registrar ingreso a caja' : ' Registrar salida de caja'"
    :modal="true"
    :closable="true"
    class="w-full max-w-md"
    :breakpoints="{ '960px': '90vw' }"
    :style="{ borderRadius: '1rem' }"
    @hide="cerrarDialog"
  >
    <div class="space-y-5 p-1">
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
            : 'Dinero que SALE de la caja(pagos a proveedores, otros pagos, o gastos menores etc.)'
        }}
      </p>

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
    placeholder="Seleccione el origen"
  />
  <p class="text-xs text-[#6d8f60] mt-1">
    <i class="pi pi-info-circle mr-1"></i>
    {{
      tipoMovimiento === 'ENTRADA'
        ? 'Las entradas solo pueden provenir de caja chica.'
        : 'Seleccione si el dinero sale de caja chica o de las ventas del turno.'
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
          @keypress="
            (e) => {
              if (/[0-9]/.test(e.key)) e.preventDefault()
            }
          "
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
    </div>

    <template #footer>
      <div class="flex gap-3 justify-end">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          text
          @click="cerrarDialog"
          class="rounded-lg"
        />
        <Button
          :label="tipoMovimiento === 'ENTRADA' ? 'Registrar ingreso' : 'Registrar salida'"
          :icon="tipoMovimiento === 'ENTRADA' ? 'pi pi-plus-circle' : 'pi pi-minus-circle'"
          :severity="tipoMovimiento === 'ENTRADA' ? 'success' : 'danger'"
          :loading="guardando"
          @click="registrarMovimiento"
          class="rounded-lg"
        />
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
import { Select } from 'primevue'
import { createMovimiento } from '@/services/movimientoCajaService'
import Swal from 'sweetalert2'

const guardando = ref(false)

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:visible', 'movimientoRegistrado'])

const tipoMovimiento = ref('ENTRADA')
const monto = ref(null)
const concepto = ref('')

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

//para seleccionar si es de venta o caja chica
const origen = ref('CAJA_CHICA')

const opcionesOrigen = computed(() => {
  if (tipoMovimiento.value === 'ENTRADA') {
    return [{ label: 'Caja chica', value: 'CAJA_CHICA' }]
  }
  return [
    { label: 'Caja chica', value: 'CAJA_CHICA' },
    { label: 'Ventas', value: 'VENTAS' },
  ]
})

// Cuando cambia a ENTRADA, forzar origen válido
watch(tipoMovimiento, (nuevoTipo) => {
  if (nuevoTipo === 'ENTRADA') {
    origen.value = 'CAJA_CHICA'
  }
})

const esEntrada = computed(() => tipoMovimiento.value === 'ENTRADA')

const formularioValido = computed(() => {
  return monto.value !== null && monto.value > 0 && concepto.value.trim().length >= 3
})

//REGISTRAMOS EL MOVIMEOTO EXTERNO
const registrarMovimiento = async () => {
  const montoVacio = monto.value === null || monto.value <= 0
  const conceptoVacio = concepto.value.trim().length < 3

  if (montoVacio && conceptoVacio) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'El monto y el motivo son requeridos para registrar el movimiento.',
      confirmButtonColor: '#2b5e3b',
      customClass: { container: '!z-[9999]' },
    })
    return
  }

  if (montoVacio) {
    Swal.fire({
      icon: 'warning',
      title: 'Monto requerido',
      text: 'El monto es requerido para registrar el movimiento.',
      confirmButtonColor: '#2b5e3b',
      customClass: { container: '!z-[9999]' },
    })
    return
  }

  if (conceptoVacio) {
    Swal.fire({
      icon: 'warning',
      title: 'Motivo requerido',
      text: 'El motivo es obligatorio para registrar el movimiento.',
      confirmButtonColor: '#2b5e3b',
      customClass: { container: '!z-[9999]' },
    })
    return
  }

  guardando.value = true
  try {
    await createMovimiento({
      tipo_movimiento: tipoMovimiento.value,
      monto: monto.value,
      motivo: concepto.value.trim(),
      origen: origen.value, //AGREGADO
    })
    
    emit('movimientoRegistrado')
    cerrarDialog()
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: tipoMovimiento.value === 'ENTRADA' ? '¡Ingreso registrado!' : '¡Salida registrada!',
      showConfirmButton: false,
      timer: 2000,
      background: '#ffffff',
      color: '#1e3a2f',
      iconColor: '#2b5e3b',
      customClass: { container: '!z-[9999]' },
    })


  } catch (error) {
    const msg = error.response?.data?.message || 'Error al registrar el movimiento.'
    Swal.fire({ 
    icon: 'error', 
    title: 'Error', 
    text: msg, 
    confirmButtonColor: '#2b5e3b' })
    customClass: { container: '!z-[9999]' }


  } finally {
    guardando.value = false
  }
}

const cerrarDialog = () => {
  // Resetear formulario
  tipoMovimiento.value = 'ENTRADA'
  monto.value = null
  concepto.value = ''
  origen.value =  'CAJA_CHICA'
  visible.value = false
}

watch(visible, (nuevoValor) => {
  if (!nuevoValor) {
    tipoMovimiento.value = 'ENTRADA'
    monto.value = null
    concepto.value = '',
      origen.value = 'CAJA_CHICA'
  }
})
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
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
