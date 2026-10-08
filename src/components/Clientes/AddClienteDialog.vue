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
    <div class="flex items-center justify-between px-5 py-4" style="background: #1e3a2f">
      <div class="flex items-center gap-3">
        <h2 class="text-white text-base font-semibold m-0 uppercase tracking-wide">
          REGISTRAR CLIENTE
        </h2>
        <span
          class="text-[11px] px-3 py-0.5 rounded-[40px] font-semibold tracking-wide bg-[#e0b354] text-[#1e3a2f]"
        >
          {{ tipoPersona === 'NATURAL' ? 'Persona natural' : 'Persona jurídica' }}
        </span>
      </div>
      <button
        @click="visible = false"
        class="text-white/70 hover:text-white hover:bg-white/10 rounded-md p-1 transition-all border-0 bg-transparent cursor-pointer"
      >
        <i class="pi pi-times text-sm" />
      </button>
    </div>

    <!-- Body -->
    <div class="px-6 py-6 bg-white flex flex-col gap-5">
      <div class="flex gap-3">
        <button
          @click="tipoPersona = 'NATURAL'"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-[1.5px] text-sm transition-all cursor-pointer',
            tipoPersona === 'NATURAL'
              ? 'border-[#2b5e3b] bg-[#eef2e9] text-[#1a2e1f] font-semibold shadow-sm'
              : 'border-gray-200 bg-white text-gray-500 hover:border-[#2b5e3b] hover:text-[#1a2e1f]',
          ]"
        >
          <i class="pi pi-user text-base" />
          Natural
        </button>
        <button
          @click="tipoPersona = 'JURIDICA'"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-[1.5px] text-sm transition-all cursor-pointer',
            tipoPersona === 'JURIDICA'
              ? 'border-[#2b5e3b] bg-[#eef2e9] text-[#1a2e1f] font-semibold shadow-sm'
              : 'border-gray-200 bg-white text-gray-500 hover:border-[#2b5e3b] hover:text-[#1a2e1f]',
          ]"
        >
          <i class="pi pi-building text-base" />
          Jurídica
        </button>
      </div>

      <!-- Información general -->
      <p
        class="text-[11px] font-semibold text-gray-400 flex items-center gap-2 m-0 after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-300"
      >
        Información general
      </p>

      <div class="grid grid-cols-2 gap-x-4 gap-y-4">
        <!-- Nombre (NATURAL) -->
        <div v-if="tipoPersona === 'NATURAL'" class="col-span-2 flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f]">Nombre</label>
          <InputText
            v-model="form.nombre"
            placeholder="Nombre completo"
            maxlength="250"
            autocomplete="off"
            :invalid="!!errors.nombre"
            :pt="inputPt"
            class="w-full"
            @input="alEscribirCampo($event, 'nombre', formatearNombre)"
            @blur="validarCampo('nombre')"
          />
          <small v-if="errors.nombre" class="text-[11.5px] text-red-600">{{ errors.nombre }}</small>
        </div>

        <!-- Razón social (JURIDICA) -->
        <div v-if="tipoPersona === 'JURIDICA'" class="col-span-2 flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f]">Razón social</label>
          <InputText
            v-model="form.razon_social"
            placeholder="Nombre de la empresa"
            maxlength="200"
            autocomplete="off"
            :invalid="!!errors.razon_social"
            :pt="inputPt"
            class="w-full"
            @input="alEscribirCampo($event, 'razon_social', formatearRazonSocial)"
            @blur="validarCampo('razon_social')"
          />
          <small v-if="errors.razon_social" class="text-[11.5px] text-red-600">{{
            errors.razon_social
          }}</small>
        </div>

        <!-- Giro de actividad (JURIDICA) -->
        <div v-if="tipoPersona === 'JURIDICA'" class="col-span-2 flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f]">Giro o actividad</label>
          <InputText
            v-model="form.giro_actividad"
            placeholder="Ej: Venta de productos agrícolas"
            maxlength="200"
            autocomplete="off"
            :invalid="!!errors.giro_actividad"
            :pt="inputPt"
            class="w-full"
            @input="alEscribirCampo($event, 'giro_actividad', formatearGiro)"
            @blur="validarCampo('giro_actividad')"
          />
          <small v-if="errors.giro_actividad" class="text-[11.5px] text-red-600">{{
            errors.giro_actividad
          }}</small>
        </div>

        <!-- Correo -->
        <div class="col-span-2 flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f]">Correo</label>
          <!-- type="text" a propósito: en type="email" el navegador no permite mover el cursor por código -->
          <InputText
            v-model="form.correo"
            type="text"
            inputmode="email"
            autocomplete="email"
            placeholder="correo@ejemplo.com"
            maxlength="150"
            :invalid="!!errors.correo"
            :pt="inputPt"
            class="w-full"
            @input="alEscribirCampo($event, 'correo', formatearCorreo)"
            @blur="validarCampo('correo')"
          />
          <small v-if="errors.correo" class="text-[11.5px] text-red-600">{{ errors.correo }}</small>
        </div>
      </div>

      <div class="col-span-2 flex flex-col gap-1.5">
        <label class="text-[12.5px] font-semibold text-[#1a2e1f]"> Teléfono </label>

        <InputText
          v-model="form.telefono"
          placeholder="7777-7777"
          maxlength="9"
          inputmode="numeric"
          :invalid="!!errors.telefono"
          :pt="inputPt"
          class="w-full"
          @input="alEscribirCampo($event, 'telefono', formatearTelefono)"
          @blur="validarCampo('telefono')"
        />

        <small v-if="errors.telefono" class="text-[11.5px] text-red-600">
          {{ errors.telefono }}
        </small>
      </div>

      <!-- Documentos -->
      <p
        class="text-[11px] font-semibold text-gray-400 flex items-center gap-2 m-0 after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-300"
      >
        Documento de identificación
      </p>

      <div class="grid grid-cols-2 gap-x-4 gap-y-4 mb-1">
        <div v-if="tipoPersona === 'NATURAL'" class="col-span-2 flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f]">Tipo de documento</label>
          <Select
            v-model="form.tipo_documento_receptor"
            :options="tiposDocumento"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccionar tipo de documento"
            :invalid="!!errors.tipo_documento_receptor"
            class="w-full"
            :pt="selectPt"
            @change="validarCampo('tipo_documento_receptor')"
          />
          <small v-if="errors.tipo_documento_receptor" class="text-[11.5px] text-red-600">{{
            errors.tipo_documento_receptor
          }}</small>
        </div>

        <div v-else class="col-span-2 flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f]"> Tipo de documento </label>
          <Select
            :modelValue="'36'"
            :options="[{ label: 'NIT', value: '36' }]"
            optionLabel="label"
            optionValue="value"
            disabled
            class="w-full"
            :pt="selectPt"
          />
        </div>

        <div class="col-span-2 flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f]"> Número de documento </label>
          <InputText
            v-model="form.numero_documento"
            :placeholder="placeholderDocumento"
            autocomplete="off"
            :disabled="!form.tipo_documento_receptor"
            :invalid="!!errors.numero_documento"
            :pt="inputPt"
            class="w-full"
            @input="alEscribirCampo($event, 'numero_documento', formateadorDocumento)"
            @blur="validarCampo('numero_documento')"
          />
          <small v-if="errors.numero_documento" class="text-[11.5px] text-red-600">{{
            errors.numero_documento
          }}</small>
        </div>

        <!-- NRC solo para JURIDICA -->
        <div v-if="tipoPersona === 'JURIDICA'" class="col-span-2 flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f]">NRC</label>
          <InputText
            v-model="form.nrc"
            placeholder="000000-0"
            inputmode="numeric"
            autocomplete="off"
            :invalid="!!errors.nrc"
            :pt="inputPt"
            class="w-full"
            @input="alEscribirCampo($event, 'nrc', formatearNrc)"
            @blur="validarCampo('nrc')"
          />
          <small v-if="errors.nrc" class="text-[11.5px] text-red-600">{{ errors.nrc }}</small>
        </div>
      </div>

      <p
        class="text-[11px] font-semibold text-gray-400 flex items-center gap-2 m-0 after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-300"
      >
        Dirección
      </p>

      <div class="grid grid-cols-2 gap-x-4 gap-y-4 mb-1">
        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f]"> Departamento </label>
          <Select
            v-model="departamentoSeleccionado"
            :options="departamentos"
            optionLabel="label"
            placeholder="Seleccionar departamento"
            :invalid="!!errors.departamento"
            @change="onDepartamentoSeleccionado"
            class="w-full"
            :pt="selectPt"
          />
          <small v-if="errors.departamento" class="text-[11.5px] text-red-600">{{
            errors.departamento
          }}</small>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-[#1a2e1f]"> Municipio </label>
          <Select
            v-model="municipioSeleccionado"
            :options="municipiosDisponibles"
            optionLabel="label"
            placeholder="Seleccionar municipio"
            :disabled="!departamentoSeleccionado"
            :invalid="!!errors.municipio"
            class="w-full"
            :pt="selectPt"
            @change="validarCampo('municipio')"
          />
          <small v-if="errors.municipio" class="text-[11.5px] text-red-600">{{
            errors.municipio
          }}</small>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[12.5px] font-semibold text-[#1a2e1f]"> Dirección complementaria </label>
        <InputText
          v-model="form.direccion_complemento"
          placeholder="Calle, avenida, número de casa..."
          maxlength="250"
          autocomplete="off"
          :invalid="!!errors.direccion_complemento"
          :pt="inputPt"
          class="w-full"
          @input="alEscribirCampo($event, 'direccion_complemento', formatearComplemento)"
          @blur="validarCampo('direccion_complemento')"
        />
        <small v-if="errors.direccion_complemento" class="text-[11.5px] text-red-600">{{
          errors.direccion_complemento
        }}</small>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-center gap-2.5 px-6 py-5 border-t border-gray-100 bg-white">
      <Button
        label="Cancelar"
        @click="visible = false"
        text
        :pt="{
          root: {
            class:
              'px-5 py-2 rounded-lg border border-gray-200 bg-white text-gray-500 text-sm font-semibold hover:border-[#2b5e3b] hover:text-[#1a2e1f] transition-all cursor-pointer',
          },
        }"
      />
      <Button
        @click="guardar"
        :pt="{
          root: {
            class:
              'flex items-center gap-2 px-7 py-2 rounded-lg border-0 text-white text-sm font-semibold transition-all cursor-pointer',
          },
        }"
        style="background: #2b5e3b"
        @mouseenter="(e) => (e.currentTarget.style.background = '#1f482d')"
        @mouseleave="(e) => (e.currentTarget.style.background = '#2b5e3b')"
      >
        <template #icon><i class="pi pi-check-circle text-sm" /></template>
        <template #default>Guardar cliente</template>
      </Button>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import { useClienteStore } from '@/stores/clienteStore'
