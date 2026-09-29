<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="EDITAR CATEGORÍA"
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
    <div class="block sm:hidden bg-white p-4 text-[#1a2e1f] space-y-4 font-['Inter',sans-serif]">
      
      <!-- Campos del formulario para Móvil -->
      <BaseInput
        v-model="form.nombre"
        label="Nombre: *"
        placeholder="Modifique el nombre..."
        filter="alpha"
        :error="errorNombre"
        @input="validarNombre"
        @keyup.enter="dispararActualizar"
      />

      <BaseInputPercent
        v-model="form.porcentaje_ganancia_minimo"
        label="% Ganancia Mínimo Deseado:"
        placeholder="Ej: 15.00"
        help="Si se deja vacío, se aplicará el 15.00% por defecto. Esta ganancia se aplicará a todos los productos que pertenezcan a esta categoría."
        :error="errorGanancia"
        @input="validarGanancia"
        @keyup.enter="dispararActualizar"
      />

      <!-- Botones Móvil -->
      <div class="pt-3 flex flex-col gap-2 w-full">
        <Button
          label="Guardar datos"
          :loading="guardando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-xs font-bold py-3 rounded-xl border-none cursor-pointer shadow-md w-full"
          @click="dispararActualizar"
        />
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-xs !py-3 !border-[#cbd5e1] !text-gray-600 !rounded-xl !w-full font-semibold cursor-pointer"
          @click="localVisible = false"
        />
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO (>= 640px)                             -->
    <!-- ======================================================= -->
    <div class="hidden sm:flex bg-white p-6 text-[#1a2e1f] flex-col gap-5 font-['Inter',sans-serif]">
      
      <!-- Campos del formulario para Escritorio -->
      <BaseInput
        v-model="form.nombre"
        label="Nombre: *"
        placeholder="Modifique el nombre..."
        filter="alpha"
        :error="errorNombre"
        @input="validarNombre"
        @keyup.enter="dispararActualizar"
      />

      <BaseInputPercent
        v-model="form.porcentaje_ganancia_minimo"
        label="% Ganancia Mínimo Deseado:"
        placeholder="Ej: 15.00"
        help="Si se deja vacío, se aplicará el 15.00% por defecto. Esta ganancia se aplicará a todos los productos que pertenezcan a esta categoría."
        :error="errorGanancia"
        @input="validarGanancia"
        @keyup.enter="dispararActualizar"
      />

      <!-- Botones Escritorio -->
      <div class="flex justify-between items-center mt-1 pt-4 border-t border-[#e2e8dd] w-full">
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-sm !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl font-semibold cursor-pointer w-[47%] flex justify-center items-center"
          @click="localVisible = false"
        />
        <Button
          label="Guardar datos"
          :loading="guardando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold !py-2.5 rounded-xl border-none cursor-pointer shadow-lg transition-colors w-[47%] flex justify-center items-center"
          @click="dispararActualizar"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useCategoriaStore } from '../../stores/categoriaStore'
import { mostrarConfirmacion, mostrarAlertaConfirmar, mostrarExito } from '@/utils/SweetAlertService'
import BaseInput from '../base/BaseInput.vue'
import BaseInputPercent from '../base/BaseInputPercent.vue'

const props = defineProps({
  visible:   { type: Boolean, default: false },
  categoria: { type: Object,  default: () => null }
})

const emit = defineEmits(['update:visible'])

const store        = useCategoriaStore()
const localVisible = ref(false)
const form         = reactive({ id: null, nombre: '', porcentaje_ganancia_minimo: 15.00 })
const errorNombre   = ref('')
const errorGanancia = ref('')
const guardando    = ref(false)

watch(() => props.visible, (val) => { localVisible.value = val })
watch(localVisible, (val) => { emit('update:visible', val) })

watch(
  () => props.categoria,
  (val) => {
    if (val) {
      form.id                         = val.id
      form.nombre                     = val.nombre
      form.porcentaje_ganancia_minimo = val.porcentaje_ganancia_minimo !== null ? parseFloat(val.porcentaje_ganancia_minimo) : 15.00
      errorNombre.value               = ''
      errorGanancia.value             = ''
    }
  }
)

const resetForm = () => {
  errorNombre.value = ''
  errorGanancia.value = ''
}

const validarNombre = () => {
  const valor = form.nombre

  if (!valor) { errorNombre.value = ''; return false }

  if (/\d/.test(valor)) {
    errorNombre.value = 'El nombre no puede contener números.'
    return false
  }

  if (valor.trim().length < 2) {
    errorNombre.value = 'El nombre debe tener al menos 2 caracteres.'
    return false
  }

  if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(valor)) {
    errorNombre.value = 'El nombre no puede contener caracteres especiales.'
    return false
  }

  errorNombre.value = ''
  return true
}

const validarGanancia = () => {
  const val = form.porcentaje_ganancia_minimo
  if (val !== null && val !== undefined) {
    if (val < 0 || val > 100) {
      errorGanancia.value = 'El porcentaje debe estar entre 0% y 100%.'
      return false
    }
  }
  errorGanancia.value = ''
  return true
}

const dispararActualizar = async () => {
  if (!form.nombre.trim()) {
    errorNombre.value = 'El nombre de la categoría es obligatorio.'
    return
  }
  if (!validarNombre() || !validarGanancia()) return

  const confirmacion = await mostrarConfirmacion({
    titulo: '¿Guardar cambios?',
    mensajeHtml: `Se actualizará la categoría a "<strong>${form.nombre.trim()}</strong>"`,
    icono: 'pi-pencil',
    confirmButtonText: 'Sí, guardar',
  })

  if (!confirmacion.isConfirmed) return

  guardando.value = true
  
  const payload = {
    nombre: form.nombre.trim(),
    porcentaje_ganancia_minimo: form.porcentaje_ganancia_minimo !== null ? form.porcentaje_ganancia_minimo : 15.00
  }

  const resultado = await store.actualizarCategoria(form.id, payload)
  guardando.value = false

  if (resultado.ok) {
    localVisible.value = false
    mostrarExito(
      '¡Categoría actualizada!',
      'La categoría fue actualizada exitosamente.'
    )
  } else if (resultado.status === 403) {
    mostrarAlertaConfirmar({
      tipo: 'ban',
      icono: 'pi-bell',
      titulo: 'Sin autorización',
      mensajeHtml: 'No tiene permisos para editar este registro',
      confirmButtonText : 'Entendido'
    })
  } else if (resultado.error) {
    errorNombre.value = resultado.error
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
.p-select:not(.p-disabled).p-focus,
.p-password-input:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>