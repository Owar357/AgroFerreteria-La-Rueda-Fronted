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
        <h1 class="text-[48px] font-semibold text-[#1a2e1f] leading-tight m-0">Nuevo Producto</h1>
        <p class="text-[20px] text-gray-500 mt-2">
          Completa la información del producto y sus presentaciones
        </p>
      </div>
    </div>

    <div class="rounded-2xl p-8 mb-6 bg-white border border-[#e2e8dd]">
      <div class="flex items-center gap-3 mb-6 pb-5 border-b border-[#e2e8dd]">
        <i class="pi pi-box text-[#e0b354] text-[22px]"></i>
        <span class="text-[32px] font-semibold text-[#1a2e1f]"
          >1. Información General del Producto</span
        >
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="col-span-2 flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600"
            >Nombre del Producto <span class="text-red-500">*</span></label
          >
          <InputText
            v-model="nombre"
            class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px]"
            :class="{ '!border-red-500': errores.nombre }"
          />
          <small v-if="errores.nombre" class="text-red-500 text-[14px]">{{ errores.nombre }}</small>
        </div>

        <div class="col-span-2 flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600"
            >Fabricante <span class="text-red-500">*</span></label
          >
          <InputText
            v-model="fabricante"
            placeholder="Escriba el nombre del fabricante..."
            class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px]"
            :class="{ '!border-red-500': errores.fabricante }"
          />
          <small v-if="errores.fabricante" class="text-red-500 text-[14px]">{{
            errores.fabricante
          }}</small>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600"
            >Categoría <span class="text-red-500">*</span></label
          >
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
          <small v-if="errores.categoria" class="text-red-500 text-[14px]">{{
            errores.categoria
          }}</small>
        </div>

        <div class="col-span-2 flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600">Código del Producto</label>
          <InputText
            v-model="codigoGenerado"
            readonly
            fluid
            class="w-full !bg-gray-50 !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px] !cursor-not-allowed"
          />
          <small class="text-[14px] text-gray-500"
            >Se genera automáticamente al completar Categoría, Nombre y Fabricante.</small
          >
        </div>

        <div class="col-span-2 flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600"
            >Unidad Base <span class="text-red-500">*</span></label
          >
          <InputText
            v-model="unidadBase"
            placeholder="Ej: libra, gramo, semilla, unidad..."
            class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px]"
            :class="{ '!border-red-500': errores.unidadBase }"
          />
          <small v-if="errores.unidadBase" class="text-red-500 text-[14px]">{{
            errores.unidadBase
          }}</small>
          <p class="text-base text-gray-500 mt-1">
            Es la unidad mínima de almacenamiento de stock.
          </p>
        </div>

        <div class="col-span-2 flex flex-col gap-3">
          <label class="text-[20px] font-medium text-gray-600"
            >Tipo de Venta <span class="text-red-500">*</span></label
          >
          <div class="flex flex-wrap gap-6">
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="tipoProducto"
                inputId="venta1"
                name="tipoProducto"
                value="UNIDAD FIJA"
              />
              <label for="venta1" class="text-[20px] text-[#1a2e1f] cursor-pointer"
                >Unidad Fija</label
              >
            </div>
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="tipoProducto"
                inputId="venta2"
                name="tipoProducto"
                value="GRANEL"
              />
              <label for="venta2" class="text-[20px] text-[#1a2e1f] cursor-pointer">Granel</label>
            </div>
          </div>
          <small v-if="errores.tipoProducto" class="text-red-500 text-[14px]">{{
            errores.tipoProducto
          }}</small>
        </div>

        <div class="col-span-2 flex flex-col justify-end">
          <div class="flex items-center gap-3 py-[14px]">
            <Checkbox
              v-model="aplicaIva"
              :binary="true"
              inputId="ivaGeneral"
              class="!w-[22px] !h-[22px]"
            />
            <label for="ivaGeneral" class="text-[20px] text-[#1a2e1f] cursor-pointer"
              >Aplica IVA 13% (para todas las presentaciones)</label
            >
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-2xl p-8 mb-6 bg-white border border-[#e2e8dd]">
      <div class="flex items-center gap-3 mb-6 pb-5 border-b border-[#e2e8dd]">
        <i class="pi pi-tags text-[#e0b354] text-[22px]"></i>
        <span class="text-[32px] font-semibold text-[#1a2e1f]"
          >2. Información de las Presentaciones del Producto</span
        >
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600">Nombre de la presentación</label>
          <InputText
            v-model="presentacionActual.nombre"
            placeholder="Ej: Quintal, Arroba, Libra, 50ml..."
            class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[22px]"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600">Código de barra</label>
          <InputText
            v-model="presentacionActual.codigoBarra"
            placeholder="Ej: 7501234567890"
            class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[22px]"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600">
            ¿Cuántas
            <span class="bg-[#dff0e0] text-[#1e3a2f] px-2 py-0.5 rounded-full"
              >[{{ unidadBase || 'unidad base' }}]</span
            >
            equivale esta presentación?
          </label>
          <div class="flex items-center gap-4">
            <InputNumber
              v-model="presentacionActual.equivalencia"
              placeholder="0"
              :min="0"
              :inputProps="{
                class:
                  '!bg-white !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px] !w-full',
              }"
            />
            <span
              class="bg-[#dff0e0] text-[#1e3a2f] text-[20px] font-medium whitespace-nowrap rounded-full px-5 py-3"
            >
              {{ unidadBase || 'unidad base' }}
            </span>
          </div>
          <p class="text-base text-gray-500 mt-1">
            Si la unidad base es 'libra' y esta presentación es Quintal, equivale a 100 libras.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600">Precio Neto</label>
          <InputNumber
            v-model="presentacionActual.precioNeto"
            placeholder="0.00"
            :min="0"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            mode="currency"
            currency="USD"
            locale="es-SV"
            :inputProps="{
              class:
                '!bg-white !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px] !w-full',
            }"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600">IVA Aplicado (13%)</label>
          <InputNumber
            :modelValue="ivaCalculado"
            disabled
            :minFractionDigits="2"
            :maxFractionDigits="2"
            mode="currency"
            currency="USD"
            locale="es-SV"
            inputClass="!bg-[#f2f5ef] !border-gray-300 !text-gray-500 !text-[20px] !py-[14px] !px-[18px] !w-full !cursor-not-allowed"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[20px] font-medium text-gray-600">Precio Total</label>
          <InputNumber
            :modelValue="precioTotal"
            disabled
            :minFractionDigits="2"
            :maxFractionDigits="2"
            mode="currency"
            currency="USD"
            locale="es-SV"
            inputClass="!bg-[#f2f5ef] !border-gray-300 !text-[#1a2e1f] !text-[20px] !py-[14px] !px-[18px] !w-full !cursor-not-allowed"
            class="w-full"
          />
        </div>
      </div>

      <div class="flex gap-4 mt-8">
        <Button
          label="Añadir Nueva Presentación"
          icon="pi pi-plus"
          class="flex-1 !text-[20px] !py-4 !bg-[#2b5e3b] !border-[#2b5e3b] !text-white !font-['Inter',sans-serif]"
          @click="agregarPresentacion"
        />
        <Button
          label="Limpiar Formulario"
          icon="pi pi-trash"
          class="flex-1 !text-[20px] !py-4 !bg-[#eef2e9] !border-[#e2e8dd] !text-[#1a2e1f] !font-['Inter',sans-serif]"
          @click="limpiarFormularioPresentacion"
        />
      </div>
    </div>

    <div class="rounded-2xl p-8 mb-6 bg-white border border-[#e2e8dd]">
      <div class="flex items-center gap-3 mb-6 pb-5 border-b border-[#e2e8dd]">
        <i class="pi pi-database text-[#e0b354] text-[22px]"></i>
        <span class="text-[32px] font-semibold text-[#1a2e1f]">Presentaciones Agregadas</span>
      </div>

      <DataTable
        :value="presentaciones"
        :paginator="presentaciones.length > 5"
        :rows="5"
        class="font-['Inter',sans-serif] text-[20px]"
        emptyMessage="No hay presentaciones agregadas aún"
      >
        <Column field="nombre" header="Nombre" class="!text-[20px]" />
        <Column field="fabricante" header="Fabricante" class="!text-[20px]" />
        <Column field="codigoBarra" header="Código Barra" class="!text-[20px]" />
        <Column field="equivalencia" header="Equivalencia" class="!text-[20px]" />
        <Column field="unidadBase" header="Unidad Base" class="!text-[20px]" />
        <Column field="precioSinIva" header="Precio (S/IVA)" class="!text-[20px]">
          <template #body="{ data }">{{ formatCurrency(data.precioSinIva) }}</template>
        </Column>
        <Column field="ivaAplicado" header="IVA" class="!text-[20px]">
          <template #body="{ data }">{{ formatCurrency(data.ivaAplicado) }}</template>
        </Column>
        <Column field="precioConIva" header="Precio (C/IVA)" class="!text-[20px]">
          <template #body="{ data }">{{ formatCurrency(data.precioConIva) }}</template>
        </Column>
        <Column header="Acciones" class="!text-[20px]">
          <template #body="slotProps">
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              @click="eliminarPresentacion(slotProps.index)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <div class="flex justify-end">
      <Button
        label="Guardar Producto"
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
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import AutoComplete from 'primevue/autocomplete'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Swal from 'sweetalert2'
import AddCategoriaDialog from '@/components/Categorias/AddCategoriaDialog.vue'
import { useproductoStore } from '@/stores/productoStore'

