<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="DETALLE DE COMPRA"
    :draggable="false"
    :closable="false"
    :style="{ width: 'min(calc(100vw - 2rem), 68rem)' }"
    class="custom-dialog"
    :pt="{ root: { class: '!rounded-2xl overflow-hidden shadow-2xl' } }"
  >
    <!-- ======================================================= -->
    <!-- VISTA MÓVIL (< 640px)                                   -->
    <!-- ======================================================= -->
    <div v-if="compra" class="block sm:hidden bg-white p-4 text-[#1a2e1f] space-y-4 font-['Inter',sans-serif]">

      <!-- Subcabecera con Nº Documento -->
      <div class="flex items-center justify-between pb-2 border-b border-[#e2e8dd]">
        <span class="text-xs font-bold uppercase text-[#2b5e3b]">Documento</span>
        <span class="text-xs font-mono font-bold text-[#1a2e1f] bg-[#f4f7f2] px-2.5 py-1 rounded-md border border-[#dce4d7]">
          {{ compra.numero_documento }}
        </span>
      </div>

      <!-- Resumen General Móvil -->
      <div class="bg-[#fbfdf9] rounded-xl border border-[#e2e8dd] p-3.5 space-y-2.5 text-xs">
        <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
          <span class="text-gray-500 font-medium">Proveedor:</span>
          <span class="font-bold text-[#1a2e1f]">{{ compra.proveedor?.nombre || '—' }}</span>
        </div>
        <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
          <span class="text-gray-500 font-medium">Fecha Emisión:</span>
          <span class="font-semibold text-[#1a2e1f]">{{ formatDate(compra.fecha_emision) }}</span>
        </div>
        <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
          <span class="text-gray-500 font-medium">Tipo DTE:</span>
          <span class="font-semibold text-[#1a2e1f]">{{ compra.tipo_dte }}</span>
        </div>
        <div class="flex justify-between items-center pb-2 border-b border-[#e2e8dd]/60">
          <span class="text-gray-500 font-medium">Estado Pago:</span>
          <span
            :class="
              compra.estado_pago === 'PAGADO'
                ? 'bg-[#dff0e0] text-[#2b5e3b] border-[#c5e3c7]'
                : 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]'
            "
            class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
          >
            {{ compra.estado_pago }}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-500 font-medium">Vencimiento:</span>
          <span class="font-semibold text-[#1a2e1f]">{{ formatDate(compra.fecha_vencimiento_pago) }}</span>
        </div>
      </div>

      <!-- Tabla Desplegable Móvil -->
      <div class="space-y-2">
        <p class="text-xs uppercase tracking-wider text-[#1a2e1f] font-bold m-0 flex items-center gap-1.5">
          <i class="pi pi-box text-[#2b5e3b]" /> Productos y Lotes
        </p>

        <div class="rounded-xl border border-[#e2e8dd] overflow-hidden bg-white shadow-2xs">
          <DataTable
            v-model:expandedRows="expandedRows"
            :value="compra.detalles_compra"
            dataKey="id"
            class="p-datatable-custom text-xs w-full"
          >
            <!-- Columna Expansible (Flecha) -->
            <Column expander style="width: 2.2rem" />

            <Column header="Producto">
              <template #body="{ data }">
                <div class="flex flex-col">
                  <span class="font-bold text-[#1a2e1f] capitalize">
                    {{ data.presentacion?.producto?.nombre || data.lote?.presentacion?.producto?.nombre || '—' }}
                  </span>
                  <span class="text-[10px] text-gray-500">
                    {{ data.presentacion?.nombre || data.lote?.presentacion?.nombre || '—' }}
                  </span>
                </div>
              </template>
            </Column>

            <Column header="Subtotal" class="text-right">
              <template #body="{ data }">
                <span class="font-bold text-[#1a2e1f] font-mono">
                  ${{ formatCurrency(data.sub_total) }}
                </span>
              </template>
            </Column>

            <!-- Desplegable Móvil -->
            <template #expansion="{ data }">
              <div class="p-3 bg-[#f8faf7] border-y border-[#e2e8dd] text-xs">
                <div class="bg-white p-3 rounded-lg border border-[#e2e8dd] space-y-2">
                  <div class="flex justify-between pb-1.5 border-b border-gray-100">
                    <span class="text-gray-500 font-medium">Lote Interno:</span>
                    <span class="font-mono font-bold text-[#1a2e1f] bg-gray-100 px-1.5 py-0.5 rounded">
                      {{ data.lote?.lote_interno || 'Sin lote' }}
                    </span>
                  </div>
                  <div class="flex justify-between pb-1.5 border-b border-gray-100">
                    <span class="text-gray-500 font-medium">Lote Fabricante:</span>
                    <span class="font-mono text-gray-700">{{ data.lote?.lote_fabricante || '—' }}</span>
                  </div>
                  <div class="flex justify-between pb-1.5 border-b border-gray-100">
                    <span class="text-gray-500 font-medium">Vencimiento:</span>
                    <span class="font-mono text-gray-700">
                      {{ data.lote?.fecha_vencimiento ? formatDate(data.lote.fecha_vencimiento) : '—' }}
                    </span>
                  </div>
                  <div class="flex justify-between pb-1.5 border-b border-gray-100">
                    <span class="text-gray-500 font-medium">Cant. Facturada:</span>
                    <span class="font-mono font-bold">{{ Number(data.cantidad_facturada).toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between pb-1.5 border-b border-gray-100">
                    <span class="text-gray-500 font-medium">Bonificado:</span>
                    <span class="font-mono text-[#2b5e3b] font-semibold">
                      {{ Number(data.cantidad_bonificada) > 0 ? `+${Number(data.cantidad_bonificada).toFixed(2)}` : '0.00' }}
                    </span>
                  </div>
                  <div class="flex justify-between pb-1.5 border-b border-gray-100">
                    <span class="text-gray-500 font-medium">Precio Factura:</span>
                    <span class="font-mono">${{ formatCurrency(data.precio_unitario_factura) }}</span>
                  </div>
                  <div class="flex justify-between pb-1.5 border-b border-gray-100">
                    <span class="text-gray-500 font-medium">IVA Línea:</span>
                    <span class="font-mono">${{ formatCurrency(data.iva_linea) }}</span>
                  </div>
                  <div class="flex justify-between pb-1.5 border-b border-gray-100">
                    <span class="text-gray-500 font-medium">Descuento:</span>
                    <span class="font-mono text-[#b91c1c]">
                      {{ Number(data.descuento_linea) > 0 ? `-$${formatCurrency(data.descuento_linea)}` : '$0.00' }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500 font-medium">Costo Real Lote:</span>
                    <span class="font-mono font-bold text-[#1a2e1f]">
                      ${{ formatCurrency(data.lote?.costo_unitario_compra) }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </DataTable>
        </div>
      </div>

      <!-- Total Móvil -->
      <div class="bg-[#f4f7f2] border border-[#e2e8dd] rounded-xl p-3.5 flex justify-between items-center">
        <span class="text-xs font-bold uppercase text-[#1e3a2f]">Total Compra:</span>
        <span class="text-xl font-black text-[#2b5e3b] font-mono">${{ formatCurrency(compra.monto_total) }}</span>
      </div>

      <!-- Acciones de Pago Móvil -->
      <div v-if="!compra.es_anulado && (compra.estado_pago === 'PENDIENTE' || compra.estado_pago === 'ABONADO')" class="bg-white border border-[#e2e8dd] rounded-xl p-3.5 shadow-sm space-y-3">
        <!-- Si es PENDIENTE -->
        <div v-if="compra.estado_pago === 'PENDIENTE'">
          <Button label="Marcar como PAGADO" icon="pi pi-check-circle" class="w-full !bg-[#2b5e3b] hover:!bg-[#1f482d] text-white !border-none !rounded-lg" @click="marcarComoPagado" :loading="procesandoPago" />
        </div>

        <!-- Si es ABONADO -->
        <div v-else-if="compra.estado_pago === 'ABONADO'" class="space-y-3">
          <div class="flex justify-between items-center text-xs">
            <span class="font-semibold text-gray-600">Total Abonado:</span>
            <span class="font-mono font-bold text-[#2b5e3b]">${{ formatCurrency(compra.abono) }}</span>
          </div>
          <div class="flex justify-between items-center text-xs pb-2 border-b border-gray-100">
            <span class="font-semibold text-gray-600">Saldo Restante:</span>
            <span class="font-mono font-bold text-[#b91c1c]">${{ formatCurrency(saldoRestante) }}</span>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold text-gray-700">Registrar nuevo abono:</span>
            <div class="flex gap-2">
              <InputNumber v-model="montoAbono" mode="currency" currency="USD" locale="en-US" :min="0.01" :max="saldoRestante" class="flex-1" :pt="{ root: { class: '!w-full !h-10' }, pcInputText: { root: { class: '!w-full !h-full !text-sm !rounded-lg' } } }" placeholder="0.00" />
              <Button icon="pi pi-plus" class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white !border-none !h-10 !rounded-lg" @click="registrarAbono" :loading="procesandoPago" :disabled="!montoAbono || montoAbono <= 0 || montoAbono > saldoRestante" />
            </div>
          </div>
        </div>
      </div>

      <!-- Botones Móvil -->
      <div class="pt-2 flex flex-col gap-2 w-full">
        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-xs !py-3 !border-[#cbd5e1] !text-gray-600 !rounded-xl !w-full font-semibold cursor-pointer"
          @click="visible = false"
        />
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO (>= 640px)                             -->
    <!-- ======================================================= -->
    <div v-if="compra" class="hidden sm:flex bg-white p-6 text-[#1a2e1f] flex-col gap-5 font-['Inter',sans-serif]">

      <!-- Subcabecera Nº Documento -->
      <div class="flex items-center justify-between pb-2 border-b border-[#e2e8dd]">
        <div class="flex items-center gap-2">
          <i class="pi pi-receipt text-[#2b5e3b] text-base" />
          <span class="text-xs font-bold uppercase tracking-wider text-[#2b5e3b]">Documento N°</span>
        </div>
        <span class="text-sm font-mono font-bold text-[#1a2e1f] bg-[#f4f7f2] px-3 py-1 rounded-lg border border-[#dce4d7]">
          {{ compra.numero_documento }}
        </span>
      </div>

      <!-- Información General Grid Escritorio -->
      <div class="bg-[#fbfdf9] rounded-2xl border border-[#e2e8dd] p-4 shadow-2xs">
        <div class="grid grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <p class="text-[10px] uppercase tracking-wider text-[#2b5e3b] font-bold mb-0.5">Proveedor</p>
            <p class="text-sm font-bold text-[#1a2e1f] m-0">{{ compra.proveedor?.nombre || '—' }}</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-[#2b5e3b] font-bold mb-0.5">Fecha Emisión</p>
            <p class="text-sm font-semibold text-[#1a2e1f] m-0 font-mono">{{ formatDate(compra.fecha_emision) }}</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-[#2b5e3b] font-bold mb-0.5">Tipo DTE</p>
            <p class="text-sm font-semibold text-[#1a2e1f] m-0">{{ compra.tipo_dte }}</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-[#2b5e3b] font-bold mb-0.5">Estado Pago</p>
            <span
              :class="
                compra.estado_pago === 'PAGADO'
                  ? 'bg-[#dff0e0] text-[#2b5e3b] border-[#c5e3c7]'
                  : 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]'
              "
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border inline-block"
            >
              {{ compra.estado_pago }}
            </span>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-[#2b5e3b] font-bold mb-0.5">Vencimiento Pago</p>
            <p class="text-sm font-semibold text-[#1a2e1f] m-0 font-mono">{{ formatDate(compra.fecha_vencimiento_pago) }}</p>
          </div>
          <div v-if="compra.usuario">
            <p class="text-[10px] uppercase tracking-wider text-[#2b5e3b] font-bold mb-0.5">Registrado por</p>
            <p class="text-sm font-semibold text-[#1a2e1f] m-0">{{ compra.usuario.nombre }}</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-[#2b5e3b] font-bold mb-0.5">Descuento Global</p>
            <p class="text-sm font-semibold text-[#1a2e1f] m-0 font-mono">${{ formatCurrency(compra.descuento_global) }}</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-[#2b5e3b] font-bold mb-0.5">IVA Total</p>
            <p class="text-sm font-semibold text-[#1a2e1f] m-0 font-mono">${{ formatCurrency(compra.iva_total) }}</p>
          </div>
        </div>
      </div>

      <!-- Tabla Completa Desplegable/Expandible para Escritorio -->
      <div class="space-y-2">
        <p class="text-xs uppercase tracking-wider text-[#1a2e1f] font-bold m-0 flex items-center gap-1.5">
          <i class="pi pi-box text-[#2b5e3b]" /> Productos y Lotes
        </p>

        <div class="rounded-2xl border border-[#e2e8dd] overflow-hidden bg-white shadow-2xs">
          <DataTable
            v-model:expandedRows="expandedRows"
            :value="compra.detalles_compra"
            dataKey="id"
            responsiveLayout="scroll"
            class="p-datatable-custom text-xs w-full"
          >
            <!-- Columna Expansible (Flecha) -->
            <Column expander style="width: 2.5rem" />

            <Column header="Producto" class="font-semibold text-[#1a2e1f]">
              <template #body="{ data }">
                <span class="font-bold text-[#1a2e1f] capitalize">
                  {{ data.presentacion?.producto?.nombre || data.lote?.presentacion?.producto?.nombre || '—' }}
                </span>
              </template>
            </Column>

            <Column header="Presentación">
              <template #body="{ data }">
                <span class="text-gray-700">{{ data.presentacion?.nombre || data.lote?.presentacion?.nombre || '—' }}</span>
              </template>
            </Column>

            <Column header="Lote Interno">
              <template #body="{ data }">
                <span class="font-mono text-xs bg-[#f4f7f2] text-[#1a2e1f] px-2 py-0.5 rounded border border-[#dce4d7] font-bold">
                  {{ data.lote?.lote_interno || 'Sin lote' }}
                </span>
              </template>
            </Column>

            <Column header="Cant. Facturada" class="text-right">
              <template #body="{ data }">
                <span class="font-mono font-semibold">{{ Number(data.cantidad_facturada).toFixed(2) }}</span>
              </template>
            </Column>

            <Column header="Precio Factura" class="text-right">
              <template #body="{ data }">
                <span class="font-mono">${{ formatCurrency(data.precio_unitario_factura) }}</span>
              </template>
            </Column>

            <Column header="Subtotal" class="text-right">
              <template #body="{ data }">
                <span class="font-bold text-[#1a2e1f] font-mono">${{ formatCurrency(data.sub_total) }}</span>
              </template>
            </Column>

            <!-- Desplegable con Detalle de Valores Secundarios (Escritorio) -->
            <template #expansion="{ data }">
              <div class="p-3 bg-[#f8faf7] border-y border-[#e2e8dd] text-xs">
                <div class="bg-white p-3.5 rounded-xl border border-[#e2e8dd] grid grid-cols-4 gap-4">
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#2b5e3b] block mb-0.5">Lote Fabricante</span>
                    <span class="font-mono text-gray-700">{{ data.lote?.lote_fabricante || '—' }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#2b5e3b] block mb-0.5">Vencimiento</span>
                    <span class="font-mono text-gray-700">
                      {{ data.lote?.fecha_vencimiento ? formatDate(data.lote.fecha_vencimiento) : '—' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#2b5e3b] block mb-0.5">Cant. Bonificada</span>
                    <span class="font-mono text-[#2b5e3b] font-semibold">
                      {{ Number(data.cantidad_bonificada) > 0 ? `+${Number(data.cantidad_bonificada).toFixed(2)}` : '0.00' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#2b5e3b] block mb-0.5">IVA Línea</span>
                    <span class="font-mono">${{ formatCurrency(data.iva_linea) }}</span>
                  </div>
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#2b5e3b] block mb-0.5">Descuento Línea</span>
                    <span class="font-mono text-[#b91c1c]">
                      {{ Number(data.descuento_linea) > 0 ? `-$${formatCurrency(data.descuento_linea)}` : '$0.00' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-[10px] font-bold uppercase text-[#2b5e3b] block mb-0.5">Costo Real (Lote)</span>
                    <span class="font-mono font-bold text-[#1a2e1f]">
                      ${{ formatCurrency(data.lote?.costo_unitario_compra) }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </DataTable>
        </div>
      </div>

      <!-- Acciones de Pago Escritorio -->
      <div v-if="!compra.es_anulado && (compra.estado_pago === 'PENDIENTE' || compra.estado_pago === 'ABONADO')" class="bg-white border border-[#e2e8dd] rounded-xl p-4 shadow-sm">

        <div v-if="compra.estado_pago === 'PENDIENTE'" class="flex items-center justify-between">
          <div class="text-sm">
            <span class="text-gray-500">Esta compra está pendiente.</span>
          </div>
          <Button label="Marcar como PAGADO " icon="pi pi-check-circle" class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white !border-none !rounded-lg" @click="marcarComoPagado" :loading="procesandoPago" />
        </div>

        <!-- ABONADO -->
        <div v-else-if="compra.estado_pago === 'ABONADO'" class="flex items-center justify-between gap-6">
          <div class="flex flex-col flex-1">
             <span class="font-bold text-[#1a2e1f] text-sm block mb-1">Gestión de Abonos</span>
             <div class="flex items-center gap-4 text-xs bg-[#f8faf7] p-2.5 rounded-lg border border-[#e2e8dd]">
                <div class="flex flex-col">
                  <span class="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Total Abonado</span>
                  <span class="font-bold text-[#2b5e3b] text-base">${{ formatCurrency(compra.abono) }}</span>
                </div>
                <div class="w-px h-8 bg-[#e2e8dd]"></div>
                <div class="flex flex-col">
                  <span class="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Saldo Restante</span>
                  <span class="font-bold text-[#b91c1c] text-base">${{ formatCurrency(saldoRestante) }}</span>
                </div>
             </div>
          </div>

          <div class="flex items-end gap-3 shrink-0">
             <div class="flex flex-col gap-1.5">
               <span class="text-xs font-semibold text-gray-700">Registrar nuevo abono</span>
               <InputNumber v-model="montoAbono" mode="currency" currency="USD" locale="en-US" :min="0.01" :max="saldoRestante" class="w-48" :pt="{ root: { class: '!h-10' }, pcInputText: { root: { class: '!w-full !h-full !text-sm !rounded-lg' } } }" placeholder="0.00" />
             </div>
             <Button label="Abonar" icon="pi pi-plus" class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white !border-none !h-10 !rounded-lg !px-5" @click="registrarAbono" :loading="procesandoPago" :disabled="!montoAbono || montoAbono <= 0 || montoAbono > saldoRestante" />
          </div>
        </div>
      </div>

      <!-- Total Compra + Botón de Cierre Escritorio -->
      <div class="flex justify-between items-center mt-1 pt-4 border-t border-[#e2e8dd] w-full">
        <div class="bg-[#f4f7f2] border border-[#e2e8dd] rounded-xl px-4 py-2 flex items-center gap-3">
          <span class="text-xs font-bold uppercase text-[#1e3a2f]">Total de la Compra:</span>
          <span class="text-2xl font-black text-[#2b5e3b] font-mono">${{ formatCurrency(compra.monto_total) }}</span>
        </div>

        <Button
          label="Cerrar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="!text-sm !py-2.5 !border-[#cbd5e1] !text-gray-600 !rounded-xl font-semibold cursor-pointer w-[30%] flex justify-center items-center"
          @click="visible = false"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputNumber from 'primevue/inputnumber'
import { actualizarEstadoCompra, abonarCompra } from '@/services/compraService'
import { mostrarConfirmacion, mostrarExito, mostrarError } from '@/utils/SweetAlertService'

const props = defineProps({
  compra: { type: Object, default: null },
})

const visible = defineModel('visible', { type: Boolean, default: false })
const emit = defineEmits(['compra-actualizada'])
const expandedRows = ref({})

const procesandoPago = ref(false)
const montoAbono = ref(null)

const saldoRestante = computed(() => {
  if (!props.compra) return 0
  const total = parseFloat(props.compra.monto_total || 0)
  const abono = parseFloat(props.compra.abono || 0)
  return total - abono
})

const formatCurrency = (v) => {
  const num = parseFloat(v)
  return isNaN(num) ? '0.00' : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDate = (isoDate) => {
  if (!isoDate) return '—'
  const date = new Date(isoDate)
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const marcarComoPagado = async () => {
  const confirmacion = await mostrarConfirmacion({
    titulo: '¿Marcar como PAGADO?',
    mensajeHtml: 'Esta acción cambiará el estado de la compra a PAGADO permanentemente.',
    icono: 'pi-check-circle',
    confirmButtonText: 'Sí, marcar pagado'
  })

  if (confirmacion.isConfirmed) {
    procesandoPago.value = true
    try {
      await actualizarEstadoCompra(props.compra.id, { estado_pago: 'PAGADO' })
      mostrarExito('Compra pagada', 'El estado se ha actualizado a PAGADO.')
      emit('compra-actualizada')
    } catch (error) {
      mostrarError('Error', error.response?.data?.message || 'No se pudo actualizar el estado.')
    } finally {
      procesandoPago.value = false
    }
  }
}

const registrarAbono = async () => {
  if (!montoAbono.value || montoAbono.value <= 0) return

  const confirmacion = await mostrarConfirmacion({
    titulo: '¿Registrar Abono?',
    mensajeHtml: `Se registrará un abono por <strong>$${formatCurrency(montoAbono.value)}</strong>.`,
    icono: 'pi-money-bill',
    confirmButtonText: 'Sí, registrar'
  })

  if (confirmacion.isConfirmed) {
    procesandoPago.value = true
    try {
      const resp = await abonarCompra(props.compra.id, { monto_abono: montoAbono.value })
      mostrarExito('Abono registrado', resp.data.message || 'El abono se registró correctamente.')
      montoAbono.value = null
      emit('compra-actualizada')
    } catch (error) {
      mostrarError('Error', error.response?.data?.message || 'No se pudo registrar el abono.')
    } finally {
      procesandoPago.value = false
    }
  }
}
</script>

<style>
/* Encabezado sin 'X' y paleta AgroFerretería */
.custom-dialog .p-dialog-header {
  background-color: #1a3323 !important;
  color: #ffffff !important;
  border-bottom: 1px solid #2b5e3b !important;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 1.1rem 1.5rem !important;
}

/* Limpieza del contenedor de contenido */
.custom-dialog .p-dialog-content {
  background-color: #ffffff !important;
  padding: 0 !important;
}

/* Estilos de la DataTable personalizada para detalles */
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #fcfdfe !important;
  border-bottom: 1px solid #e2e8dd !important;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.75rem 1rem !important;
}

.p-datatable-custom .p-datatable-tbody > tr > td {
  padding: 0.75rem 1rem !important;
  border-bottom: 1px solid #f1f5f0 !important;
}

.swal2-container {
  z-index: 999999 !important;
}
</style>
