"use strict";

var path = require('path');

var fileUtils = require('../utils/file_utils');

var WebSocket = require('ws'); // 创建WebSocket服务器的对象， 绑定的端口号是9998


var wss = new WebSocket.Server({
  port: 9998
}); // 服务端开启了监听

module.exports.listen = function () {
  wss.on('connection', function (client) {
    console.log('有客户端连接成功了'); // 对客户端的连接对象进行message事件的监听
    // msg：由客户端发送给服务器的数据

    client.on('message', function _callee(msg) {
      var payload, action, filePath, ret;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log('客户端发送数据给服务端了' + msg);
              payload = JSON.parse(msg);
              action = payload.action; // console.log(payload)

              if (!(action === 'getData')) {
                _context.next = 13;
                break;
              }

              filePath = '../data/' + payload.chartName + '.json'; // payload.chartName

              filePath = path.join(__dirname, filePath); // console.log(filePath)

              _context.next = 8;
              return regeneratorRuntime.awrap(fileUtils.getFileJsonData(filePath));

            case 8:
              ret = _context.sent;
              // 需要在服务端获取到数据的基础之上， 增加一份data的字段
              payload.data = ret;
              client.send(JSON.stringify(payload));
              _context.next = 14;
              break;

            case 13:
              // 原封不动 的将所接收到的数据转发给每一个处于连接状态的客户端
              wss.clients.forEach(function (client) {
                client.send(msg);
              });

            case 14:
            case "end":
              return _context.stop();
          }
        }
      });
    });
  });
};