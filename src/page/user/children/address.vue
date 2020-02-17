<template>
    <div class="address">
        <section class="address-container">
            <van-radio-group v-model="radio" class="address-style">
                <van-radio
                    class="address-list"
                    v-for="(item, index) in addressList"
                    :key="index"
                    :name="index"
                    @click.stop="confirmAddress(item, index)"
                >
                    <div class="address-list-left">
                        <p class="address-detail">
                            {{item.address}}
                            <span
                                class="tag"
                                :class="{'tag-type3': item.tag_type == 3, 'tag-type4': item.tag_type == 4,'tag-type5': item.tag_type == 5}"
                            >{{item.tag}}</span>
                        </p>
                        <p class="door-number">{{item.address_detail}}</p>
                        <p class="user-info">
                            <span class="user-name">{{item.name}}</span>
                            <span class="user-phone">{{item.phone}}</span>
                        </p>
                    </div>
                    <div class="address-list-right" @click="goEdit()">
                        <van-icon name="edit" />
                    </div>
                </van-radio>
            </van-radio-group>
        </section>
        <footer class="add-address">
            <span class="add-button" @click="goadd">
                <van-icon name="add-o" class="add-icon" />新增地址
            </span>
        </footer>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { addUserAddress, reqUserAddressList } from "@/api/index";

export default {
    data() {
        return {
            addressList: [], //地址列表
            radio: 0 // 地址列表第一项为收货地址
        };
    },
    created() {
        if (this.$route.query.restaurant_id) {
            this.$route.meta.title = "选择地址";
        }
    },
    mounted() {
        this.initData();
    },
    computed: {
        ...mapState(["userInfo", "chooseAddress"])
    },
    methods: {
        ...mapActions(["selectAddress"]),
        // 数据初始化
        async initData() {
            this.addressList = await reqUserAddressList(this.userInfo.user_id);
            if (this.chooseAddress) {
                const initSelect = this.addressList.findIndex((item, index) => {
                    return item.id == this.chooseAddress.id;
                });
                console.log(initSelect);
                this.radio = initSelect;
            }
        },
        // 添加地址
        goadd() {
            this.$router.push("/user/addAddress");
        },
        // 修改地址
        goEdit(id) {
            this.$router.push({
                path: "/user/addAddress",
                query: { address_id: id }
            });
        },
        // 选择收获地址

        confirmAddress(address, index) {
            this.radio = index;
            this.selectAddress(address);
            if (this.$route.query.restaurant_id) {
                this.$router.push({
                    path: "/confirmOrder",
                    query: { restaurant_id: this.$route.query.restaurant_id }
                });
            } else {
                this.$router.push("/user/info");
            }
        },

        // 删除收货地址
        deleteSelect(index) {
        }
    }
};
</script>

<style lang="scss" scoped>
.address {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .address-container {
        flex: 1;
        width: 100%;
        overflow-y: auto;
        .address-style {
            margin: 10px;
            background-color: #fff;
            .address-list {
                position: relative;
                padding: 5px 20px 0;
                .address-list-left {
                    p {
                        padding: 5px 5px 0;
                    }
                    .address-detail {
                        font-weight: 700;
                        .tag {
                            font-size: 12px;
                            font-weight: 200;
                        }
                        .tag-type3 {
                            color: green;
                        }
                        .tag-type4 {
                            color: red;
                        }
                        .tag-type5 {
                            color: blue;
                        }
                    }
                    .user-info {
                        color: #999;
                        .user-name {
                            padding-right: 10px;
                        }
                    }
                }
                .address-list-right {
                    position: absolute;
                    top: 50%;
                    right: 10px;
                    transform: translateY(-50%);
                }
                .address-edit {
                    position: absolute;
                    top: 20px;
                    right: 0px;
                    width: 130px;
                    div {
                        display: inline-block;
                        width: 60px;
                        height: 40px;
                        line-height: 40px;
                        color: #ccc;
                        text-align: center;
                        font-weight: 700;
                    }
                    .edit-left {
                        background-color: #ee0a24;
                    }
                    .edit-right {
                        background-color: #07c160;
                    }
                }
            }
        }
    }
    .add-address {
        height: 50px;
        width: 100%;
        padding: 10px;
        .add-button {
            display: inline-block;
            height: 30px;
            width: 100%;
            border-radius: 2px;
            line-height: 30px;
            text-align: center;
            font-weight: 700;
            color: #fff;
            background-color: #01a3f8;
            .add-icon {
                padding: 0 10px;
                vertical-align: middle;
            }
        }
    }
}
</style>