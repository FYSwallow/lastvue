<template>
    <div class="city">
        <header class="city-header">
            <van-search placeholder="输入城市名、拼音或首字母查询" v-model="searchCity" @input="searchPosition" />
        </header>
        <section class="city-group">
            <van-index-bar :index-list="indexList" class="city-container" v-if="!searchCity.length">
                <div class="localCity title">当前定位城市</div>
                <div class="localCity main">{{localCityName}}</div>
                <div v-for="(value, key, index) in groupCity" :key="index">
                    <van-index-anchor :index="key">{{key}}</van-index-anchor>
                    <div v-for="item in value" :key="item.id" @click="chooseCity(item)">
                        <van-cell :title="item.name" />
                    </div>
                </div>
            </van-index-bar>
            <section class="search-city-list" v-else>
                <ul>
                    <!-- v-html转换为html标签 -->
                    <li v-for="(item, index) in searchCityList" :key="index" v-html="item.name" @click="chooseCity(item)"></li>
                </ul>
            </section>
        </section>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { reqCurrentPosition, reqCityGroup } from "@/api/index";
export default {
    data() {
        return {
            searchCity: "",
            localCityName: "定位不准",
            groupCity: null, //获取所有城市
            indexList: [],
            searchCityList: [] // 根据搜索框的值获取到的城列表
        };
    },
    computed: {
        ...mapState(["cityInfo"])
    },
    mounted() {
        this.initData();
    },
    methods: {
        ...mapActions(['getCityInfo']),
        async initData() {
            // 获取当前定位城市
            const result = await reqCurrentPosition();
            this.localCityName = result.name;

            const allCity = await reqCityGroup();

            this.groupCity = this.sortgroupcity(allCity);

            this.indexList = Object.keys(this.groupCity);
        },

        // 对所有的city城市排序
        sortgroupcity(cityList) {
            let sortobj = {};
            for (let i = 65; i <= 90; i++) {
                if (cityList[String.fromCharCode(i)]) {
                    sortobj[String.fromCharCode(i)] =
                        cityList[String.fromCharCode(i)];
                }
            }
            return sortobj;
        },

        //当搜索框发生变化时搜索对应的城市列表
        searchPosition() {
            // 每次执行当前函数时,清空搜索结果列表
            this.searchCityList = [];
            if (!this.searchCity) {
                return;
            }
            let allCity = [];
            for (let key in this.groupCity) {
                allCity = [...allCity, ...this.groupCity[key]];
            }

            // 对数据进行深拷贝
            allCity.forEach((item, index) => {
                if (item.name.indexOf(this.searchCity) !== -1) {
                    const newname = item.name.replace(
                        this.searchCity,
                        `<span class="sameEle">${this.searchCity}</span>`
                    );
                    this.searchCityList.push(Object.assign({}, item, {name: newname}));
                }
            });
        },

        // 选择城市
        chooseCity (cityInfo) {
            this.getCityInfo(cityInfo);
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="scss" scoped>
.city {
    .city-header {
        position: fixed;
        top: 0;
        z-index: 10;
        width: 100%;
    }
    .city-group {
        margin-top: 54px;
    }
    .city-container {
        .localCity {
            height: 30px;
            line-height: 30px;
            padding-left: 18px;
        }
        .main {
            background-color: #fff;
        }
    }
    .search-city-list {
        ul {
            border-top: 1px solid #ccc;
            background-color: #fff;
            li {
                height: 30px;
                line-height: 30px;
                padding-left: 18px;
                border-bottom: 1px solid #ccc;
            }
        }
    }
}
</style>

<style lang="scss">
// 坑: 为v-html设置标签样式式,不能设置scoped属性,一般采用两个style表签,一个设置scoped,一个不设置
.sameEle {
    font-weight: 700;
}
</style>

