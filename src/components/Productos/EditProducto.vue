<template>
  <div class="min-h-screen p-6 md:p-8 font-['Inter',sans-serif] bg-[#eef2e9] text-[#1a2e1f]">
    
    <!-- ENCABEZADO EXTERNO ESTÁNDAR -->
    <div class="flex items-center gap-3 mb-6">
      <div class="!w-10 !h-10 rounded-xl bg-white border border-[#e2e8dd] shadow-sm flex items-center justify-center shrink-0">
        <i class="pi pi-pencil text-[#2b5e3b] text-xl font-bold"></i>
      </div>
      <div>
        <h1 class="text-[28px] md:text-[32px] font-bold text-[#1a2e1f] leading-tight m-0">
          Editar Producto
        </h1>
        <p class="text-[14px] text-gray-500 mt-0.5 m-0">Modifica la información general del producto</p>
      </div>
    </div>

    <!-- TARJETA CONTENEDORA PRINCIPAL -->
    <div class="rounded-2xl bg-white border border-[#e2e8dd] shadow-sm overflow-hidden">

      <!-- FORMULARIO DE EDICIÓN -->
      <div class="p-6 md:p-8">
        <div class="flex flex-col gap-5 w-full">

          <!-- Nombre del Producto -->
          <div class="w-full flex flex-col gap-1.5">
            <label class="text-[14px] font-semibold text-gray-700">
              Nombre del Producto <span class="text-red-500">*</span>
            </label>
            <InputText v-model="nombre"
              class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[14px] !py-2.5 !px-3.5 rounded-xl shadow-xs focus:!border-[#2b5e3b]"
              :class="{ '!border-red-500': errores.nombre }" />
            <small v-if="errores.nombre" class="text-red-500 text-[12px]">{{ errores.nombre }}</small>
          </div>

          <!-- Grid: Fabricante, Categoría y % Ganancia -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-5 w-full">

            <!-- Fabricante -->
            <div class="md:col-span-4 flex flex-col gap-1.5">
              <label class="text-[14px] font-semibold text-gray-700">
                Fabricante <span class="text-red-500">*</span>
              </label>
              <InputText v-model="fabricante" placeholder="Escriba el fabricante..."
                class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[14px] !py-2.5 !px-3.5 rounded-xl shadow-xs focus:!border-[#2b5e3b]"
                :class="{ '!border-red-500': errores.fabricante }" />
              <small v-if="errores.fabricante" class="text-red-500 text-[12px]">{{ errores.fabricante }}</small>
            </div>

            <!-- Categoría -->
            <div class="md:col-span-4 flex flex-col gap-1.5">
              <label class="text-[14px] font-semibold text-gray-700">
                Categoría <span class="text-red-500">*</span>
              </label>
              <AutoComplete v-model="categoria" :suggestions="categoriasFiltradas" optionLabel="nombre" dropdown fluid
                placeholder="Buscar categoría..." @complete="buscarCategorias"
                :class="{ '!border-red-500': errores.categoria }" class="w-full" :pt="{
                  root: { class: 'w-full' },
                  pcInputText: {
                    root: {
                      class: '!bg-white !border-gray-300 !text-[#1a2e1f] !text-[14px] !py-2.5 !px-3.5 rounded-l-xl shadow-xs focus:!border-[#2b5e3b]'
                    }
                  },
                  dropdown: {
                    class: '!bg-white !border-gray-300 rounded-r-xl !py-2.5 border-l-0'
                  }
                }">
                <template #footer>
                  <div v-if="textoBusquedaCategoria" class="px-3 py-2 border-t cursor-pointer hover:bg-gray-100 text-sm"
                    @click="abrirModalCategoria">
                    <i class="pi pi-plus mr-2"></i>
                    Crear nueva categoría <strong>{{ textoBusquedaCategoria }}</strong>
                  </div>
                </template>
              </AutoComplete>
              <small v-if="errores.categoria" class="text-red-500 text-[12px]">{{ errores.categoria }}</small>
            </div>

            <!-- % Ganancia Mínimo -->
            <div class="md:col-span-4 flex flex-col gap-1.5">
              <label class="text-[14px] font-semibold text-gray-700">
                % Ganancia Mínimo
              </label>
              <InputNumber v-model="porcentajeGananciaMinimo" placeholder="Ej: 20.00" suffix="%" :min="0" :max="100"
                :minFractionDigits="1" :maxFractionDigits="2" fluid inputClass="!py-2.5 !px-3.5 w-full !text-[14px]"
                class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] rounded-xl shadow-xs focus:!border-[#2b5e3b]" />
              <small class="text-[12px] text-gray-500 leading-normal">
                Solo si este producto tiene un margen especial diferente a su categoría.
              </small>
            </div>

          </div>

          <!-- Código del Producto -->
          <div class="w-full flex flex-col gap-1.5">
            <label class="text-[14px] font-semibold text-gray-700">Código del Producto</label>
            <InputText v-model="codigoGenerado" readonly fluid
              class="w-full !bg-gray-100 !border-gray-300 !text-[#1a2e1f] !text-[14px] !py-2.5 !px-3.5 !cursor-not-allowed rounded-xl font-mono font-semibold" />
            <small class="text-[12px] text-gray-500">
              Se genera automáticamente al completar Categoría, Nombre y Fabricante.
            </small>
          </div>

        </div>
      </div>

      <!-- BARRA DE ACCIONES INFERIOR DENTRO DE LA TARJETA (DISTRIBUIDA) -->
      <div class="p-5 border-t border-[#e2e8dd] bg-[#fbfdf9] flex justify-between items-center">
        <!-- Regresar a la Izquierda -->
        <Button label="Regresar" icon="pi pi-arrow-left"
          class="!bg-white hover:!bg-[#eef2e9] !text-[#1e3a2f] !border !border-[#cfe0d2] !text-sm !font-semibold !py-2.5 !px-5 rounded-xl transition-all cursor-pointer shadow-xs"
          @click="$emit('close')" />

        <!-- Guardar Cambios a la Derecha -->
        <Button label="Guardar Cambios" icon="pi pi-check" :loading="guardando"
          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white !text-sm !font-semibold !py-2.5 !px-6 rounded-xl transition-all cursor-pointer shadow-sm"
          @click="guardarProducto" />
      </div>

    </div>
  </div>

  <AddCategoriaDialog v-model:visible="mostrarModalCategoria" @categoria-creada="actualizarCategorias" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import AutoComplete from 'primevue/autocomplete'
import AddCategoriaDialog from '@/components/Categorias/AddCategoriaDialog.vue'
import { useproductoStore } from '@/stores/productoStore'
import { mostrarExito, mostrarError } from '@/utils/SweetAlertService'

const props = defineProps({
  producto: { type: Object, required: true },
})

const emit = defineEmits(['close'])
const store = useproductoStore()

const nombre = ref('')
const fabricante = ref('')
const categoria = ref(null)
const porcentajeGananciaMinimo = ref(null)
const tipoProducto = ref('')
const nombreUnidadBase = ref('')
const aplicaIva = ref(false)

const categoriasFiltradas = ref([])
const textoBusquedaCategoria = ref('')
const mostrarModalCategoria = ref(false)
const guardando = ref(false)
const errores = ref({ nombre: '', fabricante: '', categoria: '' })

function limpiarTexto(texto = '') {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .toUpperCase()
}

function generarAcronimoProducto(nombreProd = '') {
  const limpio = limpiarTexto(nombreProd)
  if (!limpio) return ''

  const stopWords = ['DE', 'DEL', 'PARA', 'CON', 'EN', 'EL', 'LA', 'LOS', 'LAS', 'UN', 'UNA', 'Y']
  const palabras = limpio.split(/\s+/).filter(p => !stopWords.includes(p))

  if (palabras.length === 0) return limpio.substring(0, 4)

  if (palabras.length === 1) {
    return palabras[0].substring(0, 4)
  }

  if (palabras.length === 2) {
    const p1 = palabras[0].substring(0, 2)
    const p2 = palabras[1].substring(0, 2)
    return `${p1}${p2}`
  }

  return palabras.map(p => p.charAt(0)).join('').substring(0, 5)
}

function generarCodigoFabricante(fab = '') {
  const limpio = limpiarTexto(fab)
  if (!limpio) return ''

  const palabras = limpio.split(/\s+/)
  if (palabras.length >= 2) {
    return (palabras[0].charAt(0) + palabras[1].substring(0, 2)).substring(0, 3)
  }
  return limpio.substring(0, 3)
}

const codigoGenerado = computed(() => {
  const catObj = categoria.value
  const proNombre = nombre.value || ''
  const fabNombre = fabricante.value || ''

  if (!catObj || !proNombre || !fabNombre) return ''

  const catCode = (catObj.codigo_corto || limpiarTexto(catObj.nombre).substring(0, 3)).toUpperCase()
  const fabCode = generarCodigoFabricante(fabNombre)
  const prodCode = generarAcronimoProducto(proNombre)

  const codigoCompleto = `${catCode}-${fabCode}-${prodCode}`
  return codigoCompleto.substring(0, 24)
})

onMounted(async () => {
  const resultado = await store.cargarCategorias()
  if (resultado?.error) {
    mostrarError('Error', resultado.error)
  }

  nombre.value = props.producto.nombre || ''
  fabricante.value = props.producto.fabricante || ''
  categoria.value =
    store.categorias.find((c) => c.id === props.producto.categoria?.id) ??
    props.producto.categoria ??
    null

  porcentajeGananciaMinimo.value = props.producto.porcentaje_ganancia_minimo !== null
    ? parseFloat(props.producto.porcentaje_ganancia_minimo)
    : null

  tipoProducto.value = props.producto.tipo_producto || ''
  aplicaIva.value = props.producto.aplica_iva || false

  if (props.producto.unidad_medida?.nombre) {
    nombreUnidadBase.value = props.producto.unidad_medida.nombre
  } else if (props.producto.unidad_medida_id) {
    const unidad = store.unidades?.find(u => u.id === props.producto.unidad_medida_id)
    nombreUnidadBase.value = unidad?.nombre || '—'
  }
})

const buscarCategorias = (event) => {
  textoBusquedaCategoria.value = event.query
  if (!event.query.trim()) {
    categoriasFiltradas.value = [...store.categorias]
    return
  }
  categoriasFiltradas.value = store.categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(event.query.toLowerCase())
  )
}

