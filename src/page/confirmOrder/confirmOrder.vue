<template>
    <div class="confirmOrder">
        <header class="confirm-header">
            <div class="header-left" @click="goBack">
                <van-icon name="arrow-left" />
            </div>
            <div class="header-middle">
                <span>确认订单</span>
            </div>
        </header>

        <section class="confirm-container">
            <section class="send-position card" @click="addAddress">
                <div class="add-address" v-if="!chooseAddress && !userInfo">
                    <span class="image-location">
                        <van-icon name="add-o" />
                    </span>
                    <span>请添加一个收货地址</span>
                </div>
                <div class="address-detail-container" v-else-if="chooseAddress">
                    <div class="address-left">
                        <van-icon name="location-o" />
                    </div>
                    <div class="address-right">
                        <header>
                            <span>{{chooseAddress.name}}</span>
                            <span>{{chooseAddress.sex == 1 ? "先生" : "女士"}}</span>
                            <span>{{chooseAddress.phone}}</span>
                        </header>
                        <div class="address-detail">
                            <span
                                :style="{backgroundColor: iconColor(chooseAddress.tag)}"
                            >{{chooseAddress.tag}}</span>
                            <p>{{chooseAddress.address + chooseAddress.address_detail}}</p>
                        </div>
                    </div>
                </div>
                <div class="address-choose">
                    <van-icon name="arrow" />
                </div>
            </section>
            <div class="line"></div>
            <section class="card send-time flex">
                <div class="time-left weight">送达时间</div>
                <div class="time-right">
                    <span v-if="checkoutData">尽快送达 | 预计 {{checkoutData.delivery_reach_time}}</span>
                </div>
            </section>
            <section class="card pay-methods flex">
                <div class="pay-left weight">支付方式</div>
                <div class="pay-right">
                    <span>在线支付</span>
                    <van-icon name="arrow" />
                </div>
            </section>
            <section class="food card">
                <header class="shop-name weight border" v-if="checkoutData">
                    <span>{{checkoutData.cart.restaurant_info.name}}</span>
                </header>
                <ul class="food-detail" v-if="checkoutData">
                    <li
                        class="list flex"
                        v-for="item in checkoutData.cart.groups[0]"
                        :key="item.id"
                    >
                        <div class="food-name">{{item.name}}</div>
                        <div class="food-num">x {{item.quantity}}</div>
                        <div class="food-price weight">¥{{item.price}}</div>
                    </li>
                </ul>
                <div class="box-price list flex" v-if="checkoutData">
                    <div class="box-left">{{checkoutData.cart.extra[0].name}}费</div>
                    <div class="box-right weight">¥ {{checkoutData.cart.extra[0].price}}</div>
                </div>
                <div class="delivery list flex border" v-if="checkoutData">
                    <div class="delivery-left">
                        <span>配送费*</span>
                        <span>蜂鸟配送</span>
                    </div>
                    <div class="delivery-right weight">¥ {{checkoutData.cart.deliver_amount || 0}}</div>
                </div>
                <div class="hongbao list flex border">
                    <div class="hongbao-left weight">红包/抵用券</div>
                    <div class="hongbao-right">
                        <span>无可用红包</span>
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="pay-money list flex" v-if="checkoutData">
                    <div class="pay-left"></div>
                    <div class="pay-right">
                        <span>小计</span>
                        <span class="weight pay-price">¥{{checkoutData.cart.total}}</span>
                    </div>
                </div>
            </section>

            <section class="remarks card">
                <div class="order-remark flex base" @click="writeRemark">
                    <div class="remark-left weight">订单备注</div>
                    <div class="remark-right choose">
                        <span>口味、偏好</span>
                        <van-icon name="arrow" :class="{'arrow-icon': showRemark}" />
                    </div>
                </div>
                <div class="remark-detail" v-show="showRemark">
                    <van-field
                        v-model="message"
                        rows="1"
                        autosize
                        label="备注"
                        type="textarea"
                        placeholder="请输入备注内容"
                    />
                </div>
                <div class="tableware flex base" @click="showPopup">
                    <div class="tableware-left weight">餐具份数</div>
                    <div class="tableware-right choose">
                        <span>{{tablewareNum}}</span>
                        <van-icon name="arrow" />
                    </div>
                </div>
                <van-popup v-model="show" closeable position="bottom" :style="{ height: '30%' }">
                    <van-picker
                        show-toolbar
                        :columns="columns"
                        @cancel="onCancel"
                        @confirm="onConfirm"
                        title="选择本单餐具"
                    />
                </van-popup>
                <div class="invoice flex base">
                    <div class="invoice-left weight">发票信息</div>
                    <div class="invoice-right choose">该店不支持线上开票，请电话联系商户</div>
                </div>
            </section>
        </section>

        <footer class="confirm-pay" v-if="checkoutData">
            <div class="footer-left">待支付 ¥{{checkoutData.cart.total}}</div>
            <div class="footer-right" @click="confrimOrder">确认下单</div>
        </footer>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { checkout, reqUserAddressList, placeOrders } from "@/api/index";
