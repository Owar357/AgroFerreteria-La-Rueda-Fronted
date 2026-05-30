<!-- ModalDetalleProveedor.vue -->
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
        <i class="pi pi-info-circle text-white text-base" />
        <!-- Título principal cambiado a MAYÚSCULAS -->
        <h2 class="text-white text-base font-semibold m-0 font-inter uppercase tracking-wide">DETALLES DEL PROVEEDOR</h2>
      </div>
      <button
        @click="visible = false"
        class="text-white/70 hover:text-white hover:bg-white/10 rounded-md p-1 transition-all border-0 bg-transparent cursor-pointer"
      >
        <i class="pi pi-times text-sm" />
      </button>
    </div>

    <!-- Body -->
    <div class="px-6 py-5 bg-white font-inter flex flex-col gap-4">

      <!-- Encabezado de sección con Estado separado a la derecha -->
      <div class="flex items-center justify-between border-b border-gray-100 pb-2 m-0">
        <p class="text-[11px] font-semibold tracking-normal text-gray-400 font-inter uppercase m-0">
          Información general
        </p>
        <!-- Estado fuera de los inputs, ordenado a la derecha -->
        <span 
          :class="[
            'inline-flex items-center px-3 py-0.5 rounded-[40px] text-[11px] font-semibold font-inter tracking-wide uppercase', 
            proveedor?.estado === 'Activo' ? 'bg-[#e0b354] text-[#1e3a2f]' : 'bg-[#f2f5ef] text-[#2f573b]'
          ]"
        >
          {{ proveedor?.estado || 'Inactivo' }}
        </span>
      </div>
      
      <div class="grid grid-cols-2 gap-2.5">
        <!-- Nombre completo -->
        <div class="col-span-2 bg-white border border-gray-200 shadow-sm rounded-lg px-3.5 py-2.5">
          <p class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight mb-1.5 font-inter">Nombre</p>
          <span class="text-[14px] font-normal text-[#1a2e1f] font-inter block">{{ proveedor?.nombre }}</span>
        </div>

        <!-- Tipo de persona -->
        <div class="bg-white border border-gray-200 shadow-sm rounded-lg px-3.5 py-2.5">
          <p class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight mb-1.5 font-inter">Tipo de persona</p>
          <span class="text-[14px] font-normal text-[#1a2e1f] font-inter block">{{ proveedor?.tipo_persona || '—' }}</span>
        </div>

        <!-- Teléfono -->
        <div class="bg-white border border-gray-200 shadow-sm rounded-lg px-3.5 py-2.5">
          <p class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight mb-1.5 font-inter">Teléfono</p>
          <span class="font-mono text-[13.5px] text-[#1a2e1f] block">{{ proveedor?.telefono }}</span>
        </div>

        <!-- Correo electrónico -->
        <div class="col-span-2 bg-white border border-gray-200 shadow-sm rounded-lg px-3.5 py-2.5">
          <p class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight mb-1.5 font-inter">Correo electrónico</p>
          <span 
            :class="[
              'text-[14px] block font-inter', 
              !proveedor?.correo ? 'text-gray-400 italic text-[13.5px]' : 'text-[#4b5563]'
            ]"
          >
            {{ proveedor?.correo || '— no registrado' }}
          </span>
        </div>

        <!-- Dirección -->
        <div class="col-span-2 bg-white border border-gray-200 shadow-sm rounded-lg px-3.5 py-2.5">
          <p class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight mb-1.5 font-inter">Dirección</p>
          <span class="text-[14px] font-normal text-[#1a2e1f] font-inter block">{{ proveedor?.direccion }}</span>
        </div>
      </div>

      <!-- Datos fiscales -->
      <p class="text-[11px] font-semibold tracking-normal text-gray-400 flex items-center gap-2 m-0 font-inter after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-100">
        Datos fiscales
      </p>
      
      <div class="grid grid-cols-2 gap-2.5">
        <!-- NRC -->
        <div class="bg-white border border-gray-200 shadow-sm rounded-lg px-3.5 py-2.5">
          <p class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight mb-1.5 font-inter">NRC</p>
          <span 
            :class="[
              'font-mono block', 
              !proveedor?.nrc ? 'text-gray-400 italic text-[13.5px]' : 'text-[13.5px] text-[#1a2e1f]'
            ]"
          >
            {{ proveedor?.nrc || '— no registrado' }}
          </span>
        </div>

        <!-- NIT -->
        <div class="bg-white border border-gray-200 shadow-sm rounded-lg px-3.5 py-2.5">
          <p class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight mb-1.5 font-inter">NIT</p>
          <span 
            :class="[
              'font-mono block', 
              !proveedor?.nit ? 'text-gray-400 italic text-[13.5px]' : 'text-[13.5px] text-[#1a2e1f]'
            ]"
          >
            {{ proveedor?.nit || '— no registrado' }}
          </span>
        </div>

        <!-- DUI -->
        <div class="col-span-2 bg-white border border-gray-200 shadow-sm rounded-lg px-3.5 py-2.5">
          <p class="text-[12.5px] font-semibold text-[#1a2e1f] tracking-tight mb-1.5 font-inter">DUI</p>
          <span 
            :class="[
              'font-mono block', 
              !proveedor?.dui ? 'text-gray-400 italic text-[13.5px]' : 'text-[13.5px] text-[#1a2e1f]'
            ]"
          >
            {{ proveedor?.dui || '— no registrado' }}
          </span>
        </div>
      </div>

    </div>

    <!-- Footer (Botones centrados, fondo blanco y borde limpio) -->
    <div class="flex justify-center gap-2.5 px-6 py-5 border-t border-gray-100 bg-white">
      <Button
        label="Cerrar"
        @click="visible = false"
        :pt="{
          root: { class: 'px-5 py-2 rounded-lg border border-gray-200 bg-white text-gray-500 text-sm font-semibold font-inter hover:border-[#2b5e3b] hover:text-[#1a2e1f] transition-all cursor-pointer' },
          label: { class: 'font-inter font-semibold text-sm' },
        }"
        text
      />
      <Button
        @click="$emit('open-edit', proveedor)"
        style="background: #2b5e3b;"
        :pt="{
          root: { class: 'flex items-center gap-2 px-6 py-2 rounded-lg border-0 text-white text-sm font-semibold font-inter transition-all cursor-pointer' },
          label: { class: 'font-inter font-semibold text-sm' },
        }"
      >
        <template #icon><i class="pi pi-pencil text-sm" /></template>
        <template #default>Editar Proveedor</template>
      </Button>
    </div>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  proveedor:  { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'open-edit'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>
