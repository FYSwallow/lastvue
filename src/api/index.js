/*
包含n个接口请求函数的模块
 */
import ajax from './ajax'

// 1、获取定位城市
export const reqCurrentPosition = () => ajax('/v1/cities', { type: 'guess' })

// 2、获取详细定位地址
export const reqDetailPosition = () => ajax('/v1/exactaddress')

// 3、获取热门城市
export const reqHotCity = () => ajax('/v1/cities', { type: 'hot' })

// 4、获取所有城市
export const reqCityGroup = () => ajax('/v1/cities', { type: 'group' })

// 5.获取当前城市具体地址
export const currentCity = (number) => ajax('/v1/cities/' + number);

// 6.获取搜索地址
export const searchplace = (cityid, value) => ajax('/v1/pois', {
	type: 'search',
	city_id: cityid,
	keyword: value
});

// 7.获取msite页面食品分类列表
export const msiteFoodTypes = geohash => ajax('/v2/index_entry', {
	geohash,
	group_type: '1',
	'flags[]': 'F'
});


// 8 获取msite商铺列表 

export const shopList = (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', delivery_mode = '', support_ids = []) => {
	let supportStr = '';
	support_ids.forEach(item => {
		if (item.status) {
			supportStr += '&support_ids[]=' + item.id;
		}
	});
	let data = {
		latitude,
		longitude,
		offset,
		limit: '20',
		'extras[]': 'activities',
		keyword: '',
		restaurant_category_id,
		'restaurant_category_ids[]': restaurant_category_ids,
		order_by,
		'delivery_mode[]': delivery_mode + supportStr
	};
	return ajax('/shopping/restaurants', data);
};

// 9.获取食物category种类
export const foodCategory = (latitude, longitude) => ajax('/shopping/v2/restaurant/category', {
	latitude,
	longitude
});

// 10.获取food页面的配送方式
export const foodDelivery = (latitude, longitude) => ajax('/shopping/v1/restaurants/delivery_modes', {
	latitude,
	longitude,
	kw: ''
});

// 11.获取food页面的商家属性活动列表
export const foodActivity = (latitude, longitude) => ajax('/shopping/v1/restaurants/activity_attributes', {
	latitude,
	longitude,
	kw: ''
});


// 12.获取shop页面菜单列表


export const foodMenu = () => ajax('/shopping/v2/menu', {
	restaurant_id: 1
})


// 13.获取图片验证码


export const getcaptchas = () => ajax('/v1/captchas', {}, 'POST');


// 14.账号密码登录

export const accountLogin = (username, password, captcha_code) => ajax('/v2/login', { username, password, captcha_code }, 'POST');

// 15. 获取用户信息

export const reqUserInfo = () => ajax('/v1/user');

// 16. 添加用户收货地址

export const addUserAddress = (addressDetail) => ajax(`/v1/users/${addressDetail.user_id}/addresses`, addressDetail, 'POST');

// 16. 获取收货地址列表

export const reqUserAddressList = (user_id) => ajax(`/v1/users/${user_id}/addresses`);

// 17. 获取收货地址详情

export const reqUserAddress = (address_id) => ajax(`/v1/addresse/${address_id}`);

// 18. 修改收货地址

export const editUserAddress = (addressDetail, address_id) => ajax(`/v1/editAddresse/${address_id}`, addressDetail, 'POST');


// 19.修改用户名

export const setUserName = (username) => ajax('/v1/users/12/username', { username }, 'POST')

// 20.修改用户密码

export const changePassword = (passwordInfo) => ajax('/v2/changepassword', passwordInfo, 'POST')

// 21.确认订单
export const checkout = (geohash, entities, shopid) => ajax('/v1/carts/checkout', {
	come_from: "web",
	geohash,
	entities,
	restaurant_id: shopid,
}, 'POST');

// 22.下订单
export const placeOrders = (user_id, cart_id, address_id, description, entities, geohash, sig) => ajax('/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
	address_id,
	come_from: "mobile_web",
	deliver_time: "",
	description,
	entities,
	geohash,
	paymethod_id: 1,
	sig,
}, 'POST');

// 23.获取订单列表
export const getOrderList = (user_id, offset) => ajax('/bos/v2/users/' + user_id + '/orders', {
	limit: 10,
	offset,
});

// 24.获取商铺评价列表
 

export const getRatingList = (shopid, offset, tag_name = '') => ajax('/ugc/v2/restaurants/' + shopid + '/ratings', {
	has_content: true,
	offset,
	limit: 10,
	tag_name
});


// 25.获取商铺评价分数


export const ratingScores = shopid => ajax('/ugc/v2/restaurants/' + shopid + '/ratings/scores');



// 26.获取商铺评价分类


export const ratingTags = shopid => ajax('/ugc/v2/restaurants/' + shopid + '/ratings/tags');

// 27.获取商铺详情

export const shopDetails = (shopid, latitude, longitude) => ajax('/shopping/restaurant/' + shopid, {
	latitude,
	longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
});

// 28.搜索商店
export const searchRestaurant = (geohash, keyword) => ajax('/v4/restaurants', {
	'extras[]': 'restaurant_activity',
	geohash,
	keyword,
	type: 'search'
});
