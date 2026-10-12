<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="EDITAR PROVEEDOR"
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

      <BaseInput
        v-model="form.nombre"
        label="Nombre *"
        placeholder="Nombre del proveedor"
        :error="errores.nombre"
        @input="validarCampo('nombre')"
        @keyup.enter="guardar"
      />

      <BaseInput
        v-model="form.correo"
        type="email"
        placeholder="correo@ejemplo.com"
        :error="errores.correo"
        @input="validarCampo('correo')"
        @keyup.enter="guardar"
      >
        <template #label>
          <label class="text-xs font-semibold text-[#1a2e1f]">
            Correo electrónico
            <span class="text-[10px] font-normal text-gray-400 normal-case ml-1">(opcional)</span>
          </label>
        </template>
      </BaseInput>

      <BaseInput
        v-model="form.telefono"
        label="Teléfono"
        type="tel"
        filter="int"
        maxlength="8"
        placeholder="22223333"
        @keyup.enter="guardar"
      />

      <!-- Botones Móvil -->
      <div class="pt-3 flex flex-col gap-2 w-full">
        <Button
          label="Guardar"
          :loading="cargando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-xs font-bold py-3 rounded-xl border-none cursor-pointer shadow-md w-full"
          @click="guardar"
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
    <div class="hidden sm:flex bg-white p-6 text-[#1a2e1f] flex-col gap-5 font-['Inter',sans-serif]">

      <BaseInput
        v-model="form.nombre"
        label="Nombre *"
        placeholder="Nombre del proveedor"
        :error="errores.nombre"
        @input="validarCampo('nombre')"
        @keyup.enter="guardar"
      />

      <BaseInput
        v-model="form.correo"
        type="email"
        placeholder="correo@ejemplo.com"
        :error="errores.correo"
        @input="validarCampo('correo')"
        @keyup.enter="guardar"
      >
        <template #label>
          <label class="text-sm font-medium text-[#1a2e1f]">
            Correo electrónico
            <span class="text-xs font-normal text-gray-400 normal-case ml-1">(opcional)</span>
          </label>
        </template>
      </BaseInput>

      <BaseInput
        v-model="form.telefono"
        label="Teléfono"
        type="tel"
        filter="int"
        maxlength="8"
        placeholder="22223333"
        @keyup.enter="guardar"
      />

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
          label="Guardar"
          :loading="cargando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold !py-2.5 rounded-xl border-none cursor-pointer shadow-lg transition-colors w-[47%] flex justify-center items-center"
          @click="guardar"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import BaseInput from '@/components/base/BaseInput.vue'
import {
  mostrarExito,
  mostrarError,
  mostrarAlertaConfirmar,
  mostrarCargando
} from '@/utils/SweetAlertService'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  proveedor:  { type: Object, default: null },
  cargando:   { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'actualizar'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const form = reactive({
  id:           null,
  nombre:       '',
  correo:       '',
  telefono:     '',
  direccion:    '',
  tipo_persona: '',
  nit:          '',
  nrc:          '',
  dui:          null,
  activo:       true,
})

const errores = reactive({
  nombre: '',
  correo: '',
})

function validarCampo(campo) {
  if (campo === 'nombre') {
    errores.nombre = form.nombre.trim() ? '' : 'El nombre es obligatorio.'
  }

  if (campo === 'correo') {
    const valor = form.correo.trim()
    if (!valor) {
      errores.correo = ''
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor)) {
      errores.correo = 'Formato de correo electrónico inválido.'
    } else {
      errores.correo = ''
    }
  }
}

function validarFormulario() {
  validarCampo('nombre')
  validarCampo('correo')
  return !errores.nombre && !errores.correo
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.proveedor) {
    const p = props.proveedor
    form.id           = p.id           ?? null
    form.nombre       = p.nombre       ?? ''
    form.correo       = p.correo && p.correo !== '—' ? p.correo : ''
    form.telefono     = p.telefono     ?? ''
    form.direccion    = p.direccion    ?? ''
    form.tipo_persona = p.tipo_persona ?? ''
    form.nit          = p.nit          ?? ''
    form.nrc          = p.nrc          ?? ''
    form.dui          = p.dui          ?? null
    form.activo       = p.activo       ?? true
    errores.nombre    = ''
    errores.correo    = ''
  }
})

function resetForm() {
  Object.assign(form, {
    id: null,
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    tipo_persona: '',
    nit: '',
    nrc: '',
    dui: null,
    activo: true,
  })
  errores.nombre = ''
  errores.correo = ''
}

function guardar() {
  if (!validarFormulario()) {
    mostrarAlertaConfirmar({
      tipo: 'advertencia',
      titulo: 'Campos requeridos',
      mensajeHtml: 'Por favor corrige los campos indicados en el formulario.'
    })
    return
  }

  const payload = { id: form.id }

  if (form.nombre?.trim())   payload.nombre   = form.nombre.trim()
  payload.correo = form.correo.trim() || null
  if (form.telefono?.trim()) payload.telefono = form.telefono.trim()

  emit('actualizar', payload)
}
</script>

<style>
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

.swal2-container {
  z-index: 999999 !important;
}
</style>
