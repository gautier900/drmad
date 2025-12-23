
import { createRouter, createWebHistory } from 'vue-router'
import VirusesView from "@/views/VirusesView.vue";

const routes = [
  {
    path: '/shop',
    name:'shopView',
    component: () => import('@/views/ShopView.vue')
  },
  {
    path:'/shop/home',
    name:'shopHome',
    component : () => import('@/views/ShopHome.vue'),
    redirect: to =>{
      return { path: '/shop'}
    }
  },
  {
    path:'/shop/buy',
    name:'shopBuy',
    component : () => import('@/views/ShopBuy.vue'),
  },
  {
    path:'/shop/pay/:orderId',
    name:'shopPay',
    component : () => import('@/views/ShopPay.vue'),
  },
  {
    path:'/shop/orders',
    name:'shopOrders',
    component : () => import('@/views/ShopOrders.vue'),
  },
  {
    path: '/shop/items',
    name: 'shopitems',
    component: VirusesView
  },
  {
    path: '/shop/login',
    name: 'shoplogin',
    // import dynamique du composant, plutôt qu'en début de fichier, comme la 1ère route.
    component: () => import('@/views/ShopLoginView.vue')
  },
  {
    path: '/bank/account',
    name: 'bankaccount',
    // import dynamique du composant, plutôt qu'en début de fichier, comme la 1ère route.
    component: () => import('@/views/BankAccountView.vue')
  },

  {
    path:'/tp/1',
    name:'tp1',

    component: () => import('@/views/TP.vue')
  }


]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
