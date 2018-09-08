import React from 'react'
import '../../assets/css/index.less'
import {connect} from 'react-redux'
import {sendMsg,readMsg} from '../../redux/actions'
import {NavBar, List, InputItem, Icon, Grid} from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'

const Item = List.Item

class Chat extends React.Component {

  state = {
    content:'',
    isShow:false
  }
  handleChange = content=>{
    this.setState({content})
  }
  send = ()=>{
    const content = this.state.content.trim();
    if(content){
      const from = this.props.user._id;
      //const to = this.props.match.params.userid;
      const to = this.props.location.query.userid.userid;
      console.log('from:'+from,'to:'+to)
      this.props.sendMsg({from,to,content})
    }
    this.setState({content: '', isShow: false})
  }
  componentWillMount(){
    const emojis = [
      '😄', '😅', '😉','😅', '😉','😅', '😉','😉',
      '😄', '😅', '😉','😅', '😉','😅', '😉','😉',
      '😄', '😅', '😉','😅', '😉','😅', '😉','😉',
      '😄', '😅', '😉','😅', '😉','😅', '😉','😉',
      '😄', '😅', '😉','😅', '😉','😅', '😉','😉',
      '😄', '😅', '😉','😅', '😉','😅', '😉','😉',
      '😄', '😅', '😉','😅', '😉','😅', '😉','😉']
    this.emojis = emojis.map(text => ({text}))
   // emojis.map(text=>({text}));//数组内部对象有text属性
  }
  componentDidMount(){
    // 初始显示列表
    window.scrollTo(0, document.body.scrollHeight);//DOM就有的方法
  }
  componentWillUnmount () {
    // 请求标识当前消息已读
    const from = this.props.location.query.userid.userid
    this.props.readMsg(from)
  }
  componentDidUpdate () {
    // 更新显示列表
    window.scrollTo(0, document.body.scrollHeight);
  }
  toggleShow = () =>{
    const isShow = !this.state.isShow;
    this.setState({isShow})

    if(isShow) {
      // 异步手动派发resize事件,解决表情列表显示的bug
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    }
  }
  render () {
    const {user} = this.props;
    const meId = user._id;
    const {users,chatMsgs} = this.props.chat;
    const targetId = this.props.location.query.userid.userid;

    const chat_id = [targetId,meId].sort().join('_');
    const msgs = chatMsgs.filter(msg=>msg.chat_id===chat_id)

    if(!users[user._id]) { // 当没有数据时, 不做任何显示
      return null
    }
    const targetAvatar = users[targetId].avatar;
    const targetIcon = targetAvatar?require(`../../assets/imgs/${targetAvatar}.png`):null;
    const meAvatar = users[meId].avatar;
    const meIcon = meAvatar?require(`../../assets/imgs/${meAvatar}.png`):null;

    return (
      <div id='chat-page'>
        <NavBar className='.stick-top' icon={<Icon type='left'/>}
        onLeftClick={()=>this.props.history.goBack()}
        >{users[targetId].name}</NavBar>
        <List style={{marginTop:30, marginBottom: 50}}>
          <QueueAnim type='left'>
          {msgs.map(msg=>{
            if(msg.to===meId){
              return(
                <Item key={msg._id}
                      thumb={targetIcon}
                > {msg.content}
                </Item>
              )
            }else{
              return(
                <Item key={msg._id}
                      className='chat-me'
                      extra={<img src={meIcon} alt='no avatar'/>}
                > {msg.content}
                </Item>
              )
            }
          })  }
          </QueueAnim>
          </List>
        <div className='am-tab-bar2'>
          <InputItem value={this.state.content}
                     onChange={value =>this.handleChange(value)}
                     onFocus={()=>this.setState({isShow:false})}
            placeholder="请输入"
            extra={
              <div>
                 <span onClick={this.toggleShow}>😊</span>
                 <span onClick={this.send}>发送</span>
              </div>
            }
          />
          {
            this.state.isShow ? (
              <Grid data = {this.emojis}
                    columnNum={8}
                    carouselMaxRow={4}
                    isCarousel={true}
                    onClick = {item => this.setState({content:this.state.content+item.text})}
              />):null
          }
        </div>
      </div>
    );
  }
}
export default connect(
  state=>({
    user: state.user,
    chat: state.chat
  }),
  {sendMsg,readMsg}
)(Chat);