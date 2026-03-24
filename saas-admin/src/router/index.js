import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('saas_token')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && token) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
