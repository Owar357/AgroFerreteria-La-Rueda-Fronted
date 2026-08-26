<template>
  <div class="min-h-screen p-8 font-['Inter',sans-serif] bg-[#eef2e9] text-[#1a2e1f]">
    <div class="flex justify-between items-center mb-8">
  <div>
    <h1 class="text-[48px] font-semibold text-[#1a2e1f] leading-tight m-0">Editar Producto</h1>
    <p class="text-[20px] text-gray-500 mt-2">Modifica la información general del producto</p>
  </div>
  <Button label="Regresar" icon="pi pi-arrow-left"
    class="!text-[22px] !py-4 !px-20 !bg-[#2b5e3b] !border-[#2b5e3b] !text-white !font-['Inter',sans-serif]"
    @click="$emit('close')" />
</div>



    <div class="rounded-2xl p-8 mb-6 bg-white border border-[#e2e8dd]">

      <!-- Encabezado Principal -->
      <div class="flex items-center gap-3 mb-6 pb-5 border-b border-[#e2e8dd]">
        <span class="text-[32px] font-semibold text-[#1a2e1f]">
          1. Información General del Producto
        </span>
      </div>

      <!-- FILA 1: CUADROS INFORMATIVOS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 ">
        <!-- Tipo de Producto (Granel) -->
        <div class="bg-gray-50/80 p-4 rounded-xl border border-[#e2e8dd]/60 flex flex-col justify-between">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Tipo de Producto</p>
          <div
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[15px] font-bold bg-[#1a2e1f]/10 text-[#1a2e1f] border border-[#1a2e1f]/20 self-start">
            <i class="pi pi-tag text-[13px]"></i>
            {{ tipoProducto || '—' }}
          </div>
        </div>

        <!-- Unidad Base -->
        <div class="bg-gray-50/80 p-4 rounded-xl border border-[#e2e8dd]/60 flex flex-col justify-between">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Unidad Base</p>
          <div
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[15px] font-bold bg-[#2b5e3b]/10 text-[#2b5e3b] border border-[#2b5e3b]/20 self-start">
            <i class="pi pi-calculator text-[13px]"></i>
            {{ nombreUnidadBase || '—' }}
          </div>
        </div>

        <!-- Aplica IVA -->
        <div class="bg-gray-50/80 p-4 rounded-xl border border-[#e2e8dd]/60 flex flex-col justify-between">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Aplica IVA</p>
          <div
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[15px] font-bold border transition-colors self-start"
            :class="aplicaIva ? 'bg-[#2b5e3b]/10 text-[#2b5e3b] border-[#2b5e3b]/20' : 'bg-gray-100 text-gray-600 border-gray-200'">
            <i :class="aplicaIva ? 'pi pi-check-circle' : 'pi pi-times-circle'" class="text-[13px]"></i>
            {{ aplicaIva ? 'Sí (13%)' : 'No Exento' }}
          </div>
        </div>
      </div>

      <!-- FILA 2: GRID DEL FORMULARIO DE ENTRADA -->
      <div class="flex flex-col gap-6 w-full">

        <!-- Fila 1: Nombre del Producto-->
        <div class="w-full flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600">
            Nombre del Producto <span class="text-red-500">*</span>
          </label>
          <InputText v-model="nombre"
            class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px] rounded-xl shadow-sm focus:!border-[#2b5e3b]"
            :class="{ '!border-red-500': errores.nombre }" />
          <small v-if="errores.nombre" class="text-red-500 text-[14px]">{{ errores.nombre }}</small>
        </div>

        <!-- Fila 2: -->
        <div class="flex flex-col md:flex-row gap-6 w-full">

          <!-- FABRICANTE -->
          <div class="w-full md:w-[60%] flex flex-col gap-2">
            <label class="text-[20px] font-medium text-gray-600">
              Fabricante <span class="text-red-500">*</span>
            </label>
            <InputText v-model="fabricante" placeholder="Escriba el nombre del fabricante..."
              class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px] rounded-xl shadow-sm focus:!border-[#2b5e3b]"
              :class="{ '!border-red-500': errores.fabricante }" />
            <small v-if="errores.fabricante" class="text-red-500 text-[14px]">{{ errores.fabricante }}</small>
          </div>

          <!-- CATEGORÍA -->
          <div class="w-full md:w-[40%] flex flex-col gap-2">
            <label class="text-[20px] font-medium text-gray-600">
              Categoría <span class="text-red-500">*</span>
            </label>
            <AutoComplete v-model="categoria" :suggestions="categoriasFiltradas" optionLabel="nombre" dropdown fluid
              placeholder="Buscar categoría..." @complete="buscarCategorias"
              :class="{ '!border-red-500': errores.categoria }" class="w-full" :pt="{
                root: { class: 'w-full' },
                pcInputText: {
                  root: {
                    class: '!bg-white !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px] rounded-l-xl shadow-sm focus:!border-[#2b5e3b]'
                  }
                },
                dropdown: {
                  class: '!bg-white !border-gray-300 rounded-r-xl !py-[14px] border-l-0'
                }
              }">
              <template #footer>
                <div v-if="textoBusquedaCategoria" class="px-3 py-3 border-t cursor-pointer hover:bg-gray-100"
                  @click="abrirModalCategoria">
                  <i class="pi pi-plus mr-2"></i>
                  Crear nueva categoría <strong>{{ textoBusquedaCategoria }}</strong>
                </div>
              </template>
            </AutoComplete>
            <small v-if="errores.categoria" class="text-red-500 text-[14px]">{{ errores.categoria }}</small>
          </div>

        </div>

        <div class="w-full flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600">Código del Producto</label>
          <InputText v-model="codigoGenerado" readonly fluid
            class="w-full !bg-gray-50 !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px] !cursor-not-allowed rounded-xl" />
          <small class="text-[14px] text-gray-500">
            Se genera automáticamente al completar Categoría, Nombre y Fabricante.
          </small>
        </div>

      </div>

    </div>

    <!-- Botón guardar -->
    <div class="flex justify-end">
      <Button label="Guardar Producto Editado" icon="pi pi-save" :loading="guardando"
        class="!text-[22px] !py-4 !px-10 !bg-[#2b5e3b] !border-[#2b5e3b] !text-white !font-['Inter',sans-serif]"
        @click="guardarProducto" />
    </div>
  </div>

  <AddCategoriaDialog v-model:visible="mostrarModalCategoria" @categoria-creada="actualizarCategorias" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import AutoComplete from 'primevue/autocomplete'
import AddCategoriaDialog from '@/components/Categorias/AddCategoriaDialog.vue'
import { useproductoStore } from '@/stores/productoStore'
import Swal from 'sweetalert2'

const props = defineProps({
  producto: { type: Object, required: true },
})

const emit = defineEmits(['close'])
const store = useproductoStore()

// ============================================================
// DATOS DEL PRODUCTO
// ============================================================
const nombre = ref('')
const fabricante = ref('')
const categoria = ref(null)
const tipoProducto = ref('')
const nombreUnidadBase = ref('')
const aplicaIva = ref(false)

const categoriasFiltradas = ref([])
const textoBusquedaCategoria = ref('')
const mostrarModalCategoria = ref(false)
const guardando = ref(false)
const errores = ref({ nombre: '', fabricante: '', categoria: '' })

// ============================================================
// CARGA INICIAL
// ============================================================
onMounted(async () => {
  const resultado = await store.cargarCategorias()
  if (resultado?.error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: resultado.error,
      confirmButtonColor: '#2b5e3b',
    })
  }

  // Asignar valores del producto
  nombre.value = props.producto.nombre || ''
  fabricante.value = props.producto.fabricante || ''
  categoria.value =
    store.categorias.find((c) => c.id === props.producto.categoria?.id) ??
    props.producto.categoria ??
    null

  // Información adicional (solo lectura)
  tipoProducto.value = props.producto.tipo_producto || ''
  aplicaIva.value = props.producto.aplica_iva || false

  // Obtener nombre de la unidad base
  if (props.producto.unidad_medida?.nombre) {
    nombreUnidadBase.value = props.producto.unidad_medida.nombre
  } else if (props.producto.unidad_medida_id) {
    // Si solo tenemos el ID, buscar el nombre en las unidades cargadas
    const unidad = store.unidades?.find(u => u.id === props.producto.unidad_medida_id)
    nombreUnidadBase.value = unidad?.nombre || '—'
  }
})

