<template>
  <div
    class="min-h-screen p-8"
    style="font-family: 'Inter', sans-serif; background-color: #eef2e9; color: #1a2e1f"
  >
    <!-- Botón Regresar -->
    <Button
      label="Regresar"
      icon="pi pi-arrow-left"
      style="
        font-size: 22px;
        padding: 16px 40px;
        background-color: #2b5e3b;
        border-color: #2b5e3b;
        color: #ffffff;
        font-family: 'Inter', sans-serif;
      "
      @click="$emit('close')"
    />

    <!-- Header -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 style="font-size: 48px; font-weight: 600; color: #1a2e1f; margin: 0; line-height: 1.1">
          Nuevo Producto
        </h1>
        <p style="font-size: 20px; color: #6b7280; margin: 8px 0 0">
          Completa la información del producto y sus presentaciones
        </p>
      </div>
    </div>

    <!-- Sección 1: Información General -->
    <div class="rounded-2xl p-8 mb-6" style="background-color: #ffffff; border: 1px solid #e2e8dd">
      <div class="flex items-center gap-3 mb-6 pb-5" style="border-bottom: 1px solid #e2e8dd">
        <i class="pi pi-box" style="color: #e0b354; font-size: 22px"></i>
        <span style="font-size: 32px; font-weight: 600; color: #1a2e1f"
          >1. Información General del Producto</span
        >
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px">
        <!-- Nombre -->
        <div class="flex flex-col gap-2" style="grid-column: 1 / -1">
          <label style="font-size: 20px; font-weight: 500; color: #4b5563"
            >Nombre del Producto</label
          >
          <InputText
            v-model="nombre"
            style="
              width: 100%;
              background-color: #ffffff;
              border-color: #d1d5db;
              color: #1a2e1f;
              font-size: 20px;
              padding: 14px 18px;
              font-family: 'Inter', sans-serif;
            "
            onfocus="
              this.style.borderColor = '#2b5e3b'
              this.style.borderWidth = '2px'
              this.style.boxShadow = 'none'
            "
            onblur="
              this.style.borderColor = '#d1d5db'
              this.style.borderWidth = '1px'
              this.style.boxShadow = 'none'
            "
          />
        </div>

        <!-- Categoría -->
        <div class="flex flex-col gap-2">
          <label style="font-size: 20px; font-weight: 500; color: #4b5563">Categoría</label>
          <input
            v-model="categoria"
            list="lista-categorias"
            placeholder="Buscar o seleccionar categoría..."
            style="
              width: 100%;
              background-color: #ffffff;
              color: #1a2e1f;
              font-size: 20px;
              padding: 14px 18px;
              font-family: 'Inter', sans-serif;
              border-radius: 12px;
              outline: none;
              border: 1px solid #d1d5db;
            "
            onfocus="
              this.style.borderColor = '#2b5e3b'
              this.style.borderWidth = '2px'
            "
            onblur="
              this.style.borderColor = '#d1d5db'
              this.style.borderWidth = '1px'
            "
          />
          <datalist id="lista-categorias">
            <option value="Fertilizantes" />
            <option value="Herramientas" />
            <option value="Semillas" />
            <option value="Agroquímicos" />
          </datalist>
        </div>

        <!-- Fabricante -->
        <div class="flex flex-col gap-2">
          <label style="font-size: 20px; font-weight: 500; color: #4b5563">Fabricante</label>
          <InputText
            v-model="fabricante"
            placeholder="Nombre del Fabricante"
            style="
              width: 100%;
              background-color: #ffffff;
              border-color: #d1d5db;
              color: #1a2e1f;
              font-size: 20px;
              padding: 14px 18px;
              font-family: 'Inter', sans-serif;
            "
            onfocus="
              this.style.borderColor = '#2b5e3b'
              this.style.borderWidth = '2px'
              this.style.boxShadow = 'none'
            "
            onblur="
              this.style.borderColor = '#d1d5db'
              this.style.borderWidth = '1px'
              this.style.boxShadow = 'none'
            "
          />
        </div>

        <!-- Código -->
        <div class="flex flex-col gap-2" style="grid-column: 1 / -1">
          <label style="font-size: 20px; font-weight: 500; color: #4b5563">
            Código del Producto <span style="color: #6b7280; font-weight: 400"></span>
          </label>
          <InputText
            v-model="codigo"
            placeholder="Ej: PRD-0006"
            style="
              width: 100%;
              background-color: #ffffff;
              border-color: #d1d5db;
              color: #1a2e1f;
              font-size: 20px;
              padding: 14px 18px;
              font-family: 'Inter', sans-serif;
            "
            onfocus="
              this.style.borderColor = '#2b5e3b'
              this.style.borderWidth = '2px'
              this.style.boxShadow = 'none'
            "
            onblur="
              this.style.borderColor = '#d1d5db'
              this.style.borderWidth = '1px'
              this.style.boxShadow = 'none'
            "
          />
        </div>

        <!-- Unidad Base -->
        <div class="flex flex-col gap-2" style="grid-column: 1 / -1">
          <label style="font-size: 20px; font-weight: 500; color: #4b5563">Unidad Base</label>
          <InputText
            v-model="unidadBase"
            placeholder="Ej: libra, gramo, semilla, unidad..."
            style="
              width: 100%;
              background-color: #ffffff;
              border-color: #d1d5db;
              color: #1a2e1f;
              font-size: 20px;
              padding: 14px 18px;
              font-family: 'Inter', sans-serif;
            "
            onfocus="
              this.style.borderColor = '#2b5e3b'
              this.style.borderWidth = '2px'
              this.style.boxShadow = 'none'
            "
            onblur="
              this.style.borderColor = '#d1d5db'
              this.style.borderWidth = '1px'
              this.style.boxShadow = 'none'
            "
          />
          <p style="font-size: 16px; color: #6b7280; margin-top: 4px">
            Es la unidad mínima en la que se almacenará el stock. Todas las presentaciones se
            convertirán a esta unidad.
          </p>
        </div>

        <!-- Tipo de Venta -->
        <div class="flex flex-col gap-3" style="grid-column: 1 / -1">
          <label style="font-size: 20px; font-weight: 500; color: #4b5563">Tipo de Venta</label>
          <div class="flex flex-wrap gap-6">
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="tipoVenta"
                inputId="venta1"
                name="tipoVenta"
                value="UnidadFija"
              />
              <label for="venta1" style="font-size: 20px; color: #1a2e1f; cursor: pointer"
                >Unidad Fija</label
              >
            </div>
            <div class="flex items-center gap-2">
              <RadioButton v-model="tipoVenta" inputId="venta2" name="tipoVenta" value="Granel" />
              <label for="venta2" style="font-size: 20px; color: #1a2e1f; cursor: pointer"
                >Granel</label
              >
            </div>
          </div>
          <p style="font-size: 16px; color: #6b7280; margin-top: 4px">
            <span v-if="tipoVenta === 'UnidadFija'"
              >El producto se vende en cantidades exactas (ej: 1 quintal, 1 caja).</span
            >
            <span v-else-if="tipoVenta === 'Granel'"
              >El producto se vende por peso o volumen variable (ej: 2.5 libras, 300ml).</span
            >
          </p>
        </div>
      </div>
    </div>
    <!-- fin sección 1 -->

    <!-- Sección 2: Presentaciones -->
    <div class="rounded-2xl p-8 mb-6" style="background-color: #ffffff; border: 1px solid #e2e8dd">
      <div class="flex items-center gap-3 mb-6 pb-5" style="border-bottom: 1px solid #e2e8dd">
        <i class="pi pi-tags" style="color: #e0b354; font-size: 22px"></i>
        <span style="font-size: 32px; font-weight: 600; color: #1a2e1f"
          >2. Información de las Presentaciones del Producto</span
        >
      </div>

      <div class="grid grid-cols-2 gap-6">
        <!-- Nombre de la presentación -->
        <div class="flex flex-col gap-2">
          <label style="font-size: 20px; font-weight: 500; color: #4b5563"
            >Nombre de la presentación</label
          >
          <InputText
            v-model="presentacion.nombre"
            placeholder="Ej: Quintal, Arroba, Libra, 50ml, caja, sobre, lt."
            class="w-full"
            style="
              background-color: #ffffff;
              border-color: #d1d5db;
              color: #1a2e1f;
              font-size: 20px;
              padding: 14px 22px;
              font-family: 'Inter', sans-serif;
              min-width: 100%;
            "
            onfocus="
              this.style.borderColor = '#2b5e3b'
              this.style.borderWidth = '2px'
              this.style.boxShadow = 'none'
            "
            onblur="
              this.style.borderColor = '#d1d5db'
              this.style.borderWidth = '1px'
              this.style.boxShadow = 'none'
            "
          />
        </div>

        <!-- Equivalencia -->
        <div class="flex flex-col gap-2">
          <label style="font-size: 20px; font-weight: 500; color: #4b5563">
            ¿Cuántas
            <span
              style="
                background-color: #dff0e0;
                color: #1e3a2f;
                font-size: 20px;
                padding: 2px 8px;
                border-radius: 40px;
              "
              >[unidad base]</span
            >
            equivale esta presentación?
          </label>
          <div class="flex items-center gap-4">
            <InputNumber
              v-model="presentacion.equivalencia"
              placeholder="0"
              :min="0"
              inputStyle="background-color: #ffffff; border-color: #d1d5db; color: #1a2e1f; font-size: 20px; padding: 14px 18px; font-family: 'Inter', sans-serif; width: 160px; box-shadow: none;"
              :inputProps="{
                onfocus:
                  'this.style.borderColor=\'#2b5e3b\'; this.style.borderWidth=\'2px\'; this.style.boxShadow=\'none\';',
                onblur:
                  'this.style.borderColor=\'#d1d5db\'; this.style.borderWidth=\'1px\'; this.style.boxShadow=\'none\';',
              }"
            />
            <span
              class="rounded-xl px-5 py-3"
              style="
                background-color: #dff0e0;
                color: #1e3a2f;
                font-size: 20px;
                font-weight: 500;
                white-space: nowrap;
                border-radius: 40px;
              "
            >
              unidad base
            </span>
          </div>
          <p style="font-size: 16px; color: #6b7280; margin-top: 4px">
            Si la unidad base es 'libra' y esta presentación es Quintal, equivale a 100 libras.
          </p>
        </div>

        <!-- Precio Neto -->
        <div class="flex flex-col gap-2">
          <label style="font-size: 20px; font-weight: 500; color: #4b5563">Precio Neto</label>
          <InputNumber
            v-model="presentacion.precioNeto"
            placeholder="0.00"
            :min="0"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            mode="currency"
            currency="USD"
            locale="es-SV"
            inputStyle="background-color: #ffffff; border-color: #d1d5db; color: #1a2e1f; font-size: 20px; padding: 14px 18px; font-family: 'Inter', sans-serif; width: 100%; box-shadow: none;"
            :inputProps="{
              onfocus:
                'this.style.borderColor=\'#2b5e3b\'; this.style.borderWidth=\'2px\'; this.style.boxShadow=\'none\';',
              onblur:
                'this.style.borderColor=\'#d1d5db\'; this.style.borderWidth=\'1px\'; this.style.boxShadow=\'none\';',
            }"
            class="w-full"
          />
        </div>

        <!-- Checkbox IVA -->
        <div class="flex flex-col justify-end">
          <div class="flex items-center gap-3" style="padding: 14px 0">
            <Checkbox
              v-model="aplicaIva"
              :binary="true"
              inputId="iva"
              style="width: 22px; height: 22px"
            />
            <label for="iva" style="font-size: 20px; color: #1a2e1f; cursor: pointer"
              >Aplica IVA 13%</label
            >
          </div>
        </div>

        <!-- IVA Aplicado -->
        <div class="flex flex-col gap-2">
          <label style="font-size: 20px; font-weight: 500; color: #4b5563"
            >IVA Aplicado (13%)</label
          >
          <InputNumber
            :modelValue="ivaCalculado"
            :disabled="true"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            mode="currency"
            currency="USD"
            locale="es-SV"
            inputStyle="background-color: #f2f5ef; border-color: #d1d5db; color: #6b7280; font-size: 20px; padding: 14px 18px; font-family: 'Inter', sans-serif; width: 100%; cursor: not-allowed;"
            class="w-full"
          />
        </div>

        <!-- Precio Total -->
        <div class="flex flex-col gap-2">
          <label style="font-size: 20px; font-weight: 500; color: #4b5563">Precio Total</label>
          <InputNumber
            :modelValue="precioTotal"
            :disabled="true"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            mode="currency"
            currency="USD"
            locale="es-SV"
            inputStyle="background-color: #f2f5ef; border-color: #d1d5db; color: #1a2e1f; font-size: 20px; padding: 14px 18px; font-family: 'Inter', sans-serif; width: 100%; cursor: not-allowed;"
            class="w-full"
          />
        </div>
      </div>

      <!-- Botones -->
      <div class="flex gap-4 mt-8">
        <Button
          label="Añadir Nueva Presentación"
          icon="pi pi-plus"
          class="flex-1"
          style="
            font-size: 20px;
            padding: 16px;
            background-color: #2b5e3b;
            border-color: #2b5e3b;
            color: #ffffff;
            font-family: 'Inter', sans-serif;
          "
          @click="agregarPresentacion"
        />
        <Button
          label="Borrar Datos"
          icon="pi pi-trash"
          class="flex-1"
          style="
            font-size: 20px;
            padding: 16px;
            background-color: #eef2e9;
            border-color: #e2e8dd;
            color: #1a2e1f;
            font-family: 'Inter', sans-serif;
          "
          @click="borrarDatos"
        />
      </div>
    </div>
    <!-- fin sección 2 -->

    <!-- Tabla -->
    <div class="rounded-2xl p-8 mb-6" style="background-color: #ffffff; border: 1px solid #e2e8dd">
      <div class="flex items-center gap-3 mb-6 pb-5" style="border-bottom: 1px solid #e2e8dd">
        <i class="pi pi-database" style="color: #e0b354; font-size: 22px"></i>
        <span style="font-size: 32px; font-weight: 600; color: #1a2e1f"
          >Presentaciones Agregadas</span
        >
      </div>

      <DataTable
        :value="presentaciones"
        :paginator="presentaciones.length > 5"
        :rows="5"
        style="font-family: 'Inter', sans-serif; font-size: 20px"
        emptyMessage="No hay presentaciones agregadas aún"
      >
        <Column field="nombre" header="#" style="font-size: 20px" />
        <Column field="nombre" header="Nombre de presentación" style="font-size: 20px" />
        <Column field="equivalencia" header="Equivalencia" style="font-size: 20px" />
        <Column field="unidadBase" header="Unidad Base" style="font-size: 20px" />
        <Column field="precioSinIva" header="Precio Venta (S/IVA)" style="font-size: 20px" />
        <Column field="precioConIva" header="Precio Venta (C/IVA)" style="font-size: 20px" />
        <Column header="Acciones" style="font-size: 20px">
          <template #body="slotProps">
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              @click="eliminarPresentacion(slotProps.index)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Botón Guardar -->
    <div class="flex justify-end">
      <Button
        label="Guardar Producto"
        icon="pi pi-save"
        style="
          font-size: 22px;
          padding: 16px 40px;
          background-color: #2b5e3b;
          border-color: #2b5e3b;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
        "
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// Información general
const nombre = ref('')
const codigo = ref('')
const fabricante = ref('')
const unidadBase = ref('')
const categoria = ref('')
const tipoVenta = ref(null)

// Presentación actual
const aplicaIva = ref(false)
const tipoProducto = ref(null)
const presentacion = ref({
  nombre: '',
  equivalencia: null,
  precioNeto: null,
})

// Lista de presentaciones agregadas
const presentaciones = ref([])

const agregarPresentacion = () => {
  presentaciones.value.push({
    nombre: presentacion.value.nombre,
    equivalencia: presentacion.value.equivalencia,
    unidadBase: unidadBase.value,
    precioSinIva: `$${(presentacion.value.precioNeto || 0).toFixed(2)}`,
    precioConIva: `$${precioTotal.value.toFixed(2)}`,
  })
  borrarDatos()
}

const emit = defineEmits(['close'])
</script>
