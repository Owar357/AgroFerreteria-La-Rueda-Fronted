<template>
  <div
    class="p-6"
    style="font-family: 'Inter', sans-serif; background-color: #eef2e9; min-height: 100vh"
  >
    <div class="flex justify-between items-center mb-8 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-[#1a2e1f]">Turno de caja</h1>
        <p class="text-sm text-[#6d8f60] mt-1">Control y gestión del turno actual</p>
      </div>
      <div class="flex items-center gap-4">
        <div
          class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#e8efe1]"
        >
          <i class="pi pi-calendar text-[#6d8f60] text-sm"></i>
          <span class="text-sm text-[#1a2e1f]">{{ currentDate }}</span>
        </div>
        <div
          class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#e8efe1]"
        >
          <span class="text-sm text-[#6d8f60]">Estado:</span>
          <span
            :class="[
              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold',
              cajaStore.ventaAbierta ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
            ]"
          >
            <i
              class="pi pi-circle-fill text-[8px]"
              :class="cajaStore.ventaAbierta ? 'text-green-600' : 'text-red-500'"
            ></i>
            {{ cajaStore.ventaAbierta ? 'TURNO ABIERTO' : 'TURNO CERRADO' }}
          </span>
        </div>
      </div>
    </div>


    <!-- 4 Tarjetas -->
   <!-- Tarjetas: visibles solamente para administrador -->
<div v-if="esAdministrador" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
  <!-- Monto inicial -->
  <div
    class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200"
  >
    <p class="text-sm font-medium text-[#6d8f60] mb-3">
      <i class="pi pi-wallet mr-2"></i> Monto Inicial
    </p>
    <p class="text-3xl font-bold text-[#1a2e1f]">
      ${{ formatNumber(cajaStore.montoInicial) }}
    </p>
    <p class="text-xs text-[#819b74] mt-2">Efectivo al abrir caja</p>
  </div>

  <!-- Monto esperado -->
  <div
    class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200"
  >
    <p class="text-sm font-medium text-[#6d8f60] mb-3">
      <i class="pi pi-chart-line mr-2"></i> Monto Esperado
    </p>
    <p class="text-3xl font-bold text-[#1a2e1f]">
      ${{ formatNumber(montoEsperado) }}
    </p>
    <p class="text-xs text-[#819b74] mt-2">Cuánto se estima que debe haber en caja</p>
  </div>

  <!-- Monto en caja -->
  <div
    class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200"
  >
    <p class="text-sm font-medium text-[#6d8f60] mb-3">
      <i class="pi pi-money-bill mr-2"></i> Monto en Caja
    </p>
    <p class="text-3xl font-bold text-[#2b5e3b]">
      ${{ formatNumber(cajaStore.ventaAbierta ? montoEnCaja : montoRealFinal) }}
    </p>
    <p class="text-xs text-green-600 mt-2">
      {{ cajaStore.ventaAbierta ? 'Cantidad actual' : 'Valor contado al cierre' }}
    </p>
  </div>

  <!-- Diferencia -->
  <div
    class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200"
  >
    <p class="text-sm font-medium text-[#6d8f60] mb-3">
      <i class="pi pi-chart-line mr-2"></i> Diferencia
    </p>

    <p
      :class="[
        'text-3xl font-bold',
        (cajaStore.ventaAbierta ? diferencia : diferenciaFinal) === 0
          ? 'text-gray-500'
          : (cajaStore.ventaAbierta ? diferencia : diferenciaFinal) > 0
            ? 'text-green-700'
            : 'text-red-600',
      ]"
    >
      ${{ formatNumber(Math.abs(cajaStore.ventaAbierta ? diferencia : diferenciaFinal)) }}
      <span class="text-sm ml-1">
        {{
          (cajaStore.ventaAbierta ? diferencia : diferenciaFinal) < 0
            ? '(Faltante)'
            : (cajaStore.ventaAbierta ? diferencia : diferenciaFinal) > 0
              ? '(Sobrante)'
              : ''
        }}
      </span>
    </p>

    <p class="text-xs text-gray-500 mt-2">
      {{
        (cajaStore.ventaAbierta ? diferencia : diferenciaFinal) === 0
          ? 'Sin desfase'
          : (cajaStore.ventaAbierta ? diferencia : diferenciaFinal) < 0
            ? 'Falta dinero'
            : 'Sobra dinero'
      }}
    </p>
  </div>
