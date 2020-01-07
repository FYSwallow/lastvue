<template>
    <div>
        <Header headTitle="编辑地址" go-back='true'>
            <span slot="edit" @click="editThing">{{editText}}</span>
        </Header>
        <section class="address">
            <ul class="address_list" v-if='removeAddress'>
                <li class="list_item " :class="{'heightLight': deletesite && index === select}" v-for="(item, index) in removeAddress" :key="index" @click="choose(index)">
                    <h3>{{item.name}}</h3>
                    <p>{{item.address}}</p>
                    <span v-if='deletesite' @click="deleteSelect(index)">x</span>
                </li>
            </ul>
            <div class="add_address" @click="goAddress">
                <h3>新增地址</h3>
                <span class="fa fa-angle-right"></span>
            </div>
        </section>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import Header from '@/common/header/header';

export default {
    data() {
        return {
            addressList: [], //地址列表
            editText:'编辑',
            deletesite:false, //是否编辑状态
            select: 0
        }
    },
    created() {
        
    },
    computed: {
        ...mapState(
            ['removeAddress']
        )
    },
    methods: {
        ...mapMutations(
            ['DELECT_ADDRESS']
        ),
        editThing(){
            if(this.editText == '编辑'){
                this.editText='完成';
                this.deletesite=true;
            }else{
                this.editText='编辑';
                this.deletesite=false;
            }
        },
        goAddress() {
            this.$router.push('/user/info/address/add')
        },
        choose(index){
            this.select = index
        },
        deleteSelect(index){
            console.log(1)
            this.DELECT_ADDRESS(index)
        }
    },
    components: {
        Header
    }
}
</script>

<style lang="scss" scoped>
.address {
    padding-top: 45px;
    .address_list {
        margin: 10px 0;
        background-color: #fff;
        border-top: 1px solid #ccc;
        .list_item {
            border-bottom: 1px solid #ccc;
            position: relative;
            &.heightLight {
            background-color: #FFF8C3;
            }
            h3 {
                font-size: 14px;
                font-weight: normal;
            }
            p {
                color: #999;
            }
            span {
                position: absolute;
                right: 10px;
                bottom: 15px;
                color: #aaa;
            }
        }
        
    }
    .add_address {
        display: flex;
        justify-content: space-between;
        background-color: #fff;
        padding: 10px;
        margin-top: 10px;
        h3 {
            font-weight: normal;
        }
        span {
            font-weight: 700;
            color: #999;
        }
    }
}   
</style>