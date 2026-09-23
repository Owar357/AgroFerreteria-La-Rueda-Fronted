<template>
  <div
    class="p-6"
    style="font-family: 'Inter', sans-serif; background-color: #eef2e9; min-height: 100vh"
  >
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-[#1a2e1f]">Movimientos de caja</h1>
        <p class="text-sm text-[#6d8f60] mt-1">Historial de entradas y salidas de efectivo</p>
      </div>
      <button
        @click="dialogVisible = true"
        :disabled="!cajaStore.puedeOperar"
        :title="cajaStore.puedeOperar ? '' : mensajeSinTurno"
        class="flex items-center gap-2 bg-[#2b5e3b] hover:bg-[#1f482d] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#2b5e3b]"
      >
        <i class="pi pi-plus"></i> Agregar
      </button>
    </div>

    <!-- Aviso: sin turno propio abierto no se pueden registrar movimientos -->
    <div
      v-if="cajaStore.estadoCargado && !cajaStore.puedeOperar"
      class="mb-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800"
    >
      <i class="pi pi-info-circle mt-0.5"></i>
      <span>{{ mensajeSinTurno }}</span>
    </div>

    <!-- BÚSQUEDA + FILTROS -->
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative w-64">
          <i
            class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#819b74] text-sm"
          ></i>
          <input
            v-model="searchText"
            placeholder="Buscar en esta página..."
            class="w-full pl-9 pr-4 py-2 rounded-lg border border-[#dee6d6] bg-white text-sm outline-none focus:border-[#e0b354]"
          />
        </div>

        <div class="flex items-center gap-2 bg-white border border-[#dee6d6] rounded-lg px-3 py-2">
          <i class="pi pi-calendar text-[#819b74] text-sm"></i>
          <span class="text-xs text-[#819b74] font-medium">Desde</span>
          <input
            type="date"
            v-model="fechaDesde"
            class="text-sm text-[#1a2e1f] outline-none bg-transparent"
          />
        </div>

        <div class="flex items-center gap-2 bg-white border border-[#dee6d6] rounded-lg px-3 py-2">
          <i class="pi pi-calendar text-[#819b74] text-sm"></i>
          <span class="text-xs text-[#819b74] font-medium">Hasta</span>
          <input
            type="date"
            v-model="fechaHasta"
            class="text-sm text-[#1a2e1f] outline-none bg-transparent"
          />
        </div>

        <button
          @click="limpiarFechas"
          class="px-4 py-1.5 rounded-lg text-sm font-medium border transition-all flex items-center gap-1 bg-white text-[#6d8f60] border-[#dee6d6] hover:bg-red-600 hover:text-white hover:border-red-600"
        >
          <i class="pi pi-times text-xs"></i> Limpiar fechas
        </button>
      </div>

      <div class="flex gap-2">
        <button
          @click="filtroTipo = 'todos'"
          :class="[
            'px-4 py-1.5 rounded-lg text-sm font-medium border transition-all',
            filtroTipo === 'todos'
              ? 'bg-[#e0b354] text-[#1a2e1f] border-[#e0b354]'
              : 'bg-white text-[#6d8f60] border-[#dee6d6] hover:bg-[#f5f9f0]',
          ]"
        >
          Todos
        </button>
        <button
          @click="filtroTipo = 'ENTRADA'"
          :class="[
            'px-4 py-1.5 rounded-lg text-sm font-medium border transition-all flex items-center gap-1',
            filtroTipo === 'ENTRADA'
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-[#6d8f60] border-[#dee6d6] hover:bg-[#f5f9f0]',
          ]"
        >
          <i class="pi pi-arrow-up text-xs"></i> Entradas
        </button>
        <button
          @click="filtroTipo = 'SALIDA'"
          :class="[
            'px-4 py-1.5 rounded-lg text-sm font-medium border transition-all flex items-center gap-1',
            filtroTipo === 'SALIDA'
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-white text-[#6d8f60] border-[#dee6d6] hover:bg-[#f5f9f0]',
          ]"
        >
          <i class="pi pi-arrow-down text-xs"></i> Salidas
        </button>
      </div>
    </div>

    <!-- TABLA -->
    <div class="bg-white rounded-2xl shadow-sm border border-[#e8efe1] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-white border-b border-[#e8efe1]">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-[#3c674b] tracking-wider">TIPO</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-[#3c674b] tracking-wider">MONTO</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-[#3c674b] tracking-wider">CONCEPTO</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-[#3c674b] tracking-wider">USUARIO</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-[#3c674b] tracking-wider">FECHA / HORA</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-[#3c674b] tracking-wider">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="cargando">
              <td colspan="6" class="text-center py-12 text-gray-400">
                <i class="pi pi-spin pi-spinner text-2xl"></i>
              </td>
            </tr>

            <tr
              v-for="(mov, index) in movimientosFiltrados"
              :key="mov.id"
              :class="[
                'border-b border-[#f0f5ea] transition-colors',
                index % 2 === 0 ? 'bg-white' : 'bg-[#fafdf7]',
                { 'opacity-60': mov.esAnulado },
              ]"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span
                    :class="[
                      'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold',
                      mov.tipo === 'ENTRADA'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800',
                    ]"
                  >
                    <i
                      :class="mov.tipo === 'ENTRADA' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
                      class="text-[10px]"
                    ></i>
                    {{ mov.tipo }}
                  </span>
                  <span
                    v-if="mov.esAnulado"
                    class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700"
                  >
                    ANULADO
                  </span>
                </div>
              </td>
              <td
                class="px-6 py-4 text-sm font-semibold"
                :class="[
                  mov.tipo === 'ENTRADA' ? 'text-green-700' : 'text-red-600',
                  { 'line-through': mov.esAnulado },
                ]"
              >
                {{ mov.tipo === 'ENTRADA' ? '+' : '-' }}${{ formatNumber(mov.monto) }}
              </td>
              <td
                class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                :class="{ 'line-through': mov.esAnulado }"
              >
                {{ mov.concepto }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ mov.usuario }}</td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600">{{ mov.fecha }}</div>
                <div class="text-xs text-gray-400">{{ mov.hora }}</div>
              </td>
              <td class="px-6 py-4">
                <button
                  v-if="puedeAnular(mov)"
                  @click="pedirAnulacion(mov)"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center gap-1"
                >
                  <i class="pi pi-ban text-[10px]"></i> Anular
                </button>
                <span v-else class="text-xs text-gray-300">—</span>
              </td>
            </tr>

            <tr v-if="!cargando && movimientosFiltrados.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-400">
                <i class="pi pi-inbox text-3xl mb-2 block"></i>
                No hay movimientos registrados
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <Paginator
        v-model:first="paginaFirst"
        :rows="POR_PAGINA"
        :totalRecords="totalRecords"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        class="border-t border-[#e8efe1] !bg-white"
        @page="onPagina"
      />

      <!-- Footer: los totales vienen del backend (todo el filtro, sin anulados) -->
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

    <AddMovimientoCaja v-model:visible="dialogVisible" @movimientoRegistrado="onMovimientoRegistrado" />

    <!-- Credenciales de admin para anular -->
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
import Paginator from 'primevue/paginator'
import Swal from 'sweetalert2'
import { getMovimientos, anularMovimiento } from '@/services/movimientoCajaService'
import { useCajaStore } from '@/stores/cajaStore'
import AddMovimientoCaja from '@/components/Caja/AddMovimientoCajaDialog.vue'
import AdminAuthDialog from '@/components/Caja/AdminAuthDialog.vue'

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

