import { defineStore } from 'pinia'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { getCategorias, createCategoria, updateCategoria } from '../services/categoriaService'

// manejar errores de la API y mostrar Swal adecuado
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

export const useCategoriaStore = defineStore('categoria', () => {
  // ── Estado ─────────────────────────────────────────────────────────────────
  const categorias   = ref([])
  const cargando     = ref(false)
  const totalRecords = ref(0)
  const currentPage  = ref(1)
  const perPage      = ref(5)

<<<<<<< HEAD
  // ── Estado ─────────────────────────────────────────────────────────────────
  const categorias   = ref([])
  const cargando     = ref(false)
  const totalRecords = ref(0)
  const currentPage  = ref(1)
  const perPage      = ref(5)

=======
>>>>>>> rama_prueba
  // ── Cargar categorías con paginación del servidor ─────────────────────────
  const cargarCategorias = async (page = 1, rows = perPage.value) => {
    cargando.value = true
    try {
      const response = await getCategorias(page, rows)
<<<<<<< HEAD
=======
      
console.log('RESPONSE:', response) 
>>>>>>> rama_prueba
      categorias.value   = response.data.data
      totalRecords.value = response.data.total
      currentPage.value  = response.data.current_page
      perPage.value      = response.data.per_page
<<<<<<< HEAD

=======
>>>>>>> rama_prueba
    } catch (error) {
      if (error.response?.status === 404) {
        categorias.value   = []
        totalRecords.value = 0
        return
      }
<<<<<<< HEAD
      if (error.response?.status === 403) {
        await Swal.fire({ icon: 'error', title: 'Sin autorización', text: 'No tienes permisos para ver las categorías.', confirmButtonColor: '#2b5e3b' })
        return
      }
      await Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo cargar la lista de categorías.', confirmButtonColor: '#2b5e3b' })
=======
      await handleApiError(error, 'Error de conexión')
>>>>>>> rama_prueba
    } finally {
      cargando.value = false
    }
  }

  // ── Crear categoría ───────────────────────────────────────────────────────
  const crearCategoria = async (data) => {
    try {
      const response = await createCategoria(data)
<<<<<<< HEAD

      // Recargamos la primera página para reflejar el nuevo registro
      await cargarCategorias(1, perPage.value)

=======
      await cargarCategorias(1, perPage.value)

>>>>>>> rama_prueba
      await Swal.fire({
        icon: 'success',
        title: '¡Categoría creada!',
        text: `La categoría "${response.data.categoria.nombre}" fue registrada exitosamente.`,
        confirmButtonColor: '#2b5e3b',
        confirmButtonText: 'Aceptar',
        timer: 3000,
<<<<<<< HEAD
        timerProgressBar: true
      })
      return { ok: true }

    } catch (error) {
      if (error.response?.status === 422) {
        const mensajes = Object.values(error.response.data.errors).flat()
        return { ok: false, error: mensajes[0] }
      }
      if (error.response?.status === 403) {
        await Swal.fire({ icon: 'error', title: 'Sin autorización', text: 'No tienes permisos.', confirmButtonColor: '#2b5e3b' })
        return { ok: false }
      }
      await Swal.fire({ icon: 'error', title: 'Error al crear categoría', text: error.response?.data?.message || 'Error en el servidor.', confirmButtonColor: '#2b5e3b' })
      return { ok: false }
=======
        timerProgressBar: true,
      })
      return { ok: true }
    } catch (error) {
      return await handleApiError(error, 'Error al crear categoría')
>>>>>>> rama_prueba
    }
  }

  // ── Actualizar categoría ──────────────────────────────────────────────────
  const actualizarCategoria = async (id, data) => {
    try {
      const response = await updateCategoria(id, data)
      const index = categorias.value.findIndex((c) => c.id === id)
      if (index !== -1) categorias.value[index] = response.data.categoria

      await Swal.fire({
        icon: 'success',
        title: '¡Categoría actualizada!',
        text: 'La categoría fue actualizada exitosamente.',
        confirmButtonColor: '#2b5e3b',
        timer: 3000,
<<<<<<< HEAD
        timerProgressBar: true
      })
      return { ok: true }

    } catch (error) {
      if (error.response?.status === 422) {
        const mensajes = Object.values(error.response.data.errors).flat()
        return { ok: false, error: mensajes[0] }
      }
      await Swal.fire({ icon: 'error', title: 'Error al actualizar', text: error.response?.data?.message || 'Error en el servidor.', confirmButtonColor: '#2b5e3b' })
      return { ok: false }
=======
        timerProgressBar: true,
      })
      return { ok: true }
    } catch (error) {
      return await handleApiError(error, 'Error al actualizar')
>>>>>>> rama_prueba
    }
  }

  return {
    categorias, cargando, totalRecords, currentPage, perPage,
<<<<<<< HEAD
    cargarCategorias, crearCategoria, actualizarCategoria
=======
    cargarCategorias, crearCategoria, actualizarCategoria,
>>>>>>> rama_prueba
  }
})