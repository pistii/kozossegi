import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { isLoggedin, removeAuthToken } from '../utils/auth.js'

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
        path: '/validate/:token',
        name: 'validate',
        component: () => import('@/components/RegistrationSuccess.vue'),
        meta: {
            allowAnonymous: true
        },
        
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/LoginAndRegister/SignUp.vue'),
        meta: {
            allowAnonymous: true
        }
    },
    {
        path: '/login', //TODO: Check valid token before reenters the site: https://stackoverflow.com/questions/46262094/checking-auth-token-valid-before-route-enter-in-vue-router
        name: 'login',
        component: () => import('@/views/LoginAndRegister/SignIn.vue'),
        meta: {
            allowAnonymous: true
        },
        beforeEnter: (to, from, next) => {
            // Ellenőrzi, hogy az útvonalhoz bejelentkezés szükséges-e
            if (to.meta.allowAnonymous && !isLoggedin()) {
                next();
            } else {
                next('/');
            }
        },
        
    },
    {
        path: '/myProfile',
        name: 'profile',
        component: () => import('@/views/ProfilePage/ProfileView.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/searchPeople',
        name: 'searchPeople',
        component: () => import('@/views/searchPeopleView.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/messages',
        name: 'message',
        component: () => import('@/views/Message/MessageView.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/searchResult',
        name: 'searchResult',
        component: () => import('@/components/searchResult.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/profile=:id',
        name: 'viewProfile',
        component: () => import('@/views/ProfilePage/ProfileView.vue'),
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
            next();
        }
  })


export default router
