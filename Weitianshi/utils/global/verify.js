let app = getApp();
let _this = this;
//错误提示
function errorHide(target, errorText, time = 3000) {
  let that = target;
  that.setData({
    error: "1",
    error_text: errorText
  });
  let errorTime = setTimeout(function () {
    that.setData({
      error: "0"
    });
  }, time);
}

// 手机号码格式   {1开头的11位数字}
function mobile(that,value, callBack){
  console.log('this',this);
  var myreg = /^(1+\d{10})|(159+\d{8})|(153+\d{8})$/;
  if(!value){
    this.errorHide(that,'请输入手机号');
    return
  }
  if (myreg.test(value)) {
    this.errorHide(that,'手机号码格式不正确');
    return
  }
  
  if (callBack) callBack();
}
// 邮箱格式
function email(that,value,callBack){
  var myreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if(!value){
    this.errorHide(that,'请输入邮箱');
    return
  }
  if(!myreg.test(value)){
    this.errorHide(that,'邮箱模式不正确');
    return 
  }
  if(callBack) callBack();
}

export {
  mobile,
  email,
  errorHide
}