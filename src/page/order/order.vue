<template>
    <div class="order">
        <header class="order-header">
            <div class="header-left" @click="goback">
                <van-icon name="arrow-left" />
            </div>
            <div class="header-center">订单列表</div>
        </header>
        <section class="order-container" @scroll="handleScroll">
            <ul class="order-list-ul" ref="orderList">
                <li class="order-list-li" v-for="(item, index) in orderList" :key="index">
                    <div class="list-left">
                        <img src="@/assets/images/weixin.png" alt />
                    </div>
                    <section class="list-right">
                        <header class="item-header">
                            <div class="item-header-left">
                                <h3 class="item-shop-name">
                                    <span>{{item.restaurant_name}}</span>
                                    <van-icon name="arrow" />
                                </h3>
                                <p class="item-created-time">{{item.formatted_created_at}}</p>
                            </div>
                            <div class="item-header-right">
                                <span>{{item.status_bar.title}}</span>
                            </div>
                        </header>
                        <section class="item-main">
                            <section class="item-main-left">
                                <p
                                    class="foods-detail"
                                >{{item.basket.group[0][0].name}}{{item.basket.group[0].length > 1 ? ' 等' + item.basket.group[0].length + '件商品' : ''}}</p>
                            </section>
                            <div class="item-main-right">
                                <span>¥{{item.total_amount.toFixed(2)}}</span>
                            </div>
                        </section>
                        <section class="item-last">
                            <v-computedTime
                                class="waitPay"
                                v-if="item.status_bar.title == '等待支付'"
                                :time="item.time_pass"
                            ></v-computedTime>
                            <router-link
                                :to="{path: '/shop', query: {geohash, id: item.restaurant_id}}"
                                tag="span"
                                class="timeOut"
                                v-else
                            >再来一单</router-link>
                        </section>
                    </section>
                </li>
                <li class="order-loading" v-show="showLoading">
                    <van-loading type="spinner" color="#1989fa" />
                </li>
            </ul>
        </section>
        <v-footer></v-footer>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { Dialog } from "vant";
import { getOrderList } from "@/api/index";
import vComputedTime from "@/components/computedTime/computedTime";
import vFooter from "@/components/footer/footer";
export default {
    data() {
        return {
            orderList: [], // 订单列表
            preventRepeat: false, //防止重复获取
            showLoading: true, //显示加载动画
            offset: 0 //默认跳过0条数据
        };
    },
    computed: {
        ...mapState(["userInfo", "cityInfo"]),
        geohash: function() {
            return this.cityInfo.latitude + "," + this.cityInfo.longitude;
        }
    },
    mounted() {
        this.initData();
    },
    components: {
        vComputedTime,
        vFooter
    },
    methods: {
        // 数据初始化
        async initData() {
            this.hideLoading();

            if (this.userInfo) {
                this.orderList = await getOrderList(this.userInfo.id, 0);
            } else {
                Dialog.confirm({
                    message: "抱歉,你还没有登陆!是否前去登陆??"
                }).then(() => {
                    this.$router.push("/login");
                });
            }
        },
        goback() {
            this.$router.go(-1);
        },

        // 滚动事件触发条件
        handleScroll(e) {
            const offsetHeight = this.$refs.orderList.offsetHeight;

            const pagex = document.documentElement.clientHeight;

            // 当页面滚动到页面最底部时,加载更多
            if (e.target.scrollTop + pagex > offsetHeight - 10) {
                this.loaderMore();
            }
        },
        //加载更多
        async loaderMore() {
            if (this.preventRepeat) {
                return;
            }
            this.preventRepeat = true;
            this.showLoading = true;
            this.offset += 10;
            //获取信息
            let res = await getOrderList(this.userInfo.user_id, this.offset);
            this.hideLoading();
            this.orderList = [...this.orderList, ...res];
            if (res.length < 10) {
                return;
            }
            this.preventRepeat = false;
        },

        //隐藏加载动画
        hideLoading() {
            this.showLoading = false;
        }
    }
};
</script>

<style lang='scss' scoped>
.order {
    width: 100%;
    height: 100%;
    .order-header {
        position: fixed;
        z-index: 10;
        height: 50px;
        width: 100%;
        color: #fff;
        line-height: 50px;
        background-color: #01a3f8;
        .header-left {
            height: 100%;
        }
        .header-center {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
        }
    }
    .order-container {
        height: 100%;
        overflow: auto;
        .order-list-ul {
            padding: 50px 0;
            .order-list-li {
                display: flex;
                justify-content: space-between;
                padding: 10px;
                margin: 10px;
                border-radius: 3px;
                background-color: #fff;
                .list-left {
                    width: 80px;
                    text-align: center;
                    img {
                        width: 60px;
                        height: 60px;
                    }
                }
                .list-right {
                    flex: 1;
                    .item-header {
                        display: flex;
                        justify-content: space-between;
                        padding: 10px 0;
                        .item-header-left {
                            h3 {
                                font-weight: 600;
                            }
                            p {
                                color: #999;
                            }
                        }
                        .item-header-right {
                            font-size: 14px;
                        }
                    }
                    .item-main {
                        display: flex;
                        justify-content: space-between;
                        height: 40px;
                        line-height: 40px;
                        font-size: 14px;
                        color: #999;
                        .item-main-right {
                            font-size: 16px;
                            color: #ff5722;
                        }
                    }
                    .item-last {
                        text-align: right;
                        span {
                            display: inline-block;
                            padding: 5px;
                        }
                        .timeOut {
                            color: #01a3f8;
                            border: 1px #01a3f8 solid;
                        }
                    }
                }
            }
            .order-loading {
                text-align: center;
            }
        }
    }
}
</style>