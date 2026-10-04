<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="DETALLES DEL PROVEEDOR"
    :draggable="false"
    :closable="false"
    :style="{ width: 'min(calc(100vw - 2rem), 34rem)' }"
    class="custom-dialog"
    :pt="{ root: { class: '!rounded-2xl overflow-hidden shadow-2xl' } }"
  >
    <!-- ======================================================= -->
    <!-- VISTA MÓVIL (< 640px)                                   -->
    <!-- ======================================================= -->
    <div class="block sm:hidden bg-white p-4 text-[#1a2e1f] space-y-4 font-['Inter',sans-serif]">
      
      <!-- Badge de estado Móvil -->
      <div class="flex items-center justify-between">
        <p class="text-[11px] font-semibold tracking-wider text-[#2b5e3b] uppercase m-0 flex items-center gap-1.5">
          <i class="pi pi-user text-[11px]" />
          Información General
        </p>
        <span
          :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase',
            proveedor?.activo ? 'bg-[#e0b354] text-[#1e3a2f]' : 'bg-gray-100 text-gray-600',
          ]"
        >
          {{ proveedor?.activo ? 'Activo' : 'Inactivo' }}
        </span>
      </div>

      <!-- Tarjeta Detalle Móvil -->
      <div class="bg-[#fbfdf9] rounded-xl border border-[#e2e8dd] overflow-hidden shadow-2xs">
        
        <div class="px-3.5 py-2.5 border-b border-[#e2e8dd]">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-0.5">
            Nombre
          </p>
          <span class="text-xs text-[#1a2e1f] font-bold">{{ proveedor?.nombre || '—' }}</span>
        </div>

        <div class="grid grid-cols-2 border-b border-[#e2e8dd]">
          <div class="px-3.5 py-2.5 border-r border-[#e2e8dd]">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-0.5">
              Tipo persona
            </p>
            <span class="text-xs text-[#1a2e1f] font-medium capitalize">
              {{ proveedor?.tipo_persona?.toLowerCase() || '—' }}
            </span>
          </div>
          <div class="px-3.5 py-2.5">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-0.5">
              Teléfono
            </p>
            <span class="font-mono text-xs text-[#1a2e1f] font-medium">{{ proveedor?.telefono || '—' }}</span>
          </div>
        </div>

        <div class="px-3.5 py-2.5 border-b border-[#e2e8dd]">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-0.5">
            Correo electrónico
          </p>
          <span :class="!proveedor?.correo ? 'text-gray-400 italic text-[11px]' : 'text-xs text-gray-700 font-mono'">
            {{ proveedor?.correo || '— no registrado' }}
          </span>
        </div>

        <div class="px-3.5 py-2.5">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-0.5">
            Dirección
          </p>
          <span class="text-xs text-[#1a2e1f] font-medium">{{ proveedor?.direccion || '— no registrada' }}</span>
        </div>
      </div>

      <!-- Botones Móvil -->
      <div class="pt-3 flex flex-col gap-2 w-full">
        <Button
          v-if="proveedor?.activo"
          label="Editar Proveedor"
          icon="pi pi-pencil"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-xs font-bold py-3 rounded-xl border-none cursor-pointer shadow-md w-full"
          @click="$emit('open-edit', proveedor)"
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
      
      <!-- Badge de estado Escritorio -->
      <div class="flex items-center justify-between">
        <p class="text-xs font-semibold tracking-wider text-[#2b5e3b] uppercase m-0 flex items-center gap-1.5">
          <i class="pi pi-user text-xs" />
          Información General
        </p>
        <span
          :class="[
            'inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase',
            proveedor?.activo ? 'bg-[#e0b354] text-[#1e3a2f]' : 'bg-gray-100 text-gray-600',
          ]"
        >
          {{ proveedor?.activo ? 'Activo' : 'Inactivo' }}
        </span>
      </div>

      <!-- Tarjeta Detalle Escritorio -->
      <div class="bg-[#fbfdf9] rounded-2xl border border-[#e2e8dd] overflow-hidden shadow-2xs">
        
        <div class="px-4 py-3 border-b border-[#e2e8dd]">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">
            Nombre
          </p>
          <span class="text-sm text-[#1a2e1f] font-bold">{{ proveedor?.nombre || '—' }}</span>
        </div>

        <div class="grid grid-cols-2 border-b border-[#e2e8dd]">
          <div class="px-4 py-3 border-r border-[#e2e8dd]">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">
              Tipo de persona
            </p>
            <span class="text-sm text-[#1a2e1f] font-medium capitalize">
              {{ proveedor?.tipo_persona?.toLowerCase() || '—' }}
            </span>
          </div>
          <div class="px-4 py-3">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">
              Teléfono
            </p>
            <span class="font-mono text-sm text-[#1a2e1f] font-medium">{{ proveedor?.telefono || '—' }}</span>
          </div>
        </div>

        <div class="px-4 py-3 border-b border-[#e2e8dd]">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">
            Correo electrónico
          </p>
          <span :class="!proveedor?.correo ? 'text-gray-400 italic text-xs' : 'text-sm text-gray-700 font-mono'">
            {{ proveedor?.correo || '— no registrado' }}
          </span>
        </div>

        <div class="px-4 py-3">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">
            Dirección
          </p>
          <span class="text-sm text-[#1a2e1f] font-medium">{{ proveedor?.direccion || '— no registrada' }}</span>
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
          v-if="proveedor?.activo"
          label="Editar Proveedor"
          icon="pi pi-pencil"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold !py-2.5 rounded-xl border-none cursor-pointer shadow-lg transition-colors w-[47%] flex justify-center items-center"
          @click="$emit('open-edit', proveedor)"
        />
      </div>
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


.p-inputtext:enabled:focus,
.p-inputnumber-input:enabled:focus,
.p-select:not(.p-disabled).p-focus,
.p-password-input:enabled:focus {
  box-shadow: 0 0 0 0.125rem rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}
</style>