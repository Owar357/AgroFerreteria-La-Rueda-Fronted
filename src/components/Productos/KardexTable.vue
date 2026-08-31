    <template>
        <div class="bg-white rounded-2xl border border-[#e8efe1] overflow-hidden shadow-sm p-4">
            <!-- Encabezado Compacto y Filtro por Fechas -->
            <div
                class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-3 bg-[#fafdf7] p-3 rounded-xl border border-[#e2e8dd]">

                <!-- Título compacto -->
                <div>
                    <h2 class="text-base font-bold text-[#1e3a2f] flex items-center gap-2">
                        <i class="pi pi-history text-[#2b5e3b]"></i> Movimientos de Inventario (Kardex)
                    </h2>
                    <!--subtexto del encabezado -->
                    <p class="text-[11px] text-gray-500">
                    Cantidades registradas en <strong class="text-[#2b5e3b]">{{ unidadBase || 'Unidad Base' }}</strong>.
                    </p>
                </div>

                <!-- Filtros de Fecha (Desde / Hasta) -->
                <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <div class="flex items-center gap-1 text-xs text-[#1e3a2f]">
                        <span class="font-medium">Desde:</span>
                        <input type="date" v-model="fechaInicio"
                            class="bg-white border border-[#cbd5e1] rounded-lg text-xs px-2 py-1 text-[#1a2e1f] focus:outline-none focus:border-[#2b5e3b]" />
                    </div>

                    <div class="flex items-center gap-1 text-xs text-[#1e3a2f]">
                        <span class="font-medium">Hasta:</span>
                        <input type="date" v-model="fechaFin"
                            class="bg-white border border-[#cbd5e1] rounded-lg text-xs px-2 py-1 text-[#1a2e1f] focus:outline-none focus:border-[#2b5e3b]" />
                    </div>

                    <Button icon="pi pi-filter" label="Filtrar"
                        class="!bg-[#2b5e3b] hover:!bg-[#1f482d] !text-white text-xs font-semibold px-3 py-1.5 rounded-lg border-none transition-all cursor-pointer shadow-sm"
                        @click="aplicarFiltro" />

                    <Button icon="pi pi-refresh" v-tooltip.top="'Limpiar / Refrescar'"
                        class="!bg-white hover:!bg-[#eef2e9] !text-[#2b5e3b] !border !border-[#cfe0d2] rounded-lg p-1.5 transition-all cursor-pointer"
                        @click="limpiarFiltros" />
                </div>
            </div>

            <!-- Tabla Kardex -->
            <DataTable :value="kardexStore.cargando ? Array.from({ length: 5 }) : kardexStore.movimientos" lazy
                :paginator="!kardexStore.cargando && kardexStore.totalRecords > 0" :rows="kardexStore.perPage"
                :totalRecords="kardexStore.totalRecords" responsiveLayout="scroll" class="p-datatable-sm text-xs"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} movimientos" @page="onPageChange">
                <template #empty>
                    <div class="text-center py-8 text-gray-400">
                        No hay movimientos de Kardex registrados en el rango de fechas seleccionado.
                    </div>
                </template>

                <!-- Columna: Fecha y Hora -->
                <Column header="Fecha" class="w-[140px]">
                    <template #body="slotProps">
                        <Skeleton v-if="kardexStore.cargando" width="80%" height="1rem" />
                        <span v-else class="text-gray-600 font-medium">
                            {{ formatearFecha(slotProps.data.created_at) }}
                        </span>
                    </template>
                </Column>

                <!-- Columna: Movimiento -->
                <Column header="Movimiento">
                    <template #body="slotProps">
                        <Skeleton v-if="kardexStore.cargando" width="6rem" height="1.4rem" borderRadius="12px" />
                        <span v-else
                            :class="['px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider', obtenerBadgeClase(slotProps.data.tipo_movimiento)]">
                            {{ formatearMovimiento(slotProps.data.tipo_movimiento) }}
                        </span>
                    </template>
                </Column>

                <!-- Columna: Documento / Concepto -->
                <Column header="Documento / Concepto">
                    <template #body="slotProps">
                        <Skeleton v-if="kardexStore.cargando" width="90%" height="1rem" />
                        <div v-else class="flex flex-col">
                            <span class="font-semibold text-[#1e3a2f]">{{ slotProps.data.numero_documento || 'S/N' }}</span>
                            <span class="text-[11px] text-gray-500 truncate max-w-[200px]">{{ slotProps.data.concepto
                                }}</span>
                        </div>
                    </template>
                </Column>

                <!-- Columna: Entrada -->
                <Column header="Entrada" class="text-right">
                    <template #body="slotProps">
                        <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
                        <span v-else
                            :class="{ 'text-emerald-700 font-semibold': Number(slotProps.data.cantidad_entrada) > 0, 'text-gray-400': Number(slotProps.data.cantidad_entrada) === 0 }">
                            {{ Number(slotProps.data.cantidad_entrada) > 0 ? '+' +
                                formatDecimal(slotProps.data.cantidad_entrada, 4) : '—' }} {{ unidadBase || 'Unidad Base' }}
                        </span>
                    </template>
                </Column>

                <!-- Columna: Salida -->
                <Column header="Salida" class="text-right">
                    <template #body="slotProps">
                        <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
                        <span v-else
                            :class="{ 'text-rose-700 font-semibold': Number(slotProps.data.cantidad_salida) > 0, 'text-gray-400': Number(slotProps.data.cantidad_salida) === 0 }">
                            {{ Number(slotProps.data.cantidad_salida) > 0 ? '-' +
                                formatDecimal(slotProps.data.cantidad_salida, 4) : '—' }} {{ unidadBase || 'Unidad Base' }}
                        </span>
                    </template>
                </Column>

                <!-- Columna: Saldo Stock -->
                <Column header="Saldo Stock" class="text-right font-bold text-[#1e3a2f]">
                    <template #body="slotProps">
                        <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
                        <span v-else>
                            {{ formatDecimal(slotProps.data.cantidad_saldo, 4) }}
                        </span>
                    </template>
                </Column>

                <!-- Columna: CPP -->
                <Column header="CPP" class="text-right">
                    <template #body="slotProps">
                        <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
                        <span v-else class="text-[#3c674b] font-medium">
                            ${{ formatDecimal(slotProps.data.costo_promedio_ponderado, 4) }}
                        </span>
                    </template>
                </Column>

                <!-- Columna: Monto Saldo -->
                <Column header="Monto Saldo" class="text-right font-bold text-[#2b5e3b]">
                    <template #body="slotProps">
                        <Skeleton v-if="kardexStore.cargando" width="60%" height="1rem" class="ml-auto" />
                        <span v-else>
                            ${{ formatDecimal(slotProps.data.monto_saldo, 2) }}
                        </span>
                    </template>
                </Column>
            </DataTable>
        </div>
    </template>

    <script setup>
    import { ref, onMounted, onUnmounted, computed } from 'vue'
    import DataTable from 'primevue/datatable'
    import Column from 'primevue/column'
    import Button from 'primevue/button'
    import Skeleton from 'primevue/skeleton'
    import Swal from 'sweetalert2'
    import { useKardexStore } from '@/stores/kardexStore'

    const props = defineProps({
        productoId: { type: [Number, String], required: true },
        unidadBase: { type: String, default: 'Unidad Base' } 
    })


    const kardexStore = useKardexStore()

    // 🔹 Fechas por defecto: Inicio del mes actual y Fecha de hoy
    const obtenerPrimerDiaMes = () => {
        const d = new Date()
        return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
    }
    const obtenerHoy = () => new Date().toISOString().split('T')[0]

    const fechaInicio = ref(obtenerPrimerDiaMes())
    const fechaFin = ref(obtenerHoy())

    onMounted(async () => {
        await consultarKardex()
    })

    onUnmounted(() => {
        kardexStore.limpiarKardex()
    })

    const consultarKardex = async (page = 1) => {
        if (!props.productoId) return

        const filtros = {
            fecha_inicio: fechaInicio.value,
            fecha_fin: fechaFin.value
        }

        const res = await kardexStore.cargarKardex(props.productoId, page, kardexStore.perPage, filtros)
        if (res?.error) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: res.error,
                confirmButtonColor: '#2b5e3b',
            })
        }
    }

    const aplicarFiltro = () => consultarKardex(1)

    const limpiarFiltros = () => {
        fechaInicio.value = obtenerPrimerDiaMes()
        fechaFin.value = obtenerHoy()
        consultarKardex(1)
    }

    const onPageChange = (event) => consultarKardex(event.page + 1)

    const formatDecimal = (valor, decimales = 2) => {
        const num = Number(valor)
        return isNaN(num) ? '0.00' : num.toFixed(decimales)
    }

    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return '—'
        const f = new Date(fechaStr)
        return f.toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    const formatearMovimiento = (tipo) => {
        const mapa = {
            'ENTRADA_COMPRA': 'Entrada Compra',
            'SALIDA_VENTA': 'Salida Venta',
            'ANULACION_COMPRA': 'Anulación Compra',
            'ANULACION_VENTA': 'Anulación Venta',
            'AJUSTE_POSITIVO': 'Ajuste +',
            'AJUSTE_NEGATIVO': 'Ajuste -',
            'REEVALUACION_COSTO': 'Reevaluación',
            'CAMBIO_PRESENTACION': 'Auditoría Factor'
        }
        return mapa[tipo] || tipo
    }

    const obtenerBadgeClase = (tipo) => {
        switch (tipo) {
            case 'ENTRADA_COMPRA':
            case 'AJUSTE_POSITIVO':
                return 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            case 'SALIDA_VENTA':
            case 'AJUSTE_NEGATIVO':
                return 'bg-rose-100 text-rose-800 border border-rose-300'
            case 'ANULACION_COMPRA':
            case 'ANULACION_VENTA':
                return 'bg-amber-100 text-amber-800 border border-amber-300'
            case 'REEVALUACION_COSTO':
            case 'CAMBIO_PRESENTACION':
                return 'bg-blue-100 text-blue-800 border border-blue-300'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }
    </script>

    <style scoped>
    :deep(.p-datatable .p-datatable-thead > tr > th) {
        background-color: #fafdf7;
        color: #3c674b;
        font-weight: 600;
        font-size: 0.75rem;
        padding: 0.75rem 0.5rem;
    }

    :deep(.p-datatable .p-datatable-tbody > tr > td) {
        padding: 0.6rem 0.5rem;
        transition: background-color 0.2s;
    }

    :deep(.p-datatable .p-datatable-tbody > tr:hover) {
        background-color: #eef5e9 !important;
    }
    </style>