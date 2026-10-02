<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="AGREGAR PROVEEDOR"
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
      
      <!-- Tipo de persona Móvil -->
      <div class="flex gap-2">
        <button
          type="button"
          @click="tipoPersona = 'natural'"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-[1.5px] text-xs transition-all cursor-pointer font-semibold',
            tipoPersona === 'natural'
              ? 'border-[#2b5e3b] bg-[#eef2e9] text-[#1a2e1f] shadow-xs'
              : 'border-gray-200 bg-white text-gray-500 hover:border-[#2b5e3b] hover:text-[#1a2e1f]',
          ]"
        >
          <i class="pi pi-user text-sm" />
          Natural
        </button>
        <button
          type="button"
          @click="tipoPersona = 'juridica'"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-[1.5px] text-xs transition-all cursor-pointer font-semibold',
            tipoPersona === 'juridica'
              ? 'border-[#2b5e3b] bg-[#eef2e9] text-[#1a2e1f] shadow-xs'
              : 'border-gray-200 bg-white text-gray-500 hover:border-[#2b5e3b] hover:text-[#1a2e1f]',
          ]"
        >
          <i class="pi pi-building text-sm" />
          Jurídica
        </button>
      </div>

      <!-- Sección Información General -->
      <p class="text-[11px] font-semibold text-gray-400 flex items-center gap-2 m-0 after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-100">
        Información general
      </p>

      <!-- Campos Móvil -->
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-[#1a2e1f]">Nombre *</label>
          <InputText v-model="form.nombre" placeholder="Nombre del proveedor" :pt="inputPt" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-[#1a2e1f]">
            Dirección
            <span class="text-[10px] font-normal text-gray-400 normal-case ml-1">(opcional)</span>
          </label>
          <InputText
            v-model="form.direccion"
            placeholder="Calle, colonia, municipio..."
            :pt="inputPt"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-[#1a2e1f]">
            Correo electrónico
            <span class="text-[10px] font-normal text-gray-400 normal-case ml-1">(opcional)</span>
          </label>
          <InputText
            v-model="form.correo"
            type="email"
            placeholder="correo@ejemplo.com"
            :pt="inputPt"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-[#1a2e1f]">Teléfono</label>
          <InputText v-model="form.telefono" type="tel" placeholder="2222-3333" :pt="inputPt" />
        </div>
      </div>

      <!-- Botones Móvil -->
      <div class="pt-3 flex flex-col gap-2 w-full">
        <Button
          label="Guardar proveedor"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-xs font-bold py-3 rounded-xl border-none cursor-pointer shadow-md w-full"
          @click="guardar"
        />
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-xs !py-3 !border-[#cbd5e1] !text-gray-600 !rounded-xl !w-full font-semibold cursor-pointer"
          @click="visible = false"
        />
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO (>= 640px)                             -->
    <!-- ======================================================= -->
    <div class="hidden sm:flex bg-white p-6 text-[#1a2e1f] flex-col gap-5 font-['Inter',sans-serif]">
      
      <!-- Tipo de persona Escritorio -->
      <div class="flex gap-3">
        <button
          type="button"
          @click="tipoPersona = 'natural'"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-[1.5px] text-sm transition-all cursor-pointer font-semibold',
            tipoPersona === 'natural'
              ? 'border-[#2b5e3b] bg-[#eef2e9] text-[#1a2e1f] shadow-xs'
              : 'border-gray-200 bg-white text-gray-500 hover:border-[#2b5e3b] hover:text-[#1a2e1f]',
          ]"
        >
          <i class="pi pi-user text-base" />
          Natural
        </button>
        <button
          type="button"
          @click="tipoPersona = 'juridica'"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-[1.5px] text-sm transition-all cursor-pointer font-semibold',
            tipoPersona === 'juridica'
              ? 'border-[#2b5e3b] bg-[#eef2e9] text-[#1a2e1f] shadow-xs'
              : 'border-gray-200 bg-white text-gray-500 hover:border-[#2b5e3b] hover:text-[#1a2e1f]',
          ]"
        >
          <i class="pi pi-building text-base" />
          Jurídica
        </button>
      </div>

      <!-- Sección Información General -->
      <p class="text-[11px] font-semibold text-gray-400 flex items-center gap-2 m-0 after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-100">
        Información general
      </p>

      <!-- Campos Escritorio (Grid de 2 columnas) -->
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2 flex flex-col gap-1.5">
          <label class="text-sm font-medium text-[#1a2e1f]">Nombre *</label>
          <InputText v-model="form.nombre" placeholder="Nombre del proveedor" :pt="inputPt" />
        </div>

        <div class="col-span-2 flex flex-col gap-1.5">
          <label class="text-sm font-medium text-[#1a2e1f]">
            Dirección
            <span class="text-xs font-normal text-gray-400 normal-case ml-1">(opcional)</span>
          </label>
          <InputText
            v-model="form.direccion"
            placeholder="Calle, colonia, municipio..."
            :pt="inputPt"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-[#1a2e1f]">
            Correo electrónico
            <span class="text-xs font-normal text-gray-400 normal-case ml-1">(opcional)</span>
          </label>
          <InputText
            v-model="form.correo"
            type="email"
            placeholder="correo@ejemplo.com"
            :pt="inputPt"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-[#1a2e1f]">Teléfono</label>
          <InputText v-model="form.telefono" type="tel" placeholder="2222-3333" :pt="inputPt" />
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
          @click="visible = false"
        />
        <Button
          label="Guardar proveedor"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold !py-2.5 rounded-xl border-none cursor-pointer shadow-lg transition-colors w-[47%] flex justify-center items-center"
          @click="guardar"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'guardar'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const tipoPersona = ref('natural')

const form = reactive({
  nombre: '',
  direccion: '',
  correo: '',
  telefono: '',
})

function resetForm() {
  Object.assign(form, {
    nombre: '',
    direccion: '',
    correo: '',
    telefono: '',
  })
  tipoPersona.value = 'natural'
}

function guardar() {
  emit('guardar', {
    nombre: form.nombre,
    direccion: form.direccion,
    correo: form.correo,
    telefono: form.telefono,
    tipo_persona: tipoPersona.value === 'natural' ? 'NATURAL' : 'JURIDICA',
    activo: true,
  })
  resetForm()
  visible.value = false
}

const inputPt = {
  root: {
    class:
      'w-full bg-white border border-gray-300 text-[#1a2e1f] text-sm rounded-xl py-2 px-3 focus:outline-none focus:border-[#2b5e3b] transition-all font-inter',
  },
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