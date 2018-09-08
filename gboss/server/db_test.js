const  mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/gboss');

const  conn = mongoose.connection;

conn.on('connected',function () {
  console.log('连接成功');
})
const userSchema = mongoose.Schema({
  'name':{type:String,'require':true},
  // 密码
  'pwd': {type: String, 'required': true},
  // 类型
  'type': {'type': String, 'required': true},
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
//const  UserModel= mongoose.model('use',userSchema)
mongoose.model('student',userSchema);
const  UserModel= mongoose.model('student');

function testSave(){
  const userModel = new UserModel({
    name: 'Tony',
    pwd: '123',
    type: 'genius',
    avatar: 'boy'
  })
  userModel.save(function (err,user) {
    console.log('save()',user,err);
  })
}
//testSave();
function testFind() {
  UserModel.find(function (err, users) { // 如果没有匹配的, 返回[]
    console.log('find()', err, users)
  })

  UserModel.findOne({_id: '5af24c06c2d8e81b28d05e13'}, function (err, user) { // 如果没有匹配的, 返回null
    console.log('findOne()', err, user)
  })
}

 //testFind()
function testUpdate() {
  UserModel.findByIdAndUpdate({_id: '5af24c06c2d8e81b28d05e13'}, {name: 'BB'}, function (err, user) {
    console.log('findByIdAndUpdate()', err, user)
  })
}
// testUpdate()

function testRemove() {
  UserModel.remove({_id: '5af24c06c2d8e81b28d05e13'}, function (err, result) {
    console.log('remove()', err, result) // { ok: 1, n: 1 }
  })
}
 //testRemove()
/////////////////////////////////////////////////////////////
const chatSchema = mongoose.Schema({
  from: {type: String, required: true}, // 发送用户的id
  to: {type: String, required: true}, // 接收用户的id
  chat_id: {type: String, required: true}, // from_to组成字符串
  content: {type: String, required: true}, // 内容
  read: {type:Boolean, default: false}, // 标识是否已读
  create_time: {type: Number} // 创建时间
})
mongoose.model('chat',chatSchema);
const  ChatModel= mongoose.model('chat');

function testSave() {
  // chat
  const chatModel = new ChatModel({
    from: 'pet',
    to: 'lili',
    chat: 'genius',
    chat_id: 'lili_pet',
    content:'hi morning',
    read:false,
    create_time:Date.now()
  })

  chatModel.save(function (err, chat) {
    console.log('save', err, chat)
  })
}

testSave()

