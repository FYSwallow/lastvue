(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-9c2fd8c4"],{"046e":function(t,e,s){"use strict";var a=s("7e6a"),r=s.n(a);r.a},"7e6a":function(t,e,s){},"8ebf":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"add-address"},[s("div",{staticClass:"form-container"},[s("form",{attrs:{action:""}},[s("ul",[s("li",[s("span",{staticClass:"tag-title"},[t._v("联系人")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],attrs:{type:"text",placeholder:"姓名"},domProps:{value:t.name},on:{input:function(e){e.target.composing||(t.name=e.target.value)}}})]),s("li",[s("span",{staticClass:"tag-title"},[t._v("性别")]),s("div",{staticClass:"tag-list"},t._l(t.tagAttr[0],(function(e,a){return s("span",{key:a,class:{active:t.sex==a+1},on:{click:function(e){return t.chooseSex(a)}}},[t._v(t._s(e))])})),0)]),s("li",[s("span",{staticClass:"tag-title"},[t._v("电话")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.phone,expression:"phone"}],attrs:{type:"text",placeholder:"手机号码"},domProps:{value:t.phone},on:{input:function(e){e.target.composing||(t.phone=e.target.value)}}})]),s("li",[s("span",{staticClass:"tag-title"},[t._v("地址")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.address,expression:"address"}],attrs:{type:"text",placeholder:"选择收货地址"},domProps:{value:t.address},on:{input:function(e){e.target.composing||(t.address=e.target.value)}}}),s("div",{staticClass:"choose-address",on:{click:t.goGetAddress}})]),s("li",[s("span",{staticClass:"tag-title"},[t._v("门牌号")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.address_detail,expression:"address_detail"}],attrs:{type:"text",placeholder:"例: 5号楼203房间"},domProps:{value:t.address_detail},on:{input:function(e){e.target.composing||(t.address_detail=e.target.value)}}})]),s("li",[s("span",{staticClass:"tag-title"},[t._v("标签")]),s("div",{staticClass:"tag-list"},t._l(t.tagAttr[1],(function(e,a){return s("span",{key:a,class:{active:t.tag_type==a+3},on:{click:function(s){return t.chooseTag(e,a)}}},[t._v(t._s(e))])})),0)])]),t.status?s("button",{staticClass:"button-add",attrs:{type:"submit"},on:{click:function(e){return e.preventDefault(),t.saveAddress(e)}}},[t._v("保存")]):s("div",{staticClass:"button-edit"},[s("button",{staticClass:"button-delete",attrs:{type:"submit"},on:{click:function(e){return e.preventDefault(),t.abandon(e)}}},[t._v("放弃")]),s("button",{staticClass:"button-change",attrs:{type:"submit"},on:{click:function(e){return e.preventDefault(),t.saveAddress(e)}}},[t._v("保存并使用")])])])])])},r=[],n=(s("a4d3"),s("4de4"),s("b0c0"),s("e439"),s("dbb4"),s("b64b"),s("159b"),s("96cf"),s("1da1")),i=s("ade3"),o=s("2f62"),d=s("365c");function c(t,e){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),s.push.apply(s,a)}return s}function u(t){for(var e=1;e<arguments.length;e++){var s=null!=arguments[e]?arguments[e]:{};e%2?c(Object(s),!0).forEach((function(e){Object(i["a"])(t,e,s[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):c(Object(s)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(s,e))}))}return t}var l={data:function(){return{name:"",phone:"",address:"",address_detail:"",sex:"",tagAttr:[["男","女"],["家","学校","公司"]],tag_type:0,tag:"",status:!0}},computed:u({},Object(o["c"])(["userInfo","cityInfo","addressDetail"])),watch:{addressDetail:function(t){this.address=t.address.address}},created:function(){this.$route.query.address_id&&(this.$route.meta.title="编辑地址")},mounted:function(){this.initData()},methods:u({},Object(o["b"])(["getFoodAddress"]),{initData:function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(){var e,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e=this.$route.query.address_id,console.log(this.$route.query),this.userInfo.user_id,!e){t.next=15;break}return this.status=!1,t.next=7,Object(d["s"])(e);case 7:s=t.sent,this.name=s.data.name,this.phone=s.data.phone,this.address=s.data.address,this.address_detail=s.data.address_detail,this.sex=s.data.sex,this.tag_type=s.data.tag_type,this.tag=s.data.tag;case 15:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),goGetAddress:function(){this.$router.push("/user/detailAddress")},chooseSex:function(t){this.sex=t+1},chooseTag:function(t,e){this.tag=t,this.tag_type=e+3},saveAddress:function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(){var e,s,a,r,n,i,o,c;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(console.log(this.userInfo),e=this.userInfo.user_id,s={user_id:e,address:this.address,address_detail:this.address_detail,name:this.name,phone:this.phone,sex:this.sex,tag_type:this.tag_type,tag:this.tag},!this.status){t.next=12;break}return a=this.addressDetail.address,r=a.latitude,n=a.longitude,i=r+","+n,o=Object.assign({},s,{geohash:i}),t.next=9,Object(d["b"])(o,e);case 9:this.$router.push("/user/editAddress"),t.next=16;break;case 12:return c=this.$route.query.address_id,t.next=15,Object(d["e"])(s,c);case 15:t.sent;case 16:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),abandon:function(){this.$router.push("/user/editAddress")}})},p=l,h=(s("046e"),s("2877")),f=Object(h["a"])(p,a,r,!1,null,"21fc06b4",null);e["default"]=f.exports}}]);
//# sourceMappingURL=chunk-9c2fd8c4.02ba562a.js.map