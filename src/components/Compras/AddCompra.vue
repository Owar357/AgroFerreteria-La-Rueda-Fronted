<template>
  <div class="bg-[#eef2e9] min-h-screen p-3 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">
    <div class="w-full max-w-[1200px] mx-auto bg-[#ffffff] rounded-3xl border border-[#e2e8dd] shadow-xl overflow-hidden">
      
      <!-- ======================================================= -->
      <!-- CABECERA MÓVIL (Solo Teléfono)                          -->
      <!-- ======================================================= -->
      <div class="block md:hidden bg-[#2b5e3b] p-4 border-b border-[#e2e8dd]">
        <div>
          <h1 class="text-xl font-semibold text-white leading-tight m-0">Registro de compra</h1>
          <p class="text-xs text-[#dff0e0] mt-1 m-0">
            Documento digitalizado y lotes recibidos del proveedor
          </p>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- CABECERA ESCRITORIO (Solo PC)                           -->
      <!-- ======================================================= -->
      <div class="hidden md:block bg-[#2b5e3b] p-6 border-b border-[#e2e8dd]">
        <div class="flex items-center gap-3">
          <div>
            <h1 class="text-white text-[26px] font-semibold tracking-wide">Registro de compra</h1>
            <p class="text-[#dff0e0] text-[14px] font-normal">
              Documento digitalizado de la compra y lotes recibidos por el proveedor
            </p>
          </div>
        </div>
      </div>

      <div class="p-4 sm:p-6 flex flex-col gap-6">
        <Stepper value="1" class="basis-full">
          <StepList>
            <Step value="1">Documento</Step>
            <Step value="2">Lotes recibidos</Step>
          </StepList>

          <StepPanels>
            <!-- ======================================================= -->
            <!-- PASO 1: DOCUMENTO                                       -->
            <!-- ======================================================= -->
            <StepPanel value="1" v-slot="{ activateCallback }">
              <div class="flex flex-col gap-4 pt-4 sm:pt-6">

                <!-- ======================================================= -->
                <!-- VISTA MÓVIL DOCUMENTO (Solo Teléfono: block md:hidden) -->
                <!-- ======================================================= -->
                <div class="block md:hidden space-y-4">
                  <!-- Proveedor -->
                  <div class="flex flex-col gap-1.5 w-full">
                    <label class="text-xs font-semibold text-[#1a2e1f]">Proveedor *</label>
                    <AutoComplete v-model="documentoForm.proveedor" optionLabel="nombre"
                      :suggestions="proveedoresFiltrados" @complete="buscarProveedor" placeholder="Buscar proveedor..."
                      class="w-full" fluid
                      :pt="{
                        pcInputText: {
                          root: { class: '!bg-white !border-gray-300 !text-[#1a2e1f] !text-xs !h-10 rounded-lg w-full' }
                        }
                      }" />
                  </div>

                  <!-- Tipo Comprobante -->
                  <BaseSelect
                    v-model="documentoForm.tipoComprobante"
                    label="Tipo de documento *"
                    :options="comprobantesOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Seleccionar tipo"
                    size="sm"
                    class="w-full"
                  />

                  <!-- Nº Comprobante -->
                  <div class="flex flex-col gap-1.5 w-full">
                    <label class="text-xs font-semibold text-[#1a2e1f]">Nº comprobante *</label>
                    <div class="flex w-full">
                      <span v-if="prefijoComprobante"
                        class="flex items-center px-2.5 bg-[#e2e8dd] border border-r-0 border-gray-300 rounded-l-lg text-[#6b7280] text-xs font-mono shrink-0">
                        {{ prefijoComprobante }}
                      </span>
                      <BaseInput
                        v-model="documentoForm.numComprobante"
                        :placeholder="prefijoComprobante ? '000123456' : 'Número de documento'"
                        size="sm"
                        class="w-full"
                        :class="prefijoComprobante ? '[&_input]:!rounded-l-none' : ''"
                      />
                    </div>
                    <small v-if="prefijoComprobante" class="text-[11px] text-[#6b7280] font-normal">
                      Aplica para comprobante físico
                    </small>
                  </div>

                  <!-- Fecha Emisión -->
                  <div class="flex flex-col gap-1.5 w-full">
                    <label class="text-xs font-semibold text-[#1a2e1f]">Fecha de emisión *</label>
                    <DatePicker v-model="documentoForm.fechaEmision" dateFormat="dd/mm/yy" showIcon iconDisplay="input"
                      class="w-full !bg-white !border-gray-300 text-xs rounded-lg h-10" />
                  </div>

                  <!-- Estado de Pago -->
                  <BaseSelect
                    v-model="documentoForm.estadoPago"
                    label="Estado de pago *"
                    :options="estadosPagoOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Seleccionar"
                    size="sm"
                    class="w-full"
                  />

                  <!-- Monto Total Facturado -->
                  <BaseInputNumberMoney
                    v-model="documentoForm.montoTotal"
                    label="Monto total facturado *"
                    placeholder="0.00"
                    size="sm"
                    class="w-full font-mono"
                  />

                  <!-- Fecha Vencimiento -->
                  <div v-if="documentoForm.estadoPago !== 'PAGADO'" class="flex flex-col gap-1.5 w-full">
                    <label class="text-xs font-semibold text-[#1a2e1f]">Fecha de vencimiento del crédito</label>
                    <DatePicker v-model="documentoForm.fechaVencimiento" dateFormat="dd/mm/yy" showIcon
                      iconDisplay="input" class="w-full !bg-white !border-gray-300 text-xs rounded-lg h-10" />
                    <small class="text-[11px] text-[#6b7280] font-normal">Desaparece si el estado es "Pagado"</small>
                  </div>
                </div>

                <!-- ======================================================= -->
                <!-- VISTA ESCRITORIO DOCUMENTO (Solo PC: hidden md:block)   -->
                <!-- ======================================================= -->
                <div class="hidden md:block">
                  <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[14px] font-medium text-[#1a2e1f]">Proveedor</label>
                      <AutoComplete v-model="documentoForm.proveedor" optionLabel="nombre"
                        :suggestions="proveedoresFiltrados" @complete="buscarProveedor" placeholder="Buscar proveedor..."
                        class="w-full" fluid />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <BaseSelect
                        v-model="documentoForm.tipoComprobante"
                        label="Tipo de documento"
                        :options="comprobantesOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccionar tipo"
                        size="md"
                        class="w-[45%]"
                      />

                      <div class="flex flex-col gap-1.5 w-[52.5%]">
                        <label class="text-[14px] font-medium text-[#1a2e1f]">Nº comprobante</label>
                        <div class="flex">
                          <span v-if="prefijoComprobante"
                            class="flex items-center px-3 bg-[#e2e8dd] border border-r-0 border-[#d1d5db] rounded-l-md text-[#6b7280] text-[14px] shrink-0">
                            {{ prefijoComprobante }}
                          </span>
                          <BaseInput
                            v-model="documentoForm.numComprobante"
                            :placeholder="prefijoComprobante ? '000123456' : 'Número de documento'"
                            size="md"
                            class="w-full"
                            :class="prefijoComprobante ? '[&_input]:!rounded-l-none' : ''"
                          />
                        </div>
                        <small v-if="prefijoComprobante" class="text-[13px] text-[#6b7280] font-normal">
                          Aplica para comprobante físico
                        </small>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="flex flex-col gap-1.5 w-[45%]">
                        <label class="text-[14px] font-medium text-[#1a2e1f]">Fecha de emisión</label>
                        <DatePicker v-model="documentoForm.fechaEmision" dateFormat="dd/mm/yy" showIcon iconDisplay="input"
                          class="w-full bg-[#f9fafb] border-[#d1d5db]" />
                      </div>
                      <BaseSelect
                        v-model="documentoForm.estadoPago"
                        label="Estado de pago"
                        :options="estadosPagoOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccionar"
                        size="md"
                        class="w-[52.5%]"
                      />
                      <BaseInputNumberMoney
                        v-model="documentoForm.montoTotal"
                        label="Monto total facturado"
                        placeholder="0.00"
                        size="md"
                        class="w-[45%]"
                      />
                      <div v-if="documentoForm.estadoPago !== 'PAGADO'" class="flex !flex-col gap-2 w-[52.5%]">
                        <label class="text-[14px] font-medium text-[#1a2e1f]">Fecha de vencimiento del crédito</label>
                        <DatePicker v-model="documentoForm.fechaVencimiento" dateFormat="dd/mm/yy" showIcon
                          iconDisplay="input" class="w-full bg-[#f9fafb] border-[#d1d5db]" />
                        <small class="text-[13px] text-[#6b7280] font-normal">Desaparece si el estado es "Pagado"</small>
                      </div>
                    </div>
                  </div>
                </div>

               
                  <!-- Footer Paso 1 -->
                  <div class="mt-6 pt-4 border-t border-[#e2e8dd]">
                    <!-- Vista Móvil -->
                    <div class="flex flex-col gap-3 block md:hidden">
                      <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                        class="!text-sm !py-3 !px-6 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-xs transition-all cursor-pointer w-full flex justify-center"
                        @click="activateCallback('2')" />
                      <Button label="Regresar" icon="pi pi-arrow-left"
                        class="!text-sm !py-3 !px-6 !bg-[#eef2e9] !border-[#cbd5e1] !text-[#1a2e1f] rounded-xl hover:!bg-[#e2e8dd] cursor-pointer w-full flex justify-center"
                        @click="emit('close')" />
                    </div>
                    <!-- Vista Escritorio -->
                    <div class="hidden md:flex justify-between items-center w-full">
                      <Button label="Regresar" icon="pi pi-arrow-left"
                        class="bg-[#eef2e9] hover:bg-[#e2e8dd] text-[#1a2e1f] border border-[#cbd5e1] px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-colors duration-200 cursor-pointer"
                        @click="emit('close')" />
                      <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                        class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white border-none px-6 py-2.5 rounded-xl text-[14px] font-semibold cursor-pointer shadow-md transition-colors duration-200"
                        @click="activateCallback('2')" />
                    </div>
                  </div>
              </div>
            </StepPanel>

            <!-- ======================================================= -->
            <!-- PASO 2: LOTES RECIBIDOS                                 -->
            <!-- ======================================================= -->
            <StepPanel value="2" v-slot="{ activateCallback }">
              <div class="flex flex-col gap-6 pt-4 sm:pt-6">

                <!-- ======================================================= -->
                <!-- VISTA MÓVIL LOTES (Solo Teléfono: block md:hidden)     -->
                <!-- ======================================================= -->
                <div class="block md:hidden space-y-4">
                  <!-- Producto -->
                  <div class="flex flex-col gap-1.5 w-full">
                    <label class="text-xs font-semibold text-[#1a2e1f]">Nombre del producto *</label>
                    <AutoComplete v-model="loteForm.producto" optionLabel="nombre" :suggestions="sugerenciasProductos"
                      @complete="buscarProductoLote" @item-select="alSeleccionarProductoLote"
                      placeholder="Escribe nombre, cód. interno..." class="w-full" fluid
                      :pt="{
                        pcInputText: {
                          root: { class: '!bg-white !border-gray-300 !text-[#1a2e1f] !text-xs !h-10 rounded-lg w-full' }
                        }
                      }" >
                      <template #option="{ option }">
                        <span class="text-sm">
                          <span class="font-semibold text-[#1a2e1f]">{{ option.nombre }}</span>
                          <span v-if="option.fabricante" class="text-gray-500"> - {{ option.fabricante }}</span>
                        </span>
                      </template>
                    </AutoComplete>
                  </div>

                  <!-- Presentación -->
                  <BaseSelect
                    v-model="loteForm.presentacionFacturada"
                    label="Tipo de presentación que entra *"
                    :options="presentacionesLote"
                    optionLabel="nombre"
                    placeholder="Seleccionar presentación"
                    size="sm"
                    class="w-full"
                  />

                  <!-- Cantidad Facturada -->
                  <BaseInputNumber
                    v-model="loteForm.cantidadFacturada"
                    :label="`Cantidad facturada ${loteForm.presentacionFacturada ? `(${loteForm.presentacionFacturada.nombre})` : ''} *`"
                    placeholder="0"
                    size="sm"
                    class="w-full font-mono"
                  >
                    <template #help>
                      <small v-if="loteForm.presentacionFacturada && loteForm.cantidadFacturada"
                        class="text-[11px] text-[#2b5e3b] font-medium">
                        = {{ unidadesFacturadas }} {{ loteForm.producto?.unidad_base?.toLowerCase() }} en total
                      </small>
                    </template>
                  </BaseInputNumber>

                  <!-- Tipo de Producto (Perecedero) -->
                  <div class="flex flex-col gap-1.5 w-full">
                    <label class="text-xs font-semibold text-[#1a2e1f]">Tipo del producto *</label>
                    <div class="flex items-center justify-around bg-gray-50 px-3 h-10 rounded-lg border border-gray-200 w-full">
                      <div class="flex items-center gap-2">
                        <RadioButton v-model="loteForm.tipoProducto" inputId="perecedero_m" name="tipo_m" value="Perecedero" class="p-radiobutton-custom" />
                        <label for="perecedero_m" class="cursor-pointer text-xs text-[#1a2e1f] font-medium">Perecedero</label>
                      </div>
                      <div class="flex items-center gap-2">
                        <RadioButton v-model="loteForm.tipoProducto" inputId="noPerecedero_m" name="tipo_m" value="No perecedero" class="p-radiobutton-custom" />
                        <label for="noPerecedero_m" class="cursor-pointer text-xs text-[#1a2e1f] font-medium">No perecedero</label>
                      </div>
                    </div>
                  </div>

                  <!-- Bonificación Checkbox -->
                  <div class="flex flex-col gap-1.5 py-1">
                    <div class="flex items-center gap-2">
                      <Checkbox v-model="incluyeBonificacion" inputId="bonificacion_m" binary />
                      <label for="bonificacion_m" class="cursor-pointer text-xs font-semibold text-[#1a2e1f]">
                        ¿Incluyó producto adicional gratis?
                      </label>
                    </div>
                    <small class="text-[11px] text-[#6b7280] leading-tight">
                      Marca si recibiste unidades extra de regalo (ej: 10+1 gratis).
                    </small>
                  </div>

                  <!-- Campos Bonificados -->
                  <div v-if="incluyeBonificacion" class="space-y-3 bg-[#f9fafb] border border-[#e2e8dd] rounded-xl p-3">
                    <BaseSelect
                      v-model="loteForm.presentacionBonificada"
                      label="Presentación bonificada"
                      :options="presentacionesLote"
                      optionLabel="nombre"
                      placeholder="Seleccionar presentación"
                      size="sm"
                      class="w-full"
                    />
                    <BaseInputNumber
                      v-model="loteForm.cantidadBonificada"
                      label="Cantidad bonificada"
                      placeholder="0"
                      size="sm"
                      class="w-full font-mono"
                    >
                      <template #help>
                        <small v-if="loteForm.presentacionBonificada && loteForm.cantidadBonificada"
                          class="text-[11px] text-[#2b5e3b] font-medium">
                          = {{ unidadesBonificadas }} {{ loteForm.producto?.unidad_base?.toLowerCase() }} en total
                        </small>
                      </template>
                    </BaseInputNumber>
                  </div>

                  <!-- Datos Lote y Costos -->
                  <BaseInput
                    v-if="loteForm.tipoProducto === 'Perecedero'"
                    v-model="loteForm.numLote"
                    label="Número de lote"
                    placeholder="LOT-001"
                    size="sm"
                    class="w-full font-mono"
                  />

                  <div v-if="loteForm.tipoProducto === 'Perecedero'" class="flex flex-col gap-1.5 w-full">
                    <label class="text-xs font-semibold text-[#1a2e1f]">Fecha de vencimiento</label>
                    <DatePicker v-model="loteForm.fechaVencimientoLote" dateFormat="dd/mm/yy" showIcon
                      iconDisplay="input" class="w-full !bg-white !border-gray-300 text-xs rounded-lg h-10" />
                  </div>

                  <BaseInputNumberMoney
                    v-model="loteForm.costoUnitario"
                    label="Costo unitario (factura) *"
                    placeholder="0.00"
                    size="sm"
                    class="w-full font-mono"
                  />

                  <BaseInputNumberMoney
                    v-model="loteForm.descuentoLinea"
                    label="Descuento en línea <span class='text-[10px] text-gray-400 font-normal'>(opcional)</span>"
                    placeholder="0.00"
                    size="sm"
                    class="w-full font-mono"
                  />

                  <!-- Resumen Cálculos Móvil -->
                  <div v-if="loteForm.presentacionFacturada && loteForm.cantidadFacturada && loteForm.costoUnitario"
                    class="bg-[#f4f7f2] border border-[#dce4d7] rounded-xl p-3.5 space-y-1.5 text-xs">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Subtotal (facturado):</span>
                      <span class="font-semibold text-[#1a2e1f] font-mono">${{ subTotal.toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Total a pagar:</span>
                      <span class="font-semibold text-[#1a2e1f] font-mono">${{ totalPagado.toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Unidades reales bodega:</span>
                      <span class="font-semibold text-[#1a2e1f] font-mono">{{ cantidadInicialLote }} {{ loteForm.producto?.unidad_base?.toLowerCase() }}</span>
                    </div>
                    <div class="flex justify-between border-t border-[#dce4d7] pt-1 mt-1">
                      <span class="text-[#2b5e3b] font-bold">Costo unitario real:</span>
                      <span class="font-bold text-[#2b5e3b] font-mono">${{ costoUnitarioReal.toFixed(4) }}</span>
                    </div>
                  </div>

                  <!-- Botones Lote Móvil -->
                  <div class="flex flex-col gap-2 pt-1">
                    <Button label="Agregar Item" icon="pi pi-plus"
                      class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white border-none h-11 rounded-xl text-sm font-semibold cursor-pointer shadow-xs w-full flex justify-center"
                      @click="agregarItemsATabla" />
                    <Button label="Limpiar Lote" icon="pi pi-refresh"
                      class="!bg-gray-100 hover:!bg-gray-200 !text-[#1a2e1f] !border-gray-300 h-10 rounded-xl text-xs font-semibold cursor-pointer w-full flex justify-center"
                      @click="limpiarCamposLote" />
                  </div>
                </div>

                <!-- ======================================================= -->
                <!-- VISTA ESCRITORIO LOTES (Solo PC: hidden md:block)       -->
                <!-- ======================================================= -->
                <div class="hidden md:block">
                  <div class="flex flex-col gap-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="flex flex-col w-full gap-1.5">
                        <label class="text-[14px] font-medium text-[#1a2e1f]">Nombre del producto</label>
                        <AutoComplete v-model="loteForm.producto" optionLabel="nombre" :suggestions="sugerenciasProductos"
                          @complete="buscarProductoLote" @item-select="alSeleccionarProductoLote"
                          placeholder="Escribe nombre, cód. interno o cód. de barra" class="w-full" fluid >
                          <template #option="{ option }">
                            <span class="text-sm">
                              <span class="font-semibold text-[#1a2e1f]">{{ option.nombre }}</span>
                              <span v-if="option.fabricante" class="text-gray-500"> - {{ option.fabricante }}</span>
                            </span>
                          </template>
                        </AutoComplete>
                      </div>
                      <BaseSelect
                        v-model="loteForm.presentacionFacturada"
                        label="Tipo de presentación que entra"
                        :options="presentacionesLote"
                        optionLabel="nombre"
                        placeholder="Seleccionar presentación"
                        size="md"
                        class="w-[35%]"
                      />
                      <BaseInputNumber
                        v-model="loteForm.cantidadFacturada"
                        :label="`Cantidad facturada ${loteForm.presentacionFacturada ? `(en ${loteForm.presentacionFacturada.nombre})` : ''}`"
                        placeholder="0"
                        size="md"
                        class="w-[35%]"
                      >
                        <template #help>
                          <small v-if="loteForm.presentacionFacturada && loteForm.cantidadFacturada"
                            class="text-[13px] text-[#2b5e3b] font-medium">
                            = {{ unidadesFacturadas }} {{ loteForm.producto?.unidad_base?.toLowerCase() }} en total
                          </small>
                        </template>
                      </BaseInputNumber>
                      <div class="flex flex-col gap-2">
                        <label class="text-[14px] font-medium text-[#1a2e1f]">Tipo del producto</label>
                        <div class="flex gap-6 items-center h-[40px]">
                          <div class="flex items-center gap-2">
                            <RadioButton v-model="loteForm.tipoProducto" inputId="perecedero" name="tipo"
                              value="Perecedero" class="p-radiobutton-custom" />
                            <label for="perecedero" class="cursor-pointer text-[14px] text-[#1a2e1f]">Perecedero</label>
                          </div>
                          <div class="flex items-center gap-2">
                            <RadioButton v-model="loteForm.tipoProducto" inputId="noPerecedero" name="tipo"
                              value="No perecedero" class="p-radiobutton-custom" />
                            <label for="noPerecedero" class="cursor-pointer text-[14px] text-[#1a2e1f]">No perecedero</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col gap-2">
                      <div class="flex items-center gap-2">
                        <Checkbox v-model="incluyeBonificacion" inputId="bonificacion" binary />
                        <label for="bonificacion" class="cursor-pointer text-[14px] font-medium text-[#1a2e1f]">
                          ¿El proveedor incluyó producto adicional sin costo?
                        </label>
                      </div>
                      <small class="text-[13px] text-[#6b7280] font-normal">
                        Marca esta opción si recibiste unidades extra de regalo o bonificación (ej: "compra 10 lleva 1 gratis").
                      </small>
                    </div>

                    <div v-if="incluyeBonificacion"
                      class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f9fafb] border border-[#e2e8dd] rounded-lg p-4">
                      <BaseSelect
                        v-model="loteForm.presentacionBonificada"
                        label="Presentación bonificada"
                        :options="presentacionesLote"
                        optionLabel="nombre"
                        placeholder="Seleccionar presentación"
                        size="md"
                        class="w-full"
                      />
                      <BaseInputNumber
                        v-model="loteForm.cantidadBonificada"
                        :label="`Cantidad bonificada ${loteForm.presentacionBonificada ? `(en ${loteForm.presentacionBonificada.nombre})` : ''}`"
                        placeholder="0"
                        size="md"
                        class="w-full"
                      >
                        <template #help>
                          <small v-if="loteForm.presentacionBonificada && loteForm.cantidadBonificada"
                            class="text-[13px] text-[#2b5e3b] font-medium">
                            = {{ unidadesBonificadas }} {{ loteForm.producto?.unidad_base?.toLowerCase() }} en total
                          </small>
                        </template>
                      </BaseInputNumber>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <BaseInput
                        v-if="loteForm.tipoProducto === 'Perecedero'"
                        v-model="loteForm.numLote"
                        label="Número de lote"
                        placeholder="LOT-001"
                        size="md"
                        class="w-full"
                      />
                      <div v-if="loteForm.tipoProducto === 'Perecedero'" class="flex flex-col gap-1.5">
                        <label class="text-[14px] font-medium text-[#1a2e1f]">Fecha de vencimiento</label>
                        <DatePicker v-model="loteForm.fechaVencimientoLote" dateFormat="dd/mm/yy" showIcon
                          iconDisplay="input" class="w-full bg-[#f9fafb] border-[#d1d5db]" />
                      </div>
                      <BaseInputNumberMoney
                        v-model="loteForm.costoUnitario"
                        label="Costo unitario (factura)"
                        placeholder="0.00"
                        size="md"
                        class="w-[45%]"
                      />
                      <BaseInputNumberMoney
                        v-model="loteForm.descuentoLinea"
                        label="Descuento en línea <span class='text-[11px] font-normal text-gray-400 ml-1'>(opcional)</span>"
                        placeholder="0.00"
                        size="md"
                        class="w-[45%]"
                      />
                    </div>

                    <div v-if="loteForm.presentacionFacturada && loteForm.cantidadFacturada && loteForm.costoUnitario"
                      class="bg-[#eef2e9] border border-[#d1d5db] rounded-lg p-4 flex flex-col gap-1 text-[13px]">
                      <div class="flex justify-between">
                        <span class="text-[#4b5563]">Subtotal (facturado)</span>
                        <span class="font-semibold text-[#1a2e1f]">${{ subTotal.toFixed(2) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-[#4b5563]">Total a pagar (con descuento)</span>
                        <span class="font-semibold text-[#1a2e1f]">${{ totalPagado.toFixed(2) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-[#4b5563]">Unidades reales que entran a bodega</span>
                        <span class="font-semibold text-[#1a2e1f]">{{ cantidadInicialLote }} {{ loteForm.producto?.unidad_base?.toLowerCase() }}</span>
                      </div>
                      <div class="flex justify-between border-t border-[#d1d5db] pt-1 mt-1">
                        <span class="text-[#2b5e3b] font-semibold">Costo unitario real (lote)</span>
                        <span class="font-bold text-[#2b5e3b]">${{ costoUnitarioReal.toFixed(4) }}</span>
                      </div>
                    </div>

                    <div class="flex justify-between items-center mt-2">
                      <Button label="Limpiar Lote" icon="pi pi-refresh"
                        class="bg-[#eef2e9] hover:bg-[#e2e8dd] text-[#1a2e1f] border border-[#d1d5db] px-4 py-3 rounded-lg text-[14px] font-semibold cursor-pointer transition-colors"
                        @click="limpiarCamposLote" />
                      <Button label="Agregar Item" icon="pi pi-plus"
                        class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white border-none px-4 py-3 rounded-lg text-[14px] font-semibold cursor-pointer shadow-sm transition-colors"
                        @click="agregarItemsATabla" />
                    </div>
                  </div>
                </div>

                <!-- TABLA DE ITEMS AGREGADOS -->
                <div class="mt-4 pt-4 border-t border-[#e2e8dd]">
                  <h3 class="text-base font-bold text-[#1a2e1f] mb-3 block">Items Agregados a la Compra</h3>

                  <!-- MÓVIL: Tarjetas Desplegables -->
                  <div class="block md:hidden w-full border border-[#e2e8dd] rounded-xl overflow-hidden shadow-2xs">
                    <DataTable v-model:expandedRows="expandedRows" :value="itemsAgregados" dataKey="producto"
                      class="p-datatable-custom text-xs w-full">
                      <template #empty>
                        <div class="text-center py-6 text-gray-400 text-xs">No hay items agregados aún</div>
                      </template>

                      <Column expander style="width: 2.2rem" />

                      <Column field="producto" header="Producto">
                        <template #body="{ data }">
                          <span class="capitalize block text-xs font-semibold text-[#1a2e1f]">{{ data.producto }}</span>
                          <span class="text-[10px] text-gray-500 block">{{ data.cantFact }}</span>
                        </template>
                      </Column>

                      <Column field="subtotal" header="Subtotal" class="text-right font-bold text-[#2b5e3b]" />

                      <template #expansion="{ data, index }">
                        <div class="p-3 bg-[#f1f5f0] border-y border-[#e2e8dd] text-xs space-y-2">
                          <div class="bg-white p-3 rounded-xl border border-[#e2e8dd] shadow-2xs space-y-2">
                            <div class="flex justify-between items-center pb-1.5 border-b border-gray-100">
                              <span class="text-[10px] uppercase font-bold text-gray-400">Unidades Base</span>
                              <span class="font-mono text-xs font-semibold text-[#334155]">{{ data.cantidad }}</span>
                            </div>
                            <div class="flex justify-between items-center pb-1.5 border-b border-gray-100">
                              <span class="text-[10px] uppercase font-bold text-gray-400">Costo Unit. Real</span>
                              <span class="font-mono text-xs font-semibold text-[#2b5e3b]">{{ data.costoUnit }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                              <span class="text-[10px] uppercase font-bold text-gray-400">Vencimiento</span>
                              <span class="font-mono text-xs text-gray-700">{{ data.vencimiento }}</span>
                            </div>
                          </div>

                          <div class="flex justify-end pt-1">
                            <Button icon="pi pi-trash" label="Eliminar" severity="danger" text size="small"
                              class="!py-1 !px-2.5 !text-xs font-semibold cursor-pointer"
                              @click="eliminarItemDeTabla(index)" />
                          </div>
                        </div>
                      </template>
                    </DataTable>
                  </div>

                  <!-- ESCRITORIO: Tabla Completa -->
                  <div class="hidden md:block bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8dd]">
                    <DataTable :value="itemsAgregados" responsiveLayout="scroll" class="p-datatable-custom text-[14px]">
                      <Column field="producto" header="Producto" />
                      <Column field="cantFact" header="Cant. fact." />
                      <Column field="cantidad" header="Cantidad (unid. base)" />
                      <Column field="costoUnit" header="Costo unit. real" />
                      <Column field="vencimiento" header="Fecha Vencimiento" />
                      <Column field="subtotal" header="Subtotal" class="font-semibold text-[#1a2e1f]" />
                      <Column header="Acción" class="text-center w-[80px]">
                        <template #body="slotProps">
                          <Button icon="pi pi-trash"
                            class="hover:bg-[#fde8e8] border-none text-[#9c2a2a] hover:text-red-600 w-8 h-8 rounded-full p-0 transition-colors"
                            @click="eliminarItemDeTabla(slotProps.index)" />
                        </template>
                      </Column>
                    </DataTable>
                  </div>
                </div>

                <!-- Footer Paso 2 -->
               
                  <!-- Footer Paso 2 -->
                    <div class="mt-6 pt-4 border-t border-[#e2e8dd]">
                      <!-- Vista Móvil -->
                      <div class="flex flex-col-reverse gap-3 block md:hidden">
                        <Button label="Atrás" icon="pi pi-arrow-left"
                          class="!text-sm !py-3 !px-6 !bg-[#eef2e9] !border-[#cbd5e1] !text-[#1a2e1f] rounded-xl hover:!bg-[#e2e8dd] cursor-pointer w-full flex justify-center"
                          @click="activateCallback('1')" />
                        <Button label="Registrar compra" icon="pi pi-save"
                          class="!text-sm !py-3 !px-6 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-md cursor-pointer w-full flex justify-center"
                          @click="registrarCompraFinal" />
                      </div>

                      <!-- Vista Escritorio -->
                      <div class="hidden md:flex justify-between items-center w-full">
                        <Button label="Atrás" icon="pi pi-arrow-left"
                          class="bg-[#eef2e9] hover:bg-[#e2e8dd] text-[#1a2e1f] border border-[#cbd5e1] px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-colors duration-200 cursor-pointer"
                          @click="activateCallback('1')" />
                        <Button label="Registrar compra" icon="pi pi-save"
                          class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white border-none px-6 py-2.5 rounded-xl text-[14px] font-semibold cursor-pointer shadow-md transition-colors duration-200"
                          @click="registrarCompraFinal" />
                      </div>
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
import {
  mostrarExito,
  mostrarError,
  mostrarAccesoDenegado,
  mostrarAlertaConfirmar,
  mostrarCargando,
  manejarAlertaGananciaReducida
} from '@/utils/SweetAlertService'

import { ref, reactive, onMounted, watch, computed } from 'vue'

import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import AutoComplete from 'primevue/autocomplete'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import BaseInput from '@/components/base/BaseInput.vue'
import BaseInputNumber from '@/components/base/BaseInputNumber.vue'
import BaseInputNumberMoney from '@/components/base/BaseInputNumberMoney.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'

const emit = defineEmits(['close'])

const expandedRows = ref({})
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

const limpiarMonto = (valor) => {
  if (valor === null || valor === undefined || valor === '') return null
  const limpio = parseFloat(String(valor).replace(/[^0-9.]/g, ''))
  return isNaN(limpio) ? null : limpio
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
    producto_id: loteForm.producto.id,
    tipo_producto: loteForm.producto.tipo_producto,
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
    mostrarAlertaConfirmar({
      tipo: 'advertencia',
      titulo: 'Campos incompletos',
      mensajeHtml: 'Completa los datos principales del documento de compra.'
    })
    return
  }

  if (itemsAgregados.value.length === 0) {
    mostrarAlertaConfirmar({
      tipo: 'advertencia',
      titulo: 'Sin items',
      mensajeHtml: 'Agrega al menos un lote al detalle de la compra.'
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
    monto_total: limpiarMonto(documentoForm.montoTotal),
    estado_pago: documentoForm.estadoPago,
    fecha_vencimiento_pago: formatearFecha(documentoForm.fechaVencimiento),
    proveedor_id: documentoForm.proveedor.id,

    detalles: itemsAgregados.value.map((item) => {
      const esGranel = item.tipo_producto === 'GRANEL'

      return {
        presentacion_id: item.presentacion_id,
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
          producto_id: esGranel ? item.producto_id : null,
          presentacion_id: esGranel ? null : item.presentacion_id,
        },
      }
    }),
  }

  mostrarCargando('Registrando compra...', 'Guardando documento y procesando entrada de lotes')

  try {
    const [res] = await Promise.all([
      registrarCompra(payload),
      new Promise((resolve) => setTimeout(resolve, 500))
    ])

    if (res.data?.status === 'warning' && res.data?.alertas) {
      await manejarAlertaGananciaReducida(res.data.alertas)
    } else {
      await mostrarExito('¡Compra registrada!', 'La compra y sus lotes fueron guardados con éxito.')
    }

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
    const data = error.response?.data

    if (status === 403) {
      mostrarAccesoDenegado()
    } else if (status === 422 && data?.errors) {
      const mensajes = Object.values(data.errors).flat()
      mostrarError('Error de validación', mensajes[0])
    } else {
      mostrarError('Error', data?.message || 'No se pudo registrar la compra.')
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
.p-datatable-custom .p-datatable-thead>tr>th {
  background-color: #ffffff !important;
  color: #1e3a2f !important;
  border-bottom: 2px solid #e2e8dd !important;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem;
}

.p-datatable-custom .p-datatable-tbody>tr {
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border-bottom: 1px solid #e2e8dd !important;
}

.p-datatable-custom .p-datatable-tbody>tr:hover {
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