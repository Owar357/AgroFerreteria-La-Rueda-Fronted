<template>
  <div class="flex flex-col" style="
      font-family: 'Inter', sans-serif;
      background-color: #eef2e9;
      height: 100vh;
      overflow: hidden;
      padding: 12px;
    ">
    <div v-if="!cajaStore.cajaAbierta" class="flex flex-col items-center justify-center h-full gap-6">
      <div
        class="bg-white rounded-2xl p-10 border border-[#e2e8dd] shadow-lg flex flex-col items-center gap-4 max-w-md w-full">
        <i class="pi pi-lock text-[#b91c1c]" style="font-size: 48px"></i>
        <h2 class="text-[22px] font-semibold text-[#1a2e1f] text-center">Caja no aperturada</h2>
        <p class="text-[14px] text-[#6b7280] text-center">
          El administrador debe aperturar la caja para poder realizar ventas.
        </p>
        <Button label="Ir a Caja" icon="pi pi-arrow-right"
          class="!bg-[#2b5e3b] !border-[#2b5e3b] text-white font-semibold px-6 py-3 rounded-lg" @click="irACaja" />
      </div>
    </div>

    <div v-else class="rounded-2xl overflow-hidden flex-1 min-h-0" style="
        background-color: #ffffff;
        border: 1px solid #e2e8dd;
        display: grid;
        grid-template-columns: 2.5fr 2px 1fr;
      ">
      <!-- COLUMNA IZQUIERDA -->
      <div class="flex flex-col overflow-hidden" style="padding: 20px">
        <div class="flex items-center justify-between mb-4 pb-4" style="border-bottom: 1px solid #e2e8dd">
          <div class="flex items-center gap-3">
            <i class="pi pi-shopping-cart" style="color: #e0b354; font-size: 20px"></i>
            <div>
              <span style="font-size: 18px; font-weight: 600; color: #1a2e1f; display: block">Punto de Venta</span>
              <span style="font-size: 12px; color: #6b7280">{{ fechaActual }}</span>
            </div>
          </div>
          <!-- Indicador de apertura de venta -->
          <div class="flex items-center gap-2">
            <span :class="[
              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold',
              cajaStore.ventaAbierta
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800',
            ]">
              <i class="pi pi-circle-fill text-[8px]"
                :class="cajaStore.ventaAbierta ? 'text-green-600' : 'text-yellow-500'"></i>
              {{ cajaStore.ventaAbierta ? 'Venta abierta' : 'Sin apertura de venta' }}
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-4 flex-1 overflow-y-auto">
          <!-- Tipo de factura -->
          <div class="flex flex-col gap-1.5">
            <label style="font-size: 13px; font-weight: 500; color: #4b5563">Tipo de factura</label>
            <Select v-model="tipoFactura" :options="tiposFactura" optionLabel="label" optionValue="value"
              class="w-full" />
          </div>

          <!-- Buscar producto -->
          <div class="flex flex-col gap-1.5">
            <AutoComplete v-model="productoSeleccionado" optionLabel="nombre" :suggestions="sugerencias"
              @complete="buscarProducto" @item-select="alSeleccionarProducto"
              placeholder="Escribe nombre, cód. interno o cód. de barra" class="w-full" fluid />
          </div>

          <!-- Presentación -->
          <div class="flex gap-2">
            <Select v-model="presentacionSeleccionada" :options="presentaciones" optionLabel="nombre"
              placeholder="Seleccionar presentación" class="flex-1" />
            <Button label="+ Agregar" style="
                font-size: 13px;
                font-weight: 600;
                padding: 8px 16px;
                background-color: #2b5e3b;
                border-color: #2b5e3b;
                color: #ffffff;
                white-space: nowrap;
              " @click="agregarProducto" />
          </div>

          <!-- Tabla productos -->
          <div class="flex-1 min-h-0">
            <DataTable :value="productosVenta" style="font-size: 12px" emptyMessage="No hay ningún producto registrado">
              <Column header="#" style="width: 40px">
                <template #body="slotProps">{{ slotProps.index + 1 }}</template>
              </Column>
              <Column field="nombre" header="Producto" />
              <Column header="Cantidad">
                <template #body="slotProps">
                  <InputNumber v-model="slotProps.data.cantidad" @update:modelValue="recalcularSubtotal(slotProps.data)"
                    :min="1" :maxFractionDigits="0" showButtons buttonLayout="horizontal"
                    inputStyle="width: 80px; text-align: center;" />
                </template>
              </Column>
              <Column header="Precio Unit.">
                <template #body="slotProps">
                  <div v-if="slotProps.data.porcentaje_descuento > 0" class="flex flex-col">
                    <span class="text-[11px] text-gray-400 line-through">${{
                      parseFloat(slotProps.data.precio).toFixed(2) }}</span>
                    <span class="text-xs font-bold text-amber-700">
                      ${{ (slotProps.data.precio - (slotProps.data.descuento / slotProps.data.cantidad)).toFixed(2) }}
                      <span class="text-[10px] bg-amber-100 text-amber-800 px-1 rounded ml-0.5">-{{
                        slotProps.data.porcentaje_descuento }}%</span>
                    </span>
                  </div>
                  <span v-else>${{ parseFloat(slotProps.data.precio).toFixed(2) }}</span>
                </template>
              </Column>
              <Column header="Descuento">
                <template #body="slotProps">
                  <span :class="slotProps.data.descuento > 0 ? 'text-amber-700 font-bold' : ''">
                    ${{ parseFloat(slotProps.data.descuento).toFixed(2) }}
                  </span>
                </template>
              </Column>
              <Column header="Subtotal">
                <template #body="slotProps">${{ parseFloat(slotProps.data.subtotal).toFixed(2) }}</template>
              </Column>
              <Column header="" style="width: 40px">
                <template #body="slotProps">
                  <Button icon="pi pi-trash" severity="danger" text rounded size="small"
                    @click="eliminarProducto(slotProps.index)" />
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <!-- LÍNEA DIVISORIA -->
      <div style="background-color: #e2e8dd"></div>

      <!-- COLUMNA DERECHA -->
      <div class="flex flex-col overflow-hidden" style="padding: 20px">
        <div class="flex items-center gap-3 mb-4 pb-4" style="border-bottom: 1px solid #e2e8dd">
          <i class="pi pi-credit-card" style="color: #e0b354; font-size: 20px"></i>
          <span style="font-size: 18px; font-weight: 600; color: #1a2e1f">Cobro y Pago</span>
        </div>

        <div class="flex flex-col gap-4 flex-1">
          <!-- Cliente -->
          <div class="flex gap-2 items-center">
            <InputText v-model="busquedaCliente" placeholder="DUI, NRC u otro número..."
              class="flex-1 text-[13px] px-3.5 py-2" @keypress="
                (e) => {
                  if (!/[0-9]/.test(e.key)) e.preventDefault()
                }
              " @keyup.enter="buscarCliente" />
            <Button icon="pi pi-search" @click="buscarCliente" style="
                background-color: #ffffff;
                border: 1px solid #d1d5db;
                border-radius: 10px;
                color: #1a2e1f;
                padding: 8px 12px;
              " />
          </div>
          <p class="text-[12px] text-[#2b5e3b] m-0">
            Nombre: <span class="text-[#6b7280] italic">{{ nombreCliente || '—' }}</span>
          </p>

          <!-- Forma de pago -->
          <div class="flex flex-col gap-1.5">
            <label style="font-size: 13px; font-weight: 500; color: #4b5563">Forma de pago</label>
            <Select v-model="tipoPago" :options="tiposPago" optionLabel="label" optionValue="value" class="w-full" />
          </div>

          <!-- Totales -->
          <div class="flex justify-between items-center">
            <span style="font-size: 13px; color: #4b5563">Subtotal gravado</span>
            <span style="font-size: 13px; color: #1a2e1f">${{ subtotalGravado.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span style="font-size: 13px; color: #4b5563">Subtotal exento</span>
            <span style="font-size: 13px; color: #1a2e1f">${{ subtotalExento.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span style="font-size: 13px; color: #4b5563">IVA 13%</span>
            <span style="font-size: 13px; color: #1a2e1f">${{ iva.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span style="font-size: 15px; font-weight: 700; color: #1a2e1f">Total a pagar</span>
            <span style="font-size: 15px; font-weight: 700; color: #1a2e1f">${{ total.toFixed(2) }}</span>
          </div>

          <!-- Efectivo recibido -->
          <div v-if="tipoPago === 'efectivo'" class="flex flex-col gap-1.5">
            <label style="font-size: 13px; font-weight: 500; color: #4b5563">Efectivo entregado</label>
            <div class="flex justify-between items-center gap-4">
              <div class="flex items-center gap-2 flex-1">
                <span style="font-size: 13px; color: #4b5563; white-space: nowrap">Recibido</span>
                <InputNumber v-model="efectivoRecibido" mode="currency" currency="USD" locale="en-US" :min="0"
                  :minFractionDigits="2" :maxFractionDigits="2"
                  inputStyle="font-size: 13px; padding: 8px 12px; width: 120px;" />
              </div>
              <div class="flex items-center gap-2">
                <span style="font-size: 13px; color: #4b5563">Cambio:</span>
                <span style="font-size: 15px; font-weight: 700; color: #2b5e3b">${{ cambio.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2" style="margin-top: 24px">
            <Button label="Registrar venta" icon="pi pi-check" @click="registrarVenta" style="
                background-color: #2b5e3b;
                border: 1px solid #2b5e3b;
                border-radius: 10px;
                color: #ffffff;
                font-size: 14px;
                font-weight: 600;
                padding: 12px 24px;
                width: 100%;
              " />
            <Button label="Anular venta" icon="pi pi-times" @click="anularVenta" style="
                background-color: #eef2e9;
                border: 1px solid #e2e8dd;
                border-radius: 10px;
                color: #1a2e1f;
                font-size: 14px;
                font-weight: 600;
                padding: 12px 24px;
                width: 100%;
              " />
          </div>
        </div>
      </div>
    </div>
  </div>

  <DialogAddCliente v-model="mostrarModalCliente" @cliente-registrado="onClienteRegistrado" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import AutoComplete from 'primevue/autocomplete'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import { buscarProductos, buscarClientePorDocumento, registerVenta } from '@/services/ventaService'
import DialogAddCliente from '@/components/Clientes/AddClienteDialog.vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useCajaStore } from '@/stores/cajaStore'

const router = useRouter()
const LOCAL_STORAGE_KEY = 'pos_venta_en_proceso'

const irACaja = () => {
  router.push({ name: 'caja' })
}

const fechaActual = new Date().toLocaleDateString('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const cajaStore = useCajaStore()

onMounted(() => {
  cajaStore.cargarEstadoCaja()
  recuperarVentaLocal()
})

const tipoFactura = ref('01')
const presentacionSeleccionada = ref('')
const presentaciones = ref([])
const mostrarModalCliente = ref(false)
const productosVenta = ref([])
const busquedaCliente = ref('')
const clienteId = ref(null)
const nombreCliente = ref('')
const tipoPago = ref('efectivo')
const efectivoRecibido = ref(0)
const productoSeleccionado = ref(null)
const sugerencias = ref([])

const tiposFactura = [
  { label: 'Consumidor Final', value: '01' },
  { label: 'Crédito Fiscal', value: '02' },
]

const tiposPago = [
  { label: 'Efectivo', value: 'efectivo' },
  { label: 'Tarjeta', value: 'tarjeta' },
  { label: 'Transferencia', value: 'transferencia' },
]

const subtotalGravado = computed(() =>
  productosVenta.value.reduce(
    (acc, p) => (p.aplica_iva ? acc + parseFloat((p.subtotal / 1.13).toFixed(4)) : acc),
    0,
  ),
)
const subtotalExento = computed(() =>
  productosVenta.value.reduce((acc, p) => (!p.aplica_iva ? acc + p.subtotal : acc), 0),
)
const iva = computed(() => subtotalGravado.value * 0.13)
const total = computed(() => subtotalGravado.value + subtotalExento.value + iva.value)
const cambio = computed(() => Math.max(0, efectivoRecibido.value - total.value))

const buscarProducto = async (event) => {
  const q = event.query.trim()
  if (q.length < 2) {
    sugerencias.value = []
    return
  }
  try {
    const response = await buscarProductos(q)
    sugerencias.value = response.data.data
  } catch {
    sugerencias.value = []
  }
}

const alSeleccionarProducto = (event) => {
  presentaciones.value = event.value.presentaciones
  presentacionSeleccionada.value = ''
}

const agregarProducto = () => {
  if (!productoSeleccionado.value || !presentacionSeleccionada.value) return

  const producto = productoSeleccionado.value
  const presentacion = presentacionSeleccionada.value

  const unidadBase =
    producto.unidad_base ||
    producto.unidad_medida?.abreviatura ||
    producto.unidad_medida?.nombre ||
    producto.unidadMedida?.abreviatura ||
    producto.unidadMedida?.nombre ||
    null

  if (!unidadBase) {
    Swal.fire({
      icon: 'warning',
      title: 'Unidad base requerida',
      text: `El producto "${producto.nombre}" no tiene una unidad de medida configurada.`,
      confirmButtonColor: '#2b5e3b',
    })
    return
  }
  // aqui quite el codigo 

  // 1. Obtener precio original y porcentaje de descuento del lote/presentación
  const precioOriginal = parseFloat(presentacion.precio_venta) || 0
  const porcentajeDescuento = parseFloat(presentacion.porcentaje_descuento || producto.porcentaje_descuento || 0)

  // 2. Calcular monto del descuento por unidad y subtotal final
  const descuentoUnitario = (precioOriginal * porcentajeDescuento) / 100
  const precioFinalUnitario = precioOriginal - descuentoUnitario
  const cantidad = 1
  const subtotal = cantidad * precioFinalUnitario

  productosVenta.value.push({
    nombre: `${producto.nombre} - ${presentacion.nombre}`,
    cantidad,
    precio: precioOriginal,
    porcentaje_descuento: porcentajeDescuento,
    descuento: parseFloat((descuentoUnitario * cantidad).toFixed(4)),
    subtotal: parseFloat(subtotal.toFixed(4)),
    aplica_iva: producto.aplica_iva,
    presentacion_id: presentacion.id,
    producto_id: producto.id,
    unidad_base: unidadBase,
  })

  productoSeleccionado.value = null
  presentacionSeleccionada.value = ''
  presentaciones.value = []
}

const recalcularSubtotal = (item) => {
  const cantidad = parseFloat(item.cantidad) || 0
  const precioOriginal = parseFloat(item.precio) || 0
  const porcentajeDescuento = parseFloat(item.porcentaje_descuento) || 0

  const descuentoUnitario = (precioOriginal * porcentajeDescuento) / 100
  const precioFinalUnitario = precioOriginal - descuentoUnitario

  item.descuento = parseFloat((descuentoUnitario * cantidad).toFixed(4))
  item.subtotal = parseFloat((cantidad * precioFinalUnitario).toFixed(4))
}

const buscarCliente = async () => {
  if (!busquedaCliente.value.trim()) return
  try {
    const response = await buscarClientePorDocumento(String(busquedaCliente.value))
    const cliente = response.data.data
    nombreCliente.value = cliente.nombre || cliente.razon_social
    clienteId.value = cliente.id
  } catch (error) {
    if (error.response?.status === 404) {
      const resultado = await Swal.fire({
        icon: 'question',
        title: 'Cliente no encontrado',
        text: '¿Desea registrar un nuevo cliente?',
        showCancelButton: true,
        confirmButtonText: 'Registrar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#2b5e3b',
      })
      if (resultado.isConfirmed) mostrarModalCliente.value = true
    }
  }
}

const onClienteRegistrado = (cliente) => {
  nombreCliente.value = cliente.nombre || cliente.razon_social
  clienteId.value = cliente.id
  mostrarModalCliente.value = false
}

const registrarVenta = async () => {
  if (productosVenta.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin productos',
      text: 'Agrega al menos un producto.',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }
  if (tipoFactura.value === '02' && !clienteId.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Cliente requerido',
      text: 'El crédito fiscal requiere un cliente.',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }

  const payload = {
    tipo_pago: tipoPago.value.toUpperCase(),
    gravado: parseFloat(subtotalGravado.value.toFixed(2)),
    exento: parseFloat(subtotalExento.value.toFixed(2)),
    iva: parseFloat(iva.value.toFixed(2)),
    total: parseFloat(total.value.toFixed(2)),
    efectivo_recibido: tipoPago.value === 'efectivo' ? efectivoRecibido.value : null,
    cambio: tipoPago.value === 'efectivo' ? cambio.value : null,
    cliente_id: clienteId.value || null,
    apertura_caja_id: 1,
    detalles: productosVenta.value.map((p) => ({
      nombre_producto: p.nombre,
      presentacion: p.nombre,
      cantidad: p.cantidad,
      precio_unitario: p.precio,
      subtotal: p.subtotal,
      iva_aplicado: p.aplica_iva ? parseFloat(((p.subtotal / 1.13) * 0.13).toFixed(4)) : 0,
      descuento_aplicado: p.descuento,
      presentacion_id: p.presentacion_id,
      producto_id: p.producto_id,
      unidad_base: p.unidad_base,
    })),
  }

<<<<<<< HEAD:src/views/FromVenta.vue
   
=======
>>>>>>> 672e6d16697e2e2a890fc900d02562032149f8a8:src/components/Ventas/POS.vue
  try {
    const response = await registerVenta(payload)


    cajaStore.marcarActualizacionPendiente()


      //ESTO SE AGREGO OMAR

    if (response.data.apertura_pendiente) {
      const resultado = await Swal.fire({
        icon: 'warning',
        title: 'Venta registrada',
        text: 'Tienes una apertura de caja pendiente. Debes aperturar tu turno.',
        confirmButtonText: 'Ir a aperturar',
        confirmButtonColor: '#e0b354',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      })

      if (resultado.isConfirmed) {
        router.push({ name: 'caja' })
      }
    }

    anularVenta()
  } catch (error) {
    const status = error.response?.status
    const respuesta = error.response?.data

    if (status === 422 && respuesta?.errors) {
      const mensajes = Object.values(respuesta.errors).flat()
      Swal.fire({
        icon: 'warning',
        title: 'Error de validación',
        text: mensajes[0],
        confirmButtonColor: '#2b5e3b',
      })
    } else if (respuesta?.message) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: respuesta.message,
        confirmButtonColor: '#2b5e3b',
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error de servidor',
        text: 'Ocurrió un problema inesperado al procesar la venta.',
        confirmButtonColor: '#2b5e3b',
      })
    }
  }
}

const anularVenta = () => {
  productosVenta.value = []
  busquedaCliente.value = ''
  nombreCliente.value = ''
  efectivoRecibido.value = 0
  tipoFactura.value = '01'
  tipoPago.value = 'efectivo'

  localStorage.removeItem(LOCAL_STORAGE_KEY)
}

const eliminarProducto = (index) => productosVenta.value.splice(index, 1)

watch(
  [productosVenta, tipoFactura, tipoPago, clienteId, nombreCliente, busquedaCliente],
  () => {
    guardarVentaLocal()
  },
  { deep: true }
)

const guardarVentaLocal = () => {
  if (productosVenta.value.length === 0) {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    return
  }

  const estadoVenta = {
    productosVenta: productosVenta.value,
    tipoFactura: tipoFactura.value,
    tipoPago: tipoPago.value,
    clienteId: clienteId.value,
    nombreCliente: nombreCliente.value,
    busquedaCliente: busquedaCliente.value,
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(estadoVenta))
}

const recuperarVentaLocal = () => {
  const datosGuardados = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!datosGuardados) return

  try {
    const estado = JSON.parse(datosGuardados)
    productosVenta.value = estado.productosVenta || []
    tipoFactura.value = estado.tipoFactura || '01'
    tipoPago.value = estado.tipoPago || 'efectivo'
    clienteId.value = estado.clienteId || null
    nombreCliente.value = estado.nombreCliente || ''
    busquedaCliente.value = estado.busquedaCliente || ''
  } catch (e) {
    console.error('Error al recuperar venta del localStorage:', e)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }
}
</script>