let app = getApp();
// 手机号码格式   {1开头的11位数字}
function mobile(that,value, callBack){
  var myreg = /^(1+\d{10})|(159+\d{8})|(153+\d{8})$/;
  if(!value){
    app.errorHide(that,'请输入手机号');
    return
  }
  if (!myreg.test(value)) {
    app.errorHide(that,'手机号码格式不正确')
  } else {
    if (callBack) callBack();
  }
}

export {
  mobile
}