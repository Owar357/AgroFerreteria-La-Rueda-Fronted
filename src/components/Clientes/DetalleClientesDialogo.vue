<template>
  <Dialog
    :visible="visible"
    modal
    header="DETALLE DEL CLIENTE"
    :draggable="false"
    :closable="false"
    :style="{ width: 'min(calc(100vw - 2rem), 34rem)' }"
    class="custom-dialog"
    :pt="{ root: { class: '!rounded-2xl overflow-hidden shadow-2xl' } }"
    @update:visible="$emit('update:visible', $event)"
  >
    <template v-if="client">
      <!-- ======================================================= -->
      <!-- VISTA MÓVIL (< 640px)                                   -->
      <!-- ======================================================= -->
      <div class="block sm:hidden bg-white p-4 text-[#1a2e1f] space-y-4 font-['Inter',sans-serif]">
        
        <!-- Avatar + Nombre Móvil -->
        <div class="flex items-center gap-3 pb-3 border-b border-[#e2e8dd]">
          <div
            class="!w-10 !h-10 rounded-full flex items-center justify-center bg-[#1a3323] border border-[#e0b354] shadow-xs shrink-0"
          >
            <i
              :class="client.tipo_persona === 'Natural' ? 'pi pi-user' : 'pi pi-building'"
              class="text-base text-[#e0b354]"
            />
          </div>

          <div class="flex flex-col gap-0.5 overflow-hidden">
            <h2 class="text-base font-bold text-[#1a2e1f] m-0 leading-snug truncate">
              {{ client.name }}
            </h2>
            <span class="self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#e0b354] text-[#1a3323]">
              {{ client.tipo_persona }}
            </span>
          </div>
        </div>

        <!-- Identificación y Registro Móvil -->
        <div class="space-y-1.5">
          <div class="flex items-center gap-1.5 text-[#2b5e3b] font-bold text-[11px] uppercase tracking-wider">
            <i class="pi pi-id-card text-xs" />
            <span>Identificación y Registro</span>
          </div>
          <div class="grid grid-cols-2 gap-3 bg-[#fbfdf9] p-3 rounded-xl border border-[#e2e8dd]">
            <div>
              <label class="block text-[10px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-0.5">N° Documento</label>
              <p class="font-mono text-xs text-[#1a2e1f] font-bold m-0">{{ numero_documento || '—' }}</p>
            </div>
            <div>
              <label class="block text-[10px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-0.5">NRC</label>
              <p class="font-mono text-xs text-[#1a2e1f] font-bold m-0">{{ client.nrc || '—' }}</p>
            </div>
          </div>
        </div>

        <!-- Información de Contacto Móvil -->
        <div class="space-y-1.5">
          <div class="flex items-center gap-1.5 text-[#2b5e3b] font-bold text-[11px] uppercase tracking-wider">
            <i class="pi pi-envelope text-xs" />
            <span>Información de Contacto</span>
          </div>
          <div class="grid grid-cols-1 gap-2.5 bg-[#fbfdf9] p-3 rounded-xl border border-[#e2e8dd]">
            <div>
              <label class="block text-[10px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-0.5">Teléfono</label>
              <p class="flex items-center gap-1.5 text-xs text-[#1a2e1f] m-0 font-medium">
                <i class="pi pi-phone text-[11px] text-gray-500 shrink-0" />
                {{ client.phone || '—' }}
              </p>
            </div>
            <div>
              <label class="block text-[10px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-0.5">Correo electrónico</label>
              <p class="flex items-center gap-1.5 text-xs text-gray-700 m-0 font-medium">
                <i class="pi pi-envelope text-[11px] text-gray-500 shrink-0" />
                <span class="break-all">{{ client.email || '—' }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Botón Cierre Móvil -->
        <div class="pt-3 flex flex-col gap-2 w-full">
          <Button
            label="Cerrar"
            icon="pi pi-times"
            severity="secondary"
            outlined
            class="!text-xs !py-3 !border-[#cbd5e1] !text-gray-600 !rounded-xl !w-full font-semibold cursor-pointer"
            @click="$emit('update:visible', false)"
          />
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- VISTA ESCRITORIO (>= 640px)                             -->
      <!-- ======================================================= -->
      <div class="hidden sm:flex bg-white p-6 text-[#1a2e1f] flex-col gap-5 font-['Inter',sans-serif]">
        
        <!-- Avatar + Nombre Escritorio -->
        <div class="flex items-center gap-4 pb-4 border-b border-[#e2e8dd]">
          <div
            class="!w-12 !h-12 rounded-full flex items-center justify-center bg-[#1a3323] border border-[#e0b354] shadow-sm shrink-0"
          >
            <i
              :class="client.personType === 'Natural' ? 'pi pi-user' : 'pi pi-building'"
              class="text-xl text-[#e0b354]"
            />
          </div>

          <div class="flex flex-col gap-1 overflow-hidden">
            <h2 class="text-lg font-bold text-[#1a2e1f] m-0 leading-snug truncate">
              {{ client.name }}
            </h2>
            <span class="self-start px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-[#e0b354] text-[#1a3323]">
              {{ client.personType }}
            </span>
          </div>
        </div>

        <!-- Secciones de Datos Escritorio -->
        <div class="flex flex-col gap-4">
          
          <!-- Identificación y Registro -->
          <div class="space-y-1.5">
            <div class="flex items-center gap-2 text-[#2b5e3b] font-semibold text-xs uppercase tracking-wider">
              <i class="pi pi-id-card text-xs" />
              <span>Identificación y Registro</span>
            </div>
            <div class="grid grid-cols-2 gap-4 bg-[#fbfdf9] p-3.5 rounded-xl border border-[#e2e8dd]">
              <div>
                <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">N° Documento</label>
                <p class="font-mono text-sm text-[#1a2e1f] font-bold m-0">{{ client.numero_documento || '—' }}</p>
              </div>
              <div>
                <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">NRC</label>
                <p class="font-mono text-sm text-[#1a2e1f] font-bold m-0">{{ client.nrc || '—' }}</p>
              </div>
            </div>
          </div>

          <!-- Información de Contacto -->
          <div class="space-y-1.5">
            <div class="flex items-center gap-2 text-[#2b5e3b] font-semibold text-xs uppercase tracking-wider">
              <i class="pi pi-envelope text-xs" />
              <span>Información de Contacto</span>
            </div>
            <div class="grid grid-cols-2 gap-4 bg-[#fbfdf9] p-3.5 rounded-xl border border-[#e2e8dd]">
              <div>
                <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">Teléfono</label>
                <p class="flex items-center gap-1.5 text-sm text-[#1a2e1f] m-0 font-medium">
                  <i class="pi pi-phone text-xs text-gray-500 shrink-0" />
                  {{ client.telefono || '—' }}
                </p>
              </div>
              <div>
                <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#2b5e3b] mb-1">Correo electrónico</label>
                <p class="flex items-center gap-1.5 text-sm text-gray-700 m-0 font-medium">
                  <i class="pi pi-envelope text-xs text-gray-500 shrink-0" />
                  <span class="break-all">{{ client.correo || '—' }}</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        <!-- Botón Cierre Escritorio -->
        <div class="flex justify-end items-center mt-1 pt-4 border-t border-[#e2e8dd] w-full">
          <Button
            label="Cerrar"
            icon="pi pi-times"
            severity="secondary"
            outlined
            class="!text-sm !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl font-semibold cursor-pointer w-[47%] flex justify-center items-center"
            @click="$emit('update:visible', false)"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps({
  visible: { type: Boolean, required: true },
  client: { type: Object, default: null }
})

defineEmits(['update:visible'])

const c = computed(() => {
  const x = props.client ?? {}
  const tipo = x.tipo_persona ?? x.personType ?? ''
  return {
    nombre: x.nombre ?? x.razon_social ?? x.name ?? '',
    tipo,
    esNatural: tipo.toUpperCase() === 'NATURAL',
    numero_documento: x.numero_documento ?? '',
    nrc: x.nrc ?? '',
    telefono: x.telefono ?? x.phone ?? '',
    correo: x.correo ?? x.email ?? '',
  }
})
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