//服务器的入口文件
// 1、创建koa的实例对象
const Koa = require('koa')
const app = new Koa()

// 2、绑定中间件
const respDurationMiddleware = require('./middleware/koa_response_duration')
app.use(respDurationMiddleware)

const respHeaderMiddleware = require('./middleware/koa_response_header')
app.use(respHeaderMiddleware)

const respDataMiddleware = require('./middleware/koa_response_data')
app.use(respDataMiddleware)

app.listen(8888)


const webScoketService = require('./service/web_socket_service')
// 开启服务端的监听，监听客户端的连接
// 当某一个客户端连接成功之后，就会对这个客户端进行message事件的监听
webScoketService.listen()
