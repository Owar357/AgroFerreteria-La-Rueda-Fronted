<template>
  <div class="bg-[#eef2e9] min-h-screen p-3 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif] w-full overflow-x-hidden">

    <!-- ======================================================= -->
    <!-- VISTA MÓVIL / TABLET (< 1024px)                        -->
    <!-- ======================================================= -->
    <div class="block lg:hidden space-y-4 w-full max-w-full">

      <!-- Botón Volver Móvil -->
      <Button
        icon="pi pi-arrow-left"
        label="Volver a productos"
        severity="secondary"
        text
        class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white !w-full !px-4 !py-2 !rounded-xl !text-xs font-bold transition-all duration-200"
        @click="$emit('close')"
      />

      <!-- Encabezado Móvil -->
      <div class="flex items-center gap-3">
        <div class="!w-10 !h-10 rounded-xl bg-white border border-[#e2e8dd] shadow-2xs flex items-center justify-center shrink-0">
          <i class="pi pi-pencil text-[#2b5e3b] text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[#1a2e1f] leading-tight m-0">
            Editar Producto
          </h1>
          <p class="text-xs text-gray-500 mt-0.5 m-0">
            Modifica la información general del producto
          </p>
        </div>
      </div>

      <!-- Card Formulario Móvil -->
      <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-2xs p-4 space-y-4 w-full">
        
        <!-- Nombre del Producto -->
        <BaseInput
          v-model="nombre"
          label="Nombre del Producto *" 
          placeholder="Ej: Fertilizante Triple 15"
          filter="alphanum"
          :error="errores.nombre"
        />

        <!-- Fabricante -->
        <BaseInput
          v-model="fabricante"
          label="Fabricante *"
          placeholder="Escriba el fabricante..."
          filter="alpha"
          :error="errores.fabricante"
        />

        <!-- Categoría Móvil -->
        <div class="flex flex-col gap-1.5 w-full">
          <label class="text-xs font-semibold text-[#1a2e1f]">
            Categoría <span class="text-red-500">*</span>
          </label>
          <AutoComplete 
            v-model="categoria" 
            :suggestions="categoriasFiltradas" 
            optionLabel="nombre" 
            dropdown 
            fluid
            placeholder="Buscar categoría..." 
            @complete="buscarCategorias"
            :class="{ '!border-red-500': errores.categoria }" 
            class="w-full" 
            :pt="{
              root: { class: 'w-full' },
              pcInputText: {
                root: {
                  class: '!bg-white !border-gray-300 !text-[#1a2e1f] !text-xs !py-2.5 !px-3 rounded-l-xl shadow-xs focus:!border-[#2b5e3b]'
                }
              },
              dropdown: {
                class: '!bg-white !border-gray-300 rounded-r-xl !py-2.5 border-l-0'
              }
            }"
          >
            <template #footer>
              <div 
                v-if="textoBusquedaCategoria" 
                class="px-3 py-2 border-t cursor-pointer hover:bg-gray-100 text-xs"
                @click="abrirModalCategoria"
              >
                <i class="pi pi-plus mr-2"></i>
                Crear nueva categoría <strong>{{ textoBusquedaCategoria }}</strong>
              </div>
            </template>
          </AutoComplete>
          <small v-if="errores.categoria" class="text-red-500 text-[11px] font-medium">{{ errores.categoria }}</small>
        </div>

        <!-- % Ganancia Mínima -->
        <BaseInputPercent
          v-model="porcentajeGananciaMinimo"
          label="% Ganancia Mínima"
          placeholder="Ej: 20.00"
          help="Solo si este producto tiene un margen especial diferente a su categoría."
        />

        <!-- Código del Producto -->
        <BaseInput
          v-model="codigoGenerado"
          label="Código del Producto"
          readonly
          class="font-mono font-semibold"
          help="Se genera automáticamente al completar Categoría, Nombre y Fabricante."
        />

        <!-- Botones Móvil -->
        <div class="pt-3 flex flex-col gap-2 w-full">
          <Button 
            label="Guardar Cambios" 
            icon="pi pi-check" 
            :loading="guardando"
            class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white !text-xs !py-3 rounded-xl font-bold cursor-pointer shadow-md w-full"
            @click="guardarProducto" 
          />
          <Button 
            label="Regresar" 
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
            class="!text-xs !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl !w-full font-semibold cursor-pointer"
            @click="$emit('close')" 
          />
        </div>

      </div>

    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO (>= 1024px)                           -->
    <!-- ======================================================= -->
    <div class="hidden lg:block space-y-6 w-full">

      <!-- Botón Volver PC -->
      <Button
        icon="pi pi-arrow-left"
        label="Volver a productos"
        severity="secondary"
        text
        class="!text-[#2b5e3b] !border !border-[#2b5e3b] hover:!bg-[#2b5e3b] hover:!text-white mb-6 !px-4 !py-2 !rounded-lg transition-all duration-200 cursor-pointer"
        @click="$emit('close')"
      />

      <!-- Encabezado PC -->
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-white p-3 rounded-2xl shadow-sm border border-[#e2e8dd]">
          <i class="pi pi-pencil text-[24px] text-[#5F6B52]"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#1e3a2f] m-0">Editar Producto</h1>
          <p class="text-gray-500 text-sm mt-1 m-0">Modifica la información general del producto.</p>
        </div>
      </div>

      <!-- Card Formulario PC -->
      <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-sm p-6 space-y-6">
        
        <!-- Nombre del Producto -->
        <BaseInput
          v-model="nombre"
          label="Nombre del Producto *" 
          placeholder="Ej: Fertilizante Triple 15"
          size="xl"
          filter="alphanum"
          :error="errores.nombre"
        />

        <!-- Grid: Fabricante, Categoría y % Ganancia -->
        <div class="grid grid-cols-12 gap-5 w-full items-start">

          <!-- Fabricante -->
          <BaseInput
            v-model="fabricante"
            label="Fabricante *"
            size="xl"
            placeholder="Escriba el fabricante..."
            filter="alpha"
            class="col-span-4"
            :error="errores.fabricante"
          />

          <!-- Categoría -->
          <div class="col-span-4 flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#1a2e1f]">
              Categoría <span class="text-red-500">*</span>
            </label>
            <AutoComplete 
              v-model="categoria" 
              :suggestions="categoriasFiltradas" 
              optionLabel="nombre" 
              dropdown 
              fluid
              placeholder="Buscar categoría..." 
              @complete="buscarCategorias"
              :class="{ '!border-red-500': errores.categoria }" 
              class="w-full" 
              :pt="{
                root: { class: 'w-full' },
                pcInputText: {
                  root: {
                    class: '!bg-white !border-gray-300 !text-[#1a2e1f] !text-sm !py-2.5 !px-3.5 rounded-l-xl shadow-xs focus:!border-[#2b5e3b]'
                  }
                },
                dropdown: {
                  class: '!bg-white !border-gray-300 rounded-r-xl !py-2.5 border-l-0'
                }
              }"
            >
              <template #footer>
                <div 
                  v-if="textoBusquedaCategoria" 
                  class="px-3 py-2 border-t cursor-pointer hover:bg-gray-100 text-sm"
                  @click="abrirModalCategoria"
                >
                  <i class="pi pi-plus mr-2"></i>
                  Crear nueva categoría <strong>{{ textoBusquedaCategoria }}</strong>
                </div>
              </template>
            </AutoComplete>
            <small v-if="errores.categoria" class="text-red-500 text-xs font-medium">{{ errores.categoria }}</small>
          </div>

          <!-- % Ganancia Mínima -->
          <BaseInputPercent
            v-model="porcentajeGananciaMinimo"
            label="% Ganancia Mínima"
            placeholder="Ej: 20.00"
            size="xl"
            class="col-span-4"
            help="Solo si este producto tiene un margen especial diferente a su categoría."
          />

        </div>

        <!-- Código del Producto -->
        <BaseInput
          v-model="codigoGenerado"
          label="Código del Producto"
          readonly
          size="xl"
          class="font-mono font-semibold"
          help="Se genera automáticamente al completar Categoría, Nombre y Fabricante."
        />

        <!-- Botones PC (Alineados al 50/50 o extremos con bordes limpios) -->
        <div class="flex justify-between items-center mt-3 pt-4 border-t border-[#e2e8dd] w-full">
          <Button 
            label="Regresar" 
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
            class="!text-sm !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl font-semibold cursor-pointer w-[47%] flex justify-center items-center"
            @click="$emit('close')" 
          />
          <Button 
            label="Guardar Cambios" 
            icon="pi pi-check" 
            :loading="guardando"
            class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold !py-2.5 rounded-xl border-none cursor-pointer shadow-lg transition-colors w-[47%] flex justify-center items-center"
            @click="guardarProducto" 
          />
        </div>

      </div>

    </div>

    <!-- Modal Auxiliar Crear Categoría -->
    <AddCategoriaDialog v-model:visible="mostrarModalCategoria" @categoria-creada="actualizarCategorias" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Button from 'primevue/button'
