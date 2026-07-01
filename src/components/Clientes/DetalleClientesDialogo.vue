<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="client?.personType === 'Natural' ? 'Detalle del cliente ' : 'Detalle del cliente '"
    :style="{ width: '580px', maxWidth: '90vw' }"
    modal
    :draggable="false"
    :pt="{
      root: { class: 'font-sans bg-white rounded-xl shadow-lg border border-[#e2e8dd] overflow-hidden' },
      header: { class: 'bg-[#1e3a2f] text-white text-[13px] font-semibold uppercase tracking-wider px-5 py-4 border-b border-[#162e1e]' },
      closeButton: { class: 'text-[#e0b354] hover:bg-[#2b5e3b]/30 transition-colors duration-200' },
      content: { class: 'bg-[#eef2e9] !px-6 !py-5' },
      footer: { class: 'bg-[#eef2e9] px-6 py-4 border-t border-[#e2e8dd] flex justify-center' }
    }"
  >
    <template v-if="client">

      <!-- Avatar + nombre -->
      <div class="flex flex-row items-center gap-4 mb-5 pb-5 border-b border-[#d4e2d0]">
        
        <div style="width:48px; height:48px; min-width:48px; min-height:48px;"
             class="rounded-full flex items-center justify-center bg-[#1e3a2f] border border-[#e0b354] shadow-sm">
          <i :class="client.personType === 'Natural' ? 'pi pi-user' : 'pi pi-building'"
             class="text-[20px] text-[#e0b354]" />
        </div>

        <div class="flex flex-col gap-1 overflow-hidden">
          <h2 class="text-[20px] font-semibold text-[#1a2e1f] m-0 leading-snug truncate">
            {{ client.name }}
          </h2>
          <span class="self-start px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-[#e0b354] text-[#1e3a2f]">
            {{ client.personType }}
          </span>
        </div>
      </div>

      <!-- Secciones -->
      <div class="flex flex-col gap-4">

        <!-- Identificación -->
        <div>
          <div class="flex items-center gap-2 mb-2 text-[#2b5e3b] font-semibold text-[12px] uppercase tracking-wider">
            <i class="pi pi-id-card text-[13px]" />
            <span>Identificación y Registro</span>
          </div>
          <div class="grid grid-cols-2 gap-4 bg-white px-4 py-3 rounded-xl border border-[#e2e8dd]">
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">N° Documento</label>
              <p class="font-mono text-[14px] text-[#1a2e1f] font-medium m-0">{{ client.documentNumber || '—' }}</p>
            </div>
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">NRC</label>
              <p class="font-mono text-[14px] text-[#1a2e1f] font-medium m-0">{{ client.nrc || '—' }}</p>
            </div>
          </div>
        </div>

        <!-- Contacto -->
        <div>
          <div class="flex items-center gap-2 mb-2 text-[#2b5e3b] font-semibold text-[12px] uppercase tracking-wider">
            <i class="pi pi-envelope text-[13px]" />
            <span>Información de Contacto</span>
          </div>
          <div class="grid grid-cols-2 gap-4 bg-white px-4 py-3 rounded-xl border border-[#e2e8dd]">
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">Teléfono</label>
              <p class="flex items-center gap-1.5 text-[14px] text-[#1a2e1f] m-0">
                <i class="pi pi-phone text-[12px] text-[#6b7280]" style="flex-shrink:0" />
                {{ client.phone || '—' }}
              </p>
            </div>
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">Correo electrónico</label>
              <p class="flex items-center gap-1.5 text-[14px] text-[#4b5563] m-0">
                <i class="pi pi-envelope text-[12px] text-[#6b7280]" style="flex-shrink:0" />
                <span class="break-all">{{ client.email || '—' }}</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </template>

    <template #footer>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        class="!bg-[#1e3a2f] hover:!bg-[#2b5e3b] !text-white border-none rounded-xl w-40 h-11 text-[14px] font-bold tracking-wide transition-colors duration-200 shadow-md"
        @click="$emit('update:visible', false)"
      />
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

defineProps({
  visible: { type: Boolean, required: true },
  client: { type: Object, default: null }
})

defineEmits(['update:visible'])
</script>