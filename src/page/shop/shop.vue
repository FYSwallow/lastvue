<template>
    <div class="shop" ref="shop">
        <header class="header">
            <div class="header-top">
                <img src alt />
            </div>
            <div class="header-middle">
                <img src alt />
            </div>
            <div class="header-bottom">
                <h3 class="shop-name style-center">大红帽老火锅冒菜</h3>
                <div class="shop-detail style-center">
                    <span>评价4.6 月售3955单 配送约37分钟</span>
                </div>
                <p class="shop-toast style-center"></p>
            </div>
        </header>
        <section class="main" ref="main">
            <div class="tabs">
                <span
                    class="tab"
                    :class="{active:chooseType == 'products'}"
                    @click="selectType('products')"
                >商品</span>
                <span
                    class="tab"
                    :class="{active:chooseType == 'appraise'}"
                    @click="selectType('appraise')"
                >评价</span>
            </div>
            <section class="tabs-content">
                <transition name="shop">
                    <section class="products" v-show="chooseType == 'products'">
                        <div class="products-content">
                            <aside class="products-nav">
                                <ul>
                                    <li
                                        v-for="(item, index) in menuList"
                                        :key="index"
                                        class="ellipsis"
                                        :class="{active: selected === index}"
                                        @click="chooseSelected(index)"
                                    >
                                        {{item.name}}
                                        <div class="num"></div>
                                    </li>
                                </ul>
                            </aside>
                            <section
                                class="products-container"
                                @scroll="handleScroll"
                                ref="products"
                            >
                                <ul
                                    v-for="(item, key) in menuList"
                                    :key="item.id"
                                    :ref="'list' + key"
                                >
                                    <li>
                                        <header class="products-container-title">
                                            <span>{{item.name}}</span>
                                            <span class="head-middle ellipsis">{{item.description}}</span>
                                        </header>
                                    </li>
                                    <li v-for="(value, index) in item.foods" :key="index">
                                        <img class="food-image" :src="imgBaseUrl+ value.image_path" />
                                        <section class="food-detail ellipsis">
                                            <h3 class="food-name">{{value.name}}</h3>
                                            <p
                                                class="food-description ellipsis"
                                            >{{value.description}}</p>
                                            <p class="food-rating">
                                                <span>{{value.tips}}</span>
                                            </p>
                                            <div class="food-tag ellipsis">
                                                <span
                                                    v-if="value.activity"
                                                    :style="{color: '#' + value.activity.image_text_color }"
                                                >{{value.activity.image_text}}</span>
                                            </div>
                                            <div class="food-price">
                                                <span>￥20 元</span>
                                            </div>
                                            <div class="shopChoose">
                                                <v-cartControl />
                                            </div>
                                        </section>
                                    </li>
                                </ul>
                            </section>
                        </div>
                        <footer class="shop-cart">
                            <v-shopCart />
                        </footer>
                    </section>
                </transition>
                <transition name="shop">
                    <div class="appraise" v-show="chooseType == 'appraise'"></div>
                </transition>
            </section>
        </section>
    </div>
</template>