import {
  mostrarExito,
  mostrarError,
  mostrarAccesoDenegado,
  mostrarAlertaConfirmar,
  mostrarCargando,
} from '@/utils/SweetAlertService'

const store = useClienteStore()

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'cliente-registrado'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const tipoPersona = ref('NATURAL')

const tiposDocumento = [
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

const municipios = {
  '06': [
    { label: 'San Salvador Centro', value: '0601' },
    { label: 'San Salvador Oeste', value: '0602' },
    { label: 'San Salvador Este', value: '0603' },
    { label: 'San Salvador Norte', value: '0604' },
    { label: 'San Salvador Sur', value: '0605' },
  ],
  '04': [
    { label: 'Chalatenango Centro', value: '0401' },
    { label: 'Chalatenango Norte', value: '0402' },
    { label: 'Chalatenango Sur', value: '0403' },
  ],
  '07': [
    { label: 'Cuscatlán Norte', value: '0701' },
    { label: 'Cuscatlán Sur', value: '0702' },
  ],
}

const departamentoSeleccionado = ref(departamentos[1])
const municipioSeleccionado = ref(null)

const municipiosDisponibles = computed(() => {
  if (!departamentoSeleccionado.value) return []
  return municipios[departamentoSeleccionado.value.value] || []
})

const form = reactive({
  nombre: '',
  razon_social: '',
  giro_actividad: '',
  correo: '',
  telefono: '',
  tipo_documento_receptor: null,
  numero_documento: '',
  nrc: '',
  direccion_complemento: '',
})

const errors = reactive({
  nombre: '',
  razon_social: '',
  giro_actividad: '',
  correo: '',
  telefono: '',
  tipo_documento_receptor: '',
  numero_documento: '',
  nrc: '',
  departamento: '',
  municipio: '',
  direccion_complemento: '',
})

const limpiarErrores = () => {
  Object.keys(errors).forEach((clave) => (errors[clave] = ''))
}

const reiniciarFormulario = () => {
  tipoPersona.value = 'NATURAL'
  Object.assign(form, {
    nombre: '',
    razon_social: '',
    giro_actividad: '',
    correo: '',
    tipo_documento_receptor: null,
    numero_documento: '',
    nrc: '',
    direccion_complemento: '',
  })
  departamentoSeleccionado.value = departamentos[1]
  municipioSeleccionado.value = null
  limpiarErrores()
}

// Al cerrar el diálogo (guardar o cancelar) el formulario queda limpio
watch(visible, (abierto) => {
  if (!abierto) reiniciarFormulario()
})

watch(tipoPersona, (val) => {
  limpiarErrores()
  if (val === 'JURIDICA') {
    form.tipo_documento_receptor = '36'
  } else {
    form.tipo_documento_receptor = null
    form.numero_documento = ''
  }
})

// Si cambia el tipo de documento, el número anterior ya no aplica
watch(
  () => form.tipo_documento_receptor,
  () => {
    form.numero_documento = ''
    errors.numero_documento = ''
  },
)

const onDepartamentoSeleccionado = () => {
  municipioSeleccionado.value = null
  errors.municipio = ''
  validarCampo('departamento')
}

/* ------------------------------------------------------------------ */
/* Formateadores: bloquean o corrigen lo que el usuario escribe        */
/* ------------------------------------------------------------------ */

const soloDigitos = (v) => v.replace(/\D/g, '')

// Solo letras (cualquier idioma) y espacios. Sin números ni símbolos.
const formatearNombre = (v) =>
  v
    .replace(/[^\p{L} ]/gu, '')
    .replace(/ {2,}/g, ' ')
    .replace(/^ /, '')

// Mayúsculas; letras, números, espacios y . , - &
// No admite símbolos repetidos seguidos (&&, ,, ..) y debe empezar con letra o número
const formatearRazonSocial = (v) =>
  v
    .toUpperCase()
    .replace(/[^A-ZÁÉÍÓÚÜÑ0-9 .,&-]/g, '')
    .replace(/([.,&-])\1+/g, '$1')
    .replace(/ {2,}/g, ' ')
    .replace(/^[^A-ZÁÉÍÓÚÜÑ0-9]+/, '')

// Mayúsculas; letras, números, espacios y . , -
// No admite símbolos repetidos seguidos y debe empezar con una letra
const formatearGiro = (v) =>
  v
    .toUpperCase()
    .replace(/[^A-ZÁÉÍÓÚÜÑ0-9 .,-]/g, '')
    .replace(/([.,-])\1+/g, '$1')
    .replace(/ {2,}/g, ' ')
    .replace(/^[^A-ZÁÉÍÓÚÜÑ]+/, '')

// Letras, números y solo . _ - además de la @ (una sola)
const formatearCorreo = (v) => {
  const limpio = v.replace(/[^A-Za-z0-9._@-]/g, '')
  const i = limpio.indexOf('@')
  return i === -1 ? limpio : limpio.slice(0, i + 1) + limpio.slice(i + 1).replace(/@/g, '')
}

const formatearComplemento = (v) => v.replace(/ {2,}/g, ' ').replace(/^ /, '')

// DUI: xxxxxxxx-x
const formatearDui = (v) => {
  const d = soloDigitos(v).slice(0, 9)
  return d.length > 8 ? `${d.slice(0, 8)}-${d.slice(8)}` : d
}

// NIT: xxxx-xxxxxx-xxx-x
const formatearNit = (v) => {
  const d = soloDigitos(v).slice(0, 14)
  return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 13), d.slice(13)].filter(Boolean).join('-')
}

