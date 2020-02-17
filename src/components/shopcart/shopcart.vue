<template>
    <div>
        <div class="shopCart">
            <div class="content" @click.stop="toggleList()">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{'highlight': totalCount > 0}">
                            <van-icon
                                name="shopping-cart-o"
                                :class="{'highlight': totalCount > 0}"
                            />
                        </div>
                        <div class="num" ref="num">
                            <span v-show="totalCount">{{totalCount}}</span>
                        </div>
                    </div>
                    <div class="price" :class="{'highlight': totalPrice > 0}">￥{{totalPrice}}</div>
                    <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
                </div>
                <div class="content-right">
                    <div class="pay" :class="payClass">
                        <div v-if="totalPrice === 0">{{minPrice}}元起送</div>
                        <div v-if="totalPrice < minPrice">还差￥{{slowCount}}元起送</div>
                        <div v-if="totalPrice >= minPrice" @click.stop="goPay">添加订单</div>
                    </div>
                </div>
            </div>
            <transition name="fade">
                <div class="shopcart-list" v-show="listShow&&cartFoodList.length">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>
                    <div class="list-content">
                        <ul>
                            <li
                                class="shopcart-food"
                                v-for="(food, index) in cartFoodList"
                                :key="index"
                                v-show="food.num !== 0"
                            >
                                <div class="name">{{food.name}}</div>
                                <div class="price">￥{{food.num * food.price}}</div>
                                <div class="cartControl-wrapper">
                                    <v-cartControl :food="shopCartList[index]"></v-cartControl>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import vCartControl from "@/components/cartControl/cartControl";
export default {
    props: ["cartFoodList", "menuList"],
    data() {
        return {
            deliveryPrice: 5, //配送费
            minPrice: 30, //起步价
            fold: false,
            listShow: false, //显示购物车
            shopCartList: [], //购物车需要传入cartControl组件的数据
            dotPosition: false // 判断是否存在点的位置，起始默认为false
        };
    },
    mounted() {
        this.$nextTick(() => {
            let elLeft = this.$refs.num.getBoundingClientRect().left;
            let elTop = this.$refs.num.getBoundingClientRect().top;
            this.$emit("getEndDotPosition", { elLeft, elTop });
        });
    },
    computed: {
        payClass() {
            if (this.totalPrice < this.minPrice) {
                return "not-enough";
            } else {
                return "enough";
            }
        },
        // 距离多少钱配送
        slowCount() {
            return this.minPrice - this.totalPrice;
        },
        // 获取总金额
        totalPrice() {
            let totalPrice = 0;
            this.cartFoodList.forEach(item => {
                totalPrice += item.num * item.price;
            });
            return totalPrice;
        },

        // 获取每件商品的数量
        totalCount() {
            let totalCount = 0;
            this.cartFoodList.forEach(item => {
                totalCount += item.num;
            });
            return totalCount;
        }
    },
    watch: {
        cartFoodList: function(newval) {
            this.cartList(newval);
        }
    },

    methods: {
        ...mapActions(["clearCart"]),
        // 是否显示购物车
        toggleList() {
            this.listShow = this.cartFoodList.length
                ? (this.showCartList = !this.showCartList)
                : true;
        },
        //清空购物车
        empty() {
            this.clearCart(this.cartFoodList[0].restaurant_id);
        },

        // 获取当前购物车数据
        cartList(list) {
            const shopCartList = [];
            this.menuList.forEach(item1 => {
                item1.foods.forEach(item2 => {
                    list.forEach(item3 => {
                        if (
                            item2.restaurant_id == item3.restaurant_id &&
                            item2.category_id == item3.category_id &&
                            item2.item_id == item3.item_id &&
                            item2.specfoods[0].food_id == item3.food_id
                        ) {
                            shopCartList.push(item2);
                        }
                    });
                });
            });
            this.shopCartList = shopCartList;
        },

        // 确认订单
        goPay() {
            this.$router.push({
                path: "/confirmOrder",
                query: { restaurant_id: this.cartFoodList[0].restaurant_id }
            });
        }
    },
    components: {
        vCartControl
    }
};
</script>
<style lang="scss" scoped>
@mixin fj($type: space-between) {
    display: flex;
    justify-content: $type;
}
@mixin wh($width, $height) {
    width: $width;
    height: $height;
}
//字体大小、行高、字体
@mixin font($size, $line-height, $family: "Microsoft YaHei") {
    font: #{$size}/#{$line-height} $family;
}
.shopCart {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    @include wh(100%, 50px);
    .content {
        display: flex;
        background: #141d27;
        .content-left {
            flex: 1;
            .logo-wrapper {
                display: inline-block;
                position: relative;
                top: -10px;
                @include wh(50px, 56px);
                margin: 0 5px;
                padding: 6px;
                vertical-align: top;
                border-radius: 50%;
                background: #141d27;
                .num {
                    position: absolute;
                    top: 0;
                    right: 0;
                    span {
                        display: inline-block;
                        @include wh(24px, 24px);
                        border-radius: 16px;
                        @include font(12px, 24px);
                        text-align: center;
                        font-weight: 700;
                        color: #fff;
                        background: rgb(240, 20, 20);
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
                    }
                }
                .logo {
                    @include wh(100%, 100%);
                    border-radius: 50%;
                    text-align: center;
                    background: #2b343c;
                    &.highlight {
                        background: rgb(0, 160, 220);
                    }
                    i {
                        font-size: 25px;
                        line-height: 44px;
                        color: #80858a;
                        &.highlight {
                            color: #fff;
                        }
                    }
                }
            }
            .price {
                display: inline-block;
                padding: 0 8px;
                @include font(16px, 48px);
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                font-weight: 700;
                color: rgba(255, 255, 255, 0.4);
                &.highlight {
                    color: #fff;
                }
            }
            .desc {
                display: inline-block;
                padding: 0 5px;
                @include font(12px, 50px);
                color: rgba(255, 255, 255, 0.4);
            }
        }
        .content-right {
            width: 80px;
            .pay {
                height: 48px;
                padding: 0 5px;
                @include font(12px, 48px);
                text-align: center;
                font-weight: 700;
                color: rgba(255, 255, 255, 0.4);
                background: #2b333b;
                &.not-enough {
                    background: #2b333b;
                }
                &.enough {
                    background: #00b43c;
                    color: #fff;
                }
            }
        }
    }
    .shopcart-list {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        transform: translateY(-100%);
        &.fade-enter-active,
        &.fade-leave-active {
            transition: all 0.5s;
            transform: translateY(-100%);
        }
        &.fade-enter,
        &.fade-leave-active {
            transform: translateY(0);
        }
        .list-header {
            height: 40px;
            line-height: 40px;
            padding: 0 18px;
            background: #f3f5f7;
            border-bottom: 1px solid rgba(7, 17, 27, 0.1);
            .title {
                float: left;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }
            .empty {
                float: right;
                font-size: 12px;
                color: rgb(0, 160, 220);
            }
        }
        .list-content {
            padding: 0 18px;
            max-height: 217px;
            overflow: auto;
            background: #fff;
            .shopcart-food {
                @include fj;
                height: 30px;
                border-bottom: 1px solid rgba(7, 17, 27, 0.1);
                font-size: 14px;
                div {
                    line-height: 30px;
                }
                .name {
                    display: inline-block;
                    width: 20%;
                    color: rgb(7, 17, 27);
                }
                .price {
                    display: inline-block;
                    width: 50%;
                    text-align: center;
                    font-weight: 700;
                    color: rgb(240, 20, 20);
                }
                .cartControl-wrapper {
                    display: inline-block;
                }
            }
        }
    }
}
</style>