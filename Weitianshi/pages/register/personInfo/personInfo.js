let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
Page({
  data: {
    name: '',
    telephone: '',
    checkCode: '',
    checking: "0",//获取验证码请求是否发送
    time: "0",//获取验证码按钮是否可点
    loading: "0",//加载动画控制
    getCode: "获取验证码",
    endTime: 60,//多少秒后验证码得发
    nonet: true
  },
  onLoad: function (options) {
    let type = options.type;
    let that = this;
    if (type) {
      that.setData({
        type: type
      })
    };
    app.netWorkChange(that)
  },
  onShow: function () {
    let that = this;
    this.clearTime();
  },
  // 清除记时器(辅助函数)
  clearTime() {
    let that = this;
    if (this.data._time) {
      that.setData({
        time: "1"
      })
    } else {
      // 清零短信倒计时
      that.setData({
        time: "0"
      })
    }
  },
  //手机号码验证
  checkPhone: function (e) {
    let telephone = e.detail.value;
    this.setData({
      telephone
    })
  },
  //获取验证码按钮倒计时动效
  checkCode: function (e) {
    e.detail.disabled = true;
    let telephone = this.data.telephone;
    let checking = this.data.checking;
    let that = this;
    let endTime = this.data.endTime
    endTime = 60;
    app.globalData.verify.mobile(this, telephone, res => {
      that.setData({
        checking: "1",
        time: "1",
      });
      // 请求验证码
      wx.request({
        url: url_common + '/api/auth/authCaptcha',
        data: {
          user_mobile: telephone
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            checking: "0"
          });
          if (res.data.status_code === 2000000) {

          } else {
            app.errorHide(that, res.data.error_msg, 3000)
          }
        },
        fail: function () {
          app.errorHide(that, res.data.error_msg, 3000)
        },
        complete: function () {
          // complete
        }
      })
    })
  },
  //获取验证码的值 
  checkCode2: function (e) {
    let that = this;
    that.setData({
      checkCode: e.detail.value
    });
  },
  //personInfo点击跳转
  nextPage: function () {
    let that = this;
    let type = this.data.type;
    wx.login({
      success: function (res) {
        let name = that.data.name;
        let telephone = that.data.telephone;
        let error = that.data.error;
        let error_text = that.data.error_text;
        let checkCode = that.data.checkCode;
        let code = res.code;
        let open_session = wx.getStorageSync('open_session');
        if (!telephone) {
          app.errorHide(that, '手机号码不能为空', 3000)
        } else if (!checkCode) {
          app.errorHide(that, '验证码不能为空', 3000)
        } else {
          wx.request({
            url: url_common + '/api/user/bindUser',
            data: {
              user_real_name: name,
              user_mobile: telephone,
              captcha: checkCode,
              code: code,
              open_session: open_session
            },
            method: 'POST',
            success: function (res) {
              let user_career = res.data.user_career;
              let user_company = res.data.user_company;
              let uer_email = res.data.user_email;
              if (res.data.status_code == 2000000) {
                wx.setStorageSync('user_id', res.data.user_id);
                app.globalData.user_id = res.data.user_id;
                if (type) {
                  app.href('/pages/register/companyInfo/companyInfo?user_career=' + user_career + "&&user_company=" + user_company + "&&uer_email=" + uer_email + '&&type=' + type)
                } else {
                  app.href('/pages/register/companyInfo/companyInfo?user_career=' + user_career + "&&user_company=" + user_company + "&&uer_email=" + uer_email)
                }
              } else {
                app.errorHide(that, res.data.error_msg, 3000)
              }
            }
          })
        }
      }
    })
  }
});