// Pasaporte y carnet de residente: alfanumérico en mayúsculas, sin guiones, puntos ni espacios
const formatearAlfanumerico = (v) =>
  v
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 15)

// NRC: el guion se inserta justo antes del último dígito (máx. 8 dígitos)
const formatearNrc = (v) => {
  const d = soloDigitos(v).slice(0, 8)
  return d.length > 1 ? `${d.slice(0, -1)}-${d.slice(-1)}` : d
}

const formatearTelefono = (v) => {
  const d = soloDigitos(v).slice(0, 8)

  return d.length > 4 ? `${d.slice(0, 4)}-${d.slice(4)}` : d
}

const formateadorDocumento = computed(
  () =>
    ({
      13: formatearDui,
      36: formatearNit,
      '02': formatearAlfanumerico,
      '03': formatearAlfanumerico,
    })[form.tipo_documento_receptor] ?? ((v) => v),
)

const placeholderDocumento = computed(
  () =>
    ({
      13: '00000000-0',
      36: '0000-000000-000-0',
      '02': 'Ej: AB123456',
      '03': 'Ej: A12345',
    })[form.tipo_documento_receptor] ?? 'Selecciona primero el tipo de documento',
)

const aplicarFiltro = (e, campo, formatear) => {
  const el = e.target
  const crudo = el.value
  const valor = formatear(crudo)

  if (valor === crudo) {
    form[campo] = valor
    return
  }

  const pos = el.selectionStart ?? crudo.length
  const nuevaPos = pos >= crudo.length ? valor.length : formatear(crudo.slice(0, pos)).length

  form[campo] = crudo
  nextTick(() => {
    form[campo] = valor
    nextTick(() => {
      if (el.value !== valor) el.value = valor
      el.setSelectionRange(nuevaPos, nuevaPos)
    })
  })
}

