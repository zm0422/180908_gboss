import React from 'react'
import PropTypes from 'prop-types'
import {TabBar} from 'antd-mobile'
import {withRouter} from 'react-router-dom'
import "../../assets/css/index.less"

const Item = TabBar.Item

class NavFooter extends React.Component {
  static propTypes = {
    navList: PropTypes.array.isRequired,
    unReadCount: PropTypes.number.isRequired
  }
  render () {
    const navList = this.props.navList.filter(nav=>!nav.hide);
    const {pathname} = this.props.location;
    return (
      <div  >
        <TabBar >
          {navList.map(nav=> (
             <Item key = {nav.path}
                   badge={nav.path === '/msg' ? this.props.unReadCount : 0}
                  title = {nav.text}
                  icon = {{uri:require(`./imgs/${nav.icon}.png`)}}
                  selectedIcon = {{uri:require(`./imgs/${nav.icon}-active.png`)}}
                  selected = {pathname===nav.path}
                  onPress = {()=>{this.props.history.replace(nav.path)
                  } }/>
            ))
          }
        </TabBar>
      </div>
    );
  }
}

export default withRouter(NavFooter);