const dialogVisible = ref(false)

// Totales de TODO el filtro (calculados por el backend, sin movimientos anulados)
const totales = ref({ entradas: 0, salidas: 0, balance: 0 })

const mensajeSinTurno = computed(() =>
  cajaStore.turnoDeOtroCajero
    ? `El turno está abierto por ${cajaStore.turnoActivo.cajero_nombre}. Solo ese cajero puede registrar movimientos.`
    : 'Debes aperturar la caja y tu venta en el módulo de caja para registrar movimientos.',
)

const formatNumber = (value) => parseFloat(value || 0).toFixed(2)

// Fecha y hora en la zona horaria local (antes la fecha salía en UTC y la hora en local)
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
  } catch {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los movimientos.',
      confirmButtonColor: '#2b5e3b',
    })
  } finally {
    cargando.value = false
  }
}

onMounted(async () => {
  await Promise.all([cajaStore.cargarEstadoCaja(), cargarMovimientos()])
})

// Al cambiar cualquier filtro se vuelve a la primera página y se consulta al backend
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

// La búsqueda de texto solo filtra la página cargada (el backend aún no la soporta)
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

// Solo se anulan movimientos NO anulados del turno que sigue abierto
const puedeAnular = (mov) =>
  !mov.esAnulado && !!cajaStore.turnoActivo && mov.turnoId === cajaStore.turnoActivo.id

const pedirAnulacion = async (mov) => {
  const confirmacion = await Swal.fire({
    icon: 'warning',
    title: '¿Anular movimiento?',
    text: `${mov.tipo === 'ENTRADA' ? 'Entrada' : 'Salida'} de $${formatNumber(mov.monto)}: ${mov.concepto}`,
    showCancelButton: true,
    confirmButtonText: 'Sí, anular',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#b91c1c',
  })

  if (!confirmacion.isConfirmed) return

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

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Movimiento anulado',
      showConfirmButton: false,
      timer: 2000,
      iconColor: '#2b5e3b',
    })
  } catch (error) {
    // Credenciales inválidas, turno cerrado o efectivo insuficiente para anular una entrada
    adminAuthAnularRef.value?.mostrarError(
      error.response?.data?.message || 'No se pudo anular el movimiento.',
    )
  } finally {
    adminAuthAnularRef.value?.setLoading(false)
  }
}
</script>