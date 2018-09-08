import React from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

class Msg extends React.Component {

  render () {
    function getLastMsgs(chatMsgs,meId){
      //1.用对象存储（方便查找）每一个聊天的lastMsg {chat_id(分组标识):lastMsg}
      const lastMsgsObj={}
      chatMsgs.forEach(msg =>{
        msg.unReadCount = 0;//初始化
        // 判断当前msg对应的lastMsg是否存在
        const chatId = msg.chat_id
        const lastMsg = lastMsgsObj[chatId]

        if(!lastMsg) {// 不存在
          // 将msg保存为lastMsg
          lastMsgsObj[chatId] = msg
          // 别人发给我的未读消息
          if(!msg.read && meId===msg.to) {
            // 指定msg上的未读数量为1
            msg.unReadCount = 1
          }
        } else {// 存在
          // 如果msg的创建时间晚于lastMsg的创建时间, 替换
          if (msg.create_time>lastMsg.create_time) {
            lastMsgsObj[chatId] = msg
            // 将原有保存的未读数量保存到新的lastMsg
            msg.unReadCount = lastMsg.unReadCount
          }
          // 别人发给我的未读消息
          if(!msg.read && meId===msg.to) {
            // 指定msg上的未读数量为1
            msg.unReadCount++
          }}
      })
      // 2. 得到所有分组的lastMsg组成数组: Object.values(lastMsgsObj)  [lastMsg1, lastMsg2]
      const lastMsgs = Object.values(lastMsgsObj)
      // 3. 对数组排序(create_time, 降序)
      lastMsgs.sort(function (msg1, msg2) {
        return msg2.create_time-msg1.create_time
      })
      return lastMsgs
    }

    const {user,chat} = this.props;
    const {users,chatMsgs} = chat;
    const meId = user._id;
    const lastMsgs = getLastMsgs(chatMsgs,meId); //得到所有人聊天最后一条msg组成数组

    return (
      <List style={{marginTop:50,marginBottom:50}}>
        {

          lastMsgs.map(lastmsg=>{
            const targetId = lastmsg.to===meId?lastmsg.from:lastmsg.to;
            const targetUser = users[targetId];
            const AvatarIcon = targetUser.avatar?require(`../../assets/imgs/${targetUser.avatar}.png`):null
            const userid=targetId
            return  <Item key ={lastmsg._id}
                     extra={<Badge text={lastmsg.unReadCount}/>}
                     thumb={AvatarIcon}
                     arrow='horizontal' onClick={() => this.props.history.push({
                      pathname: '/chat',
                      query: {
                        userid:{userid}
                      }
                    })}
              > {lastmsg.content}
                <Brief>{targetUser.name}</Brief>
              </Item>
          })
        }
      </List>
      );
  }
}

export default connect(
  state=>({user:state.user,chat:state.chat}),
  {}
)(Msg);