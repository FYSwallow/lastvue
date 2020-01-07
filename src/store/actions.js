import {
    GET_USER,
    GET_CITY_INFO,
    GET_FOOD_INFO
} from './mutation-types'

const actions = {
    // 获取用户信息
    getUserInfo({ commit }, userInfo) {
        commit(GET_USER, userInfo)
    },
    // 获取用户信息
    getCityInfo({ commit }, cityInfo) {
        commit(GET_CITY_INFO, cityInfo)
    },
    // 获取食品选择分类信息
    getFoodInfo({ commit }, foodInfo) {
        if (foodInfo) {
            commit(GET_FOOD_INFO, foodInfo)
        } else {
            commit(GET_FOOD_INFO, {sortBy: ""})

        }
    }
}

export default actions