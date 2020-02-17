<template>
    <div class="home" ref="home" id="home" @scroll="handleScroll">
        <div v-show="!cityInfo">
            <van-dialog
                v-model="show"
                title="标题"
                show-cancel-button
                cancel-button-text="不允许"
                confirm-button-text="好"
                message="'饿了么'想获取您的当前位置"
                @confirm="getCity"
            ></van-dialog>
        </div>
        <header class="position-nav" :style="{position: positionStatus}">
            <div
                class="position-top ellipsis"
                v-show="showStatus"
                ref="positionTop"
                @click="goCity"
            >
                <van-icon name="location" class="icon" />
                <span>{{positionText}}</span>
                <van-icon name="play" style="transform: rotate(90deg)" class="icon" />
            </div>
            <div class="position-bottom">
                <van-icon name="search" style="transform: translateY(2px)" />
                <router-link to="/search" tag="span" >搜索商家、商品名称</router-link>
            </div>
        </header>
        <section class="slider-container">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                style="position:absolute;width:0;height:0"
            >
                <defs>
                    <symbol id="list-item">
                        <circle
                            cx="50%"
                            cy="30%"
                            r="20%"
                            stroke="#eee"
                            stroke-width="1"
                            fill="#ddd"
                        />
                        <rect
                            width="40%"
                            height="30%"
                            style="fill:#ddd;stroke-width:1; stroke:#eee;transform:translate(30%, 65%)"
                        />
                    </symbol>
                </defs>
            </svg>
            <div class="slider preview" v-if="!foodTypes.length">
                <ul class="clear">
                    <li class="list-style" v-for="item in 8" :key="item">
                        <svg class="list-item">
                            <use xlink:href="#list-item" />
                        </svg>
                    </li>
                </ul>
            </div>
            <div class="slider" v-else>
                <van-swipe :autoplay="3000" indicator-color="#01a3f8" v-if="foodTypes.length">
                    <van-swipe-item v-for="(item, index) in foodTypes" :key="index">
                        <ul class="clear">
                            <li class="list-style" v-for="value in item" :key="value.id">
                                <router-link
                                    :to="{path: '/food', query: {geohash, title: value.title, restaurant_category_id: getCategoryId(value.link)}}"
                                >
                                    <img :src="imgBaseUrl + value.image_url" />
                                    <span>{{value.title}}</span>
                                </router-link>
                            </li>
                        </ul>
                    </van-swipe-item>
                </van-swipe>
            </div>
        </section>
        <section
            class="food"
            :class="[typeFlag?'food-fixed':'food-absolute']"
            v-if="foodTypes.length"
            ref="food"
        >
            <v-food @changeStyle="changeStyle">
                <h3 slot="shopTitle" class="shop-title">—— 推荐商家 ——</h3>
            </v-food>
        </section>
        <v-shoplist v-if="cityInfo" class="shoplist" :loadMoreFlag="loadMoreFlag" />
        <v-footer />
        <van-overlay :show="showCover" @click="closeCover" />
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import vFood from "@/components/food/food";
import vShoplist from "@/components/shoplist/shoplist";
import vFooter from "@/components/footer/footer";
import {
    reqCurrentPosition,
    reqDetailPosition,
    reqHotCity,
    msiteFoodTypes
} from "@/api/index";
export default {
    components: {
        vFood,
        vShoplist,
        vFooter
    },
    data() {
        return {
            positionStatus: "absolute", //定位fixed或者relatives
            showStatus: true, //是否定位元素显示高度
            show: true,
            positionText: "正在定位...",
            imgBaseUrl: "https://fuss10.elemecdn.com", //图片域名地址
            foodTypes: [], //食品分类列表
            geohash: "", // 地址geohash
            loading: true, //默认不显示
            foodPosition: "relative",
            categoryNavheight: 0, //分类导航栏的位置
            topNavheight: "", //头部定位标签的高度
            typeFlag: false, //根据类名判断分类标签的样式
            showCover: false, //显示遮挡层
            shopListHeight: "", // 食品列表的高度
            loadMoreFlag: 0 //加载更多商品标志
        };
    },
    computed: {
        ...mapState(["cityInfo", "foodInfo"])
    },
    watch: {
        foodInfo: function(newval) {
            // 判断遮挡层是否显示,当分类存在状态时才显示,否则不显示
            const { sortBy } = newval;
            if (sortBy) {
                this.showCover = true;
            } else {
                this.showCover = false;
            }
        }
    },
    mounted() {
        this.initData();
    },
    methods: {
        ...mapActions(["getCityInfo", "getFoodInfo"]),
        initData() {
            if (this.cityInfo) {
                this.positionText = this.cityInfo.address;
                this.geohash =
                    this.cityInfo.latitude + "," + this.cityInfo.longitude;
                this.getFoodTypesArr(this.geohash);
            }
        },
        //滚动触发事件
        handleScroll() {
            // 获取定位元素的高度
            if (!this.topNavheight) {
                this.topNavheight = this.$refs.positionTop.offsetHeight;
            }
            //获取页面滚动出去的高度
            const scrollTop = this.$refs.home.scrollTop;
            const scrollHeight = this.$refs.home.scrollHeight;
            if (scrollTop > this.topNavheight) {
                this.positionStatus = "fixed";
                this.showStatus = false;
            } else {
                this.positionStatus = "absolute";
                this.showStatus = true;
            }

            // 保存页面初始状态信息
            if (this.categoryNavheight == 0) {
                this.categoryNavheight = this.$refs.food.offsetTop;
            }
            // 改变食品分类所在的位置
            if (scrollTop > this.categoryNavheight) {
                this.typeFlag = true;
            } else {
                this.typeFlag = false;
            }
            // 当页面滚动至页面最底部时加载更多
            if (document.body.clientHeight + scrollTop >= scrollHeight) {
                this.loadMoreFlag++;
            }
        },
        //获取当前城市地址
        async getCity() {
            this.positionText = "正在获取位置...";
            const result = await reqDetailPosition();
            if (!result.address) {
                this.positionText = "定位不准,请重新获取";
                return;
            } else {
                this.positionText = result.address;
            }

            this.geohash = result.latitude + "," + result.longitude;
            //获取食品分类列表

            this.getFoodTypesArr(this.geohash);

            // 保存到vuex中
            this.getCityInfo(result);
        },
        //获取食品分类列表
        async getFoodTypesArr(geohash) {
            const result = await msiteFoodTypes(geohash);

            let resLength = result.length;
            let resArr = [...result]; // 返回一个新的数组
            let foodArr = [];
            for (let i = 0, j = 0; i < resLength; i += 8, j++) {
                foodArr[j] = resArr.splice(0, 8);
            }
            this.foodTypes = foodArr;
        },
        //点击排序按钮时对商品列表进行排序,筛选
        changeStyle() {
            // 保存页面初始状态信息
            if (this.categoryNavheight == 0) {
                this.categoryNavheight = this.$refs.food.offsetTop;
            }
            //当食品列表大于窗口可视区域高度时, food元素节点位置样式发生改变,变为绝对定位
            //分类样式改变
            this.typeFlag = true;
            // 页面滚动到分类位置,当两者完全相等时,会导致布局变为相对定位,故而加一
            this.$refs.home.scrollTop = this.categoryNavheight + 1;
        },
        // 判断是否需要变化位置
        getShoplistHeight(height) {
            this.shopListHeight = height;
        },
        // 当点击遮挡层时,关闭食品下拉列表
        closeCover() {
            this.showCover = false;
            this.getFoodInfo();
        },
        goCity() {
            this.$router.push("/address");
        },
        // 解码url地址，求去restaurant_category_id值
        getCategoryId(url) {
            let urlData = decodeURIComponent(
                url.split("=")[1].replace("&target_name", "")
            );
            if (/restaurant_category_id/gi.test(urlData)) {
                return JSON.parse(urlData).restaurant_category_id.id;
            } else {
                return "";
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.home {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: absolute;
    .position-nav {
        width: 100%;
        padding: 5px 10px;
        background-color: #01a3f8;
        z-index: 10;
        .position-top {
            height: 30px;
            max-width: 50%;
            line-height: 30px;
            color: #fff;
            span {
                margin: 0 5px;
            }
            .icon {
                font-size: 14px;
            }
        }
        .position-bottom {
            height: 30px;
            margin: 5px 10px;
            font-size: 14px;
            line-height: 30px;
            text-align: center;
            color: #aaa;
            background-color: #fff;
        }
    }
    .slider-container {
        margin-top: 85px;
        .slider {
            width: 100%;
            padding: 5px 0;
            background-color: #fff;
            .list-style {
                float: left;
                width: 25%;
                height: 60px;
                text-align: center;
                .list-item {
                    width: 100%;
                    height: 100%;
                }
                img {
                    display: block;
                    width: 60%;
                    height: 60%;
                    margin: auto;
                }
                span {
                    color: #666;
                    font-size: 12px;
                }
            }
        }
    }

    .food-fixed {
        position: fixed;
        top: 0;
        z-index: 9;
        height: 100px;
        width: 100%;
    }
    .food-absolute {
        position: absolute;
        height: 100px;
        width: 100%;
        z-index: 9;
    }
    .shop-title {
        height: 50px;
        line-height: 50px;
        background-color: #fff;
        text-align: center;
    }
    .shoplist {
        padding-top: 100px;
        padding-bottom: 50px;
    }
    .loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        text-align: center;
        z-index: 20;
        .loading-animate {
            position: absolute;
            top: 50%;
            left: 50%;
        }
    }
}
</style>