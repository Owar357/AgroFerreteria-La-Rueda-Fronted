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
    <div class="px-6 py-5 bg-[#eef2e9] font-inter flex flex-col gap-4">

      <!-- Badge de estado flotante arriba -->
      <div class="flex items-center justify-between">
        <p class="text-[11px] font-semibold tracking-wider text-[#2b5e3b] uppercase m-0 flex items-center gap-1.5">
          <i class="pi pi-user text-[11px]" />
          Información General
        </p>
        <span
          :class="[
            'inline-flex items-center px-3 py-0.5 rounded-[40px] text-[11px] font-semibold tracking-wide uppercase',
            proveedor?.estado === 'Activo' ? 'bg-[#e0b354] text-[#1e3a2f]' : 'bg-[#f2f5ef] text-[#2f573b]'
          ]"
        >
          {{ proveedor?.estado || 'Inactivo' }}
        </span>
      </div>

      <!-- Grupo: Información General -->
      <div class="bg-white rounded-xl border border-[#e2e8dd] overflow-hidden shadow-sm">
        <!-- Nombre -->
        <div class="px-4 py-3 border-b border-[#e2e8dd]">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">Nombre</p>
          <span class="text-[14px] text-[#1a2e1f] font-medium">{{ proveedor?.nombre }}</span>
        </div>
        <!-- Tipo persona + Teléfono -->
        <div class="grid grid-cols-2">
          <div class="px-4 py-3 border-r border-[#e2e8dd]">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">Tipo de persona</p>
            <span class="text-[14px] text-[#1a2e1f]">{{ proveedor?.tipo_persona || '—' }}</span>
          </div>
          <div class="px-4 py-3">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">Teléfono</p>
            <span class="font-mono text-[14px] text-[#1a2e1f]">{{ proveedor?.telefono }}</span>
          </div>
        </div>
        <!-- Correo -->
        <div class="px-4 py-3 border-t border-[#e2e8dd]">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">Correo electrónico</p>
          <span :class="!proveedor?.correo ? 'text-gray-400 italic text-[13px]' : 'text-[14px] text-[#4b5563]'">
            {{ proveedor?.correo || '— no registrado' }}
          </span>
        </div>
        <!-- Dirección -->
        <div class="px-4 py-3 border-t border-[#e2e8dd]">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">Dirección</p>
          <span class="text-[14px] text-[#1a2e1f]">{{ proveedor?.direccion }}</span>
        </div>
      </div>

      <!-- Título grupo fiscal -->
      <p class="text-[11px] font-semibold tracking-wider text-[#2b5e3b] uppercase m-0 flex items-center gap-1.5">
        <i class="pi pi-file text-[11px]" />
        Datos Fiscales
      </p>

      <!-- Grupo: Datos Fiscales -->
      <div class="bg-white rounded-xl border border-[#e2e8dd] overflow-hidden shadow-sm">
        <!-- NRC + NIT -->
        <div class="grid grid-cols-2">
          <div class="px-4 py-3 border-r border-[#e2e8dd]">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">NRC</p>
            <span :class="!proveedor?.nrc ? 'text-gray-400 italic text-[13px]' : 'font-mono text-[14px] text-[#1a2e1f]'">
              {{ proveedor?.nrc || '— no registrado' }}
            </span>
          </div>
          <div class="px-4 py-3">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">NIT</p>
            <span :class="!proveedor?.nit ? 'text-gray-400 italic text-[13px]' : 'font-mono text-[14px] text-[#1a2e1f]'">
              {{ proveedor?.nit || '— no registrado' }}
            </span>
          </div>
        </div>
        <!-- DUI -->
        <div class="px-4 py-3 border-t border-[#e2e8dd]">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">DUI</p>
          <span :class="!proveedor?.dui ? 'text-gray-400 italic text-[13px]' : 'font-mono text-[14px] text-[#1a2e1f]'">
            {{ proveedor?.dui || '— no registrado' }}
          </span>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="flex justify-center gap-2.5 px-6 py-5 border-t border-[#e2e8dd] bg-[#eef2e9]">
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