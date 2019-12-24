/*
包含n个接口请求函数的模块
 */
import ajax from './ajax'

// 1、获取定位城市
export const reqCurrentPosition = () => ajax('/v1/cities', {type : 'guess'})

// 2、获取热门城市
export const reqHotCity = () => ajax('/v1/cities', {type : 'hot'})

// 3、获取所有城市
export const reqCityGroup = () => ajax('/v1/cities', {type : 'group'})

// 4.获取当前城市具体地址
export const currentCity = (number) => ajax('/v1/cities/' + number);

 // 5.获取搜索地址
export const searchplace = (cityid, value) => ajax('/v1/pois', {
	type: 'search',
	city_id: cityid,
	keyword: value
});

// 6.获取msite页面食品分类列表
export const msiteFoodTypes = geohash => ajax('/v2/index_entry', {
	geohash,
	group_type: '1',
	'flags[]': 'F'
});


// 7 获取msite商铺列表 

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

// 8.获取食物category种类
export const foodCategory = (latitude, longitude) => ajax('/shopping/v2/restaurant/category', {
	latitude,
	longitude
});