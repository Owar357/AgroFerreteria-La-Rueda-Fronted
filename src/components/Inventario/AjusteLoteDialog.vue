<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="AJUSTE DE INVENTARIO POR LOTE"
    :draggable="false"
    :closable="false"
    :style="{ width: 'min(calc(100vw - 2rem), 34rem)' }"
    class="custom-dialog"
    :pt="{ root: { class: '!rounded-2xl overflow-hidden shadow-2xl' } }"
    @hide="resetForm"
  >
    <!-- ======================================================= -->
    <!-- VISTA MÓVIL (< 640px)                                   -->
    <!-- ======================================================= -->
    <div v-if="lote" class="block sm:hidden bg-white p-4 text-[#1a2e1f] space-y-4 font-['Inter',sans-serif]">
      
      <!-- Card resumen del lote Móvil -->
      <div class="bg-[#f9fafb] border border-[#e2e8dd] rounded-xl p-3 flex flex-col gap-1.5 text-xs">
        <div class="flex justify-between text-[#6b7280]">
          <span>Lote: <strong>{{ lote.lote_interno || lote.codigo }}</strong></span>
          <span>Costo Unit.: <strong>${{ parseFloat(lote.costo_unitario_compra || 0).toFixed(2) }}</strong></span>
        </div>
        <div class="flex justify-between text-[#2b5e3b] font-medium pt-1 border-t border-[#e2e8dd]/60">
          <span>Stock Actual en Sistema:</span>
          <span class="text-xs font-bold font-mono">
            {{ parseFloat(lote.cantidad_actual || 0).toFixed(4) }} {{ nombreUnidad }}
          </span>
        </div>
      </div>

      <!-- Tipo de Ajuste -->
      <div class="flex flex-col gap-1.5 w-full">
        <BaseSelect
        v-model="form.tipo_ajuste"
        label="Tipo de Ajuste"
        :options="tiposAjuste"
        option-label="label"
        option-value="value"
      />
      </div>

      <!-- Campo Dinámico según Tipo de Ajuste -->
      <div v-if="form.tipo_ajuste === 'REEVALUACION'">
        <BaseInputNumberMoney
          v-model="form.costo_nuevo"
          label="Nuevo Costo Unitario ($)"
          :max-fraction-digits="4"
        />
      </div>

      <div v-else class="flex flex-col gap-1.5 w-full">
        <label class="text-xs font-semibold text-[#1a2e1f]">
          Cantidad Física Real Contada (Stock Final)
        </label>
        <InputNumber
          v-model="form.cantidad_fisica"
          locale="en-US"
          :suffix="nombreUnidad ? ` ${nombreUnidad}` : ''"
          :useGrouping="false"
          :min="0"
          :minFractionDigits="esGranel ? 2 : 0"
          :maxFractionDigits="esGranel ? 4 : 0"
          class="w-full"
          placeholder="Ingrese el conteo físico final"
          :pt="{ root: { class: 'w-full' }, input: { class: '!text-xs !py-2.5 !px-3 rounded-xl' } }"
        />
        <small class="text-[11px] text-[#6b7280]">
          Diferencia calculada:
          <strong :class="diferenciaCalculada >= 0 ? 'text-green-700' : 'text-red-600'">
            {{ diferenciaCalculada > 0 ? '+' : '' }}{{ diferenciaCalculada.toFixed(4) }} {{ nombreUnidad }}
          </strong>
        </small>
      </div>

      <!-- Motivo -->
       <BaseSelect
        v-model="form.motivo"
        label="Motivo del Ajuste"
        :options="motivosDisponibles"
        placeholder="Seleccione motivo"
      />
      
      
      <!-- Observaciones -->
      <div class="flex flex-col gap-1.5 w-full">
        <label class="text-xs font-semibold text-[#1a2e1f]">Observaciones (Opcional)</label>
        <Textarea
          v-model="form.observaciones"
          rows="2"
          class="w-full text-xs p-2.5 border border-gray-300 rounded-xl"
          placeholder="Detalles adicionales del ajuste..."
        />
      </div>

      <!-- Botones Móvil -->
      <div class="pt-3 flex flex-col gap-2 w-full">
        <Button
          label="Guardar Ajuste"
          :loading="cargando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-xs font-bold py-3 rounded-xl border-none cursor-pointer shadow-md w-full"
          @click="guardarAjuste"
        />
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          :disabled="cargando"
          class="!text-xs !py-3 !border-[#cbd5e1] !text-gray-600 !rounded-xl !w-full font-semibold cursor-pointer"
          @click="visible = false"
        />
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO (>= 640px)                             -->
    <!-- ======================================================= -->
    <div v-if="lote" class="hidden sm:flex bg-white p-6 text-[#1a2e1f] flex-col gap-5 font-['Inter',sans-serif]">
      
      <!-- Card resumen del lote Escritorio -->
      <div class="bg-[#f9fafb] border border-[#e2e8dd] rounded-xl p-3.5 flex flex-col gap-1.5 text-xs">
        <div class="flex justify-between text-[#6b7280]">
          <span>Lote: <strong>{{ lote.lote_interno || lote.codigo }}</strong></span>
          <span>Costo Unit. Producto: <strong>${{ parseFloat(lote.costo_unitario_compra || 0).toFixed(2) }}</strong></span>
        </div>
        <div class="flex justify-between text-[#2b5e3b] font-medium pt-1 border-t border-[#e2e8dd]/60">
          <span>Stock Actual en Sistema:</span>
          <span class="text-sm font-bold font-mono">
            {{ parseFloat(lote.cantidad_actual || 0).toFixed(4) }} {{ nombreUnidad }}
          </span>
        </div>
      </div>

      
        <BaseSelect
        v-model="form.tipo_ajuste"
        label="Tipo de Ajuste"
        :options="tiposAjuste"
        option-label="label"
        option-value="value"
      />
      

      <!-- Campo Dinámico según Tipo de Ajuste -->
      <div v-if="form.tipo_ajuste === 'REEVALUACION'">
        <BaseInputNumberMoney
          v-model="form.costo_nuevo"
          label="Nuevo Costo Unitario ($)"
          :max-fraction-digits="4"
        />
      </div>

      <div v-else class="flex flex-col gap-1.5 w-full">
        <label class="text-sm font-medium text-[#1a2e1f]">
          Cantidad Física Real Contada (Stock Final)
        </label>
        <InputNumber
          v-model="form.cantidad_fisica"
          locale="en-US"
          :suffix="nombreUnidad ? ` ${nombreUnidad}` : ''"
          :useGrouping="false"
          :min="0"
          :minFractionDigits="esGranel ? 2 : 0"
          :maxFractionDigits="esGranel ? 4 : 0"
          class="w-full"
          placeholder="Ingrese el conteo físico final"
          :pt="{ root: { class: 'w-full' }, input: { class: '!text-sm !py-2.5 !px-3.5 rounded-xl' } }"
        />
        <small class="text-xs text-[#6b7280]">
          Diferencia calculada:
          <strong :class="diferenciaCalculada >= 0 ? 'text-green-700' : 'text-red-600'">
            {{ diferenciaCalculada > 0 ? '+' : '' }}{{ diferenciaCalculada.toFixed(4) }} {{ nombreUnidad }}
          </strong>
        </small>
      </div>

      
        <BaseSelect
          v-model="form.motivo"
          label="Motivo del Ajuste"
          :options="motivosDisponibles"
          placeholder="Seleccione motivo"
        />
      

      <!-- Observaciones -->
      <div class="flex flex-col gap-1.5 w-full">
        <label class="text-sm font-medium text-[#1a2e1f]">Observaciones (Opcional)</label>
        <Textarea
          v-model="form.observaciones"
          rows="2"
          class="w-full text-sm p-3 border border-gray-300 rounded-xl"
          placeholder="Detalles adicionales del ajuste..."
        />
      </div>

      <!-- Botones Escritorio -->
      <div class="flex justify-between items-center mt-1 pt-4 border-t border-[#e2e8dd] w-full">
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          :disabled="cargando"
          class="!text-sm !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl font-semibold cursor-pointer w-[47%] flex justify-center items-center"
          @click="visible = false"
        />
        <Button
          label="Guardar Ajuste"
          :loading="cargando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold !py-2.5 rounded-xl border-none cursor-pointer shadow-lg transition-colors w-[47%] flex justify-center items-center"
          @click="guardarAjuste"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import BaseSelect from '@/components/base/BaseSelect.vue'
