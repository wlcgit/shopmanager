
import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import Goodslist from '@/components/goodslist.vue'
import Goodsadd from '@/components/goodsadd.vue'
import Params from '@/components/params.vue'
import Goodscate from '@/components/goodscate.vue'
import Order from '@/components/order.vue'
import Reports from '@/components/reports.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      },
      {
        name: 'rights',
        path: '/rights',
        component: Rights
      },
      {
        name: 'roles',
        path: '/roles',
        component: Roles
      }, {
        name: 'goods',
        path: '/goods',
        component: Goodslist
      }, {
        name: 'goodsadd',
        path: '/goodsadd',
        component: Goodsadd
      }, {
        name: 'params',
        path: '/params',
        component: Params
      }, {
        name: 'categories',
        path: '/categories',
        component: Goodscate
      }, {
        name: 'orders',
        path: '/orders',
        component: Order
      },
      {
        name: 'reports',
        path: '/reports',
        component: Reports
      }

      ]
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      Message.warning('请先登录')
      router.push({ name: 'login' })
      return
    }
    next()
  }
})

export default router
