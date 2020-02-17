<template>
    <div class="search">
        <section class="search-header">
            <div class="header-left" @click="goBack">
                <van-icon name="arrow-left" class="goback" />
            </div>
            <div class="header-center">
                <span>搜索</span>
            </div>
        </section>
        <section class="search-container">
            <div class="search-input">
                <input type="search" placeholder="请输入商家或美食名称" v-model="inputValue" />
                <span @click="search">提交</span>
            </div>
            <div class="search-history" v-if="showflag && searchHistory.length">
                <header class="history-title">
                    <span>搜索历史</span>
                </header>
                <section class="history-body">
                    <ul class="history-list">
                        <li
                            class="history-item"
                            v-for="(item, index) in searchHistory"
                            :key="index"
                            @click="searchbyhistory(item)"
                        >
                            <span>{{item}}</span>
                            <span @click.stop="deleteHistory(index)">
                                <van-icon name="cross" />
                            </span>
                        </li>
                    </ul>
                    <button class="clear-history" @click="clearAllHistory">清空搜索历史</button>
                </section>
            </div>
            <div class="search-result" v-if="!showflag">
                <header class="result-title">商家</header>
                <section class="result-body">
                    <ul class="result-list">
                        <li
                            class="result-item"
                            v-for="(item, index) in restaurantList"
                            :key="index"
                            @click="goShop(item)"
                        >
                            <div class="item-left">
                                <img src="@/assets/images/meishi.png" alt />
                            </div>
                            <div class="item-right">
                                <p>{{item.name}}</p>
                                <p>月售{{item.recent_order_num}}单</p>
                                <p>{{item.float_minimum_order_amount}}元起送/距离{{item.distance}}公里</p>
                            </div>
                        </li>
                    </ul>
                </section>
            </div>
        </section>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { setStore, getStore } from "@/config/storage.js";
import { searchRestaurant } from "@/api/index";
export default {
    data() {
        return {
            searchHistory: [], // 搜索历史
            inputValue: "", //搜索内容
            restaurantList: [], //搜索的结果
            showflag: true //显示搜索历史或者商家列表,默认显示搜索历史
        };
    },
    computed: {
        ...mapState(["geohash"])
    },
    watch: {
        // 切换显示的效果
        inputValue: function(newval) {
            if (!newval.trim()) {
                this.showflag = true;
            }
        }
    },
    mounted() {
        //获取搜索历史记录
        if (getStore("searchHistory")) {
            this.searchHistory = JSON.parse(getStore("searchHistory"));
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },

        //搜索商店
        async search() {
            if (!this.inputValue.trim()) return;
            this.restaurantList = await searchRestaurant(
                this.geohash,
                this.inputValue
            );
            this.showflag = this.inputValue ? false : true;
            // 判断搜索历史中有无当前搜索内容,如果没有则保存
            let history = getStore("searchHistory");
            if (history) {
                let checkrepeat = false;
                this.searchHistory = JSON.parse(history);
                this.searchHistory.forEach(item => {
                    if (item == this.inputValue) {
                        checkrepeat = true;
                    }
                });
                if (!checkrepeat) {
                    this.searchHistory.push(this.inputValue);
                }
            } else {
                this.searchHistory.push(this.inputValue);
            }
            //将搜索记录保存在本地储存中
            setStore("searchHistory", this.searchHistory);
        },
        searchbyhistory(value) {
            this.inputValue = value;
            this.search();
        },
        //点击删除按钮，删除当前历史记录
        deleteHistory(index) {
            this.searchHistory.splice(index, 1);
            setStore("searchHistory", this.searchHistory);
        },
        //清除所有历史记录
        clearAllHistory() {
            this.searchHistory = [];
            setStore("searchHistory", this.searchHistory);
        },

        // 选择商店
        goShop(item) {
            this.$router.push({path: '/shop', query: {id: item.id}})
        }
    }
};
</script>

<style lang="scss" scoped>
.search {
    .search-header {
        position: relative;
        height: 50px;
        line-height: 50px;
        color: #fff;
        background-color: #01a3f8;
        .header-left {
            vertical-align: middle;
        }
        .header-center {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            font-size: 18px;
        }
    }
    .search-container {
        .search-input {
            padding: 10px;
            background-color: #fff;
            input {
                width: 80%;
                padding: 5px;
                margin-right: 10px;
                border: none;
                border-radius: 3px;
                background-color: #eee;
            }
            span {
                display: inline-block;
                padding: 2px 5px;
                border-radius: 3px;
                color: #fff;
                background-color: #56d176;
            }
        }
        .search-history {
            .history-title {
                height: 40px;
                line-height: 40px;
                padding-left: 10px;
                font-size: 14px;
            }
            .history-body {
                background-color: #fff;
                .history-list {
                    .history-item {
                        display: flex;
                        justify-content: space-between;
                        height: 36px;
                        line-height: 36px;
                        padding: 0 10px;
                        span {
                            display: inline-block;
                            &:last-of-type {
                                color: #01a3f8;
                            }
                        }
                    }
                }
                button {
                    width: 90%;
                    height: 40px;
                    border: none;
                    margin: 10px 5%;
                    color: #fff;
                    border-radius: 5px;
                    background-color: #56d176;
                }
            }
        }
        .search-result {
            .result-title {
                height: 40px;
                line-height: 40px;
                padding-left: 10px;
            }
            .result-body {
                background-color: #fff;
                padding-left: 10px;

                .result-list {
                    .result-item {
                        display: flex;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                        .item-left {
                            img {
                                width: 40px;
                                height: 40px;
                                margin: 5px;
                            }
                        }
                        .item-right {
                            flex: 1;
                            p {
                                font-size: 14px;
                                color: #333;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>