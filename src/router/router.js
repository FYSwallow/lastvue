import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Home = () => import('@/page/home/home')
const Address = () => import('@/page/address/address')
const City = () => import('@/page/city/city')
const Search = () => import('@/page/search/search')
const Food = () => import('@/page/food/food')
const Shop = () => import('@/page/shop/shop')
const Order = () => import('@/page/order/order')
const User = () => import('@/page/user/user')
const UserMain = () => import('@/page/user/children/usermain')
const UserInfo = () => import('@/page/user/children/info')
const SetUserName = () => import('@/page/user/children/setusername')
const EditAddress = () => import('@/page/user/children/address')
const AddAddress = () => import('@/page/user/children/addaddress')
const DetailAddress = () => import('@/page/user/children/detailaddress')
const ForGet = () => import('@/page/user/children/forget')
const Login = () => import('@/page/login/login')
const ConfirmOrder = () => import('@/page/confirmOrder/confirmOrder')
const Payment = () => import('@/page/confirmOrder/children/payment')

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
            path: '/city',
            component: City
        },
        {
            path: '/food',
            component: Food
        },
        {
            path: '/search',
            component: Search
        },
        {
            path: '/shop',
            component: Shop
        },
        {
            path: '/confirmOrder',
            component: ConfirmOrder,
        },
        {
            path: '/confirmOrder/payment',
            component: Payment
        },
        {
            path: '/order',
            component: Order
        },
        {
            path: '/user',
            component: User,
            redirect: '/user/main',
            children: [
                {
                    path: 'main',
                    component: UserMain,
                    meta: {
                        title: '个人信息'
                    }
                },
                {
                    path: 'info',
                    component: UserInfo,
                    meta: {
                        title: '账户信息'
                    }
                },
                {
                    path: 'setusername',
                    component: SetUserName,
                    meta: {
                        title: '修改用户名'
                    }
                },
                {
                    path: 'editAddress',
                    component: EditAddress,
                    meta: {
                        title: '地址信息'
                    }
                },
                {
                    path: 'addAddress',
                    component: AddAddress,
                    meta: {
                        keepAlive: true,
                        title: '增加地址'
                    }
                },
                {
                    path: 'detailAddress',
                    component: DetailAddress,
                    meta: {
                        title: '详细地址'
                    }
                },
                {
                    path: 'forget',
                    component: ForGet,
                    meta: {
                        title: '修改密码'
                    }
                },
            ]

        },
        {
            path: '/login',
            component: Login
        },
    ],
    linkActiveClass: 'active',
})

export default router