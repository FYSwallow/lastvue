<template>
    <div class="search-address">
        <header class="search">
            <div class="search-left">
                <span>{{cityName}}</span>
                <van-icon name="play" style="transform: rotate(90deg)" class="icon" />
            </div>
            <div class="search-right">
                <van-search
                    v-model="address"
                    placeholder="请输入地址"
                    shape="round"
                    show-action
                    @search="onSearch"
                >
                    <div slot="action" @click="onSearch">搜索</div>
                </van-search>
            </div>
        </header>
        <section>
            <div class="point" v-show="warning">
                <p>找不到地址？</p>
                <p>请尝试输入小区、写字楼或学校名</p>
                <p>详细地址（如门牌号）可稍后输入哦。</p>
            </div>
            <div class="address-list" v-if="searchList.length">
                <ul>
                    <li
                        class="address-item"
                        v-for="(item, index) in searchList"
                        :key="index"
                        @click="goAdd(item)"
                    >
                        <h3 class="item-title">{{item.name}}</h3>
                        <p class="item-description">{{item.address}}</p>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { searchplace } from "@/api/index";
import { mapState } from "vuex";
export default {
    data() {
        return {
            address: "",
            warning: true,
            cityName: "定位失败",
            searchList: [] // 搜索地址列表
        };
    },
    computed: {
        ...mapState(["cityInfo"])
    },
    mounted() {
        this.initData();
    },
    methods: {
        ...mapActions(["getFoodAddress"]),
        // 初始化数据
        initData() {
            if (this.cityInfo && this.cityInfo.id) {
                this.cityName = this.cityInfo.name;
            }
        },
        async onSearch() {
            const { id } = this.cityInfo;
            const result = await searchplace(id, this.address);
            // 如果存在搜索相关的地址,隐藏提示内容
            if (result.length) {
                this.warning = false;
                this.searchList = result;
            }
        },
        goAdd(item) {
            this.getFoodAddress({ address: item });
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="scss" scoped>
.search-address {
    .search {
        display: flex;
        background-color: #fff;
        .search-left {
            width: 100px;
            line-height: 54px;
            text-align: center;
            span {
                margin-right: 5px;
            }
        }
        .search-right {
            flex: 1;
        }
    }
    .point {
        margin-top: 20px;
        text-align: center;
        color: #969696;
    }
    .address-list {
        padding: 10px;
        background-color: #fff;
        .address-item {
            padding: 5px;
            border-bottom: 1px solid #ccc;
            .item-title {
                font-weight: 700;
            }
            .item-description {
                color: #969696;
            }
        }
    }
}
</style>