import React from 'react';
import {Switch,Route,Redirect} from 'react-router-dom'
import "../../assets/css/index.less"
import cookies from 'browser-cookies'
import {NavBar} from 'antd-mobile'
import {connect} from 'react-redux'
import {getUser} from '../../redux/actions'

import BossInfo from '../boss-info/boss-info'
import GeniusInfo from '../genius-info/genius-info'
import Genius from '../genius/genius'
import Boss from '../boss/boss'
import Msg from '../msg/msg'
import User from '../user/user'
import Chat from '../chat/chat'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import {getRedirectPath} from '../../utils'

import '../../test/ioTest'
class Dashboard extends React.Component {
  // 给组件对象添加navList属性: this.navList获取
  navList = [
    {
      path: '/boss', // 路由路径
      component: Boss,
      title: '牛人列表',
      icon: 'job',
      text: '牛人',
    },
    {
      path: '/genius', // 路由路径
      component: Genius,
      title: 'BOSS列表',
      icon: 'boss',
      text: 'BOSS',
    },
    {
      path: '/msg', // 路由路径
      component: Msg,
      title: '消息列表',
      icon: 'msg',
      text: '消息',
    },
    {
      path: '/me', // 路由路径
      component: User,
      title: '个人中心',
      icon: 'user',
      text: '我',
    }
  ]
  componentDidMount () {
    const userid = cookies.get('userid')

    if(!userid) {
      this.props.history.replace('/login')
      return null
    }
  }
  render () {
    // 如果浏览器中没有保存userid的cookie, 直接跳转到login
    // 得到当前请求的path
    const pathname = this.props.location.pathname
    // 判断用户是否已登陆(过)(cookie中userid是否有值)
    const userid = cookies.get('userid')
    if(!userid) { // 如果没值, 自动跳转到登陆界面
      return <Redirect to='/login'/>
    }

    const {user} = this.props
    if(!user._id) {
      return null  // 不做任何显示
    } else {
      // 请求根路径时, 自动 跳转到对应的用户主界面
      if(pathname==='/') {
        const path = getRedirectPath(user.type, user.avatar)
        return <Redirect to={path}/>
      }

      // 指定哪个nav应该被隐藏
      if(user.type==='boss') {
        this.navList[1].hide = true
      } else {
        this.navList[0].hide = true
      }
    }
    // 得到当前的nav
    const currentNav = this.navList.find(nav=>nav.path===pathname)
    // 得到props中的unReadCount
    const unReadCount = this.props.unReadCount

    return (
      <div>
        {currentNav?<NavBar className='stick-top'>{currentNav.title}</NavBar>:null}
        <Switch>
          <Route path='/bossinfo' component={BossInfo}/>
          <Route path='/geniusinfo' component={GeniusInfo}/>
          <Route path='/genius' component={Genius}></Route>
          <Route path='/boss' component={Boss}></Route>
          <Route path='/msg' component={Msg}></Route>
          <Route path='/me' component={User}></Route>
          <Route path='/chat' component={Chat}></Route>
          <Route component={NotFound}></Route>
        </Switch>
        {currentNav?<NavFooter className="am-tab-bar" navList={this.navList} unReadCount={unReadCount}/>:null}
      </div>
    );
  }
}


export default connect(
  state=>({user:state.user, unReadCount: state.chat.unReadCount}),
  {getUser}
)(Dashboard);