const alEscribirCampo = (e, campo, formatear) => {
  aplicarFiltro(e, campo, formatear)
  // Si ya había un error visible, se re-evalúa para que desaparezca en cuanto el valor sea correcto
  if (errors[campo]) validarCampo(campo)
}

/* ------------------------------------------------------------------ */
/* Validaciones                                                        */
/* ------------------------------------------------------------------ */

const regexCorreo =
  /^[A-Za-z0-9]+([._-][A-Za-z0-9]+)*@[A-Za-z0-9]+(-[A-Za-z0-9]+)*(\.[A-Za-z]{2,3})?\.[A-Za-z]{2,}$/

// Formato del DUI: 8 dígitos, guion y 1 dígito (el formateador ya lo deja así)
const validarFormatoDUI = (dui) => /^\d{8}-\d$/.test(dui)

// Mismo algoritmo que el backend: factores 9..2 sobre los primeros 8 dígitos
const validarDuiLocal = (dui) => {
  if (!validarFormatoDUI(dui)) return false

  const digitos = dui.replace('-', '').split('').map(Number)
  const factores = [9, 8, 7, 6, 5, 4, 3, 2]
  let suma = 0

  for (let i = 0; i < 8; i++) {
    suma += digitos[i] * factores[i]
  }

  const residuo = suma % 10
  const digitoCalculado = (10 - residuo) % 10

  return digitos[8] === digitoCalculado
}

