<template>
    <div class="cartControl-wrapper">
        <transition name="fade">
            <span
                class="cart-decrease"
                v-show="foodNum"
                @click="decreaseCart(food.restaurant_id, food.category_id, food.item_id, food.specfoods[0].food_id)"
            >-</span>
        </transition>
        <span class="cart-count" v-show="foodNum">{{foodNum}}</span>
        <span
            class="cart-add"
            @click="addToCart(food.restaurant_id, food.category_id, food.item_id, food.specfoods[0].food_id, food.specfoods[0].name, food.specfoods[0].price, '', food.specfoods[0].packing_fee, food.specfoods[0].sku_id, food.specfoods[0].stock, $event)"
        >+</span>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
    props: ["food"],
    computed: {
        ...mapState(["cartList"]),
        /**
         * 监听cartList变化，更新当前商铺的购物车信息shopCart，同时返回一个新的对象
         */
        shopCart: function() {
            return this.cartList[this.food.restaurant_id];
        },
        // 获取食品数量
        foodNum: function() {
            let category_id = this.food.category_id;
            let item_id = this.food.item_id;
            let food_id = this.food.specfoods[0].food_id;

            if (
                this.shopCart &&
                this.shopCart[category_id] &&
                this.shopCart[category_id][item_id] &&
                this.shopCart[category_id][item_id][food_id]
            ) {
                return this.shopCart[category_id][item_id][food_id].num;
            } else {
                return 0;
            }
        }
    },
    methods: {
        ...mapActions(["addCart", "removeCart"]),
        //增加商品
        addToCart(
            restaurant_id,
            category_id,
            item_id,
            food_id,
            name,
            price,
            specs,
            packing_fee,
            sku_id,
            stock,
            event
        ) {
            this.addCart({
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
            });
            let elLeft = event.target.getBoundingClientRect().left;
            let elTop = event.target.getBoundingClientRect().top;
            this.$emit("getStartDotPosition", {elLeft, elTop})
        },
        // 删减商品
        decreaseCart(restaurant_id, category_id, item_id, food_id) {
            if (this.foodNum > 0) {
                this.removeCart({
                    restaurant_id,
                    category_id,
                    item_id,
                    food_id
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.cartControl-wrapper {
    text-align: right;
    .cart-decrease,
    .cart-add {
        padding: 0 6px;
        line-height: 20px;
        font-size: 20px;
        &.fade-enter-active,
        &.fade-leave-active {
            transition: all 0.4s linear;
        }
        &.fade-enter,
        &.fade-leave-active {
            opacity: 0;
            transform: translateX(20px);
        }
        .inner {
            color: rgb(0, 160, 220);
        }
    }
    .cart-count {
        padding: 0 6px;
        font-size: 20px;
        line-height: 20px;
        text-align: center;
        color: rgb(147, 153, 159);
    }
    .cart-add {
        color: rgb(0, 160, 220);
    }
}
</style>