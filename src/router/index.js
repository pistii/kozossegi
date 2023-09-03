import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { isLoggedin } from '../utils/auth.js'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            allowAnonymous: true
        }
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
        component: () => import('../components/SignUp.vue'),
        meta: {
            allowAnonymous: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/SignIn.vue'),
        meta: {
            allowAnonymous: true
        }
    },
    {
        path: '/myProfile',
        name: 'profile',
        component: () => import('../views/ProfileView.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/searchPeople',
        name: 'searchPeople',
        component: () => import('../views/searchPeopleView.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/messages',
        name: 'message',
        component: () => import('../views/MessageView.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/searchResult',
        name: 'searchResult',
        component: () => import('../components/searchResult.vue'),
        meta: {
            requiresAuth: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.name == 'login' && isLoggedin()) {
      next({ name: 'myProfile' })
  }
  else if (!to.meta.allowAnonymous && !isLoggedin()) {
      next({
          path: '/',
          query: { redirect: to.fullPath }
      })
  }
  else {
      next()
  }
  })

export default router
