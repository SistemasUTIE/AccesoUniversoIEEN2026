import { authGuard, guestGuard } from './guards'

const routes = [
  // ---------------------------------------
  // Sistema principal
  // ---------------------------------------
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    beforeEnter: authGuard,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/IndexPage.vue'),
        beforeEnter: authGuard,
      },

      {
        path: 'second',
        name: 'second',
        component: () => import('@/pages/SecondPage.vue'),
        beforeEnter: authGuard,
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/pages/ProfilePage.vue'),
        beforeEnter: authGuard,
      },
      {
        path: 'Datos_Personales',
        name: 'Datos_Personales',
        component: () => import('@/pages/DatosPersonales.vue'),
        beforeEnter: authGuard,
      },
    ],
  },

  // ---------------------------------------
  // Autenticación
  // ---------------------------------------
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),

    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue'),
        beforeEnter: guestGuard,
      },
    ],
  },

  // ---------------------------------------
  // Página no encontrada
  // ---------------------------------------
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes
