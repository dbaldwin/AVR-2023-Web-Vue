import { createRouter, createWebHistory } from 'vue-router'
import MapView from '../views/MapView.vue'
import GoogleView from '../views/GoogleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MapView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/google-map',
      name: 'google',
      component: () => import('../views/GoogleView.vue')
    }
  ]
})

export default router
