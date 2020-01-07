<template>
    <div>
        <Header headTitle="搜索地址" go-back='true'></Header>
        <div class="input_form">
            <input type="search" placeholder="请输入小区/写字楼/学校等" class="input_search" v-model="inputAdress">
            <input type="submit" value="确认" class="input_submit" @click="inputThing">
        </div>
        <section>
            <div class="advise">为了满足商家的送餐要求,建议您从列表中选择地址</div>
            <div class="question" v-if="warning">
                <p>找不到地址?</p>
                <p>请尝试输入小区、写字楼或学校名</p>
                <p>详细地址(如门牌号)可稍后输入哦</p>
            </div>
            <ul class="address_list" v-else>
                <li class="address_list_item" v-for="(item, index) in addressList" :key="index" @click="listClick(index)">
                    <p>{{item.name}}</p>
                    <p>{{item.address}}</p>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
import Header from '@/common/header/header'
import {searchNearby} from '@/api/index'
import {mapMutations} from 'vuex'
export default {
    data() {
        return {
            warning: true,
            inputAdress: '',
            addressList: [],			//地址列表
        }
    },
    methods: {
        ...mapMutations(
            ['SAVE_ADDDETAIL']
        ),
        async inputThing() {
            const res = await searchNearby(this.inputAdress)
            this.addressList=res.data
            this.warning=true
            if(this.addressList.length > 0){
                this.warning = false
                if(this.inputAdress == ''){
                    this.addressList=[];
                    this.warning=true;
                }
            }
        },
        listClick(index){
            this.SAVE_ADDDETAIL(this.addressList[index].name)
            this.$router.go(-1)
        }
    },
    components: {
        Header
    }
    
}
</script>

<style lang="scss" scoped>
.input_form {
    padding: 65px 20px 20px;
    background-color: #fff;
    display: flex;
    input {
        height: 50px;
        border-radius: 3px;
    }
    .input_search {
        flex: 1;
        background-color: #eee;
        padding: 10px;
        margin-right: 20px;
        border: 1px solid #ccc;
        font-size: 16px;
    }
    .input_submit {
        width: 80px;
        background: #3190e8;
        font-size: 16px;
        color: #fff;
    }
}
section {
    .advise {
        text-align: center;
        height: 30px;
        line-height: 30px;
        background-color: #FFF6E4;
        color: #FF883F;
    }
    .question {
        text-align: center;
        margin-top: 100px;
        font-size: 20px;
        color: #999;
        p {
            margin-bottom: 10px;
        }
    }
    .address_list {
        .address_list_item {
            border-bottom: 1px solid #ccc;
            p {
                font-size: 18px;
                color: #aaa;
                padding: 5px;
            }
        }
    }
}  
</style>