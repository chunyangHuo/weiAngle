let app = getApp();
let url_common = app.globalData.url_common;

export class register {
  constructor() {

  }
  // 微信授权绑定 - 弹窗
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
            registerModalShow: false,
          })
          // 微信授权绑定 - 注册
          let open_session = wx.getStorageSync('open_session')
          app.httpPost({
            url: url_common + '/api/user/bindUser',
            data: {
              user_mobile: telephone,
              open_session: open_session,
              oauth: "wx_oauth"
            },
          }, _this).then(res => {
            wx.setStorageSync('user_id', res.data.user_id);
            app.globalData.user_id = res.data.user_id;
            app.href('/pages/register/companyInfo/companyInfo?user_career=' + res.data.user_career + "&&user_company=" + res.data.user_company + "&&uer_email=" + res.data.uer_email)
          })
          // 跳转
          app.getCurrentRouter();
        })
      }
    })
  }

  // 微信授权绑定 - 注册
  wxRegister(telephone) {
    _this = this;
    let open_session = wx.getStorageSync('open_session')
    app.httpPost({
      url: url_common + '/api/user/bindUser',
      data: {
        user_mobile: telephone,
        open_session: open_session,
        oauth: "wx_oauth"
      },
    }, this).then(res => {
      wx.setStorageSync('user_id', res.data.user_id);
      app.globalData.user_id = res.data.user_id;
      app.href('/pages/register/companyInfo/companyInfo?user_career=' + res.data.user_career + "&&user_company=" + res.data.user_company + "&&uer_email=" + res.data.uer_email)
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
  closeRegisterModal() {
    let _this = this;
    _this.setData({
      registerModalShow: false
    })
  }

  // 手机验证码绑定 - 注册(personInfo)
  telephoneRegister() {
    let _this = this;
    wx.login({
      success: function (res) {
        let user_mobile = _this.data.telephone;
        let captcha = that.data.checkCode;
        let code = res.code;
        let open_session = wx.getStorageSync('open_session');
        if (!user_mobile) {
          app.errorHide(that, '手机号码不能为空', 3000)
        } else if (!captcha) {
          app.errorHide(that, '验证码不能为空', 3000)
        } else {
          app.httpPost({
            url: url_common + '/api/user/bindUser',
            data: {
              user_mobile,
              captcha,
              code,
              open_session,
            },
          }, _this).then(res => {
            wx.setStorageSync('user_id', res.data.user_id);
            app.globalData.user_id = res.data.user_id;
            app.href('/pages/register/companyInfo/companyInfo?user_career=' + res.data.user_career + "&&user_company=" + res.data.user_company + "&&uer_email=" + res.data.uer_email)
          })
        }
      }
    })
  }

  // 注册相关信息填写(compnayInfo)
  companyInfoRegister(){
    let _this = this;
    let name = this.data.name;
    let company = this.data.company;
    let position = this.data.position;
    let brand = this.data.brand;
    let email = this.data.email;
    let user_id = wx.getStorageSync('user_id');
    if(!name){
      app.errorHide(this,'姓名不能为空')
    }else if (!company){
      app.errorHide(this,'公司不能为空')
    }else if(!position){
      app.errorHide(this,'职位不能为空')
    }else{
      
    }

    if (company !== "" && position !== "") {
      //向后台发送公司信息
      wx.request({
        url: url_common + '/api/user/updateUser',
        data: {
          user_id: user_id,
          user_company_name: company,
          user_company_career: position,
          user_email: email,
          user_brand: brand
        },
        method: 'POST',
        success: function (res) {
          let pages = getCurrentPages();
          let num = pages.length - 1;
          if (res.data.status_code == 2000000) {
            let followed_user_id = wx.getStorageSync('followed_user_id');
            if (followed_user_id) {
              let driectAdd = wx.getStorageSync("driectAdd");
              if (driectAdd) {
                //直接添加为好友
                wx.request({
                  url: url + '/api/user/followUser',
                  data: {
                    user_id: user_id,
                    followed_user_id: followed_user_id
                  },
                  method: 'POST',
                  success: function (res) {
                    if (res.data.status_code == 2000000) {
                      wx.showModal({
                        title: "提示",
                        content: "添加成功,请到人脉列表查看",
                        showCancel: false,
                        confirmText: "到人脉库",
                        success: function () {
                          app.href('/pages/discoverInvest/discoverInvest')
                        }
                      });
                      wx.removeStorageSync("driectAdd");
                      wx.removeStorageSync('followed_user_id');
                    } else {
                      app.errorHide(that, res.data.error_msg, 1500);
                    }
                  },
                });
              } else {
                //正常申请添加为好友
                wx.request({
                  url: url + '/api/user/UserApplyFollowUser',
                  data: {
                    user_id: user_id,
                    applied_user_id: followed_user_id
                  },
                  method: 'POST',
                  success: function (res) {
                    if (res.data.status_code == 2000000) {
                      wx.showModal({
                        title: "提示",
                        content: "添加成功,等待对方同意",
                        showCancel: false,
                        confirmText: "到人脉库",
                        success: function () {
                          wx.removeStorageSync('followed_user_id');
                          app.href('/pages/discoverInvest/discoverInvest')
                        }
                      });
                    }
                  },
                });
              }
            } else {
              app.href('/pages/register/bindSuccess/bindSuccess');
            }
          } else {
            let error_msg = res.data.error_msg;
            wx.showModal({
              title: "错误提示",
              content: error_msg
            });
          }
        },
      });

    } else {
      that.setData({
        error: '1'
      });
      if (company == '') {
        app.errorHide(that, "公司不能为空", 1500);
      } else if (position == '') {
        app.errorHide(that, "职位不能为空", 1500);
      } else {
        app.errorHide(that, "请正确填写邮箱", 1500);
      }
    }
  }
}