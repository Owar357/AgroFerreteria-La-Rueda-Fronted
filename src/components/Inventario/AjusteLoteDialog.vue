<template>
    <Dialog v-model:visible="visible" modal header="Ajuste de Inventario por Lote" :style="{ width: '500px' }"
        :closable="!cargando">
        <div v-if="lote" class="flex flex-col gap-4 text-[#374151]" style="font-family: 'Inter', sans-serif;">

            <!-- Card resumen del lote -->
            
            <div class="bg-[#f9fafb] border border-[#e2e8dd] rounded-xl p-3.5 flex flex-col gap-1.5 text-xs">

                <div class="flex justify-between text-[#6b7280] pt-1 border-t border-[#e2e8dd]/60">
                    <span>Lote: <strong>{{ lote.lote_interno || lote.codigo }}</strong></span>
                    <span>Costo Unit. Producto: <strong>${{ parseFloat(lote.costo_unitario_compra || 0).toFixed(2)
                    }}</strong></span>
                </div>

                <div class="flex justify-between text-[#2b5e3b] font-medium pt-1">
                    <span>Stock Actual en Sistema:</span>
                    <span class="text-sm font-bold">
                        {{ parseFloat(lote.cantidad_actual || 0).toFixed(4) }} {{ nombreUnidad }}
                    </span>
                </div>
            </div>

            <!-- Tipo de Ajuste -->
            <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-[#4b5563]">Tipo de Ajuste</label>
                <Select v-model="form.tipo_ajuste" :options="tiposAjuste" optionLabel="label" optionValue="value"
                    class="w-full text-xs" />
            </div>

            <!-- Campo Dinámico según el Tipo de Ajuste -->
            <div v-if="form.tipo_ajuste === 'REEVALUACION'" class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-[#4b5563]">Nuevo Costo Unitario ($)</label>
                <InputNumber v-model="form.costo_nuevo" mode="currency" currency="USD" locale="en-US" :min="0.01"
                    :minFractionDigits="2" :maxFractionDigits="4" class="w-full" />
            </div>

            <div v-else class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-[#4b5563]">
                    Cantidad Física Real Contada (Stock Final)
                </label>
                <InputNumber v-model="form.cantidad_fisica" locale="en-US"
                    :suffix="nombreUnidad ? ` ${nombreUnidad}` : ''" :useGrouping="false" :min="0"
                    :minFractionDigits="esGranel ? 2 : 0" :maxFractionDigits="esGranel ? 4 : 0" class="w-full"
                    placeholder="Ingrese el conteo físico final" />
                <small class="text-[11px] text-[#6b7280]">
                    Diferencia calculada:
                    <strong :class="diferenciaCalculada >= 0 ? 'text-green-700' : 'text-red-600'">
                        {{ diferenciaCalculada > 0 ? '+' : '' }}{{ diferenciaCalculada.toFixed(4) }} {{ nombreUnidad }}
                    </strong>
                </small>
            </div>

            <!-- Motivo -->
            <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-[#4b5563]">Motivo del Ajuste</label>
                <Select v-model="form.motivo" :options="motivosDisponibles" placeholder="Seleccione motivo"
                    class="w-full text-xs" />
            </div>

            <!-- Observaciones -->
            <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-[#4b5563]">Observaciones (Opcional)</label>
                <Textarea v-model="form.observaciones" rows="2"
                    class="w-full text-xs p-2 border border-gray-300 rounded-lg"
                    placeholder="Detalles adicionales del ajuste..." />
            </div>

        </div>

        <template #footer>
            <div class="flex justify-end gap-2 pt-2 border-t border-[#e2e8dd]">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" outlined :disabled="cargando"
                    class="!text-xs !px-4 !py-2" @click="visible = false" />
                <Button label="Guardar Ajuste" icon="pi pi-check" :loading="cargando"
                    class="!bg-[#2b5e3b] !border-[#2b5e3b] !text-white !text-xs !px-4 !py-2" @click="guardarAjuste" />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Swal from 'sweetalert2'
import { registrarAjusteInventario } from '@/services/inventarioService'

const props = defineProps({
    modelValue: Boolean,
    lote: Object,
    nombrePresentacion: { type: String, default: '' },
    unidadMedida: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'ajuste-realizado'])

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
})

const cargando = ref(false)

const form = ref({
    tipo_ajuste: 'DISMINUCION',
    cantidad_fisica: 0,
    costo_nuevo: 0,
    motivo: '',
    observaciones: '',
})

const tiposAjuste = [
    { label: 'Disminución (Faltante / Merma / Daño)', value: 'DISMINUCION' },
    { label: 'Incremento (Sobrante / Conteo)', value: 'INCREMENTO' },
    { label: 'Reevaluación de Costo', value: 'REEVALUACION' },
]

const motivosDisponibles = computed(() => {
    if (form.value.tipo_ajuste === 'DISMINUCION') {
        return [
            'Merma por empaque dañado',
            'Producto vencido',
            'Faltante por conteo físico',
            'Desecho por evaporación/humedad',
            'Uso interno / Muestra',
        ]
    } else if (form.value.tipo_ajuste === 'INCREMENTO') {
        return [
            'Sobrante por conteo físico',
            'Ingreso por corrección de registro',
            'Devolución de lote',
        ]
    } else {
        return [
            'Actualización costo de compra',
            'Corrección de precio de lote',
        ]
    }
})

// Detección de Granel
const esGranel = computed(() => {
    return props.lote?.producto?.tipo_producto === 'GRANEL'
})


const nombreUnidad = computed(() => {

    if (props.unidadMedida) return props.unidadMedida


    if (props.nombrePresentacion) return props.nombrePresentacion


    const l = props.lote
    if (!l) return ''

    return (
        l.unidad_base ||
        l.producto?.unidad_base ||
        l.presentacion?.unidad_base ||
        l.presentacion?.unidad_medida?.abreviatura ||
        l.presentacion?.unidad_medida?.nombre ||
        l.producto?.unidad_medida?.abreviatura ||
        l.producto?.unidad_medida?.nombre ||
        ''
    )
})

const diferenciaCalculada = computed(() => {
    const stockSistema = parseFloat(props.lote?.cantidad_actual || 0)
    return (form.value.cantidad_fisica || 0) - stockSistema
})

watch(
    () => props.lote,
    (nuevoLote) => {
        if (nuevoLote) {
            form.value.tipo_ajuste = 'DISMINUCION'
            form.value.cantidad_fisica = parseFloat(nuevoLote.cantidad_actual || 0)
            form.value.costo_nuevo = parseFloat(nuevoLote.costo_unitario_compra || 0)
            form.value.motivo = ''
            form.value.observaciones = ''
        }
    },
    { immediate: true }
)

const guardarAjuste = async () => {
    if (!form.value.motivo) {
        Swal.fire({
            icon: 'warning',
            title: 'Motivo requerido',
            text: 'Por favor seleccione el motivo del ajuste.',
            confirmButtonColor: '#2b5e3b',
        })
        return
    }

    if (form.value.tipo_ajuste !== 'REEVALUACION' && form.value.cantidad_fisica < 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Cantidad inválida',
            text: 'La cantidad física no puede ser negativa.',
            confirmButtonColor: '#2b5e3b',
        })
        return
    }

    cargando.value = true

    const payload = {
        tipo_ajuste: form.value.tipo_ajuste,
        motivo: form.value.motivo,
        observaciones: form.value.observaciones || null,
        detalles: [
            {
                lote_id: props.lote.id,
                cantidad_fisica: form.value.cantidad_fisica,
                costo_nuevo: form.value.costo_nuevo,
            },
        ],
    }

    try {
        await registrarAjusteInventario(payload)

        Swal.fire({
            icon: 'success',
            title: '¡Ajuste Procesado!',
            text: 'El stock y el Kardex han sido actualizados correctamente.',
            confirmButtonColor: '#2b5e3b',
            timer: 2000,
        })

        visible.value = false
        emit('ajuste-realizado')
    } catch (error) {
        console.error(error)
        const mensaje = error.response?.data?.message || 'Error al procesar el ajuste.'
        Swal.fire({
            icon: 'error',
            title: 'Error de Ajuste',
            text: mensaje,
            confirmButtonColor: '#2b5e3b',
        })
    } finally {
        cargando.value = false
    }
}
</script>