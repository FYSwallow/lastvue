import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
Vue.use (Vuex)

const store = new Vuex.Store({
    state: {
        userInfo: null,
        cityInfo: null, //用户位置信息
    },
    mutations,
    actions

})

export default store