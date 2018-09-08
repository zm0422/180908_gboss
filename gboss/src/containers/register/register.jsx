import React from 'react';
import {List, WingBlank, InputItem, Radio, WhiteSpace, Button,NavBar} from 'antd-mobile';
import Logo from '../../components/logo/logo';
import '../../assets/css/index.less';

import {connect} from 'react-redux';
import {register} from '../../redux/actions';
import {Redirect} from 'react-router-dom';

const RadioItem = Radio.RadioItem;
class Register extends React.Component {
  /*constructor(props) {
    super(props);
    this.state={
      name:'',
      pwd:'',
      pwd2:'',
      type:'boss'
    }
  }*/
  state={
    name:'',
    pwd:'',
    pwd2:'',
    type:'boss'
  }
  goLogin=()=>{
    this.props.history.replace('./login');
  }
   handleChange=(key,val)=>{
    this.setState({[key]:val});
  }
  handleRegister=()=>{
    this.props.register(this.state);
  }
  render () {
    const {user} = this.props;
    if(user.redirectTo)
      {
        console.log(131474,user.redirectTo)
        return <Redirect to = {user.redirectTo}/>}
    return (
      <div>
          <NavBar>招 聘 信 息</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            {user.msg?<p className="error-msg">{user.msg}</p> : ''}
            <InputItem onChange={val=>this.handleChange('name',val)}>用户名：</InputItem>
            <WhiteSpace/>
            <InputItem type="password" onChange={val=>this.handleChange('pwd',val)}>密码：</InputItem>
            <WhiteSpace/>
            <InputItem type="password" onChange={val=>this.handleChange('pwd2',val)}>确认密码：</InputItem>
            <WhiteSpace/>
            <RadioItem checked={this.state.type==='genius'}
                       onChange={() => this.handleChange('type', 'genius')}>牛人</RadioItem>
            <WhiteSpace/>
            <RadioItem checked={this.state.type==='boss'}
                       onChange={() => this.handleChange('type', 'boss')}>BOSS</RadioItem>
            <WhiteSpace/>
            <Button type="primary" onClick={this.handleRegister}>注册</Button>
            <WhiteSpace/>
            <Button onClick={this.goLogin}>已经有账号</Button>
            <WhiteSpace/>
          </List>
        </WingBlank>
      </div>
    );
  }
}


//export default Register;
/*export default connect(state=>({user:state.user}),{register})(Register);*/
export default connect(
  state => ({user: state.user}),  // 组件的props多了一个属性: user
  {register} // 组件的props多了一个属性: register函数
)(Register)
