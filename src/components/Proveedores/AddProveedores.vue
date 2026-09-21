<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :style="{ width: '560px' }"
    :pt="{
      root: { class: '!rounded-2xl overflow-hidden border-0 shadow-2xl' },
      header: { style: 'display: none;' },
      content: { class: 'p-0' },
      footer: { style: 'display: none;' },
      mask: { style: 'background: rgba(10, 25, 15, 0.55);' },
    }"
  >
    <!-- Header (Sin la X de cierre) -->
    <div class="flex items-center justify-between px-6 py-4" style="background: #1e3a2f">
      <h2 class="text-white text-base font-bold m-0 font-inter uppercase tracking-wider">
        AGREGAR PROVEEDOR
      </h2>
    </div>

    <!-- Body -->
    <div class="px-6 py-6 bg-white font-inter flex flex-col gap-5">
      <!-- Tipo de persona -->
      <div class="flex gap-3">
        <button
          @click="tipoPersona = 'natural'"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-[1.5px] text-sm font-inter transition-all cursor-pointer',
            tipoPersona === 'natural'
              ? 'border-[#2b5e3b] bg-[#eef2e9] text-[#1a2e1f] font-semibold shadow-xs'
              : 'border-gray-200 bg-white text-gray-500 font-normal hover:border-[#2b5e3b] hover:text-[#1a2e1f]',
          ]"
        >
          <i class="pi pi-user text-base" />
          Natural
        </button>
        <button
          @click="tipoPersona = 'juridica'"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-[1.5px] text-sm font-inter transition-all cursor-pointer',
            tipoPersona === 'juridica'
              ? 'border-[#2b5e3b] bg-[#eef2e9] text-[#1a2e1f] font-semibold shadow-xs'
              : 'border-gray-200 bg-white text-gray-500 font-normal hover:border-[#2b5e3b] hover:text-[#1a2e1f]',
          ]"
        >
          <i class="pi pi-building text-base" />
          Jurídica
        </button>
      </div>

      <!-- Información general -->
      <p
        class="text-[11px] font-semibold tracking-normal text-gray-400 flex items-center gap-2 m-0 font-inter after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-100"
      >
        Información general
      </p>

      <div class="grid grid-cols-2 gap-x-4 gap-y-4">
        <div class="col-span-2 flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight font-inter"
            >Nombre</label
          >
          <InputText v-model="form.nombre" placeholder="Nombre del proveedor" :pt="inputPt" />
        </div>

        <div class="col-span-2 flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight font-inter">
            Dirección
            <span class="text-[11px] font-normal text-gray-400 normal-case ml-1">(opcional)</span>
          </label>
          <InputText
            v-model="form.direccion"
            placeholder="Calle, colonia, municipio..."
            :pt="inputPt"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight font-inter">
            Correo electrónico
            <span class="text-[11px] font-normal text-gray-400 normal-case ml-1">(opcional)</span>
          </label>
          <InputText
            v-model="form.correo"
            type="email"
            placeholder="correo@ejemplo.com"
            :pt="inputPt"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight font-inter"
            >Teléfono</label
          >
          <InputText v-model="form.telefono" type="tel" placeholder="2222-3333" :pt="inputPt" />
        </div>
      </div>
    </div>

    <!-- Footer Corregido (Botones Holgados con Iconos) -->
    <div class="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-white">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        @click="visible = false"
        class="!px-5 !py-2.5 !rounded-xl !border !border-gray-200 !bg-white !text-gray-600 hover:!border-[#2b5e3b] hover:!text-[#1a2e1f] !text-sm !font-semibold transition-all cursor-pointer whitespace-nowrap"
      />
      <Button
        label="Guardar proveedor"
        icon="pi pi-"
        @click="guardar"
        class="!px-6 !py-2.5 !rounded-xl !border-none !bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white !text-sm !font-semibold transition-all cursor-pointer shadow-sm whitespace-nowrap"
      />
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
      'w-full bg-white border border-gray-200 text-[#1a2e1f] text-[14px] rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#2b5e3b] transition-all font-inter',
  },
}
</script>