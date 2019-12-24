import { 
    GET_USER,
    GET_CITY_INFO
} from './mutation-types'

const mutations = {
    [GET_USER](state, userInfo) {
        state.userInfo = Object.assign({}, userInfo)
    },
    [GET_CITY_INFO](state, cityInfo) {
        state.cityInfo = Object.assign({}, cityInfo)
    },
}

export default mutations