import AutoComplete from 'primevue/autocomplete'
import AddCategoriaDialog from '@/components/Categorias/AddCategoriaDialog.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseInputPercent from '@/components/base/BaseInputPercent.vue'
import { useproductoStore } from '@/stores/productoStore'
import { 
  mostrarExito, 
  mostrarError, 
  mostrarAccesoDenegado, 
  mostrarCargando 
} from '@/utils/SweetAlertService'

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
    mostrarError('Atención', 'No se pudieron cargar las categorías.')
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
  mostrarCargando('Guardando cambios...', 'Actualizando la información del producto')

  const payload = {
    nombre: nombre.value.trim().toLowerCase(),
    fabricante: fabricante.value.trim().toLowerCase(),
    categoria_id: categoria.value.id,
    codigo: codigoGenerado.value.toLowerCase(),
    porcentaje_ganancia_minimo: porcentajeGananciaMinimo.value !== null ? porcentajeGananciaMinimo.value : null
  }

  try {
    const [resultado] = await Promise.all([
      store.actualizarProducto(props.producto.id, payload),
      new Promise((resolve) => setTimeout(resolve, 500))
    ])

    if (resultado.status === 403) {
      mostrarAccesoDenegado()
      return
    }

    if (!resultado.ok) {
      mostrarError('No se pudo guardar', resultado.error || 'Ocurrió un error inesperado al actualizar.')
      return
    }

    await mostrarExito('Producto actualizado', 'La información del producto se actualizó con éxito.')
    emit('close')
  } catch (err) {
    mostrarError('Error de conexión', 'No se pudo comunicar con el servidor.')
  } finally {
    guardando.value = false
  }
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