<template>
    <div class="user">
        <header class="header">
            <div class="header-left" @click="goback" v-if="$route.fullPath != '/user/main'">
                <van-icon name="arrow-left" />
                <span>返回</span>
            </div>
            <div class="header-middle">{{title}}</div>
        </header>
        <section class="content-container">
            <keep-alive>
                <router-view
                    v-if="$route.meta.keepAlive"
                    :key="$route.fullPath + $route.query.address_id"
                ></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </section>
        <footer class="footer" v-show="$route.path == '/user/main'">
            <v-Footer />
        </footer>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import vFooter from "@/components/footer/footer";
import { reqUserInfo } from "@/api/index";
export default {
    data() {
        return {
            title: "", // 头部标题
            profiletitle: "我的",
            username: "登录/注册", //用户名
            resetname: "",
            mobile: "暂无绑定手机号", //电话号码
            balance: 0, //我的余额
            count: 0, //优惠券个数
            pointNumber: 0, //积分数
            avatar: "" //头像地址
            // imgBaseUrl,
        };
    },
    mounted() {
        this.initData();
    },
    computed: {
        ...mapState(["userInfo", "avactor"])
    },
    watch: {
        userInfo: function() {
            this.initData();
        },
        $route: function(newval) {
            this.title = newval.meta.title;
        }
    },
    methods: {
        ...mapActions(["getUserInfo"]),
        async initData() {
            this.title = this.$route.meta.title;

            if (this.userInfo && this.userInfo.user_id) {
                this.avatar = this.userInfo.avatar;
                this.username = this.userInfo.username;
                this.mobile = this.userInfo.mobile || "暂无绑定手机号";
                this.balance = this.userInfo.balance;
                this.count = this.userInfo.gift_amount;
                this.pointNumber = this.userInfo.point;
            } else {
                this.username = "登录/注册";
                this.mobile = "暂无绑定手机号";
            }
        },
        //返回上一级
        goback() {
            this.$router.go(-1);
        }
    },
    components: {
        vFooter
    }
};
</script>

<style lang="scss" scoped>
.user {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .header {
        height: 50px;
        line-height: 50px;
        color: #fff;
        background-color: #01a3f8;
        .header-left {
            padding-left: 10px;
        }
        .header-middle {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
        }
    }
    .content-container {
        flex: 1;
        overflow: auto;
    }
    .footer {
        height: 50px;
    }
}
</style>