</div>

<!-- Vista exclusiva para administrador: Resumen -->
<div v-if="esAdministrador" class="mb-8">
  <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm">
    <div class="bg-[#fafdf7] px-6 py-4 border-b border-[#e8efe1]">
      <h2 class="font-semibold text-[#1a2e1f] text-lg">
        <i class="pi pi-chart-pie mr-2 text-[#e0b354]"></i> Resumen de movimientos
      </h2>
    </div>

    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          class="flex justify-between items-center p-4 bg-[#f9fbf7] rounded-xl border border-[#dee6d6]"
        >
          <span class="text-sm text-[#5f7b58]">
            <i class="pi pi-dollar mr-2"></i> Ventas al contado:
          </span>
          <span class="ml-2 font-semibold text-[#1a2e1f] text-lg">
            ${{ formatNumber(ventasContado) }}
          </span>
        </div>

        <div
          class="flex justify-between items-center p-4 bg-[#f9fbf7] rounded-xl border border-[#dee6d6]"
        >
          <span class="text-sm text-[#5f7b58]">
            <i class="pi pi-credit-card mr-2"></i> Ventas por tarjeta:
          </span>
          <span class="ml-2 font-semibold text-[#1a2e1f] text-lg">
            ${{ formatNumber(ventasTarjeta) }}
          </span>
        </div>

        <div
          class="flex justify-between items-center p-4 bg-[#f9fbf7] rounded-xl border border-[#dee6d6]"
        >
          <span class="text-sm text-[#5f7b58]">
            <i class="pi pi-mobile mr-2"></i> Transferencia bancaria:
          </span>
          <span class="ml-2 font-semibold text-[#1a2e1f] text-lg">
            ${{ formatNumber(ventasTransferencia) }}
          </span>
        </div>

        <div
          class="flex justify-between items-center p-4 bg-[#fefcf5] rounded-xl border border-[#dee6d6]"
        >
          <span class="text-sm text-[#5f7b58]">
            <i class="pi pi-plus mr-2"></i> Otras entradas
          </span>
          <span class="ml-2 font-semibold text-green-600 text-lg">
            +${{ formatNumber(entradas) }}
          </span>
        </div>

        <div
          class="flex justify-between items-center p-4 bg-[#fefcf5] rounded-xl border border-[#dee6d6] md:col-span-2"
        >
          <span class="text-sm text-[#5f7b58]">
            <i class="pi pi-arrow-down mr-2"></i> Retiros / Gastos:
          </span>
          <span class="ml-2 font-semibold text-red-600 text-lg">
            -${{ formatNumber(retiros) }}
          </span>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t-2 border-[#e8efe1] flex justify-between items-center">
        <span class="text-base font-semibold text-[#1a2e1f]">
          <i class="pi pi-chart-line mr-2 text-[#e0b354]"></i> Total en caja
        </span>
        <span class="text-3xl font-bold text-[#2b5e3b]">
          ${{ formatNumber(totalEnCaja) }}
        </span>
      </div>
    </div>
  </div>
</div>

<!-- Vista exclusiva para cajero -->
<div v-if="esCajero" class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
  <!-- Columna izquierda: Monto inicial y acciones -->
  <div class="xl:col-span-1 flex flex-col gap-6">
    <!-- Monto inicial -->
    <div
      class="bg-white rounded-2xl p-6 border border-[#e8efe1] shadow-sm hover:shadow-md transition-all duration-200"
    >
      <p class="text-sm font-medium text-[#6d8f60] mb-3">
        <i class="pi pi-wallet mr-2"></i> Monto Inicial
      </p>
      <p class="text-3xl font-bold text-[#1a2e1f]">
        ${{ formatNumber(cajaStore.montoInicial) }}
      </p>
      <p class="text-xs text-[#819b74] mt-2">Efectivo al abrir caja</p>
    </div>

    <!-- Acciones -->
    <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm">
      <div class="bg-[#fafdf7] px-6 py-4 border-b border-[#e8efe1]">
        <h2 class="font-semibold text-[#1a2e1f] text-lg">
          <i class="pi pi-cog mr-2 text-[#e0b354]"></i> Acciones
        </h2>
        <p class="text-xs text-[#6d8f60] mt-1">Operaciones del turno</p>
      </div>

      <div class="p-5 space-y-3">
        <button
          v-if="!cajaStore.cajaAbierta"
          @click="abrirCaja"
          class="px-8 py-3 rounded-xl font-semibold text-white bg-[#2b5e3b] hover:bg-[#1f482d] transition-all flex items-center justify-center gap-2"
        >
          <i class="pi pi-unlock"></i> Apertura de caja
        </button>

        <button
          v-else-if="cajaStore.cajaAbierta && !cajaStore.ventaAbierta"
          @click="abrirVenta"
          class="w-full py-3 rounded-xl font-semibold text-white bg-[#2b5e3b] hover:bg-[#1f482d] transition-all flex items-center justify-center gap-2"
        >
          <i class="pi pi-shopping-cart"></i> Aperturar venta
        </button>

        <button
          v-else
          @click="cerrarCaja"
          class="w-full py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
        >
          <i class="pi pi-lock"></i> Cerrar caja
        </button>
      </div>
    </div>
  </div>

  <!-- Columna derecha: Últimos movimientos -->
  <div class="xl:col-span-2">
    <div class="bg-white rounded-2xl shadow-sm border border-[#e8efe1] overflow-hidden">
      <div class="bg-[#fafdf7] px-6 py-4 border-b border-[#e8efe1]">
        <h3 class="font-semibold text-[#1a2e1f]">
          <i class="pi pi-history mr-2 text-[#e0b354]"></i> Últimos movimientos
        </h3>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-[#e8f0e2]">
          <thead class="bg-[#fafdf7] text-[#3c674b] text-xs font-semibold">
            <tr>
              <th class="px-6 py-4 text-left">Hora</th>
              <th class="px-6 py-4 text-left">Concepto</th>
              <th class="px-6 py-4 text-left">Monto</th>
              <th class="px-6 py-4 text-left">Tipo</th>
           
            </tr>
          </thead>

          <tbody class="divide-y divide-[#f0f5ea] text-sm">
            <tr
              v-for="mov in movimientosRecientes"
              :key="mov.id"
              class="hover:bg-[#fefcf5] transition-colors"
            >
              <td class="px-6 py-3.5 font-medium text-[#1a2e1f]">
                {{ mov.hora }}
              </td>
              <td class="px-6 py-3.5 text-gray-600">
                {{ mov.concepto }}
              </td>
              <td
                class="px-6 py-3.5"
                :class="
                  mov.tipo === 'Ingreso'
                    ? 'text-green-700 font-semibold'
                    : 'text-red-600 font-semibold'
                "
              >
                {{ mov.monto }}
              </td>
              <td class="px-6 py-3.5">
                <span
                  :class="[
                    'text-xs px-2.5 py-1 rounded-full font-medium',
                    mov.tipo === 'Ingreso'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ mov.tipo }}
                </span>
              </td>
             
            </tr>

            <tr v-if="movimientosRecientes.length === 0">
              <td colspan="4" class="text-center py-10 text-gray-400">
                No hay movimientos registrados
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- Tabla de últimos movimientos: exclusiva para administrador -->
<div
  v-if="esAdministrador"
  class="bg-white rounded-2xl shadow-sm border border-[#e8efe1] overflow-hidden"
