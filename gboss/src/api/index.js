import  ajax from './ajax';

//包含n个与后台接口对应的请求函数的模块
/*export const reqRegister = (user)=>{
/!*  console.log(25252525)
  console.log(user)*!/
  ajax('/api/register',user,'POST');
}*/
export const reqRegister = (user) => ajax('/api/register', user, 'POST')
export const reqLogin = (user)=>ajax('/api/login',user,'POST');
export const reqUpdateUser = (user)=>ajax('/api/update',user,'POST');
export const reqUser = ()=>ajax('/api/user');
export const reqUserList = (type) => ajax('/api/userlist',{type});
// 请求获取当前用户的所有聊天记录
export const reqMsgList = () => ajax('/api/msglist')
// 标识查看了指定用户发送的聊天信息
export const reqReadMsg = (from) => ajax('/api/readmsg', {from}, 'POST')

