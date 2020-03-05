<template>
  <div ref="shoplist" :style="{minHeight: clientHeight}">
    <ul class="shop-list" v-if="shopListArr">
      <router-link
        class="shop-list-item"
        v-for="(item, index) in shopListArr"
        :key="index"
        :to="{path: '/shop', query:{ id: item.id }}"
        tag="li"
      >
        <img :src="item.image_path" />
        <section>
          <header class="shop-detail">
            <div class="shop-detail-left">
              <h4 class="shop-title ellipsis" :class="item.is_premium? 'premium': ''">{{item.name}}</h4>
            </div>
            <div class="shop-detail-right">
              <span
                v-for="supportItem in item.supports"
                :key="supportItem.id"
              >{{supportItem.icon_name}}</span>
            </div>
          </header>
          <div class="rating">
            <div class="rating-left">
                <!-- <rating-star :rating="item.rating" /> -->
              <div class="rating-star">
                <div class="rating-star-white">★★★★★</div>
                <div class="rating-star-orange" :style="'width:' +item.rating / 5 * 48+ 'px' ">★★★★★</div>
              </div>
              <div class="rating-score">{{item.rating}}</div>
              <div class="seller-num">月售{{item.recent_order_num}}单</div>
            </div>
            <div class="rating-right">
              <span v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
              <!-- <span v-if="zhunshi(item.supports)">准时达</span> -->
            </div>
          </div>
          <div class="distance">
            <div
              class="distance-left"
            >¥{{item.float_minimum_order_amount}}起送 / {{item.piecewise_agent_fee.tips}}</div>
            <div class="distance-right">
              <span>{{item.distance}}</span>/
              <span>{{item.order_lead_time}}</span>
            </div>
          </div>
        </section>
      </router-link>
    </ul>
    <ul v-else class="shop-list">
      <li class="shop-list-item" v-for="item in 10" :key="item">
        <img src="@/assets/images/shopback.svg" class="list-back-svg" />
      </li>
    </ul>
    <p class="empty-end" v-if="touchend">没有更多了...</p>

    <div class="load" v-else>
      <van-loading color="#1989fa" class="icon-load" />
      <span>正才加载</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { shopList } from "@/api/index";
