<template>
    <div class="user">
        <router-link class="user_detail" :to="userInfo? '/user/info': '/login'">
            <img src="@/assets/images/avactor.jpg" class="user_avactor" />
            <section class="user_info">
                <div class="user_login">
                    <span>{{username}}</span>
                </div>
                <div class="user_tel">
                    <img src="@/assets/images/tel_logo.png" class="tel_logo" />
                    <span>暂无绑定手机号</span>
                </div>
            </section>
            <span class="user_link fa fa-angle-right"></span>
        </router-link>
        <div class="user_data">
            <ul>
                <li>
                    <span class="num">
                        <i class="num_banlance">0.00</i>元
                    </span>
                    <span class="description">我的余额</span>
                </li>
                <li>
                    <span class="num">
                        <i class="num_offer">0</i>个
                    </span>
                    <span class="description">我的优惠</span>
                </li>
                <li>
                    <span class="num">
                        <i class="num_score">0</i>分
                    </span>
                    <span class="description">我的积分</span>
                </li>
            </ul>
        </div>
        <section class="user_profile">
            <ul>
                <router-link to="/confrimOrder" tag="li">
                    <span>
                        <img src="@/assets/images/avactor.jpg" alt />我的订单
                    </span>
                    <span class="fa fa-angle-right"></span>
                </router-link>
                <li>
                    <span>
                        <img src="@/assets/images/avactor.jpg" alt />积分商城
                    </span>
                    <span class="fa fa-angle-right"></span>
                </li>
                <li>
                    <span>
                        <img src="@/assets/images/avactor.jpg" alt />饿了吗会员卡
                    </span>
                    <span class="fa fa-angle-right"></span>
                </li>
            </ul>
        </section>
        <section class="user_profile">
            <ul>
                <li>
                    <span>
                        <img src="@/assets/images/avactor.jpg" alt />服务中心
                    </span>
                    <span class="fa fa-angle-right"></span>
                </li>
                <li>
                    <span>
                        <img src="@/assets/images/avactor.jpg" alt />下载饿了么APP
                    </span>
                    <span class="fa fa-angle-right"></span>
                </li>
            </ul>
        </section>
        <v-Footer/>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import vFooter from "@/components/footer/footer";
export default {
    data() {
        return {
            profiletitle: "我的",
            username: "登录/注册", //用户名
            resetname: "",
            mobile: "暂无绑定手机号", //电话号码
            balance: 0, //我的余额
            count: 0, //优惠券个数
            pointNumber: 0 //积分数
            // imgBaseUrl,
        };
    },
    created() {
        this.initData();
    },
    computed: {
        ...mapState(["userInfo", "avactor"])
    },
    methods: {
        ...mapMutations([""]),
        initData() {
            if (this.userInfo) {
                this.username = this.userInfo.phoneNumber;
            }
        }
    },
    components: {
        vFooter
    }
};
</script>

<style lang="scss" scoped>
.user_detail {
    display: flex;
    background-color: #01a3f8;
    padding: 45px 20px 20px;
    .user_avactor {
        width: 80px;
        height: 80px;
        border-radius: 40px;
    }
    .user_info {
        flex: 1;
        color: #fff;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .user_login {
            font-size: 20px;
            font-weight: 600;
        }
        .user_tel {
            .tel_logo {
                width: 20px;
                vertical-align: middle;
            }
        }
    }
    .user_link {
        line-height: 80px;
        font-size: 18px;
        font-weight: 600;
        color: #eee;
    }
}
.user_data {
    background-color: #fff;
    ul {
        display: flex;
        height: 100%;
        li {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
            border-right: 1px solid #eee;
            padding-bottom: 20px;
            .num {
                font-size: 14px;
                line-height: 60px;
                i {
                    font-style: normal;
                    font-size: 30px;
                    color: #ff9900;
                    font-weight: 700;
                    &.num_offer {
                        color: #ff5f3e;
                    }
                    &.num_score {
                        color: #6ac20b;
                    }
                }
            }
            .description {
                font-size: 14px;
                color: #666;
            }
        }
    }
}
.user_profile {
    margin-top: 10px;
    background-color: #fff;
    ul {
        li {
            padding: 10px;
            border-bottom: 1px solid #eee;
            display: flex;
            span:nth-of-type(1) {
                font-size: 18px;
                img {
                    width: 20px;
                    vertical-align: top;
                    margin-right: 5px;
                }
            }
            span:nth-of-type(2) {
                color: #999;
                font-size: 20px;
            }
        }
    }
}
</style>