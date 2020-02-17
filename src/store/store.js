import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userInfo: null,
        cityInfo: null, //用户位置信息
        geohash: '', //地址坐标
        foodInfo: {
            restaurant_category_id : '',
            restaurant_category_ids: '',
            sortByType: null,
            delivery_mode: null,
            supportIds: []
        }, // 筛选食品的信息
        addressDetail: null, //添加收货地址的信息
        cartList: {}, //购物车列表
        chooseAddress: null, // 收货地址
    },
    mutations,
    actions
})

export default store