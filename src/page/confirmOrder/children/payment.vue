<template>
    <div class="payment">
        <header class="payment-header">
            <div class="header-left" @click="goBack">
                <van-icon name="arrow-left" />
            </div>
            <div class="header-middle">
                <span>在线支付</span>
            </div>
        </header>
        <section class="payment-container">
            <section class="pay">
                <div class="pay-title">支付剩余时间</div>
                <div class="pay-time">{{remaining}}</div>
            </section>
            <section class="choose-pay-methods">
                <div class="choose-title">选择支付方式</div>
                <div class="pay-zhifubao same" @click="choosePayMethod('zhifubao')">
                    <div class="pay-left">
                        <img src="@/assets/images/zhifubao.png" alt class="pay-icon" />
                        <span class="pay-name">支付宝</span>
                    </div>
                    <div class="pay-right">
                        <span
                            class="outcircle"
                            :class="[payMethod == 'zhifubao' ? 'current-select': '']"
                        ></span>
                        <van-icon name="success" class="select" size="28" />
                    </div>
                </div>
                <div class="pay-weixin same" @click="choosePayMethod('weixin')">
                    <div class="pay-left">
                        <img src="@/assets/images/weixin.png" alt class="pay-icon" />
                        <span class="pay-name">微信</span>
                    </div>
                    <div class="pay-right">
                        <span
                            class="outcircle"
                            :class="[payMethod == 'weixin' ? 'current-select': '']"
                        ></span>
                        <van-icon name="success" class="select" size="28" />
                    </div>
                </div>
            </section>
            <button class="confirm-pay" @click="confirmPay">确认支付</button>
        </section>
    </div>
</template>

<script>
import { Dialog } from "vant";
export default {
    data() {
        return {
            timer: null,
            payMethod: "zhifubao", //默认支付方式为支付宝
            countNum: 900 //倒计时15分钟
        };
    },
    computed: {
        //时间转换
        remaining: function() {
            let minute = parseInt(this.countNum / 60);
            if (minute < 10) {
                minute = "0" + minute;
            }
            let second = parseInt(this.countNum % 60);
            if (second < 10) {
                second = "0" + second;
            }
            return "00 : " + minute + " : " + second;
        }
    },
    created() {
        this.initData();
    },
    mounted() {
        this.remainingTime();
    },
    // 清楚定时器
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        // 初始化信息
        async initData() {
            Dialog.alert({
                message: "暂不开放支付功能"
            });
        },
        // 返回上一级
        goBack() {
            this.$router.go(-1);
        },

        //选择支付方式
        choosePayMethod(value) {
            this.payMethod = value;
        },
        //倒计时
        remainingTime() {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.countNum--;
                console.log(1)
                if (this.countNum == 0) {
                    clearInterval(this.timer);
                    Dialog.alert({
                        message: "支付超时,请重新下单"
                    }).then(
                        setTimeout(() => {
                            this.$router.replace("/home");
                        }, 1100)
                    );
                }
            }, 1000);
        },

        // 确认付款
        confirmPay() {
            Dialog.alert({
                message: "当前环境无法支付，请打开官方APP进行付款"
            }).then(() => {
                this.$router.replace("/order");
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.payment {
    .payment-header {
        position: relative;
        height: 50px;
        color: #fff;
        background-color: #01a3f8;
        .header-left {
            line-height: 50px;
        }
        .header-middle {
            position: absolute;
            top: 0;
            left: 50%;
            width: 50%;
            text-align: center;
            line-height: 50px;
            transform: translateX(-50%);
        }
    }
    .payment-container {
        .pay {
            height: 160px;
            text-align: center;
            background-color: #fff;
            .pay-title {
                padding: 40px 0 20px;
                font-size: 18px;
                color: #aaa;
            }
            .pay-time {
                font-size: 40px;
            }
        }
        .choose-pay-methods {
            .choose-title {
                height: 50px;
                padding-left: 10px;
                line-height: 50px;
            }
            .same {
                display: flex;
                justify-content: space-between;
                height: 60px;
                background-color: #fff;
                .pay-left {
                    width: 50%;
                    line-height: 60px;
                    .pay-icon {
                        width: 50px;
                        height: 50px;
                        margin: 0 10px;
                        vertical-align: middle;
                    }
                }
                .pay-right {
                    height: 60px;
                    position: relative;
                    .outcircle {
                        display: inline-block;
                        width: 30px;
                        height: 30px;
                        margin: 15px 10px;
                        border-radius: 15px;
                        background-color: #aaa;
                    }
                    .select {
                        position: absolute;
                        right: 11px;
                        top: 16px;
                        color: #fff;
                    }
                    .current-select {
                        background-color: #4cd964;
                    }
                }
            }
        }
        .confirm-pay {
            width: 90%;
            height: 40px;
            margin: 5%;
            border: none;
            font-size: 18px;
            color: #fff;
            background-color: #4cd964;
        }
    }
}
</style>