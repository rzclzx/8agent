import Vue from 'vue'
import Router from 'vue-router'
import Cookie from '@/assets/js/common/cookie'

/**
 * 登录、首页
 */
import Login from '@/pages/login'
import Home from '@/pages/home'

/**
 * 经纪人
 */
import Profit from '@/pages/agent/profit/index'
import Customer from '@/pages/agent/customer/index'
import Holdcabin from "../pages/agent/customer/holdcabin.vue"
import Rebatedetail from "../pages/agent/customer/rebatedetail.vue"

Vue.use(Router)

const routes = [
  {path: '/', redirect: '/home'},
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/home',
        component: () => import("../pages/home/index.vue"),
        name: 'home'
      },
      {
        path: '/agent/profit',
        component: Profit,
        name: '收益记录'
      },
      {
        path: '/agent/customer',
        component: Customer,
        name: '客户列表',
        perm: 'auth'
      },
      {
        path: '/agent/holdcabin',
        name: '持仓',
        component: Holdcabin
      },
      {
        path: '/agent/rebatedetail',
        name: '返佣详情',
        component: Rebatedetail
      },
      {
        path: '*',
        name: '404',
        redirect: '/home'
      }
    ]
  }
]

const router = new Router({
  mode: 'hash',
  routes
})

router.beforeEach((to, from, next) => {
  if (!Cookie.getCookie('access_token') && to.path !== '/login') {
    next({
      path: '/login'
    })
  } else if (to.path === '/login' && Cookie.getCookie('access_token')) {
    next({
      path: '/home'
    })
  } else {
    next()
  }
})

export default router
