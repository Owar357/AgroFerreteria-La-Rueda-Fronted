import { api } from './authService'

//mandamos a traer los productos ya con la pagiancion
export const getProductos = (page = 1, perPage = 8) =>
  api.get('/productos', { params: { page, per_page: perPage } })

//para agregar un nuevo producto
export const createProducto = (data) => api.post('/productos', data)

//para actualizar un producto
export const updateProducto = (id, data) => api.put(`/productos/${id}`, data)

//para la obtencion de la informmacion de los selects
export const getAllCategorias = () => api.get('/categorias', { params: { per_page: 999 } })

// Traer presentaciones de un producto
export const getPresentacionesByProducto = (id) => api.get(`/productos/${id}`)

export const togglePresentacion = (id) => api.delete(`/presentaciones/${id}`)

export const getCodigosByPresentacion = (presentacionId) =>
  api.get(`/codigosBarra/${presentacionId}`)

export const añadirPresentacion = (data) => api.post('/presentaciones', data )

export const createCodigoBarra = (data) => api.post('/codigosBarra', data)
export const deleteCodigoBarra = (id) => api.delete(`/codigosBarra/${id}`)

export const updatePresentacion = (id, data) => api.put(`/presentaciones/${id}`, data)//agrege esteee para las presentaciones

// Traer lotes de una presentación (paginado)-- lotespresentaciones esto agrege para ver el paginado
export const getLotesByPresentacion = (presentacionId, page = 1, perPage = 5) =>
  api.get('/lotes', { params: { presentacion_id: presentacionId, page, per_page: perPage } })


//Traer todas las unidades de medida desde el backend
export const getUnidades = (params = {}) => api.get('/unidades', { params })