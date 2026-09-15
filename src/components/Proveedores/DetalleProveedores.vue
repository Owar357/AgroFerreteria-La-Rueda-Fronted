<template>
  <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '560px' }" :pt="{
    root: { class: '!rounded-2xl overflow-hidden border-0 shadow-2xl' },
    header: { style: 'display: none;' },
    content: { class: 'p-0' },
    footer: { style: 'display: none;' },
    mask: { style: 'background: rgba(10, 25, 15, 0.55);' },
  }">
    <!-- Header (Estandarizado y sin la X redundante) -->
    <div class="flex items-center justify-between px-6 py-4 bg-[#1e3a2f]">
      <div class="flex items-center gap-3">
        <i class="pi pi-info-circle text-white text-base" />
        <h2 class="text-white text-base font-bold m-0 font-inter uppercase tracking-wider">
          DETALLES DEL PROVEEDOR
        </h2>
      </div>
    </div>

    <!-- Body / Fondo Blanco Puro -->
    <div class="px-6 py-6 bg-white font-inter flex flex-col gap-4">
      <!-- Badge de estado flotante arriba -->
      <div class="flex items-center justify-between">
        <p class="text-[12px] font-semibold tracking-wider text-[#2b5e3b] uppercase m-0 flex items-center gap-1.5">
          <i class="pi pi-user text-[12px]" />
          Información General
        </p>
        <span :class="[
          'inline-flex items-center px-3 py-0.5 rounded-[40px] text-[11px] font-semibold tracking-wide uppercase',
          proveedor?.activo ? 'bg-[#e0b354] text-[#1e3a2f]' : 'bg-gray-100 text-gray-600',
        ]">
          {{ proveedor?.activo ? 'Activo' : 'Inactivo' }}
        </span>
      </div>

      <!-- Grupo: Tarjeta Interna con Fondos y Bordes Delimitados -->
      <div class="bg-[#fbfdf9] rounded-2xl border border-[#e2e8dd] overflow-hidden shadow-2xs">

        <!-- Nombre -->
        <div class="px-4 py-3 border-b border-[#e2e8dd]">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">
            Nombre
          </p>
          <span class="text-[14px] text-[#1a2e1f] font-bold">{{ proveedor?.nombre || '—' }}</span>
        </div>

        <!-- Tipo persona + Teléfono -->
        <div class="grid grid-cols-2 border-b border-[#e2e8dd]">
          <div class="px-4 py-3 border-r border-[#e2e8dd]">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">
              Tipo de persona
            </p>
            <span class="text-[14px] text-[#1a2e1f] font-medium capitalize">
              {{ proveedor?.tipo_persona?.toLowerCase() || '—' }}
            </span>
          </div>
          <div class="px-4 py-3">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">
              Teléfono
            </p>
            <span class="font-mono text-[14px] text-[#1a2e1f] font-medium">{{ proveedor?.telefono || '—' }}</span>
          </div>
        </div>

        <!-- Correo -->
        <div class="px-4 py-3 border-b border-[#e2e8dd]">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">
            Correo electrónico
          </p>
          <span :class="!proveedor?.correo ? 'text-gray-400 italic text-[13px]' : 'text-[14px] text-gray-700 font-mono'
            ">
            {{ proveedor?.correo || '— no registrado' }}
          </span>
        </div>

        <!-- Dirección -->
        <div class="px-4 py-3">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">
            Dirección
          </p>
          <span class="text-[14px] text-[#1a2e1f] font-medium">{{ proveedor?.direccion || '— no registrada' }}</span>
        </div>
      </div>
    </div>

    <!-- Footer Alineado a la Derecha -->
    <div class="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-white">
      <Button label="Cerrar" icon="pi pi-times" @click="visible = false"
        class="!px-5 !py-2.5 !rounded-xl !border !border-gray-200 !bg-white !text-gray-600 hover:!border-[#2b5e3b] hover:!text-[#1a2e1f] !text-sm !font-semibold transition-all cursor-pointer whitespace-nowrap" />
      <Button v-if="proveedor?.activo" label="Editar Proveedor" icon="pi pi-pencil"
        @click="$emit('open-edit', proveedor)"
        class="!px-6 !py-2.5 !rounded-xl !border-none !bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white !text-sm !font-semibold transition-all cursor-pointer shadow-sm whitespace-nowrap" />
    </div>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  proveedor: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'open-edit'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>