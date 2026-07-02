<template>
  <div class="min-h-screen p-8 font-['Inter',sans-serif] bg-[#eef2e9] text-[#1a2e1f]">
    <Button
      label="Regresar"
      icon="pi pi-arrow-left"
      class="!text-[22px] !py-4 !px-10 !bg-[#2b5e3b] !border-[#2b5e3b] !text-white !font-['Inter',sans-serif] mb-8"
      @click="$emit('close')"
    />

    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-[48px] font-semibold text-[#1a2e1f] leading-tight m-0">Editar Producto</h1>
        <p class="text-[20px] text-gray-500 mt-2">
          Modifica la información general del producto
        </p>
      </div>
    </div>

    <div class="rounded-2xl p-8 mb-6 bg-white border border-[#e2e8dd]">
      <div class="flex items-center gap-3 mb-6 pb-5 border-b border-[#e2e8dd]">
        <i class="pi pi-box text-[#e0b354] text-[22px]"></i>
        <span class="text-[32px] font-semibold text-[#1a2e1f]">
          1. Información General del Producto
        </span>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <!-- Nombre -->
        <div class="col-span-2 flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600">
            Nombre del Producto <span class="text-red-500">*</span>
          </label>
          <InputText
            v-model="nombre"
            class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px]"
            :class="{ '!border-red-500': errores.nombre }"
          />
          <small v-if="errores.nombre" class="text-red-500 text-[14px]">{{ errores.nombre }}</small>
        </div>

        <!-- Fabricante -->
        <div class="col-span-2 flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600">
            Fabricante <span class="text-red-500">*</span>
          </label>
          <InputText
            v-model="fabricante"
            placeholder="Escriba el nombre del fabricante..."
            class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px]"
            :class="{ '!border-red-500': errores.fabricante }"
          />
          <small v-if="errores.fabricante" class="text-red-500 text-[14px]">{{ errores.fabricante }}</small>
        </div>

        <!-- Categoría -->
        <div class="col-span-2 flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600">
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
          >
            <template #footer>
              <div
                v-if="textoBusquedaCategoria"
                class="px-3 py-3 border-t cursor-pointer hover:bg-gray-100"
                @click="abrirModalCategoria"
              >
                <i class="pi pi-plus mr-2"></i>
                Crear nueva categoría <strong>{{ textoBusquedaCategoria }}</strong>
              </div>
            </template>
          </AutoComplete>
          <small v-if="errores.categoria" class="text-red-500 text-[14px]">{{ errores.categoria }}</small>
        </div>

        <!-- Código del Producto -->
        <div class="col-span-2 flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600">Código del Producto</label>
          <InputText
            v-model="codigoGenerado"
            readonly
            fluid
            class="w-full !bg-gray-50 !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px] !cursor-not-allowed"
          />
          <small class="text-[14px] text-gray-500">
            Se genera automáticamente al completar Categoría, Nombre y Fabricante.
          </small>
        </div>
      </div>
    </div>

    <!-- Botón guardar -->
    <div class="flex justify-end">
      <Button
        label="Guardar Producto Editado"
        icon="pi pi-save"
        :loading="guardando"
        class="!text-[22px] !py-4 !px-10 !bg-[#2b5e3b] !border-[#2b5e3b] !text-white !font-['Inter',sans-serif]"
        @click="guardarProducto"
      />
    </div>
  </div>

  <AddCategoriaDialog
    v-model:visible="mostrarModalCategoria"
    @categoria-creada="actualizarCategorias"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import AutoComplete from 'primevue/autocomplete'
import AddCategoriaDialog from '@/components/Categorias/AddCategoriaDialog.vue'
import { useproductoStore } from '@/stores/productoStore'
import Swal from 'sweetalert2'


//aqui recnibe el producto seleccionado dese el padre
const props = defineProps({
    producto: { type: Object, required: true}
})

const emit = defineEmits(['close'])
const store = useproductoStore()

onMounted(async () => {
  await store.cargarCategorias()

  //aqui rellena,mos los datos con los datos del producto
  nombre.value = props.producto.nombre || ''
  fabricante.value = props.producto.fabricante || ''

  // y aqui busco el objecto categoria en el store para que lo autocomplete
  categoria.value = store.categorias.find(c => c.id === props.producto.categoria?.id) ?? props.producto.categoria ?? null
})


const nombre = ref('')
const fabricante = ref('')
const categoria = ref(null)
const categoriasFiltradas = ref([])
const textoBusquedaCategoria = ref('')
const mostrarModalCategoria = ref(false)
const guardando = ref(false)
const errores = ref({ nombre: '', fabricante: '', categoria: '' })

const buscarCategorias = (event) => {
  textoBusquedaCategoria.value = event.query
  if (!event.query.trim()) {
    categoriasFiltradas.value = [...store.categorias]
    return
  }
  categoriasFiltradas.value = store.categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(event.query.toLowerCase()),
  )
}

const abrirModalCategoria = () => {
  mostrarModalCategoria.value = true
}

const actualizarCategorias = async () => {
  await store.cargarCategorias()
}

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

const guardarProducto = async () => {
  // limpiamos los errores
  errores.value = { nombre: '', fabricante: '', categoria: '', }
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

  // Editamos solo en memoria local, sin llamar a la DB
  store.editarProductoLocal(props.producto.id, {
    nombre:     nombre.value.trim().toLowerCase(),
    fabricante: fabricante.value.trim().toLowerCase(),
    categoria:  categoria.value,
    codigo:     codigoGenerado.value.toLowerCase(),
  })

    guardando.value = false

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