import { Dialog, Notify } from "vant";
export default {
    data() {
        return {
            showList: false,
            restaurant_id: 0, // 当前购物车商店id
            shopCart: null, //当前商店购物车
            checkoutData: null, //获取购物信息
            showRemark: false, //是否显填写订单页面
            message: "", // 备注内容
            show: false,
            columns: ["无需餐具", "1份", "2份", "3份", "4份", "5份"], //餐具份数
            tablewareNum: "1份" // 餐具分数,默认为1份
        };
    },
    computed: {
        ...mapState(["cartList", "userInfo", "chooseAddress", "geohash"])
    },
    created() {
        this.restaurant_id = this.$route.query.restaurant_id;
        //获取当前商铺购物车信息
        this.shopCart = this.cartList[this.restaurant_id];
    },
    mounted() {
        this.initData();
    },
    methods: {
        ...mapActions(["selectAddress"]),
        //返回上一级
        goBack() {
            this.$router.go(-1);
        },
        // 初始化数据
        async initData() {
            let newArr = new Array();
            Object.values(this.shopCart).forEach(categoryItem => {
                Object.values(categoryItem).forEach(itemValue => {
                    Object.values(itemValue).forEach(item => {
                        newArr.push({
                            attrs: [],
                            extra: {},
                            id: item.id,
                            name: item.name,
                            packing_fee: item.packing_fee,
                            price: item.price,
                            quantity: item.num,
                            sku_id: item.sku_id,
                            specs: [item.specs],
                            stock: item.stock
                        });
                    });
                });
            });
            // 检查订单是否满足条件
            this.checkoutData = await checkout(
                this.geohash,
                [newArr],
                this.restaurant_id
            );
            this.initAddress();
        },

        //获取地址信息，第一个地址为默认选择地址
        async initAddress() {
            if (this.userInfo && this.userInfo.user_id && !this.chooseAddress) {
                const addressRes = await reqUserAddressList(
                    this.userInfo.user_id
                );
                if (addressRes instanceof Array && addressRes.length) {
                    this.selectAddress(addressRes[0]);
                }
            }
        },

        //地址备注颜色
        iconColor(name) {
            switch (name) {
                case "公司":
                    return "#4cd964";
                case "学校":
                    return "#3190e8";
            }
        },
        // 添加地址或者选择地址
        addAddress() {
            if (!this.userInfo) {
                Dialog.confirm({
                    title: "标题",
                    message: "你还没有登陆,请前去登陆?"
                }).then(() => {
                    this.$router.push("/login");
                });
            } else {
                this.$router.push({
                    path: "/user/editAddress",
                    query: { restaurant_id: this.restaurant_id }
                });
            }
        },

        // 填写订单
        writeRemark() {
            this.showRemark = !this.showRemark;
        },
        // 显示遮挡层
        showPopup() {
            this.show = true;
        },
        // 确认餐具分数
        onConfirm(value, index) {
            this.tablewareNum = value;
            this.show = false;
        },
        // 取消选择餐具分数
        onCancel() {
            this.show = false;
        },
        //确认订单
        async confrimOrder() {
            //用户未登录时弹出提示框
            if (!this.userInfo) {
                Notify({ type: "danger", message: "抱歉,您还未登陆" });
                return;
                //未选择地址则提示
            } else if (!this.chooseAddress) {
                Notify({ type: "danger", message: "抱歉,你还未选择收货地址" });
                return;
            }
            //保存订单
            // this.SAVE_ORDER_PARAM({
            //     user_id: this.userInfo.user_id,
            //     cart_id: this.checkoutData.cart.id,
            //     address_id: this.choosedAddress.id,
            //     description: this.remarklist,
            //     entities: this.checkoutData.cart.groups,
            //     geohash: this.geohash,
            //     sig: this.checkoutData.sig,
            // });
            //发送订单信息
            let orderRes = await placeOrders(
                this.userInfo.user_id,
                this.checkoutData.cart.id,
                this.chooseAddress.id,
                this.remarklist,
                this.checkoutData.cart.groups,
                this.geohash,
                this.checkoutData.sig
            );
            this.$router.push("/confirmOrder/payment");
        }
    }
};
</script>

