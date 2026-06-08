<template>
  <div class="bg-[#eef2e9] min-h-screen p-4 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <div
      class="w-full max-w-[900px] mx-auto bg-[#ffffff] rounded-3xl border border-[#e2e8dd] shadow-xl overflow-hidden"
    >
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

      <div class="p-6 flex flex-col gap-8">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#e2e8dd] pb-2">
            <h2 class="text-[14px] font-semibold uppercase tracking-wider text-[#4b5563]">
              Digitalización del documento
            </h2>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[14px] font-medium text-[#1a2e1f]">Proveedor</label>
            <Dropdown
              v-model="documentoForm.proveedor"
              :options="proveedoresOptions"
              placeholder="Seleccionar proveedor"
              class="w-full bg-[#f9fafb] border-[#d1d5db] text-[#1a2e1f]"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[14px] font-medium text-[#1a2e1f]">Tipo de comprobante</label>
              <Dropdown
                v-model="documentoForm.tipoComprobante"
                :options="comprobantesOptions"
                placeholder="Seleccionar tipo"
                class="w-full bg-[#f9fafb] border-[#d1d5db]"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[14px] font-medium text-[#1a2e1f]">Nº comprobante</label>
              <InputText
                v-model="documentoForm.numComprobante"
                placeholder="DTE-03-000123456"
                class="w-full bg-[#f9fafb] border-[#d1d5db] h-[40px] px-3 rounded-md focus:border-[#2b5e3b] text-[#1a2e1f]"
              />
              <small class="text-[13px] text-[#6b7280] font-normal"
                >Aplica para comprobante físico</small
              >
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
              <Dropdown
                v-model="documentoForm.estadoPago"
                :options="estadosPagoOptions"
                placeholder="Seleccionar"
                class="w-full bg-[#f9fafb] border-[#d1d5db]"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[14px] font-medium text-[#1a2e1f]">Monto total facturado</label>
              <InputText
                v-model="documentoForm.montoTotal"
                placeholder="0.00"
                class="w-full bg-[#f9fafb] border-[#d1d5db] h-[40px] px-3 rounded-md focus:border-[#2b5e3b] text-[#1a2e1f]"
              />
            </div>
          </div>

          <div
            v-if="documentoForm.estadoPago !== 'Pagado'"
            class="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div class="flex flex-col gap-1.5">
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
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2 border-b border-[#e2e8dd] pb-2">
            <h2 class="text-[14px] font-semibold uppercase tracking-wider text-[#4b5563]">
              Lotes recibidos
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[14px] font-medium text-[#1a2e1f]">Nombre del producto</label>
              <Select
                v-model="loteForm.producto"
                :options="productosOptions"
                placeholder="Seleccionar producto"
                class="w-full bg-[#f9fafb] border-[#d1d5db]"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[14px] font-medium text-[#1a2e1f]">Tipo de unidad que entra</label>
              <Dropdown
                v-model="loteForm.tipoUnidad"
                :options="unidadesOptions"
                placeholder="Seleccionar unidad"
                class="w-full bg-[#f9fafb] border-[#d1d5db]"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div class="flex flex-col gap-1.5">
              <label class="text-[14px] font-medium text-[#1a2e1f]">Cantidad entrante</label>
              <InputText
                v-model="loteForm.cantidadEntrante"
                placeholder="0"
                class="w-full bg-[#f9fafb] border-[#d1d5db] h-[40px] px-3 rounded-md text-[#1a2e1f]"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-[14px] font-medium text-[#1a2e1f]">Tipo del producto</label>
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
                  <RadioButton
                    v-model="loteForm.tipoProducto"
                    inputId="noPerecedero"
                    name="tipo"
                    value="No perecedero"
                    class="p-radiobutton-custom"
                  />
                  <label for="noPerecedero" class="cursor-pointer text-[14px] text-[#1a2e1f]"
                    >No perecedero</label
                  >
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="loteForm.tipoProducto === 'Perecedero'"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div class="flex flex-col gap-1.5">
              <label class="text-[14px] font-medium text-[#1a2e1f]">Número de lote</label>
              <InputText
                v-model="loteForm.numLote"
                placeholder="LOT-001"
                class="w-full bg-[#f9fafb] border-[#d1d5db] h-[40px] px-3 rounded-md text-[#1a2e1f]"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[14px] font-medium text-[#1a2e1f]">Fecha de vencimiento</label>
              <DatePicker
                v-model="loteForm.fechaVencimientoLote"
                dateFormat="dd/mm/yy"
                showIcon
                iconDisplay="input"
                class="w-full bg-[#f9fafb] border-[#d1d5db]"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[14px] font-medium text-[#1a2e1f]"
                >Cantidad en unidad entrante</label
              >
              <InputText
                v-model="loteForm.cantidadUnidadEntrante"
                placeholder="0"
                class="w-full bg-[#f9fafb] border-[#d1d5db] h-[40px] px-3 rounded-md text-[#1a2e1f]"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[14px] font-medium text-[#1a2e1f]">Costo unitario</label>
              <InputText
                v-model="loteForm.costoUnitario"
                placeholder="0.00"
                class="w-full bg-[#f9fafb] border-[#d1d5db] h-[40px] px-3 rounded-md text-[#1a2e1f]"
              />
            </div>
          </div>

          <div class="flex justify-between items-center mt-4">
            <Button
              label="Limpiar Lote"
              icon="pi pi-refresh"
              class="bg-[#eef2e9] hover:bg-[#e2e8dd] text-[#1a2e1f] border border-[#d1d5db] px-4 py-4 rounded-lg text-[14px] font-semibold cursor-pointer transition-colors"
              @click="limpiarCamposLote"
            />

            <Button
              label="Agregar Item"
              icon="pi pi-plus"
              class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white border-none px-4 py-4 rounded-lg text-[14px] font-semibold cursor-pointer shadow-sm transition-colors"
              @click="agregarItemATabla"
            />
          </div>
        </div>

        <div class="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd] mt-2">
          <DataTable
            :value="itemsAgregados"
            responsiveLayout="scroll"
            class="p-datatable-custom text-[14px]"
          >
            <Column field="producto" header="Producto" />
            <Column field="cantFact" header="Cant. fact." />
            <Column field="cantidad" header="Cantidad" />
            <Column field="costoUnit" header="Costo unit." />
            <Column field="vencimiento" header="Fecha Vencimiento" />
            <Column field="subtotal" header="Subtotal" class="font-semibold text-[#1a2e1f]" />

            <Column header="Acción" class="text-center w-\[80px]">
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
            label="Regresar"
            icon="pi pi-arrow-left"
            class="bg-[#eef2e9] hover:bg-[#e2e8dd] text-[#1a2e1f] border border-[#cbd5e1] px-4 py-4 rounded-xl text-[14px] font-semibold transition-colors duration-200 cursor-pointer"
            @click="regresarAlHistorial"
          />

          <Button
            label="Registrar compra"
            icon="pi pi-save"
            class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white border-none px-4 py-4 rounded-xl text-[14px] font-semibold cursor-pointer shadow-md transition-colors duration-200"
            @click="registrarCompraFinal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Select } from 'primevue'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const proveedoresOptions = ref([
  'Proveedor Agro-Central',
  'Distribuidora El Sol',
  'Ferre-Mayoristas SV',
])
const comprobantesOptions = ref([
  'Nota de remisión',
  'Factura de Consumidor Final',
  'Crédito Fiscal',
])
const estadosPagoOptions = ref(['Pagado', 'Crédito 30 días', 'Crédito 60 días'])
const productosOptions = ref([
  'Aceite vegetal',
  'Abono de Liberación Rápida',
  'Pala Metálica Duplex',
])
const unidadesOptions = ref(['Caja x12', 'Saco 50kg', 'Unidad'])

const documentoForm = reactive({
  proveedor: null,
  tipoComprobante: 'Nota de remisión',
  numComprobante: '',
  fechaEmision: null,
  estadoPago: null,
  montoTotal: '',
  fechaVencimiento: null,
})

const loteForm = reactive({
  producto: null,
  tipoUnidad: null,
  cantidadEntrante: '',
  tipoProducto: 'No perecedero',
  numLote: '',
  fechaVencimientoLote: null,
  cantidadUnidadEntrante: ' ',
  costoUnitario: '',
})

const itemsAgregados = ref([
  {
    producto: 'Aceite vegetal',
    cantFact: '3 (Caja)',
    cantidad: '36',
    costoUnit: '$12.00',
    vencimiento: 'N/A',
    subtotal: '$36.00',
  },
])

const limpiarCamposLote = () => {
  loteForm.producto = null
  loteForm.tipoUnidad = null
  loteForm.cantidadEntrante = '0'
  loteForm.tipoProducto = 'No perecedero'
  loteForm.numLote = ''
  loteForm.fechaVencimientoLote = null
  loteForm.cantidadUnidadEntrante = ''
  loteForm.costoUnitario = ''
}

const agregarItemATabla = () => {
  if (!loteForm.producto) return

  let vencimientoTexto = 'N/A'

  if (loteForm.tipoProducto === 'Perecedero' && loteForm.fechaVencimientoLote) {
    const fecha = new Date(loteForm.fechaVencimientoLote)
    const dia = String(fecha.getDate()).padStart(2, '0')
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const anio = fecha.getFullYear()

    vencimientoTexto = `${dia}/${mes}/${anio}`
  }

  itemsAgregados.value.push({
    producto: loteForm.producto,
    cantFact: `${loteForm.cantidadEntrante} (${loteForm.tipoUnidad || 'Unidad'})`,
    shadowFact: loteForm.cantidadEntrante,
    cantidad: loteForm.cantidadUnidadEntrante,
    costoUnit: `$${loteForm.costoUnitario || '0.00'}`,
    vencimiento: vencimientoTexto,
    subtotal: `$${(Number(loteForm.cantidadUnidadEntrante) * Number(loteForm.costoUnitario || 0)).toFixed(2)}`,
  })

  limpiarCamposLote()
}

const eliminarItemDeTabla = (index) => {
  itemsAgregados.value.splice(index, 1)
}

const regresarAlHistorial = () => {
  console.log('Regresando a la vista ComprasRealizadasView.vue...')
}

const registrarCompraFinal = () => {
  console.log('Enviando toda la información al backend...', {
    documento: { ...documentoForm },
    items: itemsAgregados.value,
  })
}
</script>

<style>
/* Ajustes de componentes PrimeVue alineados a la nueva paleta clara */
.p-dropdown {
  height: 40px !important;
  display: flex !important;
  align-items: center !important;
  padding-left: 0.5rem !important;
  border-radius: 6px !important;
  background-color: #f9fafb !important;
  border: 1px solid #d1d5db !important;
  color: #1a2e1f !important;
}

.p-dropdown-label {
  color: #1a2e1f !important;
}

/* Tabla headers cambiados a 13px / 600 con el Verde Oscuro Corporativo #1e3a2f */
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

/* Enfoques globales con el color principal #2b5e3b */
.p-inputtext:enabled:focus,
.p-dropdown:not(.p-disabled).p-focus {
  box-shadow: 0 0 0 2px rgba(43, 94, 59, 0.2) !important;
  border-color: #2b5e3b !important;
}

.p-radiobutton-custom .p-radiobutton-box.p-highlight {
  background: #2b5e3b !important;
  border-color: #2b5e3b !important;
}
</style>
