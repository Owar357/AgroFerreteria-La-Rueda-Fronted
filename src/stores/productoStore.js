import { defineStore } from 'pinia'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import {
  getProductos,
  createProducto,
  getAllCategorias,
  getAllProveedores,
} from '../services/productoService'

export const useproductoStore = defineStore('productos', () => {
  //variables para los estado
  const productos    = ref([])
  const cargando     = ref([false])
  const totalRecords = ref([0])
  const currenPage   = [1]
  const perPage      = ref([8])

  //y estas son para los selects de formulario
  const categorias = ref([])
  const proveedores = ref([])


  //aqui cargamos los productos con la pagiancion del servidor
  const cargarProductos = async (page = 1, rows = perPage.value) => {
    cargando.value = true
    try{
        const response = await getProductos(page, rows)
        productos.value = response.data.data
        totalRecords.value = response.data.total
        currenPage.value = response.data.currenPage
        perPage.value = response.data.per_page

    }catch (error) {
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
                comfirmButtonColor: '#2b5e3b'
            })
            return
        }
            await Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo cargar la lista de productos.',
                confirmButtonColor: '2b5e3b'
            })
    }finally {
        cargando.value = false
    }
  }

  //caragamos las categoria en el select 
  const cargarCategorias = async () => {
    try {
        const response = await getAllCategorias()
        //aqui el adpint no manda la data esto es por la pagiancio
        categorias.value = response.data.data ?? response.data
    }catch (error) {
        if (error.response?.status === 404) {
            categorias.value = []
            return
        }

        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las categorias',
            confirmButtonColor: '#2b5e3b'
        })
    }
  }

  //carga de los proveedres para el select
  const cargarProveedores = async () => {
    try {
        const response = await getAllProveedores()
        proveedores.value = response.data.proveedores ?? response.data.data ?? response.data
    }catch (error) {
        if (error) {
            proveedores.value = []
            return
        }

        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los proveedores',
            confirmButtonColor: '#2b5e3b'
        })
    }
  }

  //creamos el nuevo producto se va ha ingresar
  const crearProducto = async () => {
    try {
        const response = await createProducto(data)

        //aqui recargamos la primera seccion para reflejar el nuevo regitro
        await cargarProductos(1, perPage.value)

        await Swal.fire({
            icon: 'success',
            title: '¡Producto creado!',
            text: `El producto "${response.data.producto.nombre}" fue registrado exitosamente.`,
            confirmButtonColor: '#2b5e3b',
            confirmButtonText: 'Aceptar',
            timer: 3000,
            timerProgressBar: true
        })
        return { ok: true }
    }catch {
        if (error.reponse?.status === 422) {
            const mensaje = Object.value(error.response.data.errors).flat()
            return { ok: false, error:mensaje[0] }
        }
        if (error.response?.status === 403) {
            await Swal.fire({
                icon: 'error',
                title: 'Sin autorización',
                text: 'Lo sentimos no tiene permisos.',
                confirmButtonColor:'#2b5e3b'
            })
            return { ok: false }
        }

        await Swal.fire({
            icon: 'error',
            title: 'Error al crear el producto',
            text: error.reponse?.data?.menssage || 'Error del servidor.',
            confirmButtonColor: '#2b5e3b'
        })
        return { ok: false }
    }
  }

  return {
    //esto es para los estadod
    productos, cargando, totalRecords, currenPage, perPage,
    categorias, proveedores,

    //pra las acciones
    cargarProductos, cargarCategorias, cargarProveedores, crearProducto
  }
})
