<template>
    <div class="forget-container">
        <van-cell-group>
            <van-field
                v-model="username"
                label="用户名"
                placeholder="请输入用户名"
                :error-message="errorMsg? (errorMsg.username ? errorMsg.username : ''): '' "
            />
            <van-field
                v-model="oldpassWord"
                label="旧密码"
                placeholder="请输入旧密码"
                :error-message="errorMsg? (errorMsg.oldpassWord ? errorMsg.oldpassWord : ''): '' "
            />
            <van-field
                v-model="newpassword"
                label="新密码"
                placeholder="请输入新密码"
                :error-message="errorMsg? (errorMsg.newpassword ? errorMsg.newpassword : ''): '' "
            />
            <van-field
                v-model="confirmpassword"
                label="确认密码"
                placeholder="请确认密码"
                :error-message="errorMsg? (errorMsg.confirmpassword ? errorMsg.confirmpassword : ''): '' "
            />
            <van-field
                v-model="captcha_code"
                center
                clearable
                label="验证码"
                placeholder="请输入验证码"
                :error-message="errorMsg? (errorMsg.captcha_code ? errorMsg.captcha_code : ''): '' "
            >
                <van-button
                    slot="button"
                    size="small"
                    type="primary"
                    v-if="!captchaCodeImg"
                    @click="getCaptchaCode"
                >获取验证码</van-button>
                <div slot="button" class="captchacode" v-else>
                    <img :src="captchaCodeImg" class="captchacode-img" @click="getCaptchaCode" />
                </div>
            </van-field>
        </van-cell-group>
        <button class="button" @click="resetButton">确认修改</button>
    </div>
</template>

<script>
import { getcaptchas, changePassword } from "@/api/index";
import { Toast } from "vant";
export default {
    data() {
        return {
            username: "",
            oldpassWord: "",
            newpassword: "",
            confirmpassword: "",
            captcha_code: "",
            captchaCodeImg: "", //验证码地址
            errorMsg: null //错误提示列表
        };
    },
    methods: {
        //获取验证吗
        async getCaptchaCode() {
            this.captchaCodeImg = await getcaptchas();
        },
        //重置密码
        async resetButton() {
            // 每次提交,都确保msg提示信息为空
            this.errorMsg = null;
            if (!this.username) {
                this.errorMsg = Object.assign({}, { username: "请输入用户名" });
                return;
            } else if (!this.oldpassWord) {
                this.errorMsg = Object.assign(
                    {},
                    { oldpassWord: "请输入旧密码" }
                );
                return;
            } else if (!this.newpassword) {
                this.errorMsg = Object.assign(
                    {},
                    { newpassword: "请输入新密码" }
                );
                return;
            } else if (!this.confirmpassword) {
                this.errorMsg = Object.assign(
                    {},
                    { confirmpassword: "请确认密码" }
                );
                return;
            } else if (this.newpassword !== this.confirmpassword) {
                Toast.fail("两次输入的密码不一致");
                return;
            } else if (!this.captcha_code) {
                this.errorMsg = Object.assign({}, { captcha_code: "请输入验证码" });
                return;
            }

            // 发送重置信息
            let res = await changePassword({
                username: this.username,
                oldpassWord: this.oldpassWord,
                newpassword: this.newpassword,
                confirmpassword: this.confirmpassword,
                captcha_code: this.captcha_code
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.forget-container {
    .captchacode {
        height: 30px;
        .captchacode-img {
            width: 100%;
        }
    }
    .button {
        width: 80%;
        height: 50px;
        margin: 10px 10%;
        border: none;
        border-radius: 3px;
        color: #fff;
        text-align: center;
        background-color: #07c160;
    }
}
</style>
