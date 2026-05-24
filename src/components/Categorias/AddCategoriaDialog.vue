<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="AGREGAR CATEGORÍA"
    :style="{ width: '450px' }"
    :draggable="false"
    class="custom-dialog"
    :pt="{ root: { class: 'rounded-2xl overflow-hidden' } }"
  >
    <div class="bg-[#ffffff] p-2 text-[#1a2e1f] flex flex-col gap-6 font-['Inter',sans-serif]">
      
      <div class="flex flex-col gap-2">
        <label class="text-[14px] font-medium text-[#1a2e1f]">Nombre:</label>
        <InputText
          v-model="nombreCategoria"
          placeholder="Escriba el nombre..."
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
          @click="dispararGuardar"
        />
      </div>

    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const props = defineProps({
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['update:visible', 'save'])

const localVisible = ref(props.visible)
const nombreCategoria = ref('')

watch(() => props.visible, (val) => localVisible.value = val)
watch(localVisible, (val) => emit('update:visible', val))

const dispararGuardar = () => {
  emit('save', { nombre: nombreCategoria.value })
  nombreCategoria.value = ''
  localVisible.value = false
}
</script>