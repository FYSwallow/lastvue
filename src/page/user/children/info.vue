<template>
    <div>
        <div class="user-info">
            <div class="user-info-item item-first">
                <input type="file" ref="userAvactor" @change="uploadAvatar" />
                <h3 class="item-head">头像</h3>
                <div class="item-detail">
                    <p>
                        <img :src="imgBaseUrl + userInfo.avatar" class="head-avactor" />
                        <van-icon name="arrow" />
                    </p>
                </div>
            </div>
            <router-link class="user-info-item" to="/user/setusername" tag="div">
                <h3 class="item-head">用户名</h3>
                <div class="item-detail">
                    <p>
                        {{username}}
                        <van-icon name="arrow" />
                    </p>
                </div>
            </router-link>
            <router-link class="user-info-item" to="/user/editAddress" tag="div">
                <h3 class="item-head">收货地址</h3>
                <div class="item-detail">
                    <van-icon name="arrow" />
                </div>
            </router-link>
            <div class="user-info-head">账号绑定</div>
            <section class="user-info-item" @click="showTip">
                <h3 class="item-head">
                    <img src="@/assets/images/tel_logo.png" />
                    <span>手机</span>
                </h3>
                <div class="item-detail">
                    <van-icon name="arrow" />
                </div>
            </section>
            <div class="user-info-head">账号绑定</div>
            <router-link class="user-info-item" to="/user/forget" tag="div">
                <h3 class="item-head">登录密码</h3>
                <div class="item-detail">
                    <p>
                        修改
                        <van-icon name="arrow" />
                    </p>
                </div>
            </router-link>
            <button class="exit" @click="exitlogin">退出登录</button>
            <van-dialog v-model="show" title="标题" show-cancel-button message="是否确认退出" @confirm="outLogin">
            </van-dialog>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getUserInfo } from "@/api/index";
export default {
    data() {
        return {
            username: null,
            show: false,
            showAlert: false, //显示提示组件
            alertText: null, //提示的内容
            imgBaseUrl: "/api/img/" //图片地址
        };
    },
    created() {
        if (!this.userInfo) {
            this.$router.replace("/login");
        }
        this.initData();
    },
    computed: {
        ...mapState(["userInfo", "avactor"])
    },
    watch: {
        userInfo: function() {
            this.initData();
        }
    },
    methods: {
        ...mapActions(["getUserInfo"]),
        async initData() {
            if (this.userInfo.username) {
                this.username = this.userInfo.username;
            } else {
                this.username = this.userInfo.phoneNumber;
            }
        },
        async uploadAvatar() {
            //上传头像
            if (this.userInfo) {
                let input = this.$refs.userAvactor;
                let data = new FormData();
                data.append("file", input.files[0]);
                try {
                    let response = await fetch(
                        "/api/eus/v1/users/" +
                            this.userInfo.user_id +
                            "/avatar",
                        {
                            method: "POST",
                            credentials: "include",
                            body: data
                        }
                    );
                    let res = await response.json();
                    if (res.status == 1) {
                        this.userInfo.avatar = res.image_path;
                    }
                } catch (error) {
                    this.showAlert = true;
                    this.alertText = "上传失败";
                    throw new Error(error);
                }
            }
        },
        exitlogin() {
            this.show = true;
        },
        outLogin() {
            this.getUserInfo();
            this.$router.go(-1);
        },
    }
};
</script>

<style lang="scss" scoped>
.user-info {
    .user-info-item {
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        padding: 0 10px;
        border-bottom: 1px solid #ccc;
        &.item-first {
            margin-top: 10px;
            height: 80px;
            position: relative;
            border-top: 1px solid #ccc;
            input {
                position: absolute;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
            .head-avactor {
                width: 60px;
                height: 60px;
                vertical-align: middle;
                border-radius: 30px;
            }
        }
        .item-head {
            font-size: 16px;
            font-weight: normal;
            img {
                width: 20px;
                height: 25px;
                vertical-align: middle;
                border-radius: 3px;
                margin-right: 5px;
            }
        }
        .item-detail {
            font-size: 18px;
            color: #999;
            font-weight: 600;
            span {
                margin-left: 10px;
            }
        }
    }
    .user-info-head {
        border-bottom: 1px solid #ccc;
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
    }
    .exit {
        width: 95%;
        height: 40px;
        margin: 30px 10px 0;
        background-color: #ee0a24;
        color: #fff;
        font-size: 18px;
        border: none;
        border-radius: 5px;
    }
}
</style>