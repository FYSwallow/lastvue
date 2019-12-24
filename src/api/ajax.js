/*
ajax请求函数模块
返回值: promise对象(异步返回的数据是: response.data)
 */
import axios from 'axios'
const BASE_URL = '/api'

export default async function ajax(url, data = {}, type = 'GET') {

	let result
	if (type === 'GET') {
		// 准备url query参数数据
		let dataStr = '' //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&'
		})
		if (dataStr !== '') {
			dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
			url = url + '?' + dataStr
		}
		// 发送get请求
		result = await axios.get(BASE_URL + url)
	} else {
		// 发送post请求
		result = await axios.post(BASE_URL + url, data)
	}
	return result
}

/*
const response = await ajax()
const result = response.data

const resule = await ajax()
 */
