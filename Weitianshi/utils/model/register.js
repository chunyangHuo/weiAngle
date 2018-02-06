let app = getApp();
let _this = this;
let url_common = app.globalData.url_common;
export class register {
  // 微信授权绑定
  getPhoneNumber(e) {
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    let that = this;
    wx.login({
      success: function (login) {
        let code = login.code;
        app.httpPost({
          url:'https://www.weitianshi.cn/api/wx/returnWxOauthMobile',
          data:{
            app_key: app.globalData.app_key,
            code: code,
            encryptedData: encryptedData,
            iv: iv
          }
        },this).then(res=>{
          let telephone = res.data.user_mobile;
          that.setData({
            telephone: telephone,
          })
          app.getCurrentRouter();
          app.globalData.registerModalShow = false;
        })
      }
    })
  }

  // 手机验证注册
  telephoneRegister(){
    app.getCurrentRouter();
    app.globalData.registerModalShow = false;
    app.href('/pages/register/personInfo/personInfo');
  }
}