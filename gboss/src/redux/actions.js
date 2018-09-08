/*
 包含所有action creator函数的模块
 */

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
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqMsgList,
  reqReadMsg
} from '../api'
import io from 'socket.io-client';

// 同步错误消息
const errorMsg = (msg) => ({type:ERROR_MSG, data: msg})
// 同步成功响应
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
//同步更新用户
const receiveUser  = (user) => ({type: RECEIVE_USER, data: user})
//同步重置用户
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
//
const receiveUserList = (userList) =>({type:RECEIVE_USER_LIST,data:userList})
// 接收一个消息的同步action
const receiveMsg = (chatMsg,userid) => ({type:RECEIVE_MSG,data:{chatMsg,userid}})
// 接收消息列表的同步action
const receiveMsgList = ({chatMsgs, users, userid}) => ({type: RECEIVE_MSG_LIST, data: {chatMsgs, users, userid}})
// 接收读取了消息的同步action
const msgRead = ({from, to, count}) => ({type: MSG_READ, data: {from, to, count}})


async function getmsgList(dispatch,userid){
  //异步获取当前用户相关聊天列表
  const response = await reqMsgList();
  const result =response.data;
  if(result.code===0)
  {
    const {users, chatMsgs} = result.data;
    dispatch(receiveMsgList({users,chatMsgs,userid}));
  }
}
/*
 异步注册
 */
export function register({name, pwd, pwd2, type}) {
  if (!name || !pwd || !type) {
    return errorMsg('用户名密码必须输入')
  }
  if (pwd !== pwd2) {
    return errorMsg('密码和确认密码不同')
  }
  return async dispatch => {
    const result = await reqRegister({name, pwd, type})
    if (result.code === 0) {
      initIO(result.data._id,dispatch)
      getmsgList(dispatch,result.data._id)
      dispatch(authSuccess(result.data))
    } else {
      dispatch(errorMsg(result.msg))
    }
  }
}

/*
 异步登陆
 */
export const login = ({name, pwd}) => {
  if (!name || !pwd) {
    return errorMsg('用户密码必须输入')
  }
  return async dispatch => {
    const response = await reqLogin({name, pwd})
    const result = response.data
    if (result.code === 0) {
      initIO(result.data._id,dispatch)
      getmsgList(dispatch,result.data._id)
      dispatch(authSuccess(result.data))
    } else {
      dispatch(errorMsg(result.msg))
    }
  }
}
/*
 异步更新用户
 */
export const updateUser = (user) => {
   return async dispatch => {

    const result = await reqUpdateUser(user)

    if (result.code === 0) {
      dispatch(receiveUser(result.data))
    } else {
      dispatch(resetUser(result.msg))
    }
  }
}
/*
 异步获取用户
 */
export const getUser = () => {

  return async dispatch => {
    const response = await reqUser()
    const result = response.data
    if (result.code === 0) {
      initIO(result.data._id,dispatch)
      getmsgList(dispatch,result.data._id)
      dispatch(receiveUser(result.data))
    } else {
      dispatch(resetUser(result.msg))
    }
  }
}
/*
 异步获取用户列表
 */
export const getUserList = (type) =>{
  return async dispatch => {
    const response = await reqUserList(type);
    const result = response.data;
    if(result.code===0){
      dispatch(receiveUserList(result.data));
    }
  }
}

/*
 初始化浏览器端的socketio的函数(在注册/登陆/获取用户信息成功后调用)
 连接服务器端(指定userid参数)
 绑定用来接收服务器发送消息的监听
 */
const initIO=(userid,dispatch) => {
  // 连接服务器
  io.socket = io(`ws://localhost:4001?userid=${userid}`)
  io.socket.on('receiveMsg', (chatMsg) => {
    console.log('浏览器接收到服务器消息', chatMsg)
    dispatch(receiveMsg(chatMsg,userid))
  })
}

// const getMsgList = async (dispatch, userid) => {
//   const response = await reqMsgList()
//   const result = response.data
//   if (result.code === 0) {
//     const {chatMsgs, users} = result.data
//     dispatch(receiveMsgList({chatMsgs, users, userid}))
//   }
// }

export const sendMsg = ({from,to,content})=>{
  return dispatch => {
    io.socket.emit('sendMsg', {from,to,content})
    console.log('浏览器向服务器发消息',{from,to,content} )
  }
}
/*
 异步更新读取消息的action
 */
export const readMsg = (userid) => {
  return async (dispatch, getState) => {
    const response = await reqReadMsg(userid)
    const result = response.data
    if(result.code===0) {
      const count = result.data
      const from = userid
      const to = getState().user._id
      dispatch(msgRead({from, to, count}))
    }
  }
}


