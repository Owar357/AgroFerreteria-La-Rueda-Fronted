import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/services/authService.js'

import Login from '@/views/auth/Login.vue'
import home from '@/views/home.vue'

import CategoriasView from '@/views/CategoriasView.vue'
import FromVenta from '@/views/FromVenta.vue'
import CompraView from '@/views/CompraView.vue'
import UsuariosView from '@/views/UsuariosView.vue'
import ComprasRealizadasView from '@/views/ComprasRealizadasView.vue'
import ProductosView from '@/views/productosView.vue'

import { all } from 'axios'
import RegistroComprasView from '@/views/RegistroComprasView.vue'
import AlertsTable from '@/components/Alertas/AlertsTable.vue'
import { patchProp } from 'vue'


const routes = [
  {
    path: '/',
    redirect: '/login',

  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/compras-Realizadas',
    name: 'comprasRealizadas',
    component: ComprasRealizadasView,
    meta: { requiresAuth: true, allowedRoles: ['admin', 'contador'] },
  },
  {
    path: '/RegistroCompras',
    name: 'registroCompras',
    component: RegistroComprasView,
    meta: { requiresAuth: true, allowedRoles: ['admin', 'contador'] },
  },
  {
    //ests es el layout padre, las rutas que se protegen van aqui
    path: '/admin',
    component: home,
    meta: { requiresAuth: true },
    children: [
      {
        //redirige a la interfaz segun el rol
        path: '',
        redirect: {name: 'usuarios' }, // esto lo cambie
      },

      {
        //INterfazces del ADMIN
        path: 'usuarios',
        name: 'usuarios',
        component: UsuariosView,
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'alertas',
        name: 'alertas',
        component: AlertsTable,
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'inventario/categorias',
        name: 'categorias',
        component: CategoriasView,
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'inventario/productos',
        name: 'productos',
        component: ProductosView,
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'inventario/proveedores',
        name: 'proveedores',
        component: () => import('@/views/ProveedoresView.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      
      {
        path: 'procesos/historial-ventas',
      },
      {
        path: 'Procesos/Historial-Ventas',
        name: 'HistorialVenta',
        component: () => import('@/views/HistorialVentaView.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      
      {
        path: 'gestion/pos',
      },

      {
        path: 'gestion/POS',
        name: 'FromVenta',
        component: FromVenta,
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      //RUtas para el admin mas el cajero

      //aqui va  lo de la caja
      {
        path: 'venta/venta',
        name: 'venta',
        component: FromVenta,
        meta: { requiresAuth: true, allowedRoles: ['admin', 'cajero'] },
      },
      {
        path: 'caja',
        name: 'caja',
        component: () => import('@/views/CajaView.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin', 'cajero'] },
      },
      {
        path: 'venta/movimientos-de-caja',
        name: 'movimientos-caja',
        component: () => import('@/views/MovimientosCajaView.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin', 'cajero'] },
      },
      //Rutas para las intefaces del admin mas el contador
      {
        path: 'venta/compra',
        name: 'compra',
        component: CompraView,
        meta: { requiresAuth: true, allowedRoles: ['admin', 'contador'] },

      },
      {
        path: 'reportes',
        name: 'reportes',
        component: ComprasRealizadasView,
        meta: { requiresAuth: true, allowedRoles: ['admin', 'contador'] },
      },
      //RUtas adicionales para los roles
      {
        path: 'procesos/clientes',
        name: 'Clientes',
        component: () => import('@/views/ClientesView.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin', 'cajero', 'contador'] },

      },
      {
        path: 'procesos/clientes/historial',
        name: 'ClientesHistorial',
        component: () => import('@/components/Clientes/ClienteHistorialDialogo.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin', 'cajero', 'contador'] },
      }
    ]
  },
  
    // Captura cualquier ruta no encontrada
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/Login',
      name: 'login',
      component: Login,
    },

    {
      path: '/ComprasRealizadas',
      name: 'comprasRealizadas',
      component: ComprasRealizadasView,
    },
    {
      path: '/RegistroCompras',
      name: 'registroCompras',
      component: RegistroComprasView,
    },

    {
      path: '/admin',
      component: () => import('../views/home.vue'),
      children: [
        {
          path: 'inventario/productos',
          name: 'Producto',
          component: () => import('../views/productosView.vue'),
        },
        {
          path: 'venta/venta',
          name: 'Venta',
          component: () => import('../views/FromVenta.vue'),
        },
        {
          path: 'alertas',
          name: 'alertas',
          component: () => import('../components/Alertas/AlertsTable.vue'),
        },
        
        {
          path: 'usuarios',
          name: 'Usuarios',
          component: () => import('../views/UsuariosView.vue'),
        },
        {
          path: 'inventario/proveedores',
          name: 'proveedor',
          component: () => import('../views/ProveedoresView.vue'),
        },
        {
          path: 'inventario/Categorias',
          name: 'categorias',
          component: () => import('../views/CategoriasView.vue'),
        },
        {
          path: 'caja',
          name: 'caja',
          component: () => import('../views/CajaView.vue'),
        },
         {
          path: 'venta/movimientos-de-caja',
          name: 'movcaja',
          component: () => import('../views/MovimientosCajaView.vue'),
        },
        {
          path: 'Venta/Compra',
          name: 'Compra',
          component: () => import('../views/CompraView.vue'),
        },
        {
          path: 'gestion/POS',
          name: 'POS',
          component: () => import('../views/FromVenta.vue'),
        },
        {
          path: 'procesos/historial-ventas',
          name: 'HistorialVenta',
          component: () => import('../views/HistorialVentaView.vue'),
        },
        {
          path: 'procesos/clientes',
          name: 'Clientes',
          component: () => import('../views/ClientesView.vue'),
        },
        {
          path: 'procesos/clientes/historial',
          name: 'ClienteHistorial',
          component: () => import('../components/Clientes/ClienteHistorialDialogo.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const isLoggedIn = authService.isAuthenticated()
  const userRole = authService.getUserRole() 

  if (to.matched.some((r) => r.meta.requiresAuth) && !isLoggedIn) {
    if (to.name !== 'login') {
      return { name: 'login'}
    }
      return true //toodo esto cambie yo
  }

  if (to.name === 'login' && isLoggedIn) {
    const getHomeRoute = authService.getHomeRoute() // todo ese bloque modifiuqe
    if (to.name === getHomeRoute.name) {
      return true
    }
    return getHomeRoute
  }

  if (isLoggedIn && to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
    return authService.getHomeRoute()
  }

  return true
})


export default router
