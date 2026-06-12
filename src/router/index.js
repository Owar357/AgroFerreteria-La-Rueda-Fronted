import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/services/authService.js'

// 1. Vistas principales (Carga directa)
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

  // Layout Padre protegido ('/admin')
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

      // --- EXCLUSIVOS ADMIN ---
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('@/views/UsuariosView.vue'),
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
        component: () => import('@/views/CategoriasView.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
      {
        path: 'inventario/productos',
        name: 'productos',
        component: () => import('@/views/productosView.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
      {
        path: 'inventario/proveedores',
        name: 'proveedores',
        component: () => import('@/views/ProveedoresView.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
      {
        path: 'procesos/historial-ventas',
        name: 'HistorialVenta',
        component: () => import('@/views/HistorialVentaView.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
      {
        path: 'gestion/pos',
        name: 'FromVenta',
        component: () => import('@/views/FromVenta.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
      },
      
 

      // --- ADMIN Y CAJERO ---
      {
        path: 'venta/venta',
        name: 'venta',
        component: () => import('@/views/FromVenta.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CAJERO'] },
      },
      {
        path: 'caja',
        name: 'caja',
        component: () => import('@/views/CajaView.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CAJERO'] },
      },
      {
        path: 'venta/movimientos-de-caja',
        name: 'movimientos-caja',
        component: () => import('@/views/MovimientosCajaView.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CAJERO'] },
      },

      // --- ADMIN Y CONTADOR ---
      {
        path: 'venta/compra',
        name: 'compra',
        component: () => import('@/views/CompraView.vue'),
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
        component: () => import('@/views/RegistroComprasView.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CONTADOR'] },
      },
      {
        path: 'reportes',
        name: 'reportes',
        component: () => import('@/views/home.vue'), 
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CONTADOR'] },
      },

      // --- TODOS LOS ROLES (ADMIN, CAJERO, CONTADOR) ---
      {
        path: 'procesos/clientes',
        name: 'Clientes',
        component: () => import('@/views/ClientesView.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CAJERO', 'CONTADOR'] },
      },
      
       {
       path: 'procesos/clientes/:id/historial',  
        name: 'ClienteHistorial',               
        component: () => import('@/components/Clientes/ClienteHistorialDialogo.vue'),
        meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'CAJERO', 'CONTADOR'] },
       }
    ]
  },

  // Captura cualquier ruta no encontrada  y manda al Login
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