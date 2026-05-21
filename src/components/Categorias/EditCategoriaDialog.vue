<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="EDITAR CATEGORÍA"
    :style="{ width: '450px' }"
    :draggable="false"
    class="custom-dialog"
    :pt="{ root: { class: 'rounded-2xl overflow-hidden' } }"
  >
    <div class="bg-[#ffffff] p-2 text-[#1a2e1f] flex flex-col gap-6 font-['Inter',sans-serif]">
      
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Nombre:</label>
        <InputText
          v-model="form.nombre"
          placeholder="Modifique el nombre..."
          class="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f] text-[14px] h-11 px-4 rounded-lg focus:border-[#2b5e3b]"
        />
      </div>

      <div class="flex justify-between gap-4 mt-2">
        <Button
          label="Cancelar"
          class="!bg-[#2b5e3b] hover:bg-[#e2e8dd] text-[#1a2e1f] text-[14px] font-semibold px-4 py-4 rounded-lg border border-[#cbd5e1] cursor-pointer transition-colors"
          @click="localVisible = false"
        />
        <Button
          label="Guardar"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-[14px] font-semibold px-4 py-4 rounded-lg border-none cursor-pointer shadow-md transition-colors"
          @click="dispararActualizar"
        />
      </div>

    </div>
  </Dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const props = defineProps({
  visible: { type: Boolean, default: false },
  categoria: { type: Object, default: () => null }
})

const emit = defineEmits(['update:visible', 'update'])

const localVisible = ref(props.visible)
const form = reactive({ id: null, nombre: '', estado: '' })

watch(() => props.visible, (val) => localVisible.value = val)
watch(localVisible, (val) => emit('update:visible', val))

// Escucha cambios cuando el usuario selecciona una fila distinta para editar
watch(() => props.categoria, (val) => {
  if (val) {
    form.id = val.id
    form.nombre = val.nombre
    form.estado = val.estado
  }
}, { immediate: true })

const dispararActualizar = () => {
  emit('update', { ...form })
  localVisible.value = false
}
</script>

<style>
/* Estilos compartidos para las cabeceras verdes y contenedores claros de los diálogos */
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