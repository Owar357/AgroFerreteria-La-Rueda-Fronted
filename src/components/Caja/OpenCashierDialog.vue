<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="APERTURA DE CAJA"
    :style="{ width: '450px' }"
    :draggable="false"
    :pt="{
      root: { class: 'rounded-2xl overflow-hidden' },
      header: { class: '!bg-[#1e3a2f] !text-white !px-6 !py-5' },
      title: { class: '!text-white !font-semibold !text-sm !tracking-widest' },
      closeButton: { class: '!text-white hover:!bg-[#2b5e3b]' },
      content: { class: '!bg-white !px-6 !py-5' },
      footer: { class: '!bg-white !px-6 !py-4 !border-t !border-[#e8efe1]' }
    }"
    @hide="resetForm"
  >
    <div class="flex flex-col gap-5">

      <!-- Info -->
      <div class="flex items-start gap-3 bg-[#f0f7ee] rounded-xl p-4 border border-[#d4e6cc]">
        <i class="pi pi-info-circle text-[#2b5e3b] mt-0.5"></i>
        <p class="text-sm text-[#2b5e3b] m-0">
          Ingrese el monto inicial con el que abre el turno y su clave de acceso para confirmar la apertura.
        </p>
      </div>

      <!-- Monto inicial -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#1a2e1f]">
          Monto inicial <span class="text-red-500">*</span>
        </label>
        <InputNumber
          v-model="form.montoInicial"
          mode="currency"
          currency="USD"
          locale="es-US"
          :min="0.01"
          class="w-full"
          :pt="{ input: { class: 'w-full !bg-[#f9fafb] !text-[#1a2e1f] !text-sm !h-11 !px-4 !rounded-lg !border-[#d1d5db]' } }"
          placeholder="$0.00"
        />
        <small v-if="errorMonto" class="text-red-500 text-xs">{{ errorMonto }}</small>
      </div>

      <!-- Clave de apertura -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[#1a2e1f]">
          Clave de apertura <span class="text-red-500">*</span>
        </label>
        <Password
          v-model="form.clave"
          placeholder="••••••••"
          :feedback="false"
          toggleMask
          class="w-full"
          :pt="{ input: { class: 'w-full !bg-[#f9fafb] !text-[#1a2e1f] !text-sm !h-11 !px-4 !rounded-lg !border-[#d1d5db]' } }"
        />
        <small v-if="errorClave" class="text-red-500 text-xs">{{ errorClave }}</small>
      </div>

    </div>

    <template #footer>
      <div class="flex gap-3 justify-end">
        <Button
          label="Cancelar"
          severity="secondary"
          text
          @click="localVisible = false"
          class="!rounded-lg"
        />
        <Button
          label="Abrir caja"
          icon="pi pi-unlock"
          :loading="abriendo"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white !border-none !rounded-lg"
          @click="confirmarApertura"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Swal from 'sweetalert2'

const props = defineProps({
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['update:visible', 'turnoAbierto'])

const localVisible = ref(false)
const abriendo = ref(false)
const errorClave = ref('')
const errorMonto = ref('')

const form = ref({
  montoInicial: null,
  clave: ''
})

// Contraseña fija para simulación
const CLAVE_CORRECTA = '12345678'

watch(() => props.visible, (val) => { localVisible.value = val })
watch(localVisible, (val) => { emit('update:visible', val) })

const resetForm = () => {
  form.value = { montoInicial: null, clave: '' }
  errorClave.value = ''
  errorMonto.value = ''
  abriendo.value = false
}

const confirmarApertura = async () => {
  // Limpiar errores previos
  errorMonto.value = ''
  errorClave.value = ''

  // Validar monto
  if (!form.value.montoInicial || form.value.montoInicial <= 0) {
    errorMonto.value = 'El monto inicial debe ser mayor a cero.'
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: errorMonto.value,
      showConfirmButton: false,
      timer: 2000,
      background: '#ffffff',
      color: '#1e3a2f',
    })
    return
  }

  // Validar clave
  if (!form.value.clave.trim()) {
    errorClave.value = 'La clave de apertura es obligatoria.'
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: errorClave.value,
      showConfirmButton: false,
      timer: 2000,
    })
    return
  }

  // Iniciar loading
  abriendo.value = true

  // Simular validación en backend (puedes reemplazar con llamada real)
  await new Promise(resolve => setTimeout(resolve, 800))

  if (form.value.clave !== CLAVE_CORRECTA) {
    errorClave.value = 'Clave incorrecta. Intente de nuevo.'
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: errorClave.value,
      showConfirmButton: false,
      timer: 2000,
      background: '#ffffff',
      color: '#1e3a2f',
    })
    abriendo.value = false
    return
  }

  // Éxito
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: `¡Turno abierto con $${form.value.montoInicial.toFixed(2)}!`,
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#1e3a2f',
    iconColor: '#2b5e3b',
  })

  // Emitir el monto al padre
  emit('turnoAbierto', form.value.montoInicial)
  localVisible.value = false
  abriendo.value = false
}
</script>