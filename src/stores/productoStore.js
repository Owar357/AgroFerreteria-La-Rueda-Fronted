import { defineStore } from 'pinia'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { getProductos, createProducto, getAllCategorias } from '../services/productoService'

export const useproductoStore = defineStore('productos', () => {
  //variables para los estado
  const productos = ref([])
  const cargando = ref(false)
  const totalRecords = ref(0)
  const currenPage = ref(1)
  const perPage = ref(8)

  //y estas son para los selects de formulario
  const categorias = ref([])

  //aqui cargamos los productos con la pagiancion del servidor
  const cargarProductos = async (page = 1, rows = perPage.value) => {
    cargando.value = true
    try {
      const response = await getProductos(page, rows)
      productos.value = response.data.data
      totalRecords.value = response.data.total
      currenPage.value = response.data.curren_Page
      perPage.value = response.data.per_page


    } catch (error) {
      if (error.response?.status === 404) {
        productos.value = []
        totalRecords.value = 0
        return
      }

      if (error.response?.status === 403) {
        await Swal.fire({
          icon: 'error',
          title: 'Sin autorización',
          text: 'No tiene los permisos para ver los productos',
          confirmButtonColor: '#2b5e3b',
        })
        return
      }
      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo cargar la lista de productos.',
        confirmButtonColor: '#2b5e3b',
      })
    } finally {
      cargando.value = false
    }
  }

  //caragamos las categoria en el select
  const cargarCategorias = async () => {
    try {
      const response = await getAllCategorias()
      //aqui el adpint no manda la data esto es por la pagiancio
      categorias.value = response.data.data ?? response.data

      
    } catch (error) {
      if (error.response?.status === 404) {
        categorias.value = []
        return
      }

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las categorias',
        confirmButtonColor: '#2b5e3b',
      })
    }
  }

  //creamos el nuevo producto se va ha ingresar
  const crearProducto = async (data) => {
    try {
      const response = await createProducto(data)

      //aqui recargamos la primera seccion para reflejar el nuevo regitro
      await cargarProductos(1, perPage.value)

      return { ok: true }


    } catch (error) {
      if (error.response?.status === 422) {
        const mensaje = Object.values(error.response.data.errors).flat()
        return { ok: false, error: mensaje[0] }
      }
      if (error.response?.status === 403) {
        await Swal.fire({
          icon: 'error',
          title: 'Sin autorización',
          text: 'No tiene permisos.',
          confirmButtonColor: '#2b5e3b',
        })
        return { ok: false }
      }
      await Swal.fire({
        icon: 'error',
        title: 'Error al crear el producto',
        text: error.response?.data?.message || 'Error del servidor.',
        confirmButtonColor: '#2b5e3b',
      })
      return { ok: false }
    }
  }

  //aEdicion pero solo de manera local para las pruebas

  const editarProductoLocal = (id, cambios) => {
    const index = productos.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      productos.value[index] = { ...productos.value[index], ...cambios}
    }
  }

  return {
    //esto es para los estadod
    productos,
    cargando,
    totalRecords,
    currenPage,
    perPage,
    categorias,

    //pra las acciones
    cargarProductos,
    cargarCategorias,
    crearProducto,
    editarProductoLocal,
  }
})
