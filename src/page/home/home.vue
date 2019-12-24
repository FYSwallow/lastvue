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
            <div class="position-top" v-show="showStatus" ref="positionTop" @click="goCity">
                <van-icon name="location" class="icon" />
                <span>{{ positionText}}</span>
                <van-icon name="play" style="transform: rotate(90deg)" class="icon" />
            </div>
            <div class="position-bottom">
                <van-icon name="search" style="transform: translateY(2px)" />
                <span>搜索商家、商品名称</span>
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
                                <router-link to="/food">
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
            <v-food @changeStyle="changeStyle"></v-food>
        </section>
        <ul>
            <li v-for="item in 40" :key="item">1</li>
        </ul>
        <!-- <div class="loading">
            <van-loading type="spinner" color="#1989fa" class="loading-animate" v-show="loading"/>
        </div>-->
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import vFood from "@/components/food/food";
import { reqCurrentPosition, reqHotCity, msiteFoodTypes } from "@/api/index";
import { type } from "os";
export default {
    components: {
        vFood
    },
    data() {
        return {
            positionStatus: "absolute", //定位fixed或者relatives
            showStatus: true, //是否显示高度
            show: true,
            positionText: "正在定位...",
            imgBaseUrl: "https://fuss10.elemecdn.com", //图片域名地址
            foodTypes: [], //食品分类列表
            geohash: "", // 地址geohash
            loading: true, //默认不显示
            foodPosition: "relative",
            categoryNavheight: 0, //分类导航栏的位置
            typeFlag: false //根据类名判断分类标签的样式
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
        initData() {
            if (this.cityInfo) {
                this.positionText = this.cityInfo.name;

                this.geohash =
                    this.cityInfo.latitude + "," + this.cityInfo.longitude;

                this.getFoodTypesArr(this.geohash);
            }
        },
        //滚动触发事件
        handleScroll() {
            // 获取定位元素的高度
            const height = this.$refs.positionTop.offsetHeight;
            //获取页面滚动出去的高度
            const scrollTop = this.$refs.home.scrollTop;
            if (scrollTop > height) {
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
        },
        //获取当前城市地址
        async getCity() {
            this.positionText = "正在获取位置...";
            // 获取当前位置有点问题，使用热门城市代替
            // const response = await reqCurrentPosition()
            // this.positionText = response.name
            const response = await reqHotCity();
            const result = response.data[0];

            this.positionText = result.name;

            this.geohash = result.latitude + "," + result.longitude;
            //获取食品分类列表

            this.getFoodTypesArr(this.geohash);

            // 保存到vuex中
            this.getCityInfo(result);
        },

        //获取食品分类列表
        async getFoodTypesArr(geohash) {
            const response = await msiteFoodTypes(geohash);
            const result = response.data;

            let resLength = result.length;
            let resArr = [...result]; // 返回一个新的数组
            let foodArr = [];
            for (let i = 0, j = 0; i < resLength; i += 8, j++) {
                foodArr[j] = resArr.splice(0, 8);
            }
            this.foodTypes = foodArr;
        },
        changeStyle() {
            // 头部样式改变
            this.positionStatus = "fixed";
            this.showStatus = false;
            //分类样式改变
            this.typeFlag = true;
            // 页面滚动到分类位置
            this.$refs.home.scrollTop = this.$refs.food.offsetTop
        },
        goCity() {
            this.$router.push("/address");
        }
    }
};
</script>

<style lang="scss" scoped>
.home {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: absolute;
    .position-nav {
        width: 100%;
        padding: 5px 10px;
        background-color: #01a3f8;
        z-index: 10;
        .position-top {
            height: 30px;
            width: 100%;
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