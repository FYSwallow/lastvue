<template>
  <div>
    <div class="setName">
      <input
        type="text"
        placeholder="输入用户名"
        :class="{'warn_border': bordercolor}"
        @input="inputThing"
        v-model="inputValue"
      />
      <p v-if="warn" :class="{'warn_text': warn}">用户名长度在5到24位之间</p>
      <button @click="resetName">确认修改</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { setUserName } from "@/api/index";
import { Notify } from 'vant';

export default {
  data() {
    return {
      inputValue: "", //新的用户名
      warn: false, //输入框提醒
      bordercolor: false //输入框边框颜色
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    inputThing() {
      if (this.inputValue.length < 2 || this.inputValue.length > 24) {
        this.warn = true;
        this.bordercolor = true;
        return false;
      } else {
        this.warn = false;
        this.bordercolor = false;
        return true;
      }
    },

    // 修改用户名
    async resetName() {
      let flag = this.inputThing();
      if (!flag) {
        return;
      }
      console.log(this.userInfo)
      const result = await setUserName(this.inputValue, this.userInfo.user_id);
      if (result.data.status === 1) {
        Notify({ type: 'success', message: '更新成功' });
        this.getUserInfo(result.data.data);
        this.$router.go(-1);
      } else {
          Notify({ type: 'danger', message: '更新失败' });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.setName {
  input {
    height: 50px;
    width: 95%;
    margin: 10px;
    background-color: #eee;
    border: 1px solid #ccc;
    padding-left: 10px;
    font-size: 18px;
  }
  .warn_border {
    border: 1px solid red;
  }
  .warn_text {
    color: red;
  }
  p {
    padding-left: 10px;
    color: #666;
  }
  button {
    width: 94%;
    height: 40px;
    margin-left: 3%;
    margin-top: 10px;
    background-color: #3190e8;
    border: none;
    color: #eee;
    font-size: 16px;
  }
}
</style>