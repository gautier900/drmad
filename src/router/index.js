
import { createRouter, createWebHistory } from 'vue-router'
import VirusesView from "@/views/VirusesView.vue";

const routes = [
  {
    path: '/shop',
    name: 'shopView',
    component: () => import('@/views/ShopView.vue'),
    children: [
      {
        path: '',
        name: 'shopHome',
        alias: 'home',
        component: () => import('@/views/ShopHome.vue')
      },
      {
        path: 'login',
        name: 'shopLogin',
        component: () => import('@/views/ShopLoginView.vue')
      },
      {
        path: 'buy',
        name: 'shopBuy',
        component: () => import('@/views/ShopBuy.vue')
      },
      {
        path: 'pay/:orderId?',
        name: 'ShopPay',
        component: () => import('@/views/ShopPay.vue'),
        props: true
      },
      {
        path: 'orders',
        name: 'shopOrders',
        component: () => import('@/views/ShopOrders.vue')
      },
      {
        path: 'items',
        name: 'shopItems',
        component: VirusesView
      }
    ]
  },
  {
    path: '/bank/account',
    name: 'bankaccount',
    component: () => import('@/views/BankAccountView.vue')
  },
  {
    path: '/tp/1',
    name: 'tp1',
    component: () => import('@/views/TP.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
