import React,{Component} from 'react';
import jobImg from './job.png';
import './logo.less'
class Logo extends Component {
   render () {
    return (
      <div className="logo-container">
        <img  src={jobImg} alt="logo"/>
      </div>
    );
  }
}

export default Logo;