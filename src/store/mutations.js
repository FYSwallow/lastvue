import {
    GET_USER,
    GET_CITY_INFO,
    GET_FOOD_INFO,
    GET_FOOD_ADDRESS,
    GET_ADDRESS_INFO,
    ADD_CART,
    CLEAR_CART,
    CHOOSE_ADDRESS,
} from './mutation-types'

const mutations = {
    // 用户信息
    [GET_USER](state, userInfo) {
        if (!userInfo) {
            state.userInfo = userInfo
        } else {
            state.userInfo = Object.assign({}, userInfo)
        }
    },
    // 所在地址信息
    [GET_CITY_INFO](state, cityInfo) {
        state.cityInfo = cityInfo;
        // 所在地地址坐标
        state.geohash = cityInfo.latitude + ',' + cityInfo.longitude;
    },

    // 所在地址信息
    [GET_ADDRESS_INFO](state, location) {
        state.location =  location;
        // 所在地地址坐标
        state.geohash = location.latitude + ',' + location.longitude;
    },

    // 获取食品分类更新的信息
    [GET_FOOD_INFO](state, foodInfo) {
        state.foodInfo = Object.assign({}, state.foodInfo, foodInfo)
    },
    //地址详情
    [GET_FOOD_ADDRESS](state, addressInfo) {
        console.log(addressInfo)
        state.addressDetail = Object.assign({}, state.addressDetail, addressInfo)
    },
    // 添加购物车
    [ADD_CART](state, cart) {
        state.cartList = Object.assign({}, state.cartList, cart);
    },
    // 清空购物车
    [CLEAR_CART](state, restaurant_id) {
        state.cartList[restaurant_id] = null;
        state.cartList = { ...state.cartList };
    },
    // 选择收货地址
    [CHOOSE_ADDRESS](state, address) {
        state.chooseAddress = { ...address }
        console.log(state.chooseAddress)
    }
}

export default mutations