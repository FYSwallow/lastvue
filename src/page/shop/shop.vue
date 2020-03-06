<template>
  <div class="shop" ref="shop">
    <header class="header">
      <div class="header-top">
        <span @click="goBack">
          <van-icon name="arrow-left" />
        </span>

        <img src="@/assets/images/meishi.png" alt />
      </div>
      <div class="header-middle">
        <img src="@/assets/images/shop.png" alt />
      </div>
      <div class="header-bottom">
        <h3 class="shop-name style-center" v-if="shopDetailData">{{shopDetailData.name}}</h3>
        <div class="shop-detail style-center">
          <span v-if="shopDetailData">评价{{shopDetailData.rating}} 月售3955单 配送约37分钟</span>
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
                    <span
                      class="category-num"
                      v-if="categoryNum[index]&&item.type==1"
                    >{{categoryNum[index]}}</span>
                  </li>
                </ul>
              </aside>
              <section class="products-container" @scroll="handleScroll" ref="products">
                <ul v-for="(item, key) in menuList" :key="item.id" :ref="'list' + key">
                  <li>
                    <header class="products-container-title">
                      <span>{{item.name}}</span>
                      <span class="head-middle ellipsis">{{item.description}}</span>
                    </header>
                  </li>
                  <li v-for="(value, index) in item.foods" :key="index">
                    <div class="img-container">
                      <img class="food-image" :src="value.image_path" />
                      <ul v-if="value.attributes.length" class="attributes_ul">
                        <li
                          v-for="(attribute, foodindex) in value.attributes"
                          :key="foodindex"
                          :style="{color: '#' + attribute.icon_color,borderColor:'#' + attribute.icon_color}"
                          :class="{attribute_new: attribute.icon_name == '新'}"
                        >
                          <p
                            :style="{color: attribute.icon_name == '新'? '#fff' : '#' + attribute.icon_color}"
                          >{{attribute.icon_name == '新'? '新品':attribute.icon_name}}</p>
                        </li>
                      </ul>
                    </div>
                    <section class="food-detail ellipsis">
                      <h3 class="food-name">{{value.name}}</h3>
                      <p class="food-description ellipsis">{{value.description}}</p>
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
                        <v-cartControl :food="value" @getStartDotPosition="getStartDotPosition" />
                      </div>
                    </section>
                  </li>
                </ul>
              </section>
            </div>
            <footer class="shop-cart">
              <v-shopCart
                :cartFoodList="cartFoodList"
                :menuList="menuList"
                :geohash="geohash"
                @getEndDotPosition="getEndDotPosition"
              />
            </footer>
          </section>
        </transition>
        <transition name="shop">
          <div class="appraise" v-show="chooseType == 'appraise'" @scroll="ratingScroll">
            <section
              class="rating-container"
              v-if="shopDetailData && ratingScoresData &&ratingTagsList"
            >
              <header class="rating-header">
                <div class="header-left">
                  <p class="average-rating">{{shopDetailData.rating}}</p>
                  <p>综合评价</p>
                  <p>{{(ratingScoresData.compare_rating*100).toFixed(1)}}%</p>
                </div>
                <div class="header-right">
                  <div class="service-attitude">
                    <span>服务态度</span>
                    <span>★★★★★</span>
                    <span>{{ratingScoresData.service_score.toFixed(1)}}</span>
                  </div>
                  <div class="score">
                    <span>菜品评价</span>
                    <span>★★★★★</span>
                    <span>{{ratingScoresData.food_score.toFixed(1)}}</span>
                  </div>
                  <div class="accept-time">
                    <span>送达时间</span>
                    <span>{{shopDetailData.order_lead_time}}分钟</span>
                  </div>
                </div>
              </header>
            </section>
            <section class="rating-select-category">
              <div class="tag">
                <span
                  :class="{'active': ratingTageIndex == index}"
                  v-for="(item, index) in ratingTagsList"
                  :key="index"
                  @click="changeTgeIndex(index, item.name)"
                >{{item.name}}({{item.count}})</span>
              </div>
              <ul class="rating-list" v-for="(item, index) in ratingList" :key="index">
                <li class="rating-item">
                  <div class="item-left">
                    <img src="@/assets/images/weixin.png" alt />
                  </div>
                  <div class="item-right">
                    <div class="user-info">
                      <span>{{item.username}}</span>
                      <span>{{item.rated_at}}</span>
                    </div>
                    <div class="user-rating-nmber">
                      <span>★★★★★</span>
                      <span>{{item.time_spent_desc}}</span>
                    </div>
                    <p class="rating-info">味道很好,肉很多,好评!</p>
                    <div class="have-img" v-if="hasimg">
                      <img src alt />
                    </div>
                    <div class="food-detail">
                      <span>
                        <van-icon name="good-job-o" />
                      </span>
                      <span v-for="value in item.item_ratings" :key="value.id">{{value.food_name}}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </transition>
      </section>
    </section>
    <transition appear @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
      <div class="ball" v-show="ballFlag">
        <div class="inner inner-hook"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {
  shopDetails,
  foodMenu,
  getRatingList,
  ratingTags,
  ratingScores
} from "@/api/index";
import vCartControl from "@/components/cartControl/cartControl";
import vShopCart from "@/components/shopcart/shopcart";
export default {
  components: {
    vCartControl,
    vShopCart
  },
  data() {
    return {
      shopId: null, //商店id值
      shopDetailData: null, // 商铺详情
      menuList: [], //商铺列表
      imgBaseUrl: "/img/", //图片域名地址
      chooseType: "products", //最初显示的是商品
      selected: 0, //默认选中商品为第一个
      typeElementHeight: null,
      categoryNum: [], //商品类型右上角已加入购物车的数量
      totalPrice: 0, //总共价格
      cartFoodList: [], //购物车商品列表
      startDotPosition: null,
      endDotPosition: null,
      ballFlag: false, // 是否显示小球

      // 评论部分
      hasimg: false, //评论是否有图
      ratingList: null, //评价列表
      ratingOffset: 0, //评价获取数据offset值
      ratingScoresData: null, //评价总体分数
      ratingTagsList: null, //评价分类列表
      ratingTageIndex: 0, //评价分类索引
      ratingTagName: "" //评论的类型
    };
  },
  mounted() {
    this.initData();
  },
  computed: {
    ...mapState(["cartList", "geohash"])
  },
  watch: {
    cartList: function(newval) {
      this.getCartListDetail();
    }
  },
  methods: {
    // 初始化商家内容
    async initData() {
      console.log(this.geohash);
      const tempArr = this.geohash.split(",");
      //根据商家id获取食品列表
      this.shopId = this.$route.query.id;
      console.log(this.shopId);
      //获取商铺信息
      const shopDetailRes = await shopDetails(
        this.shopId,
        tempArr[0],
        tempArr[1]
      );
      this.shopDetailData = shopDetailRes.data;
      // 获取食物分类列表
      const menuRes = await foodMenu(this.shopId);
      this.menuList = menuRes.data;
      //评论列表
      this.ratingList = await getRatingList(this.shopId, this.ratingOffset);
      //商铺评论详情
      const ratingScoresRes = await ratingScores(this.shopId);
      console.log(ratingScoresRes);
      this.ratingScores = ratingScoresRes.data.data;
      //评论Tag列表
      const ratingTagsListRes = await ratingTags(this.shopId);
      this.ratingTagsList = ratingTagsListRes.data.data;
      this.getCartListDetail();

      this.$nextTick(() => {
        this.menuList.forEach((item, index) => {
          this.typeElementHeight = Object.assign({}, this.typeElementHeight, {
            [item.id]: this.$refs["list" + index][0].offsetTop
          });
        });
      });
    },
    handleScroll(e) {
      // 当前窗口滚动到食品选择位置
      this.$refs.shop.scrollTop = this.$refs.main.offsetTop;
      const scrollTop = e.target.scrollTop;

      const tempArr = Object.values(this.typeElementHeight);
      // 根据窗口的滚动,判断导航栏菜单项的高亮显示
      let totalBeforeHeight = 0;
      for (let i = 0; i < tempArr.length; i++) {
        totalBeforeHeight += tempArr[i];
        if (
          i != 0 &&
          scrollTop >= totalBeforeHeight - tempArr[i] &&
          scrollTop < totalBeforeHeight
        ) {
          this.selected = i;
          break;
        } else if (i == 0 && scrollTop < totalBeforeHeight) {
          this.selected = i;
        }
      }
    },
    ratingScroll() {
      // 当前窗口滚动到评论窗口位置
      this.$refs.shop.scrollTop = this.$refs.main.offsetTop;
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
    },
    //计算各种数量及其价格
    getCartListDetail() {
      let newArr = [];
      let cartFoodNum = 0;
      this.totalPrice = 0;
      this.cartFoodList = [];
      this.menuList.forEach((item, index) => {
        if (this.cartList[item.restaurant_id]) {
          // 获取当前商店的购物车数据
          const currentShopCart = this.cartList[item.restaurant_id];

          // 获取购物车中当前商铺当前食品分类
          if (currentShopCart[item.foods[0].category_id]) {
            let num = 0;
            Object.keys(currentShopCart[item.foods[0].category_id]).forEach(
              itemid => {
                Object.keys(
                  currentShopCart[item.foods[0].category_id][itemid]
                ).forEach(foodid => {
                  let foodItem =
                    currentShopCart[item.foods[0].category_id][itemid][foodid];
                  num += foodItem.num;
                  if (item.type == 1) {
                    this.totalPrice += foodItem.num * foodItem.price;
                    if (foodItem.num > 0) {
                      this.cartFoodList[cartFoodNum] = {};
                      this.cartFoodList[cartFoodNum].restaurant_id =
                        item.restaurant_id;
                      this.cartFoodList[cartFoodNum].category_id =
                        item.foods[0].category_id;
                      this.cartFoodList[cartFoodNum].item_id = itemid;
                      this.cartFoodList[cartFoodNum].food_id = foodid;
                      this.cartFoodList[cartFoodNum].num = foodItem.num;
                      this.cartFoodList[cartFoodNum].price = foodItem.price;
                      this.cartFoodList[cartFoodNum].name = foodItem.name;
                      this.cartFoodList[cartFoodNum].specs = foodItem.specs;
                      cartFoodNum++;
                    }
                  }
                });
              }
            );
            newArr[index] = num;
          } else {
            newArr[index] = 0;
          }
        }
      });
      this.totalPrice = this.totalPrice.toFixed(2);
      this.categoryNum = [...newArr];
      console.log(this.cartFoodList);
      console.log(this.categoryNum);
    },
    // 获取点运动的起始点
    getStartDotPosition(position) {
      this.startDotPosition = position;
      this.ballFlag = !this.ballFlag;
    },
    // 获取点的结束点位置
    getEndDotPosition(position) {
      this.endDotPosition = position;
    },
    //获取不同类型的评论列表
    async changeTgeIndex(index, name) {
      this.ratingTageIndex = index;
      this.ratingOffset = 0;
      this.ratingTagName = name;
      let res = await getRatingList(this.shopId, this.ratingOffset, name);
      this.ratingList = [...res];
    },
    beforeEnter(el) {
      // 获取小球的 在页面中的位置
      el.style.left = this.startDotPosition.elLeft + "px";
      el.style.top = this.startDotPosition.elTop + "px";
      el.style.transform = "translate(0, 0)";
    },
    //小球动画
    enter(el, done) {
      /**
       * el.offsetWidth语句的作用：这个语句没有实际的作用，但是如果不写的话就无法出现动画的效果，可以认为
       * el.offsetWidth 会强制动画刷新（el.offsetHeight/Left/Right/Top 等也同样有效）
       */
      el.offsetHeight;
      const xDist = this.endDotPosition.elLeft - this.startDotPosition.elLeft;
      const yDist = this.endDotPosition.elTop - this.startDotPosition.elTop;
      el.style.transform = `translate(${xDist}px, ${yDist}px)`;
      el.style.transition = "all 0.5s cubic-bezier(.4,-0.3,1,.68)";
      /**
       * done函数的调用：这里的 done 其实就是我们的 afterEnter 函数，也就是说 done 是 afterEnter
       * 函数的引用。如果没有调用 done 的话，会造成 afterEnter 的延迟
       */
      done();
    },
    afterEnter(el) {
      this.ballFlag = !this.ballFlag;
    },
    goBack() {
      this.$router.go(-1);
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
      height: 120px;
      width: 100%;
      position: relative;
      img {
        height: 100%;
        width: 100%;
        filter: blur(5px);
      }
      span {
        position: absolute;
        z-index: 20;
        top: 10px;
        left: 10px;
        font-size: 20px;
        color: #999;
      }
    }
    .header-middle {
      width: 60px;
      height: 60px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -80%);
      background-color: #000;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .header-bottom {
      padding-top: 30px;
      background-color: #fff;
      .shop-name {
        padding: 0 10px;
        font-size: 20px;
        font-weight: 600;
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
      text-align: center;
      .tab {
        flex: 1;
        margin: 0 20%;
      }
      .active {
        font-weight: 700;
        color: #01a3f8;
        border-bottom: 3px solid #01a3f8;
      }
    }
    .tabs-content {
      height: 92%;
      padding-bottom: 50px;
      border-top: 1px solid #ccc;
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
                position: relative;
                height: 50px;
                padding: 0 10px;
                font-size: 14px;
                line-height: 50px;
                color: #333;
                background-color: #eee;
                .category-num {
                  position: absolute;
                  top: 0;
                  right: 0;
                  width: 20px;
                  line-height: 20px;
                  border-radius: 10px;
                  color: #fff;
                  background-color: red;
                }
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
                .img-container {
                  width: 30%;
                  height: 100px;
                  padding: 5px;
                  position: relative;
                  overflow: hidden;
                  .food-image {
                    width: 100%;
                    height: 76px;
                  }
                  .attributes_ul {
                    li {
                      font-size: 14px;
                      height: 16px;
                      line-height: 16px;
                      padding: 2px;
                      border: 1px solid #666;
                      border-radius: 3px;
                      margin-right: 2px;
                      transform: scale(0.8);
                      p {
                        white-space: nowrap;
                      }
                    }
                    .attribute_new {
                      position: absolute;
                      top: 0;
                      left: 0;
                      background-color: #4cd964;
                      transform:translate(-30px, 10px) rotate(-45deg) ;
                      border: none;
                      border-radius: 0;
                      p {
                        text-align: center;
                        flex: 1;
                        transform: scale(0.8);
                      }
                    }
                  }
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
      .appraise {
        height: 100%;
        overflow: auto;
        background-color: #f5f5f5;
        .rating-container {
          .rating-header {
            display: flex;
            justify-content: space-between;
            height: 100px;
            padding: 20px;
            background-color: #fff;
            .header-left {
              text-align: center;
              p {
                &:first-of-type {
                  font-size: 20px;
                  color: orange;
                }
                &:nth-of-type(2) {
                  color: #666;
                  font-size: 14px;
                }
                &:nth-of-type(3) {
                  color: #999;
                  font-size: 12px;
                }
              }
            }
            .header-right {
              padding-left: 10px;
              font-size: 14px;
              .service-attitude {
                span {
                  color: #666;
                  &:nth-of-type(2) {
                    padding: 0 10px;
                    color: orange;
                  }
                  &:nth-of-type(3) {
                    color: orange;
                  }
                }
              }
              .score {
                span {
                  color: #666;
                  &:nth-of-type(2) {
                    padding: 0 10px;
                    color: orange;
                  }
                  &:nth-of-type(3) {
                    color: orange;
                  }
                }
              }
              .accept-time {
                span {
                  color: #666;
                  &:nth-of-type(2) {
                    padding: 0 10px;
                  }
                }
              }
            }
          }
        }
        .rating-select-category {
          margin-top: 20px;
          padding: 10px;
          font-size: 12px;
          background-color: #fff;
          .tag {
            padding: 10px;
            border-bottom: 1px solid #ccc;
            span {
              display: inline-block;
              margin: 2px 5px;
              padding: 5px;
              color: #666;
              border-radius: 5px;
              background-color: rgba(84, 143, 221, 0.3);
            }
            .active {
              color: #fff;
              background-color: #01a3f8;
            }
          }
          .rating-list {
            .rating-item {
              display: flex;
              padding: 10px;
              .item-left {
                width: 30px;
                margin: 10px;
                img {
                  width: 30px;
                  height: 30px;
                }
              }
              .item-right {
                flex: 1;
                .user-info {
                  display: flex;
                  span {
                    display: inline-block;
                    width: 50%;
                    &:last-of-type {
                      text-align: right;
                    }
                  }
                }
                .user-rating-nmber {
                  span {
                    color: orange;
                  }
                }
                .have-img {
                  img {
                    width: 60px;
                  }
                }
                .food-detail {
                  span {
                    display: inline-block;
                    color: #01a3f8;
                    padding: 3px;
                    margin: 2px 2px 0;
                    background-color: #eee;
                  }
                  span:first-of-type {
                    vertical-align: middle;
                    font-size: 20px;
                    color: #333;
                    background-color: #eee;
                    background-color: #fff;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .ball {
    position: fixed;
    z-index: 200;
    .inner {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: rgb(0, 160, 220);
    }
  }
}
</style>