import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Home = () => import('@/page/home/home')
const Address = () => import('@/page/address/address')
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
        }
    ]
})

export default router