const emit = defineEmits(['close'])
const store = useproductoStore()


onMounted(async () => {
  await store.cargarCategorias()
})


const nombre = ref('')
const fabricante = ref('')
const categoria = ref(null)
const categoriasFiltradas = ref([])
const textoBusquedaCategoria = ref('')
const mostrarModalCategoria = ref(false)
const unidadBase = ref('')
const tipoProducto = ref(null)
const aplicaIva = ref(false)
const guardando = ref(false)
const errores = ref({ nombre: '', fabricante: '', categoria: '', unidadBase: '', tipoProducto: '' })

//funcion para buscar las caegoria
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

//funcioa para abriri el modal de categoria
const abrirModalCategoria = () => {
  mostrarModalCategoria.value = true
}

//Recarara las categorias
const actualizarCategorias = async () => {
  await store.cargarCategorias()
}

// aqui generamosel codigo interno del producto tomando las 3 primera lñetras dela categori ay el nombre
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

  if (!catNombre || !proNombre || !fabricante.value) {
    return ''
  }
  return tresPrimeras(catNombre) + tresPrimeras(proNombre) + tresPrimeras(fabNombre)
})

// estado de las seccion 2
const presentacionActual = ref({
  nombre: '',
  codigoBarra: '',
  equivalencia: null,
  precioNeto: null,
})
const presentaciones = ref([])

