(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-175ce947"],{"6c47":function(t,e,o){"use strict";o.r(e);var r=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"foods",on:{scroll:t.handleScroll}},[o("v-foods",{staticClass:"food-nav",attrs:{title:t.foodTitle}},[o("header",{staticClass:"food-title",attrs:{slot:"shopTitle"},slot:"shopTitle"},[o("van-icon",{attrs:{name:"arrow-left"},on:{click:t.goback}}),o("span",{staticClass:"nav-list"},[t._v(t._s(t.headTitle))])],1)]),o("v-shoplist",{staticClass:"shoplist",attrs:{loadMoreFlag:t.loadMoreFlag}})],1)},a=[],s=(o("a4d3"),o("4de4"),o("e439"),o("dbb4"),o("b64b"),o("159b"),o("ade3")),n=o("2f62"),c=o("0f29"),i=o("7387");function l(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,r)}return o}function d(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?l(Object(o),!0).forEach((function(e){Object(s["a"])(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):l(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}var h={components:{vFoods:c["a"],vShoplist:i["a"]},data:function(){return{chooseIndex:1,geohash:"",headTitle:"",foodTitle:"",restaurant_category_id:"",loadMoreFlag:0}},computed:d({},Object(n["c"])(["cityInfo"])),mounted:function(){this.initData()},methods:{initData:function(){this.geohash=this.$route.query.geohash,this.headTitle=this.$route.query.title,this.foodTitle=this.headTitle,this.restaurant_category_id=this.$route.query.restaurant_category_id},handleScroll:function(t){var e=t.target.scrollHeight,o=t.target.scrollTop,r=document.body.clientHeight;o+r>=e&&this.loadMoreFlag++},chooseType:function(t){this.chooseIndex=t},goback:function(){this.$router.go(-1)}}},u=h,f=(o("a13d"),o("2877")),p=Object(f["a"])(u,r,a,!1,null,"68ffbdd0",null);e["default"]=p.exports},a13d:function(t,e,o){"use strict";var r=o("c2cc"),a=o.n(r);a.a},c2cc:function(t,e,o){}}]);
//# sourceMappingURL=chunk-175ce947.7f0b4851.js.map