>
  <div class="bg-[#fafdf7] px-6 py-4 border-b border-[#e8efe1]">
    <h3 class="font-semibold text-[#1a2e1f]">
      <i class="pi pi-history mr-2 text-[#e0b354]"></i> Últimos movimientos
    </h3>
  </div>

  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-[#e8f0e2]">
      <thead class="bg-[#fafdf7] text-[#3c674b] text-xs font-semibold">
        <tr>
          <th class="px-6 py-4 text-left">Hora</th>
          <th class="px-6 py-4 text-left">Concepto</th>
          <th class="px-6 py-4 text-left">Monto</th>
          <th class="px-6 py-4 text-left">Tipo</th>
         
        </tr>
      </thead>

      <tbody class="divide-y divide-[#f0f5ea] text-sm">
        <tr
          v-for="mov in movimientosRecientes"
          :key="mov.id"
          class="hover:bg-[#fefcf5] transition-colors"
        >
          <td class="px-6 py-3.5 font-medium text-[#1a2e1f]">
            {{ mov.hora }}
          </td>
          <td class="px-6 py-3.5 text-gray-600">
            {{ mov.concepto }}
          </td>
          <td
            class="px-6 py-3.5"
            :class="
              mov.tipo === 'Ingreso'
                ? 'text-green-700 font-semibold'
                : 'text-red-600 font-semibold'
            "
          >
            {{ mov.monto }}
          </td>
          <td class="px-6 py-3.5">
            <span
              :class="[
                'text-xs px-2.5 py-1 rounded-full font-medium',
                mov.tipo === 'Ingreso'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800',
              ]"
            >
              {{ mov.tipo }}
            </span>
          </td>
        
        </tr>

        <tr v-if="movimientosRecientes.length === 0">
          <td colspan="4" class="text-center py-10 text-gray-400">
            No hay movimientos registrados
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


    <!-- Modal credenciales admin apertura de caja -->
