import React from 'react'
import {updateUser} from '../../redux/actions'
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import AvatarSelector from '../../components/avatar-selector/avatar-selector'
import {Redirect} from 'react-router-dom'

class GeniusInfo extends React.Component {
  state = {
    // 头像
    avatar: '',
    // 个人简介
    desc: '',
    // 求职岗位
    title: '',
  }
  handleChange(name,val){
    this.setState({[name]:val})
  }
  setAvatar=(avatar)=>{
    this.setState({avatar})
  }
  render () {
    const {user} = this.props
    // 如果用户信息已完善, 自动跳转到牛人主界面
    if(user.avatar) {
      return <Redirect to='/genius'/>
    }

    return (
      <div>
        <NavBar>牛人信息完善</NavBar>
        <AvatarSelector setAvatar={this.setAvatar}/>
        <InputItem onChange={val => this.handleChange('title', val)}>求职岗位:</InputItem>
        <TextareaItem title="个人简介:"
                      rows={3}
                      onChange={val => this.handleChange('desc', val)}/>

        <Button type='primary' onClick={() => this.props.updateUser(this.state)}>保存</Button>
      </div>
    );
  }
}

export default connect(
  state => ({user: state.user}),
  {updateUser}
)(GeniusInfo)