import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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
      path: '/signup',
      name: 'register',
      component: () => import('../components/SignUp.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/SignIn.vue')
    },
    {
      path: '/myProfile',
      name: 'profile',
      component: () => import('../components/Profile.vue')
    },
    {
      path: '/searchPeople',
      name: 'searchPeople',
      component: () => import('../components/searchPeople.vue')
    },
    {
      path: '/searchResult',
      name: 'searchResult',
      component: () => import('../components/searchResult.vue')
    }
  ]
})

export default router
