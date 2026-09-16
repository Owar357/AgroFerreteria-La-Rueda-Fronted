import { api } from './authService'

// ==========================================
// PRODUCTOS
// ==========================================

// Mandamos a traer los productos con paginación
export const getProductos = (page = 1, perPage = 8, q = '', categoria = '') => {
  const params = { page, per_page: perPage }

  if (q && q.trim()) params.q = q.trim()
  if (categoria) params.categoria = categoria

  return api.get('/productos', { params })
}

// Para agregar un nuevo producto
export const createProducto = (data) => api.post('/productos', data)

// Para actualizar un producto
export const updateProducto = (id, data) => api.put(`/productos/${id}`, data)

// Traer presentaciones e información detallada de un producto
export const getPresentacionesByProducto = (id) => api.get(`/productos/${id}`)

// ==========================================
// PRESENTACIONES
// ==========================================

// Añadir una nueva presentación
export const añadirPresentacion = (data) => api.post('/presentaciones', data)

// Actualizar una presentación existente
export const updatePresentacion = (id, data) => api.put(`/presentaciones/${id}`, data)

// Activar / Desactivar presentación
export const togglePresentacion = (id) => api.delete(`/presentaciones/${id}`)

// ==========================================
// CÓDIGOS DE BARRA
// ==========================================

// Obtener códigos de barra por presentación
export const getCodigosByPresentacion = (presentacionId) =>
  api.get(`/codigosBarra/${presentacionId}`)

// Crear nuevo código de barra
export const createCodigoBarra = (data) => api.post('/codigosBarra', data)

// Eliminar código de barra
export const deleteCodigoBarra = (id) => api.delete(`/codigosBarra/${id}`)

// ==========================================
// LOTES
// ==========================================

// Traer lotes de una presentación (paginado)
export const getLotesByPresentacion = (presentacionId, page = 1, perPage = 5) =>
  api.get('/lotes', { params: { presentacion_id: presentacionId, page, per_page: perPage } })

// Actualizar porcentaje de descuento de un lote específico
export const updateDescuentoLote = (loteId, porcentajeDescuento) =>
  api.patch(`/lotes/${loteId}/descuento`, { porcentaje_descuento: porcentajeDescuento })


// ==========================================
// TABLAS DE APOYO / SELECTS
// ==========================================

// Para la obtención de la información de categorías
export const getAllCategorias = () => api.get('/categorias', { params: { per_page: 999 } })

// Traer todas las unidades de medida desde el backend
export const getUnidades = (params = {}) => api.get('/unidades', { params })