<AdminAuthDialog
  ref="adminAuthRef"
  v-model:visible="adminAuthVisible"
  @credenciales-confirmadas="onCredencialesConfirmadas"
/>


<!--  denominaciones apertura de venta -->
<OpenCashierDialog
  v-model:visible="aperturaCajaVisible"
  :isShiftOpen="cajaStore.ventaAbierta"
  @open-cash-register="onAbrirVenta"
/>


<!-- Modal conteo cierre de caja -->
<CloseCashierDialog
  ref="closeCashierRef"
  v-model:visible="conteoVisible"
  @cuadrar="onConteoListo"
/>


<!-- Modal  para el cuadre -->
<AdminAuthDialog
  ref="adminAuthCierreRef"
  v-model:visible="adminAuthCierreVisible"
  label-boton="Abrir Cuadre"
  descripcion="Para realizar el cuadre de caja, ingrese las credenciales del administrador."
  @credenciales-confirmadas="onCredencialesCierre"
/>


<!-- Modal cierre de caja y venta-->
<CierreCajaDialog
  v-model:visible="cierreVisible"
  :datos="datosCierre"
  @cierre-exitoso="onCierreExitoso"
  @cancelar="onCancelarCierre"
/>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useCajaStore } from '@/stores/cajaStore'
import { getMovimientos } from '@/services/movimientoCajaService'

import AdminAuthDialog from '@/components/Caja/AdminAuthDialog.vue'
import OpenCashierDialog from '@/components/Caja/OpenCashierDialog.vue'
import CloseCashierDialog from '@/components/Caja/CloseCashierDialog.vue'
import CierreCajaDialog from '@/components/Caja/CierreCajaDialog.vue'


const cajaStore = useCajaStore()

const rawRole = localStorage.getItem('auth_role') || ''
const cleanRole = rawRole.replace(/[^a-zA-Z]/g, '').toLowerCase()

const rolUsuario = ref(cleanRole)


const esAdministrador = computed(() => rolUsuario.value === 'admin' || rolUsuario.value === 'administrador')
const esCajero = computed(() => rolUsuario.value === 'cajero')


const currentDate = ref(
  new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
)


const adminAuthVisible = ref(false)
const aperturaCajaVisible = ref(false)
const conteoVisible = ref(false)
const adminAuthCierreVisible = ref(false)
const cierreVisible = ref(false)


const adminAuthRef = ref(null)
const adminAuthCierreRef = ref(null)
const closeCashierRef = ref(null)


const datosCierre = ref({})
const denominacionesGuardadas = ref([])
const montoContadoGuardado = ref(0)


const ventasContado = ref(0)
const ventasTarjeta = ref(0)
const ventasTransferencia = ref(0)
const entradas = ref(0)
const retiros = ref(0)
const montoRealFinal = ref(0)
const diferenciaFinal = ref(0)



// --- NUEVO: movimientos reales desde el backend ---
const movimientosRecientes = ref([])
const cargandoMovimientos = ref(false)

const formatearHora = (fechaISO) =>
  new Date(fechaISO).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

