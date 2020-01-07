import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userInfo: null,
        cityInfo: null, //用户位置信息
        foodInfo: {
            restaurant_category_id : '',
            restaurant_category_ids: '',
            sortByType: null,
            delivery_mode: null,
            supportIds: []
        }, // 筛选食品的信息
    },
    mutations,
    actions
})

export default store