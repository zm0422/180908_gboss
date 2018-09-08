/*
 包含n个根据老的state和action返回新的state的函数的模块
 */
import {combineReducers} from 'redux';
import {getRedirectPath} from '../utils/index.js';

import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  MSG_READ

} from './action-types'

const initUser = {
  name: '', // 用户名
  type: '', // 类型
  msg: '', // 错误提示信息
  redirectTo: '' // 需要自动跳转的路由path
}
// 初始chat对象
const initChat = {
  chatMsgs: [],  // 消息数组 [{from: id1, to: id2}{}]（所有当前用户相关的聊天列表）
  users: {},  // 所有用户的集合对象{id1: user1, id2: user2}（包含所有用户的信息对象）
  unReadCount: 0 // 未读消息的数量
}

const initUserList = [];
function user(state = initUser, action) {

  switch (action.type) {
    case AUTH_SUCCESS: // 认证成功
      const user = action.data
      return {...user, redirectTo: getRedirectPath(user.type,user.avatar)}
    case ERROR_MSG: // 错误信息提示
      return {...state, msg: action.data}
    case RECEIVE_USER: // 接收用户
      return action.data
    case RESET_USER: // 重置用户
      return {...initUser, msg: action.data}
    default:
      return state
  }
}

function userList(state = initUserList, action) {

  switch (action.type) {
    case RECEIVE_USER_LIST: // 查找用户列表成功
      return  action.data
    default:
      return state
  }
}
function chat(state = initChat,action) {
    switch (action.type){
      case RECEIVE_MSG:
       const {chatMsg,userid} = action.data
        return {
          chatMsgs: [...state.chatMsgs, chatMsg],
          users: state.users,//不改变
          unReadCount: state.unReadCount + (!chatMsg.read&&chatMsg.to===userid?1:0)
        }
      case RECEIVE_MSG_LIST:
        var {users,chatMsgs,userid} = action.data;
        return {
          chatMsgs,
          users,//不改变
          unReadCount: chatMsgs.reduce((preTotal,msg)=>{
            return preTotal+(!msg.read&&msg.to===userid ?1:0)
          },0)
        }
        case MSG_READ:
          const {count,from,to} = action.data;
          return {
            chatMsgs: state.chatMsgs.map(msg=>{
              if(msg.from===from&&msg.to===to&&!msg.read.read)
              {
                return {...msg,read:true}
              }
              else{
                return msg
              }
            }),
            users: state.users,//不改变
            unReadCount: state.unReadCount -count
          }
      default:
        return state
    }
}
export default combineReducers({
  user,userList,chat
})
