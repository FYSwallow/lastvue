import {
    GET_USER,
    GET_CITY_INFO,
    GET_FOOD_INFO
} from './mutation-types'

const mutations = {
    [GET_USER](state, userInfo) {
        state.userInfo = Object.assign({}, userInfo)
    },
    [GET_CITY_INFO](state, cityInfo) {
        state.cityInfo = Object.assign({}, cityInfo)
    },
    // 获取食品分类更新的信息
    [GET_FOOD_INFO](state, foodInfo) {
        state.foodInfo = Object.assign({}, state.foodInfo, foodInfo)
    },
}

export default mutations