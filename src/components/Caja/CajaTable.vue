<template>
  <div class="bg-[#eef2e9] min-h-screen p-3 sm:p-6 md:p-8 text-[#1a2e1f] font-['Inter',sans-serif]">

    <!-- ======================================================= -->
    <!-- VISTA MÓVIL ENCABEZADO (Solo Teléfono / Tablet)        -->
    <!-- ======================================================= -->
    <div class="block lg:hidden mb-4">
      <div class="flex flex-col gap-3">
      
       <!-- Encabezado Móvil -->
      <div class="flex items-center gap-3 mb-4">
        <div class="!w-10 !h-10 rounded-xl bg-white border border-[#e2e8dd] shadow-2xs flex items-center justify-center shrink-0">
          <i class="pi pi-chart-line text-[#2b5e3b] text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[#1a2e1f] leading-tight m-0">
            Turno de Caja
          </h1>
          <h2 class="text-xs font-semibold text-[#2b5e3b] mt-0.5 m-0 tracking-wide">
             Control y gestión del turno actual
          </h2>
        </div>
      </div>

        <!-- Badges Estado y Fecha Móvil (Inline / Ancho Ajustado) -->
        <div class="flex items-center gap-2">
          <div class="flex-1 flex items-center justify-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-[#e2e8dd] shadow-2xs">
            <i class="pi pi-calendar text-[#2b5e3b] text-xs"></i>
            <span class="text-xs font-medium text-[#1a2e1f]">{{ currentDate }}</span>
          </div>

          <div class="flex-1 flex items-center justify-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-[#e2e8dd] shadow-2xs">
            <span class="text-[11px] text-gray-500 font-medium">Estado:</span>
            <Tag
              :value="turnoAbierto ? 'ABIERTO' : 'CERRADO'"
              :severity="turnoAbierto ? 'success' : 'danger'"
              rounded
              class="!text-[9px] !px-2 !py-0.5"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO ENCABEZADO (Solo PC >= 1024px)        -->
    <!-- ======================================================= -->
    <div class="hidden lg:flex items-center justify-between gap-4 mb-6">
      <!-- Título con Icono PC -->
      <div class="flex items-center gap-3">
        <div class="!w-11 !h-11 rounded-xl bg-white border border-[#e2e8dd] shadow-sm flex items-center justify-center shrink-0">
          <i class="pi pi-wallet text-[#2b5e3b] text-xl"></i>
        </div>
        <div>
          <h1 class="text-[2rem] font-bold text-[#1a2e1f] leading-tight m-0">
            Turno de Caja
          </h1>
          <h2 class="text-sm font-semibold text-[#2b5e3b] mt-0.5 m-0 tracking-wide">
            Control y gestión del turno actual
          </h2>
        </div>
      </div>

      <!-- Badges Estado y Fecha PC -->
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#e2e8dd] shadow-2xs">
          <i class="pi pi-calendar text-[#2b5e3b] text-xs"></i>
          <span class="text-xs font-semibold text-[#1a2e1f]">{{ currentDate }}</span>
        </div>

        <div class="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#e2e8dd] shadow-2xs">
          <span class="text-xs text-gray-500 font-semibold">Estado:</span>
          <Tag
            :value="turnoAbierto ? 'TURNO ABIERTO' : 'TURNO CERRADO'"
            :severity="turnoAbierto ? 'success' : 'danger'"
            rounded
            class="!text-[10px] !px-2.5 !py-0.5"
          />
          <span v-if="turnoAbierto" class="text-xs text-gray-500 font-medium">
            · {{ cajaStore.turnoActivo.cajero_nombre }}
          </span>
        </div>
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA MÓVIL / TABLET (< 1024px)                        -->
    <!-- ======================================================= -->
    <div class="block lg:hidden space-y-4">
      
      <!-- ADMINISTRADOR MÓVIL: Tarjetas de Monto en Pareja (2x2 Inline) -->
      <div v-if="esAdministrador" class="grid grid-cols-2 gap-3 ">

        <!-- Monto Inicial -->
        <div class="bg-white rounded-2xl p-3.5 border border-[#e2e8dd] w-[48%] shadow-2xs flex flex-col justify-between">
          <div>
            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <i class="pi pi-wallet text-[#2b5e3b] text-xs"></i> Monto Inicial
            </p>
            <p class="text-xl font-bold text-[#1a2e1f] font-mono m-0">${{ formatNumber(cajaStore.montoInicial) }}</p>
          </div>
          <p class="text-[10px] text-gray-400 mt-2 m-0 leading-tight">Efectivo al abrir</p>
        </div>

        <!-- Monto Esperado -->
        <div class="bg-white rounded-2xl p-3.5 border border-[#e2e8dd] w-[48%]  shadow-2xs flex flex-col justify-between">
          <div>
            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <i class="pi pi-chart-line text-[#2b5e3b] text-xs"></i> Monto Esperado
            </p>
            <p class="text-xl font-bold text-[#1a2e1f] font-mono m-0">${{ formatNumber(montoEsperado) }}</p>
          </div>
          <p class="text-[10px] text-gray-400 mt-2 m-0 leading-tight">Estimado en caja</p>
        </div>

        <!-- Efectivo en Gaveta (Alineado con Fondo Fijo) -->
        <div class="bg-white rounded-2xl p-3.5 border border-[#e2e8dd] w-[48%] shadow-2xs flex flex-col justify-between">
          <div>
            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <i class="pi pi-money-bill text-[#2b5e3b] text-xs"></i> Efectivo Gaveta
            </p>
            <p class="text-xl font-bold text-[#2b5e3b] font-mono m-0">${{ formatNumber(montoEnCaja) }}</p>
          </div>
          <p class="text-[10px] text-[#2b5e3b] font-medium mt-2 m-0 leading-tight">Ventas + Ent. - Sal.</p>
        </div>

        <!-- Fondo Fijo (Alineado con Efectivo en Gaveta) -->
        <div class="bg-white rounded-2xl p-3.5 border border-[#e2e8dd]  w-[48%] shadow-2xs flex flex-col justify-between">
          <div>
            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <i class="pi pi-lock text-[#2b5e3b] text-xs"></i> Fondo Fijo
            </p>
            <p class="text-xl font-bold text-[#1a2e1f] font-mono m-0">${{ formatNumber(cajaStore.fondoFijo) }}</p>
          </div>
          <p class="text-[10px] text-gray-400 mt-2 m-0 leading-tight">Base obligatoria</p>
        </div>
      </div>

      <!-- ADMINISTRADOR MÓVIL: Resumen de Movimientos -->
      <div v-if="esAdministrador" class="bg-white rounded-2xl border border-[#e2e8dd] shadow-2xs overflow-hidden">
        <div class="bg-[#fbfdf9] px-4 py-3 border-b border-[#e2e8dd]">
          <h2 class="font-bold text-[#1a2e1f] text-sm flex items-center gap-2 m-0">
            <i class="pi pi-chart-pie text-[#a17923]"></i> Resumen de Movimientos
          </h2>
        </div>
        <div class="p-3.5 space-y-2.5">
          <div class="flex justify-between items-center p-2.5 bg-[#f8faf6] rounded-xl border border-[#e2e8dd]">
            <span class="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <i class="pi pi-dollar text-[#2b5e3b]"></i> Ventas contado:
            </span>
            <span class="font-bold text-[#1a2e1f] font-mono text-xs">${{ formatNumber(ventasContado) }}</span>
          </div>

          <div class="flex justify-between items-center p-2.5 bg-[#f8faf6] rounded-xl border border-[#e2e8dd]">
            <span class="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <i class="pi pi-credit-card text-[#2b5e3b]"></i> Ventas tarjeta:
            </span>
            <span class="font-bold text-[#1a2e1f] font-mono text-xs">${{ formatNumber(ventasTarjeta) }}</span>
          </div>

          <div class="flex justify-between items-center p-2.5 bg-[#f8faf6] rounded-xl border border-[#e2e8dd]">
            <span class="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <i class="pi pi-mobile text-[#2b5e3b]"></i> Transferencia:
            </span>
            <span class="font-bold text-[#1a2e1f] font-mono text-xs">${{ formatNumber(ventasTransferencia) }}</span>
          </div>

          <div class="flex justify-between items-center p-2.5 bg-[#f8faf6] rounded-xl border border-[#e2e8dd]">
            <span class="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <i class="pi pi-plus text-green-600"></i> Otras entradas:
            </span>
            <span class="font-bold text-green-700 font-mono text-xs">+${{ formatNumber(entradas) }}</span>
          </div>

          <div class="flex justify-between items-center p-2.5 bg-[#f8faf6] rounded-xl border border-[#e2e8dd]">
            <span class="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <i class="pi pi-arrow-down text-red-600"></i> Retiros / Gastos:
            </span>
            <span class="font-bold text-red-600 font-mono text-xs">-${{ formatNumber(retiros) }}</span>
          </div>

          <div class="pt-3 border-t border-[#e2e8dd] flex justify-between items-center">
            <span class="text-xs font-bold text-[#1a2e1f]">Total Vendido:</span>
            <span class="text-xl font-bold text-[#2b5e3b] font-mono">${{ formatNumber(totalEnCaja) }}</span>
          </div>
        </div>
      </div>

      <!-- CAJERO MÓVIL: Acciones -->
      <div v-if="esCajero" class="space-y-3">
        <!-- Monto Inicial Cajero -->
        <div class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <i class="pi pi-wallet text-[#2b5e3b]"></i> Monto Inicial
          </p>
          <p class="text-2xl font-bold text-[#1a2e1f] font-mono m-0">${{ formatNumber(cajaStore.montoInicial) }}</p>
        </div>

        <!-- Botones de Acción -->
        <div class="bg-white rounded-2xl p-4 border border-[#e2e8dd] shadow-2xs">
          <Button
            v-if="!cajaStore.cajaAbierta"
            icon="pi pi-unlock"
            label="Apertura de Caja"
            class="w-full !bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white !border-none rounded-xl py-3 font-semibold text-xs cursor-pointer shadow-2xs"
            @click="abrirCaja"
          />

          <div
            v-else-if="cajaStore.turnoDeOtroCajero"
            class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2"
          >
            <i class="pi pi-user text-amber-600 mt-0.5"></i>
            <span>Turno abierto por <strong>{{ cajaStore.turnoActivo.cajero_nombre }}</strong>.</span>
          </div>

          <Button
            v-else-if="!cajaStore.ventaAbierta"
            icon="pi pi-shopping-cart"
            label="Aperturar Venta"
            class="w-full !bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white !border-none rounded-xl py-3 font-semibold text-xs cursor-pointer shadow-2xs"
            @click="abrirVenta"
          />

          <Button
            v-else
            icon="pi pi-lock"
            label="Cerrar Caja"
            class="w-full !bg-red-600 hover:!bg-red-700 !text-white !border-none rounded-xl py-3 font-semibold text-xs cursor-pointer shadow-2xs"
            @click="cerrarCaja"
          />
        </div>
      </div>

      <!-- MÓVIL: Movimientos en Tarjetas -->
      <div class="bg-white rounded-2xl shadow-2xs border border-[#e2e8dd] overflow-hidden">
        <div class="bg-[#fbfdf9] px-4 py-3 border-b border-[#e2e8dd]">
          <h3 class="font-bold text-[#1a2e1f] text-sm flex items-center gap-2 m-0">
            <i class="pi pi-history text-[#a17923]"></i> Movimientos del Turno
          </h3>
        </div>

        <div class="divide-y divide-[#f1f5f0]">
          <div
            v-for="mov in movimientosRecientes"
            :key="mov.id"
            class="p-3.5 flex flex-col gap-1"
            :class="{ 'opacity-50': mov.esAnulado }"
          >
            <div class="flex justify-between items-center">
              <span class="text-xs font-mono font-bold text-gray-500">{{ mov.hora }}</span>
              <div class="flex items-center gap-1">
                <Tag
                  :value="mov.tipo"
                  :severity="mov.tipo === 'Ingreso' ? 'success' : 'danger'"
                  rounded
                  class="!text-[9px] !px-2 !py-0.5"
                />
                <Tag v-if="mov.esAnulado" value="Anulado" severity="secondary" rounded class="!text-[9px] !px-2 !py-0.5" />
              </div>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-xs text-[#1a2e1f] font-medium truncate max-w-[180px]" :class="{ 'line-through': mov.esAnulado }">
                {{ mov.concepto }}
              </span>
              <span
                class="font-mono text-xs font-bold"
                :class="[
                  mov.tipo === 'Ingreso' ? 'text-[#2b5e3b]' : 'text-red-600',
                  { 'line-through': mov.esAnulado }
                ]"
              >
                {{ mov.monto }}
              </span>
            </div>
          </div>

          <div v-if="movimientosRecientes.length === 0" class="p-8 text-center text-gray-400">
            <i class="pi pi-inbox text-3xl mb-2 opacity-40 block" />
            <span class="text-xs font-medium">
              {{ turnoAbierto ? 'No hay movimientos en este turno' : 'No hay un turno abierto' }}
            </span>
          </div>
        </div>
      </div>

    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO / PC (>= 1024px)                      -->
    <!-- ======================================================= -->
    <div class="hidden lg:block space-y-6">
      
      <!-- ADMINISTRADOR PC: 4 Tarjetas en 1 Fila -->
      <div v-if="esAdministrador" class="grid grid-cols-4 gap-4 w-full">
        <div class="bg-white rounded-2xl p-6 border border-[#e2e8dd] shadow-2xs">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i class="pi pi-wallet text-[#2b5e3b]"></i> Monto Inicial
          </p>
          <p class="text-3xl font-bold text-[#1a2e1f] font-mono m-0">${{ formatNumber(cajaStore.montoInicial) }}</p>
          <p class="text-xs text-gray-400 mt-2 m-0">Efectivo al abrir el turno</p>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-[#e2e8dd] shadow-2xs">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i class="pi pi-chart-line text-[#2b5e3b]"></i> Monto Esperado
          </p>
          <p class="text-3xl font-bold text-[#1a2e1f] font-mono m-0">${{ formatNumber(montoEsperado) }}</p>
          <p class="text-xs text-gray-400 mt-2 m-0">Estimado a haber en caja</p>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-[#e2e8dd] shadow-2xs">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i class="pi pi-money-bill text-[#2b5e3b]"></i> Efectivo en Gaveta
          </p>
          <p class="text-3xl font-bold text-[#2b5e3b] font-mono m-0">${{ formatNumber(montoEnCaja) }}</p>
          <p class="text-xs text-[#2b5e3b] font-medium mt-2 m-0">Fondo + ventas en efectivo + entradas - salidas</p>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-[#e2e8dd] shadow-2xs">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i class="pi pi-lock text-[#2b5e3b]"></i> Fondo Fijo
          </p>
          <p class="text-3xl font-bold text-[#1a2e1f] font-mono m-0">${{ formatNumber(cajaStore.fondoFijo) }}</p>
          <p class="text-xs text-gray-400 mt-2 m-0">Base obligatoria para cada turno</p>
        </div>
      </div>

      <!-- ADMINISTRADOR PC: Resumen de Movimientos -->
      <div v-if="esAdministrador" class="bg-white rounded-2xl border border-[#e2e8dd] shadow-2xs overflow-hidden">
        <div class="bg-[#fbfdf9] px-6 py-4 border-b border-[#e2e8dd]">
          <h2 class="font-bold text-[#1a2e1f] text-lg flex items-center gap-2 m-0">
            <i class="pi pi-chart-pie text-[#a17923]"></i> Resumen de Movimientos
          </h2>
        </div>

        <div class="p-6 space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex justify-between items-center p-4 bg-[#f8faf6] rounded-xl border border-[#e2e8dd]">
              <span class="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <i class="pi pi-dollar text-[#2b5e3b]"></i> Ventas al contado:
              </span>
              <span class="font-bold text-[#1a2e1f] font-mono text-lg">${{ formatNumber(ventasContado) }}</span>
            </div>

            <div class="flex justify-between items-center p-4 bg-[#f8faf6] rounded-xl border border-[#e2e8dd]">
              <span class="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <i class="pi pi-credit-card text-[#2b5e3b]"></i> Ventas por tarjeta:
              </span>
              <span class="font-bold text-[#1a2e1f] font-mono text-lg">${{ formatNumber(ventasTarjeta) }}</span>
            </div>

            <div class="flex justify-between items-center p-4 bg-[#f8faf6] rounded-xl border border-[#e2e8dd]">
              <span class="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <i class="pi pi-mobile text-[#2b5e3b]"></i> Transferencia bancaria:
              </span>
              <span class="font-bold text-[#1a2e1f] font-mono text-lg">${{ formatNumber(ventasTransferencia) }}</span>
            </div>

            <div class="flex justify-between items-center p-4 bg-[#f8faf6] rounded-xl border border-[#e2e8dd]">
              <span class="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <i class="pi pi-plus text-green-600"></i> Otras entradas:
              </span>
              <span class="font-bold text-green-700 font-mono text-lg">+${{ formatNumber(entradas) }}</span>
            </div>

            <div class="flex justify-between items-center p-4 bg-[#f8faf6] rounded-xl border border-[#e2e8dd] col-span-2">
              <span class="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <i class="pi pi-arrow-down text-red-600"></i> Retiros / Gastos:
              </span>
              <span class="font-bold text-red-600 font-mono text-lg">-${{ formatNumber(retiros) }}</span>
            </div>
          </div>

          <div class="pt-4 border-t border-[#e2e8dd] flex justify-between items-center">
            <span class="text-base font-bold text-[#1a2e1f] flex items-center gap-2">
              <i class="pi pi-chart-line text-[#a17923]"></i> Total vendido y movimientos del turno
            </span>
            <span class="text-3xl font-bold text-[#2b5e3b] font-mono">${{ formatNumber(totalEnCaja) }}</span>
          </div>
        </div>
      </div>

      <!-- CAJERO / ADMIN PC: Acciones y Tabla de Movimientos -->
      <div :class="esCajero ? 'grid grid-cols-3 gap-6' : 'w-full'">
        <!-- Columna Acciones Cajero -->
        <div v-if="esCajero" class="col-span-1 space-y-6">
          <div class="bg-white rounded-2xl p-6 border border-[#e2e8dd] shadow-2xs">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <i class="pi pi-wallet text-[#2b5e3b]"></i> Monto Inicial
            </p>
            <p class="text-3xl font-bold text-[#1a2e1f] font-mono m-0">${{ formatNumber(cajaStore.montoInicial) }}</p>
            <p class="text-xs text-gray-400 mt-2 m-0">Efectivo al abrir el turno</p>
          </div>

          <div class="bg-white rounded-2xl border border-[#e2e8dd] shadow-2xs overflow-hidden">
            <div class="bg-[#fbfdf9] px-6 py-4 border-b border-[#e2e8dd]">
              <h2 class="font-bold text-[#1a2e1f] text-base flex items-center gap-2 m-0">
                <i class="pi pi-cog text-[#a17923]"></i> Acciones
              </h2>
            </div>
            <div class="p-5 space-y-3">
              <Button
                v-if="!cajaStore.cajaAbierta"
                icon="pi pi-unlock"
                label="Apertura de Caja"
                class="w-full !bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white !border-none rounded-xl py-3 font-semibold text-sm cursor-pointer shadow-2xs"
                @click="abrirCaja"
              />

              <div
                v-else-if="cajaStore.turnoDeOtroCajero"
                class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2"
              >
                <i class="pi pi-user text-amber-600 mt-0.5"></i>
                <span>Turno abierto por <strong>{{ cajaStore.turnoActivo.cajero_nombre }}</strong>.</span>
              </div>

              <Button
                v-else-if="!cajaStore.ventaAbierta"
                icon="pi pi-shopping-cart"
                label="Aperturar Venta"
                class="w-full !bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white !border-none rounded-xl py-3 font-semibold text-sm cursor-pointer shadow-2xs"
                @click="abrirVenta"
              />

              <Button
                v-else
                icon="pi pi-lock"
                label="Cerrar Caja"
                class="w-full !bg-red-600 hover:!bg-red-700 !text-white !border-none rounded-xl py-3 font-semibold text-sm cursor-pointer shadow-2xs"
                @click="cerrarCaja"
              />
            </div>
          </div>
        </div>

        <!-- Tabla Movimientos PC -->
        <div :class="esCajero ? 'col-span-2' : 'w-full'">
          <div class="bg-white rounded-2xl shadow-2xs border border-[#e2e8dd] overflow-hidden">
            <div class="bg-[#fbfdf9] px-6 py-4 border-b border-[#e2e8dd]">
              <h3 class="font-bold text-[#1a2e1f] text-base flex items-center gap-2 m-0">
                <i class="pi pi-history text-[#a17923]"></i> Movimientos del Turno
              </h3>
            </div>

            <DataTable
              :value="movimientosRecientes"
              responsiveLayout="scroll"
              class="p-datatable-custom text-sm w-full"
            >
              <template #empty>
                <div class="flex flex-col items-center justify-center py-10 text-gray-400">
                  <i class="pi pi-inbox text-4xl mb-2 opacity-40" />
                  <span class="text-sm font-medium">
                    {{ turnoAbierto ? 'No hay movimientos en este turno' : 'No hay un turno abierto' }}
                  </span>
                </div>
              </template>

              <Column field="hora" header="Hora" class="min-w-[7rem]">
                <template #body="slotProps">
                  <span class="font-mono text-xs text-gray-600 font-semibold">{{ slotProps.data.hora }}</span>
                </template>
              </Column>

              <Column field="concepto" header="Concepto" class="min-w-[14rem]">
                <template #body="slotProps">
                  <span class="text-xs text-[#1a2e1f] font-medium" :class="{ 'line-through opacity-60': slotProps.data.esAnulado }">
                    {{ slotProps.data.concepto }}
                  </span>
                </template>
              </Column>

              <Column field="monto" header="Monto" class="min-w-[9rem]">
                <template #body="slotProps">
                  <span
                    class="font-mono text-xs font-bold"
                    :class="[
                      slotProps.data.tipo === 'Ingreso' ? 'text-[#2b5e3b]' : 'text-red-600',
                      { 'line-through opacity-60': slotProps.data.esAnulado }
                    ]"
                  >
                    {{ slotProps.data.monto }}
                  </span>
                </template>
              </Column>

              <Column field="tipo" header="Tipo" class="min-w-[9rem]">
                <template #body="slotProps">
                  <div class="flex items-center gap-1.5">
                    <Tag
                      :value="slotProps.data.tipo"
                      :severity="slotProps.data.tipo === 'Ingreso' ? 'success' : 'danger'"
                      rounded
                      class="!text-xs !px-2.5"
                    />
                    <Tag v-if="slotProps.data.esAnulado" value="Anulado" severity="secondary" rounded class="!text-xs !px-2.5" />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>

      </div>

    </div>

    <!-- DIÁLOGOS Y MODALES -->
    <AdminAuthDialog
      ref="adminAuthRef"
      v-model:visible="adminAuthVisible"
      @credenciales-confirmadas="onCredencialesConfirmadas"
    />

    <OpenCashierDialog
      ref="openCashierRef"
      v-model:visible="aperturaVentaVisible"
      :isShiftOpen="cajaStore.ventaAbierta"
      :fondoFijo="cajaStore.fondoFijo"
      :loading="cajaStore.cargando"
      @open-cash-register="onAbrirVenta"
    />

    <CloseCashierDialog
      ref="closeCashierRef"
      v-model:visible="conteoVisible"
      @cuadrar="onConteoListo"
    />

    <AdminAuthDialog
      ref="adminAuthCierreRef"
      v-model:visible="adminAuthCierreVisible"
      label-boton="Abrir Cuadre"
      descripcion="Para realizar el cuadre de caja, ingrese las credenciales del administrador."
      @credenciales-confirmadas="onCredencialesCierre"
    />

    <CierreCajaDialog
      v-model:visible="cierreVisible"
      :datos="datosCierre"
      @cierre-exitoso="onCierreExitoso"
      @cancelar="onCancelarCierre"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import { useCajaStore } from '@/stores/cajaStore'
import { usePosStore } from '@/stores/posStore'
import authService from '@/services/authService'
import { getMovimientos } from '@/services/movimientoCajaService'
import { getResumenTurno } from '@/services/cajaService'

import AdminAuthDialog from '@/components/Caja/AdminAuthDialog.vue'
import OpenCashierDialog from '@/components/Caja/OpenCashierDialog.vue'
import CloseCashierDialog from '@/components/Caja/CloseCashierDialog.vue'
import CierreCajaDialog from '@/components/Caja/CierreCajaDialog.vue'

const cajaStore = useCajaStore()
const posStore = usePosStore()

// --- Rol ---
const rolUsuario = ref((authService.getUserRole() || '').replace(/[^a-zA-Z]/g, '').toLowerCase())

const esAdministrador = computed(
  () => rolUsuario.value === 'admin' || rolUsuario.value === 'administrador',
)
const esCajero = computed(() => rolUsuario.value === 'cajero')

const turnoAbierto = computed(() => !!cajaStore.turnoActivo)

const currentDate = ref(
  new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
)

// --- Visibilidad de modales y refs ---
const adminAuthVisible = ref(false)
const aperturaVentaVisible = ref(false)
const conteoVisible = ref(false)
const adminAuthCierreVisible = ref(false)
const cierreVisible = ref(false)

const adminAuthRef = ref(null)
const adminAuthCierreRef = ref(null)
const openCashierRef = ref(null)
const closeCashierRef = ref(null)

// --- Datos del cierre ---
const datosCierre = ref({})
const denominacionesGuardadas = ref([])
const conteoGuardado = ref({})

const ventasContado = ref(0)
const ventasTarjeta = ref(0)
const ventasTransferencia = ref(0)
const entradas = ref(0)
const retiros = ref(0)
const montoEnCajaReal = ref(0)
const montoEsperadoReal = ref(0)
const totalEnCajaReal = ref(0)

const montoEsperado = computed(() => montoEsperadoReal.value)
const montoEnCaja = computed(() => montoEnCajaReal.value)
const totalEnCaja = computed(() => totalEnCajaReal.value)

const formatNumber = (value) => parseFloat(value || 0).toFixed(2)

// --- Movimientos del turno ---
const movimientosRecientes = ref([])

const formatearHora = (fechaISO) =>
  new Date(fechaISO).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

const mapearMovimiento = (mov) => ({
  id: mov.id,
  hora: formatearHora(mov.created_at),
  concepto: mov.motivo,
  monto: `${mov.tipo_movimiento === 'ENTRADA' ? '+' : '-'}$${formatNumber(mov.monto)}`,
  tipo: mov.tipo_movimiento === 'ENTRADA' ? 'Ingreso' : 'Egreso',
  esAnulado: !!mov.es_anulado,
})

const cargarMovimientosRecientes = async () => {
  try {
    const { data } = await getMovimientos({ per_page: 5, turno_actual: 1 })
    movimientosRecientes.value = (data.data ?? []).map(mapearMovimiento)
  } catch (error) {
    console.error('Error al cargar movimientos del turno:', error)
    movimientosRecientes.value = []
  }
}

const cargarResumenTurno = async () => {
  try {
    const { data } = await getResumenTurno()
    ventasContado.value = parseFloat(data.ventas_contado)
    ventasTarjeta.value = parseFloat(data.ventas_tarjeta)
    ventasTransferencia.value = parseFloat(data.ventas_transferencia)
    entradas.value = parseFloat(data.total_entradas)
    retiros.value = parseFloat(data.total_salidas)
    montoEnCajaReal.value = parseFloat(data.monto_en_caja)
    montoEsperadoReal.value = parseFloat(data.monto_esperado)
    totalEnCajaReal.value = parseFloat(data.total_en_caja)
  } catch (error) {
    console.error('Error al cargar el resumen del turno:', error)
  }
}

const refrescarDatosTurno = async () => {
  await Promise.all([cajaStore.cargarEstadoCaja(), cargarMovimientosRecientes(), cargarResumenTurno()])
}

onMounted(refrescarDatosTurno)

defineExpose({ refrescarDatosTurno })

watch(
  () => cajaStore.necesitaActualizarResumen,
  (necesitaActualizar) => {
    if (necesitaActualizar) {
      refrescarDatosTurno()
      cajaStore.necesitaActualizarResumen = false
    }
  },
)

const toast = (title) =>
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title,
    showConfirmButton: false,
    timer: 2000,
    background: '#ffffff',
    color: '#1e3a2f',
    iconColor: '#2b5e3b',
  })

// --- Apertura de caja (admin) ---
const abrirCaja = () => {
  adminAuthVisible.value = true
}

const onCredencialesConfirmadas = async (credenciales) => {
  adminAuthRef.value?.setLoading(true)
  const resultado = await cajaStore.abrirTurnoCaja(credenciales)
  adminAuthRef.value?.setLoading(false)

  if (resultado.ok) {
    adminAuthVisible.value = false
    toast('Caja aperturada correctamente')
  } else {
    adminAuthRef.value?.mostrarError(resultado.error)
  }
}

// --- Apertura de venta (cajero) ---
const abrirVenta = () => {
  aperturaVentaVisible.value = true
}

const onAbrirVenta = async ({ total, denominaciones, justificacion }) => {
  const resultado = await cajaStore.abrirTurnoVenta({ denominaciones, justificacion })

  if (resultado.ok) {
    aperturaVentaVisible.value = false
    openCashierRef.value?.reset()
    await refrescarDatosTurno()
    toast(`Venta aperturada con $${formatNumber(total)}`)
    return
  }

  Swal.fire({
    icon: 'error',
    title: resultado.requiereJustificacion ? 'Justificación requerida' : 'Error al aperturar venta',
    text: resultado.error,
    confirmButtonColor: '#2b5e3b',
  })
}

// --- Cierre ---
const cerrarCaja = () => {
  conteoVisible.value = true
}

const onConteoListo = ({ denominaciones, conteo }) => {
  denominacionesGuardadas.value = denominaciones
  conteoGuardado.value = conteo

  conteoVisible.value = false
  adminAuthCierreVisible.value = true
}

const onCredencialesCierre = async (credenciales) => {
  adminAuthCierreRef.value?.setLoading(true)

  const resultado = await cajaStore.cuadrarTurnoVenta({
    email: credenciales.email,
    password: credenciales.password,
    denominaciones: conteoGuardado.value,
  })

  adminAuthCierreRef.value?.setLoading(false)

  if (resultado.ok) {
    adminAuthCierreVisible.value = false
    datosCierre.value = resultado.data
    cierreVisible.value = true
    await refrescarDatosTurno()
  } else {
    adminAuthCierreRef.value?.mostrarError(resultado.error)
  }
}

const onCancelarCierre = () => {
  cierreVisible.value = false
  closeCashierRef.value?.restaurar(denominacionesGuardadas.value)
  conteoVisible.value = true
}

const onCierreExitoso = async () => {
  cierreVisible.value = false
  closeCashierRef.value?.reset()
  denominacionesGuardadas.value = []
  conteoGuardado.value = {}
  datosCierre.value = {}

  posStore.resetVenta()

  await refrescarDatosTurno()
}
</script>

<style>
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #fbfdf9 !important;
  color: #2b5e3b !important;
  font-weight: 600 !important;
  font-size: 0.8rem !important;
  padding: 0.75rem 1rem !important;
  border-bottom: 1px solid #e2e8dd !important;
  white-space: nowrap !important;
}

.p-datatable-custom .p-datatable-tbody > tr > td {
  padding: 0.75rem 1rem !important;
  font-size: 0.85rem !important;
  border-bottom: 1px solid #f1f5f0 !important;
}

.p-datatable-custom .p-datatable-tbody > tr:hover {
  background-color: #f4f8f3 !important;
}
</style>