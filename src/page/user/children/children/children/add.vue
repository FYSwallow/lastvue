<template>
    <div>
        <Header headTitle="新增地址" go-back='true'></Header>
        <section>
            <div class="address_detail">
                <input type="text" class="input_style" placeholder="请填写你的姓名" v-model="name">
                <input type="text" class="input_style" placeholder="小区/写字楼/学校等" v-model="addAddress" @click="goAddressDetail">
                <input type="text" class="input_style" placeholder="请填写详细送餐地址" v-model="mesthree">
                <input type="text" class="input_style" placeholder="请填写能够联系到你的手机号" v-model="telenum">
                <input type="text" class="input_style" placeholder="备用联系电话" v-model="standbytelenum">
            </div>
        </section>
        <button @click="submitThing">新增地址</button>
        <AlertTip :alertText="alertText" @closeTip="closeTip" v-if="showAlert"></AlertTip>
    </div>
</template>

<script>
import Header from '@/common/header/header'
import AlertTip from '@/common/alertTip/alertTip'
import {mapMutations, mapState} from 'vuex'

export default {
    data() {
        return {
            name: '',
            mesthree: '',
            telenum: '',
            standbytelenum: '',
            showAlert: false, //弹出框
            alertText: null, //弹出信息
        }
    },
    computed: {
        ...mapState(
            ['addAddress']
        )
    },
    methods: {
        ...mapMutations(
            ['ADD_ADDRESS']
        ),
        // 修改地址
        submitThing(){
            //填写收件人
            if(!this.name){
                this.alertText = '收件人'
                this.showAlert = true
                return 
            }
            //输入送餐地址
            if(this.mesthree.length == 0){
                this.alertText = '详细送餐地址'
                this.showAlert = true
                return 
            }else if(this.mesthree.length > 0 && this.mesthree.length <= 2){
                this.alertText = '送餐地址,地址太短了，不能辨识'
                this.showAlert = true
                return
            }
            //输入手机号
            if(!(/^[1][358][0-9]{9}$/).test(this.telenum)){
                this.alertText="正确的手机号"
                this.showAlert = true
                return
            }else if(this.telenum == ''){
                this.alertText="手机号,手机号不能为空"
                this.showAlert = true
                return
            }
            //输入备份手机号
            if(this.standbytelenum){
                if(!(/^[1][358][0-9]{9}$/).test(this.standbytelenum)){
                    this.alertText="正确的备份手机号"
                    this.showAlert = true
                    return
                }
            } 
            this.submitAddress()
        },
        submitAddress(){
            this.ADD_ADDRESS({
                name: this.name,
                address: this.addAddress,
                address_detail: this.mesthree,
                phone: this.telenum,
                phone_bk: this.standbytelenum, 
            })
            this.$router.go(-1)
        },
        goAddressDetail(){
            this.$router.push('/user/info/address/add/addDetail')
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
section {
    padding-top: 45px;
    .address_detail {
        margin-top: 10px;
        padding: 10px 15px;
        display: flex;
        flex-direction: column;
        background-color: #fff;
        .input_style {
            height: 40px;
            margin-bottom: 10px;
            padding-left: 10px;
            background-color: #F2F2F2;
            border: 1px solid #ccc;
            border-radius: 3px;
        }
    }
    
} 
button {
    width: 94%;
    height: 40px;
    background-color:  #4CD964;
    border: none;
    border-radius: 3px;
    margin-top: 10px;
    margin-left: 3%;
    font-size: 16px;
    color: #eee;
} 
</style>

