import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 插件 */
const Login = () => import( /* webpackChunkName:"login_home_welcome" */ '../views/login/Login.vue')
const Home = () => import( /* webpackChunkName:"login_home_welcome" */ '../views/home/Home.vue')
const Welcome = () => import( /* webpackChunkName:"login_home_welcome" */ '../views/home/childHome/Welcome.vue')
const User = () => import( /* webpackChunkName:"user" */ '../views/user/User.vue')
const RightList = () => import( /* webpackChunkName:"authority" */ '../views/authority/RightList.vue')
const RoleList = () => import( /* webpackChunkName:"authority" */ '../views/authority/RoleList.vue')
const ShopList = () => import( /* webpackChunkName:"shop" */ '../views/shop/shopList.vue')
const AddShop = () => import( /* webpackChunkName:"shop" */ '../views/shop/AddShop.vue')
const Params = () => import( /* webpackChunkName:"shop" */ '../views/shop/Params.vue')
const Category = () => import( /* webpackChunkName:"shop" */ '../views/shop/Category.vue')
const Order = () => import( /* webpackChunkName:"order" */ '../views/order/Order.vue')
const Report = () => import( /* webpackChunkName:"report" */ '../views/report/Report.vue')

const routes = [{
    path: '/',
    redirect: '/login',
    component: Login
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: RightList
      },
      {
        path: '/roles',
        component: RoleList
      },
      {
        path: '/goods',
        component: ShopList
      },
      {
        path: '/addshop',
        component: AddShop
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/categories',
        component: Category
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new Router({
  // mode: 'history',  上线页面存在刷新问题
  routes
})
export default router