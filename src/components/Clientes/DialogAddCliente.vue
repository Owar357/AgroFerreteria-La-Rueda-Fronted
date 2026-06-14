  <template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '560px' }" :pt="{
      root: { class: 'rounded-xl overflow-hidden border-0 shadow-xl' },
      header: { style: 'display: none;' },
      content: { class: 'p-0' },
      footer: { style: 'display: none;' },
      mask: { style: 'background: rgba(10, 25, 15, 0.55);' },
    }">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4" style="background: #1e3a2f;">
        <div class="flex items-center gap-3">
          <h2 class="text-white text-base font-semibold m-0 uppercase tracking-wide">REGISTRAR CLIENTE</h2>
          <span class="text-[11px] px-3 py-0.5 rounded-[40px] font-semibold tracking-wide bg-[#e0b354] text-[#1e3a2f]">
            {{ tipoPersona === 'NATURAL' ? 'Persona natural' : 'Persona jurídica' }}
          </span>
        </div>
        <button @click="visible = false"
          class="text-white/70 hover:text-white hover:bg-white/10 rounded-md p-1 transition-all border-0 bg-transparent cursor-pointer">
          <i class="pi pi-times text-sm" />
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-6 bg-white flex flex-col gap-5">

        <!-- Tipo de persona -->
        <div class="flex gap-3">
          <button @click="tipoPersona = 'NATURAL'" :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-[1.5px] text-sm transition-all cursor-pointer',
            tipoPersona === 'NATURAL'
              ? 'border-[#2b5e3b] bg-[#eef2e9] text-[#1a2e1f] font-semibold shadow-sm'
              : 'border-gray-200 bg-white text-gray-500 hover:border-[#2b5e3b] hover:text-[#1a2e1f]'
          ]">
            <i class="pi pi-user text-base" />
            Natural
          </button>
          <button @click="tipoPersona = 'JURIDICA'" :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-[1.5px] text-sm transition-all cursor-pointer',
            tipoPersona === 'JURIDICA'
              ? 'border-[#2b5e3b] bg-[#eef2e9] text-[#1a2e1f] font-semibold shadow-sm'
              : 'border-gray-200 bg-white text-gray-500 hover:border-[#2b5e3b] hover:text-[#1a2e1f]'
          ]">
            <i class="pi pi-building text-base" />
            Jurídica
          </button>
        </div>

        <!-- Información general -->
        <p
          class="text-[11px] font-semibold text-gray-400 flex items-center gap-2 m-0 after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-300">
          Información general
        </p>

        <div class="grid grid-cols-2 gap-x-4 gap-y-4">

          <!-- Nombre-->
          <div v-if="tipoPersona === 'NATURAL'" class="col-span-2 flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#1a2e1f]">Nombre</label>
            <InputText v-model="form.nombre" placeholder="Nombre completo" :pt="inputPt" class="w-full" />
          </div>

          <!-- Razón social (JURIDICA) -->
          <div v-if="tipoPersona === 'JURIDICA'" class="col-span-2 flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#1a2e1f]">Razón social</label>
            <InputText v-model="form.razon_social" placeholder="Nombre de la empresa" :pt="inputPt" class="w-full" />
          </div>

          <!-- Giro de actividad -->
          <div v-if="tipoPersona === 'JURIDICA'" class="col-span-2 flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#1a2e1f]">Giro o actividad</label>
            <InputText v-model="form.giro_actividad" placeholder="Ej: Venta de productos agrícolas" :pt="inputPt"
              class="w-full" />
          </div>

          <!-- Correo -->
          <div class="col-span-2 flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#1a2e1f]">
              Correo
              <span class="text-[11px] font-normal text-gray-400 ml-1">(opcional)</span>
            </label>
            <InputText v-model="form.correo" type="email" placeholder="correo@ejemplo.com" :pt="inputPt" class="w-full" />
          </div>

        </div>

        <!-- Documentos -->
        <!-- Documentos -->
        <p
          class="text-[11px] font-semibold text-gray-400 flex items-center gap-2 m-0 after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-300 ">
          Documento de identificación
        </p>

        <div class="grid grid-cols-2 gap-x-4 gap-y-4 mb-1">

          <!-- NATURAL: Select completo -->
          <div v-if="tipoPersona === 'NATURAL'" class="col-span-2 flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#1a2e1f]">
              Tipo de documento
              <span class="text-[11px] font-normal text-gray-400 ml-1">(opcional)</span>
            </label>
            <Select v-model="form.tipo_documento_receptor" :options="tiposDocumento" optionLabel="label"
              optionValue="value" placeholder="Sin documento" class="w-full" :pt="selectPt" />
          </div>

          <!-- JURIDICA: NIT fijo, no editable -->
          <div v-else class="col-span-2 flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#1a2e1f]">
              Tipo de documento
            </label>
            <Select :modelValue="'36'" :options="[{ label: 'NIT', value: '36' }]" optionLabel="label" optionValue="value"
              disabled class="w-full" :pt="selectPt" />
          </div>

          <div class="col-span-2 flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#1a2e1f]">
              Número de documento
            </label>
            <InputText v-model="form.numero_documento" placeholder="Número..." :disabled="!form.tipo_documento_receptor"
              :pt="inputPt" class="w-full" />
          </div>

          <!-- NRC solo para JURIDICA -->
          <div v-if="tipoPersona === 'JURIDICA'" class="col-span-2 flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#1a2e1f]">NRC</label>
            <InputText v-model="form.nrc" placeholder="000000-0" :pt="inputPt" class="w-full" />
          </div>

        </div>

        <!-- Dirección -->
        <p
          class="text-[11px] font-semibold text-gray-400 flex items-center gap-2 m-0 after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-300 ">
          Dirección
        </p>

        <div class="grid grid-cols-2 gap-x-4 gap-y-4 mb-1">

          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#1a2e1f]">
              Departamento
            </label>
            <Select v-model="departamentoSeleccionado" :options="departamentos" optionLabel="label"
              placeholder="Seleccionar departamento" @change="onDepartamentoSeleccionado" class="w-full" :pt="selectPt" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#1a2e1f]">
              Municipio
            </label>
            <Select v-model="municipioSeleccionado" :options="municipiosDisponibles" optionLabel="label"
              placeholder="Seleccionar municipio" :disabled="!departamentoSeleccionado" class="w-full" :pt="selectPt" />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#1a2e1f]">
              Dirección complementaria
            </label>
            <InputText v-model="form.direccion_complemento" placeholder="Calle, avenida, número de casa..." :pt="inputPt"
              class="w-full" />
          </div>

      </div>

      <!-- Footer -->
      <div class="flex justify-center gap-2.5 px-6 py-5 border-t border-gray-100 bg-white">
        <Button label="Cancelar" @click="visible = false" text :pt="{
          root: { class: 'px-5 py-2 rounded-lg border border-gray-200 bg-white text-gray-500 text-sm font-semibold hover:border-[#2b5e3b] hover:text-[#1a2e1f] transition-all cursor-pointer' },
        }" />
        <Button @click="guardar" :pt="{
          root: { class: 'flex items-center gap-2 px-7 py-2 rounded-lg border-0 text-white text-sm font-semibold transition-all cursor-pointer' },
        }" style="background: #2b5e3b;" @mouseenter="(e) => e.currentTarget.style.background = '#1f482d'"
          @mouseleave="(e) => e.currentTarget.style.background = '#2b5e3b'">
          <template #icon><i class="pi pi-check-circle text-sm" /></template>
          <template #default>Guardar cliente</template>
        </Button>
      </div>

    </Dialog>
  </template>

  <script setup>
  import { ref, reactive, computed, watch} from 'vue'
  import Dialog from 'primevue/dialog'
  import InputText from 'primevue/inputtext'
  import Select from 'primevue/select'
  import Button from 'primevue/button'
  import Swal from 'sweetalert2'
  import { crearCliente } from '@/services/ventaService'


  const props = defineProps({
    modelValue: { type: Boolean, default: false }
  })

  const emit = defineEmits(['update:modelValue', 'cliente-registrado'])

  const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  const tipoPersona = ref('NATURAL')


  watch(tipoPersona, (val) => {
    if (val === 'JURIDICA') {
      form.tipo_documento_receptor = '36'
    } else {
      form.tipo_documento_receptor = null
      form.numero_documento = ''
    }
  })

  const tiposDocumento = [
    { label: 'Sin documento', value: null },
    { label: 'DUI', value: '13' },
    { label: 'NIT', value: '36' },
    { label: 'Pasaporte', value: '02' },
    { label: 'Carnet de residente', value: '03' },
  ]
  const departamentos = [
    { label: 'Chalatenango', value: '04' },
    { label: 'San Salvador', value: '06' },
    { label: 'Cuscatlán', value: '07' },
  ]

  const departamentoSeleccionado = ref(departamentos[1]) // San Salvador por defecto
  const municipioSeleccionado = ref(null)

  const onDepartamentoSeleccionado = () => {
    municipioSeleccionado.value = null
  }

  const municipios = {
    // SAN SALVADOR
    '06': [
      { label: 'San Salvador Centro', value: '0601' },
      { label: 'San Salvador Oeste', value: '0602' },
      { label: 'San Salvador Este', value: '0603' },
      { label: 'San Salvador Norte', value: '0604' }, // Aguilares
      { label: 'San Salvador Sur', value: '0605' },
    ],
    // CHALATENANGO
    '04': [
      { label: 'Chalatenango Centro', value: '0401' },
      { label: 'Chalatenango Norte', value: '0402' },
      { label: 'Chalatenango Sur', value: '0403' },
    ],
    // CUSCATLÁN
    '07': [
      { label: 'Cuscatlán Norte', value: '0701' }, // Suchitoto
      { label: 'Cuscatlán Sur', value: '0702' },
    ],
  }

  const municipiosDisponibles = computed(() => {
    if (!departamentoSeleccionado.value) return []
    return municipios[departamentoSeleccionado.value.value] || []
  })

  const form = reactive({
    nombre: '',
    razon_social: '',
    giro_actividad: '',
    correo: '',
    tipo_documento_receptor: null,
    numero_documento: '',
    nrc: '',
    direccion_complemento: '',
  })

  const guardar = async () => {
    try {
      const payload = {
        tipo_persona: tipoPersona.value,
        correo: form.correo || null,
        tipo_documento_receptor: form.tipo_documento_receptor || null,
        numero_documento: form.numero_documento || null,
        cod_departamento: departamentoSeleccionado.value?.value || null,
        tipo_documento_receptor: form.tipo_documento_receptor || null,
        cod_municipio: municipioSeleccionado.value?.value || null,
        complemento: form.direccion_complemento || null,
      }

      if (tipoPersona.value === 'NATURAL') {
        payload.nombre = form.nombre
      } else {
        payload.razon_social = form.razon_social
        payload.nrc = form.nrc
        payload.giro_actividad = form.giro_actividad
      }

      console.log('PAYLOAD COMPLETO:', payload)

      const response = await crearCliente(payload)
      const cliente = response.data.data

      emit('cliente-registrado', cliente)
      visible.value = false

      Swal.fire({
        icon: 'success',
        title: '¡Cliente registrado!',
        text: `${cliente.nombre || cliente.razon_social} fue registrado exitosamente.`,
        confirmButtonColor: '#2b5e3b',
        timer: 3000,
        timerProgressBar: true,
      })

    } catch (error) {
      const status = error.response?.status
      if (status === 422) {
        const mensajes = Object.values(error.response.data.errors).flat()
        Swal.fire({ icon: 'warning', title: 'Error de validación', text: mensajes[0], confirmButtonColor: '#2b5e3b' })
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo registrar el cliente.', confirmButtonColor: '#2b5e3b' })
      }
    }
  }
  </script>