// Reglas comunes de razón social y giro: evitan textos sin sentido como "&&&&&" o "AAAAA"
const validarTextoComercial = (v, { minLetras, empiezaConLetra }) => {
  const inicio = empiezaConLetra ? /^[A-ZÁÉÍÓÚÜÑ]/ : /^[A-ZÁÉÍÓÚÜÑ0-9]/
  if (!inicio.test(v))
    return empiezaConLetra
      ? 'Debe comenzar con una letra.'
      : 'Debe comenzar con una letra o un número.'
  if ((v.match(/[A-ZÁÉÍÓÚÜÑ]/g) || []).length < minLetras)
    return `Debe contener al menos ${minLetras} letras.`
  if (/([.,&-])\1/.test(v)) return 'No repitas símbolos seguidos (por ejemplo && o ..).'
  if (/([A-ZÁÉÍÓÚÜÑ])\1{3,}/.test(v)) return 'No repitas la misma letra más de 3 veces seguidas.'
  return ''
}

const validadores = {
  nombre: () => {
    const v = form.nombre.trim()
    if (!v) return 'El nombre es obligatorio.'
    if (!/^[\p{L} ]+$/u.test(v)) return 'El nombre solo puede contener letras y espacios.'
    return ''
  },

  telefono: () => {
    const v = form.telefono

    if (!v) return 'El teléfono es obligatorio.'

    if (!/^\d{4}-\d{4}$/.test(v)) {
      return 'El teléfono debe tener formato 7777-7777.'
    }

    return ''
  },

  razon_social: () => {
    const v = form.razon_social.trim()
    if (!v) return 'La razón social es obligatoria.'
    if (v.length < 3) return 'La razón social debe tener al menos 3 caracteres.'
    if (v.length > 200) return 'La razón social no puede superar los 200 caracteres.'
    if (!/^[A-ZÁÉÍÓÚÜÑ0-9 .,&-]+$/.test(v))
      return 'Solo se permiten letras, números y los símbolos . , - &'
    return validarTextoComercial(v, { minLetras: 3, empiezaConLetra: false })
  },

  giro_actividad: () => {
    const v = form.giro_actividad.trim()
    if (!v) return 'El giro o actividad es obligatorio.'
    if (v.length < 5) return 'El giro debe tener al menos 5 caracteres.'
    if (v.length > 200) return 'El giro no puede superar los 200 caracteres.'
    if (!/^[A-ZÁÉÍÓÚÜÑ0-9 .,-]+$/.test(v))
      return 'Solo se permiten letras, números y los símbolos . , -'
    return validarTextoComercial(v, { minLetras: 5, empiezaConLetra: true })
  },

  correo: () => {
    const v = form.correo.trim()
    if (!v) return 'El correo es obligatorio.'
    if (v.length > 150) return 'El correo no puede superar los 150 caracteres.'
    if (!regexCorreo.test(v))
      return 'Correo inválido. Solo se permiten letras, números y los símbolos . _ -'
    return ''
  },

  tipo_documento_receptor: () =>
    form.tipo_documento_receptor ? '' : 'Selecciona el tipo de documento.',

  numero_documento: () => {
    const tipo = form.tipo_documento_receptor
    const v = form.numero_documento
    if (!tipo) return 'Selecciona primero el tipo de documento.'
    if (!v) return 'El número de documento es obligatorio.'

    if (tipo === '13') {
      if (soloDigitos(v).length !== 9) return 'El DUI debe tener 9 dígitos (xxxxxxxx-x).'
      if (!validarDuiLocal(v)) return 'El número de DUI no es válido. Revisa los dígitos.'
    }
    if (tipo === '36') {
      const d = soloDigitos(v)
      if (d.length !== 14) return 'El NIT debe tener 14 dígitos (xxxx-xxxxxx-xxx-x).'
      if (/^(\d)\1+$/.test(d)) return 'El NIT no es válido: no puede repetir un mismo dígito.'
    }
    if (tipo === '02' && !/^(?=.*[A-Z])(?=.*\d)[A-Z0-9]{6,15}$/.test(v))
      return 'El pasaporte debe tener de 6 a 15 caracteres e incluir letras y números.'
    if (tipo === '03' && !/^[A-Z0-9]{5,15}$/.test(v))
      return 'El carnet de residente debe tener de 5 a 15 letras o números.'
    return ''
  },

  nrc: () => {
    const v = form.nrc
    if (!v) return 'El NRC es obligatorio.'
    if (!/^\d{5,7}-\d$/.test(v)) return 'El NRC debe tener entre 6 y 8 dígitos (ej: 123456-7).'
    if (/^(\d)\1+$/.test(soloDigitos(v)))
      return 'El NRC no es válido: no puede repetir un mismo dígito.'
    return ''
  },

  departamento: () => (departamentoSeleccionado.value ? '' : 'Selecciona el departamento.'),

  municipio: () => (municipioSeleccionado.value ? '' : 'Selecciona el municipio.'),

  direccion_complemento: () => {
    const v = form.direccion_complemento.trim()
    if (!v) return 'La dirección complementaria es obligatoria.'
    if (v.length < 5) return 'La dirección debe tener al menos 5 caracteres.'
    if (v.length > 250) return 'La dirección no puede superar los 250 caracteres.'
    if ((v.match(/\p{L}/gu) || []).length < 3)
      return 'La dirección debe incluir al menos 3 letras (calle, colonia, referencia...).'
    return ''
  },
}

