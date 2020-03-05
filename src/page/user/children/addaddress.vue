<template>
    <div class="add-address">
        <div class="form-container">
            <form action>
                <ul>
                    <li>
                        <span class="tag-title">联系人</span>
                        <input type="text" placeholder="姓名" v-model="name" />
                    </li>
                    <li>
                        <span class="tag-title">性别</span>
                        <div class="tag-list">
                            <span
                                v-for="(item, index) in tagAttr[0]"
                                :key="index"
                                :class="{active: sex == index + 1}"
                                @click="chooseSex(index)"
                            >{{item}}</span>
                        </div>
                    </li>
                    <li>
                        <span class="tag-title">电话</span>
                        <input type="text" placeholder="手机号码" v-model="phone" />
                    </li>
                    <li>
                        <span class="tag-title">地址</span>
                        <input type="text" placeholder="选择收货地址" v-model="address" />
                        <div class="choose-address" @click="goGetAddress"></div>
                    </li>
                    <li>
                        <span class="tag-title">门牌号</span>
                        <input type="text" placeholder="例: 5号楼203房间" v-model="address_detail" />
                    </li>
                    <li>
                        <span class="tag-title">标签</span>
                        <div class="tag-list">
                            <span
                                v-for="(item, index) in tagAttr[1]"
                                :key="index"
                                :class="{active: tag_type == index + 3}"
                                @click="chooseTag(item, index)"
                            >{{item}}</span>
                        </div>
                    </li>
                </ul>
                <button
                    type="submit"
                    class="button-add"
                    @click.prevent="saveAddress"
                    v-if="status"
                >保存</button>
                <div class="button-edit" v-else>
                    <button type="submit" class="button-delete" @click.prevent="abandon">放弃</button>
                    <button type="submit" class="button-change" @click.prevent="saveAddress">保存并使用</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { addUserAddress, reqUserAddress, editUserAddress } from "@/api/index";
export default {
    data() {
        return {
            name: "",
            phone: "",
            address: "",
            address_detail: "",
            sex: "",
            tagAttr: [
                ["男", "女"],
                ["家", "学校", "公司"]
            ],
            tag_type: 0,
            tag: "",
            status: true //默认为增加收货地址, 当显示false时为修改收货地址
        };
    },
    // keepalive只是为了缓存增加地址页面和搜索地址详情页面,为了删除缓存,需要在beforeRouterEnter
    // 中,存在bug!! 日后考虑
    // beforeRouteEnter(to, from, next) {
    //     // 判断页面是否需要缓存
    //     console.log(from, to);
    //     if (from.fullPath == "/user/editAddress") {
    //         to.meta.keepAlive = false;
    //     } else if (to.query.address_id) {
    //         console.log(1)
    //         to.meta.keepAlive = false;
    //     } else {
    //         to.meta.keepAlive = true;
    //     }
    //     next();
    // },
    computed: {
        ...mapState(["userInfo", "cityInfo", "addressDetail"])
    },

    watch: {
        addressDetail: function(newval) {
            this.address = newval.address.address;
        }
    },
    created() {
        if (this.$route.query.address_id) {
            this.$route.meta.title = "编辑地址";
        }
    },
    mounted() {
        this.initData();
    },
    methods: {
        ...mapActions(["getFoodAddress"]),
        async initData() {
            const {address_id} = this.$route.query;
            console.log(this.$route.query)
            const { user_id } = this.userInfo;
            // 当路由中存在address_id时,此时为修改用户地址,需要重新获取用户守护地址数据
            if (address_id) {
                this.status = false;
                const result = await reqUserAddress(address_id);
                
                this.name = result.data.name;
                this.phone = result.data.phone;
                this.address = result.data.address;
                this.address_detail = result.data.address_detail;
                this.sex = result.data.sex;
                this.tag_type = result.data.tag_type;
                this.tag = result.data.tag;
            }
        },
        // 获取地址
        goGetAddress() {
            this.$router.push("/user/detailAddress");
        },

        //选择性别
        chooseSex(index) {
            this.sex = index + 1;
        },
        //选择标签
        chooseTag(tag, index) {
            this.tag = tag;
            this.tag_type = index + 3;
        },
        // 保存或者修改地址
        async saveAddress() {
            console.log(this.userInfo)
            const { user_id } = this.userInfo;

            const paramObj = {
                user_id,
                address: this.address,
                address_detail: this.address_detail,
                name: this.name,
                phone: this.phone,
                sex: this.sex,
                tag_type: this.tag_type,
                tag: this.tag
            };
            if (this.status) {
                const { latitude, longitude } = this.addressDetail.address;
                const geohash = latitude + "," + longitude;
                const editAddressObj = Object.assign({}, paramObj, {
                    geohash
                });
                await addUserAddress(editAddressObj, user_id);
                this.$router.push("/user/editAddress");
            } else {
                const { address_id } = this.$route.query;
                const result = await editUserAddress(paramObj, address_id);
            }
        },

        // 放弃操作
        abandon() {
            this.$router.push("/user/editAddress");
        }
    }
};
</script>

<style lang="scss" scoped>
.add-address {
    width: 100%;
    height: 100%;
    .form-container {
        padding: 10px;
        background-color: #fff;
        ul {
            padding: 5px 0;
            li {
                height: 50px;
                padding: 5px;
                border-bottom: 1px solid #ccc;
                line-height: 40px;
                position: relative;
                .tag-title {
                    display: inline-block;
                    width: 20%;
                }
                input {
                    width: 80%;
                    border: none;
                    padding: 0 5px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .tag-list {
                    width: 80%;
                    display: inline-block;
                    span {
                        display: inline-block;
                        width: 50px;
                        height: 30px;
                        margin: 0 10px;
                        line-height: 30px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        text-align: center;
                    }
                    .active {
                        color: #01a3f8;
                        border: 1px solid #01a3f8;
                    }
                }
                .choose-address {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }
        }
        .button-add {
            height: 40px;
            width: 80%;
            margin: 10px 10%;
            border: none;
            border-radius: 5px;
            color: #fff;
            background-color: #01a3f8;
        }
        .button-edit {
            display: flex;
            height: 40px;
            width: 90%;
            margin: 10px 5%;
            button {
                flex: 1;
                height: 100%;
                margin: 0 10px;
                border-radius: 5px;
            }
            .button-delete {
                border: 1px solid #ccc;
                background-color: #fff;
            }
            .button-change {
                color: #fff;
                border: none;
                background-color: #01a3f8;
            }
        }
    }
}
</style>