import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoriesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/stock-opname',
      name: 'stock-opname',
      component: () => import('../views/StockOpnameView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/stock/purchase',
      name: 'stock-purchase',
      component: () => import('../views/PurchaseView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/stock/usage',
      name: 'stock-usage',
      component: () => import('../views/UsageView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/stock/history',
      name: 'stock-history',
      component: () => import('../views/HistoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/suppliers',
      name: 'suppliers',
      component: () => import('../views/SuppliersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/employees',
      name: 'employees',
      component: () => import('../views/EmployeesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/shifts',
      name: 'shifts',
      component: () => import('../views/ShiftsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/scheduler',
      name: 'scheduler',
      component: () => import('../views/SchedulerView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: () => import('../views/CalculatorView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calculator/nutrition',
      name: 'calculator-nutrition',
      component: () => import('../views/NutritionCalculatorView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calculator/nutritional-status',
      name: 'calculator-nutritional-status',
      component: () => import('../views/NutritionalStatusView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calculator/ibw',
      name: 'calculator-ibw',
      component: () => import('../views/IBWCalculatorView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calculator/child-nutrition',
      name: 'calculator-child-nutrition',
      component: () => import('../views/ChildNutritionView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calculator/fluid',
      name: 'calculator-fluid',
      component: () => import('../views/FluidCalculatorView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calculator/malnutrition',
      name: 'calculator-malnutrition',
      component: () => import('../views/MalnutritionCalculatorView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calculator/diabetes-diet',
      name: 'calculator-diabetes-diet',
      component: () => import('../views/DiabetesDietCalculatorView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calculator/hypertension-diet',
      name: 'calculator-hypertension-diet',
      component: () => import('../views/HypertensionDietCalculatorView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calculator/history',
      name: 'calculator-history',
      component: () => import('../views/CalculationHistoryView.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