const abrirModalCategoria = () => {
  mostrarModalCategoria.value = true
}

const actualizarCategorias = async () => {
  await store.cargarCategorias()
}

const guardarProducto = async () => {
  errores.value = { nombre: '', fabricante: '', categoria: '' }
  let hayErrores = false

  if (!nombre.value.trim()) {
    errores.value.nombre = 'El nombre es obligatorio.'
    hayErrores = true
  }
  if (!fabricante.value.trim()) {
    errores.value.fabricante = 'El fabricante es obligatorio.'
    hayErrores = true
  }
  if (!categoria.value?.id) {
    errores.value.categoria = 'Seleccione una categoría.'
    hayErrores = true
  }
  if (hayErrores) return

  guardando.value = true

  const payload = {
    nombre: nombre.value.trim().toLowerCase(),
    fabricante: fabricante.value.trim().toLowerCase(),
    categoria_id: categoria.value.id,
    codigo: codigoGenerado.value.toLowerCase(),
    porcentaje_ganancia_minimo: porcentajeGananciaMinimo.value !== null ? porcentajeGananciaMinimo.value : null
  }

  const resultado = await store.actualizarProducto(props.producto.id, payload)
  guardando.value = false

  if (!resultado.ok) {
    mostrarError('No se pudo guardar', resultado.error)
    return
  }

  await mostrarExito('Producto editado', 'La información del producto se actualizó con éxito.')
  emit('close')
}
</script>

<style scoped>
:deep(.p-inputtext:enabled:focus) {
  box-shadow: none !important;
  border-color: #2b5e3b !important;
}

:deep(.p-select:focus) {
  box-shadow: none !important;
  border-color: #2b5e3b !important;
}
</style>