import ratingStar from "@/components/rating-star";
export default {
  components: {
    ratingStar
  },
  props: ["loadMoreFlag"],
  data() {
    return {
      offset: 0, // 批次加载店铺列表，每次加载20个 limit = 20
      shopListArr: [], // 店铺列表数据
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      imgBaseUrl: "/api/img/", //
      showLoading: true, //显示加载动画
      touchend: false, //没有更多数据
      clientHeight: "" //获取当前组件的高度,判断是否需要调整主界面的布局
    };
  },
  mounted() {
    this.initData();
  },
  computed: {
    ...mapState(["location", "foodInfo", "geohash"])
  },
  watch: {
    foodInfo: function(newval, oldval) {
        console.log(this.location)
      const { latitude, longitude } = this.location;
      const {
        restaurant_category_ids,
        restaurant_category_id,
        sortByType,
        delivery_mode,
        supportIds
      } = newval;
      if (
        oldval.restaurant_category_ids !== restaurant_category_ids ||
        oldval.sortByType !== sortByType ||
        oldval.delivery_mode !== delivery_mode ||
        oldval.supportIds !== supportIds
      ) {
        // 当筛选, 排序的方式改变时,参数初始化
        this.offset = 0;
        this.touchend = false;
        this.preventRepeatReuqest = false;
        shopList(
          latitude,
          longitude,
          this.offset,
          restaurant_category_id,
          restaurant_category_ids,
          sortByType,
          delivery_mode,
          supportIds
        ).then(res => {
          this.shopListArr = res;
          if (res.length < 20) {
            this.touchend = true;
          }
        });
      }
      // 获取经过筛选之后的食品列表
    },
    loadMoreFlag: function(newval) {
      if (this.touchend) {
        return;
      }
      //防止重复请求

      if (this.preventRepeatReuqest) {
        return;
      }
      this.touchend = false;
      //防止重复请求

      this.preventRepeatReuqest = true;
      //数据的定位加20位
      this.offset += 20;

      const {
        restaurant_category_ids,
        restaurant_category_id,
        sortByType,
        delivery_mode,
        supportIds
      } = this.foodInfo;
      const { latitude, longitude } = this.location;
      shopList(
        latitude,
        longitude,
        this.offset,
        restaurant_category_id,
        restaurant_category_ids,
        sortByType,
        delivery_mode,
        supportIds
      ).then(res => {
        this.shopListArr = [...this.shopListArr, ...res];
        //当获取数据小于20，说明没有更多数据，不需要再次请求数据
        if (res.length < 20) {
          this.touchend = true;
          return;
        }
        this.preventRepeatReuqest = false;
      });
    }
  },
  methods: {
    async initData() {
      // 获取商家列表
      const { latitude, longitude } = this.location;
      const result = await shopList(latitude, longitude, this.offset);
      this.shopListArr = result.data;
      console.log(this.shopListArr);
      if (this.shopListArr.length < 20) {
        this.touchend = true;
      }
      this.clientHeight = document.body.clientHeight + "px";
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.shop-list {
  background-color: #fff;
  position: relative;
  .shop-list-item {
    border-bottom: 1px solid #eee;
    padding: 16px 10px;
    .list-back-svg {
      width: 100%;
      height: 100%;
    }
    img {
      width: 20%;
      height: 70px;
      display: inline-block;
      padding-right: 10px;
    }
    section {
      display: inline-block;
      width: 80%;
      font-size: 12px;
      color: #666;
      .shop-detail {
        display: flex;
        .shop-detail-left {
          width: 80%;
          transform: scale(0.7) translateX(-50px);
          .shop-title {
            width: 200px;
            font-weight: 700;
            font-size: 20px;
            padding-left: 10px;
            color: #000;
          }
          .premium::before {
            content: "品牌";
            background-color: #ffd930;
            font-size: 12px;
            padding: 0 5px;
            line-height: 12px;
            margin-right: 10px;
          }
        }
        .shop-detail-right {
          position: absolute;
          right: 10px;
          line-height: 26px;
          span {
            border: 1px solid #f1f1f1;
            margin-left: 5px;
            color: #999;
          }
        }
      }
      .rating {
        display: flex;
        margin-top: 8px;
        .rating-left {
          transform: translate(0.7);
          div {
            display: inline-block;
          }
          .rating-star {
            position: relative;
            width: 48px;
            .rating-star-white {
              color: #999;
            }
            .rating-star-orange {
              position: absolute;
              top: 0;
              left: 0;
              color: #ff9a0d;
              overflow: hidden;
            }
          }
          .rating-score {
            padding-left: 10px;
            color: #ff9a0d;
          }
          .seller-num {
            padding-left: 10px;
            color: #999;
          }
        }
        .rating-right {
          transform: scale(0.7) translateX(18px);
          span:nth-of-type(1) {
            background-color: #01a3f8;
            border: 1px solid #01a3f8;
            color: #fff;
          }
          span:nth-of-type(2) {
            color: #01a3f8;
            border: 1px solid #01a3f8;
            margin-left: 2px;
          }
        }
      }
      .distance {
        margin-top: 8px;
        position: relative;
        .distance-right {
          position: absolute;
          top: 0;
          right: 10px;
          span:nth-of-type(2) {
            color: #01a3f8;
          }
        }
      }
    }
  }
}
.load {
  text-align: center;
  font-size: 14px;
  .icon-load {
    display: inline-block;
    margin-right: 10px;
  }
}
.empty-end {
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.loading-enter-active,
.loading-leave-active {
  transition: opacity 1s;
}
.loading-enter,
.loading-leave-active {
  opacity: 0;
}
</style>