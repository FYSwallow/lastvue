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


export const foodMenu = restaurant_id => ajax('/shopping/v2/menu', {
	restaurant_id
})


// 13.获取图片验证码


export const getcaptchas = () => ajax('/v1/captchas', {}, 'POST');


// 14.账号密码登录

export const accountLogin = (username, password, captcha_code) => ajax('/v2/login', { username, password, captcha_code }, 'POST');
