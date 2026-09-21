<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="EDITAR PROVEEDOR"
    :style="{ width: '450px' }"
    :draggable="false"
    class="custom-dialog"
    :pt="{ root: { class: 'rounded-2xl overflow-hidden' } }"
  >
    <div class="bg-[#ffffff] p-2 text-[#1a2e1f] flex flex-col gap-6 font-['Inter',sans-serif]">

      <!-- Nombre -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Nombre: <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="form.nombre"
          placeholder="Nombre del proveedor"
          class="w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg border-[#d1d5db]"
          @keyup.enter="guardar"
        />
      </div>

      <!-- Correo electrónico -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Correo electrónico:
        </label>
        <InputText
          v-model="form.correo"
          type="email"
          placeholder="correo@ejemplo.com"
          class="w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg border-[#d1d5db]"
          @keyup.enter="guardar"
        />
      </div>

      <!-- Teléfono -->
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">
          Teléfono:
        </label>
        <InputText
          v-model="form.telefono"
          type="tel"
          placeholder="2222-3333"
          class="w-full bg-[#f9fafb] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg border-[#d1d5db]"
          @keyup.enter="guardar"
        />
      </div>

      <!-- Acciones (Botones con la misma distancia y tamaño de EditCategoria) -->
      <div class="flex justify-between gap-4 mt-2">
        <Button
          label="Cancelar"
          class="!bg-white hover:!bg-[#e2e8dd] !text-[#1a2e1f] text-[14px] font-semibold px-4 py-4 rounded-lg !border !border-[#cbd5e1] cursor-pointer transition-colors"
          @click="visible = false"
        />
        <Button
          label="Guardar"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-4 py-4 rounded-lg border-none cursor-pointer shadow-md transition-colors"
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

// Carga los campos al abrir el modal manteniendo la lógica de negocio intacta
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
.custom-dialog .p-dialog-header {
  background-color: #1e3a2f !important;
  color: #ffffff !important;
  border-bottom: 1px solid #e2e8dd;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 1.25rem 1.5rem !important;
}

.custom-dialog .p-dialog-content {
  background-color: #ffffff !important;
  padding: 1.5rem !important;
}

.p-inputtext:enabled:focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>