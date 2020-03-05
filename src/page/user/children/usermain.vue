<template>
  <div class="usermain">
    <router-link class="user-detail" :to="userInfo? '/user/info': '/login'">
      <img :src="imgBaseUrl+avatar" class="user-avactor" v-if="userInfo" />
      <img src="@/assets/images/default.jpg" class="user-avactor" v-else />
      <section class="user-info">
        <div class="user-login ellipsis">
          <span>{{username}}</span>
        </div>
        <div class="user-tel">
          <img src="@/assets/images/tel_logo.png" class="tel-logo" />
          <span>{{mobile}}</span>
        </div>
      </section>
      <span class="user-link fa fa-angle-right"></span>
    </router-link>
    <div class="user-data">
      <ul>
        <li>
          <span class="num">
            <i class="num-banlance">{{parseInt(balance).toFixed(2)}}</i>元
          </span>
          <span class="description">我的余额</span>
        </li>
        <li>
          <span class="num">
            <i class="num-offer">{{count}}</i>个
          </span>
          <span class="description">我的优惠</span>
        </li>
        <li>
          <span class="num">
            <i class="num-score">{{pointNumber}}</i>分
          </span>
          <span class="description">我的积分</span>
        </li>
      </ul>
    </div>
    <section class="user-profile">
      <ul>
        <li @click="goOrder">
          <span>
            <van-icon name="orders-o" class="icon-middle" />我的订单
          </span>
          <van-icon name="arrow" class="icon-left" />
        </li>
        <li>
          <span>
            <van-icon name="idcard" class="icon-middle" />饿了吗会员卡
          </span>
          <van-icon name="arrow" class="icon-left" />
        </li>
      </ul>
    </section>
    <section class="user-profile">
      <ul>
        <li>
          <span>
            <van-icon name="phone-circle-o" class="icon-middle" />服务中心
          </span>
          <van-icon name="arrow" class="icon-left" />
        </li>
        <li>
          <span>
            <van-icon name="down" class="icon-middle" />下载饿了么APP
          </span>
          <van-icon name="arrow" class="icon-left" />
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { Dialog } from "vant";
import { mapState, mapActions } from "vuex";
import { reqUserInfo } from "@/api/index";
export default {
  data() {
    return {
      profiletitle: "我的",
      username: "登录/注册", //用户名
      resetname: "",
      mobile: "暂无绑定手机号", //电话号码
      balance: 0, //我的余额
      count: 0, //优惠券个数
      pointNumber: 0, //积分数
      avatar: "", //头像地址
      imgBaseUrl: "/api/img/" //图片地址
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
    }
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    async initData() {
      console.log(this.userInfo);
      if (this.userInfo && this.userInfo.user_id) {
        this.avatar = this.userInfo.avatar;
        console.log(this.avatar);
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

    //去我的订单页面
    goOrder() {
      console.log(this.userInfo);
      if (!this.userInfo) {
        Dialog.alert({
          message: "抱歉,你还未登陆!"
        }).then(() => {
          // on close
        });
      } else {
        this.$router.push("/order");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.usermain {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .user-detail {
    display: flex;
    background-color: #01a3f8;
    padding: 10px;
    .user-avactor {
      width: 80px;
      height: 80px;
      border-radius: 40px;
    }
    .user-info {
      flex: 1;
      color: #fff;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .user-login {
        width: 50%;
        font-size: 20px;
        font-weight: 600;
      }
      .user-tel {
        .tel-logo {
          width: 20px;
          vertical-align: middle;
        }
      }
    }
    .user-link {
      line-height: 80px;
      font-size: 18px;
      font-weight: 600;
      color: #eee;
    }
  }
  .user-data {
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
            &.num-offer {
              color: #ff5f3e;
            }
            &.num-score {
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
  .user-profile {
    margin-top: 10px;
    background-color: #fff;
    ul {
      li {
        padding: 10px;
        border-bottom: 1px solid #eee;
        display: flex;
        span {
          .icon-middle {
            padding-right: 5px;
            vertical-align: middle;
            font-size: 20px;
          }
        }
        .icon-left {
          flex: 1;
          text-align: right;
          vertical-align: middle;
          font-size: 20px;
          color: #666;
        }
      }
    }
  }
}
</style>