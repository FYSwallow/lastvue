<template>
    <div class="food">
        <slot name="shopTitle"></slot>
        <section class="sort-container">
            <div
                class="sort-item"
                :class="{choosetype:sortBy == 'food', active: restaurant_category_id}"
                @click="chooseType('food')"
            >
                <span>{{ foodTitle}}</span>
                <van-icon name="arrow-down" class="icon-down" />
            </div>
            <div
                class="sort-item"
                :class="{choosetype:sortBy == 'sort', active: sortByType >= 0}"
                @click="chooseType('sort')"
            >
                <span>{{sortList[sortByType] || "排序"}}</span>
                <van-icon name="arrow-down" class="icon-down" />
            </div>
            <div
                class="sort-item"
                :class="{choosetype:sortBy == 'preparation', active: filterNum}"
                @click="chooseType('preparation')"
            >
                <span>筛选</span>
                <van-icon name="arrow-down" class="icon-down" />
            </div>
        </section>
        <transition name="showlist">
            <section class="category-container" v-show="sortBy">
                <!-- 分类 -->
                <div class="category-type" v-show="sortBy == 'food'">
                    <ul class="category-type-left">
                        <li
                            v-for="(item, index) in category"
                            :key="index"
                            :class="{'active': restaurant_category_id == item.id}"
                            @click="selectCategoryName(item.id, index)"
                        >
                            <div class="list-left">
                                <img :src="getImgPath(item.image_url)" v-if="index" />
                                <span class="name">{{item.name}}</span>
                            </div>
                            <div class="list-right">
                                <span class="count">{{item.count}}</span>
                            </div>
                            <van-icon name="arrow" class="icon-right" v-if="index" />
                        </li>
                    </ul>
                    <ul class="category-type-right">
                        <li
                            v-for="(item, index) in categoryDetail"
                            :key="item.id"
                            @click="getCategoryIds(item.id, item.name, index)"
                            :class="{'active': restaurant_category_ids == item.id}"
                        >
                            <div class="list-left" :class="{'title': index == 0}">
                                <span>{{item.name}}</span>
                            </div>
                            <div class="list-right" v-if="index">
                                <span>{{item.count}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 排序 -->
                <div class="sort-type" v-show="sortBy == 'sort'">
                    <ul class="sort-list">
                        <li
                            class="list-style"
                            v-for="(item, index) in sortList"
                            :key="index"
                            @click="sortMethod(index)"
                            :class="{'active': sortByType == index}"
                        >
                            <div class="list-right">
                                <img :src="require(`@/assets/images/sort${index + 1}.png`)" />
                                <span>{{item}}</span>
                            </div>
                            <div class="list-left">
                                <img
                                    src="@/assets/images/current.png"
                                    v-show="sortByType === index"
                                />
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 筛选 -->
                <div class="preparation-type" v-show="sortBy == 'preparation'">
                    <div class="detail">
                        <h3 class="detail-title">配送方式</h3>
                        <ul class="detail-type clear">
                            <li
                                class="detail-list"
                                v-for="(item, index) in delivery"
                                :key="index"
                                :class="{'active': delivery_mode == item.id}"
                                @click="selectDeliveryMode(item.id)"
                            >
                                <img
                                    :src="require(`@/assets/images/bird.png`)"
                                    v-if="delivery_mode !== item.id"
                                />
                                <img src="@/assets/images/current.png" v-else />
                                <span>{{item.text}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="detail">
                        <h3 class="detail-title">商家属性</h3>
                        <ul class="detail-type clear">
                            <li
                                class="detail-list"
                                v-for="(item, index) in activity"
                                :key="index"
                                @click="selectSupportIds(index, item.id)"
                                :class="{'active':support_ids[index].status}"
                            >
                                <img
                                    :src="require(`@/assets/images/attr${index+1}.png`)"
                                    v-show="!support_ids[index].status"
                                />
                                <img
                                    src="@/assets/images/current.png"
                                    v-show="support_ids[index].status"
                                />
                                <span>{{item.name}}</span>
                            </li>
                        </ul>
                    </div>
                    <footer>
                        <button class="clear-all" @click="clearSelect">清空</button>
                        <button class="make-sure" @click="confirmSelected">
                            <span>确定</span>
                            <span v-show="filterNum">({{filterNum}})</span>
                        </button>
                    </footer>
                </div>
            </section>
        </transition>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { shopCategory, foodDelivery, foodActivity } from "@/api/index";
export default {
    data() {
        return {
            geohash: "", //地理位置
            foodTitle: "分类",
            category: [], // category分类左侧数据
            categoryDetail: null, // category分类右侧的详细数据
            sortList: [
                "智能排序",
                "起送价最低",
                "配送速度最快",
                "评分最高",
                "距离最近",
                "销量最高"
            ], //排序列表
            delivery: null, // 配送方式数据
            activity: null, //商家属性数据
            sortBy: "", // 筛选的条件,
            restaurant_category_ids: "", //食品分类id
            restaurant_category_id: "", //食品种类id
            sortByType: -1, // 根据何种方式排序
            delivery_mode: null, // 选中的配送方式
            support_ids: [], // 选中的商铺活动列表
            filterNum: 0, // 所选中的所有样式的集合
            confirmStatus: false, // 确认选择
            show: false //遮挡层
        };
    },
    computed: {
        ...mapState(["foodInfo", "location"])
    },
    watch: {
        // 根据sortBy的值判断遮挡层是否显示
        sortBy: function(newval) {
            this.getFoodInfo({ sortBy: newval });
        },
        restaurant_category_ids: function(newval) {
            this.getFoodInfo({
                restaurant_category_ids: newval,
                restaurant_category_id: this.restaurant_category_id
            });
        },
        sortByType: function(newval) {
            this.getFoodInfo({ sortByType: newval });
        },
        confirmStatus: function(newval) {
            this.getFoodInfo({
                delivery_mode: this.delivery_mode,
                support_ids: this.support_ids
            });
        },
        foodInfo: function(newval) {
            if (!newval.sortBy) {
                this.sortBy = "";
            }
        }
    },
    mounted() {
        this.geohash = this.location.latitude + "," + this.location.longitude;
        this.initData();
    },
    methods: {
        ...mapActions(["getFoodInfo"]),
        // 初始化数据
        async initData() {
            const { latitude, longitude } = this.location;
            const categoryRes = await shopCategory(latitude, longitude);
            this.category = categoryRes.data

            // 获取配送列表
            const deliveryRes = await foodDelivery(latitude, longitude);
            this.delivery = deliveryRes.data.data
            console.log(this.delivery)
            // 获取筛选列表
            const activityRes = await foodActivity(latitude, longitude);
            this.activity = activityRes.data
            console.log(this.activity)
            //记录support_ids的状态，默认不选中，点击状态取反，status为true时为选中状态
            this.activity.forEach((item, index) => {
                this.support_ids[index] = { status: false, id: item.id };
            });
        },
        //选中的分类方式
        chooseType(type) {
            if (this.sortBy !== type) {
                this.sortBy = type;
                if (type == "food") {
                    this.foodTitle = "分类";
                }
            } else {
                this.sortBy = "";
            }

            this.$emit("changeStyle", this.sortBy);
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
        selectCategoryName(id, index) {
            if (index === 0) {
                this.restaurant_category_ids = null;
                this.sortBy = "";
                //不是第一个选项时，右侧展示其子级sub_categories的列表
            } else {
                this.restaurant_category_id = id;
                this.categoryDetail = this.category[index].sub_categories;
            }
        },
        //选中Category右侧列表的某个选项时，进行筛选，重新获取数据并渲染
        getCategoryIds(id, name, index) {
            if (index != 0) {
                this.restaurant_category_ids = id;
                this.sortBy = "";
                this.foodTitle = name;
            }
        },
        //排序方法
        sortMethod(index) {
            this.sortBy = "";
            if (this.sortByType === index) {
                this.sortByType = null;
            } else {
                this.sortByType = index;
            }
        },
        //所选中的配送方式
        selectDeliveryMode(id) {
            if (this.delivery_mode == null) {
                this.filterNum++;
                this.delivery_mode = id;
            } else if (this.delivery_mode == id) {
                this.filterNum--;
                this.delivery_mode = null;
            } else {
                this.delivery_mode = id;
            }
        },
        // 点击商家活动,状态取反
        selectSupportIds(index, id) {
            this.support_ids.splice(index, 1, {
                status: !this.support_ids[index].status,
                id
            });
            // 重新计算filterNum即选中的个数
            // 配送方式是单选,要么是0,要么是1
            this.filterNum = this.delivery_mode == null ? 0 : 1;
            this.support_ids.forEach(item => {
                if (item.status) {
                    this.filterNum++;
                }
            });
        },
        // 点击清空按钮清空数据
        clearSelect() {
            this.support_ids.map(item => (item.status = false));
            this.filterNum = 0;
            this.delivery_mode = null;
        },
        confirmSelected() {
            this.confirmStatus = !this.confirmStatus;
            this.sortBy = "";
        }
    }
};
</script>

<style lang="scss" scoped>
.food {
    width: 100%;
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
        .active {
            font-weight: 700;
        }
    }
    .category-container {
        width: 100%;
        height: 300px;
        .category-type {
            display: flex;
            height: 100%;
            .category-type-left {
                flex: 1;
                height: 100%;
                overflow: auto;
                font-size: 12px;
                background-color: #f1f1f1;
                li {
                    display: flex;
                    position: relative;
                    align-items: center;
                    height: 40px;
                    padding-left: 10px;
                    .list-left {
                        flex: 3;
                        img {
                            height: 25px;
                            width: 25px;
                            vertical-align: middle;
                            margin-right: 5px;
                        }
                        .name {
                            color: #666;
                        }
                    }
                    .list-right {
                        flex: 2;
                        .count {
                            border-radius: 7px;
                            padding: 0 5px;
                            margin-right: 5px;
                            color: #fff;
                            background-color: #ccc;
                        }
                    }
                    .icon-right {
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        padding-right: 5px;
                        color: #aaa;
                    }
                }
                .active {
                    background-color: #fff;
                }
            }
            .category-type-right {
                flex: 1;
                height: 100%;
                overflow: auto;
                padding-left: 5px;
                background-color: #fff;
                li {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    height: 40px;
                    padding-right: 5px;
                    border-bottom: 1px solid #ccc;
                    font-size: 14px;
                    line-height: 40px;
                    color: #666;
                    .title {
                        font-weight: 700;
                    }
                }
                .active {
                    color: #3190e8;
                }
            }
        }
        .sort-type {
            font-size: 12px;
            background-color: #fff;
            .sort-list {
                padding-left: 10px;
                .list-style {
                    display: flex;
                    height: 40px;
                    .list-right {
                        flex: 1;
                        height: 40px;
                        line-height: 40px;
                        span {
                            margin-left: 10px;
                        }
                    }
                    .list-left {
                        height: 40px;
                        line-height: 40px;
                        width: 50px;
                    }
                    img {
                        width: 20px;
                        height: 20px;
                        vertical-align: middle;
                    }
                }
                .active {
                    color: #01a3f8;
                }
            }
        }
        .preparation-type {
            padding: 0 10px;
            font-size: 12px;
            background-color: #fff;
            .detail {
                .detail-title {
                    height: 40px;
                    line-height: 40px;
                }
                .detail-type {
                    .detail-list {
                        float: left;
                        width: 32%;
                        height: 30px;
                        border: 1px solid #ddd;
                        border-radius: 3px;
                        margin: 0 1% 5px 0;
                        line-height: 30px;
                        img {
                            width: 20px;
                            height: 20px;
                            vertical-align: middle;
                        }
                        span {
                            margin-left: 5px;
                        }
                    }
                }
                .active {
                    color: #01a3f8;
                }
            }
            footer {
                display: flex;
                padding: 5px 10px;
                background-color: #f5f5f5;
                button {
                    width: 48%;
                    height: 40px;
                    border-radius: 3px;
                    border: none;
                    font-size: 18px;
                    &:nth-of-type(1) {
                        background-color: #fff;
                        color: #333;
                    }
                    &:nth-of-type(2) {
                        background-color: #56d176;
                        color: #fff;
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