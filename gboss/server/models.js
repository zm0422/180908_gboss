/*
 包含n个能操作mongodb数据库集合的model的模块
 1. 连接数据库
 1.1. 引入mongoose
 1.2. 连接指定数据库(URL只有数据库是变化的)
 1.3. 获取连接对象
 1.4. 绑定连接完成的监听(用来提示连接成功)
 2. 定义对应特定集合的Model
 2.1. 字义Schema(描述文档结构)
 2.2. 定义Model(与集合对应, 可以操作集合)
 3. 向外暴露获取Model的方法
 */
// 1. 连接数据库
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/gboss')
const conn = mongoose.connection
conn.on('connected', function () {
  console.log('数据库连接成功!')
})

// 2. 得到对应特定集合的Model: UserModel
const userSchema = mongoose.Schema({
  // 用户名
  'name': {type: String, required: true},
  // 密码
  'pwd': {type: String, required: true},
  // 类型
  'type': {'type': String, required: true},
  // 头像
  'avatar': {'type': String},
  // 个人简介或者职位简介
  'desc': {'type': String},
  // 职位名
  'title': {'type': String},
  // 如果你是boss 还有两个字段
  // 公司名称
  'company': {'type': String},
  // 工资
  'money': {'type': String}
})
mongoose.model('user', userSchema)

// 定义chats集合的文档结构
const chatSchema = mongoose.Schema({
  from: {type: String, required: true}, // 发送用户的id
  to: {type: String, required: true}, // 接收用户的id
  chat_id: {type: String, required: true}, // from_to组成字符串
  content: {type: String, required: true}, // 内容
  read: {type:Boolean, default: false}, // 标识是否已读
  create_time: {type: Number} // 创建时间
})
// 定义能操作chats集合数据的Model
mongoose.model('chat', chatSchema)

// 3. 向外暴露
module.exports = {
  getModel(name) {
    return mongoose.model(name)
  }
}
