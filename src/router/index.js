import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'



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
      ]
    },
  ],
})

export default router
