// 1. 引入express
const express =require('express');
const bodyParser = require('body-parser') // 解析请求体
const cookieParser = require('cookie-parser')
// 引入应用的路由器
const appRouter = require('./appRouter')
// 2. 生成应用对象(执行express函数)
const app = express();

// 得到服务器对象
const server = require('http').Server(app)
// 得到IO对象
const io = require('socket.io')(server)
const sockets = {} //用来缓存所有与客户端连接socket
const ChatModel = require('./models').getModel('chat')

// 监视连接(当有一个客户连接上时回调)
io.on('connection', function(socket) {//socket代表服务器与客户端连接
  console.log('soketio connected')
  // 得到连接url中包含的参数userid
  const userid = socket.handshake.query.userid
  // 如果userid不存在, 不做任何处理, 直接结束
  if(!userid) {
    return
  }
  // 如果缓存中已存在, 移除, 断开连接
  const savedSocket = sockets[userid]
  if(savedSocket) {
    delete sockets[userid]
    savedSocket.disconnect()
  }
  // 将新的连接缓存起来
  sockets[userid] = socket

  console.log('sockets', Object.keys(sockets))

  // 绑定sendMsg监听, 接收客户端发送的消息
   socket.on('sendMsg', function({from, to, content}) {
    console.log('服务器接收到数据', {from, to, content})
     // 1.将接收到的消息保存到数据库
    const chat_id = [from, to].sort().join('_')
    const create_time = Date.now()
    const chatModel = new ChatModel({chat_id, from, to, create_time, content})
    chatModel.save(function (err, chatMsg) {
      // // 保存完成后, 向所有连接的客户端发送消息
      // io.emit('receiveMessage', chatMsg) // 全局发送, 所有连接的客户端都可以收到
      // console.log('向所有连接的客户端发送消息', chatMsg)
      //保存完成后, 向from和to对应的客户端分发receiveMsg消息
      sockets[from] && sockets[from].emit('receiveMsg', chatMsg)
      sockets[to] && sockets[to].emit('receiveMsg', chatMsg)
    })
  })
})

/*//注册根路由
app.use("/",function (req,res) {
  res.send('hello server11111');
})*/
app.use(cookieParser()) // 解析cookie数据
app.use(bodyParser.json()) // 解析请求体(ajax请求: json数据格式)
app.use(bodyParser.urlencoded({ extended: false })) // 解析请求体(表单数据)
//注册路由
app.use('/api',appRouter);//路由器映射在虚拟路径上



// 4. 启动服务器(使用app监听指定端口)
/*
app.listen('4001', function () {
  console.log('server start on 4001');
})
*/
// 启动服务器监听
server.listen(4001, () => {
  console.log('服务器启动成功 port: 4001')
})


