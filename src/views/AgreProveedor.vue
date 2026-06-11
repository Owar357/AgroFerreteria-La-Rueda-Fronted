
<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :style="{ width: '560px' }"
    :pt="{
      root: { class: 'rounded-xl overflow-hidden border-0 shadow-xl' },
      header: { style: 'display: none;' },
      content: { class: 'p-0' },
      footer: { style: 'display: none;' },
      mask: { style: 'background: rgba(10, 25, 15, 0.55);' },
    }"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4" style="background: #1e3a2f;">
      <div class="flex items-center gap-3">
        
        <h2 class="text-white text-base font-semibold m-0 font-inter uppercase tracking-wide">AGREGAR PROVEEDOR</h2>
        <span class="text-[11px] px-3 py-0.5 rounded-[40px] font-semibold font-inter tracking-wide bg-[#e0b354] text-[#1e3a2f]">
          {{ tipoPersona === 'natural' ? 'Persona natural' : 'Persona jurídica' }}
        </span>
      </div>
      <button
        @click="visible = false"
        class="text-white/70 hover:text-white hover:bg-white/10 rounded-md p-1 transition-all border-0 bg-transparent cursor-pointer"
        aria-label="Cerrar"
      >
        <i class="pi pi-times text-sm" />
      </button>
    </div>

    <!-- Body -->
    <div class="px-6 py-6 bg-white font-inter flex flex-col gap-5">

      <!-- Tipo de persona -->
      <div class="flex gap-3">
        <button
          @click="tipoPersona = 'natural'"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-[1.5px] text-sm font-inter transition-all cursor-pointer',
            tipoPersona === 'natural'
              ? 'border-[#2b5e3b] bg-[#eef2e9] text-[#1a2e1f] font-semibold shadow-sm'
              : 'border-gray-200 bg-white text-gray-500 font-normal hover:border-[#2b5e3b] hover:text-[#1a2e1f]'
          ]"
        >
          <i class="pi pi-user text-base" />
          Natural
        </button>
        <button
          @click="tipoPersona = 'juridica'"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-[1.5px] text-sm font-inter transition-all cursor-pointer',
            tipoPersona === 'juridica'
              ? 'border-[#2b5e3b] bg-[#eef2e9] text-[#1a2e1f] font-semibold shadow-sm'
              : 'border-gray-200 bg-white text-gray-500 font-normal hover:border-[#2b5e3b] hover:text-[#1a2e1f]'
          ]"
        >
          <i class="pi pi-building text-base" />
          Jurídica
        </button>
      </div>

      <!-- Información general -->
      <p class="text-[11px] font-semibold tracking-normal text-gray-400 flex items-center gap-2 m-0 font-inter after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-100">
        Información general
      </p>
      
      <div class="grid grid-cols-2 gap-x-4 gap-y-4">

        <div class="col-span-2 flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight font-inter">Nombre</label>
          <InputText
            v-model="form.nombre"
            placeholder="Nombre del proveedor"
            :pt="inputPt"
          />
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
          <label class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight font-inter">Correo electrónico</label>
          <InputText
            v-model="form.correo"
            type="email"
            placeholder="correo@ejemplo.com"
            :pt="inputPt"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight font-inter">Teléfono</label>
          <InputText
            v-model="form.telefono"
            type="tel"
            placeholder="2222-3333"
            :pt="inputPt"
          />
        </div>

      </div>

      <!-- Documentos fiscales -->
      <p class="text-[11px] font-semibold tracking-normal text-gray-400 flex items-center gap-2 m-0 font-inter after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-100 mt-2">
        Documentos fiscales
      </p>
      
      <div class="grid grid-cols-2 gap-x-4 gap-y-4 mb-1">

        <div v-if="tipoPersona === 'natural'" class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight font-inter">DUI</label>
          <InputText
            v-model="form.dui"
            placeholder="00000000-0"
            :maxlength="10"
            :pt="inputPt"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight font-inter">NIT</label>
          <InputText
            v-model="form.nit"
            placeholder="0000-000000-000-0"
            :maxlength="17"
            :pt="inputPt"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight font-inter">
            NRC
            <span class="text-[11px] font-normal text-gray-400 normal-case ml-1">(opcional)</span>
          </label>
          <InputText
            v-model="form.nrc"
            placeholder="000000-0"
            :maxlength="8"
            :pt="inputPt"
          />
        </div>

      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-center gap-2.5 px-6 py-5 border-t border-gray-100 bg-white">
      <Button
        label="Cancelar"
        @click="visible = false"
        :pt="{
          root: { class: 'px-5 py-2 rounded-lg border border-gray-200 bg-white text-gray-500 text-sm font-semibold font-inter hover:border-[#2b5e3b] hover:text-[#1a2e1f] transition-all cursor-pointer' },
          label: { class: 'font-inter font-semibold text-sm' },
        }"
        text
      />
      <Button
        @click="guardar"
        :pt="{
          root: { class: 'flex items-center gap-2 px-7 py-2 rounded-lg border-0 text-white text-sm font-semibold font-inter transition-all cursor-pointer' },
          label: { class: 'font-inter font-semibold text-sm' },
        }"
        style="background: #2b5e3b;"
        @mouseenter="(e) => e.currentTarget.style.background = '#1f482d'"
        @mouseleave="(e) => e.currentTarget.style.background = '#2b5e3b'"
      >
        <template #icon>
          <i class="pi pi-check-circle text-sm" />
        </template>
        <template #default>Guardar proveedor</template>
      </Button>
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
  nombre: '', direccion: '', correo: '',
  telefono: '', dui: '', nit: '', nrc: '',
})

function resetForm() {
  Object.assign(form, {
    nombre: '', direccion: '', correo: '',
    telefono: '', dui: '', nit: '', nrc: '',
  })
  tipoPersona.value = 'natural'
}

function guardar() {
  emit('guardar', {
    nombre:       form.nombre,
    direccion:    form.direccion,
    correo:       form.correo,
    telefono:     form.telefono,
    tipo_persona: tipoPersona.value === 'natural' ? 'NATURAL' : 'JURIDICA',
    nit:          form.nit,
    nrc:          form.nrc,
    dui:          tipoPersona.value === 'natural' ? form.dui : null,
    activo:       true,
  })
  resetForm()
  visible.value = false
}

const inputPt = {
  root: {
    class: 'w-full bg-white border border-gray-200 text-[#1a2e1f] text-[14px] rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#2b5e3b] transition-all font-inter',
  },
}

</script>
