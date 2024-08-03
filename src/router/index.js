import { createRouter, createWebHistory } from 'vue-router'

// import AuthenticationPage from '@/views/authentication/AuthenticationPage.vue'

const routes = [    
  {path: '/', name: 'Admin', component: () => import('@/views/Dashboard.vue')},
    // {path: '/authentication', name: 'Authentication', component: AuthenticationPage},
    {path: '/login', name: 'Admin Login', component: () => import('@/views/LoginPage.vue')},
    {path: '/items', name: 'Item Management', component: () => import('@/views/ItemManagement.vue')},
    {path: '/invoices', name: 'Invoice Management', component: () => import('@/views/InvoiceList.vue')},
    {path: '/invoices/:invoice_no', name: 'View Invoice', component: () => import('@/views/InvoiceView.vue')},
    {path: '/customers', name: 'Customer Management', component: () => import('@/views/CustomerManagement.vue')},
    {path: '/customers/:id', name: 'View Customer', component: () => import('@/views/CustomerView.vue')}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // linkActiveClass: 'active-navigation'
})

export default router