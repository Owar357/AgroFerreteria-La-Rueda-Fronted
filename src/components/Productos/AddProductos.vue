<template>
  <div class="min-h-screen p-3 sm:p-6 md:p-8 font-['Inter',sans-serif] bg-[#eef2e9] text-[#1a2e1f]">
    <div class="rounded-2xl bg-white border border-[#e2e8dd] shadow-sm overflow-hidden mb-6">

        <!-- CABECERA + STEPPER -->
        <div class="p-4 sm:px-8 sm:pt-6 sm:pb-4 border-b border-[#e2e8dd] bg-[#fbfdf9]">

         <!-- ======================================================= -->
         <!-- VISTA MÓVIL CABECERA (Solo Teléfono)                    -->
         <!-- ======================================================= -->
          <div class="block sm:hidden mb-5">
            <Button label="Regresar" icon="pi pi-arrow-left"
              class="!text-sm !py-2.5 !px-4 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-[#2b5e3b] !text-white !font-['Inter',sans-serif] rounded-xl cursor-pointer transition-all w-full flex justify-center mb-3"
              @click="$emit('close')" />

            <div>
              <h1 class="text-xl font-semibold text-[#1a2e1f] leading-tight m-0">
                Nuevo Producto
              </h1>
              <p class="text-xs text-gray-500 mt-1 m-0">
                Completa la información del producto y sus presentaciones de venta
              </p>
            </div>
          </div>

        <!-- ======================================================= -->
        <!-- VISTA ESCRITORIO CABECERA (Solo PC con tu estilo fixed) -->
        <!-- ======================================================= -->
        <div class="hidden sm:flex sm:items-center gap-5 mb-4">
          <Button label="Regresar" icon="pi pi-arrow-left"
            style="min-width: 15.5rem; height: 3.5rem; align-self: center"
            class="!text-base !py-3 !px-8 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-[#2b5e3b] !text-white !font-['Inter',sans-serif] rounded-xl cursor-pointer transition-all flex justify-center shrink-0"
            @click="$emit('close')" />

          <div>
            <h1 class="text-3xl md:text-4xl font-semibold text-[#1a2e1f] leading-tight m-0">
              Nuevo Producto
            </h1>
            <p class="text-base text-gray-500 mt-1 m-0">
              Completa la información del producto y sus presentaciones de venta
            </p>
          </div>
        </div>
        <!-- STEPPER MÓVIL (pestañas simples) -->
        <div class="flex sm:hidden w-full gap-2 p-1 bg-[#edf2ea] rounded-xl">
          <button type="button"
            class="flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="pasoActual === 1 ? 'bg-[#2b5e3b] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'"
            @click="pasoActual = 1">
            <span class="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[12px]">1</span>
            <span>Info General</span>
          </button>

          <button type="button"
            class="flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="pasoActual === 2 ? 'bg-[#2b5e3b] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'"
            @click="irAPaso2">
            <span class="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[12px]">2</span>
            <span>Presentaciones</span>
          </button>
        </div>

        <!-- STEPPER ESCRITORIO (flechas con clip-path) -->
        <div class="hidden sm:flex w-full select-none rounded-xl overflow-hidden shadow-sm">
          <div
            class="flex-1 flex items-center justify-center gap-3 py-3.5 pl-8 pr-6 text-white transition-colors cursor-pointer"
            :class="pasoActual === 1 ? 'bg-[#2b5e3b]' : 'bg-[#7fa389]'"
            style="clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%)"
            @click="pasoActual = 1">
            <span class="text-base font-semibold">1.</span>
            <span class="text-base font-medium">Información general</span>
          </div>

          <div
            class="flex-1 flex items-center justify-center gap-3 py-3.5 pl-10 pr-6 text-white transition-colors -ml-5 cursor-pointer"
            :class="pasoActual === 2 ? 'bg-[#2b5e3b]' : 'bg-[#c7d6bd]'" :style="pasoActual === 2 ? '' : 'color:#5b6b57'"
            style="clip-path: polygon(24px 0, 100% 0, 100% 100%, 24px 100%, 0 50%)" @click="irAPaso2">
            <span class="text-base font-semibold">2.</span>
            <span class="text-base font-medium">Presentaciones</span>
          </div>
        </div>
      </div>

      <!-- PASO 1: INFORMACIÓN PRINCIPAL -->
      <div v-show="pasoActual === 1" class="p-4 sm:px-8 sm:pt-4 md:pb-6">
        <div class="flex items-center gap-2.5 mb-4 pb-4 border-b border-[#e2e8dd]">
          <div class="!w-8 !h-8 sm:!w-10 sm:!h-10 rounded-lg bg-[#f4f7f2] border border-[#dce4d7] shadow-sm flex items-center justify-center shrink-0">
            <i class="pi pi-info text-[#2b5e3b] text-base sm:text-xl font-bold"></i>
          </div>
          <span class="text-base sm:text-xl font-bold text-[#1a2e1f]">
            Información Principal del Producto
          </span>
        </div>

        <!-- ======================================================= -->
        <!-- VISTA MÓVIL (Solo Teléfono: block md:hidden)           -->
        <!-- ======================================================= -->
        <div class="block md:hidden space-y-4">
          <BaseInput
            v-model="nombre"
            label="Nombre del Producto *"
            placeholder="Ej: Fertilizante Triple 15"
            filter="alphanum"
            class="w-full"
            :error="errores.nombre"
          />

          <BaseInput
            v-model="fabricante"
            label="Fabricante *"
            placeholder="Ej: Fertica, Bayer, etc."
            filter="alpha"
            class="w-full"
            :error="errores.fabricante"
          />

          <div class="flex flex-col gap-1.5 w-full">
            <label class="text-xs font-semibold text-gray-700">
              Categoría <span class="text-red-500">*</span>
            </label>
            <AutoComplete v-model="categoria" :suggestions="categoriasFiltradas" optionLabel="nombre" dropdown fluid
              placeholder="Buscar categoría..." @complete="buscarCategorias" :pt="{
                root: { class: 'w-full' },
                pcInputText: {
                  root: {
                    class: [
                      '!bg-white !border-gray-300 !text-[#1a2e1f] !text-xs !h-10 !py-2 !px-3 rounded-lg shadow-2xs focus:!border-[#2b5e3b] w-full',
                      { '!border-red-500': errores.categoria }
                    ]
                  }
                },
                dropdown: { class: '!bg-white !border-gray-300 rounded-r-lg !h-10 !w-10' }
              }">
              <template #footer>
                <div v-if="textoBusquedaCategoria" class="px-3 py-2 border-t cursor-pointer hover:bg-gray-100 text-xs"
                  @click="abrirModalCategoria">
                  <i class="pi pi-plus mr-1.5"></i>
                  Crear categoría <strong>{{ textoBusquedaCategoria }}</strong>
                </div>
              </template>
            </AutoComplete>
            <small v-if="errores.categoria" class="text-red-500 text-xs">{{ errores.categoria }}</small>
          </div>

          <BaseInputPercent
            v-model="porcentajeGananciaMinimo"
            label="% Ganancia Mínimo Especial"
            placeholder="Ej: 20.00"
            class="w-full"
          >
            <template #help>
              <small class="text-[11px] text-gray-500 leading-tight block mt-1">
                Si queda vacío hereda el margen de ganancia de su categoría.
              </small>
            </template>
          </BaseInputPercent>

          <BaseInput
            v-model="codigoGenerado"
            label="Código del Producto"
            readonly
            class="w-full font-mono font-semibold [&_input]:!bg-gray-300"
            help="Autogenerado."
          />

          <div class="flex flex-col gap-1.5 w-full">
            <label class="text-xs font-semibold text-gray-700">
              Tipo de Venta <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center justify-around bg-gray-50 px-4 h-12 rounded-lg border border-gray-200 w-full">
              <div class="flex items-center gap-2">
                <RadioButton v-model="tipoProducto" inputId="venta1_m" name="tipoProducto_m" value="UNIDAD FIJA" />
                <label for="venta1_m" class="text-sm text-[#1a2e1f] cursor-pointer font-medium">Unidad Fija</label>
              </div>
              <div class="flex items-center gap-2">
                <RadioButton v-model="tipoProducto" inputId="venta2_m" name="tipoProducto_m" value="GRANEL" />
                <label for="venta2_m" class="text-sm text-[#1a2e1f] cursor-pointer font-medium">Granel</label>
              </div>
            </div>
            <small v-if="errores.tipoProducto" class="text-red-500 text-xs">{{ errores.tipoProducto }}</small>
         </div>

          <div class="flex flex-col gap-1.5 w-full">
            <BaseSelect
              v-model="unidadMedidaId"
              :label="`Unidad Base <span class='text-red-500'>*</span>`"
              :options="unidadesFiltradas"
              option-label="nombre"
              option-value="id"
              placeholder="Seleccione una unidad base..."
              :disabled="presentacionBaseCreada"
              :error="errores.unidadMedidaId"
            />

            <p v-if="!presentacionBaseCreada" class="text-[11px] text-gray-500 mt-0.5 leading-tight flex items-start gap-1">
              <i class="pi pi-info-circle text-blue-500 text-xs mt-0.5 shrink-0"></i>
              <span>Elige la medida mínima de venta.</span>
            </p>
            <p v-else class="text-[11px] text-amber-700 mt-0.5 leading-tight flex items-start gap-1 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
              <i class="pi pi-lock text-amber-600 text-xs mt-0.5 shrink-0"></i>
              <span>Unidad base bloqueada. Elimina todas las presentaciones para modificarla.</span>
            </p>
          </div>

          <div class="flex items-center gap-3 py-2 bg-gray-50 px-3.5 rounded-xl border border-gray-200/80 w-full">
            <Checkbox 
              v-model="aplicaIva" 
              :binary="true" 
              inputId="ivaGeneral_m" 
              :pt="{
                root: { class: '!w-5 !h-5 flex items-center justify-center shrink-0' },
                box: { class: '!w-5 !h-5 !rounded-md border-gray-300' }
              }"
            />
            <label for="ivaGeneral_m" class="text-xs sm:text-sm text-[#1a2e1f] cursor-pointer font-medium leading-tight">
              Aplica IVA 13% <span class="text-gray-500 font-normal block sm:inline">(para todas las presentaciones)</span>
            </label>
          </div>
        </div>

        <!-- ======================================================= -->
        <!-- VISTA ESCRITORIO (Solo PC: hidden md:block con % intactos) -->
        <!-- ======================================================= -->
        <div class="hidden md:block">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nombre del Producto -->
            <BaseInput size="responsive"
              v-model="nombre"
              label="Nombre del Producto *"
              placeholder="Ej: Fertilizante Triple 15"
              filter="alphanum"
              class="col-span-1 md:col-span-2 w-[145%]"
              :error="errores.nombre"
            />

            <!-- Fabricante -->
            <BaseInput size="responsive"
              v-model="fabricante"
              label="Fabricante *"
              placeholder="Ej: Fertica, Bayer, etc."
              filter="alpha"
              class="col-span-1 md:col-span-2 w-[45%]"
              :error="errores.fabricante"
            />

            <!-- Categoría -->
            <div class="flex flex-col gap-1.5 col-span-1 w-[45%]">
              <label class="text-xs sm:text-sm font-semibold text-gray-700">
                Categoría <span class="text-red-500">*</span>
              </label>
              <AutoComplete v-model="categoria" :suggestions="categoriasFiltradas" optionLabel="nombre" dropdown fluid
                placeholder="Buscar categoría..." @complete="buscarCategorias" :pt="{
                  root: { class: 'w-full' },
                  pcInputText: {
                    root: {
                      class: [
                        '!bg-white !border-gray-300 !text-[#1a2e1f] !text-sm md:!text-lg !h-11 md:!h-14 !py-2 !px-4 md:!px-5 rounded-lg shadow-2xs focus:!border-[#2b5e3b] w-full',
                        { '!border-red-500': errores.categoria }
                      ]
                    }
                  },
                  dropdown: { class: '!bg-white !border-gray-300 rounded-r-lg !h-11 md:!h-14 !w-11 md:!w-14' }
                }">
                <template #footer>
                  <div v-if="textoBusquedaCategoria" class="px-3 py-2 border-t cursor-pointer hover:bg-gray-100 text-xs"
                    @click="abrirModalCategoria">
                    <i class="pi pi-plus mr-1.5"></i>
                    Crear categoría <strong>{{ textoBusquedaCategoria }}</strong>
                  </div>
                </template>
              </AutoComplete>
              <small v-if="errores.categoria" class="text-red-500 text-xs">{{ errores.categoria }}</small>
            </div>

            <!-- % Ganancia Especial -->
            <BaseInputPercent size="responsive"
              v-model="porcentajeGananciaMinimo"
              label="% Ganancia Mínimo Especial"
              placeholder="Ej: 20.00"
              class="w-[35%] col-span-1 md:col-span-2"
            >
              <template #help>
                <small class="text-[11px] text-gray-500 leading-tight block mt-1">
                  Si queda vacío hereda el margen de ganancia de su categoría.
                </small>
              </template>
            </BaseInputPercent>

            <!-- Código del Producto -->
            <BaseInput size="responsive"
              v-model="codigoGenerado"
              label="Código del Producto"
              readonly
              class="w-[50%] font-semibold col-span-1 md:col-span-2 [&_input]:!bg-gray-300"
              help="Código autogenerado."
            />

            <!-- Tipo de Venta -->
            <div class="flex flex-col gap-1.5 col-span-1 w-[25%]">
              <label class="text-xs sm:text-sm font-semibold text-gray-700">
                Tipo de Venta <span class="text-red-500">*</span>
              </label>
              <div class="flex items-center gap-4 bg-gray-50 px-3 h-11 md:h-14 rounded-lg border border-gray-200 w-full">
                <div class="flex items-center gap-2">
                  <RadioButton v-model="tipoProducto" inputId="venta1" name="tipoProducto" value="UNIDAD FIJA" />
                  <label for="venta1" class="text-xs sm:text-sm text-[#1a2e1f] cursor-pointer font-medium">Unidad Fija</label>
                </div>
                <div class="flex items-center gap-2">
                  <RadioButton v-model="tipoProducto" inputId="venta2" name="tipoProducto" value="GRANEL" />
                  <label for="venta2" class="text-xs sm:text-sm text-[#1a2e1f] cursor-pointer font-medium">Granel</label>
                </div>
              </div>
              <small v-if="errores.tipoProducto" class="text-red-500 text-xs">{{ errores.tipoProducto }}</small>
            </div>

            <!-- Unidad Base -->
            <div class="flex flex-col gap-1.5 col-span-1 md:col-span-2 w-[40%]">
              <BaseSelect
                v-model="unidadMedidaId"
                :label="`Unidad Base <span class='text-red-500'>*</span>`"
                :options="unidadesFiltradas"
                option-label="nombre"
                option-value="id"
                placeholder="Seleccione una unidad base..."
                size="xl"
                :disabled="presentacionBaseCreada"
                :error="errores.unidadMedidaId"
              />

              <p v-if="!presentacionBaseCreada" class="text-[11px] text-gray-500 mt-0.5 leading-tight flex items-start gap-1">
                <i class="pi pi-info-circle text-blue-500 text-xs mt-0.5 shrink-0"></i>
                <span>Elige la medida mínima de venta.</span>
              </p>
              <p v-else class="text-[11px] text-amber-700 mt-0.5 leading-tight flex items-start gap-1 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
                <i class="pi pi-lock text-amber-600 text-xs mt-0.5 shrink-0"></i>
                <span>Unidad base bloqueada. Elimina todas las presentaciones para modificarla.</span>
              </p>
            </div>

            <!-- IVA -->
            <div class="col-span-1 md:col-span-2 flex items-center gap-3 -mt-4 py-0">
              <Checkbox 
                v-model="aplicaIva" 
                :binary="true" 
                inputId="ivaGeneral" 
                :pt="{
                  root: { class: '!w-6 !h-6 flex items-center justify-center shrink-0' },
                  box: { class: '!w-6 !h-6 !rounded-md border-gray-300' }
                }"
              />
              <label for="ivaGeneral" class="text-sm md:text-base text-[#1a2e1f] cursor-pointer font-medium select-none">
                Aplica IVA 13% <span class="text-gray-500 font-normal">(para todas las presentaciones)</span>
              </label>
            </div>
          </div>
        </div>

        <!-- BOTÓN SIGUIENTE PASO -->
        <div class="mt-6 pt-4 border-t border-gray-100">
          
          <!-- Vista Móvil (Solo Teléfono) -->
          <div class="block md:hidden">
            <Button label="Siguiente Paso" icon="pi pi-arrow-right" iconPos="right"
              class="!text-sm !py-3 !px-6 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-xs transition-all cursor-pointer w-full flex justify-center"
              @click="irAPaso2" />
          </div>

          <!-- Vista Escritorio (Solo PC - Medida exacta) -->
          <div class="hidden md:flex md:justify-end">
            <Button label="Siguiente Paso" icon="pi pi-arrow-right" iconPos="right"
              style="min-width: 13.5rem; height: 3.25rem;"
              class="!text-base !py-2.5 !px-6 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-xs transition-all cursor-pointer flex justify-center items-center"
              @click="irAPaso2" />
          </div>

        </div>
      </div>

      <!-- PASO 2: PRESENTACIONES -->
      <div v-show="pasoActual === 2" class="p-4 sm:p-6 md:p-8">

        <!-- BASE (GRANEL) -->
        <div v-if="tipoProducto === 'GRANEL' && !presentacionBaseCreada" class="mb-6">
          <div class="flex items-center gap-2.5 mb-3 pb-3 border-b border-[#e2e8dd]">
            <div class="!w-8 !h-8 sm:!w-10 sm:!h-10 rounded-lg bg-[#f4f7f2] border border-[#dce4d7] shadow-sm flex items-center justify-center shrink-0">
              <i class="pi pi-star-fill text-[#2b5e3b] text-base sm:text-xl font-bold"></i>
            </div>
            <span class="text-base sm:text-xl font-bold text-[#1a2e1f]">Crear la Presentación Base (Obligatoria)</span>
          </div>

          <div class="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-5 mb-5 rounded-r-xl rounded-l-md shadow-sm">
            <div class="flex items-start">
              <i class="pi pi-info-circle text-blue-500 text-lg sm:text-xl mr-2.5 sm:mr-3 mt-0.5 shrink-0"></i>
              <div>
                <h3 class="text-sm sm:text-lg text-gray-800 font-semibold mb-1">¿Qué es la presentación base?</h3>
                <p class="text-xs sm:text-base text-gray-600 leading-relaxed">
                  Es la medida más pequeña o suelta que usarás para despachar este producto
                  <strong>a granel o al detalle</strong>.
                </p>
                <p class="text-[11px] sm:text-sm text-gray-500 mt-2 leading-relaxed bg-white/60 p-2.5 sm:p-3 rounded-lg border border-blue-100">
                  <span class="font-semibold text-blue-700">Ejemplo práctico:</span>
                  Si controlas el inventario por <strong class="text-gray-800">{{ nombreUnidadBase }}</strong>,
                  esta será tu unidad de partida (equivale a 1). El sistema la usará automáticamente para calcular
                  el costo y stock de presentaciones más grandes (cajas, sacos o paquetes).
                </p>
              </div>
            </div>
          </div>

          <!-- ======================================================= -->
          <!-- VISTA MÓVIL GRANEL BASE (Solo Teléfono: block md:hidden) -->
          <!-- ======================================================= -->
          <div class="block md:hidden space-y-4">
            <BaseInput :model-value="nombreUnidadBase" label="Nombre de la presentación base *" disabled class="w-full">
              <template #help>
                <small class="text-xs text-gray-500 flex items-center gap-1.5">
                  <i class="pi pi-lock text-[11px]"></i> Fijo
                </small>
              </template>
            </BaseInput>

            <BaseInput :model-value="nombreUnidadBase" label="Unidad de Medida" disabled class="w-full">
              <template #help>
                <small class="text-xs text-gray-500 flex items-center gap-1.5">
                  <i class="pi pi-lock text-[11px]"></i> Fijo (es la unidad base del producto)
                </small>
              </template>
            </BaseInput>

            <BaseInput model-value="1.000" label="Factor de Conversión" disabled class="w-full font-mono">
              <template #help>
                <small class="text-xs text-gray-500 flex items-center gap-1.5">
                  <i class="pi pi-lock text-[11px]"></i> Fijo (la base siempre tiene factor 1)
                </small>
              </template>
            </BaseInput>

            <BaseInputNumber
              v-model="formBase.stockMinimo"
              label="Stock Mínimo *"
              placeholder="0"
              :min="1"
              :max="1000000"
              :max-fraction-digits="0"
              :use-grouping="true"
              :error="errores.stockMinimo"
              class="w-full"
            >
              <template #help>
                <small class="text-xs text-gray-500">
                  Cuando te queden exactamente <strong>{{ formBase.stockMinimo || 0 }} {{ nombreUnidadBase }}</strong> o
                  menos, el sistema te avisará que te queda poca mercadería.
                </small>
              </template>
            </BaseInputNumber>

            <BaseInputNumberMoney v-model="formBase.precioVenta" label="Precio de Venta *" placeholder="0.00" class="w-full" />

            <BaseInput
              v-model="formBase.codigoBarra"
              label="Código de Barra"
              placeholder="Ej: 7501234567890"
              maxlength="14"
              filter="int"
              class="w-full"
              help="Opcional (se puede leer con pistola de barras)"
            />
          </div>

          <!-- ======================================================= -->
          <!-- VISTA ESCRITORIO GRANEL BASE (Solo PC: hidden md:block)  -->
          <!-- ======================================================= -->
          <div class="hidden md:block">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <BaseInput size="responsive" :model-value="nombreUnidadBase" label="Nombre de la presentación base *" disabled>
                <template #help>
                  <small class="text-xs text-gray-500 flex items-center gap-1.5">
                    <i class="pi pi-lock text-[11px]"></i> Fijo
                  </small>
                </template>
              </BaseInput>

              <BaseInput size="responsive" :model-value="nombreUnidadBase" label="Unidad de Medida" disabled>
                <template #help>
                  <small class="text-xs text-gray-500 flex items-center gap-1.5">
                    <i class="pi pi-lock text-[11px]"></i> Fijo (es la unidad base del producto)
                  </small>
                </template>
              </BaseInput>

              <BaseInput size="responsive" model-value="1.000" label="Factor de Conversión" disabled class="font-mono">
                <template #help>
                  <small class="text-xs text-gray-500 flex items-center gap-1.5">
                    <i class="pi pi-lock text-[11px]"></i> Fijo (la base siempre tiene factor 1)
                  </small>
                </template>
              </BaseInput>

              <div class="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <BaseInputNumber size="responsive"
                  v-model="formBase.stockMinimo"
                  label="Stock Mínimo *"
                  placeholder="0"
                  :min="1"
                  :max="1000000"
                  :max-fraction-digits="0"
                  :use-grouping="true"
                  :error="errores.stockMinimo"
                >
                  <template #help>
                    <small class="text-xs text-gray-500">
                      Cuando te queden exactamente <strong>{{ formBase.stockMinimo || 0 }} {{ nombreUnidadBase }}</strong> o
                      menos, el sistema te avisará que te queda poca mercadería.
                    </small>
                  </template>
                </BaseInputNumber>

                <BaseInputNumberMoney size="responsive" v-model="formBase.precioVenta" label="Precio de Venta *" placeholder="0.00" />

                <BaseInput size="responsive"
                  v-model="formBase.codigoBarra"
                  label="Código de Barra"
                  placeholder="Ej: 7501234567890"
                  maxlength="14"
                  filter="int"
                  help="Opcional (se puede leer con pistola de barras)"
                />
              </div>
            </div>
          </div>

          <!-- BOTÓN CREAR BASE -->
          <div class="mt-5">
            <!-- Vista Móvil -->
            <div class="block md:hidden">
              <Button label="Crear Presentación Base" icon="pi pi-check"
                class="!text-sm !py-3 !px-6 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-xs cursor-pointer w-full flex justify-center"
                @click="crearBase" />
            </div>

            <!-- Vista Escritorio (Medida exacta) -->
            <div class="hidden md:flex md:justify-end">
              <Button label="Crear Presentación Base" icon="pi pi-check"
                style="min-width: 16.5rem; height: 3.25rem;"
                class="!text-base !py-2.5 !px-6 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-xs cursor-pointer flex justify-center items-center"
                @click="crearBase" />
            </div>
          </div>
        </div>

        <!-- DERIVADA (GRANEL) -->
        <div v-else-if="tipoProducto === 'GRANEL' && presentacionBaseCreada" class="mb-6">
          <div class="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#e2e8dd]">
            <span class="text-base sm:text-xl font-bold text-[#1a2e1f]">➕ Agregar Presentación Derivada</span>
          </div>

          <!-- ======================================================= -->
          <!-- VISTA MÓVIL DERIVADA (Solo Teléfono: block md:hidden)   -->
          <!-- ======================================================= -->
          <div class="block md:hidden space-y-4">
            <div class="flex flex-col gap-1.5 w-full">
              <label class="text-xs font-semibold text-gray-700">
                Nombre de la presentación <span class="text-red-500">*</span>
              </label>
              <AutoComplete v-model="formDerivada.nombre" :suggestions="unidadesSugeridas" optionLabel="nombre"
                optionValue="nombre" dropdown fluid placeholder="Ej: Arroba, Quintal, Saco..."
                @complete="buscarUnidades" @item-select="onSelectDerivada" :pt="{
                  root: { class: 'w-full' },
                  pcInputText: {
                    root: { class: '!bg-white !border-gray-300 !text-[#1a2e1f] !text-xs !h-10 !py-1 !px-3 rounded-lg shadow-2xs focus:!border-[#2b5e3b] w-full' }
                  },
                  dropdown: { class: '!bg-white !border-gray-300 rounded-r-lg !h-10 !w-10' }
                }" />
              <p class="text-[11px] text-gray-500 mt-0.5 leading-tight flex items-start gap-1">
                <i class="pi pi-info-circle text-blue-500 text-xs mt-0.5 shrink-0"></i>
                <span>Busca en la lista o escribe un nombre nuevo si no existe; el sistema lo creará automáticamente.</span>
              </p>
            </div>

            <BaseInput :model-value="nombreUnidadBase" label="Unidad de Medida" disabled class="w-full">
              <template #help>
                <small class="text-xs text-gray-500 flex items-center gap-1.5">
                  <i class="pi pi-lock text-[11px]"></i> Fija (comparten la misma unidad base)
                </small>
              </template>
            </BaseInput>

            <BaseInputNumber
              v-model="formDerivada.factorConversion"
              label="Contenido de la presentación *"
              placeholder="0"
              :min="1"
              :max="999999"
              :use-grouping="true"
              :error="errores.factorConversion"
              class="w-full"
            >
              <template #help>
                <small class="text-xs text-gray-500">
                  Indica cuántas <strong>{{ nombreUnidadBase }}</strong> trae este empaque.
                </small>
              </template>
            </BaseInputNumber>

            <BaseInputNumberMoney v-model="formDerivada.precioVenta" label="Precio de Venta *" placeholder="0.00" class="w-full" />

            <div class="bg-[#f4f9f5] border border-[#e3efe6] rounded-xl p-3">
              <div class="flex items-start gap-2.5">
                <i class="pi pi-info-circle text-[#2b5e3b] text-base mt-0.5 shrink-0"></i>
                <div class="text-xs text-[#1a2e1f] leading-relaxed">
                  <span class="font-semibold block mb-1">Reglas de la presentación derivada:</span>
                  <ul class="list-disc pl-4 space-y-1 text-[#223d29]">
                    <li>No requiere <strong>código de barras</strong>.</li>
                    <li>No maneja <strong>stock mínimo propio</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- ======================================================= -->
          <!-- VISTA ESCRITORIO DERIVADA (Solo PC: hidden md:block)    -->
          <!-- ======================================================= -->
          <div class="hidden md:block">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div class="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                <label class="text-xs sm:text-sm font-semibold text-gray-700">
                  Nombre de la presentación <span class="text-red-500">*</span>
                </label>
                <AutoComplete v-model="formDerivada.nombre" :suggestions="unidadesSugeridas" optionLabel="nombre"
                  optionValue="nombre" dropdown fluid placeholder="Ej: Arroba, Quintal, Saco..."
                  @complete="buscarUnidades" @item-select="onSelectDerivada" :pt="{
                    root: { class: 'w-full' },
                    pcInputText: {
                      root: { class: '!bg-white !border-gray-300 !text-[#1a2e1f] !text-sm md:!text-lg !h-11 md:!h-14 !py-1 !px-4 md:!px-5 rounded-lg shadow-2xs focus:!border-[#2b5e3b]' }
                    },
                    dropdown: { class: '!bg-white !border-gray-300 rounded-r-lg !h-11 md:!h-14' }
                  }" />
                <p class="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-tight flex items-start gap-1">
                  <i class="pi pi-info-circle text-blue-500 text-xs mt-0.5 shrink-0"></i>
                  <span>Busca en la lista o escribe un nombre nuevo si no existe; el sistema lo creará automáticamente
                    (Ej: <strong class="text-gray-700">Saco de 50 lb</strong>).</span>
                </p>
              </div>

              <BaseInput size="responsive" :model-value="nombreUnidadBase" label="Unidad de Medida" disabled>
                <template #help>
                  <small class="text-xs text-gray-500 flex items-center gap-1.5">
                    <i class="pi pi-lock text-[11px]"></i> Fija (todas las presentaciones de GRANEL comparten la misma unidad base)
                  </small>
                </template>
              </BaseInput>

              <BaseInputNumber size="responsive"
                v-model="formDerivada.factorConversion"
                label="Contenido de la presentación *"
                placeholder="0"
                :min="1"
                :max="999999"
                :use-grouping="true"
                :error="errores.factorConversion"
              >
                <template #help>
                  <small class="text-xs text-gray-500">
                    Indica cuántas <strong>{{ nombreUnidadBase }}</strong> trae este empaque.<br>
                    Si tu base es Libra y vendes una Arroba, aquí debes poner 25.
                  </small>
                </template>
              </BaseInputNumber>

              <BaseInputNumberMoney size="responsive" v-model="formDerivada.precioVenta" label="Precio de Venta *" placeholder="0.00" />

              <div class="col-span-1 sm:col-span-2 bg-[#f4f9f5] border border-[#e3efe6] rounded-xl p-3 sm:p-4">
                <div class="flex items-start gap-2.5 sm:gap-3">
                  <i class="pi pi-info-circle text-[#2b5e3b] text-base sm:text-xl mt-0.5 shrink-0"></i>
                  <div class="text-xs sm:text-sm text-[#1a2e1f] leading-relaxed">
                    <span class="font-semibold text-[#1a2e1f] block mb-1">Reglas de la presentación derivada:</span>
                    <ul class="list-disc pl-4 space-y-1 text-[#223d29]">
                      <li>No requiere <strong>código de barras</strong> (solo la presentación base).</li>
                      <li>No maneja <strong>stock mínimo propio</strong> (se controla desde la base).</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- BOTONES CANCELAR Y AGREGAR -->
          <div class="mt-5">
            <!-- Vista Móvil (Apilados full width) -->
            <div class="flex flex-col-reverse gap-3 block md:hidden">
              <Button label="Limpiar Campos" icon="pi pi-eraser "
                class="!text-sm !py-3 !px-6 !bg-gray-100 hover:!bg-gray-200 !border-gray-300 !text-[#1a2e1f] rounded-xl cursor-pointer w-full flex justify-center"
                @click="limpiarFormularioDerivada" />
              <Button label="Agregar" icon="pi pi-plus"
                class="!text-sm !py-3 !px-6 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-xs cursor-pointer w-full flex justify-center"
                @click="agregarDerivada" />
            </div>

            <!-- Vista Escritorio (Medidas controladas en la misma fila) -->
            <div class="hidden md:flex md:justify-end md:gap-4">
              <Button label="Limpiar Campos" icon="pi pi-eraser"
                style="min-width: 10.5rem; height: 3.25rem;"
                class="!text-base !py-2.5 !px-6 !bg-gray-100 hover:!bg-gray-200 !border-gray-300 !text-[#1a2e1f] rounded-xl cursor-pointer flex justify-center items-center"
                @click="limpiarFormularioDerivada" />
              <Button label="Agregar" icon="pi pi-plus"
                style="min-width: 11.5rem; height: 3.25rem;"
                class="!text-base !py-2.5 !px-6 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-xs cursor-pointer flex justify-center items-center"
                @click="agregarDerivada" />
            </div>
          </div>
        </div>

        <!-- UNIDAD FIJA -->
        <div v-else-if="tipoProducto === 'UNIDAD FIJA'" class="mb-6">
          <div class="flex items-center gap-2.5 mb-3 pb-3 border-b border-[#e2e8dd]">
            <div class="!w-8 !h-8 sm:!w-10 sm:!h-10 rounded-lg bg-[#f4f7f2] border border-[#dce4d7] shadow-sm flex items-center justify-center shrink-0">
              <i class="pi pi-plus text-[#2b5e3b] text-base sm:text-xl font-bold"></i>
            </div>
            <span class="text-base sm:text-xl font-bold text-[#1a2e1f]">Agregar Presentación</span>
          </div>

          <!-- ======================================================= -->
          <!-- VISTA MÓVIL UNIDAD FIJA (Solo Teléfono: block md:hidden) -->
          <!-- ======================================================= -->
          <div class="block md:hidden space-y-4">
            <div class="flex flex-col gap-1.5 w-full">
              <label class="text-xs font-semibold text-gray-700">
                Nombre de la presentación <span class="text-red-500">*</span>
              </label>
              <AutoComplete v-model="formUnidadFija.nombre" :suggestions="unidadesSugeridas" optionLabel="nombre"
                optionValue="nombre" dropdown fluid placeholder="Buscar o escribir unidad..."
                @complete="buscarUnidades" @item-select="onSelectUnidadFija" :pt="{
                  root: { class: 'w-full' },
                  pcInputText: {
                    root: { class: '!bg-white !border-gray-300 !text-[#1a2e1f] !text-xs !h-10 !py-1 !px-3 rounded-lg shadow-2xs focus:!border-[#2b5e3b] w-full' }
                  },
                  dropdown: { class: '!bg-white !border-gray-300 rounded-r-lg !h-10 !w-10' }
                }" />
              <p class="text-[11px] text-gray-500 mt-0.5 leading-tight flex items-start gap-1">
                <i class="pi pi-info-circle text-blue-500 text-xs mt-0.5 shrink-0"></i>
                <span>Busca en la lista o escribe un nombre nuevo si no existe.</span>
              </p>
            </div>

            <BaseInput model-value="1.000" label="Factor de Conversión" disabled class="font-mono">
              <template #help>
                <small class="text-xs text-gray-500 flex items-center gap-1.5">
                  <i class="pi pi-lock text-[11px]"></i> Fijo (unidades fijas no se convierten).
                </small>
              </template>
            </BaseInput>

            <BaseInputNumber
              v-model="formBase.stockMinimo"
              label="Stock Mínimo *"
              placeholder="0"
              :min="1"
              :max="1000000"
              :max-fraction-digits="0"
              :use-grouping="true"
              :error="errores.stockMinimo"
              class="w-full"
            >
              <template #help>
                <small class="text-xs text-gray-500">
                  Cuando te queden exactamente <strong>{{ formBase.stockMinimo || 0 }} {{ nombreUnidadBase }}</strong> o
                  menos, el sistema te avisará que te queda poca mercadería.
                </small>
              </template>
            </BaseInputNumber>

            <BaseInputNumberMoney v-model="formBase.precioVenta" label="Precio de Venta *" placeholder="0.00" class="w-full" />

            <BaseInput
              v-model="formBase.codigoBarra"
              label="Código de Barra"
              placeholder="Ej: 7501234567890"
              maxlength="14"
              filter="int"
              class="w-full"
            >
             <template #help>
                <small class="text-xs text-gray-500">
                   Opcional (se puede leer con pistola de barras)
                </small>
              </template>
            </BaseInput>
          </div>

          <!-- ======================================================= -->
          <!-- VISTA ESCRITORIO UNIDAD FIJA (Solo PC: hidden md:block) -->
          <!-- ======================================================= -->
          <div class="hidden md:block">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div class="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                <label class="text-xs sm:text-sm font-semibold text-gray-700">
                  Nombre de la presentación <span class="text-red-500">*</span>
                </label>
                <AutoComplete v-model="formUnidadFija.nombre" :suggestions="unidadesSugeridas" optionLabel="nombre"
                  optionValue="nombre" dropdown fluid placeholder="Buscar o escribir unidad (ej. Botella 1L, Martillo)..."
                  @complete="buscarUnidades" @item-select="onSelectUnidadFija" :pt="{
                    root: { class: 'w-full' },
                    pcInputText: {
                      root: { class: '!bg-white !border-gray-300 !text-[#1a2e1f] !text-sm md:!text-lg !h-11 md:!h-14 !py-1 !px-4 md:!px-5  rounded-lg shadow-2xs focus:!border-[#2b5e3b]' }
                    },
                    dropdown: { class: '!bg-white !border-gray-300 rounded-r-lg !h-11 md:!h-14' }
                  }" />
                <p class="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-tight flex items-start gap-1">
                  <i class="pi pi-info-circle text-blue-500 text-xs mt-0.5 shrink-0"></i>
                  <span>Busca en la lista o escribe un nombre nuevo si no existe; el sistema lo creará automáticamente
                    (Ej: <strong class="text-gray-700">Saco de 50 lb</strong>).</span>
                </p>
              </div>

              <BaseInput size="xl" model-value="1.000" label="Factor de Conversión" disabled class="font-mono w-[35%] ">
                <template #help>
                  <small class="text-xs text-gray-500 flex items-center gap-1.5">
                    <i class="pi pi-lock text-[11px]"></i> Fijo (unidades fijas no se convierten).
                  </small>
                </template>
              </BaseInput>

              <div class="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <BaseInputNumber size="xl"
                  v-model="formBase.stockMinimo"
                  label="Stock Mínimo *"
                  class="w-[25%]"
                  placeholder="0"
                  :min="1"
                  :max="1000000"
                  :max-fraction-digits="0"
                  :use-grouping="true"
                  :error="errores.stockMinimo"
                >
                  <template #help>
                    <small class="text-xs text-gray-500">
                      Cuando te queden exactamente <strong>{{ formBase.stockMinimo || 0 }} {{ nombreUnidadBase }}</strong> o
                      menos, el sistema te avisará que te queda poca mercadería.
                    </small>
                  </template>
                </BaseInputNumber>

                <BaseInputNumberMoney size="xl" class="w-[30%]" v-model="formBase.precioVenta" label="Precio de Venta *" placeholder="0.00" />

                <BaseInput size="xl"
                  class="w-[40%]"
                  v-model="formBase.codigoBarra"
                  label="Código de Barra"
                  placeholder="Ej: 7501234567890"
                  maxlength="14"
                  filter="int"
                > 
                  <template #help>
                      <small class="text-xs text-gray-500">
                        Opcional (se puede leer con pistola de barras)
                      </small>
                    </template>
                </BaseInput>
              </div>
            </div>
          </div>

          <!-- BOTONES CANCELAR Y AGREGAR (UNIDAD FIJA) -->
          <div class="mt-5">
            <!-- Vista Móvil -->
            <div class="flex flex-col-reverse gap-3 block md:hidden">
              <Button label="Limpiar Campos" icon="pi pi-eraser"
                class="!text-sm !py-3 !px-6 !bg-gray-100 hover:!bg-gray-200 !border-gray-300 !text-[#1a2e1f] rounded-xl cursor-pointer w-full flex justify-center"
                @click="limpiarFormularioUnidadFija" />
              <Button label="Agregar" icon="pi pi-plus"
                class="!text-sm !py-3 !px-6 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-xs cursor-pointer w-full flex justify-center"
                @click="agregarUnidadFija" />
            </div>

            <!-- Vista Escritorio -->
            <div class="hidden md:flex md:justify-end md:gap-4">
              <Button label="Limpiar Campos" icon="pi pi-eraser"
                style="min-width: 10.5rem; height: 3.25rem;"
                class="!text-base !py-2.5 !px-6 !bg-gray-100 hover:!bg-gray-200 !border-gray-300 !text-[#1a2e1f] rounded-xl cursor-pointer flex justify-center items-center"
                @click="limpiarFormularioUnidadFija" />
              <Button label="Agregar" icon="pi pi-plus"
                style="min-width: 11.5rem; height: 3.25rem;"
                class="!text-base !py-2.5 !px-6 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-xs cursor-pointer flex justify-center items-center"
                @click="agregarUnidadFija" />
            </div>
          </div>
        </div>

        <!-- TABLA: PRESENTACIONES AGREGADAS (Móvil Desplegable + PC Tabla) -->
        <div class="mt-6 pt-5 border-t border-[#e2e8dd]">
          <div class="flex items-center gap-2.5 mb-3 pb-3 border-b border-[#e2e8dd]">
            <div class="!w-8 !h-8 sm:!w-10 sm:!h-10 rounded-lg bg-[#f4f7f2] border border-[#dce4d7] shadow-sm flex items-center justify-center shrink-0">
              <i class="pi pi-list text-[#2b5e3b] text-base sm:text-xl font-bold"></i>
            </div>
            <span class="text-base sm:text-xl font-bold text-[#1a2e1f]">Presentaciones Agregadas</span>
          </div>

          <!-- MÓVIL: Tabla con Desplegable (#expansion) -->
          <div class="block sm:hidden w-full border border-[#e2e8dd] rounded-xl overflow-hidden shadow-2xs">
            <DataTable 
              v-model:expandedRows="expandedRows" 
              :value="presentaciones" 
              dataKey="nombre" 
              class="p-datatable-custom text-xs w-full"
            >
              <template #empty>
                <div class="text-center py-6 text-gray-400 text-xs">No hay presentaciones agregadas aún</div>
              </template>

              <!-- Flecha Expansión -->
              <Column expander style="width: 2.2rem" />

              <!-- Nombre -->
              <Column field="nombre" header="Nombre" class="font-semibold text-gray-800">
                <template #body="{ data }">
                  <span class="capitalize block text-xs leading-tight font-semibold text-[#1a2e1f]">{{ data.nombre }}</span>
                </template>
              </Column>

              <!-- Precio (C/IVA) -->
              <Column header="Precio" class="text-right font-bold text-[#2b5e3b]">
                <template #body="{ data }">
                  {{ formatCurrency(data.precioConIva) }}
                </template>
              </Column>

              <!-- Desplegable Móvil -->
              <template #expansion="{ data, index }">
                <div class="p-3 bg-[#f8faf7] border-y border-[#e2e8dd] text-xs">
                  <div class="bg-white p-3.5 rounded-xl border border-[#e2e8dd] shadow-2xs divide-y divide-gray-100">
                    
                    <!-- Fila 1: Código y Equivalencia -->
                    <div class="flex justify-between items-start pb-2.5">
                      <div>
                        <span class="text-[10px] font-bold uppercase text-gray-500 block mb-0.5">Código Barra</span>
                        <span class="font-mono text-xs text-gray-800 block">{{ data.codigoBarra || '—' }}</span>
                      </div>
                      <div class="text-right">
                        <span class="text-[10px] font-bold uppercase text-gray-500 block mb-0.5">Equivalencia</span>
                        <span class="text-xs text-gray-800 block font-semibold">{{ data.equivalencia }} {{ data.unidadBase || nombreUnidadBase }}</span>
                      </div>
                    </div>

                    <!-- Fila 2: Stock Mínimo y Base -->
                    <div class="flex justify-between items-center py-2.5">
                      <div>
                        <span class="text-[10px] font-bold uppercase text-gray-500 block mb-0.5">Stock Mínimo</span>
                        <span class="text-xs text-gray-800 block">{{ data.stock_minimo !== undefined ? data.stock_minimo : '—' }}</span>
                      </div>
                      <div class="text-right">
                        <span class="text-[10px] font-bold uppercase text-gray-500 block mb-0.5">Base</span>
                        <Tag v-if="data.es_base" value="Base" severity="success" rounded class="!text-[10px] !px-2" />
                        <span v-else class="text-gray-400 text-xs block">—</span>
                      </div>
                    </div>

                    <!-- Fila 3: Precios IVA -->
                    <div class="flex justify-between items-start pt-2.5">
                      <div>
                        <span class="text-[10px] font-bold uppercase text-gray-500 block mb-0.5">Precio S/IVA</span>
                        <span class="text-xs text-gray-700 block">{{ formatCurrency(data.precioSinIva) }}</span>
                      </div>
                      <div class="text-right">
                        <span class="text-[10px] font-bold uppercase text-gray-500 block mb-0.5">IVA (13%)</span>
                        <span class="text-xs text-gray-700 block">{{ formatCurrency(data.ivaAplicado) }}</span>
                      </div>
                    </div>

                  </div>

                  <!-- Botón Eliminar Móvil -->
                  <div class="mt-2.5 flex justify-end">
                    <Button icon="pi pi-trash" label="Eliminar" severity="danger" text size="small"
                      class="!py-1 !px-2.5 !text-xs font-semibold cursor-pointer"
                      @click="eliminarPresentacion(index)" />
                  </div>
                </div>
              </template>
            </DataTable>
          </div>

          <!-- ESCRITORIO: Tabla Completa -->
          <div class="hidden sm:block">
            <DataTable :value="presentaciones" :paginator="presentaciones.length > 5" :rows="5"
              class="font-['Inter',sans-serif] text-sm" emptyMessage="No hay presentaciones agregadas aún">

              <Column field="nombre" header="Nombre" class="!text-sm font-semibold text-[#1a2e1f]" />
              <Column field="codigoBarra" header="Código Barra" class="!text-sm">
                <template #body="{ data }">{{ data.codigoBarra || '—' }}</template>
              </Column>
              <Column field="equivalencia" header="Equivalencia" class="!text-sm" />
              <Column field="unidadBase" header="Unidad Base" class="!text-sm">
                <template #body="{ data }">{{ data.unidadBase || nombreUnidadBase || '—' }}</template>
              </Column>
              <Column field="stock_minimo" header="Stock Mínimo" class="!text-sm">
                <template #body="{ data }">{{ data.stock_minimo !== undefined ? data.stock_minimo : '—' }}</template>
              </Column>
              <Column header="Base" class="!text-sm text-center">
                <template #body="{ data, index }">
                  <Checkbox v-if="tipoProducto === 'GRANEL' && presentaciones.length > 1" v-model="data.es_base"
                    :disabled="!puedeEditarBase" @change="onCambiarBase(data, index)" :binary="true" />
                  <Tag v-else-if="data.es_base" value="Base" severity="success" rounded class="text-xs" />
                  <span v-else class="text-gray-300">—</span>
                </template>
              </Column>
              <Column field="precioSinIva" header="Precio (S/IVA)" class="!text-sm">
                <template #body="{ data }">{{ formatCurrency(data.precioSinIva) }}</template>
              </Column>
              <Column field="ivaAplicado" header="IVA" class="!text-sm">
                <template #body="{ data }">{{ formatCurrency(data.ivaAplicado) }}</template>
              </Column>
              <Column field="precioConIva" header="Precio (C/IVA)" class="!text-sm font-bold text-[#2b5e3b]">
                <template #body="{ data }">{{ formatCurrency(data.precioConIva) }}</template>
              </Column>
              <Column header="Acciones" class="!text-sm">
                <template #body="{ index }">
                  <div class="flex gap-2">
                    <Button icon="pi pi-trash" severity="danger" text rounded @click="eliminarPresentacion(index)" />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>

        <!-- BOTONES FINALES DEL PASO 2 -->
        <div class="mt-6 pt-5 border-t border-[#e2e8dd]">

          <!-- Vista Móvil (Apilados) -->
          <div class="flex flex-col-reverse gap-3 block md:hidden">
            <Button label="Atrás" icon="pi pi-arrow-left"
              class="!text-sm !py-3 !px-6 !bg-[#eef2e9] !border-[#e2e8dd] !text-[#1a2e1f] rounded-xl hover:!bg-[#e2e8dd] cursor-pointer w-full flex justify-center"
              @click="pasoActual = 1" />
            <Button label="Guardar Producto" icon="pi pi-save" :loading="guardando"
              class="!text-sm !py-3 !px-6 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-md cursor-pointer w-full flex justify-center"
              @click="guardarProducto" />
          </div>

          <!-- Vista Escritorio -->
          <div class="hidden md:flex md:justify-end md:items-center gap-4 w-full">
            <Button label="Atrás" icon="pi pi-arrow-left"
              style="min-width: 10.5rem; height: 3.25rem;"
              class="!text-base !py-2.5 !px-6 !bg-[#eef2e9] !border-[#e2e8dd] !text-[#1a2e1f] rounded-xl hover:!bg-[#e2e8dd] cursor-pointer flex justify-center items-center"
              @click="pasoActual = 1" />

            <Button label="Guardar Producto" icon="pi pi-save" :loading="guardando"
              style="min-width: 14.5rem; height: 3.25rem;"
              class="!text-base !py-2.5 !px-6 !bg-[#2b5e3b] hover:!bg-[#1f482d] !border-none !text-white rounded-xl shadow-md cursor-pointer flex justify-center items-center"
              @click="guardarProducto" />
          </div>

        </div>
      </div>
    </div>

    <AddCategoriaDialog v-model:visible="mostrarModalCategoria" @categoria-creada="actualizarCategorias" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import AutoComplete from 'primevue/autocomplete'
import BaseSelect from '@/components/base/BaseSelect.vue'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import Tag from 'primevue/tag'

import AddCategoriaDialog from '@/components/Categorias/AddCategoriaDialog.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseInputNumber from '@/components/base/BaseInputNumber.vue'
import BaseInputNumberMoney from '@/components/base/BaseInputNumberMoney.vue'
import BaseInputPercent from '@/components/base/BaseInputPercent.vue'
import { useproductoStore } from '@/stores/productoStore'
import { getUnidades } from '@/services/productoService'
import { 
  mostrarExito, 
  mostrarError, 
  mostrarAccesoDenegado, 
  mostrarConfirmacion, 
  mostrarAlertaConfirmar,
  mostrarCargando
} from '@/utils/SweetAlertService'

const emit = defineEmits(['close'])
const store = useproductoStore()

const DRAFT_KEY = 'agroferreteria_borrador_nuevo_producto'

const nombre = ref('')
const fabricante = ref('')
const categoria = ref(null)
const porcentajeGananciaMinimo = ref(null)
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
const expandedRows = ref({})

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

function limpiarTexto(texto = '') {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .toUpperCase()
}

function generarAcronimoProducto(nombreProd = '') {
  const limpio = limpiarTexto(nombreProd)
  if (!limpio) return ''

  const stopWords = ['DE', 'DEL', 'PARA', 'CON', 'EN', 'EL', 'LA', 'LOS', 'LAS', 'UN', 'UNA', 'Y']
  const palabras = limpio.split(/\s+/).filter(p => !stopWords.includes(p))

  if (palabras.length === 0) return limpio.substring(0, 4)

  if (palabras.length === 1) {
    return palabras[0].substring(0, 4)
  }

  if (palabras.length === 2) {
    const p1 = palabras[0].substring(0, 2)
    const p2 = palabras[1].substring(0, 2)
    return `${p1}${p2}`
  }

  return palabras.map(p => p.charAt(0)).join('').substring(0, 5)
}

function generarCodigoFabricante(fab = '') {
  const limpio = limpiarTexto(fab)
  if (!limpio) return ''

  const palabras = limpio.split(/\s+/)
  if (palabras.length >= 2) {
    return (palabras[0].charAt(0) + palabras[1].substring(0, 2)).substring(0, 3)
  }
  return limpio.substring(0, 3)
}

const codigoGenerado = computed(() => {
  const catObj = categoria.value
  const proNombre = nombre.value || ''
  const fabNombre = fabricante.value || ''

  if (!catObj || !proNombre || !fabNombre) return ''

  const catCode = (catObj.codigo_corto || limpiarTexto(catObj.nombre).substring(0, 3)).toUpperCase()
  const fabCode = generarCodigoFabricante(fabNombre)
  const prodCode = generarAcronimoProducto(proNombre)

  const codigoCompleto = `${catCode}-${fabCode}-${prodCode}`
  return codigoCompleto.substring(0, 24)
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

function guardarBorrador() {
  const borrador = {
    pasoActual: pasoActual.value,
    nombre: nombre.value,
    fabricante: fabricante.value,
    categoria: categoria.value,
    porcentajeGananciaMinimo: porcentajeGananciaMinimo.value,
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
    porcentajeGananciaMinimo.value = borrador.porcentajeGananciaMinimo ?? null
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
  [pasoActual, nombre, fabricante, categoria, porcentajeGananciaMinimo, unidadMedidaId, tipoProducto, aplicaIva, presentaciones],
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

function normalizarNombre(nombreText) {
  const limpio = String(nombreText || '').trim()
  if (!limpio) return ''
  return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase()
}

function nombreYaExiste(nombreText, excludeId = null) {
  const nombreNormalizado = normalizarNombre(nombreText).toLowerCase().replace(/\s+/g, ' ')
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

function buscarUnidades(event) {
  const query = event.query?.toLowerCase() || ''

  const unidadBaseActual = unidades.value.find(u => u.id === unidadMedidaId.value)
  const magnitudBase = unidadBaseActual?.magnitud

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
  formBase.value.precioVenta = null
}

function limpiarFormularioUnidadFija() {
  formUnidadFija.value = { nombre: '', stockMinimo: null, precioVenta: null, codigoBarra: '' }
  formBase.value = { nombre: '', stockMinimo: null, precioVenta: null, codigoBarra: '' }
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
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Unidad base requerida', mensajeHtml: 'Debes seleccionar una unidad base en el paso 1.' })
    return
  }

  if (!formBase.value.codigoBarra || formBase.value.codigoBarra.trim() === '') {
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Código de barra requerido', mensajeHtml: 'La presentación base debe tener un código de barra.' })
    return
  }

  if (nombreYaExiste(nombreBase)) {
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Nombre duplicado', mensajeHtml: `La presentación "<strong>${nombreBase}</strong>" ya existe.` })
    return
  }

  if (!formBase.value.stockMinimo || formBase.value.stockMinimo <= 0) {
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Stock mínimo requerido', mensajeHtml: 'Define un stock mínimo mayor a 0.' })
    return
  }

  if (!formBase.value.precioVenta || formBase.value.precioVenta <= 0) {
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Precio requerido', mensajeHtml: 'Define un precio de venta válido.' })
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
  mostrarExito(`¡Presentación Base "${nombreBase}" creada!`, 'Ahora puedes agregar presentaciones derivadas.')
}

function agregarDerivada() {
  const nombreDerivada = normalizarNombre(formDerivada.value.nombre)
  if (!nombreDerivada) {
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Nombre requerido', mensajeHtml: 'Ingresa un nombre para la presentación.' })
    return
  }

  if (nombreYaExiste(nombreDerivada)) {
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Nombre duplicado', mensajeHtml: `La presentación "<strong>${nombreDerivada}</strong>" ya existe.` })
    return
  }

  const factor = Number(formDerivada.value.factorConversion)
  if (!factor || factor <= 0) {
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Factor inválido', mensajeHtml: 'Ingresa un factor de conversión mayor a 0.' })
    return
  }

  const precio = formDerivada.value.precioVenta || formBase.value.precioVenta
  if (!precio || precio <= 0) {
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Precio requerido', mensajeHtml: 'Define un precio de venta válido.' })
    return
  }

  const sinIva = Number(precio)
  const iva = aplicaIva.value ? Number((sinIva * 0.13).toFixed(2)) : 0
  const conIva = aplicaIva.value ? Number((sinIva + iva).toFixed(2)) : sinIva

  presentaciones.value.push({
    nombre: nombreDerivada,
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
  mostrarExito(`¡Presentación "${nombreDerivada}" agregada!`)
}

function agregarUnidadFija() {
  const nombreFija = normalizarNombre(formUnidadFija.value.nombre)
  if (!nombreFija) {
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Nombre requerido', mensajeHtml: 'Ingresa un nombre para la presentación.' })
    return
  }

  if (nombreYaExiste(nombreFija)) {
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Nombre duplicado', mensajeHtml: `La presentación "<strong>${nombreFija}</strong>" ya existe.` })
    return
  }

  if (!formBase.value.stockMinimo || formBase.value.stockMinimo <= 0) {
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Stock mínimo requerido', mensajeHtml: 'Define un stock mínimo mayor a 0.' })
    return
  }

  if (!formBase.value.precioVenta || formBase.value.precioVenta <= 0) {
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Precio requerido', mensajeHtml: 'Define un precio de venta válido.' })
    return
  }

  const sinIva = Number(formBase.value.precioVenta)
  const iva = aplicaIva.value ? Number((sinIva * 0.13).toFixed(2)) : 0
  const conIva = aplicaIva.value ? Number((sinIva + iva).toFixed(2)) : sinIva

  presentaciones.value.push({
    nombre: nombreFija,
    codigoBarra: formBase.value.codigoBarra || '',
    equivalencia: 1,
    unidadBase: nombreUnidadBase.value,
    aplicaIva: aplicaIva.value,
    precioSinIva: sinIva,
    ivaAplicado: iva,
    precioConIva: conIva,
    es_base: false,
    stock_minimo: Number(formBase.value.stockMinimo),
  })

  limpiarFormularioUnidadFija()
  mostrarExito(`¡Presentación "${nombreFija}" agregada!`)
}



async function eliminarPresentacion(index) {
  const resultado = await mostrarConfirmacion({
    titulo: '¿Eliminar presentación?',
    mensajeHtml: '¿Deseas eliminar esta presentación de la lista?',
    icono: 'pi-trash',
    confirmButtonText: 'Sí, eliminar',
  })
  if (resultado.isConfirmed) {
    presentaciones.value.splice(index, 1)
    mostrarExito('Eliminada', 'La presentación fue removida de la lista.')
  }
}

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
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
    mostrarAlertaConfirmar({ tipo: 'advertencia', titulo: 'Sin presentaciones', mensajeHtml: 'Debe agregar al menos una presentación.' })
    return
  }

  guardando.value = true
  mostrarCargando('Guardando producto...', 'Por favor espera un momento')

  const payload = {
    codigo: codigoGenerado.value.toLowerCase(),
    nombre: nombre.value.trim().toLowerCase(),
    fabricante: fabricante.value.trim().toLowerCase(),
    tipo_producto: tipoProducto.value,
    unidad_medida_id: unidadMedidaId.value,
    aplica_iva: aplicaIva.value,
    categoria_id: categoria.value.id,
    porcentaje_ganancia_minimo: porcentajeGananciaMinimo.value !== null ? porcentajeGananciaMinimo.value : null,
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

  try {
    const [resultado] = await Promise.all([
      store.crearProducto(payload),
      new Promise((resolve) => setTimeout(resolve, 500))
    ])

    if (resultado.ok) {
      resetFormularioCompleto()
      await mostrarExito('¡Producto guardado!', 'El nuevo producto fue registrado exitosamente.')
      emit('close')
    } else if (resultado.status === 403) {
      mostrarAccesoDenegado()
    } else if (resultado.mensajes?.length) {
      const items = resultado.mensajes.map((m) => `<li>${escaparHtml(m)}</li>`).join('')
      mostrarAlertaConfirmar({
        tipo: 'advertencia',
        titulo: 'Verifica los datos',
        mensajeHtml: `<ul style="text-align:left; padding-left:1.25rem; list-style:disc">${items}</ul>`,
      })
    } else if (resultado.error) {
      mostrarError('Atención', resultado.error)
    }
  } catch (err) {
    mostrarError('Error de conexión', 'No se pudo comunicar con el servidor.')
  } finally {
    guardando.value = false
  }
}

function resetFormularioCompleto() {
  nombre.value = ''
  fabricante.value = ''
  categoria.value = null
  porcentajeGananciaMinimo.value = null
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
    mostrarError('Error', 'No se pudieron cargar las categorías.')
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