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