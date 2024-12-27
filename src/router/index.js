import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import Dashboard from '../views/admin/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin/login',
    name: 'adminLogin',
    component: () => import('../views/admin/Login.vue')
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: 'monitor',
        name: 'monitor',
        component: () => import('../views/admin/Monitor.vue')
      },
      {
        path: 'users',
        redirect: '/admin/users/system',
        children: [
          {
            path: 'system',
            name: 'system-users',
            component: () => import('../views/admin/users/System.vue'),
            meta: { title: '系统用户' }
          },
          {
            path: 'auth',
            name: 'auth-users',
            component: () => import('../views/admin/users/Auth.vue'),
            meta: { title: '认证用户' }
          }
        ]
      },
      {
        path: 'visitors',
        name: 'visitors',
        component: () => import('../views/admin/Visitors.vue')
      },
      {
        path: 'auth-source',
        redirect: '/admin/auth-source/list',
        children: [
          {
            path: 'list',
            name: 'auth-source-list',
            component: () => import('../views/admin/auth-source/List.vue'),
            meta: { title: '身份源管理' }
          },
          {
            path: 'ad',
            name: 'auth-source-ad',
            component: () => import('../views/admin/auth-source/AD.vue'),
            meta: { title: 'Windows AD' }
          },
          {
            path: 'radius',
            name: 'auth-source-radius',
            component: () => import('../views/admin/auth-source/Radius.vue'),
            meta: { title: 'RADIUS' }
          },
          {
            path: 'oauth',
            name: 'auth-source-oauth',
            component: () => import('../views/admin/auth-source/OAuth.vue'),
            meta: { title: 'OAuth2.0' }
          },
          {
            path: 'cas',
            name: 'auth-source-cas',
            component: () => import('../views/admin/auth-source/CAS.vue'),
            meta: { title: 'CAS' }
          },
          {
            path: 'wework',
            name: 'auth-source-wework',
            component: () => import('../views/admin/auth-source/WeWork.vue'),
            meta: { title: '企业微信' }
          }
        ]
      },
      {
        path: 'logs',
        name: 'logs',
        component: () => import('../views/admin/Logs.vue')
      },
      {
        path: 'settings',
        redirect: '/admin/settings/basic',
        children: [
          {
            path: 'basic',
            name: 'settings-basic',
            component: () => import('../views/admin/settings/Basic.vue')
          },
          {
            path: 'sms',
            name: 'settings-sms',
            component: () => import('../views/admin/settings/Sms.vue')
          },
          {
            path: 'syslog',
            name: 'settings-syslog',
            component: () => import('../views/admin/settings/Syslog.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = localStorage.getItem('admin-token')
    if (!isAuthenticated) {
      next('/admin/login')
      return
    }
  }
  next()
})

export default router 