<style lang="scss" scoped>
.confirmOrder {
    padding-bottom: 50px;
    .confirm-header {
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
    .confirm-container {
        padding: 10px;
        .card {
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
            background-color: #fff;
        }
        .weight {
            font-weight: 600;
        }
        .flex {
            display: flex;
            justify-content: space-between;
        }
        .border {
            border-bottom: 1px solid #ccc;
        }
        .send-position {
            position: relative;
            height: 60px;
            .add-address {
                line-height: 40px;
                .image-location {
                    display: inline-block;
                    width: 30px;
                    text-align: center;
                    vertical-align: middle;
                    color: #333;
                }
            }
            .address-detail-container {
                display: flex;
                justify-content: space-between;
                margin-left: 3px;
                font-size: 14px;
                .address-left {
                    width: 30px;
                    margin-top: 10px;
                    font-size: 20px;
                }
                .address-right {
                    flex: 1;
                    header {
                        color: #777;
                        span:nth-of-type(1) {
                            color: #000;
                            margin-left: 3px;
                            font-weight: bold;
                        }
                        span:nth-of-type(2) {
                            margin: 0 3px;
                        }
                    }
                    .address-detail {
                        display: flex;
                        width: 100%;
                        align-items: center;
                        font-size: 12px;
                        span {
                            display: inline-block;
                            border-radius: 3px;
                            padding: 2px 5px;
                            margin-right: 5px;
                            color: #fff;
                            line-height: 20px;
                            background-color: #ff5722;
                        }
                        p {
                            width: 80%;
                            color: #000;
                            font-weight: 600;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }
            .address-choose {
                position: absolute;
                right: 10px;
                top: 0;
                line-height: 60px;
            }
        }
        .line {
            height: 2px;
            margin-top: -10px;
            background: repeating-linear-gradient(
                -45deg,
                #ff6c6c 0,
                #ff6c6c 20%,
                transparent 0,
                transparent 25%,
                #1989fa 0,
                #1989fa 45%,
                transparent 0,
                transparent 50%
            );
            background-size: 80px;
        }
        .send-time {
            height: 60px;
            .time-left {
                line-height: 40px;
            }
            .time-right {
                flex: 1;
                text-align: right;
                line-height: 40px;
                color: #01a3f8;
            }
        }
        .pay-methods {
            display: flex;
            justify-content: space-between;
        }
        .food {
            .list {
                height: 36px;
                line-height: 36px;
            }
            .shop-name {
                height: 50px;
                line-height: 50px;
            }
            .pay-price {
                font-size: 20px;
                color: #ff5722;
            }
            .food-detail {
                li {
                    position: relative;
                    .food-num {
                        position: absolute;
                        left: 50%;
                        color: #ff5722;
                    }
                }
            }
        }
        .remarks {
            .base {
                height: 36px;
                line-height: 36px;
                border-bottom: 1px solid #ccc;
            }
            .choose {
                font-size: 12px;
                color: #999;
            }
            .arrow-icon {
                transform: rotate(90deg);
                transition: all 0.3s linear;
            }
        }
    }
    .confirm-pay {
        display: flex;
        justify-content: space-between;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 50px;
        .footer-left {
            height: 50px;
            line-height: 50px;
            padding: 0 10px;
            width: 60%;
            color: #ccc;
            background-color: #000;
        }
        .footer-right {
            flex: 1;
            height: 50px;
            line-height: 50px;
            padding: 0 10px;
            text-align: center;
            color: #fff;
            background-color: #56d176;
        }
    }
}
</style>