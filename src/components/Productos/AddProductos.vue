<template>
  <div class="min-h-screen p-8 font-['Inter',sans-serif] bg-[#eef2e9] text-[#1a2e1f]">

    <!-- TARJETA CONTENEDORA PRINCIPAL (Envuelve ambos pasos) -->
    <div class="rounded-2xl bg-white border border-[#e2e8dd] shadow-sm overflow-hidden mb-6">

      <!-- ENCABEZADO INTEGRADO (Regresar + Título + Stepper Chevron) -->
      <div class="p-8 pb-6 border-b border-[#e2e8dd] bg-[#fbfdf9]">

        <!-- Fila Superior: Botón Regresar + Título -->
        <div class="flex items-center gap-6 mb-6">
          <Button label="Regresar" icon="pi pi-arrow-left"
            class="!text-[18px] !py-3 !px-6 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-[#2b5e3b] !text-white !font-['Inter',sans-serif] rounded-xl shadow-sm cursor-pointer transition-all shrink-0"
            @click="$emit('close')" />

          <div>
            <h1 class="text-[36px] font-semibold text-[#1a2e1f] leading-tight m-0">Nuevo Producto</h1>
            <p class="text-[16px] text-gray-500 mt-1 m-0">
              Completa la información del producto y sus presentaciones de venta
            </p>
          </div>
        </div>

        <!-- Indicador de Pasos Integrado (Chevron Original) -->
        <div class="flex w-full select-none rounded-xl overflow-hidden shadow-sm">
          <div
            class="flex-1 flex items-center justify-center gap-3 py-3.5 pl-8 pr-6 text-white transition-colors cursor-pointer"
            :class="pasoActual === 1 ? 'bg-[#2b5e3b]' : 'bg-[#7fa389]'"
            style="clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%)"
            @click="pasoActual = 1">
            <span class="text-[17px] font-semibold">1.</span>
            <span class="text-[17px] font-medium">Información general</span>
          </div>

          <div
            class="flex-1 flex items-center justify-center gap-3 py-3.5 pl-10 pr-6 text-white transition-colors -ml-5 cursor-pointer"
            :class="pasoActual === 2 ? 'bg-[#2b5e3b]' : 'bg-[#c7d6bd]'" :style="pasoActual === 2 ? '' : 'color:#5b6b57'"
            style="clip-path: polygon(24px 0, 100% 0, 100% 100%, 24px 100%, 0 50%)" @click="irAPaso2">
            <span class="text-[17px] font-semibold">2.</span>
            <span class="text-[17px] font-medium">Presentaciones</span>
          </div>
        </div>

      </div>

      <!-- CUERPO DEL PASO 1: INFORMACIÓN GENERAL -->
      <div v-show="pasoActual === 1" class="p-8">
        <div class="flex items-center gap-3 mb-3 pb-4 border-b border-[#e2e8dd]">
          <div
            class="!w-11 !h-11 rounded-lg bg-[#f4f7f2] border border-[#dce4d7] shadow-sm flex items-center justify-center shrink-0">
            <i class="pi pi-info text-[#2b5e3b] text-2xl font-bold"></i>
          </div>
          <span class="text-[26px] font-semibold text-[#1a2e1f]">Información Principal del Producto</span>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- Nombre -->
          <div class="col-span-2 flex flex-col gap-2">
            <label class="text-[18px] font-medium text-gray-700">
              Nombre del Producto <span class="text-red-500">*</span>
            </label>
            <InputText v-model="nombre" placeholder="Ej: Fertilizante Triple 15"
              class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[18px] !py-[16px] !px-[20px] rounded-xl shadow-sm focus:!border-[#2b5e3b]"
              :class="{ '!border-red-500': errores.nombre }" />
            <small v-if="errores.nombre" class="text-red-500 text-[14px]">{{ errores.nombre }}</small>
          </div>

          <!-- Fabricante -->
          <div class="col-span-2 flex flex-col gap-2">
            <label class="text-[18px] font-medium text-gray-700">
              Fabricante <span class="text-red-500">*</span>
            </label>
            <InputText v-model="fabricante" placeholder="Ej: Fertica, Bayer, etc."
              class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[18px] !py-[16px] !px-[20px] rounded-xl shadow-sm focus:!border-[#2b5e3b]"
              :class="{ '!border-red-500': errores.fabricante }" />
            <small v-if="errores.fabricante" class="text-red-500 text-[14px]">{{ errores.fabricante }}</small>
          </div>

          <!-- Categoría -->
          <div class="flex flex-col gap-2">
            <label class="text-[18px] font-medium text-gray-700">
              Categoría <span class="text-red-500">*</span>
            </label>
            <AutoComplete v-model="categoria" :suggestions="categoriasFiltradas" optionLabel="nombre" dropdown fluid
              placeholder="Buscar categoría..." @complete="buscarCategorias" :pt="{
                root: { class: 'w-full' },
                pcInputText: {
                  root: {
                    class: [
                      '!bg-white !border-gray-300 !text-[#1a2e1f] !text-[18px] !h-[60px] !py-[10px] !px-[20px] rounded-xl shadow-sm focus:!border-[#2b5e3b]',
                      { '!border-red-500': errores.categoria }
                    ]
                  }
                },
                dropdown: { class: '!bg-white !border-gray-300 rounded-r-xl !h-[60px]' }
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

          <!-- Código del Producto -->
          <div class="flex flex-col gap-2">
            <label class="text-[18px] font-medium text-gray-700">Código del Producto</label>
            <div class="relative">
              <InputText v-model="codigoGenerado" readonly
                class="w-full !bg-gray-100 !border-gray-300 !text-[#1a2e1f] !text-[18px] !py-[16px] !px-[20px] rounded-xl shadow-sm !cursor-default font-mono font-semibold" />
              <i class="pi pi-sync absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>
            <small class="text-[14px] text-gray-500">
              Se genera automáticamente al completar Categoría, Nombre y Fabricante.
            </small>
          </div>

          <!-- Tipo de Venta -->
          <div class="flex flex-col gap-2">
            <label class="text-[18px] font-medium text-gray-700">
              Tipo de Venta <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-4 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div class="flex items-center gap-2">
                <RadioButton v-model="tipoProducto" inputId="venta1" name="tipoProducto" value="UNIDAD FIJA" />
                <label for="venta1" class="text-[16px] text-[#1a2e1f] cursor-pointer font-medium">Unidad Fija</label>
              </div>
              <div class="flex items-center gap-2">
                <RadioButton v-model="tipoProducto" inputId="venta2" name="tipoProducto" value="GRANEL" />
                <label for="venta2" class="text-[16px] text-[#1a2e1f] cursor-pointer font-medium">Granel</label>
              </div>
            </div>
            <small v-if="errores.tipoProducto" class="text-red-500 text-[14px]">{{ errores.tipoProducto }}</small>
          </div>

          <!-- Unidad Base -->
          <div class="flex flex-col gap-2">
            <label class="text-[18px] font-medium text-gray-700">
              Unidad Base <span class="text-red-500">*</span>
            </label>
            <Select v-model="unidadMedidaId" :options="unidadesFiltradas" optionLabel="nombre" optionValue="id"
              placeholder="Seleccione una unidad base..." fluid :disabled="presentacionBaseCreada"
              class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !py-[16px] rounded-xl shadow-sm focus:!border-[#2b5e3b]"
              :class="{
                '!border-red-500': errores.unidadMedidaId,
                '!bg-gray-100 !cursor-not-allowed': presentacionBaseCreada
              }" :pt="{ label: { class: '!text-[18px] !text-[#1a2e1f]' } }" />
            <small v-if="errores.unidadMedidaId" class="text-red-500 text-[14px] font-medium">{{ errores.unidadMedidaId }}</small>

            <p v-if="!presentacionBaseCreada"
              class="text-[15px] text-gray-500 mt-1 leading-normal flex items-start gap-1.5">
              <i class="pi pi-info-circle text-blue-500 text-[16px] mt-0.5 shrink-0"></i>
              <span>
                Elige la medida mínima de venta. Si seleccionas <strong class="text-gray-700">Libras</strong>,
                servirá como referencia para tasar y definir la equivalencia de presentaciones grandes como arrobas o
                quintales.
              </span>
            </p>
            <p v-else
              class="text-[15px] text-amber-700 mt-1 leading-normal flex items-start gap-1.5 font-medium bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              <i class="pi pi-lock text-amber-600 text-[16px] mt-0.5 shrink-0"></i>
              <span>
                Unidad base bloqueada. Para modificarla, primero debes eliminar todas las presentaciones creadas.
              </span>
            </p>
          </div>

          <!-- Aplica IVA -->
          <div class="col-span-2 flex items-center gap-3 py-2 mt-2">
            <Checkbox v-model="aplicaIva" :binary="true" inputId="ivaGeneral" class="!w-[22px] !h-[22px]" />
            <label for="ivaGeneral" class="text-[18px] text-[#1a2e1f] cursor-pointer font-medium">
              Aplica IVA 13% <span class="text-gray-500 font-normal">(para todas las presentaciones)</span>
            </label>
          </div>
        </div>

        <!-- Botón Siguiente Paso -->
        <div class="flex justify-end mt-8 pt-4 border-t border-gray-100">
          <Button label="Siguiente Paso" icon="pi pi-arrow-right" iconPos="right"
            class="!text-[18px] !py-3 !px-8 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white !font-['Inter',sans-serif] rounded-xl shadow-md transition-all cursor-pointer"
            @click="irAPaso2" />
        </div>
      </div>

      <!-- CUERPO DEL PASO 2: PRESENTACIONES -->
      <div v-show="pasoActual === 2" class="p-8">

        <!-- CASO 1: GRANEL SIN BASE -->
        <div v-if="tipoProducto === 'GRANEL' && !presentacionBaseCreada" class="mb-8">
          <div class="flex items-center gap-3 mb-3 pb-4 border-b border-[#e2e8dd]">
            <div
              class="!w-11 !h-11 rounded-lg bg-[#f4f7f2] border border-[#dce4d7] shadow-sm flex items-center justify-center shrink-0">
              <i class="pi pi-star-fill text-[#2b5e3b] text-2xl font-bold"></i>
            </div>
            <span class="text-[26px] font-semibold text-[#1a2e1f]">Crear la Presentación Base (Obligatoria)</span>
          </div>

          <div class="bg-blue-50 border-l-4 border-blue-500 p-5 mb-6 rounded-r-xl rounded-l-md shadow-sm">
            <div class="flex items-start">
              <i class="pi pi-info-circle text-blue-500 !text-[22px] mr-3 mt-0.5"></i>
              <div>
                <h3 class="text-[18px] text-gray-800 font-semibold mb-1">¿Qué es la presentación base?</h3>
                <p class="text-[16px] text-gray-600 leading-relaxed">
                  Es la medida más pequeña o suelta que usarás para despachar este producto
                  <strong>a granel o al detalle</strong>.
                </p>
                <p
                  class="text-[15px] text-gray-500 mt-2 leading-relaxed bg-white/60 p-3 rounded-lg border border-blue-100">
                  <span class="font-semibold text-blue-700">Ejemplo práctico:</span>
                  Si controlas el inventario por <strong class="text-gray-800">{{ nombreUnidadBase }}</strong>,
                  esta será tu unidad de partida (equivale a 1). El sistema la usará automáticamente para calcular
                  el costo y stock de presentaciones más grandes (cajas, sacos o paquetes).
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label class="text-[18px] font-medium text-gray-700">
                Nombre de la presentación base <span class="text-red-500">*</span>
              </label>
              <InputText :value="nombreUnidadBase" disabled
                class="w-full !bg-gray-100 !border-gray-300 !text-[#1a2e1f] !text-[18px] !py-[16px] !px-[20px] rounded-xl shadow-sm !cursor-not-allowed" />
              <small class="text-[14px] text-gray-500 flex items-center gap-1">
                <i class="pi pi-lock text-[12px]"></i> Fijo
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[18px] font-medium text-gray-700">Unidad de Medida</label>
              <InputText :value="nombreUnidadBase" disabled
                class="w-full !bg-gray-100 !border-gray-300 !text-[#1a2e1f] !text-[18px] !py-[16px] !px-[20px] rounded-xl shadow-sm !cursor-not-allowed" />
              <small class="text-[14px] text-gray-500 flex items-center gap-1">
                <i class="pi pi-lock text-[12px]"></i> Fijo (es la unidad base del producto)
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[18px] font-medium text-gray-700">Factor de Conversión</label>
              <InputText value="1.000" disabled
                class="w-full !bg-gray-100 !border-gray-300 !text-[#1a2e1f] !text-[18px] !py-[16px] !px-[20px] rounded-xl shadow-sm !cursor-not-allowed font-mono" />
              <small class="text-[14px] text-gray-500 flex items-center gap-1">
                <i class="pi pi-lock text-[12px]"></i> Fijo (la base siempre tiene factor 1)
              </small>
            </div>

            <div class="flex flex-col gap-2 w-full min-w-0">
              <label class="text-[18px] font-medium text-gray-700">
                Stock Mínimo <span class="text-red-500">*</span>
              </label>
              <input v-model="formBase.stockMinimo" type="text" placeholder="0" @input="formBase.stockMinimo = formBase.stockMinimo
                .replace(/[^0-9]/g, '')
                .replace(/^(\d{1,6})\.?.*/, '$1')
                .replace(/^0+/, '')"
                class="!bg-white border border-gray-300 text-[#1a2e1f] text-[18px] py-[16px] px-[20px] rounded-xl shadow-sm w-full focus:outline-none focus:border-[#2b5e3b] transition-colors"
                :class="{ '!border-red-500': errores.stockMinimo }" />
              <small class="text-[14px] text-gray-500">
                Cuando te queden exactamente <strong>{{ formBase.stockMinimo || 0 }} {{ nombreUnidadBase }} </strong> o
                menos, el sistema te avisará que te queda poca mercadería.
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[18px] font-medium text-gray-700">
                Precio de Venta <span class="text-red-500">*</span>
              </label>
              <InputNumber v-model="formBase.precioVenta" fluid placeholder="0.00" :min="0" :minFractionDigits="2"
                :maxFractionDigits="2" mode="currency" currency="USD" locale="es-SV"
                inputClass="!bg-white !border-gray-300 !text-[#1a2e1f] !text-[18px] !py-[16px] !px-[20px] rounded-xl shadow-sm w-full" />
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <label class="text-[18px] font-medium text-gray-700">Código de Barra</label>
                <i class="pi pi-info-circle text-blue-600 hover:text-blue-800 !text-[18px] cursor-help transition-colors"
                  v-tooltip="'Opcional (se puede leer con pistola de barras)'"></i>
              </div>
              <InputText v-model="formBase.codigoBarra" placeholder="Ej: 7501234567890" maxlength="14"
                class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[18px] !py-[16px] !px-[20px] rounded-xl shadow-sm focus:!border-[#2b5e3b]" />
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <Button label="Crear Presentación Base" icon="pi pi-check"
              class="!text-[18px] !py-3 !px-8 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-md cursor-pointer"
              @click="crearBase" />
          </div>
        </div>

        <!-- CASO 2: GRANEL CON BASE -->
        <div v-else-if="tipoProducto === 'GRANEL' && presentacionBaseCreada" class="mb-8">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-[#e2e8dd]">
            <span class="text-[26px] font-semibold text-[#1a2e1f]">➕ Agregar Presentación Derivada</span>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="w-[38%] mt-[20px] flex flex-col gap-2">
              <label class="text-[18px] font-medium text-gray-700">
                Nombre de la presentación <span class="text-red-500">*</span>
              </label>
              <AutoComplete v-model="formDerivada.nombre" :suggestions="unidadesSugeridas" optionLabel="nombre"
                optionValue="nombre" dropdown fluid placeholder="Ej: Arroba, Quintal, Saco..."
                @complete="buscarUnidades" @item-select="onSelectDerivada"
                class="w-full !bg-white !border-gray-300 !text-[18px] !py-[0px] rounded-xl" :pt="{
                  root: { class: 'w-full' },
                  pcInputText: {
                    root: {
                      class: '!bg-white !border-gray-300 !text-[#1a2e1f] !text-[18px] !h-[60px] !py-[10px] !px-[20px] rounded-xl shadow-sm focus:!border-[#2b5e3b]'
                    }
                  },
                  dropdown: { class: '!bg-white !border-gray-300 rounded-r-xl !h-[60px]' }
                }" />
              <p class="text-[15px] text-gray-500 mt-1 leading-normal flex items-start gap-1.5">
                <i class="pi pi-info-circle text-blue-500 text-[16px] mt-0.5 shrink-0"></i>
                <span>
                  Busca en la lista o escribe un nombre nuevo si no existe; el sistema lo creará automáticamente
                  (Ej: <strong class="text-gray-700">Saco de 50 lb</strong>).
                </span>
              </p>
            </div>

            <div class="flex flex-col gap-2 mt-[21px]">
              <label class="text-[18px] font-medium text-gray-700">Unidad de Medida</label>
              <InputText :value="nombreUnidadBase" disabled
                class="w-full !bg-gray-100 !border-gray-300 !text-[#1a2e1f] !text-[18px] !py-[16px] !px-[20px] rounded-xl shadow-sm !cursor-not-allowed" />
              <small class="text-[14px] text-gray-500">🔒 Fija (todas las presentaciones de GRANEL comparten la misma unidad base)</small>
            </div>

            <div class="flex flex-col gap-2 w-full min-w-0">
              <label class="text-[18px] font-medium text-gray-700">
                Contenido de la presentación <span class="text-red-500">*</span>
              </label>
              <div class="flex items-center gap-3 w-full min-w-0">
                <input v-model="formDerivada.factorConversion" type="text" placeholder="0" @input="formDerivada.factorConversion = formDerivada.factorConversion
                  .replace(/[^0-9]/g, '')
                  .replace(/^(\d{1,6}).*/, '$1')"
                  class="!bg-white border border-gray-300 text-[#1a2e1f] text-[18px] py-[16px] px-[20px] rounded-xl shadow-sm w-full focus:outline-none focus:border-[#2b5e3b] transition-colors"
                  :class="{ '!border-red-500': errores.factorConversion }" />
                <span class="text-[18px] font-medium text-green-700 whitespace-nowrap">
                  {{ nombreUnidadBase }}
                </span>
              </div>
              <small class="text-[14px] text-gray-500">
                Indica cuántas <strong>{{ nombreUnidadBase }}</strong> trae este empaque.<br>
                Si tu base es Libra y vendes una Arroba, aquí debes poner 25.
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[18px] font-medium text-gray-700">
                Precio de Venta <span class="text-red-500">*</span>
              </label>
              <InputNumber v-model="formDerivada.precioVenta" fluid placeholder="0.00" :min="0" :minFractionDigits="2"
                :maxFractionDigits="2" mode="currency" currency="USD" locale="es-SV"
                inputClass="!bg-white !border-gray-300 !text-[#1a2e1f] !text-[18px] !py-[16px] !px-[20px] rounded-xl shadow-sm w-full" />
            </div>

            <div class="bg-[#f4f9f5] border border-[#e3efe6] rounded-xl p-4 mt-[0px]">
              <div class="flex items-start gap-3">
                <i class="pi pi-info-circle text-[#2b5e3b] text-xl mt-0.5"></i>
                <div class="text-[14px] text-[#1a2e1f] leading-relaxed">
                  <span class="font-semibold text-[#1a2e1f] block mb-1">Reglas de la presentación derivada:</span>
                  <ul class="list-disc pl-4 space-y-1 text-[#223d29]">
                    <li>No requiere <strong>código de barras</strong> (solo la presentación base).</li>
                    <li>No maneja <strong>stock mínimo propio</strong> (se controla desde la base).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <Button label="Cancelar" icon="pi pi-times"
              class="!text-[18px] !py-3 !px-8 !bg-gray-100 hover:!bg-gray-200 !border-gray-300 !text-[#1a2e1f] rounded-xl cursor-pointer"
              @click="limpiarFormularioDerivada" />
            <Button label="Agregar" icon="pi pi-plus"
              class="!text-[18px] !py-3 !px-8 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-md cursor-pointer"
              @click="agregarDerivada" />
          </div>
        </div>

        <!-- CASO 3: UNIDAD FIJA -->
        <div v-else-if="tipoProducto === 'UNIDAD FIJA'" class="mb-8">
          <div class="flex items-center gap-3 mb-3 pb-4 border-b border-[#e2e8dd]">
            <div
              class="!w-11 !h-11 rounded-lg bg-[#f4f7f2] border border-[#dce4d7] shadow-sm flex items-center justify-center shrink-0">
              <i class="pi pi-plus text-[#2b5e3b] text-2xl font-bold"></i>
            </div>
            <span class="text-[26px] font-semibold text-[#1a2e1f]">Agregar Presentación</span>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="col-span-2 flex gap-6 w-full">
              <div class="w-[65%] flex flex-col gap-2 mt-[1.5%]">
                <label class="text-[18px] font-medium text-gray-700">
                  Nombre de la presentación <span class="text-red-500">*</span>
                </label>
                <AutoComplete v-model="formUnidadFija.nombre" :suggestions="unidadesSugeridas" optionLabel="nombre"
                  optionValue="nombre" dropdown fluid
                  placeholder="Buscar o escribir unidad (ej. Botella 1L, Martillo)..." @complete="buscarUnidades"
                  @item-select="onSelectUnidadFija"
                  class="w-full !bg-white !border-gray-300 !text-[18px] !py-[0px] rounded-xl" :pt="{
                    root: { class: 'w-full' },
                    pcInputText: {
                      root: {
                        class: '!bg-white !border-gray-300 !text-[#1a2e1f] !text-[18px] !h-[60px] !py-[10px] !px-[20px] rounded-xl shadow-sm focus:!border-[#2b5e3b]'
                      }
                    },
                    dropdown: { class: '!bg-white !border-gray-300 rounded-r-xl !h-[60px]' }
                  }" />
                <p class="text-[15px] text-gray-500 mt-1 leading-normal flex items-start gap-1.5">
                  <i class="pi pi-info-circle text-blue-500 text-[16px] mt-0.5 shrink-0"></i>
                  <span>
                    Busca en la lista o escribe un nombre nuevo si no existe; el sistema lo creará automáticamente
                    (Ej: <strong class="text-gray-700">Saco de 50 lb</strong>).
                  </span>
                </p>
              </div>

              <div class="w-[35%] flex flex-col gap-2 mt-[18px]">
                <label class="text-[18px] font-medium text-gray-700">Factor de Conversión</label>
                <InputText value="1.000" disabled
                  class="w-full !bg-gray-100 !border-gray-300 !text-[#1a2e1f] !text-[18px] !py-[16px] !px-[20px] rounded-xl shadow-sm !cursor-not-allowed font-mono" />
                <small class="text-[14px] text-gray-500">🔒 Fijo (unidades fijas no se convierten).</small>
              </div>
            </div>

            <div class="flex flex-col gap-2 mt-[2%]">
              <label class="text-[18px] font-medium text-gray-700">
                Stock Mínimo <span class="text-red-500">*</span>
              </label>
              <input v-model="formUnidadFija.stockMinimo" type="text" placeholder="0" @input="formUnidadFija.stockMinimo = formUnidadFija.stockMinimo
                .replace(/[^0-9]/g, '')
                .replace(/^(\d{1,6}).*/, '$1')"
                class="!bg-white border border-gray-300 text-[#1a2e1f] text-[18px] py-[16px] px-[20px] rounded-xl shadow-sm w-full focus:outline-none focus:border-[#2b5e3b] transition-colors"
                :class="{ '!border-red-500': errores.stockMinimo }" />
              <small class="text-[14px] text-gray-500">
                Cuando te queden exactamente <strong>{{ formUnidadFija.stockMinimo || 0 }} {{ nombreUnidadBase }}
                </strong> o menos, el sistema te avisará que te queda poca mercadería.
              </small>
            </div>

            <div class="flex flex-col gap-2 mt-[2%]">
              <label class="text-[18px] font-medium text-gray-700">
                Precio de Venta <span class="text-red-500">*</span>
              </label>
              <InputNumber v-model="formUnidadFija.precioVenta" fluid placeholder="0.00" :min="0" :minFractionDigits="2"
                :maxFractionDigits="2" mode="currency" currency="USD" locale="es-SV"
                inputClass="!bg-white !border-gray-300 !text-[#1a2e1f] !text-[18px] !py-[16px] !px-[20px] rounded-xl shadow-sm w-full" />
            </div>

            <div class="flex flex-col gap-2 mt-[2%]">
              <div class="flex items-center gap-2">
                <label class="text-[18px] font-medium text-gray-700">Código de Barra</label>
                <i class="pi pi-info-circle text-blue-600 hover:text-blue-800 !text-[22px] cursor-help transition-all duration-200"
                  v-tooltip="'Opcional (se puede leer con pistola de barras).'"></i>
              </div>
              <InputText v-model="formUnidadFija.codigoBarra" placeholder="Ej: 7501234567890" maxlength="14"
                class="w-full !bg-white !border-gray-300 !text-[#1a2e1f] !text-[18px] !py-[16px] !px-[20px] rounded-xl shadow-sm focus:!border-[#2b5e3b]" />
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <Button label="Cancelar" icon="pi pi-times"
              class="!text-[18px] !py-3 !px-8 !bg-gray-100 hover:!bg-gray-200 !border-gray-300 !text-[#1a2e1f] rounded-xl cursor-pointer"
              @click="limpiarFormularioUnidadFija" />
            <Button label="Agregar" icon="pi pi-plus"
              class="!text-[18px] !py-3 !px-8 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-md cursor-pointer"
              @click="agregarUnidadFija" />
          </div>
        </div>

        <!-- TABLA DE PRESENTACIONES AGREGADAS -->
        <div class="mt-8 pt-6 border-t border-[#e2e8dd]">
          <div class="flex items-center gap-3 mb-3 pb-4 border-b border-[#e2e8dd]">
            <div
              class="!w-11 !h-11 rounded-lg bg-[#f4f7f2] border border-[#dce4d7] shadow-sm flex items-center justify-center shrink-0">
              <i class="pi pi-list text-[#2b5e3b] text-2xl font-bold"></i>
            </div>
            <span class="text-[26px] font-semibold text-[#1a2e1f]">Presentaciones Agregadas</span>
          </div>

          <DataTable :value="presentaciones" :paginator="presentaciones.length > 5" :rows="5"
            class="font-['Inter',sans-serif] text-[16px]" emptyMessage="No hay presentaciones agregadas aún">

            <Column field="nombre" header="Nombre" class="!text-[16px]" />
            <Column field="codigoBarra" header="Código Barra" class="!text-[16px]">
              <template #body="{ data }">{{ data.codigoBarra || '—' }}</template>
            </Column>
            <Column field="equivalencia" header="Equivalencia" class="!text-[16px]" />
            <Column field="unidadBase" header="Unidad Base" class="!text-[16px]">
              <template #body="{ data }">{{ data.unidadBase || nombreUnidadBase || '—' }}</template>
            </Column>
            <Column field="stock_minimo" header="Stock Mínimo" class="!text-[16px]">
              <template #body="{ data }">{{ data.stock_minimo !== undefined ? data.stock_minimo : '—' }}</template>
            </Column>
            <Column header="Base" class="!text-[16px] text-center">
              <template #body="{ data, index }">
                <Checkbox v-if="tipoProducto === 'GRANEL' && presentaciones.length > 1" v-model="data.es_base"
                  :disabled="!puedeEditarBase" @change="onCambiarBase(data, index)" :binary="true" />
                <Tag v-else-if="data.es_base" value="Base" severity="success" rounded class="text-xs" />
                <span v-else class="text-gray-300">—</span>
              </template>
            </Column>
            <Column field="precioSinIva" header="Precio (S/IVA)" class="!text-[16px]">
              <template #body="{ data }">{{ formatCurrency(data.precioSinIva) }}</template>
            </Column>
            <Column field="ivaAplicado" header="IVA" class="!text-[16px]">
              <template #body="{ data }">{{ formatCurrency(data.ivaAplicado) }}</template>
            </Column>
            <Column field="precioConIva" header="Precio (C/IVA)" class="!text-[16px]">
              <template #body="{ data }">{{ formatCurrency(data.precioConIva) }}</template>
            </Column>
            <Column header="Acciones" class="!text-[16px]">
              <template #body="{ index }">
                <div class="flex gap-2">
                  <Button icon="pi pi-pencil" severity="secondary" text rounded size="small"
                    @click="editarPresentacion(index)" />
                  <Button icon="pi pi-trash" severity="danger" text rounded @click="eliminarPresentacion(index)" />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Botones Inferiores de Navegación del Paso 2 -->
        <div class="flex justify-between mt-8 pt-6 border-t border-[#e2e8dd]">
          <Button label="Atrás" icon="pi pi-arrow-left"
            class="!text-[18px] !py-3 !px-8 !bg-[#eef2e9] !border-[#e2e8dd] !text-[#1a2e1f] rounded-xl hover:!bg-[#e2e8dd] cursor-pointer"
            @click="pasoActual = 1" />
          <Button label="Guardar Producto" icon="pi pi-save" :loading="guardando"
            class="!text-[22px] !py-3 !px-8 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-md cursor-pointer"
            @click="guardarProducto" />
        </div>

      </div>

    </div>

  </div>

  <AddCategoriaDialog v-model:visible="mostrarModalCategoria" @categoria-creada="actualizarCategorias" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'
import AutoComplete from 'primevue/autocomplete'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Swal from 'sweetalert2'
import AddCategoriaDialog from '@/components/Categorias/AddCategoriaDialog.vue'
import { useproductoStore } from '@/stores/productoStore'
import { getUnidades } from '@/services/productoService'

const emit = defineEmits(['close'])
const store = useproductoStore()

const DRAFT_KEY = 'agroferreteria_borrador_nuevo_producto'

const nombre = ref('')
const fabricante = ref('')
const categoria = ref(null)
const categoriasFiltradas = ref([])
const textoBusquedaCategoria = ref('')
const mostrarModalCategoria = ref(false)
const unidadMedidaId = ref(null)
const unidades = ref([])
const unidadesSugeridas = ref([])
const tipoProducto = ref(null)
const aplicaIva = ref(false)
const guardando = ref(false)
const errores = ref({ nombre: '', fabricante: '', categoria: '', unidadMedidaId: '', tipoProducto: '', stockMinimo: '', factorConversion: '' })

const pasoActual = ref(1)
const presentaciones = ref([])

const formBase = ref({
  nombre: '',
  stockMinimo: null,
  precioVenta: null,
  codigoBarra: '',
})

const formDerivada = ref({
  nombre: '',
  factorConversion: null,
  precioVenta: null,
})

const formUnidadFija = ref({
  nombre: '',
  stockMinimo: null,
  precioVenta: null,
  codigoBarra: '',
})

const presentacionBaseCreada = computed(() => {
  return presentaciones.value.some(p => p.es_base === true)
})

const puedeEditarBase = computed(() => {
  if (tipoProducto.value !== 'GRANEL') return true
  return presentaciones.value.length <= 1
})

const nombreUnidadBase = computed(() => {
  const unidad = unidades.value.find(u => u.id === unidadMedidaId.value)
  return unidad?.nombre || ''
})

// Unidades mínimas para seleccionar como Unidad Base en el Paso 1
const unidadesFiltradas = computed(() => {
  if (!tipoProducto.value) return unidades.value
  
  const unidadesBasesPermitidas = tipoProducto.value === 'GRANEL'
    ? [
      'Gramo',
      'Libra',
      'Kilogramo',
      'Mililitro',
      'Litro',
      'Galón',
      'Centímetro',
      'Metro'
    ]
    : ['Unidad', 'Pieza']

  return unidades.value.filter((u) => {
    const magnitudCorrecta = u.magnitud === (tipoProducto.value === 'GRANEL' ? 'Masa' : 'Unidad') || u.magnitud === 'Volumen' || u.magnitud === 'Longitud'
    if (!magnitudCorrecta) return false
    return unidadesBasesPermitidas.includes(u.nombre)
  })
})

const codigoGenerado = computed(() => {
  const catNombre = categoria.value?.nombre || ''
  const proNombre = nombre.value || ''
  const fabNombre = fabricante.value || ''
  if (!catNombre || !proNombre || !fabricante.value) return ''
  return tresPrimeras(catNombre) + tresPrimeras(proNombre) + tresPrimeras(fabNombre)
})

function guardarBorrador() {
  const borrador = {
    pasoActual: pasoActual.value,
    nombre: nombre.value,
    fabricante: fabricante.value,
    categoria: categoria.value,
    unidadMedidaId: unidadMedidaId.value,
    tipoProducto: tipoProducto.value,
    aplicaIva: aplicaIva.value,
    presentaciones: presentaciones.value,
  }
  localStorage.setItem(DRAFT_KEY, JSON.stringify(borrador))
}

function restaurarBorrador() {
  const guardado = localStorage.getItem(DRAFT_KEY)
  if (!guardado) return
  try {
    const borrador = JSON.parse(guardado)
    pasoActual.value = borrador.pasoActual ?? 1
    nombre.value = borrador.nombre ?? ''
    fabricante.value = borrador.fabricante ?? ''
    categoria.value = borrador.categoria ?? null
    unidadMedidaId.value = borrador.unidadMedidaId ?? null
    tipoProducto.value = borrador.tipoProducto ?? null
    aplicaIva.value = borrador.aplicaIva ?? false
    presentaciones.value = borrador.presentaciones ?? []
  } catch {
    localStorage.removeItem(DRAFT_KEY)
  }
}

function limpiarBorrador() {
  localStorage.removeItem(DRAFT_KEY)
}

watch(aplicaIva, (nuevoValor) => {
  presentaciones.value.forEach(p => {
    const sinIva = p.precioSinIva || 0
    if (nuevoValor) {
      const iva = Number((sinIva * 0.13).toFixed(2))
      p.ivaAplicado = iva
      p.precioConIva = Number((sinIva + iva).toFixed(2))
    } else {
      p.ivaAplicado = 0
      p.precioConIva = Number(sinIva.toFixed(2))
    }
  })
})

watch(nombreUnidadBase, (nuevoValor) => {
  if (tipoProducto.value === 'GRANEL' && !presentacionBaseCreada.value) {
    formBase.value.nombre = nuevoValor
  }
}, { immediate: true })

watch(
  [pasoActual, nombre, fabricante, categoria, unidadMedidaId, tipoProducto, aplicaIva, presentaciones],
  guardarBorrador,
  { deep: true }
)

watch(tipoProducto, () => {
  if (unidadMedidaId.value) {
    const esValida = unidadesFiltradas.value.some(u => u.id === unidadMedidaId.value)
    if (!esValida) {
      unidadMedidaId.value = null
    }
  }
})

watch(() => formBase.value.codigoBarra, (nuevoValor) => {
  if (nuevoValor) {
    formBase.value.codigoBarra = nuevoValor
      .trim()
      .replace(/[^0-9]/g, '')
      .slice(0, 14)
  }
})

watch(() => formUnidadFija.value.codigoBarra, (nuevoValor) => {
  if (nuevoValor) {
    formUnidadFija.value.codigoBarra = nuevoValor
      .trim()
      .replace(/[^0-9]/g, '')
      .slice(0, 14)
  }
})

function limpiarTexto(texto = '') {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

function tresPrimeras(texto = '') {
  return limpiarTexto(texto).substring(0, 3)
}

function normalizarNombre(nombre) {
  const limpio = String(nombre || '').trim()
  if (!limpio) return ''
  return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase()
}

function nombreYaExiste(nombre, excludeId = null) {
  const nombreNormalizado = normalizarNombre(nombre).toLowerCase().replace(/\s+/g, ' ')
  return presentaciones.value.some(p => {
    if (excludeId && p.id === excludeId) return false
    const pNormalizado = (p.nombre || '').toLowerCase().replace(/\s+/g, ' ')
    return pNormalizado === nombreNormalizado
  })
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value || 0)
}

async function cargarUnidades() {
  try {
    const response = await getUnidades()
    unidades.value = response.data.data
  } catch (error) {
    console.error('Error al cargar unidades:', error)
  }
}

// Filtro estricto por magnitud compatible
function buscarUnidades(event) {
  const query = event.query?.toLowerCase() || ''
  
  const unidadBaseActual = unidades.value.find(u => u.id === unidadMedidaId.value)
  const magnitudBase = unidadBaseActual?.magnitud

  // Solo se admiten unidades pertenecientes a la misma magnitud
  const listaOpciones = unidades.value.filter(u => {
    if (!magnitudBase) return true
    return u.magnitud === magnitudBase
  })

  if (!query.trim()) {
    unidadesSugeridas.value = listaOpciones.slice(0, 10)
    return
  }
  
  unidadesSugeridas.value = listaOpciones.filter(u =>
    u.nombre.toLowerCase().includes(query)
  )
}

function buscarCategorias(event) {
  textoBusquedaCategoria.value = event.query
  if (!event.query.trim()) {
    categoriasFiltradas.value = [...store.categorias]
    return
  }
  categoriasFiltradas.value = store.categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(event.query.toLowerCase())
  )
}

function abrirModalCategoria() {
  mostrarModalCategoria.value = true
}

async function actualizarCategorias() {
  await store.cargarCategorias()
}

function irAPaso2() {
  errores.value = { nombre: '', fabricante: '', categoria: '', unidadMedidaId: '', tipoProducto: '', stockMinimo: '', factorConversion: '' }
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
  if (!unidadMedidaId.value) {
    errores.value.unidadMedidaId = 'Seleccione una unidad base.'
    hayErrores = true
  }
  if (!tipoProducto.value) {
    errores.value.tipoProducto = 'Seleccione el tipo de venta.'
    hayErrores = true
  }

  if (hayErrores) return
  pasoActual.value = 2
}

function limpiarFormularioDerivada() {
  formDerivada.value = { nombre: '', factorConversion: null, precioVenta: null }
}

function limpiarFormularioUnidadFija() {
  formUnidadFija.value = { nombre: '', stockMinimo: null, precioVenta: null, codigoBarra: '' }
}

function onSelectDerivada(event) {
  const item = event.value
  const nombreSeleccionado = typeof item === 'object' ? item.nombre : item
  formDerivada.value.nombre = nombreSeleccionado

  if (nombreUnidadBase.value.toLowerCase() === 'libra') {
    if (nombreSeleccionado.toLowerCase() === 'arroba') {
      formDerivada.value.factorConversion = 25
    } else if (nombreSeleccionado.toLowerCase() === 'quintal') {
      formDerivada.value.factorConversion = 100
    }
  }
}

function onSelectUnidadFija(event) {
  const item = event.value
  formUnidadFija.value.nombre = typeof item === 'object' ? item.nombre : item
}

function crearBase() {
  const nombreBase = normalizarNombre(nombreUnidadBase.value)
  if (!nombreBase) {
    Swal.fire({ icon: 'warning', title: 'Unidad base requerida', text: 'Debes seleccionar una unidad base en el paso 1.', confirmButtonColor: '#2b5e3b' })
    return
  }

  if (!formBase.value.codigoBarra || formBase.value.codigoBarra.trim() === '') {
    Swal.fire({ icon: 'warning', title: 'Código de barra requerido', text: 'La presentación base debe tener un código de barra.', confirmButtonColor: '#2b5e3b' })
    return
  }

  if (nombreYaExiste(nombreBase)) {
    Swal.fire({ icon: 'warning', title: 'Nombre duplicado', text: `La presentación "${nombreBase}" ya existe.`, confirmButtonColor: '#2b5e3b' })
    return
  }

  if (!formBase.value.stockMinimo || formBase.value.stockMinimo <= 0) {
    Swal.fire({ icon: 'warning', title: 'Stock mínimo requerido', text: 'Define un stock mínimo mayor a 0.', confirmButtonColor: '#2b5e3b' })
    return
  }

  if (!formBase.value.precioVenta || formBase.value.precioVenta <= 0) {
    Swal.fire({ icon: 'warning', title: 'Precio requerido', text: 'Define un precio de venta válido.', confirmButtonColor: '#2b5e3b' })
    return
  }

  const sinIva = Number(formBase.value.precioVenta)
  const iva = aplicaIva.value ? Number((sinIva * 0.13).toFixed(2)) : 0
  const conIva = aplicaIva.value ? Number((sinIva + iva).toFixed(2)) : sinIva

  presentaciones.value.push({
    nombre: nombreBase,
    codigoBarra: formBase.value.codigoBarra,
    equivalencia: 1,
    unidadBase: nombreUnidadBase.value,
    aplicaIva: aplicaIva.value,
    precioSinIva: sinIva,
    ivaAplicado: iva,
    precioConIva: conIva,
    es_base: true,
    stock_minimo: Number(formBase.value.stockMinimo),
  })

  formBase.value = { nombre: '', stockMinimo: null, precioVenta: null, codigoBarra: '' }
  Swal.fire({ icon: 'success', title: `¡Presentación Base "${nombreBase}" creada!`, text: 'Ahora puedes agregar presentaciones derivadas.', timer: 1500, showConfirmButton: false })
}

function agregarDerivada() {
  const nombre = normalizarNombre(formDerivada.value.nombre)
  if (!nombre) {
    Swal.fire({ icon: 'warning', title: 'Nombre requerido', text: 'Ingresa un nombre para la presentación.', confirmButtonColor: '#2b5e3b' })
    return
  }

  if (nombreYaExiste(nombre)) {
    Swal.fire({ icon: 'warning', title: 'Nombre duplicado', text: `La presentación "${nombre}" ya existe.`, confirmButtonColor: '#2b5e3b' })
    return
  }

  const factor = Number(formDerivada.value.factorConversion)
  if (!factor || factor <= 0) {
    Swal.fire({ icon: 'warning', title: 'Factor inválido', text: 'Ingresa un factor de conversión mayor a 0.', confirmButtonColor: '#2b5e3b' })
    return
  }

  if (!formDerivada.value.precioVenta || formDerivada.value.precioVenta <= 0) {
    Swal.fire({ icon: 'warning', title: 'Precio requerido', text: 'Define un precio de venta válido.', confirmButtonColor: '#2b5e3b' })
    return
  }

  const sinIva = Number(formDerivada.value.precioVenta)
  const iva = aplicaIva.value ? Number((sinIva * 0.13).toFixed(2)) : 0
  const conIva = aplicaIva.value ? Number((sinIva + iva).toFixed(2)) : sinIva

  presentaciones.value.push({
    nombre: nombre,
    equivalencia: factor,
    unidadBase: nombreUnidadBase.value,
    aplicaIva: aplicaIva.value,
    precioSinIva: sinIva,
    ivaAplicado: iva,
    precioConIva: conIva,
    es_base: false,
    stock_minimo: 0,
  })

  limpiarFormularioDerivada()
  Swal.fire({ icon: 'success', title: `¡Presentación "${nombre}" agregada!`, timer: 1500, showConfirmButton: false })
}

function agregarUnidadFija() {
  const nombre = normalizarNombre(formUnidadFija.value.nombre)
  if (!nombre) {
    Swal.fire({ icon: 'warning', title: 'Nombre requerido', text: 'Ingresa un nombre para la presentación.', confirmButtonColor: '#2b5e3b' })
    return
  }

  if (nombreYaExiste(nombre)) {
    Swal.fire({ icon: 'warning', title: 'Nombre duplicado', text: `La presentación "${nombre}" ya existe.`, confirmButtonColor: '#2b5e3b' })
    return
  }

  if (!formUnidadFija.value.stockMinimo || formUnidadFija.value.stockMinimo <= 0) {
    Swal.fire({ icon: 'warning', title: 'Stock mínimo requerido', text: 'Define un stock mínimo mayor a 0.', confirmButtonColor: '#2b5e3b' })
    return
  }

  if (!formUnidadFija.value.precioVenta || formUnidadFija.value.precioVenta <= 0) {
    Swal.fire({ icon: 'warning', title: 'Precio requerido', text: 'Define un precio de venta válido.', confirmButtonColor: '#2b5e3b' })
    return
  }

  const sinIva = Number(formUnidadFija.value.precioVenta)
  const iva = aplicaIva.value ? Number((sinIva * 0.13).toFixed(2)) : 0
  const conIva = aplicaIva.value ? Number((sinIva + iva).toFixed(2)) : sinIva

  presentaciones.value.push({
    nombre: nombre,
    codigoBarra: formUnidadFija.value.codigoBarra || '',
    equivalencia: 1,
    unidadBase: nombreUnidadBase.value,
    aplicaIva: aplicaIva.value,
    precioSinIva: sinIva,
    ivaAplicado: iva,
    precioConIva: conIva,
    es_base: false,
    stock_minimo: Number(formUnidadFija.value.stockMinimo),
  })

  limpiarFormularioUnidadFija()
  Swal.fire({ icon: 'success', title: `¡Presentación "${nombre}" agregada!`, timer: 1500, showConfirmButton: false })
}

function editarPresentacion(index) {
  Swal.fire({ icon: 'info', title: 'Editar presentación', text: `Funcionalidad en desarrollo. Índice: ${index}`, confirmButtonColor: '#2b5e3b' })
}

async function eliminarPresentacion(index) {
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

async function guardarProducto() {
  errores.value = { nombre: '', fabricante: '', categoria: '', unidadMedidaId: '', tipoProducto: '', stockMinimo: '', factorConversion: '' }
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
  if (!unidadMedidaId.value) {
    errores.value.unidadMedidaId = 'Seleccione una unidad base.'
    hayErrores = true
  }
  if (!tipoProducto.value) {
    errores.value.tipoProducto = 'Seleccione el tipo de venta.'
    hayErrores = true
  }

  if (hayErrores) return

  if (presentaciones.value.length === 0) {
    Swal.fire({ icon: 'warning', title: 'Sin presentaciones', text: 'Debe agregar al menos una presentación.', confirmButtonColor: '#2b5e3b' })
    return
  }

  const payload = {
    codigo: codigoGenerado.value.toLowerCase(),
    nombre: nombre.value.trim().toLowerCase(),
    fabricante: fabricante.value.trim().toLowerCase(),
    tipo_producto: tipoProducto.value,
    unidad_medida_id: unidadMedidaId.value,
    aplica_iva: aplicaIva.value,
    categoria_id: categoria.value.id,
    presentaciones: presentaciones.value.map((p) => ({
      nombre: p.nombre.toLowerCase(),
      fabricante: p.fabricante?.toLowerCase() || '',
      factor_conversion: p.equivalencia,
      precio_venta: p.precioConIva,
      codigos_barra: p.codigoBarra ? [{ codigo: p.codigoBarra }] : [],
      es_base: p.es_base || false,
      stock_minimo: p.stock_minimo || 0,
      unidad_medida_id: unidadMedidaId.value,
    })),
  }

  guardando.value = true
  const resultado = await store.crearProducto(payload)
  guardando.value = false

  if (resultado.ok) {
    resetFormularioCompleto()
    await Swal.fire({ icon: 'success', title: '¡Producto guardado!', text: 'El producto fue guardado con éxito.', confirmButtonColor: '#2b5e3b', confirmButtonText: 'Aceptar' })
    emit('close')
  } else if (resultado.status === 403) {
    Swal.fire({
      html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
          <div style="width:56px; height:56px; border-radius:50%; background:#fee2e2; display:flex; align-items:center; justify-content:center;">
            <i class="pi pi-ban" style="font-size:24px; color:#b91c1c;"></i>
          </div>
          <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">Sin autorización</h3>
          <p style="font-size:14px; color:#6b7280; margin:0;">No tiene permisos para crear productos.</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonColor: '#2b5e3b',
      confirmButtonText: 'Entendido',
      customClass: { confirmButton: '!rounded-lg !font-semibold !text-sm', popup: '!rounded-2xl' },
    })
  } else if (resultado.error) {
    Swal.fire({ icon: 'error', title: 'Error de validación', text: resultado.error, confirmButtonColor: '#2b5e3b' })
  }
}

function resetFormularioCompleto() {
  nombre.value = ''
  fabricante.value = ''
  categoria.value = null
  unidadMedidaId.value = null
  tipoProducto.value = null
  aplicaIva.value = false
  presentaciones.value = []
  errores.value = { nombre: '', fabricante: '', categoria: '', unidadMedidaId: '', tipoProducto: '', stockMinimo: '', factorConversion: '' }
  limpiarFormularioDerivada()
  limpiarFormularioUnidadFija()
  pasoActual.value = 1
  limpiarBorrador()
}

onMounted(async () => {
  const resultado = await store.cargarCategorias()
  if (resultado?.error) {
    Swal.fire({ icon: 'error', title: 'Error', text: resultado.error, confirmButtonColor: '#2b5e3b' })
  }
  await cargarUnidades()
  restaurarBorrador()
})
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