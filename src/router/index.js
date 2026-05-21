import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/admin/inventario/productos'
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
      ]
    },
  ],
})

export default router