import React from 'react'
import PropTypes from 'prop-types'
import {Card, WingBlank, WhiteSpace} from 'antd-mobile'
import  {withRouter} from 'react-router-dom'
import '../../assets/css/index.less'

const Header = Card.Header
const Body = Card.Body

class UserList extends React.Component {
static  propsTypes = {
  userList:PropTypes.array.isRequired
}
  handleClick(userid){
    // this.props.history.push(`/chat/userid=${userid}`)
    this.props.history.push({
      pathname: '/chat',
      query: {
        userid:{userid}
      }
    })
  }
  render () {
    return (
      <div >
        <WingBlank style={{marginTop: 50, marginBottom: 50}}>
          {this.props.userList.map(user =>(
            <div key={user._id}>
              <WhiteSpace/>
              <Card onClick = {() => this.handleClick(user._id)}>
                <Header
                  title={user.title}
                  thumb={user.avatar?require(`../../assets/imgs/${user.avatar}.png`):null}
                  extra={<span>{user.title}</span>}
                />
                <Body>
                {user.company?<div>公司: {user.company}</div>:null}
                {user.desc?<div>描述: {user.desc}</div>:null}
                {user.money?<div>薪资: {user.money}</div>:null}
                </Body>
              </Card>
            </div>
          ))}
         </WingBlank>
      </div>
    );
  }
}
export default withRouter(UserList);