const path = require('path')
const fileUtils = require('../utils/file_utils')
const WebSocket = require('ws')
// 创建WebSocket服务器的对象， 绑定的端口号是9998
const wss = new WebSocket.Server({
    port: 9998
})

// 服务端开启了监听
module.exports.listen = () => {
    wss.on('connection', client => {
        console.log('有客户端连接成功了')
        // 对客户端的连接对象进行message事件的监听
        // msg：由客户端发送给服务器的数据
        client.on('message', async msg => {
            console.log('客户端发送数据给服务端了' + msg)

            let payload = JSON.parse(msg)
            const action = payload.action

            // console.log(payload)

            if (action === 'getData') {
                let filePath = '../data/' + payload.chartName + '.json'              
                // payload.chartName
                filePath = path.join(__dirname, filePath)
                // console.log(filePath)
                const ret = await fileUtils.getFileJsonData(filePath)

                // 需要在服务端获取到数据的基础之上， 增加一份data的字段
                payload.data = ret
                client.send(JSON.stringify(payload))
            } else {
                // 原封不动 的将所接收到的数据转发给每一个处于连接状态的客户端
                wss.clients.forEach(client => {
                    client.send(msg)
                })
            }

            // 有服务器往客户端发送数据
            // client.send('hello socket from backend')
        })
    })
    
}
