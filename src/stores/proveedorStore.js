import { defineStore } from 'pinia'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { getProveedores, createProveedor, updateProveedor } from '../services/proveedorService'

const handleApiError = async (error, customTitle = 'Error') => {
  const status = error.response?.status
  const responseData = error.response?.data

  if (status === 422) {
    const mensajes = Object.values(responseData.errors).flat()
    return { ok: false, error: mensajes[0] }
  }

  if (status === 403) {
    await Swal.fire({
      html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
          <div style="width:56px; height:56px; border-radius:50%; background:#fee2e2; display:flex; align-items:center; justify-content:center;">
            <i class="pi pi-ban" style="font-size:24px; color:#b91c1c;"></i>
          </div>
          <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">Sin autorización</h3>
          <p style="font-size:14px; color:#6b7280; margin:0;">No tienes permisos para realizar esta acción.</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonColor: '#2b5e3b',
      confirmButtonText: 'Entendido',
      customClass: {
        confirmButton: '!rounded-lg !font-semibold !text-sm',
        popup: '!rounded-2xl',
      },
    })
    return { ok: false }
  }

  await Swal.fire({
    icon: 'error',
    title: customTitle,
    text: responseData?.message || 'Error en el servidor.',
    confirmButtonColor: '#2b5e3b',
  })
  return { ok: false, error: responseData?.message || 'Error en el servidor.' }
}

export const useProveedorStore = defineStore('proveedor', () => {
  const proveedores  = ref([])
  const cargando     = ref(false)
  const totalRecords = ref(0)
  const currentPage  = ref(1)
  const perPage      = ref(7)

  const cargarProveedores = async (page = 1, rows = perPage.value) => {
    cargando.value = true
    try {
      const response = await getProveedores(page, rows)
      proveedores.value  = response.data.proveedores
      totalRecords.value = response.data.total
      currentPage.value  = response.data.current_page
      perPage.value      = response.data.per_page
    } catch (error) {
      if (error.response?.status === 404) {
        proveedores.value  = []
        totalRecords.value = 0
        return
      }
      await handleApiError(error, 'Error de conexión')
    } finally {
      cargando.value = false
    }
  }

  const crearProveedor = async (data) => {
    try {
      const response = await createProveedor(data)
      await cargarProveedores(1, perPage.value)
      await Swal.fire({
        icon: 'success',
        title: '¡Proveedor creado!',
        text: `El proveedor "${response.data.data.nombre}" fue registrado exitosamente.`,
        confirmButtonColor: '#2b5e3b',
        confirmButtonText: 'Aceptar',
        timer: 3000,
        timerProgressBar: true,
      })
      return { ok: true }
    } catch (error) {
      return await handleApiError(error, 'Error al crear proveedor')
    }
  }

  const actualizarProveedor = async (id, data) => {
    try {
      await updateProveedor(id, data)

      const index = proveedores.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        proveedores.value[index] = { ...proveedores.value[index], ...data }
      }

      await Swal.fire({
        icon: 'success',
        title: '¡Proveedor actualizado!',
        text: 'El proveedor fue actualizado exitosamente.',
        confirmButtonColor: '#2b5e3b',
        timer: 3000,
        timerProgressBar: true,
      })
      return { ok: true }
    } catch (error) {
      return await handleApiError(error, 'Error al actualizar proveedor')
    }
  }

  const toggleEstado = async (proveedor) => {
    const nuevoEstado = proveedor.estado === 'Activo' ? 'Inactivo' : 'Activo'
    try {
      await updateProveedor(proveedor.id, { ...proveedor, estado: nuevoEstado })
      const index = proveedores.value.findIndex((p) => p.id === proveedor.id)
      if (index !== -1) proveedores.value[index].estado = nuevoEstado
    } catch (error) {
      await handleApiError(error, 'Error al cambiar estado')
    }
  }

  return {
    proveedores, cargando, totalRecords, currentPage, perPage,
    cargarProveedores, crearProveedor, actualizarProveedor, toggleEstado,
  }
})