<script>
import { foodMenu } from "@/api/index";
import vCartControl from "@/components/cartControl/cartControl";
import vShopCart from "@/components/shopcart/shopcart";
export default {
    components: {
        vCartControl,
        vShopCart
    },
    data() {
        return {
            geohash: "", //地理位置信息
            shopId: null, //商店id值
            menuList: [], //商铺列表
            imgBaseUrl: "https://elm.cangdu.org/img/", //图片域名地址
            chooseType: "products", //最初显示的是商品
            selected: 0, //默认选中商品为第一个
            typeElementHeight: null
        };
    },
    mounted() {
        this.initData();
    },
    methods: {
        // 初始化商家内容
        async initData() {
            this.geohash = this.$route.query.geohash;
            //根据商家id获取食品列表
            this.shopId = this.$route.query.id;
            const resMenuList = await foodMenu(this.shopId);
            this.menuList = resMenuList.data;
            this.$nextTick(() => {
                this.menuList.forEach((item, index) => {
                    this.typeElementHeight = Object.assign(
                        {},
                        this.typeElementHeight,
                        { [item.id]: this.$refs["list" + index][0].offsetTop }
                    );
                });
            });
        },
        handleScroll(e) {
            // 当前窗口滚动到食品选择位置
            this.$refs.shop.scrollTop = this.$refs.main.offsetTop;
            const scrollTop = e.target.scrollTop;
            const tempArr = Object.values(this.typeElementHeight);

            // 根据窗口的滚动,判断导航栏菜单项的高亮显示
            for (let i = 0; i < tempArr.length; i++) {
                if (
                    scrollTop > tempArr[i] - e.target.offsetTop &&
                    scrollTop < tempArr[i + 1] - e.target.offsetTop
                ) {
                    this.selected = i;
                }
            }
        },
        //点击切换内容
        selectType(name) {
            this.chooseType = name;
        },
        chooseSelected(index) {
            // 当前窗口滚动到食品选择位置
            this.$refs.shop.scrollTop = this.$refs.main.offsetTop;
            //根据点击的元素,确定滚动到某个位置
            this.selected = index;
            this.$refs.products.scrollTop =
                this.$refs["list" + index][0].offsetTop -
                this.$refs["list" + 0][0].offsetTop;
        }
    }
};
</script>

<style lang="scss" scoped>
.shop {
    width: 100%;
    height: 100%;
    overflow: auto;
    .header {
        position: relative;
        .header-top {
            height: 100px;
            width: 100%;
            img {
                height: 100%;
                width: 100%;
            }
        }
        .header-middle {
            width: 60px;
            height: 60px;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -80%);
            background-color: #000;
        }
        .header-bottom {
            padding-top: 30px;
            background-color: #fff;
            .shop-name {
                padding: 0 10px;
            }
            .style-center {
                width: 80%;
                margin: auto;
                padding-top: 10px;
                text-align: center;
            }
        }
    }
    .main {
        height: 100%;
        background-color: #fff;
        .tabs {
            display: flex;
            align-items: center;
            height: 8%;
            .tab {
                flex: 1;
                margin: 0 20%;
                text-align: center;
            }
            .active {
                font-weight: 700;
                border-bottom: 3px solid #01a3f8;
            }
        }
        .tabs-content {
            height: 92%;
            padding-bottom: 50px;
        }
        .products {
            height: 100%;
            .products-content {
                display: flex;
                height: 100%;
                .products-nav {
                    width: 20%;
                    height: 100%;
                    text-align: center;
                    overflow-y: auto;
                    ul {
                        li {
                            height: 50px;
                            padding: 0 10px;
                            font-size: 14px;
                            line-height: 50px;
                            color: #333;
                            background-color: #eee;
                        }
                        .active {
                            background-color: #fff;
                            border-left: 3px solid #01a3f8;
                        }
                    }
                }
                .products-container {
                    flex: 1;
                    height: 100%;
                    width: 100%;
                    padding-left: 5px;
                    overflow-y: auto;
                    ul {
                        li {
                            display: flex;
                            width: 100%;
                            padding: 10px;

                            .products-container-title {
                                height: 40px;
                                line-height: 40px;
                                flex: 1;
                                span {
                                    &:first-child {
                                        padding-right: 10px;
                                        font-weight: 700;
                                    }
                                    &:last-child {
                                        font-size: 14px;
                                    }
                                }
                            }
                            .food-image {
                                width: 30%;
                            }
                            .food-detail {
                                flex: 1;
                                position: relative;
                                .food-name {
                                    font-weight: 700;
                                }
                                .food-description {
                                    font-size: 12px;
                                }
                                .food-rating {
                                    font-size: 12px;
                                    span {
                                        &:first-child {
                                            margin-right: 10px;
                                        }
                                    }
                                }
                                .food-tag {
                                    height: 14px;
                                    font-size: 12px;
                                    line-height: 14px;
                                }
                                .food-price {
                                    font-size: 12px;
                                    color: red;
                                }
                                .shopChoose {
                                    position: absolute;
                                    bottom: 14px;
                                    right: 0;
                                }
                            }
                        }
                    }
                }
            }
            .shop-cart {
                height: 50px;
                position: fixed;
                bottom: 0;

            }
        }
    }
}
</style>