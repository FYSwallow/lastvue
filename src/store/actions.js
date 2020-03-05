import {
    GET_USER,
    GET_CITY_INFO,
    GET_FOOD_INFO,
    GET_ADDRESS_INFO,
    GET_FOOD_ADDRESS,
    ADD_CART,
    CHOOSE_ADDRESS
} from './mutation-types'

const actions = {
    // 获取用户信息
    getUserInfo({ commit }, userInfo) {
        if (!userInfo) {
            userInfo = null
        }
        commit(GET_USER, userInfo)
    },
    // 获取城市信息
    getCityInfo({ commit }, cityInfo) {
        commit(GET_CITY_INFO, cityInfo)
    },
    // 获取地址信息
    getAddressInfo({ commit }, location) {
        commit(GET_ADDRESS_INFO, location)
    },
    // 获取食品选择分类信息
    getFoodInfo({ commit }, foodInfo) {
        if (foodInfo) {
            commit(GET_FOOD_INFO, foodInfo)
        } else {
            commit(GET_FOOD_INFO, { sortBy: "" })

        }
    },
    // 获取食品选择分类信息
    getFoodAddress({ commit }, addressInfo) {
        commit(GET_FOOD_ADDRESS, addressInfo)
    },
    //添加购物车
    addCart({ state, commit }, shopInfo) {
        const {
            restaurant_id,
            category_id,
            item_id,
            food_id,
            name,
            price,
            specs,
            packing_fee,
            sku_id,
            stock
        } = shopInfo;

        let cart = Object.assign({}, state.cartList);
        let shop = cart[restaurant_id] = (cart[restaurant_id] || {});

        let category = shop[category_id] = (shop[category_id] || {});
        let item = category[item_id] = (category[item_id] || {});
        if (item[food_id]) {
            item[food_id]['num']++;
        } else {
            item[food_id] = {
                "num": 1,
                "id": food_id,
                "name": name,
                "price": price,
                "specs": specs,
                "packing_fee": packing_fee,
                "sku_id": sku_id,
                "stock": stock
            };
        }
        commit(ADD_CART, cart)
    },
    removeCart({ state, commit }, shopInfo) {
        const {
            restaurant_id,
            category_id,
            item_id,
            food_id
        } = shopInfo;
        let cart = Object.assign({}, state.cartList);
        let shop = cart[restaurant_id] = (cart[restaurant_id] || {});
        let category = shop[category_id] = (shop[category_id] || {});
        let item = category[item_id] = (category[item_id] || {});
        if (item && item[food_id]) {
            if (item[food_id]['num'] > 0) {
                item[food_id]['num']--;
            } else {
                //商品数量为0，则清空当前商品的信息
                item[food_id] = null;
            }
        }
        commit(ADD_CART, cart)
    },
    //  清空购物车
    clearCart({ state, commit }, restaurant_id) {
        let cart = Object.assign({}, state.cartList);
        if (!cart[restaurant_id]) return;
        cart[restaurant_id] = null;
        commit(ADD_CART, cart)
    },
    //选择地址
    selectAddress({ commit }, address) {
        commit(CHOOSE_ADDRESS, address)
    }
}

export default actions