// aqui hacemos el calculo del iva
const ivaCalculado = computed(() => {
  const neto = presentacionActual.value.precioNeto || 0
  return aplicaIva.value ? parseFloat((neto * 0.13).toFixed(2)) : 0
})

const precioTotal = computed(() => {
  const neto = presentacionActual.value.precioNeto || 0
  return aplicaIva.value ? parseFloat((neto + neto * 0.13).toFixed(2)) : neto
})

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value || 0)

const limpiarFormularioPresentacion = () => {
  presentacionActual.value = { nombre: '', codigoBarra: '', equivalencia: null, precioNeto: null }
}

// ── Agregar presentación a la lista local ─────────────────────────────────────
const agregarPresentacion = () => {
  if (!fabricante.value.trim()) {
    Swal.fire({
      icon: 'Warning',
      title: 'Fabricante requerido',
      text: 'Debe ingresar el nombre de el fabricante',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }
  if (!presentacionActual.value.nombre) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo incompleto',
      text: 'Ingrese el nombre de la presentación.',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }
  if (!presentacionActual.value.equivalencia || presentacionActual.value.equivalencia <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Equivalencia inválida',
      text: 'Ingrese una equivalencia mayor a 0.',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }
  if (!presentacionActual.value.precioNeto || presentacionActual.value.precioNeto <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Precio inválido',
      text: 'Ingrese un precio neto válido mayor a 0.',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }
  if (!unidadBase.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Unidad base requerida',
      text: 'Primero defina la unidad base del producto.',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }
  if (presentacionActual.value.codigoBarra) {
    const existe = presentaciones.value.some(
      (p) => p.codigoBarra === presentacionActual.value.codigoBarra,
    )
    if (existe) {
      Swal.fire({
        icon: 'warning',
        title: 'Código duplicado',
        text: 'Este código de barra ya existe en otra presentación.',
        confirmButtonColor: '#2b5e3b',
      })
      return
    }
  }

  presentaciones.value.push({
    nombre: presentacionActual.value.nombre,
    fabricante: fabricante.value.trim(),
    codigoBarra: presentacionActual.value.codigoBarra || '',
    equivalencia: Number(presentacionActual.value.equivalencia),
    unidadBase: unidadBase.value,
    aplicaIva: aplicaIva.value,
    precioSinIva: Number(presentacionActual.value.precioNeto),
    ivaAplicado:  Number(ivaCalculado.value),
    precioConIva: Number(precioTotal.value),
  })

  limpiarFormularioPresentacion()

  Swal.fire({
    icon: 'success',
    title: 'Presentación agregada',
    timer: 1500,
    showConfirmButton: false,
  })
}

// alerta de precausion por si si queire eliminar la presentacion
const eliminarPresentacion = async (index) => {
  const resultado = await Swal.fire({
    title: '¿Eliminar presentación?',
    text: 'Quiere eliminar esta presentación de la tabla.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
  })
  if (resultado.isConfirmed) {
    presentaciones.value.splice(index, 1)
    Swal.fire({ icon: 'success', title: 'Eliminada', timer: 1500, showConfirmButton: false })
  }
}

// aqui guardamos el producto ta de manera ral
const guardarProducto = async () => {
  // Limpiar errores
  errores.value = { nombre: '', fabricante: '', categoria: '', unidadBase: '', tipoProducto: '' }
  let hayErrores = false

  if (!nombre.value.trim()) {
    errores.value.nombre = 'El nombre es obligatorio.'
    hayErrores = true
  }
  if (!categoria.value?.id) {
    errores.value.categoria = 'Seleccione una categoría.'
    hayErrores = true
  }
  if (!fabricante.value.trim()) {
    errores.value.fabricante = 'El fabricante es obligatorio.'
    hayErrores = true
  }

  if (!unidadBase.value.trim()) {
    errores.value.unidadBase = 'La unidad base es obligatoria.'
    hayErrores = true
  }
  if (!tipoProducto.value) {
    errores.value.tipoProducto = 'Seleccione el tipo de venta.'
    hayErrores = true
  }

  if (hayErrores) return

  if (presentaciones.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin presentaciones',
      text: 'Debe agregar al menos una presentación.',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }

  // mandamos el payload
  const payload = {
    codigo: codigoGenerado.value.toLowerCase(),
    nombre: nombre.value.trim().toLowerCase(),
    fabricante: fabricante.value.trim().toLowerCase(),
    tipo_producto: tipoProducto.value,
    unidad_base: unidadBase.value.trim().toLowerCase(),
    aplica_iva: aplicaIva.value,
    categoria_id: categoria.value.id,
    presentaciones: presentaciones.value.map((p) => ({
      nombre: p.nombre.toLowerCase(),
      fabricante: p.fabricante.toLowerCase(),
      factor_conversion: p.equivalencia,
      precio_venta: p.precioConIva,
      codigos_barra: p.codigoBarra ? [{ codigo: p.codigoBarra }] : [],
    })),
  }

  guardando.value = true
  const resultado = await store.crearProducto(payload)
  guardando.value = false

  if (resultado.ok) {
    resetFormularioCompleto()
    await Swal.fire({
      icon: 'success',
      title: '¡producto guardado!',
      text: 'El producto fue guardado con éxito',
      confirmButtonColor: '#2b5e3b',
      confirmButtonText: 'Aceptar',
    })
    emit('close')
  } else if (resultado.error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de validación',
      text: resultado.error,
      confirmButtonColor: '#2b5e3b',
    })
  }
}
// aqui limpiamos por completo el formualrio al guadra el producto
const resetFormularioCompleto = () => {
  nombre.value = ''
  fabricante.value = ''
  categoria.value = null
  unidadBase.value = ''
  tipoProducto.value = null
  aplicaIva.value = false
  presentaciones.value = []
  errores.value = { nombre: '', fabricante: '', categoria: '', unidadBase: '', tipoProducto: '' }
  limpiarFormularioPresentacion()
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
