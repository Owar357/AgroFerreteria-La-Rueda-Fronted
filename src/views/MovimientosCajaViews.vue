<template>
  <div class="p-3 sm:p-6 font-['Inter',sans-serif] bg-[#eef2e9] min-h-screen w-full overflow-x-hidden text-[#1a2e1f]">

    <!-- ENCABEZADO CON ICONO Y ESTILO -->
    <div class="flex items-center gap-3 mb-3">
      <div class="!w-10 !h-10 rounded-xl bg-[#2b5e3b] text-white flex items-center justify-center shadow-md">
        <i class="pi pi-arrow-right-arrow-left text-lg"></i>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-[#1a2e1f] m-0">Movimientos de caja</h1>
        <p class="text-xs sm:text-sm text-[#6d8f60] m-0">Historial de entradas y salidas de efectivo</p>
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- VISTA MÓVIL / TABLET (< 1024px)                         -->
    <!-- ======================================================= -->
    <div class="block lg:hidden space-y-4 w-full">

      <!-- Encabezado Móvil -->
      <div class="flex flex-col gap-3">
        <!-- Botón Agregar Móvil -->
        <button
          @click="dialogVisible = true"
          :disabled="!cajaStore.puedeOperar"
          :title="cajaStore.puedeOperar ? '' : mensajeSinTurno"
          class="w-full flex items-center justify-center gap-2 bg-[#2b5e3b] hover:bg-[#1f482d] text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="pi pi-plus text-xs"></i> Agregar Movimiento
        </button>
      </div>

      <!-- Aviso Sin Turno Móvil -->
      <div
        v-if="cajaStore.estadoCargado && !cajaStore.puedeOperar"
        class="flex items-start gap-2.5 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800"
      >
        <i class="pi pi-info-circle mt-0.5 shrink-0"></i>
        <span>{{ mensajeSinTurno }}</span>
      </div>

      <!-- Card de Búsqueda y Filtros Móvil -->
      <div class="bg-white rounded-2xl p-3.5 border border-[#dee6d6] shadow-2xs space-y-3">
        <!-- Input Búsqueda -->
        <div class="relative w-full">
          <i class="pi pi-search absolute left-3 top-4 -translate-y-1/2 text-[#819b74] text-xs"></i>
          <input
            v-model="searchText"
            placeholder="Buscar concepto o usuario..."
            class="w-full pl-5 pr-3 py-2 rounded-xl border border-[#dee6d6] bg-white text-xs outline-none focus:border-[#2b5e3b]"
          />
        </div>

        <!-- Fechas Móvil -->
        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-[#819b74] uppercase">Desde</span>
            <input
              type="date"
              v-model="fechaDesde"
              class="!w-[14rem] text-xs text-[#1a2e1f] p-2.5 rounded-xl border border-[#dee6d6] bg-white outline-none"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-[#819b74] uppercase">Hasta</span>
            <input
              type="date"
              v-model="fechaHasta"
              class="!w-[14rem] text-xs text-[#1a2e1f] p-2.5 rounded-xl border border-[#dee6d6] bg-white outline-none"
            />
          </div>
        </div>

        <button
          @click="limpiarFechas"
          class="w-full py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 bg-white text-[#6d8f60] border-[#dee6d6] hover:bg-red-600 hover:text-white cursor-pointer"
        >
          <i class="pi pi-times text-[10px]"></i> Limpiar fechas
        </button>

        <!-- Filtro Tipo Móvil -->
        <div class="grid grid-cols-3 gap-4 pt-3">
          <button
            @click="filtroTipo = 'todos'"
            :class="[
              'py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center',
              filtroTipo === 'todos'
                ? 'bg-[#e0b354] text-[#1a2e1f] border-[#e0b354]'
                : 'bg-white text-[#6d8f60] border-[#dee6d6]',
            ]"
          >
            Todos
          </button>
          <button
            @click="filtroTipo = 'ENTRADA'"
            :class="[
              'py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center',
              filtroTipo === 'ENTRADA'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-[#6d8f60] border-[#dee6d6]',
            ]"
          >
            Entradas
          </button>
          <button
            @click="filtroTipo = 'SALIDA'"
            :class="[
              'py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center',
              filtroTipo === 'SALIDA'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-[#6d8f60] border-[#dee6d6]',
            ]"
          >
            Salidas
          </button>
        </div>
      </div>

      <!-- Tarjetas de Lista Móvil -->
      <div v-if="cargando" class="text-center py-8 text-gray-400 bg-white rounded-2xl border border-[#e8efe1]">
        <i class="pi pi-spin pi-spinner text-2xl"></i>
      </div>

      <div v-else-if="movimientosFiltrados.length === 0" class="text-center py-8 text-gray-400 bg-white rounded-2xl border border-[#e8efe1]">
        <i class="pi pi-inbox text-3xl mb-1 block"></i>
        <span class="text-xs">No hay movimientos registrados</span>
      </div>

      <div v-else class="space-y-2.5">
        <div
          v-for="mov in movimientosFiltrados"
          :key="mov.id"
          class="bg-white rounded-2xl p-3.5 border border-[#e8efe1] shadow-2xs space-y-2"
          :class="{ 'opacity-60': mov.esAnulado }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span
                :class="[
                  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase',
                  mov.tipo === 'ENTRADA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                ]"
              >
                <i :class="mov.tipo === 'ENTRADA' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-[9px]"></i>
                {{ mov.tipo }}
              </span>
              <span v-if="mov.esAnulado" class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-200 text-gray-700">
                ANULADO
              </span>
            </div>

            <span
              class="text-sm font-bold"
              :class="[
                mov.tipo === 'ENTRADA' ? 'text-green-700' : 'text-red-600',
                { 'line-through': mov.esAnulado },
              ]"
            >
              {{ mov.tipo === 'ENTRADA' ? '+' : '-' }}${{ formatNumber(mov.monto) }}
            </span>
          </div>

          <!-- Concepto en contenedor colapsable/desplegable Móvil -->
          <details class="group border border-[#dee6d6] rounded-xl bg-[#f8faf7] p-2.5 text-xs transition-all">
            <summary class="font-semibold text-[#1a2e1f] cursor-pointer flex justify-between items-center list-none">
              <span class="flex items-center gap-1 text-[#2b5e3b]">
                <i class="pi pi-align-left text-[11px]"></i> Ver concepto / descripción
              </span>
              <i class="pi pi-chevron-down text-[10px] text-[#6d8f60] transition-transform group-open:rotate-180"></i>
            </summary>
            <p class="mt-2 text-gray-600 leading-relaxed border-t border-[#e2e8dd] pt-2 m-0 whitespace-normal break-words" :class="{ 'line-through': mov.esAnulado }">
              {{ mov.concepto }}
            </p>
          </details>

          <div class="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100">
            <span class="truncate max-w-[150px]"><i class="pi pi-user text-[10px] mr-1"></i>{{ mov.usuario }}</span>
            <span>{{ mov.fecha }} {{ mov.hora }}</span>
          </div>

          <div v-if="puedeAnular(mov)" class="pt-1">
            <button
              @click="pedirAnulacion(mov)"
              class="w-full py-1.5 rounded-xl text-xs font-bold border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <i class="pi pi-ban text-[10px]"></i> Anular
            </button>
          </div>
        </div>
      </div>

      <!-- Resumen Móvil -->
      <div class="bg-[#fefcf5] p-3 rounded-2xl border border-[#e8efe1] space-y-1.5 text-xs">
        <div class="flex justify-between items-center text-green-700 font-semibold">
          <span><i class="pi pi-arrow-up text-xs mr-1"></i>Entradas:</span>
          <span>${{ formatNumber(totales.entradas) }}</span>
        </div>
        <div class="flex justify-between items-center text-red-600 font-semibold">
          <span><i class="pi pi-arrow-down text-xs mr-1"></i>Salidas:</span>
          <span>${{ formatNumber(totales.salidas) }}</span>
        </div>
        <div class="flex justify-between items-center pt-1 border-t border-gray-200 font-bold">
          <span>Balance:</span>
          <span :class="totales.balance >= 0 ? 'text-green-700' : 'text-red-600'">
            ${{ formatNumber(totales.balance) }}
          </span>
        </div>
      </div>

      <!-- Paginación Móvil -->
      <Paginator
        v-model:first="paginaFirst"
        :rows="POR_PAGINA"
        :totalRecords="totalRecords"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        class="border border-[#e8efe1] !bg-white !rounded-2xl"
        @page="onPagina"
      />

    </div>

    <!-- ======================================================= -->
    <!-- VISTA ESCRITORIO (>= 1024px) - PRIMEVUE 4 + TAILWIND    -->
    <!-- ======================================================= -->
    <div class="hidden lg:block space-y-6 w-full">
      
      <!-- Aviso PC -->
      <div
        v-if="cajaStore.estadoCargado && !cajaStore.puedeOperar"
        class="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800"
      >
        <i class="pi pi-info-circle mt-0.5"></i>
        <span>{{ mensajeSinTurno }}</span>
      </div>

      <!-- CONTENEDOR UNIFICADO (FILTROS + DATATABLE) ESTILO CATEGORIAS TABLE -->
      <div class="bg-white rounded-2xl shadow-xs border border-[#e8efe1] overflow-hidden w-full">
        
        <!-- Apartado de Filtros Estático Superior PC -->
        <div class="p-5 border-b border-[#e2e8dd] bg-white">
          <div class="flex flex-col xl:flex-row items-center justify-between w-full gap-4">
            
            <!-- Grupo de Búsqueda y Fechas -->
            <div class="flex items-center gap-3 flex-wrap w-full xl:w-auto">
              <!-- Búsqueda -->
              <IconField class="w-full sm:w-[16rem]">
                <InputIcon class="pi pi-search text-[#6b7280]" />
                <InputText
                  v-model="searchText"
                  placeholder="Buscar concepto o usuario..."
                  class="w-full !bg-white !border-[#cbd5e1] text-[#1a2e1f] text-sm rounded-lg h-[2.625rem]"
                />
              </IconField>

              <!-- Fechas -->
              <div class="flex items-center gap-2 bg-white border border-[#cbd5e1] rounded-lg px-3 h-[2.625rem]">
                <i class="pi pi-calendar text-[#6b7280] text-sm"></i>
                <span class="text-xs text-[#6b7280] font-medium">Desde</span>
                <input
                  type="date"
                  v-model="fechaDesde"
                  class="text-sm text-[#1a2e1f] outline-none bg-transparent cursor-pointer"
                />
              </div>

              <div class="flex items-center gap-2 bg-white border border-[#cbd5e1] rounded-lg px-3 h-[2.625rem]">
                <i class="pi pi-calendar text-[#6b7280] text-sm"></i>
                <span class="text-xs text-[#6b7280] font-medium">Hasta</span>
                <input
                  type="date"
                  v-model="fechaHasta"
                  class="text-sm text-[#1a2e1f] outline-none bg-transparent cursor-pointer"
                />
              </div>

              <Button
                label="Limpiar fechas"
                icon="pi pi-times"
                severity="secondary"
                outlined
                class="!text-sm !h-[2.625rem] !border-[#cbd5e1] !text-[#6d8f60] hover:!text-red-600 hover:!border-red-600 !rounded-lg font-medium cursor-pointer"
                @click="limpiarFechas"
              />
            </div>

            <!-- Grupo Filtros Tipo + Botón Agregar -->
            <div class="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-end">
              <div class="flex gap-1.5">
                <Button
                  label="Todos"
                  :class="[
                    '!text-xs !h-[2.625rem] !px-3.5 !rounded-lg font-bold cursor-pointer transition-all',
                    filtroTipo === 'todos'
                      ? '!bg-[#e0b354] !text-[#1a2e1f] !border-[#e0b354]'
                      : '!bg-white !text-[#6d8f60] !border-[#cbd5e1] hover:!bg-[#f5f9f0]',
                  ]"
                  @click="filtroTipo = 'todos'"
                />
                <Button
                  label="Entradas"
                  icon="pi pi-arrow-up"
                  :class="[
                    '!text-xs !h-[2.625rem] !px-3.5 !rounded-lg font-bold cursor-pointer transition-all',
                    filtroTipo === 'ENTRADA'
                      ? '!bg-green-600 !text-white !border-green-600'
                      : '!bg-white !text-[#6d8f60] !border-[#cbd5e1] hover:!bg-[#f5f9f0]',
                  ]"
                  @click="filtroTipo = 'ENTRADA'"
                />
                <Button
                  label="Salidas"
                  icon="pi pi-arrow-down"
                  :class="[
                    '!text-xs !h-[2.625rem] !px-3.5 !rounded-lg font-bold cursor-pointer transition-all',
                    filtroTipo === 'SALIDA'
                      ? '!bg-red-600 !text-white !border-red-600'
                      : '!bg-white !text-[#6d8f60] !border-[#cbd5e1] hover:!bg-[#f5f9f0]',
                  ]"
                  @click="filtroTipo = 'SALIDA'"
                />
              </div>

              <Button
                label="+ Agregar"
                class="!bg-[#2b5e3b] hover:!bg-[#1f482d] text-white text-sm font-semibold px-5 !h-[2.625rem] rounded-lg border-none cursor-pointer shadow-md transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!cajaStore.puedeOperar"
                :title="cajaStore.puedeOperar ? '' : mensajeSinTurno"
                @click="dialogVisible = true"
              />
            </div>

          </div>
        </div>

        <!-- DataTable PrimeVue 4 PC con Desplegable -->
        <DataTable
          v-model:expandedRows="expandedRows"
          :value="cargando ? Array.from({ length: POR_PAGINA }) : movimientosFiltrados"
          dataKey="id"
          responsiveLayout="scroll"
          class="p-datatable-custom text-sm w-full"
        >
          <template #empty>
            <div class="text-center py-12 text-gray-400 text-sm">
              <i class="pi pi-inbox text-3xl mb-2 block"></i>
              No hay movimientos registrados.
            </div>
          </template>

          <!-- Flecha Desplegable para ver Concepto -->
          <Column expander style="width: 3rem" />

          <!-- Columna TIPO -->
          <Column header="TIPO" class="w-[12rem]">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="80%" height="1.8rem" borderRadius="1rem" />
              <div v-else class="flex items-center gap-2">
                <Tag
                  :value="slotProps.data.tipo"
                  :icon="slotProps.data.tipo === 'ENTRADA' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
                  :severity="slotProps.data.tipo === 'ENTRADA' ? 'success' : 'danger'"
                  class="!text-xs !px-3 !py-1 !rounded-full !font-semibold"
                />
                <Tag
                  v-if="slotProps.data.esAnulado"
                  value="ANULADO"
                  severity="secondary"
                  class="!text-xs !px-2.5 !py-1 !rounded-full !font-medium"
                />
              </div>
            </template>
          </Column>

          <!-- Columna MONTO -->
          <Column header="MONTO" class="w-[10rem]">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="60%" height="1.2rem" />
              <span
                v-else
                class="text-sm font-semibold"
                :class="[
                  slotProps.data.tipo === 'ENTRADA' ? 'text-green-700' : 'text-red-600',
                  { 'line-through': slotProps.data.esAnulado },
                ]"
              >
                {{ slotProps.data.tipo === 'ENTRADA' ? '+' : '-' }}${{ formatNumber(slotProps.data.monto) }}
              </span>
            </template>
          </Column>

          <!-- Columna USUARIO -->
          <Column header="USUARIO">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="70%" height="1.2rem" />
              <span v-else class="text-sm text-gray-700">{{ slotProps.data.usuario }}</span>
            </template>
          </Column>

          <!-- Columna FECHA / HORA -->
          <Column header="FECHA / HORA" class="w-[12rem]">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="75%" height="2rem" />
              <div v-else>
                <div class="text-sm text-gray-600">{{ slotProps.data.fecha }}</div>
                <div class="text-xs text-gray-400">{{ slotProps.data.hora }}</div>
              </div>
            </template>
          </Column>

          <!-- Columna ACCIONES -->
          <Column header="ACCIONES" class="text-right w-[9rem]">
            <template #body="slotProps">
              <Skeleton v-if="cargando" width="5rem" height="2rem" borderRadius="0.5rem" class="ml-auto" />
              <Button
                v-else-if="puedeAnular(slotProps.data)"
                icon="pi pi-ban"
                label="Anular"
                class="!bg-white hover:!bg-red-50 !text-red-600 !border !border-red-200 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer"
                @click="pedirAnulacion(slotProps.data)"
              />
              <span v-else class="text-xs text-gray-300">—</span>
            </template>
          </Column>

          <!-- Plantilla de Expansión PC (Contenido del Concepto/Descripción) -->
          <template #expansion="slotProps">
            <div class="p-4 bg-[#f8faf7] border-y border-[#e2e8dd] text-sm">
              <div class="bg-white p-4 rounded-xl border border-[#e2e8dd] shadow-xs">
                <span class="text-xs font-bold uppercase text-[#2b5e3b] tracking-wider block mb-1">
                  <i class="pi pi-file-edit mr-1"></i> Concepto / Descripción
                </span>
                <p class="text-sm text-gray-700 leading-relaxed m-0 whitespace-normal break-words" :class="{ 'line-through': slotProps.data.esAnulado }">
                  {{ slotProps.data.concepto }}
                </p>
              </div>
            </div>
          </template>
        </DataTable>

        <!-- Paginación PrimeVue 4 PC -->
        <Paginator
          v-model:first="paginaFirst"
          :rows="POR_PAGINA"
          :totalRecords="totalRecords"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          class="border-t border-[#e8efe1] !bg-white"
          @page="onPagina"
        />

        <!-- Footer totales PC -->
        <div
          class="bg-[#fefcf5] px-6 py-3 border-t border-[#e8efe1] flex justify-between items-center flex-wrap gap-3"
        >
          <div class="text-xs text-[#6d8f60]">
            Mostrando {{ movimientosFiltrados.length }} de {{ totalRecords }} movimientos
          </div>
          <div class="flex gap-4 text-xs flex-wrap">
            <span class="flex items-center gap-1">
              <i class="pi pi-arrow-up text-green-600"></i> Entradas:
              <strong>${{ formatNumber(totales.entradas) }}</strong>
            </span>
            <span class="flex items-center gap-1">
              <i class="pi pi-arrow-down text-red-600"></i> Salidas:
              <strong>${{ formatNumber(totales.salidas) }}</strong>
            </span>
            <span class="flex items-center gap-1">
              <i class="pi pi-chart-line text-[#e0b354]"></i> Balance:
              <strong :class="totales.balance >= 0 ? 'text-green-700' : 'text-red-600'">
                ${{ formatNumber(totales.balance) }}
              </strong>
            </span>
          </div>
        </div>

      </div>

    </div>

    <!-- Componentes Auxiliares -->
    <AddMovimientoCaja v-model:visible="dialogVisible" @movimientoRegistrado="onMovimientoRegistrado" />

    <AdminAuthDialog
      ref="adminAuthAnularRef"
      v-model:visible="adminAuthAnularVisible"
      label-boton="Anular movimiento"
      descripcion="Para anular el movimiento ingrese las credenciales del administrador."
      @credenciales-confirmadas="onCredencialesAnular"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'
