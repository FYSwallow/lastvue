<template>
    <div class="foods" @scroll="handleScroll">
        <v-foods class="food-nav" :title="foodTitle">
            <header slot="shopTitle" class="food-title">
                <van-icon name="arrow-left" @click="goback"/>
                <span class="nav-list">{{headTitle}}</span>
            </header>
        </v-foods>
        <v-shoplist v-if="cityInfo" class="shoplist" :loadMoreFlag="loadMoreFlag" />
    </div>
</template>

<script>
import { mapState } from "vuex";
import vFoods from "@/components/food/food";
import vShoplist from "@/components/shoplist/shoplist";
export default {
    components: {
        vFoods,
        vShoplist
    },
    data() {
        return {
            chooseIndex: 1,
            geohash: "", // city页面传递过来的地址geohash
            headTitle: "", // msiet页面头部标题
            foodTitle: "", // 排序左侧头部标题
            restaurant_category_id: "", // 食品类型id值
            loadMoreFlag: 0 //加载更多商品标志
        };
    },
    computed: {
        ...mapState(["cityInfo"])
    },
    mounted() {
        this.initData();
    },
    methods: {
        initData() {
            const { latitude, longitude } = this.cityInfo;
            this.headTitle = this.$route.query.title;
            this.foodTitle = this.headTitle;
            this.restaurant_category_id = this.$route.query.restaurant_category_id;
            //获取该类型食品的全部分类
        },
        //滚动触发事件
        handleScroll(e) {
            //获取页面滚动出去的高度,页面的高度,浏览器窗口高度
            const scrollHeight = e.target.scrollHeight;
            const scrollTop = e.target.scrollTop;

            const clientHeight = document.body.clientHeight;
            // 当页面滚动至页面最底部时加载更多
            if (scrollTop + clientHeight >= scrollHeight) {
                this.loadMoreFlag++;
            }
        },
        // 点击tab栏切换选择类型
        chooseType(index) {
            this.chooseIndex = index;
        },
        //返回上级路由
        goback() {
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="scss" scoped>
.foods {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .food-nav {
        position: fixed;
        top: 0;
        z-index: 12;
        .food-title {
            height: 50px;
            width: 100%;
            padding-left: 10px;
            font-weight: 600;
            line-height: 50px;
            color: #ccc;
            background-color: #01a3f8;
            .nav-list {
                padding-left: 15px;
            }
        }
    }
    .shoplist {
        padding-top: 100px;
    }
}
</style>