  <template>
    <Dialog
      v-model:visible="visible"
      modal
      :closable="false"
      :style="{ width: '450px' }"
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
          <i class="pi pi-pencil text-white text-base" />
          <h2 class="text-white text-base font-semibold m-0 font-inter">Editar proveedor</h2>
        </div>
        <button
          @click="visible = false"
          class="text-white/70 hover:text-white hover:bg-white/10 rounded-md p-1 transition-all border-0 bg-transparent cursor-pointer"
          aria-label="Cerrar"
        >
          <i class="pi pi-times text-sm" />
        </button>
      </div>

      <!-- Body / Formulario -->
    
        <div class="px-6 py-5 bg-[#eef2e9] font-inter flex flex-col gap-4">
        <!-- Campo Nombre -->
        <div class="flex flex-col gap-1">
          <label class="text-[12.5px] font-medium text-[#1a2e1f] font-inter">Nombre</label>
          <InputText
            v-model="form.nombre"
            placeholder="Nombre del proveedor"
            :pt="inputPt"
          />
        </div>

        <!-- Campo Correo -->
        <div class="flex flex-col gap-1">
          <label class="text-[12.5px] font-medium text-[#1a2e1f] font-inter">Correo electrónico</label>
          <InputText
            v-model="form.correo"
            type="email"
            placeholder="correo@ejemplo.com"
            :pt="inputPt"
          />
        </div>

        <!-- Campo Teléfono -->
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
            root: { class: 'flex items-center gap-2 px-8 py-2 rounded-lg border-0 text-[#1a2e1f] text-sm font-semibold font-inter transition-all cursor-pointer' },
            label: { class: 'font-inter font-semibold text-sm' },
          }"
          style="background: #2b5e3b;"
          @mouseenter="(e) => e.currentTarget.style.background = '#2b5e3b'"
          @mouseleave="(e) => e.currentTarget.style.background = '#2b5e3b'"
        >
          <template #icon>
            <i class="pi pi-check-circle text-sm" />
          </template>
          <template #default>Actualizar cambios</template>
        </Button>
      </div>
      
    </Dialog>
  </template>

  <script setup>
  import { reactive, computed, watch } from 'vue'
  import Dialog from 'primevue/dialog'
  import InputText from 'primevue/inputtext'
  import Button from 'primevue/button'

  const props = defineProps({
    modelValue: { type: Boolean, default: false },
    proveedor:  { type: Object, default: null },
  })

  const emit = defineEmits(['update:modelValue', 'actualizar'])

  const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  const form = reactive({
    id:           null,
    nombre:       '',
    correo:       '',
    telefono:     '',
    direccion:    '',
    tipo_persona: '',
    nit:          '',
    nrc:          '',
    dui:          null,
    activo:       true,
  })

  const inputPt = {
    root: {
      class: 'w-full bg-white border border-gray-200 text-[#1a2e1f] text-[14px] rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#2b5e3b] focus:border-[#2b5e3b] transition-all font-inter',
    },
  }

  // Carga TODOS los campos al abrir el modal
  watch(() => props.modelValue, (isOpen) => {
    if (isOpen && props.proveedor) {
      const p = props.proveedor
      form.id           = p.id           ?? null
      form.nombre       = p.nombre       ?? ''
      form.correo       = p.correo       ?? ''
      form.telefono     = p.telefono     ?? ''
      form.direccion    = p.direccion    ?? ''
      form.tipo_persona = p.tipo_persona ?? ''
      form.nit          = p.nit          ?? ''
      form.nrc          = p.nrc          ?? ''
      form.dui          = p.dui          ?? null
      form.activo       = p.activo       ?? true
    }
  })

  function guardar() {
    console.log('emitiendo actualizar:', { ...form })
    emit('actualizar', { ...form })
    visible.value = false
  }

    

  </script>
