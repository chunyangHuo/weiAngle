let app = getApp();
let url_common = app.globalData.url_common;
export class register {
  // 微信授权绑定
  getPhoneNumber(e) {
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    let _this = this;
    wx.login({
      success: function (login) {
        let code = login.code;
        app.httpPost({
          url: 'https://www.weitianshi.cn/api/wx/returnWxOauthMobile',
          data: {
            app_key: app.globalData.app_key,
            code: code,
            encryptedData: encryptedData,
            iv: iv
          }
        }, this).then(res => {
          let telephone = res.data.user_mobile;
          _this.setData({
            telephone: telephone,
            registerModalShow: false,
          })
          app.getCurrentRouter();
        })
      }
    })
  }

  // 手机验证注册
  telephoneRegister() {
    let _this = this;
    app.getCurrentRouter();
    _this.setData({
      registerModalShow: false
    })
    app.href('/pages/register/personInfo/personInfo');
  }
  
  // 关闭注册方式选择弹框
  closeRegisterModal(){
    let _this = this;
    _this.setData({
      registerModalShow: false
    })
  }
}