const mapearMovimiento = (mov) => ({
  id: mov.id,
  hora: formatearHora(mov.created_at),
  concepto: mov.motivo,
  monto: `${mov.tipo_movimiento === 'ENTRADA' ? '+' : '-'}$${formatNumber(mov.monto)}`,
  tipo: mov.tipo_movimiento === 'ENTRADA' ? 'Ingreso' : 'Egreso',
  esAnulado: mov.es_anulado,
})

const cargarMovimientosRecientes = async () => {
  cargandoMovimientos.value = true
  try {
    const { data } = await getMovimientos({ per_page: 5 })
    movimientosRecientes.value = (data.data ?? []).map(mapearMovimiento)
  } catch (error) {
    console.error('Error al cargar movimientos recientes:', error)
    movimientosRecientes.value = []
  } finally {
    cargandoMovimientos.value = false
  }
}

onMounted(() => {
  cargarMovimientosRecientes()
})

// Permite refrescar la tabla desde fuera (ej. tras registrar un movimiento externo en otra vista)
defineExpose({ cargarMovimientosRecientes })




const totalVentas = computed(
  () => ventasContado.value + ventasTarjeta.value + ventasTransferencia.value,
)
const totalIngresos = computed(() => totalVentas.value + entradas.value)
const montoEsperado = computed(() => cajaStore.montoInicial + totalIngresos.value - retiros.value)
const totalEnCaja = computed(() => cajaStore.montoInicial + totalIngresos.value - retiros.value)
const montoEnCaja = computed(() => totalEnCaja.value)
const diferencia = computed(() => montoEnCaja.value - montoEsperado.value)


const formatNumber = (value) => parseFloat(value || 0).toFixed(2)



const abrirCaja = () => {
  adminAuthVisible.value = true
}


const onCredencialesConfirmadas = async (credenciales) => {
  adminAuthRef.value?.setLoading(true)
  const resultado = await cajaStore.abrirTurnoCaja(credenciales)
  adminAuthRef.value?.setLoading(false)


  if (resultado.ok) {
    adminAuthVisible.value = false
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Caja aperturada correctamente',
      showConfirmButton: false,
      timer: 2000,
      background: '#ffffff',
      color: '#1e3a2f',
      iconColor: '#2b5e3b',
    })
  } else {
    adminAuthRef.value?.mostrarError(resultado.error)
  }
}



const abrirVenta = () => {
  aperturaCajaVisible.value = true
 
}


const onAbrirVenta = async ({ total }) => {
  aperturaCajaVisible.value = false
  const resultado = await cajaStore.abrirTurnoVenta(total)


  if (resultado.ok) {
   
    
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Venta aperturada con $${formatNumber(total)}`,
      showConfirmButton: false,
      timer: 2000,
      background: '#ffffff',
      color: '#1e3a2f',
      iconColor: '#2b5e3b',
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error al aperturar venta',
      text: resultado.error,
      confirmButtonColor: '#2b5e3b',
    })
  }
}



const cerrarCaja = () => {
  conteoVisible.value = true
}



const onConteoListo = ({ monto_contado, denominaciones }) => {


  montoContadoGuardado.value = monto_contado
  denominacionesGuardadas.value = denominaciones


  conteoVisible.value = false
  adminAuthCierreVisible.value = true
}
const onCredencialesCierre = async (credenciales) => {
  adminAuthCierreRef.value?.setLoading(true)


  const resultado = await cajaStore.cuadrarTurnoVenta({
    email: credenciales.email,
    password: credenciales.password,
    monto_contado: montoContadoGuardado.value,
  })


  adminAuthCierreRef.value?.setLoading(false)


  if (resultado.ok) {
    adminAuthCierreVisible.value = false
    // Guardamos los datos del cuadre para el modal final
    datosCierre.value = resultado.data
    cierreVisible.value = true
    cargarMovimientosRecientes()

  } else {
    adminAuthCierreRef.value?.mostrarError(resultado.error)
  }
}


const onCancelarCierre = () => {
  cierreVisible.value = false
  // Restauramos las denominaciones que el usuario ya había ingresado
  closeCashierRef.value?.restaurar(denominacionesGuardadas.value)
  conteoVisible.value = true
}


const onCierreExitoso = () => {
  cierreVisible.value = false
  denominacionesGuardadas.value = []
  montoContadoGuardado.value = 0
  datosCierre.value = {}
}





</script>