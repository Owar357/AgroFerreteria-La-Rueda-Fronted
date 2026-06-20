  <template>
    <div class="flex flex-col"
      style="font-family: 'Inter', sans-serif; background-color: #eef2e9; height: 100vh; overflow: hidden; padding: 12px;">

      <!-- dos columnas ocupando toda la altura -->
      <div class="rounded-2xl overflow-hidden flex-1 min-h-0"
        style="background-color: #ffffff; border: 1px solid #e2e8dd; display: grid; grid-template-columns:2.5fr 2px 1fr;">

        <!-- COLUMNA IZQUIERDA -->
        <div class="flex flex-col overflow-hidden" style="padding: 20px;">

          <!-- Header izquierdo -->
          <div class="flex items-center justify-between mb-4 pb-4" style="border-bottom: 1px solid #e2e8dd;">
            <div class="flex items-center gap-3">
              <i class="pi pi-shopping-cart" style="color: #e0b354; font-size: 20px;"></i>
              <div>
                <span style="font-size: 18px; font-weight: 600; color: #1a2e1f; display: block;">Punto de Venta</span>
                <span style="font-size: 12px; color: #6b7280;">{{ fechaActual }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4 flex-1 overflow-y-auto">

            <!-- Tipo de factura -->
            <div class="flex flex-col gap-1.5">
              <label style="font-size: 13px; font-weight: 500; color: #4b5563;">Tipo de factura</label>
              <Select v-model="tipoFactura" :options="tiposFactura" optionLabel="label" optionValue="value"
                class="w-full" />
            </div>

            <!-- Buscar producto -->
            <div class="flex flex-col gap-1.5 ">
              <AutoComplete v-model="productoSeleccionado" optionLabel="nombre" :suggestions="sugerencias"
                @complete="buscarProducto" @item-select="alSeleccionarProducto"
                placeholder="Escribe nombre,cód. interno o cód. de barra" class="w-full" fluid />
            </div>

            <!-- Elegir presentación -->
            <div class="flex gap-2">
              <Select v-model="presentacionSeleccionada" :options="presentaciones" optionLabel="nombre"
                placeholder="Seleccionar presentación" class="flex-1" />
              <Button label="+ Agregar"
                style="font-size: 13px; font-weight: 600; padding: 8px 16px; background-color: #2b5e3b; border-color: #2b5e3b; color: #ffffff; white-space: nowrap;"
                @click="agregarProducto" />
            </div>

            <!-- Tabla productos -->
            <div class="flex-1 min-h-0">
              <DataTable :value="productosVenta" style="font-size: 12px;"
                emptyMessage="No hay ningún producto registrado">
                <Column header="#" style="width: 40px;">
                  <template #body="slotProps">{{ slotProps.index + 1 }}</template>
                </Column>
                <Column field="nombre" header="Producto" />

                <Column header="Cantidad">
                  <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.cantidad" :min="1" :maxFractionDigits="0" showButtons
                      buttonLayout="horizontal" inputStyle="width: 80px; text-align: center;" />
                  </template>
                </Column>

                <Column header="Precio">
                  <template #body="slotProps">
                    ${{ parseFloat(slotProps.data.precio).toFixed(2) }}
                  </template>
                </Column>

                <Column header="Descuento">
                  <template #body="slotProps">
                    ${{ parseFloat(slotProps.data.descuento).toFixed(2) }}
                  </template>
                </Column>
                <Column header="Subtotal">
                  <template #body="slotProps">
                    ${{ parseFloat(slotProps.data.subtotal).toFixed(2) }}
                  </template>
                </Column>

                <Column header="" style="width: 40px;">
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
        <div style="background-color: #e2e8dd;"></div>

        <!-- COLUMNA DERECHA -->
        <div class="flex flex-col overflow-hidden" style="padding: 20px;">

          <!-- Header derecho -->
          <div class="flex items-center gap-3 mb-4 pb-4" style="border-bottom: 1px solid #e2e8dd;">
            <i class="pi pi-credit-card" style="color: #e0b354; font-size: 20px;"></i>
            <span style="font-size: 18px; font-weight: 600; color: #1a2e1f;">Cobro y Pago</span>
          </div>

          <div class="flex flex-col gap-4 flex-1">

            <!-- Cliente -->
            <div class="flex gap-2 items-center">
              <InputText v-model="busquedaCliente" placeholder="DUI, NRC u otro número..."
                class="flex-1 text-[13px] px-3.5 py-2"
                @keypress="(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault() }" @keyup.enter="buscarCliente" />
              <Button icon="pi pi-search" @click="buscarCliente"
                style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 10px; color: #1a2e1f; padding: 8px 12px;" />
            </div>
            <p class="text-[12px] text-[#2b5e3b] m-0">
              Nombre: <span class="text-[#6b7280] italic">{{ nombreCliente || '—' }}</span>
            </p>
            <!-- Forma de pago -->
            <div class="flex flex-col gap-1.5">
              <label style="font-size: 13px; font-weight: 500; color: #4b5563;">Forma de pago</label>
              <Select v-model="tipoPago" :options="tiposPago" optionLabel="label" optionValue="value" class="w-full" />
            </div>

            <!-- Totales -->
            <div class="flex justify-between items-center">
              <span style="font-size: 13px; color: #4b5563;">Subtotal gravado</span>
              <span style="font-size: 13px; color: #1a2e1f;">${{ subtotalGravado.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span style="font-size: 13px; color: #4b5563;">Subtotal exento</span>
              <span style="font-size: 13px; color: #1a2e1f;">${{ subtotalExento.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span style="font-size: 13px; color: #4b5563;">IVA 13%</span>
              <span style="font-size: 13px; color: #1a2e1f;">${{ iva.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span style="font-size: 15px; font-weight: 700; color: #1a2e1f;">Total a pagar</span>
              <span style="font-size: 15px; font-weight: 700; color: #1a2e1f;">${{ total.toFixed(2) }}</span>
            </div>


            <!-- Efectivo recibido -->
            <div v-if="tipoPago === 'efectivo'" class="flex flex-col gap-1.5">
              <label style="font-size: 13px; font-weight: 500; color: #4b5563;">Efectivo entregado</label>
              <div class="flex justify-between items-center gap-4">
                <div class="flex items-center gap-2 flex-1">
                  <span style="font-size: 13px; color: #4b5563; white-space: nowrap;">Recibido</span>
                  <InputNumber v-model="efectivoRecibido" mode="currency" currency="USD" locale="en-US" :min="0"
                    :minFractionDigits="2" :maxFractionDigits="2"
                    inputStyle="font-size: 13px; padding: 8px 12px; width: 120px;" />
                </div>
                <div class="flex items-center gap-2">
                  <span style="font-size: 13px; color: #4b5563;">Cambio:</span>
                  <span style="font-size: 15px; font-weight: 700; color: #2b5e3b;">${{ cambio.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2" style="margin-top: 24px;">
              <Button label="Registrar venta" icon="pi pi-check" @click="registrarVenta"
                style="background-color: #2b5e3b; border: 1px solid #2b5e3b; border-radius: 10px; color: #ffffff; font-size: 14px; font-weight: 600; padding: 12px 24px; width: 100%;" />
              <Button label="Anular venta" icon="pi pi-times" @click="anularVenta"
                style="background-color: #eef2e9; border: 1px solid #e2e8dd; border-radius: 10px; color: #1a2e1f; font-size: 14px; font-weight: 600; padding: 12px 24px; width: 100%;" />
            </div>

          </div>
        </div>

      </div>
    </div>

    <DialogAddCliente v-model="mostrarModalCliente" @cliente-registrado="onClienteRegistrado" />
  </template>

<script setup>
import { ref, computed, watch } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import { buscarProductos, buscarClientePorDocumento, registerVenta } from '@/services/ventaService'
import DialogAddCliente from '@/components/Clientes/DialogAddCliente.vue'
import Swal from 'sweetalert2'


//Prueba para  draft
const fechaActual = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })

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
  productosVenta.value.reduce((acc, p) => {
    if (!p.aplica_iva) return acc
    return acc + parseFloat(
      (p.subtotal / 1.13).toFixed(4)
    )
  }, 0)
)
const subtotalExento = computed(() =>
  productosVenta.value.reduce((acc, p) => {
    if (p.aplica_iva) return acc
    return acc + p.subtotal
  }, 0)
)
const iva = computed(() =>
  subtotalGravado.value * 0.13
)
const total = computed(() =>
  subtotalGravado.value +
  subtotalExento.value +
  iva.value
)

const cambio = computed(() => Math.max(0, efectivoRecibido.value - total.value))


const buscarProducto = async (event) => {
  const q = event.query.trim()
  if (q.length < 2) {
    sugerencias.value = []
    return
  } try {
    const response = await buscarProductos(q)
    sugerencias.value = response.data.data
  }
  catch {
    sugerencias.value = []
  }
}

const alSeleccionarProducto = (event) => {
  presentaciones.value = event.value.presentaciones
  presentacionSeleccionada.value = ''
}

const agregarProducto = () => {
  if (!productoSeleccionado.value || !presentacionSeleccionada.value) return

  const precio = parseFloat(presentacionSeleccionada.value.precio_venta)

  productosVenta.value.push({
    nombre: `${productoSeleccionado.value.nombre} - ${presentacionSeleccionada.value.nombre}`,
    cantidad: 1,
    precio: precio,
    descuento: 0.00,
    subtotal: precio,
    aplica_iva: productoSeleccionado.value.aplica_iva,
    presentacion_id: presentacionSeleccionada.value.id,
    unidad_base: productoSeleccionado.value.unidad_base 
  });

  productoSeleccionado.value = null,
    presentacionSeleccionada.value = ''
  presentaciones.value = []

}

watch(productosVenta, () => {
  productosVenta.value.forEach(fila => {
    fila.subtotal = parseFloat((fila.cantidad * fila.precio).toFixed(4))
  })
}, { deep: true })

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
    Swal.fire({ icon: 'warning', title: 'Sin productos', text: 'Agrega al menos un producto.', confirmButtonColor: '#2b5e3b' })
    return
  }

  if (tipoFactura.value === '02' && !clienteId.value) {
    Swal.fire({ icon: 'warning', title: 'Cliente requerido', text: 'El crédito fiscal requiere un cliente.', confirmButtonColor: '#2b5e3b' })
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
    detalles: productosVenta.value.map(p => ({
      nombre_producto: p.nombre,
      presentacion: p.nombre,
      cantidad: p.cantidad,
      precio_unitario: p.precio,
      subtotal: p.subtotal,
      iva_aplicado: p.aplica_iva ? parseFloat((p.subtotal / 1.13 * 0.13).toFixed(4)) : 0,
      descuento_aplicado: p.descuento,
      presentacion_id: p.presentacion_id,
      unidad_base: p.unidad_base
    }))
  }

  try {
    await registerVenta(payload)
    Swal.fire({ icon: 'success', title: '¡Venta registrada!', confirmButtonColor: '#2b5e3b', timer: 3000, timerProgressBar: true })
    anularVenta()
  } catch (error) {
    const status = error.response?.status
    if (status === 422) {
      const mensajes = Object.values(error.response.data.errors).flat()
      Swal.fire({ icon: 'warning', title: 'Error de validación', text: mensajes[0], confirmButtonColor: '#2b5e3b' })
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo registrar la venta.', confirmButtonColor: '#2b5e3b' })
    }
  }
}

const anularVenta = () => {
  productosVenta.value = []
  busquedaCliente.value = ''
  nombreCliente.value = ''
  efectivoRecibido.value = 0
  tipoFactura.value = ''
  tipoPago.value = 'efectivo'
}

const eliminarProducto = (index) => {
  productosVenta.value.splice(index, 1)
}
</script>
