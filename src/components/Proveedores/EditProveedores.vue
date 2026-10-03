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
      
      <!-- Campos del formulario para Móvil -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-[#1a2e1f]">
          Nombre *
        </label>
        <InputText
          v-model="form.nombre"
          placeholder="Nombre del proveedor"
          class="w-full bg-white text-[#1a2e1f] text-xs py-2.5 px-3 rounded-xl border border-gray-300 focus:border-[#2b5e3b] focus:outline-none"
          @keyup.enter="guardar"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-[#1a2e1f]">
          Correo electrónico
        </label>
        <InputText
          v-model="form.correo"
          type="email"
          placeholder="correo@ejemplo.com"
          class="w-full bg-white text-[#1a2e1f] text-xs py-2.5 px-3 rounded-xl border border-gray-300 focus:border-[#2b5e3b] focus:outline-none"
          @keyup.enter="guardar"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-[#1a2e1f]">
          Teléfono
        </label>
        <InputText
          v-model="form.telefono"
          type="tel"
          placeholder="2222-3333"
          class="w-full bg-white text-[#1a2e1f] text-xs py-2.5 px-3 rounded-xl border border-gray-300 focus:border-[#2b5e3b] focus:outline-none"
          @keyup.enter="guardar"
        />
      </div>

      <!-- Botones Móvil -->
      <div class="pt-3 flex flex-col gap-2 w-full">
        <Button
          label="Guardar"
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
      
      <!-- Campos del formulario para Escritorio -->
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-[#1a2e1f]">
          Nombre *
        </label>
        <InputText
          v-model="form.nombre"
          placeholder="Nombre del proveedor"
          class="w-full bg-white text-[#1a2e1f] text-sm py-2.5 px-3.5 rounded-xl border border-gray-300 focus:border-[#2b5e3b] focus:outline-none"
          @keyup.enter="guardar"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-[#1a2e1f]">
          Correo electrónico
        </label>
        <InputText
          v-model="form.correo"
          type="email"
          placeholder="correo@ejemplo.com"
          class="w-full bg-white text-[#1a2e1f] text-sm py-2.5 px-3.5 rounded-xl border border-gray-300 focus:border-[#2b5e3b] focus:outline-none"
          @keyup.enter="guardar"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-[#1a2e1f]">
          Teléfono
        </label>
        <InputText
          v-model="form.telefono"
          type="tel"
          placeholder="2222-3333"
          class="w-full bg-white text-[#1a2e1f] text-sm py-2.5 px-3.5 rounded-xl border border-gray-300 focus:border-[#2b5e3b] focus:outline-none"
          @keyup.enter="guardar"
        />
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
          label="Guardar"
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
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  proveedor:  { type: Object, default: null },
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

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.proveedor) {
    const p = props.proveedor
    form.id           = p.id           ?? null
    form.nombre       = p.nombre       ?? ''
    form.correo       = p.correo       ?? ''
    form.telefono     = p.telefono     ?? ''
    form.direccion    = p.direccion    ?? ''
    form.tipo_persona = p.tipo_persona ?? ''
    form.nit          = p.nit          ?? ''
    form.nrc          = p.nrc          ?? ''
    form.dui          = p.dui          ?? null
    form.activo       = p.activo       ?? true
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
}

function guardar() {
  const payload = { id: form.id }

  if (form.nombre?.trim())   payload.nombre   = form.nombre.trim()
  if (form.correo?.trim())   payload.correo   = form.correo.trim()
  if (form.telefono?.trim()) payload.telefono = form.telefono.trim()

  emit('actualizar', payload)
  visible.value = false
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