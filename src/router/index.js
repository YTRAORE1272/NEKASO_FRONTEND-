import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/gestionnaire/dashboard' },

    {
      path: '/gestionnaire',
      component: () => import('@/components/layout/GestionnaireLayout.vue'),
      meta: { title: 'NEKASO' },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/gestionnaire/DashboardView.vue'),
          meta: { title: 'Tableau de bord NEKASO' },
        },
        {
          path: 'biens',
          name: 'biens',
          component: () => import('@/views/gestionnaire/PlaceholderView.vue'),
          meta: { title: 'Biens' },
        },
        {
          path: 'visites',
          name: 'visites',
          component: () => import('@/views/gestionnaire/PlaceholderView.vue'),
          meta: { title: 'Visites' },
        },
        {
          path: 'demandes-location',
          name: 'demandes-location',
          component: () => import('@/views/gestionnaire/DemandesLocationView.vue'),
          meta: { title: 'Demandes de location' },
        },
        {
          path: 'contrats',
          name: 'contrats',
          component: () => import('@/views/gestionnaire/PlaceholderView.vue'),
          meta: { title: 'Contrats' },
        },
        {
          path: 'paiements',
          name: 'paiements',
          component: () => import('@/views/gestionnaire/PlaceholderView.vue'),
          meta: { title: 'Paiements' },
        },
        {
          path: 'parametres',
          name: 'parametres',
          component: () => import('@/views/gestionnaire/PlaceholderView.vue'),
          meta: { title: 'Paramètres' },
        },
      ],
    },

    { path: '/:pathMatch(.*)*', redirect: '/gestionnaire/dashboard' },
  ],
})

export default router
