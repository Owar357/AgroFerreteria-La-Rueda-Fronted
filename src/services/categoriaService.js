<<<<<<< HEAD
//importamos la intancia de axios que ya tiene el token automatico
import { api } from './authService'

//Metodo para obtener todas las cateorias
export const getCategorias = (page = 1, perPage = 5) => api.get('/categorias', { params: {page, per_page: perPage}})

//metodo para cerar una nueva categoria
export const createCategoria = (data) => api.post('/categorias', data)

//Metodo para actualizar una nueva ategoria
export const updateCategoria = (id, data) => api.put(`/categorias/${id}`, data)
=======
import { api } from './authService'

export const getCategorias   = (page = 1, perPage = 5) => api.get('/categorias', { params: { page, per_page: perPage } })

export const createCategoria = (data)        => api.post('/categorias', data)

export const updateCategoria = (id, data)    => api.put(`/categorias/${id}`, data)
>>>>>>> rama_prueba