import InputNumber from 'primevue/inputnumber'
import BaseInputNumberMoney from '@/components/base/BaseInputNumberMoney.vue'
import Textarea from 'primevue/textarea'
import Swal from 'sweetalert2'
import { registrarAjusteInventario } from '@/services/inventarioService'

const props = defineProps({
  modelValue: Boolean,
  lote: Object,
  nombrePresentacion: { type: String, default: '' },
  unidadMedida: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'ajuste-realizado'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const cargando = ref(false)

const form = ref({
  tipo_ajuste: 'DISMINUCION',
  cantidad_fisica: 0,
  costo_nuevo: 0,
  motivo: '',
  observaciones: '',
})

const tiposAjuste = [
  { label: 'Disminución (Faltante / Merma / Daño)', value: 'DISMINUCION' },
  { label: 'Incremento (Sobrante / Conteo)', value: 'INCREMENTO' },
  { label: 'Reevaluación de Costo', value: 'REEVALUACION' },
]

const motivosDisponibles = computed(() => {
  if (form.value.tipo_ajuste === 'DISMINUCION') {
    return [
      'Merma por empaque dañado',
      'Producto vencido',
      'Faltante por conteo físico',
      'Desecho por evaporación/humedad',
      'Uso interno / Muestra',
    ]
  } else if (form.value.tipo_ajuste === 'INCREMENTO') {
    return [
      'Sobrante por conteo físico',
      'Ingreso por corrección de registro',
      'Devolución de lote',
    ]
  } else {
    return [
      'Actualización costo de compra',
      'Corrección de precio de lote',
    ]
  }
})

const esGranel = computed(() => {
  return props.lote?.producto?.tipo_producto === 'GRANEL'
})

const nombreUnidad = computed(() => {
  if (props.unidadMedida) return props.unidadMedida
  if (props.nombrePresentacion) return props.nombrePresentacion

  const l = props.lote
  if (!l) return ''

  return (
    l.unidad_base ||
    l.producto?.unidad_base ||
    l.presentacion?.unidad_base ||
    l.presentacion?.unidad_medida?.abreviatura ||
    l.presentacion?.unidad_medida?.nombre ||
    l.producto?.unidad_medida?.abreviatura ||
    l.producto?.unidad_medida?.nombre ||
    ''
  )
})

const diferenciaCalculada = computed(() => {
  const stockSistema = parseFloat(props.lote?.cantidad_actual || 0)
  const dif = (form.value.cantidad_fisica || 0) - stockSistema

  if (dif > 0) {
    form.value.tipo_ajuste = 'INCREMENTO'
  } else if (dif < 0) {
    form.value.tipo_ajuste = 'DISMINUCION'
  }

  return dif
})

watch(visible, (abierto) => {
  if (abierto && props.lote) {
    form.value.tipo_ajuste = 'DISMINUCION'
    form.value.cantidad_fisica = parseFloat(props.lote.cantidad_actual || 0)
    form.value.costo_nuevo = parseFloat(props.lote.costo_unitario_compra || 0)
    form.value.motivo = ''
    form.value.observaciones = ''
  }
})  

const resetForm = () => {
  form.value = {
    tipo_ajuste: 'DISMINUCION',
    cantidad_fisica: 0,
    costo_nuevo: 0,
    motivo: '',
    observaciones: '',
  }
  cargando.value = false
}

const guardarAjuste = async () => {
  if (!form.value.motivo) {
    Swal.fire({
      icon: 'warning',
      title: 'Motivo requerido',
      text: 'Por favor seleccione el motivo del ajuste.',
      confirmButtonColor: '#2b5e3b',
      customClass: { container: '!z-[99999]' },
    })
    return
  }

  if (form.value.tipo_ajuste !== 'REEVALUACION' && form.value.cantidad_fisica < 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Cantidad inválida',
      text: 'La cantidad física no puede ser negativa.',
      confirmButtonColor: '#2b5e3b',
      customClass: { container: '!z-[99999]' },
    })
    return
  }

  const stockSistema = parseFloat(props.lote?.cantidad_actual || 0)

  if (form.value.tipo_ajuste === 'INCREMENTO' && form.value.cantidad_fisica <= stockSistema) {
    Swal.fire({
      icon: 'warning',
      title: 'Operación no permitida',
      text: `Eligió "Incremento", por lo que la cantidad física (${form.value.cantidad_fisica}) debe ser mayor al stock actual del sistema (${stockSistema}).`,
      confirmButtonColor: '#2b5e3b',
      customClass: { container: '!z-[99999]' },
    })
    return
  }

  if (form.value.tipo_ajuste === 'DISMINUCION' && form.value.cantidad_fisica >= stockSistema) {
    Swal.fire({
      icon: 'warning',
      title: 'Operación no permitida',
      text: `Eligió "Disminución", por lo que la cantidad física (${form.value.cantidad_fisica}) debe ser menor al stock actual del sistema (${stockSistema}).`,
      confirmButtonColor: '#2b5e3b',
      customClass: { container: '!z-[99999]' },
    })
    return
  }

  cargando.value = true

  const payload = {
    tipo_ajuste: form.value.tipo_ajuste,
    motivo: form.value.motivo,
    observaciones: form.value.observaciones || null,
    detalles: [
      {
        lote_id: props.lote.id,
        cantidad_fisica: form.value.cantidad_fisica,
        costo_nuevo: form.value.costo_nuevo,
      },
    ],
  }

  try {
    await registrarAjusteInventario(payload)

    Swal.fire({
      icon: 'success',
      title: '¡Ajuste Procesado!',
      text: 'El stock y el Kardex han sido actualizados correctamente.',
      confirmButtonColor: '#2b5e3b',
      timer: 2000,
      customClass: { container: '!z-[99999]' },
    })

    visible.value = false
    emit('ajuste-realizado')
  } catch (error) {
    console.error(error)
    const mensaje = error.response?.data?.message || 'Error al procesar el ajuste.'
    Swal.fire({
      icon: 'error',
      title: 'Error de Ajuste',
      text: mensaje,
      confirmButtonColor: '#2b5e3b',
      customClass: { container: '!z-[99999]' },
    })
  } finally {
    cargando.value = false
  }
}
</script>

<style>
/* Encabezado sin 'X' y paleta AgroFerretería */
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

/* Limpieza del contenedor de contenido */
.custom-dialog .p-dialog-content {
  background-color: #ffffff !important;
  padding: 0 !important;
}

/* Enfoques y bordes para componentes PrimeVue dentro del modal */
.p-inputtext:enabled:focus,
.p-inputnumber-input:enabled:focus,
.p-password-input:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}

.swal2-container {
  z-index: 99999 !important;
}
</style>