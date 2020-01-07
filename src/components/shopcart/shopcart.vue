<template>
    <div>
        <div class="shopCart">
            <div class="content" @click.stop="toggleList()">
                <div class="content-left">
                    <div class="logo-wrapper" ref="num">
                        <div class="logo" :class="{'highlight': totalCount > 0}">
                            <i class="fa fa-shopping-cart" :class="{'highlight': totalCount > 0}"></i>
                        </div>
                        <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
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
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>
                    <div class="list-content">
                        <ul>
                            <li
                                class="shopcart-food"
                                v-for="(food, index) in selectFood"
                                :key="index"
                                v-show="food.count !== 0"
                            >
                                <div class="name">{{food.name}}</div>
                                <div class="price">￥{{20 * food.count}}</div>
                                <div class="cartControl-wrapper">
                                    <v-cartControl :food="food"></v-cartControl>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <div class="ball-container">
            <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                <div class="ball" v-show="pos.ballFlag" ref="ball">
                    <div class="inner inner-hook"></div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import vCartControl from "@/components/cartControl/cartControl";
import { mapMutations } from "vuex";
export default {
    props: ["selectFood", "pos"],
    data() {
        return {
            deliveryPrice: 5, //配送费
            minPrice: 30, //起步价
            fold: true
        };
    },
    computed: {
        totalPrice() {
            let total = 0;
            this.selectFood.forEach(food => {
                total += 20 * food.count;
            });
            return total;
        },
        totalCount() {
            let count = 0;
            this.selectFood.forEach(food => {
                count += food.count;
            });

            return count;
        },
        slowCount() {
            return this.minPrice - this.totalPrice;
        },
        payClass() {
            if (this.totalPrice < this.minPrice) {
                return "not-enough";
            } else {
                return "enough";
            }
        },
        listShow() {
            if (!this.totalCount) {
                return false;
            }
            let show = !this.fold;
            return show;
        }
    },
    methods: {
        ...mapMutations(["SAVE_FOODS"]),
        toggleList() {
            if (!this.totalCount) {
                return;
            }
            this.fold = !this.fold;
        },
        empty() {
            this.selectFood.forEach(food => {
                food.count = 0;
            });
        },
        goPay() {
            // 将一个订单所拥有的数量和价钱保存为一个对象,存储到订单列表的最后一位
            var date = new Date();
            const atrObj = {
                date,
                name: this.$route.query.name,
                totalCount: this.totalCount,
                totalPrice: this.totalPrice,
                foods: this.selectFood
            };
            this.SAVE_FOODS(atrObj);
            this.$router.push("/confrimOrder");
        },
        beforeEnter(el) {
            // 获取小球的 在页面中的位置
            el.style.left = this.pos.posX + "px";
            el.style.top = this.pos.posY + "px";
            el.style.transform = "translate(0, 0)";
        },
        //小球动画
        enter(el, done) {
            const ballPosition = this.$refs.num.getBoundingClientRect();
            const xDist = this.pos.posX - ballPosition.left;
            const yDist = this.pos.posY - ballPosition.top;
            el.style.transform = `translate(${-xDist}px, ${-yDist}px)`;
            el.style.transition = "all 0.5s cubic-bezier(.4,-0.3,1,.68)";
            done();
        },
        afterEnter() {
            this.pos.ballFlag = !this.pos.ballFlag;
        }
    },
    components: {
        vCartControl
    }
};
</script>
<style lang="scss">
@mixin fj($type: space-between){
	display: flex;
	justify-content: $type;

}
@mixin wh($width, $height){
	width: $width;
	height: $height;
}
//字体大小、行高、字体
@mixin font($size, $line-height, $family: 'Microsoft YaHei') {  
	font: #{$size}/#{$line-height} $family;
}
.shopCart {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    @include wh(100%, 48px);
    .content {
        display: flex;
        background: #141d27;
        .content-left {
            flex: 1;
            .logo-wrapper {
                display: inline-block;
                position: relative;
                top: -10px;
                @include wh(56px, 56px);
                margin: 0 12px;
                padding: 6px;
                vertical-align: top;
                border-radius: 50%;
                background: #141d27;
                .num {
                    position: absolute;
                    top: 0;
                    right: 0;
                    @include wh(24px, 24px);
                    border-radius: 16px;
                    @include font(12px, 24px);
                    text-align: center;
                    font-weight: 700;
                    color: #fff;
                    background: rgb(240, 20, 20);
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
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
                vertical-align: top;
                margin-top: 12px;
                padding-right: 12px;
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                @include font(16px, 24px);
                font-weight: 700;
                color: rgba(255, 255, 255, 0.4);
                &.highlight {
                    color: #fff;
                }
            }
            .desc {
                display: inline-block;
                margin-left: 12px;
                margin-top: 12px;
                @include font(12px, 24px);
                vertical-align: top;
                color: rgba(255, 255, 255, 0.4);
            }
        }
        .content-right {
            width: 105px;
            .pay {
                height: 48px;
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
                position: relative;
                padding: 12px 0;
                box-sizing: border-box;
                border-bottom: 1px solid rgba(7, 17, 27, 0.1);
                .name {
                    float: left;
                    font-size: 14px;
                    line-height: 36px;
                    color: rgb(7, 17, 27);
                }
                .price {
                    float: right;
                    position: absolute;
                    right: 90px;
                    bottom: 12px;
                    @include font(14px, 36px);
                    font-weight: 700;
                    color: rgb(240, 20, 20);
                }
                .cartControl-wrapper {
                    position: relative;
                    .cartControl {
                        position: absolute;
                        right: -10px;
                        bottom: 3px;
                        width: 100px;
                    }
                }
            }
        }
    }
}
.ball-container {
    .ball {
        position: fixed;
        z-index: 200;

        .inner {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: rgb(0, 160, 220);
        }
    }
}
</style>