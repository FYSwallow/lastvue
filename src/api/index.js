/*
包含n个接口请求函数的模块
 */
import ajax from './ajax'

// 1、获取定位城市
export const reqCurrentPosition = () => ajax('/position/cities', { type: 'guess' })

// 2、获取详细定位地址
export const reqDetailPosition = () => ajax('/position/exactaddress')

// 3、获取热门城市
export const reqHotCity = () => ajax('/position/cities', { type: 'hot' })

// 4、获取所有城市
export const reqCityGroup = () => ajax('/position/cities', { type: 'group' })

// 5.获取当前城市具体地址
export const currentCity = (number) => ajax('/position/cities/' + number);

// 6.获取搜索地址
export const searchplace = (cityid, value) => ajax('/position/search', {
	type: 'search',
	city_id: cityid,
	keyword: value
});

// 7.获取msite页面食品分类列表
export const msiteFoodTypes = geohash => ajax('/category/shopCategory', {
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
	return ajax('/shopping/restaurantsList', data);
};

// 9.获取食物category种类
export const shopCategory = (latitude, longitude) => ajax('/shopping/getCategories', {
	latitude,
	longitude
});

// 10.获取food页面的配送方式
export const foodDelivery = (latitude, longitude) => ajax('/shopping/delivery', {
	latitude,
	longitude,
	kw: ''
});

// 11.获取food页面的商家属性活动列表
export const foodActivity = (latitude, longitude) => ajax('/shopping/activity', {
	latitude,
	longitude,
	kw: ''
});


// 12.获取shop页面菜单列表


export const foodMenu = (id=1) => ajax('/shopping/getMenu', {
	restaurant_id: id
})


// 13.获取图片验证码


export const getcaptchas = () => ajax('/users/captchas');


// 14.账号密码登录

export const accountLogin = (username, password, captcha_code) => ajax('/users/login', { username, password, captcha_code }, 'POST');

// 15. 获取用户信息

export const reqUserInfo = () => ajax('/users/userInfo');

// 16. 添加用户收货地址

export const addUserAddress = (addressDetail, id) => ajax(`/users/address/${id}`, addressDetail, 'POST');

// 16. 获取收货地址列表

export const reqUserAddressList = (user_id) => ajax(`/users/addressList/${user_id}`);

// 17. 获取收货地址详情

export const reqUserAddress = (address_id) => ajax(`/users/addressDetail/${address_id}`);

// 18. 修改收货地址

export const editUserAddress = (addressDetail, address_id) => ajax(`/users/addressUpdate/${address_id}`, addressDetail, 'POST');


// 19.修改用户名

export const setUserName = (username, id) => ajax(`/users/update/username/${id}`, { username }, 'POST')

// 20.修改用户密码

export const changePassword = (passwordInfo) => ajax(`/users/changepassword`, passwordInfo, 'POST')

// 21.确认订单
export const checkout = (geohash, entities, shopid) => ajax('/shopping/checkout', {
	come_from: "web",
	geohash,
	entities,
	restaurant_id: shopid,
}, 'POST');

// 22.下订单
export const placeOrders = (user_id, cart_id, address_id, description, entities, geohash, sig) => ajax(`/shopping/postOrder/${cart_id}/${user_id}`, {
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
export const getOrderList = (user_id, offset) => ajax('/shopping/orders/' + user_id, {
	limit: 10,
	offset,
});

// 24.获取商铺评价列表
 

export const getRatingList = (shopid, offset, tag_name = '') => ajax('/shopping/ratings/' + shopid, {
	has_content: true,
	offset,
	limit: 10,
	tag_name
});


// 25.获取商铺评价分数


export const ratingScores = shopid => ajax('/shopping/ratingScroes/' + shopid);



// 26.获取商铺评价分类


export const ratingTags = shopid => ajax('/shopping/ratingTags/' + shopid);

// 27.获取商铺详情

export const shopDetails = (shopid, latitude, longitude) => ajax('/shopping/restaurantDetail/' + shopid, {
	latitude,
	longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
});

// 28.搜索商店
export const searchRestaurant = (geohash, keyword) => ajax('/shopping/searchRestaurants', {
	'extras[]': 'restaurant_activity',
	geohash,
	keyword,
	type: 'search'
});
