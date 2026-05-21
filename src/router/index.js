import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UsuariosView from '@/views/UsuariosView.vue'
import RegistroComprasView from '@/views/RegistroComprasView.vue'
import UserTable from '@/components/Usuarios/UserTable.vue'
import ComprasRealizadasView from '@/views/ComprasRealizadasView.vue'
import Login from '@/views/auth/Login.vue'

import CategoriasView from '@/views/CategoriasView.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/admin/inventario/productos'
    },
    {
      path: '/Usuarios',
      name: 'ususarios',
      component: UsuariosView
    },
    {
      path: '/Login',
      name:'login',
      component: Login
    },
     {
      path: '/categorias',
      name:'Categorias',
      component: CategoriasView 
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
          component: () => import('../views/Producto.vue'),
        },
      ]
    },
  ],
})

export default router
