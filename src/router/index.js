import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/market',
      name: 'market',
      component: () => import('../views/market/index.vue'),
    },
    {
      path: '/market_pricePrediction',
      name: 'pricePrediction',
      component: () => import('../views/market/pricePrediction.vue'),
    },
    {
      path: '/marketDetail',
      name: 'marketDetail',
      component: () => import('../views/marketDetail/index.vue'),
    },{
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('../views/leaderboard/index.vue'),
    },{
      path: '/task',
      name: 'task',
      component: () => import('../views/task/index.vue'),
    },{
      path: '/profile',
      name: 'profile',
      component: () => import('../views/profile/index.vue'),
    },{
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue'),
    },{
      path: '/setting',
      name: 'setting',
      component: () => import('../views/setting/index.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  },
})

export default router
