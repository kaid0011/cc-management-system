import { createRouter, createWebHistory } from 'vue-router'

// import AuthenticationPage from '@/views/authentication/AuthenticationPage.vue'

const routes = [    
  {path: '/', name: 'Admin', component: () => import('@/views/Dashboard.vue')},
    // {path: '/authentication', name: 'Authentication', component: AuthenticationPage},
    {path: '/login', name: 'Admin Login', component: () => import('@/views/LoginPage.vue')},
    {path: '/items', name: 'Item Management', component: () => import('@/views/ItemManagement.vue')},
    {path: '/invoices', name: 'Invoice Management', component: () => import('@/views/InvoiceManagement.vue')},
    {path: '/orders', name: 'Order Management', component: () => import('@/views/OrderManagement.vue')},
    {path: '/orders/create', name: 'Create Order', component: () => import('@/views/OrderCreate.vue')},
    {path: '/invoices/:invoice_no', name: 'View Invoice', component: () => import('@/views/InvoiceView.vue')},
    {path: '/orders/:order_id', name: 'View Order', component: () => import('@/views/OrderView.vue')},
    {path: '/customers', name: 'Customer Management', component: () => import('@/views/CustomerManagement.vue')},
    {path: '/customers/:id', name: 'View Customer', component: () => import('@/views/CustomerView.vue')},
    {path: '/drivers', name: 'Driver Management', component: () => import('@/views/DriverManagement.vue')}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // linkActiveClass: 'active-navigation'
})

export default router