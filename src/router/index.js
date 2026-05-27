import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UsuariosView from '@/views/UsuariosView.vue'
import RegistroComprasView from '@/views/RegistroComprasView.vue'
import UserTable from '@/components/Usuarios/UserTable.vue'
import ComprasRealizadasView from '@/views/ComprasRealizadasView.vue'
import Login from '@/views/auth/Login.vue'






const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   
  
    {
      path: '/Login',
      name:'login',
      component: Login
    },
    
    {
      path: '/ComprasRealizadas',
      name:'comprasRealizadas',
      component: ComprasRealizadasView
    },
     {
      path: '/RegistroCompras',
      name:'registroCompras',
      component: RegistroComprasView
    },
    {
      path: '/admin',
      component: () => import('../views/home.vue'),
      children: [
        {
          path: 'inventario/productos',
          name: 'Producto',
          component: () => import('../views/productosView.vue')
        },
        {
          path: 'venta/venta',
          name: 'Venta',
          component: () => import('../views/FromVenta.vue'),
        },
        {
             path: 'usuarios',
             name: 'Usuarios',
             component: () => import('../views/UsuariosView.vue'),
        },
        {
             path: 'inventario/proveedores',
             name: 'proveedor',
             component: () => import('../components/Usuarios/SupplierTable.vue'),
        }, 
         {
             path: 'inventario/Categorias',
             name: 'categorias',
             component: () => import('../views/CategoriasView.vue'),
        }, 
        {
             path: 'Venta/Compra',
             name: 'Compra',
             component: () => import('../views/CompraView.vue'),
        }, 
        {
             path: 'Caja',
             name: 'Caja',
             component: () => import('../views/CajaView.vue'),
        }, 
      ]
    },
  ],
})

export default router