// ============================================================
// CATEGORÍAS
// ============================================================
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

// ============================================================
// CÓDIGO GENERADO
// ============================================================
const limpiarTexto = (texto = '') =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()

const tresPrimeras = (texto = '') => limpiarTexto(texto).substring(0, 3)

const codigoGenerado = computed(() => {
  const catNombre = categoria.value?.nombre || ''
  const proNombre = nombre.value || ''
  const fabNombre = fabricante.value || ''
  if (!catNombre || !proNombre || !fabNombre) return ''
  return tresPrimeras(catNombre) + tresPrimeras(proNombre) + tresPrimeras(fabNombre)
})

// ============================================================
// GUARDAR
// ============================================================
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

  const resultado = await store.actualizarProducto(props.producto.id, {
    nombre: nombre.value.trim().toLowerCase(),
    fabricante: fabricante.value.trim().toLowerCase(),
    categoria_id: categoria.value.id,
    codigo: codigoGenerado.value.toLowerCase(),
  })

  guardando.value = false

  if (!resultado.ok) {
    Swal.fire({
      icon: 'error',
      title: 'No se pudo guardar',
      text: resultado.error,
      confirmButtonColor: '#b91c1c',
    })
    return
  }

  await Swal.fire({
    icon: 'success',
    title: 'Producto editado',
    text: 'Producto editado con éxito',
    confirmButtonColor: '#2b5e3b',
    confirmButtonText: 'Aceptar',
  })
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