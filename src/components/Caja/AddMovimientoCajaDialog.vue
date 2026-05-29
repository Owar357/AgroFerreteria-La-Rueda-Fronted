    <template>
        <Dialog v-model:visible="visible" :header="esEntrada ? 'Registrar ingreso a caja' : ' Registrar salida de caja'"
            :modal="true" :closable="true" class="w-full max-w-md" :breakpoints="{ '960px': '90vw' }"
            :style="{ borderRadius: '1rem' }" @hide="cerrarDialog">
            <div class="space-y-5 p-1">

                <!-- ===== SELECTOR TIPO MOVIMIENTO (Entrada / Salida) ===== -->
                <div class="flex w-full rounded-xl overflow-hidden border border-[#dee6d6]">
                    <button @click="tipoMovimiento = 'ENTRADA'"
                        :class="['flex-1 py-2.5 text-sm font-semibold transition-all', tipoMovimiento === 'ENTRADA' ? 'bg-green-600 text-white' : 'bg-white text-[#6d8f60]']">
                        <i class="pi pi-arrow-up mr-1 text-xs"></i> ENTRADA
                    </button>
                    <button @click="tipoMovimiento = 'SALIDA'"
                        :class="['flex-1 py-2.5 text-sm font-semibold transition-all', tipoMovimiento === 'SALIDA' ? 'bg-red-600 text-white' : 'bg-white text-[#6d8f60]']">
                        <i class="pi pi-arrow-down mr-1 text-xs"></i> SALIDA
                    </button>
                </div>
                <p class="text-xs text-[#6d8f60] mt-1">
                    <i class="pi pi-question-circle mr-1"></i>
                    {{ tipoMovimiento === 'ENTRADA' ? 'Dinero que INGRESA a la caja (depósitos, o más dinero para dar cambio.) ' : 'Dinero que SALE de la caja(pagos a proveedores, otros pagos, o gastos menores etc.)' }}
                </p>
                <!-- ===== MONTO ===== -->
                <div>
                    <label class="block text-sm font-medium text-[#1e3a2f] mb-2">
                        <i class="pi pi-dollar mr-1 text-[#e0b354]"></i> Monto
                    </label>
                    <InputNumber v-model="monto" mode="currency" currency="USD" locale="es-US" :min="0.01"
                        :max="999999.99" inputClass="w-full" class="w-full" :class="{
                            'border-green-300 focus:border-green-500': tipoMovimiento === 'ENTRADA',
                            'border-red-300 focus:border-red-500': tipoMovimiento === 'SALIDA'
                        }" placeholder="$0.00" />
                    <p class="text-xs text-[#6d8f60] mt-1">
                        <i class="pi pi-info-circle mr-1"></i>
                        Ingrese el monto en dólares (ej: 150.00)
                    </p>
                </div>

                <!-- ===== CONCEPTO / DESCRIPCIÓN ===== -->
                <div>
                    <label class="block text-sm font-medium text-[#1e3a2f] mb-2">
                        <i class="pi pi-file-edit mr-1 text-[#e0b354]"></i> Concepto / Descripción
                    </label>
                    <Textarea v-model="concepto" rows="3" autoResize class="w-full"
                        placeholder="Ej: Venta contado - Fertilizante" :maxlength="200" />
                    <div class="flex justify-between items-center mt-1">
                        <p class="text-xs text-[#6d8f60]">
                            <i class="pi pi-info-circle mr-1"></i>
                            Describa el motivo del movimiento
                        </p>
                        <span
                            :class="['text-xs font-medium', concepto.length >= 180 ? 'text-red-500' : 'text-[#6d8f60]']">
                            {{ concepto.length }}/200
                        </span>
                    </div>
                </div>
            </div>

            <!-- ===== FOOTER CON BOTONES ===== -->
            <template #footer>
                <div class="flex gap-3 justify-end">
                    <Button label="Cancelar" icon="pi pi-times" severity="secondary" text @click="cerrarDialog"
                        class="rounded-lg" />
                    <Button :label="tipoMovimiento === 'ENTRADA' ? 'Registrar ingreso' : 'Registrar salida'"
                        :icon="tipoMovimiento === 'ENTRADA' ? 'pi pi-plus-circle' : 'pi pi-minus-circle'"
                        :severity="tipoMovimiento === 'ENTRADA' ? 'success' : 'danger'" @click="registrarMovimiento"
                        :disabled="!formularioValido" class="rounded-lg" />
                </div>
            </template>

        </Dialog>
    </template>

<script setup>
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'

// ========== PROPS ==========
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    usuarioActual: {
        type: String,
        default: 'Samuel Lara'
    },
    turnoActual: {
        type: String,
        default: 'Turno 1 (08:00 - 14:00)'
    }
})

// ========== EMITS ==========
const emit = defineEmits(['update:visible', 'movimientoRegistrado'])

// ========== ESTADO LOCAL ==========
const tipoMovimiento = ref('ENTRADA')
const monto = ref(null)
const concepto = ref('')

// Opciones para SelectButton
const opcionesTipo = [
    { label: ' ENTRADA ', value: 'ENTRADA' },
    { label: ' SALIDA ', value: 'SALIDA' }
]

// ========== COMPUTADAS ==========
const visible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

const esEntrada = computed(() => tipoMovimiento.value === 'ENTRADA')

const formularioValido = computed(() => {
    return monto.value !== null && monto.value > 0 && concepto.value.trim().length >= 3
})

const fechaHoraActual = computed(() => {
    const now = new Date()
    const fecha = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const hora = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    return `${fecha} - ${hora}`
})

// ========== MÉTODOS ==========
const registrarMovimiento = () => {
    if (!formularioValido.value) return

    const nuevoMovimiento = {
        id: Date.now(),
        tipo: tipoMovimiento.value,
        monto: monto.value,
        concepto: concepto.value.trim(),
        usuario: props.usuarioActual,
        turno: props.turnoActual,
        fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }

    emit('movimientoRegistrado', nuevoMovimiento)
    cerrarDialog()
}

const cerrarDialog = () => {
    // Resetear formulario
    tipoMovimiento.value = 'ENTRADA'
    monto.value = null
    concepto.value = ''
    visible.value = false
}

// Resetear cuando se abre el diálogo
watch(visible, (nuevoValor) => {
    if (!nuevoValor) {
        tipoMovimiento.value = 'ENTRADA'
        monto.value = null
        concepto.value = ''
    }
})
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
:deep(.p-selectbutton .p-button) {
    flex: 1;
    border-radius: 0.75rem;
    font-weight: 500;
}

:deep(.p-inputnumber-input) {
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
}

:deep(.p-inputtext) {
    border-radius: 0.75rem;
}

:deep(.p-textarea) {
    border-radius: 0.75rem;
}
</style>