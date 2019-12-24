import { 
    GET_USER,
    GET_CITY_INFO,
} from './mutation-types'

const actions = {
    // 获取用户信息
    getUserInfo({commit}, userInfo) {
        console.log(userInfo)
        commit(GET_USER, userInfo)
    },
    // 获取用户信息
    getCityInfo({commit}, cityInfo) {
        commit(GET_CITY_INFO, cityInfo)
    }
}

export default actions