<template>
    <div class="cartControl-wrapper">
        <span class="cart-decrease">
            <transition name="fade">
                <span class="inner" v-show="food !== 0">-</span>
            </transition>
        </span>
        <span class="cart-count" v-show="food !== 0">{{food}}</span>
        <span class="cart-add" @click="addCount">+</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            food: 0
        };
    },
    methods: {
        addCount() {
            this.food += 1
        }
    }
};
</script>

<style lang="scss">
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