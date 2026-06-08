import { api } from './authService'

//mandamos a traer los productos ya con la pagiancion
export const getProductos = (page = 1, perPage = 8) => api.get('/productos', { params: { page, per_page: perPage} })

//para agregar un nuevo producto
export const createProducto = (data) => api.get('/productos', data)

//para actualizar un producto
export const updateProducto = (id, data) => api.put('/productos/${id}', data)

//para la obtencion de la informmacion de los selects
export const getAllCategorias = () => api.get('/categorias', { params: { per_page: 999 } })
export const getAllProveedores = () => api.get('/proveedores', { params: { per_page: 999} })