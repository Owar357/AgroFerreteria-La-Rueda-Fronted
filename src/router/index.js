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
          component: () => import('../views/Producto.vue'),
        },
        {
          path: 'venta/venta',
          name: 'Venta',
          component: () => import('../views/FromVenta.vue'),
        },
      ]
    },
  ],
})

export default router