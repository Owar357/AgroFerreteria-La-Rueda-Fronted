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
    <div class="flex items-center justify-between px-5 py-3.5" style="background: #1e3a2f;">
      <div class="flex items-center gap-3">
        <h2 class="text-white text-base font-semibold m-0 font-inter">Agregar proveedor</h2>
        <span class="text-xs px-3 py-0.5 rounded-full font-inter" style="background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.85);">
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
    <div class="px-6 py-5 bg-white font-inter">

      <!-- Tipo de persona -->
      <div class="flex gap-2.5 mb-5">
        <button
          @click="tipoPersona = 'natural'"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-[1.5px] text-sm font-inter transition-all cursor-pointer',
            tipoPersona === 'natural'
              ? 'border-[#2b5e3b] bg-[#dff0e0] text-[#1e3a2f] font-semibold'
              : 'border-[#c8ddd0] bg-white text-[#4b5563] font-normal hover:border-[#2b5e3b] hover:text-[#1a2e1f]'
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
              ? 'border-[#2b5e3b] bg-[#dff0e0] text-[#1e3a2f] font-semibold'
              : 'border-[#c8ddd0] bg-white text-[#4b5563] font-normal hover:border-[#2b5e3b] hover:text-[#1a2e1f]'
          ]"
        >
          <i class="pi pi-building text-base" />
          Jurídica
        </button>
      </div>

      <!-- Información general -->
      <p class="text-[11px] font-semibold tracking-widest uppercase text-[#4b5563] mb-2.5 font-inter">Información general</p>
      <div class="grid grid-cols-2 gap-3 mb-1">

        <div class="col-span-2 flex flex-col gap-1">
          <label class="text-[12.5px] font-medium text-[#1a2e1f] font-inter">Nombre</label>
          <InputText
            v-model="form.nombre"
            placeholder="Nombre del proveedor"
            :pt="inputPt"
          />
        </div>

        <div class="col-span-2 flex flex-col gap-1">
          <label class="text-[12.5px] font-medium text-[#1a2e1f] font-inter">
            Dirección
            <span class="text-[11px] font-normal text-[#6b7280] ml-1">(opcional)</span>
          </label>
          <InputText
            v-model="form.direccion"
            placeholder="Calle, colonia, municipio..."
            :pt="inputPt"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[12.5px] font-medium text-[#1a2e1f] font-inter">Correo electrónico</label>
          <InputText
            v-model="form.correo"
            type="email"
            placeholder="correo@ejemplo.com"
            :pt="inputPt"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[12.5px] font-medium text-[#1a2e1f] font-inter">Teléfono</label>
          <InputText
            v-model="form.telefono"
            type="tel"
            placeholder="2222-3333"
            :pt="inputPt"
          />
        </div>

      </div>

      <hr class="border-t border-[#dce8dc] my-3.5" />

      <!-- Documentos fiscales -->
      <p class="text-[11px] font-semibold tracking-widest uppercase text-[#4b5563] mb-2.5 font-inter">Documentos fiscales</p>
      <div class="grid grid-cols-2 gap-3 mb-1">

        <div v-if="tipoPersona === 'natural'" class="flex flex-col gap-1">
          <label class="text-[12.5px] font-medium text-[#1a2e1f] font-inter">DUI</label>
          <InputText
            v-model="form.dui"
            placeholder="00000000-0"
            :maxlength="10"
            :pt="inputPt"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[12.5px] font-medium text-[#1a2e1f] font-inter">NIT</label>
          <InputText
            v-model="form.nit"
            placeholder="0000-000000-000-0"
            :maxlength="17"
            :pt="inputPt"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[12.5px] font-medium text-[#1a2e1f] font-inter">
            NRC
            <span class="text-[11px] font-normal text-[#6b7280] ml-1">(opcional)</span>
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
    <div class="flex justify-end gap-2.5 px-6 py-3.5 border-t border-[#dce8dc]" style="background: #eef2e9;">
      <Button
        label="Cancelar"
        @click="visible = false"
        :pt="{
          root: { class: 'px-5 py-2 rounded-lg border border-[#c8ddd0] bg-white text-[#4b5563] text-sm font-medium font-inter hover:border-[#2b5e3b] hover:text-[#1a2e1f] transition-all cursor-pointer' },
          label: { class: 'font-inter font-medium text-sm' },
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
import Select from 'primevue/select'
import Button from 'primevue/button'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
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
  dui: '',
  nit: '',
  nrc: '',
  estado: 'activo',
})

const estadoOptions = [
  { label: 'Activo', value: 'activo' },
  { label: 'Inactivo', value: 'inactivo' },
]

// Passthrough reutilizable para todos los InputText
const inputPt = {
  root: {
    class: 'w-full h-9 px-2.5 rounded-lg border border-[#c8ddd0] bg-white text-sm text-[#1a2e1f] font-inter placeholder-[#b0c4ba] focus:border-[#2b5e3b] focus:ring-2 focus:ring-[#2b5e3b]/10 focus:outline-none transition-all',
  },
}

function guardar() {
  const payload = {
    tipoPersona: tipoPersona.value,
    ...form,
  }
  if (tipoPersona.value === 'juridica') {
    delete payload.dui
  }
  emit('guardar', payload)
  visible.value = false
}
</script>