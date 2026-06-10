import {api} from "./authService";

export const buscarProductos = (q) => 
{
    return api.get('/productos/buscar-venta',{params: { q }})
}

export const buscarClientePorDocumento = (documento) => {
    return api.get('clientes/buscar',{params: {numero_documento:documento}})
} 

export const crearCliente = (data) => {
    return api.post('/clientes', data);
}

export const registerVenta = (data) => {
    return api.post('/ventas', data)
}

export const getVentas = (params = {} ) => {
    return api.get('/ventas', {params})
}

export const getDetallesVenta = (id) => {
    return api.get (`/ventas/${id}`);
} 