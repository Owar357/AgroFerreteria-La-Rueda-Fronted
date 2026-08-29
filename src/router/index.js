import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/services/authService.js'


import Login from '@/views/auth/Login.vue'
import HomeLayout from '@/views/home.vue'

const routes = [
  // Redirección inicial
  {
    path: '/',
    redirect: '/login',
  },
  
  // Login
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },


  {
    path: '/admin',
    component: HomeLayout,
    meta: { requiresAuth: true },
    children: [
      // Redirección por defecto al entrar a /admin
      {
        path: '',
        redirect: { name: 'usuarios' },
      },

      //  EXCLUSIVOS ADMIN 
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('@/views/UsuariosViews.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
      {
        path: 'alertas',
        name: 'alertas',
        component: () => import('@/components/Alertas/AlertsTable.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
      {
        path: 'inventario/categorias',
        name: 'categorias',
        component: () => import('@/views/CategoriasViews.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
      {
        path: 'inventario/productos',
        name: 'productos',
        component: () => import('@/views/productosViews.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
      {
        path: 'inventario/proveedores',
        name: 'proveedores',
        component: () => import('@/views/ProveedoresViews.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
      {
        path: 'procesos/historial-ventas',
        name: 'HistorialVenta',
        component: () => import('@/views/HistorialVentaViews.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CAJERO'] },
      },
      {
        path: 'gestion/pos',
        name: 'FromVenta',
        component: () => import('@/views/FromVenta.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CAJERO'] },
      },
      
 

      
      {
        path: 'venta/venta',
        name: 'venta',
        component: () => import('@/views/FromVenta.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CAJERO'] },
      },
      {
        path: 'caja',
        name: 'caja',
        component: () => import('@/views/CajaViews.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CAJERO'] },
      },
      {
        path: 'venta/movimientos-de-caja',
        name: 'movimientos-caja',
        component: () => import('@/views/MovimientosCajaViews.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CAJERO'] },
      },

      {
        path: 'venta/compra',
        name: 'compra',
        component: () => import('@/views/CompraViews.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CONTADOR'] },
      },
      {
        path: 'compras-realizadas',
        name: 'comprasRealizadas',
        component: () => import('@/components/Compras/ComprasTable.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CONTADOR'] },
      },
      {
        path: 'registro-compras',
        name: 'registroCompras',
        component: () => import('@/components/Compras/DetalleCompraDialog.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CONTADOR'] },
      },
      {
        path: 'reportes',
        name: 'reportes',
        component: () => import('@/views/Reportes/ReportesViews.vue'), 
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CONTADOR'] },
      },

      
      {
        path: 'procesos/clientes',
        name: 'Clientes',
        component: () => import('@/views/ClientesViews.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CAJERO', 'CONTADOR'] },
      },
      
       {
       path: 'procesos/clientes/:id/historial',  
        name: 'ClienteHistorial',               
        component: () => import('@/components/Clientes/HistorialClienteDialogo.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CAJERO', 'CONTADOR'] },
       },
       //agrege esto para cargar la pagina aparatee de lotes 
       {
          path: 'inventario/presentaciones/:id/lotes',
             name: 'lotes-presentacion',
            component: () => import('@/components/Productos/LotesPresentacionTable.vue'),
           props: (route) => ({ presentacionId: route.params.id, nombrePresentacion: route.query.nombre }),
             meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CAJERO', 'CONTADOR'] },
           }
    ]
  },

 
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes // Aquí se  inyecta el array 
})


router.beforeEach((to) => {
  const isLoggedIn = authService.isAuthenticated()
  const userRole = authService.getUserRole()

  
  if (to.matched.some((r) => r.meta.requiresAuth) && !isLoggedIn) {
    return ({ name: 'login' })
  }
  
  if (to.name === 'login' && isLoggedIn) {
    const homeRoute = authService.getHomeRoute()
    return  (homeRoute)
  }

  //  Control de Roles (Si la ruta tiene roles asignados y el usuario no lo incluye)
  if (isLoggedIn && to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
    const homeRoute = authService.getHomeRoute()
    return (homeRoute) 
  }

  return true
})

export default router