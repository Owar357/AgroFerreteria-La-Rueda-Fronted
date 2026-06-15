<template>
  <div class="bg-[#eef2e9] min-h-screen p-4 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <div
      class="w-full max-w-[1200px] mx-auto bg-[#ffffff] rounded-3xl border border-[#e2e8dd] shadow-xl overflow-hidden">
      <div class="bg-[#2b5e3b] p-6 border-b border-[#e2e8dd]">
        <div class="flex items-center gap-3">
          <div>
            <h1 class="text-white text-[26px] font-semibold tracking-wide">Registro de compra</h1>
            <p class="text-[#dff0e0] text-[14px] font-normal">
              Documento digitalizado de la compra y lotes recibidos por el proveedor
            </p>
          </div>
        </div>
      </div>

      <div class="p-6 flex flex-col gap-6">
        <Stepper value="1" class="basis-full">
          <StepList>
            <Step value="1">Documento</Step>
            <Step value="2">Lotes recibidos</Step>
          </StepList>
          <StepPanels>
            <!-- Documento -->
            <StepPanel value="1" v-slot="{ activateCallback }">
              <div class="flex flex-col gap-4 pt-6">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[14px] font-medium text-[#1a2e1f]">Proveedor</label>
                  <AutoComplete
                    v-model="documentoForm.proveedor"
                    optionLabel="nombre"
                    :suggestions="proveedoresFiltrados"
                    @complete="buscarProveedor"
                    placeholder="Buscar proveedor..."
                    class="w-full"
                    fluid
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-[14px] font-medium text-[#1a2e1f]">Tipo de documento</label>
                    <Select
                      v-model="documentoForm.tipoComprobante"
                      :options="comprobantesOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Seleccionar tipo"
                      class="w-full bg-[#f9fafb] border-[#d1d5db]"
                    />
                  </div>

                  <div class="flex flex-col gap-1.5 w-5">
                    <label class="text-[14px] font-medium text-[#1a2e1f]">Nº comprobante</label>
                    <div class="flex">
                      <span
                        v-if="prefijoComprobante"
                        class="flex items-center px-3 bg-[#e2e8dd] border border-r-0 border-[#d1d5db] rounded-l-md text-[#6b7280] w-3 text-[14px]"
                      >
                        {{ prefijoComprobante }}
                      </span>
                      <InputText
                        v-model="documentoForm.numComprobante"
                        :placeholder="prefijoComprobante ? '000123456' : 'Número de documento'"
                        :class="prefijoComprobante ? 'rounded-r-md' : 'rounded-md'"
                        class="w-full bg-[#f9fafb] border-[#d1d5db] h-[40px] px-3 focus:border-[#2b5e3b] text-[#1a2e1f]"
                      />
                    </div>
                    <small v-if="prefijoComprobante" class="text-[13px] text-[#6b7280] font-normal">
                      Aplica para comprobante físico
                    </small>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-[14px] font-medium text-[#1a2e1f]">Fecha de emisión</label>
                    <DatePicker
                      v-model="documentoForm.fechaEmision"
                      dateFormat="dd/mm/yy"
                      showIcon
                      iconDisplay="input"
                      class="w-full bg-[#f9fafb] border-[#d1d5db]"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-[14px] font-medium text-[#1a2e1f]">Estado de pago</label>
                    <Select
                      v-model="documentoForm.estadoPago"
                      :options="estadosPagoOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Seleccionar"
                      class="w-full bg-[#f9fafb] border-[#d1d5db]"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-[14px] font-medium text-[#1a2e1f]"
                      >Monto total facturado</label
                    >
                    <InputText
                      v-model="documentoForm.montoTotal"
                      placeholder="0.00"
                      class="w-full bg-[#f9fafb] border-[#d1d5db] h-[40px] px-3 rounded-md focus:border-[#2b5e3b] text-[#1a2e1f]"
                    />
                  </div>
                  <div v-if="documentoForm.estadoPago !== 'PAGADO'" class="flex flex-col gap-1.5">
                    <label class="text-[14px] font-medium text-[#1a2e1f]"
                      >Fecha de vencimiento del crédito</label
                    >
                    <DatePicker
                      v-model="documentoForm.fechaVencimiento"
                      dateFormat="dd/mm/yy"
                      showIcon
                      iconDisplay="input"
                      class="w-full bg-[#f9fafb] border-[#d1d5db]"
                    />
                    <small class="text-[13px] text-[#6b7280] font-normal"
                      >Desaparece si el estado es "Pagado"</small
                    >
                  </div>
                </div>

                <!-- Footer paso 1 -->
                <div class="flex justify-between items-center pt-4 border-t border-[#e2e8dd]">
                  <Button label="Regresar" icon="pi pi-arrow-left"
                    class="bg-[#eef2e9] hover:bg-[#e2e8dd] text-[#1a2e1f] border border-[#cbd5e1] px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors duration-200 cursor-pointer"
                    @click="emit('close')" />
                  <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                    class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white border-none px-4 py-3 rounded-xl text-[14px] font-semibold cursor-pointer shadow-md transition-colors duration-200"
                    @click="activateCallback('2')"
                  />
                </div>
              </div>
            </StepPanel>

            <!-- PASO 2: Lotes recibidos -->
            <StepPanel value="2" v-slot="{ activateCallback }">
              <div class="flex flex-col gap-6 pt-6">
                <div class="flex flex-col gap-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col w-7 gap-1.5">
                      <label class="text-[14px] font-medium text-[#1a2e1f]"
                        >Nombre del producto</label
                      >
                      <AutoComplete
                        v-model="loteForm.producto"
                        optionLabel="nombre"
                        :suggestions="sugerenciasProductos"
                        @complete="buscarProductoLote"
                        @item-select="alSeleccionarProductoLote"
                        placeholder="Escribe nombre, cód. interno o cód. de barra"
                        class="w-full"
                        fluid
                      />
                    </div>
                    <div class="flex flex-col w-4 gap-1.5">
                      <label class="text-[14px] font-medium text-[#1a2e1f]">Tipo de presentación que entra</label>
                      <Select v-model="loteForm.presentacionFacturada" :options="presentacionesLote"
                        optionLabel="nombre" placeholder="Seleccionar presentación"
                        class="w-full bg-[#f9fafb] border-[#d1d5db]" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[14px] font-medium text-[#1a2e1f]">
                        Cantidad facturada {{ loteForm.presentacionFacturada ? `(en
                        ${loteForm.presentacionFacturada.nombre})` : '' }}
                      </label>
                      <InputText
                        v-model="loteForm.cantidadFacturada"
                        placeholder="0"
                        class="w-full bg-[#f9fafb] border-[#d1d5db] h-[40px] px-3 rounded-md text-[#1a2e1f]"
                      />
                      <small
                        v-if="loteForm.presentacionFacturada && loteForm.cantidadFacturada"
                        class="text-[13px] text-[#2b5e3b] font-medium"
                      >
                        = {{ unidadesFacturadas }}
                        {{ loteForm.producto?.unidad_base?.toLowerCase() }} en total
                      </small>
                    </div>
                    <div class="flex flex-col gap-2">
                      <label class="text-[14px] font-medium text-[#1a2e1f]"
                        >Tipo del producto</label
                      >
                      <div class="flex gap-6 items-center h-[40px]">
                        <div class="flex items-center gap-2">
                          <RadioButton
                            v-model="loteForm.tipoProducto"
                            inputId="perecedero"
                            name="tipo"
                            value="Perecedero"
                            class="p-radiobutton-custom"
                          />
                          <label for="perecedero" class="cursor-pointer text-[14px] text-[#1a2e1f]"
                            >Perecedero</label
                          >
                        </div>
                        <div class="flex items-center gap-2">
                          <RadioButton v-model="loteForm.tipoProducto" inputId="noPerecedero" name="tipo"
                            value="No perecedero" class="p-radiobutton-custom" />
                          <label for="noPerecedero" class="cursor-pointer text-[14px] text-[#1a2e1f]">No
                            perecedero</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                      <Checkbox v-model="incluyeBonificacion" inputId="bonificacion" binary />
                      <label
                        for="bonificacion"
                        class="cursor-pointer text-[14px] font-medium text-[#1a2e1f]"
                      >
                        ¿El proveedor incluyó producto adicional sin costo?
                      </label>
                    </div>
                    <small class="text-[13px] text-[#6b7280] font-normal">
                      Marca esta opción si recibiste unidades extra de regalo o bonificación (ej: "compra 10 lleva 1
                      gratis"),
                      sin que se refleje en el precio facturado.
                    </small>
                  </div>

                  <div v-if="incluyeBonificacion"
                    class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f9fafb] border border-[#e2e8dd] rounded-lg p-4">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[14px] font-medium text-[#1a2e1f]">Presentación bonificada</label>
                      <Select v-model="loteForm.presentacionBonificada" :options="presentacionesLote"
                        optionLabel="nombre" placeholder="Seleccionar presentación"
                        class="w-full bg-[#ffffff] border-[#d1d5db]" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[14px] font-medium text-[#1a2e1f]">
                        Cantidad bonificada {{ loteForm.presentacionBonificada ? `(en
                        ${loteForm.presentacionBonificada.nombre})` : '' }}
                      </label>
                      <InputText
                        v-model="loteForm.cantidadBonificada"
                        placeholder="0"
                        class="w-full bg-[#ffffff] border-[#d1d5db] h-[40px] px-3 rounded-md text-[#1a2e1f]"
                      />
                      <small
                        v-if="loteForm.presentacionBonificada && loteForm.cantidadBonificada"
                        class="text-[13px] text-[#2b5e3b] font-medium"
                      >
                        = {{ unidadesBonificadas }}
                        {{ loteForm.producto?.unidad_base?.toLowerCase() }} en total
                      </small>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div
                      v-if="loteForm.tipoProducto === 'Perecedero'"
                      class="flex flex-col gap-1.5"
                    >
                      <label class="text-[14px] font-medium text-[#1a2e1f]">Número de lote</label>
                      <InputText
                        v-model="loteForm.numLote"
                        placeholder="LOT-001"
                        class="w-full bg-[#f9fafb] border-[#d1d5db] h-[40px] px-3 rounded-md text-[#1a2e1f]"
                      />
                    </div>
                    <div
                      v-if="loteForm.tipoProducto === 'Perecedero'"
                      class="flex flex-col gap-1.5"
                    >
                      <label class="text-[14px] font-medium text-[#1a2e1f]"
                        >Fecha de vencimiento</label
                      >
                      <DatePicker
                        v-model="loteForm.fechaVencimientoLote"
                        dateFormat="dd/mm/yy"
                        showIcon
                        iconDisplay="input"
                        class="w-full bg-[#f9fafb] border-[#d1d5db]"
                      />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[14px] font-medium text-[#1a2e1f]"
                        >Costo unitario (factura)</label
                      >
                      <InputText
                        v-model="loteForm.costoUnitario"
                        placeholder="0.00"
                        class="w-full bg-[#f9fafb] border-[#d1d5db] h-[40px] px-3 rounded-md text-[#1a2e1f]"
                      />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[14px] font-medium text-[#1a2e1f]">
                        Descuento en línea
                        <span class="text-[11px] font-normal text-gray-400 ml-1">(opcional)</span>
                      </label>
                      <InputText
                        v-model="loteForm.descuentoLinea"
                        placeholder="0.00"
                        class="w-full bg-[#f9fafb] border-[#d1d5db] h-[40px] px-3 rounded-md text-[#1a2e1f]"
                      />
                    </div>
                  </div>

                  <div
                    v-if="
                      loteForm.presentacionFacturada &&
                      loteForm.cantidadFacturada &&
                      loteForm.costoUnitario
                    "
                    class="bg-[#eef2e9] border border-[#d1d5db] rounded-lg p-4 flex flex-col gap-1 text-[13px]"
                  >
                    <div class="flex justify-between">
                      <span class="text-[#4b5563]">Subtotal (facturado)</span>
                      <span class="font-semibold text-[#1a2e1f]">${{ subTotal.toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-[#4b5563]">Total a pagar (con descuento)</span>
                      <span class="font-semibold text-[#1a2e1f]"
                        >${{ totalPagado.toFixed(2) }}</span
                      >
                    </div>
                    <div class="flex justify-between">
                      <span class="text-[#4b5563]">Unidades reales que entran a bodega</span>
                      <span class="font-semibold text-[#1a2e1f]">{{ cantidadInicialLote }} {{
                        loteForm.producto?.unidad_base?.toLowerCase() }}</span>
                    </div>
                    <div class="flex justify-between border-t border-[#d1d5db] pt-1 mt-1">
                      <span class="text-[#2b5e3b] font-semibold">Costo unitario real (lote)</span>
                      <span class="font-bold text-[#2b5e3b]"
                        >${{ costoUnitarioReal.toFixed(4) }}</span
                      >
                    </div>
                  </div>

                  <div class="flex justify-between items-center mt-2">
                    <Button
                      label="Limpiar Lote"
                      icon="pi pi-refresh"
                      class="bg-[#eef2e9] hover:bg-[#e2e8dd] text-[#1a2e1f] border border-[#d1d5db] px-4 py-3 rounded-lg text-[14px] font-semibold cursor-pointer transition-colors"
                      @click="limpiarCamposLote"
                    />
                    <Button
                      label="Agregar Item"
                      icon="pi pi-plus"
                      class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white border-none px-4 py-3 rounded-lg text-[14px] font-semibold cursor-pointer shadow-sm transition-colors"
                      @click="agregarItemsATabla"
                    />
                  </div>
                </div>

                <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd]">
                  <DataTable
                    :value="itemsAgregados"
                    responsiveLayout="scroll"
                    class="p-datatable-custom text-[14px]"
                  >
                    <Column field="producto" header="Producto" />
                    <Column field="cantFact" header="Cant. fact." />
                    <Column field="cantidad" header="Cantidad (unid. base)" />
                    <Column field="costoUnit" header="Costo unit. real" />
                    <Column field="vencimiento" header="Fecha Vencimiento" />
                    <Column
                      field="subtotal"
                      header="Subtotal"
                      class="font-semibold text-[#1a2e1f]"
                    />
                    <Column header="Acción" class="text-center w-[80px]">
                      <template #body="slotProps">
                        <Button
                          icon="pi pi-trash"
                          class="hover:bg-[#fde8e8] border-none text-[#9c2a2a] hover:text-red-600 w-8 h-8 rounded-full p-0 transition-colors"
                          @click="eliminarItemDeTabla(slotProps.index)"
                        />
                      </template>
                    </Column>
                  </DataTable>
                </div>

                <div class="flex justify-between items-center pt-4 border-t border-[#e2e8dd]">
                  <Button
                    label="Atrás"
                    icon="pi pi-arrow-left"
                    class="bg-[#eef2e9] hover:bg-[#e2e8dd] text-[#1a2e1f] border border-[#cbd5e1] px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors duration-200 cursor-pointer"
                    @click="activateCallback('1')"
                  />
                  <Button
                    label="Registrar compra"
                    icon="pi pi-save"
                    class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white border-none px-4 py-3 rounded-xl text-[14px] font-semibold cursor-pointer shadow-md transition-colors duration-200"
                    @click="registrarCompraFinal"
                  />
                </div>
              </div>
            </StepPanel>
          </StepPanels>
        </Stepper>
      </div>
    </div>
  </div>
</template>

<script setup>
import { buscarProductoCompra, registrarCompra } from '@/services/compraService'
import { proveedores } from '@/services/proveedorService'
import Swal from 'sweetalert2'
import { ref, reactive, onMounted, watch, computed } from 'vue'

const emit = defineEmits(['close'])

const sugerenciasProductos = ref([])
const presentacionesLote = ref([])
const itemsAgregados = ref([])
const proveedoresOptions = ref([])
const proveedoresFiltrados = ref([])
const incluyeBonificacion = ref(false)

const comprobantesOptions = ref([
  { label: 'Nota de Remisión', value: '04' },
  { label: 'Factura Consumidor Final (FCF)', value: '01' },
  { label: 'Comprobante de Crédito Fiscal (CCF)', value: '03' },
  { label: 'Otro(No DTE)', value: '99' },
])

const estadosPagoOptions = ref([
  { label: 'Pagado', value: 'PAGADO' },
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Abonado', value: 'ABONADO' },
])

const documentoForm = reactive({
  proveedor: null,
  tipoComprobante: '03',
  numComprobante: '',
  fechaEmision: null,
  estadoPago: null,
  montoTotal: '',
  fechaVencimiento: null,
})

const loteForm = reactive({
  producto: null,
  presentacionFacturada: null,
  cantidadFacturada: '',
  presentacionBonificada: null,
  cantidadBonificada: '',
  costoUnitario: '',
  descuentoLinea: 0,
  tipoProducto: 'No perecedero',
  numLote: '',
  fechaVencimientoLote: null,
})

const buscarProveedor = (event) => {
  const q = event.query.toLowerCase().trim()
  if (!q) {
    proveedoresFiltrados.value = [...proveedoresOptions.value]
  } else {
    proveedoresFiltrados.value = proveedoresOptions.value.filter((p) =>
      p.nombre.toLowerCase().includes(q),
    )
  }
}

const prefijoComprobante = computed(() => {
  if (documentoForm.tipoComprobante === '99') return null
  return `DTE-${documentoForm.tipoComprobante}-`
})

watch(
  () => documentoForm.tipoComprobante,
  (nuevo) => {
    if (nuevo === '99') {
      documentoForm.numComprobante = ''
    }
  },
)

const buscarProductoLote = async (event) => {
  const q = event.query.trim()
  if (q.length < 2) {
    sugerenciasProductos.value = []
    return
  }
  try {
    const response = await buscarProductoCompra(q)
    sugerenciasProductos.value = response.data.data
  } catch {
    sugerenciasProductos.value = []
  }
}

const formatearFecha = (fecha) => {
  if (!fecha) return null
  const d = new Date(fecha)
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const anio = d.getFullYear()
  return `${anio}-${mes}-${dia}`
}

const alSeleccionarProductoLote = (event) => {
  presentacionesLote.value = event.value.presentaciones
  loteForm.presentacionFacturada = null
  loteForm.presentacionBonificada = null
}

const unidadesFacturadas = computed(() => {
  if (!loteForm.presentacionFacturada || !loteForm.cantidadFacturada) return 0
  return (
    Number(loteForm.cantidadFacturada) * Number(loteForm.presentacionFacturada.factor_conversion)
  )
})

const unidadesBonificadas = computed(() => {
  if (
    !incluyeBonificacion.value ||
    !loteForm.presentacionBonificada ||
    !loteForm.cantidadBonificada
  )
    return 0
  return (
    Number(loteForm.cantidadBonificada) * Number(loteForm.presentacionBonificada.factor_conversion)
  )
})

const subTotal = computed(() => {
  const cant = parseFloat(loteForm.cantidadFacturada) || 0
  const costo = parseFloat(String(loteForm.costoUnitario).replace(/[^0-9.]/g, '')) || 0
  return cant * costo
})  

const totalPagado = computed(() => subTotal.value - Number(loteForm.descuentoLinea || 0))

const cantidadInicialLote = computed(() => unidadesFacturadas.value + unidadesBonificadas.value)

const costoUnitarioReal = computed(() => {
  if (cantidadInicialLote.value === 0) return 0
  return totalPagado.value / cantidadInicialLote.value
})

const limpiarCamposLote = () => {
  loteForm.producto = null
  loteForm.presentacionFacturada = null
  loteForm.cantidadFacturada = ''
  loteForm.presentacionBonificada = null
  loteForm.cantidadBonificada = ''
  loteForm.costoUnitario = ''
  loteForm.descuentoLinea = 0
  loteForm.tipoProducto = 'No perecedero'
  loteForm.numLote = ''
  loteForm.fechaVencimientoLote = null
  presentacionesLote.value = []
  incluyeBonificacion.value = false
}

const agregarItemsATabla = () => {
  if (
    !loteForm.producto ||
    !loteForm.presentacionFacturada ||
    !loteForm.cantidadFacturada ||
    !loteForm.costoUnitario
  )
    return

  let vencimientoTexto = 'N/A'
  if (loteForm.tipoProducto === 'Perecedero' && loteForm.fechaVencimientoLote) {
    const fecha = new Date(loteForm.fechaVencimientoLote)
    const dia = String(fecha.getDate()).padStart(2, '0')
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const anio = fecha.getFullYear()
    vencimientoTexto = `${dia}/${mes}/${anio}`
  }

  itemsAgregados.value.push({
    producto: loteForm.producto.nombre,
    cantFact: `${loteForm.cantidadFacturada} ${loteForm.presentacionFacturada.nombre}`,
    cantidad: cantidadInicialLote.value,
    costoUnit: `$${costoUnitarioReal.value.toFixed(4)}`,
    vencimiento: vencimientoTexto,
    subtotal: `$${totalPagado.value.toFixed(2)}`,
    presentacion_id: loteForm.presentacionFacturada.id,
    cantidad_facturada: Number(loteForm.cantidadFacturada),
    cantidad_bonificada: unidadesBonificadas.value,
    precio_unitario_factura: Number(loteForm.costoUnitario),
    descuento_linea: Number(loteForm.descuentoLinea || 0),
    sub_total: subTotal.value,
    lote_fabricante: loteForm.numLote || null,
    fecha_vencimiento: loteForm.fechaVencimientoLote,
    cantidad_inicial: cantidadInicialLote.value,
    costo_unitario_compra: costoUnitarioReal.value,
  })

  limpiarCamposLote()
}

const eliminarItemDeTabla = (index) => {
  itemsAgregados.value.splice(index, 1)
}

const registrarCompraFinal = async () => {
  if (!documentoForm.proveedor || !documentoForm.estadoPago) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Completa los datos del documento.',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }

  if (itemsAgregados.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin items',
      text: 'Agrega al menos un lote.',
      confirmButtonColor: '#2b5e3b',
    })
    return
  }

  const numeroDocumento = prefijoComprobante.value
    ? `${prefijoComprobante.value}${documentoForm.numComprobante}`
    : documentoForm.numComprobante

  const payload = {
    tipo_dte: documentoForm.tipoComprobante,
    numero_documento: numeroDocumento || null,
    fecha_emision: formatearFecha(documentoForm.fechaEmision),
    descuento_global: null,
    iva_total: null,
    monto_total: documentoForm.montoTotal ? Number(documentoForm.montoTotal) : null,
    estado_pago: documentoForm.estadoPago,
    fecha_vencimiento_pago: formatearFecha(documentoForm.fechaVencimiento),
    proveedor_id: documentoForm.proveedor.id,
    detalles: itemsAgregados.value.map((item) => ({
      cantidad_facturada: item.cantidad_facturada,
      cantidad_bonificada: item.cantidad_bonificada,
      precio_unitario_factura: item.precio_unitario_factura,
      iva_linea: null,
      descuento_linea: item.descuento_linea,
      sub_total: item.sub_total,
      lote: {
        lote_fabricante: item.lote_fabricante,
        fecha_vencimiento: formatearFecha(item.fecha_vencimiento),
        cantidad_inicial: item.cantidad_inicial,
        costo_unitario_compra: item.costo_unitario_compra,
        porcentaje_descuento: null,
        presentacion_id: item.presentacion_id,
      },
    })),
  }

  try {
    await registrarCompra(payload)
    Swal.fire({
      icon: 'success',
      title: '¡Compra registrada!',
      confirmButtonColor: '#2b5e3b',
      timer: 3000,
      timerProgressBar: true,
    })
    itemsAgregados.value = []
    Object.assign(documentoForm, {
      proveedor: null,
      tipoComprobante: '03',
      numComprobante: '',
      fechaEmision: null,
      estadoPago: null,
      montoTotal: '',
      fechaVencimiento: null,
    })
    emit('close')
  } catch (error) {
    const status = error.response?.status
    if (status === 422) {
      const mensajes = Object.values(error.response.data.errors).flat()
      Swal.fire({
        icon: 'warning',
        title: 'Error de validación',
        text: mensajes[0],
        confirmButtonColor: '#2b5e3b',
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar la compra.',
        confirmButtonColor: '#2b5e3b',
      })
    }
  }
}

onMounted(async () => {
  try {
    const response = await proveedores()
    proveedoresOptions.value = response.data.data
  } catch {
    proveedoresOptions.value = []
  }
})
</script>

<style>
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #ffffff !important;
  color: #1e3a2f !important;
  border-bottom: 2px solid #e2e8dd !important;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem;
}

.p-datatable-custom .p-datatable-tbody > tr {
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border-bottom: 1px solid #e2e8dd !important;
}

.p-datatable-custom .p-datatable-tbody > tr:hover {
  background-color: #f4f7f2 !important;
}

.p-inputtext:enabled:focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}

.p-radiobutton-custom .p-radiobutton-box.p-highlight {
  background: #2b5e3b !important;
  border-color: #2b5e3b !important;
}
</style>
