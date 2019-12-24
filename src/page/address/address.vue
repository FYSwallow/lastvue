<template>
    <div class="address">
        <header class="search">
            <div class="search-left">
                <span>{{positionDetail}}</span>
                <van-icon name="play" style="transform: rotate(90deg)" class="icon" />
            </div>
            <div class="search-right">
                <van-search
                    v-model="value"
                    placeholder="请输入地址"
                    shape="round"
                    show-action
                    @search="onSearch"
                >
                    <div slot="action" @click="onSearch">搜索</div>
                </van-search>
            </div>
        </header>
        <section class="main-container" v-show="!searchShow">
            <div class="current-position">
                <div class="current-position-title title">
                    <span>当前地址</span>
                </div>
                <div class="current-position-detail">
                    <div class="detail-left">
                        <span>万和小区</span>
                    </div>
                    <div class="detail-right">
                        <van-icon
                            name="aim"
                            style="transform: translate(-2px, 2px); color: #01a3f8"
                        />
                        <span>重新定位</span>
                    </div>
                </div>
            </div>
            <div class="get-product-address">
                <div class="title">收货地址</div>
                <ul class="address-group">
                    <li class="address-list">
                        <div class="list-top">
                            <span class="name">付月</span>
                            <span class="gender">先生</span>
                            <span class="telphone">15226511191</span>
                        </div>
                        <div class="list-bottom">
                            <span class="address-detail">万和小区</span>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
        <section class="search-container" v-show="searchShow">
            <ul class="search-address">
                <li
                    class="address-list"
                    v-for="(item, index) in searchCityList"
                    :key="index"
                    @click="choosePosition(item)"
                >
                    <div class="list-left">
                        <h3 class="title">{{item.name}}</h3>
                        <p class="detail">{{item.address}}</p>
                    </div>
                    <div class="list-right">
                        <span class="distance">{{item.distance}}</span>
                    </div>
                </li>
            </ul>
            <div class="no-address">
                <h3 class="title">找不到地址？</h3>
                <p class="promt">请尝试只输入小区、写字楼或学校名</p>
                <p class="promt">详细地址（如门牌号）可稍后输入</p>
            </div>
        </section>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { currentCity, searchplace } from "@/api/index";
export default {
    data() {
        return {
            searchShow: false, //显示搜索的结果
            value: "",
            cityid: "",
            positionDetail: "", //搜索栏城市信息
            searchCityList: [], //搜索地区列表
            latitude: "",
            longitude: "",
            selectPosition: null //选择的城市
        };
    },
    computed: {
        ...mapState(["cityInfo"])
    },
    mounted() {
        this.initData();
    },
    methods: {
        ...mapActions(["getCityInfo"]),
        //数据初始化
        initData() {
            const cityInfo = this.cityInfo;
            this.cityid = cityInfo.id;
            this.positionDetail = cityInfo.name;
            this.latitude = cityInfo.latitude;
            this.longitude = cityInfo.longitude;
        },
        // 根据输入的内容获取具体地址
        async onSearch() {
            const inputValue = this.value.trim();
            if (inputValue) {
                const response = await searchplace(this.cityid, inputValue);
                this.searchCityList = response.data;
                this.searchCityList.forEach(item => {
                    this.getDistance(item);
                });
            }
        },
        // 根据经纬度获取两点之间的距离
        getDistance(item) {
            const { latitude, longitude } = item;
            const latitude1 = (this.latitude * Math.PI) / 180.0;
            const latitude2 = (latitude * Math.PI) / 180.0;
            const longitude1 = (this.longitude * Math.PI) / 180.0;
            const longitude2 = (longitude * Math.PI) / 180.0;

            let s =
                2 *
                Math.asin(
                    Math.sqrt(
                        Math.pow(Math.sin((latitude1 - latitude2) / 2), 2) +
                            Math.cos(latitude1) *
                                Math.cos(latitude2) *
                                Math.pow(
                                    Math.sin((longitude1 - longitude2) / 2),
                                    2
                                )
                    )
                );
            s = s * 6378.137;
            s = Math.round(s * 10000) / 10000;
            let distance;
            // 当距离大于1km时使用km单位,否则使用m
            if (s > 1) {
                const paramStr = s.toString();
                const pointIndex = paramStr.indexOf(".");
                distance = paramStr.slice(0, pointIndex + 2);

                item.distance = distance + "km";
            } else {
                const paramStr = s * 1000;
                item.distance = paramStr + "m";
            }

            this.searchShow = true
        },
        //选择城市
        choosePosition(city) {
            this.positionDetail = city.name;
            this.getCityInfo(city);
            this.$router.push("/home");
        }
    }
};
</script>

<style lang="scss" scoped>
.address {
    width: 100%;
    height: 100%;
    .search {
        display: flex;
        padding: 0 10px;
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
    .main-container {
        .title {
            height: 40px;
            padding-left: 10px;
            font-size: 14px;
            line-height: 40px;
        }
        .current-position {
            .current-position-detail {
                display: flex;
                justify-content: space-between;
                height: 40px;
                padding: 0 10px;
                line-height: 40px;
                background-color: #fff;
                .detail-left {
                }
            }
        }
        .get-product-address {
            .address-group {
                .address-list {
                    padding: 5px 10px;
                    background-color: #fff;
                    border-bottom: 1px solid #ccc;
                    &:last-child {
                        border-bottom: 0;
                    }
                    .list-top {
                        .name {
                            font-weight: 600;
                        }
                        .gender {
                            font-size: 12px;
                            margin: 5px;
                        }
                        .telphone {
                            font-size: 12px;
                        }
                    }
                    .list-bottom {
                        font-size: 12px;
                    }
                }
            }
        }
    }
    .search-container {
        background-color: #fff;
        .address-list {
            display: flex;
            padding: 10px;
            border-bottom: 1px solid #ccc;
            &:last-child {
                border-bottom: 0;
            }
            .list-left {
                width: 90%;
                .title {
                    font-weight: 600;
                }
                .detail {
                    font-size: 14px;
                }
            }
        }
        .no-address {
            padding: 10px;
            text-align: center;
            font-size: 12px;
            font-weight: 200;
            .title {
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                font-weight: 200;
            }
        }
    }
}
</style>