import { getMovimientos, anularMovimiento } from '@/services/movimientoCajaService'
import { useCajaStore } from '@/stores/cajaStore'
import AddMovimientoCaja from '@/components/Caja/AddMovimientoCajaDialog.vue'
import AdminAuthDialog from '@/components/Caja/AdminAuthDialog.vue'
import { 
  mostrarExito, 
  mostrarError, 
  mostrarAccesoDenegado, 
  mostrarAlertaConfirmar 
} from '@/utils/SweetAlertService'

const POR_PAGINA = 7

const cajaStore = useCajaStore()

const cargando = ref(false)
const movimientos = ref([])
const totalRecords = ref(0)
const paginaActual = ref(1)
const paginaFirst = ref(0)

const searchText = ref('')
const filtroTipo = ref('todos')
const fechaDesde = ref('')
const fechaHasta = ref('')

const expandedRows = ref({})
const dialogVisible = ref(false)

const totales = ref({ entradas: 0, salidas: 0, balance: 0 })

const mensajeSinTurno = computed(() =>
  cajaStore.turnoDeOtroCajero
    ? `El turno está abierto por ${cajaStore.turnoActivo.cajero_nombre}. Solo ese cajero puede registrar movimientos.`
    : 'Debes aperturar la caja y tu venta en el módulo de caja para registrar movimientos.',
)

