import { api } from './authService' // Asegúrate de que la ruta relativa apunte bien a tu authService

/**
 * Obtiene todas las categorías
 * @returns {Promise} Respuesta de Axios
 */
export const getCategorias = () => {
  return api.get('/categorias')
}

/**
 * Crea una nueva categoría
 * @param {{ nombre: string, estado: string }} data
 * @returns {Promise} Respuesta de Axios
 */
export const createCategoria = (data) => {
  return api.post('/categorias', data)
}

/**
 * Actualiza una categoría existente
 * @param {number|string} id
 * @param {{ nombre: string, estado: string }} data
 * @returns {Promise} Respuesta de Axios
 */
export const updateCategoria = (id, data) => {
  return api.put(`/categorias/${id}`, data)
}