import {api} from "./authService";

export const buscarProductos = (q) => 
{
    return api.get('/productos/buscar-venta',{params: { q }})
}