const camposActivos = computed(() =>
  tipoPersona.value === 'NATURAL'
    ? [
        'nombre',
        'correo',
        'telefono',
        'tipo_documento_receptor',
        'numero_documento',
        'departamento',
        'municipio',
        'direccion_complemento',
      ]
    : [
        'razon_social',
        'giro_actividad',
        'correo',
        'telefono',
        'numero_documento',
        'nrc',
        'departamento',
        'municipio',
        'direccion_complemento',
      ],
)

const validarCampo = (campo) => {
  errors[campo] = validadores[campo]?.() ?? ''
}

const validarTodo = () => {
  camposActivos.value.forEach((campo) => validarCampo(campo))
  return camposActivos.value.every((campo) => !errors[campo])
}


// Nombres de campo del backend -> nombres de campo de este formulario
const mapaErroresBackend = {
  complemento: 'direccion_complemento',
  cod_departamento: 'departamento',
  cod_municipio: 'municipio',
}

const compactarEspacios = (v) => v.trim().replace(/\s+/g, ' ')

const guardar = async () => {
  if (!validarTodo()) {
    mostrarAlertaConfirmar({
      tipo: 'advertencia',
      titulo: 'Revisa el formulario',
      mensajeHtml: 'Corrige los campos marcados antes de guardar.',
    })
    return
  }

  const payload = {
    tipo_persona: tipoPersona.value,
    correo: form.correo.trim(),
    telefono: form.telefono.replace('-', ''),
    tipo_documento_receptor: form.tipo_documento_receptor,
    // DUI, NIT y carnet se guardan sin guiones
    numero_documento: form.numero_documento.replace(/[\s-]/g, ''),
    cod_departamento: departamentoSeleccionado.value.value,
    cod_municipio: municipioSeleccionado.value.value,
    complemento: compactarEspacios(form.direccion_complemento),
  }

  if (tipoPersona.value === 'NATURAL') {
    payload.nombre = compactarEspacios(form.nombre)
  } else {
    payload.razon_social = compactarEspacios(form.razon_social).toUpperCase()
    payload.giro_actividad = compactarEspacios(form.giro_actividad).toUpperCase()
    // El NRC se muestra con guion pero se guarda sin él
    payload.nrc = form.nrc.replace(/[\s-]/g, '')
  }

  mostrarCargando('Guardando cliente...', 'Registrando la información en el sistema')

  try {
    const [resultado] = await Promise.all([
      store.crearCliente(payload),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ])

    if (resultado.ok) {
      emit('cliente-registrado', resultado.cliente)
      visible.value = false

      const nombreCliente =
        resultado.cliente?.nombre || resultado.cliente?.razon_social || 'El cliente'
      mostrarExito('¡Cliente registrado!', `"${nombreCliente}" fue registrado exitosamente.`)
    } else if (resultado.status === 422) {
      // Si el store devuelve los errores por campo, se muestran bajo cada input
      if (resultado.errors) {
        Object.entries(resultado.errors).forEach(([campo, mensajes]) => {
          const clave = mapaErroresBackend[campo] ?? campo
          if (clave in errors) errors[clave] = mensajes[0]
        })
      }

      mostrarAlertaConfirmar({
        tipo: 'advertencia',
        titulo: 'Error de validación',
        mensajeHtml: resultado.errors
          ? 'Revisa los campos marcados en el formulario.'
          : resultado.error || 'Revisa que los datos ingresados sean válidos.',
      })
    } else if (resultado.status === 403) {
      mostrarAccesoDenegado()
    } else {
      mostrarError('Error', resultado.error || 'No se pudo registrar el cliente.')
    }
  } catch (err) {
    mostrarError('Error inesperado', 'Ocurrió un problema de conexión al guardar el cliente.')
  }
}
</script>

<style>
.swal2-container {
  z-index: 999999 !important;
}
</style>
