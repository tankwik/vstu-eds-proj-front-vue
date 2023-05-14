import { createRouter, createWebHashHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: AuthView
    },
    {
      path: '/logout',
      name: 'logout',
      redirect: '/'
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue')
    },
    {
      path: '/edses',
      name: 'edses',
      component: () => import('../views/EdsesView.vue')
    },
    {
      path: '/kktes',
      name: 'kktes',
      component: () => import('../views/KktesView.vue')
    },
    {
      path: '/users-labels',
      name: 'users-labels',
      component: () => import('../views/LabelsView.vue')
    },
    { 
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/PageNotFound.vue') },
  ]
})

router.beforeEach((to, _, next) => {
  
  if (to.name !== 'login' && !localStorage.isAuth) next({ name: 'login' })
  else next()
})

export default router
