<template>
    <div>
        <Header headTitle="账户信息" goBack = 'true'></Header>
        <div class="user_info">
            <div class="user_info_item item_first">
                <input type="file" ref="user_avactor" @change="uploadAvatar">
                <h3 class="item_head">头像</h3>
                <div class="item_detail">
                    <p><img :src="avactor" class="head_avactor"><span class="fa fa-angle-right"></span></p>    
                </div>
            </div>
            <router-link  class="user_info_item" to="/user/info/setusername" tag="div">
                <h3 class="item_head">用户名</h3>
                <div class="item_detail">
                    <p>{{username}}<span class="fa fa-angle-right"></span></p>        
                </div>
            </router-link>
            <router-link  class="user_info_item" to="/user/info/address" tag="div">
                <h3 class="item_head">收货地址</h3>
                <div class="item_detail">
                    <span class="fa fa-angle-right"></span>
                </div>
            </router-link>
            <div class="user_info_head">
                账号绑定
            </div>
            <section  class="user_info_item" @click="showTip">
                <h3 class="item_head">
                    <img src="@/assets/images/tel_logo.png">
                    <span>手机</span>
                </h3>
                <div class="item_detail">
                    <span class="fa fa-angle-right"></span>
                </div>
            </section>
            <div class="user_info_head">
                账号绑定
            </div>
            <router-link  class="user_info_item" to="/forget" tag="div">
                <h3 class="item_head">登录密码</h3>
                <div class="item_detail">
                    <p>修改<span class="fa fa-angle-right"></span></p>
                </div>
            </router-link>
            <button class="exit" @click="exitlogin">退出登录</button>
            <div class="back_over" v-show="show"></div>
            <div class="choose_exit" v-show="show">
                <img src="images/avactor.jpg" alt="" class="exit_logo">
                <h3 class="exit_title">是否退出登录</h3>
                <div class="choose">
                    <button class="exit_wait" @click="waitingThing">再等等</button>
                    <button class="exit_login" @click="outLogin">退出登录</button>
                </div>
            </div>
        </div>
        <AlertTip :alertText="alertText" @closeTip="closeTip" v-if="showAlert"></AlertTip>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import Header from '@/common/header/header'
import AlertTip from '@/common/alertTip/alertTip'
export default {
    data() {
        return {
            username: null,
            show: false,
            showAlert: false, //显示提示组件
            alertText: null, //提示的内容
        }
    },
    created() {
        if(!this.userInfo){
            this.$router.replace('/login')
        }
        this.initData()
    },
    computed: {
        ...mapState(
            ['userInfo', 'avactor']
        )
    },
    methods: {
        ...mapMutations(
            ['OUT_LOGIN']
        ),
        initData() {
            if(this.userInfo.username){
                this.username = this.userInfo.username
            }else {
                this.username = this.userInfo.phoneNumber
            }   
        },
        uploadAvatar() {
            let input = this.$refs.user_avactor
            // let data = new FormData()
            // data.append('file', input.files[0])
            // try{
                
            // }catch {

            // }
            // 通过提交data数据,返回服务器的数据，再将服务器传递过来的图片赋值给avactor
        },
        exitlogin() {
            this.show=true
        },
        waitingThing(){
            this.show=false
        },
        outLogin() {
            this.OUT_LOGIN()
            this.$router.go(-1)
        },
        showTip(){
            this.showAlert = true;
            this.alertText = '请在手机APP中设置';
        },
        closeTip(){
            this.showAlert = false
        }
    },
    components: {
        Header,
        AlertTip
    }
}
</script>

<style lang="scss" scoped>
.user_info {
    padding-top: 45px;
    .user_info_item {
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        padding: 0 10px; 
        border-bottom : 1px solid #ccc;
        &.item_first{
            margin-top: 10px;
            height: 80px;
            position: relative;
            border-top : 1px solid #ccc;
            input {
                position: absolute;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
            .head_avactor {
                width: 60px;
                height: 60px;
                vertical-align: middle ;
                border-radius: 30px;
            }
        }
        .item_head {
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
        .item_detail {
            font-size: 18px;
            color: #999;
            font-weight: 600;
            span {
                margin-left: 10px;
            }
            
        }
    }
    .user_info_head {
        border-bottom : 1px solid #ccc;
        height: 40px; 
        line-height: 40px;  
        padding-left: 10px;
    }
    .exit {
        width: 95%;
        height: 40px;
        margin: 30px 10px 0;
        background-color: #D8584A;
        color: #fff;
        font-size: 18px;
        border: none;
        border-radius: 5px;
    }
    .back_over {
       width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        // z-index: 10;
        background-color: rgba(0, 0, 0, 0.3);
    }
    .choose_exit {
        width: 94%;
        background-color: #fff;
        padding: 17px;
        position: absolute;
        top: 20%;
        left: 3%;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .exit_logo {
            width: 100px;
            height: 100px;
            margin: 10px;
        }
        .exit_title {
            font-size: 30px;
            margin: 10px;
            font-weight: normal;
            color: #333;
        }
        .choose {
            width: 100%;
            text-align: center;
            button {
                width: 30%;
                height: 40px;
                margin: 10px;
                border: none;
                border-radius: 5px;
                font-size: 18px;
                color: #fff;
            }
            .exit_wait {
                background-color: #999;
            }
            .exit_login {
                background-color: #D8584A;
            }
        }
    }
}   
</style>