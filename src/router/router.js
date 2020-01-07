import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Home = () => import('@/page/home/home')
const Address = () => import('@/page/address/address')
const Food = () => import('@/page/food/food')
const Shop = () => import('@/page/shop/shop')
const Search = () => import('@/page/search/search')
const Blance = () => import('@/page/blance/blance')
const User = () => import('@/page/user/user')
const Login = () => import('@/page/login/login')
const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/address',
            component: Address
        },
        {
            path: '/food',
            component: Food
        },
        {
            path: '/shop',
            component: Shop
        },
        {
            path: '/search',
            component: Search
        },
        {
            path: '/blance',
            component: Blance
        },
        {
            path: '/user',
            component: User
        },
        {
            path: '/login',
            component: Login
        },
    ]
})

export default router