const formatNumber = (value) => parseFloat(value || 0).toFixed(2)

const formatearFecha = (fechaISO) => {
  const d = new Date(fechaISO)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

const formatearHora = (fechaISO) =>
  new Date(fechaISO).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

const cargarMovimientos = async () => {
  cargando.value = true
  try {
    const params = { page: paginaActual.value, per_page: POR_PAGINA }
    if (fechaDesde.value) params.fecha_desde = fechaDesde.value
    if (fechaHasta.value) params.fecha_hasta = fechaHasta.value
    if (filtroTipo.value !== 'todos') params.tipo_movimiento = filtroTipo.value

    const res = await getMovimientos(params)

    totalRecords.value = res.data.total
    totales.value = res.data.totales ?? { entradas: 0, salidas: 0, balance: 0 }
    movimientos.value = res.data.data.map((m) => ({
      id: m.id,
      tipo: m.tipo_movimiento,
      monto: parseFloat(m.monto),
      concepto: m.motivo,
      usuario: m.user?.name ?? '-',
      fecha: formatearFecha(m.created_at),
      hora: formatearHora(m.created_at),
      esAnulado: !!m.es_anulado,
      turnoId: m.apertura_venta_id,
    }))
  } catch (error) {
    if (error.response?.status === 403) {
      mostrarAccesoDenegado()
    } else {
      mostrarError('Error', 'No se pudieron cargar los movimientos de caja.')
    }
  } finally {
    cargando.value = false
  }
}

onMounted(async () => {
  await Promise.all([cajaStore.cargarEstadoCaja(), cargarMovimientos()])
})

watch([filtroTipo, fechaDesde, fechaHasta], () => {
  paginaFirst.value = 0
  paginaActual.value = 1
  cargarMovimientos()
})

const onPagina = (e) => {
  paginaActual.value = e.page + 1
  cargarMovimientos()
}

const limpiarFechas = () => {
  fechaDesde.value = ''
  fechaHasta.value = ''
}

const movimientosFiltrados = computed(() => {
  const b = searchText.value.trim().toLowerCase()
  if (!b) return movimientos.value

  return movimientos.value.filter(
    (m) => m.concepto.toLowerCase().includes(b) || m.usuario.toLowerCase().includes(b),
  )
})

const onMovimientoRegistrado = () => {
  cargarMovimientos()
  cajaStore.marcarActualizacionPendiente()
}

// --- Anulación (requiere credenciales de admin) ---
const adminAuthAnularVisible = ref(false)
const adminAuthAnularRef = ref(null)
const movimientoAAnular = ref(null)

const puedeAnular = (mov) =>
  !mov.esAnulado && !!cajaStore.turnoActivo && mov.turnoId === cajaStore.turnoActivo.id

const pedirAnulacion = async (mov) => {
  const confirmado = await mostrarAlertaConfirmar({
    tipo: 'advertencia',
    titulo: '¿Anular movimiento?',
    mensajeHtml: `¿Desea anular la <strong>${mov.tipo === 'ENTRADA' ? 'Entrada' : 'Salida'}</strong> de <strong>$${formatNumber(mov.monto)}</strong>?<br><span class="text-xs text-gray-500">${mov.concepto}</span>`,
    textoConfirmar: 'Sí, anular',
    textoCancelar: 'Cancelar'
  })

  if (!confirmado) return

  movimientoAAnular.value = mov
  adminAuthAnularVisible.value = true
}

const onCredencialesAnular = async (credenciales) => {
  if (!movimientoAAnular.value) return

  adminAuthAnularRef.value?.setLoading(true)

  try {
    await anularMovimiento(movimientoAAnular.value.id, credenciales)

    adminAuthAnularVisible.value = false
    movimientoAAnular.value = null

    await Promise.all([cargarMovimientos(), cajaStore.cargarEstadoCaja()])
    cajaStore.marcarActualizacionPendiente()

    mostrarExito('¡Movimiento anulado!', 'El movimiento de caja ha sido anulado exitosamente.')
  } catch (error) {
    if (error.response?.status === 403) {
      mostrarAccesoDenegado()
    } else {
      adminAuthAnularRef.value?.mostrarError(
        error.response?.data?.message || 'No se pudo anular el movimiento.',
      )
    }
  } finally {
    adminAuthAnularRef.value?.setLoading(false)
  }
}
</script>

<style>
/* Estilos globales para la tabla de PrimeVue */
.p-datatable-custom .p-datatable-thead > tr > th {
  background-color: #ffffff !important;
  color: #3c674b !important;
  border-bottom: 0.0625rem solid #e8efe1 !important;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 1rem 1.5rem;
  white-space: nowrap !important;
}

.p-datatable-custom .p-datatable-tbody > tr {
  background-color: #ffffff !important;
  color: #1a2e1f !important;
  border-bottom: 0.0625rem solid #f0f5ea !important;
}

.p-datatable-custom .p-datatable-tbody > tr:nth-child(even) {
  background-color: #fafdf7 !important;
}

.p-datatable-custom .p-datatable-tbody > tr:hover {
  background-color: #f4f7f2 !important;
}
</style>