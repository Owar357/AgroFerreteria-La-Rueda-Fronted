import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/services/authService'

import Login from '@/views/auth/Login.vue'
import home from '@/views/home.vue'

import CategoriasView  from '@/views/CategoriasView.vue'
import FromVenta       from '@/views/FromVenta.vue'
import CompraView      from '@/views/CompraView.vue'
import UsuariosView    from '@/views/UsuariosView.vue'
import ComprasRealizadasView from '@/views/ComprasRealizadasView.vue'
import ProductosView from '@/views/productosView.vue'
import { all } from 'axios'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/compras-Realizadas',
    name: 'comprasRealizadas',
    component: ComprasRealizadasView,
  },

  {
    // Layout padre — todas las rutas protegidas van aquí
    path: '/admin',
    component: home,
    meta: { requiresAuth: true },
    children: [
      {
        // Redirige al home correcto según el rol al entrar a /admin
        path: '',
        redirect: () => authService.getHomeRoute(),
      },

      // ── ADMIN ──────────────────────────────────────────────────────────────
      {
        path: 'usuarios',
        name: 'usuarios',
        component: UsuariosView,
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
        component: () => import('@/components/Usuarios/SupplierTable.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
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

     
      /*
      {
        path: 'venta/turno-caja',
        name: 'turno-caja',
        component: () => import('@/views/TurnoCajaView.vue'), // créala cuando la necesites
        meta: { requiresAuth: true, allowedRoles: ['admin', 'cajero'] },
      },
      */
    
      // ── ADMIN + CONTADOR ───────────────────────────────────────────────────
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
    ],
  },

  // Captura cualquier ruta no encontrada
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ── Guard global ──────────────────────────────────────────────────────────────
router.beforeEach((to) => {
  const isLoggedIn = authService.isAuthenticated()
  const userRole   = authService.getUserRole()  // 'admin' | 'cajero' | 'contador' | null

  // 1. Ruta protegida sin sesión → login
  if (to.matched.some((r) => r.meta.requiresAuth) && !isLoggedIn) {
    return { name: 'login' }
  }

  // 2. Ya logueado intenta ir al login → su home
  if (to.name === 'login' && isLoggedIn) {
    return authService.getHomeRoute()
  }

  // 3. Rol no permitido → su home (no al login para no perder sesión)
  if (isLoggedIn && to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
    return authService.getHomeRoute()
  }

  return true
  
})

export default router