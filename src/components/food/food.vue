<template>
    <div class="food">
        <h3 class="shop-title">—— 推荐商家 ——</h3>
        <section class="sort-container">
            <div
                class="sort-item"
                :class="{choosetype:sortBy == 'food'}"
                @click="chooseType('food')"
            >
                <span>{{foodTitle}}</span>
                <van-icon name="arrow-down" class="icon-down" />
            </div>
            <div
                class="sort-item"
                :class="{choosetype:sortBy == 'sort'}"
                @click="chooseType('sort')"
            >
                <span>排序</span>
                <van-icon name="arrow-down" class="icon-down" />
            </div>
            <div
                class="sort-item"
                :class="{choosetype:sortBy == 'activity'}"
                @click="chooseType('activity')"
            >
                <span>筛选</span>
                <van-icon name="arrow-down" class="icon-down" />
            </div>
        </section>
        <transition name="sortlist">
            <section class="category-container" v-show="sortBy">
                <div class="category-type" v-show="sortBy == 'food'">
                    <ul class="category-type-left">
                        <li
                            v-for="(item, index) in category"
                            :key="index"
                            @click="selectCategoryName(item.id, index)"
                        >
                            <img :src="getImgPath(item.image_url)" v-if="index" />
                            <span class="name">{{item.name}}</span>
                            <span class="count">{{item.count}}</span>
                            <van-icon name="arrow" class="icon-right" />
                        </li>
                    </ul>
                </div>
            </section>
        </transition>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { foodCategory } from "@/api/index";
export default {
    data() {
        return {
            value: 0,
            switch1: false,
            switch2: false,
            option: [
                { text: "全部商品", value: 0 },
                { text: "新款商品", value: 1 },
                { text: "活动商品", value: 2 }
            ],
            activeIndex: 0,
            geohash: "", //地理位置
            foodTitle: "分类",
            sortBy: "", // 筛选的条件,

            category: [], // category分类左侧数据
            categoryDetail: null // category分类右侧的详细数据
        };
    },
    computed: {
        ...mapState(["cityInfo"])
    },
    mounted() {
        this.geohash = this.cityInfo.latitude + "," + this.cityInfo.longitude;
        this.initData();
    },
    methods: {
        // 初始化数据
        async initData() {
            const { latitude, longitude } = this.cityInfo;
            const response = await foodCategory(latitude, longitude);
            this.category = response.data;
        },
        //选中的分类方式
        chooseType(type) {
            if (this.sortBy !== type) {
                this.sortBy = type;
                if (type == "food") {
                    this.foodTitle = "分类";
                    this.$emit("changeStyle");
                }
            } else {
                this.sortBy = "";
            }
        },
        //传递过来的图片地址需要处理后才能正常使用
        getImgPath(path) {
            let suffix;
            if (!path) {
                return "//elm.cangdu.org/img/default.jpg";
            }
            if (path.indexOf("jpeg") !== -1) {
                suffix = ".jpeg";
            } else {
                suffix = ".png";
            }
            let url =
                "/" +
                path.substr(0, 1) +
                "/" +
                path.substr(1, 2) +
                "/" +
                path.substr(3) +
                suffix;
            return "https://fuss10.elemecdn.com" + url;
        },

        //选中Category左侧列表的某个选项时，右侧渲染相应的sub_categories列表
        selectCategoryName(index) {
            this.categoryDetail = this.category[index].children;
        },
        //选中Category右侧列表的某个选项时，进行筛选，重新获取数据并渲染
        getCategoryIds(data) {
            this.foodTitle = data.text;
        }
    }
};
</script>

<style lang="scss" scoped>
.food {
    width: 100%;
    .shop-title {
        height: 50px;
        line-height: 50px;
        background-color: #fff;
        text-align: center;
    }
    .sort-container {
        display: flex;
        width: 100%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background-color: #fff;
        border-bottom: 1px solid #f1f1f1;
        .sort-item {
            flex: 1;
            height: 100%;
            float: left;
            position: relative;
            border-right: 1px solid #f1f1f1;
            font-size: 14px;
            color: #444;
            .icon-down {
                position: absolute;
                bottom: 10px;
                padding-left: 3px;
                transition: all 0.2s linear;
            }
        }
        .choosetype {
            color: #01a3f8;
            .icon-down {
                transform: rotate(180deg);
            }
        }
    }
    .category-container {
        width: 100%;
        height: 50%;
        .category-type {
            .category-type-left {
                li {
                    height: 40px;
                    img {
                        height: 30px;
                        width: 30px;
                        vertical-align: middle;
                        margin: 0 10px;
                    }
                    .name {
                      margin-right: 10px;
                    }
                    
                }
            }
        }
    }
    .showlist-enter-active,
    .showlist-leave-active {
        transition: all 0.3s;
        transform: translateY(0);
    }
    .showlist-enter,
    .showlist-leave-active {
        opacity: 0;
        transform: translateY(-100%);
    }
}
</style>