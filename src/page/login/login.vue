<template>
  <div class="login">
    <header class="header">
      <div class="header-left" @click="goback">
        <van-icon name="arrow-left" />
        <span>返回</span>
      </div>
      <div class="header-middle">用户登陆</div>
    </header>
    <van-cell-group class="login-form">
      <!-- 输入用户名 -->
      <van-field
        v-model="username"
        required
        clearable
        label="用户名"
        label-width="60"
        placeholder="请输入用户名"
      />
      <!-- 输入密码 -->
      <van-field
        v-model="password"
        :type="showPassword ? 'text': 'password'"
        label="密码"
        label-width="60"
        placeholder="请输入密码"
        required
      >
        <div class="button-switch" slot="button" :class="{'show-password': showPassword}">
          <span class="text" :class="[showPassword? 'text-on': 'text-off']">abc...</span>
          <span
            class="show"
            :class="[showPassword? 'show-on': 'show-off']"
            @click="changePassWordType"
          ></span>
        </div>
      </van-field>
      <van-field v-model="sms" required clearable label="验证码" label-width="60" placeholder="请输入验证码">
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
    <p class="login-tips">温馨提示: 为注册过的账号, 登录时将自动注册</p>
    <p class="login-tips">注册过的用户可凭账号密码登陆</p>
    <button class="login-button" @click="captchaCodeLogin">登录</button>
    <router-link to="/user/forget" class="to-forget">重置密码?</router-link>
    <van-dialog v-model="showAlert" title="提示" show-cancel-button :message="alertText"></van-dialog>
  </div>
</template>

<script>
import { Notify } from "vant";
import { mapActions } from "vuex";
import { getcaptchas, accountLogin } from "@/api/index";

export default {
  data() {
    return {
      message: "", //提示信息
      username: null, //账号
      password: null, //密码
      showPassword: false, //是否显示密码
      sms: null, //验证码
      captchaCodeImg: null, //验证码地址
      showAlert: false, //显示提示组件
      alertText: null, //提示的内容
      userInfo: null //获取到的用户信息
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapActions(["getUserInfo"]),

    //  查看是否存在sid,如果存在,则通过cookies获取用户信息,如果获取失败,删除sid
    initData() {},
    // 获取验证码
    async getCaptchaCode() {
      const result = await getcaptchas();
      this.captchaCodeImg = result.data.code;
    },
    //是否显示密码
    changePassWordType() {
      this.showPassword = !this.showPassword;
    },
    async captchaCodeLogin() {
      if (!this.username) {
        this.showAlert = true;
        this.alertText = "请输入手机号/邮箱/用户名";
        return;
      } else if (!this.password) {
        this.showAlert = true;
        this.alertText = "请输入密码";
        return;
      } else if (!this.sms) {
        this.showAlert = true;
        this.alertText = "请输入验证码";
        return;
      }
      // 用户名登录
      const result = await accountLogin(this.username, this.password, this.sms);
      console.log(result);
      const userInfo = result.data.data;
      if (!userInfo.user_id) {
        Notify({
          type: "danger",
          message: "请检查密码和用户名是否匹配"
        });
        return;
      } else {
        // 将userInfo保存至全局状态管理
        this.getUserInfo(userInfo);
        Notify({
          type: "success",
          message: "登陆成功",
          duration: 1000
        });
        setTimeout(() => {
          // 跳转路由
          this.$router.go(-1);
        }, 1000);
      }
    },
    goback() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  .header {
    position: relative;
    height: 50px;
    color: #fff;
    line-height: 50px;
    background-color: #01a3f8;
    .header-left {
      height: 100%;
    }
    .header-middle {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .login-form {
    .button-switch {
      position: relative;
      margin: 0 10px;
      line-height: 24px;
      .text {
        font-size: 14px;
        line-height: 14px;
        color: #fff;
        border-radius: 7px;
      }
      .text-on {
        background-color: #4cd964;
      }
      .text-off {
        background-color: #ddd;
      }
      .show {
        position: absolute;
        left: 0;
        width: 24px;
        height: 24px;
        border-radius: 17px;
        background-color: #eee;
        transition: all 0.2s linear;
      }
      .show-off {
        transform: translateX(20px);
      }
      .show-on {
        transform: translateX(-8px);
      }
    }
    .captchacode {
      height: 30px;
      .captchacode-img {
        width: 100%;
      }
    }
  }
  .login-tips {
    color: red;
    padding: 10px;
    font-size: 14px;
  }
  .login-button {
    width: 90%;
    height: 45px;
    margin: 5px 20px;
    font-size: 25px;
    color: #fff;
    border: none;
    border-radius: 5px;
    background-color: #4cd964;
  }

  .to-forget {
    float: right;
    color: #3b95e9;
    margin-right: 20px;
  }
}
</style>