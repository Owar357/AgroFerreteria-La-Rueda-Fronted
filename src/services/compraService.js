import { api } from "./authService";

export const buscarProductoCompra = (q) =>
    {
        return api.get('productos/buscar-producto/compra', {params:{q}});
    }


export const registrarCompra = (data) => api.post('/compras', data) 
 

export const compras  = () =>  api.get('/compras')