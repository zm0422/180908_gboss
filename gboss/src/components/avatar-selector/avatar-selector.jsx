import React from 'react'
import {Grid, List} from 'antd-mobile'
import PropTypes from 'prop-types'

class AvatarSelector  extends React.Component {

  static propTypes = {
    setAvatar: PropTypes.func.isRequired
  }
  state = {
    icon:null,
    text:''
  }

  constructor(props) {
    super(props)
    this.avatarList = 'boy,girl,man,woman,bull,chick,crab,hedgehog,hippopotamus,koala,lemur,pig,tiger,whale,zebra'
      .split(',')
      .map(text=>(
        { text,
          icon:require(`../../assets/imgs/${text}.png`)
        })
    )
  }
  selectAvatar = ({icon, text}) => {
    // 更新当前组件的状态
    this.setState({icon})
    // 更新父组件的状态
    this.props.setAvatar(text)
  }
  render () {
    const gridHeader = this.state.icon?(
      <div>
        <span>已选择头像: </span>
        <img style={{width: 20}} src={this.state.icon} alt="avatar"/>
      </div>
    ): '请选择头像'
    return (
      <div>
        <List renderHeader={()=>gridHeader}>
          <Grid
            data={this.avatarList}
            columnNum={5}
            onClick={this.selectAvatar}
          />
        </List>
      </div>
    );
  }
}

export default AvatarSelector ;