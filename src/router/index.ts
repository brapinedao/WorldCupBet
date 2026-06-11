import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth/auth'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    allowedUsernames?: string[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/login/Login.vue'),
    },
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      redirect: { name: 'Predictions' },
      children: [
        {
          path: 'predicciones',
          name: 'Predictions',
          component: () => import('@/views/predictions/Predictions.vue'),
        },
        {
          path: 'equipos',
          name: 'Groups',
          component: () => import('@/views/groups/Groups.vue'),
        },
        {
          path: 'ranking',
          name: 'Ranking',
          component: () => import('@/views/rankings/Rankings.vue'),
        },
        {
          path: 'premios',
          name: 'Premios',
          component: () => import('@/views/premios/Premios.vue'),
        },
        {
          path: 'pronosticos-todos',
          name: 'AllPredictions',
          component: () => import('@/views/all-predictions/AllPredictions.vue'),
        },
        {
          path: 'resultados',
          name: 'MatchResults',
          component: () => import('@/views/match-results/MatchResults.vue'),
          meta: { allowedUsernames: ['brianpineda19', 'fabiovelazco'] },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.id

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' }
  }

  if (to.name === 'Login' && isAuthenticated) {
    return { name: 'Predictions' }
  }

  if (to.meta.allowedUsernames && !to.meta.allowedUsernames.includes(authStore.username)) {
    return { name: 'Predictions' }
  }
})

export default router
