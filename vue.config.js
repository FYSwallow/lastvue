module.exports = {
    publicPath: './', //发布路径,用相对路径，不然会报错
    lintOnSave: false, //是否开启eslint校验
    devServer: {
        host:"0.0.0.0",
        proxy: { //配置代理，解决跨域请求后台数据的问题
            '/api': { // 匹配所有以 '/api'开头的请求路径
                target: 'http://cangdu.org:8001', //后台接口
                // target: 'http://localhost:8001', //后台接口
                ws: true, //是否跨域
                changeOrigin: true, // 支持跨域
                pathRewrite: {// 重写路径: 去掉路径中开头的'/api'
                    '^/api': ''
                }
            }
        }
    }
}