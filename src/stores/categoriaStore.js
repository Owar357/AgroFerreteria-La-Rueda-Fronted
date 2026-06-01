import { defineStore } from 'pinia'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { getCategorias, createCategoria, updateCategoria } from '../services/categoriaService'

export const useCategoriaStore = defineStore('categoria', () => {

  const categorias = ref([])
  const cargando   = ref(false)

  /**
   * Carga todas las categorías desde la API
   */
  const cargarCategorias = async () => {
    cargando.value = true
    try {
      const response = await getCategorias()
      categorias.value = response.data
    } catch (error) {
      const status = error.response?.status
      
      if (status === 404) {
        categorias.value = []
        return
      }

      if (status === 403) {
        await Swal.fire({
          icon: 'error',
          title: 'Sin autorización',
          text: 'No tienes permisos para ver las categorías.',
          confirmButtonColor: '#2b5e3b'
        })
        return
      }

      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo cargar la lista de categorías. Verifica tu conexión.',
        confirmButtonColor: '#2b5e3b'
      })
    } finally {
      cargando.value = false
    }
  }

  /**
   * Crea una nueva categoría y la agrega al inicio de la lista
   */
  const crearCategoria = async (data) => {
  try {
    const response = await createCategoria(data)

    if (response.status === 201 || response.status === 200) {
      const categoriaCreada = response.data.categoria
      categorias.value.unshift(categoriaCreada)

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `¡Categoría "${categoriaCreada.nombre}" creada!`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: '#ffffff',
        color: '#1e3a2f',
        iconColor: '#2b5e3b',
      })
      return { ok: true }
    }
  } catch (error) {
    const status = error.response?.status
    const responseData = error.response?.data

    if (status === 422) {
      const mensajes = Object.values(responseData.errors).flat()
      return { ok: false, error: mensajes[0] }
    }

    if (status === 403) {
      Swal.fire({
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

    return { ok: false, error: responseData?.message || 'Ocurrió un problema en el servidor.' }
  }
}

  /**
   * Actualiza una categoría existente y sincroniza la lista local
   */
 const actualizarCategoria = async (id, data) => {
  try {
    const response = await updateCategoria(id, data)

    if (response.status === 200 || response.status === 204) {
      const categoriaActualizada = response.data?.categoria ?? { id, ...data }
      const index = categorias.value.findIndex((c) => c.id === id)

      if (index !== -1) {
        categorias.value[index] = categoriaActualizada
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: '¡Categoría actualizada!',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: '#ffffff',
        color: '#1e3a2f',
        iconColor: '#2b5e3b',
      })
      return { ok: true }
    }
  } catch (error) {
    const status = error.response?.status
    const responseData = error.response?.data

    if (status === 422) {
      const mensajes = Object.values(responseData.errors).flat()
      return { ok: false, error: mensajes[0] }
    }

    if (status === 403) {
      Swal.fire({
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

    Swal.fire({
      html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding: 8px 0;">
          <div style="width:56px; height:56px; border-radius:50%; background:#fee2e2; display:flex; align-items:center; justify-content:center;">
            <i class="pi pi-times-circle" style="font-size:24px; color:#b91c1c;"></i>
          </div>
          <h3 style="font-size:17px; font-weight:600; color:#1e3a2f; margin:0;">Error del servidor</h3>
          <p style="font-size:14px; color:#6b7280; margin:0;">${responseData?.message || 'Ocurrió un problema en el servidor.'}</p>
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
}

  return {
    categorias,
    cargando,
    cargarCategorias,
    crearCategoria,
    actualizarCategoria
  }
})