var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    name: "",
    telephone: null,
    checkCode: "",
    result: "0",//手机号码验证是否正确
    error: "0",
    error_text: '',
    checking: "0",//获取验证码请求是否发送
    time: "0",//获取验证码按钮是否可点
    loading: "0",//加载动画控制
    getCode: "获取验证码",
    endTime: 60//多少秒后验证码得发
  },
  onLoad(options) {
    let that = this;
    let name = options.name;
    let telephone = options.telephone;
    if (name) {
      this.setData({
        name: name
      })
    }
    if (telephone) {
      this.setData({
        telephone: telephone
      })
    }
  },
  onShow() { },
  onHide() {
  },
  //姓名
  stripscript(e) {
    var that = this;
    var name = e.detail.value;
    that.setData({
      name: name
    })
  },
  //手机号码验证
  checkPhone(e) {
    var temp = e.detail.value;
    var myreg = /^(1+\d{10})|(159+\d{8})|(153+\d{8})$/;
    var that = this;
    if (!myreg.test(temp)) {
      that.setData({
        result: "0"
      })
    } else {
      that.setData({
        result: "1",
        telephone: temp
      });
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },
  //其他手机绑定
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  //点击跳转
  nextPage() {
    let that = this;
    let type = this.data.type;
    wx.login({
      success: function (res) {
        var name = that.data.name;
        var telephone = that.data.telephone;
        var result = that.data.result;
        var error = that.data.error;
        var error_text = that.data.error_text;
        var open_session = wx.getStorageSync('open_session')
        console.log(open_session)
        if (!name) {
          app.errorHide(that, '姓名不能为空', 3000)
        } else if (!telephone) {
          app.errorHide(that, '手机号码不能为空', 3000)
        } else if (telephone == 'undefined') {
          app.errorHide(that, '获取手机号码失败,请重试', 3000)
        } else {
          wx.request({
            url: url_common + '/api/user/bindUser',
            data: {
              user_real_name: name,
              user_mobile: telephone,
              open_session: open_session,
              oauth: "wx_oauth"
            },
            method: 'POST',
            success: function (res) {
              var user_career = res.data.user_career;
              var user_company = res.data.user_company;
              var uer_email = res.data.user_email;
              if (res.data.status_code == 2000000) {
                wx.setStorageSync('user_id', res.data.user_id);
                app.globalData.user_id = res.data.user_id;
                if (type) {
                  app.href('/pages/register/companyInfo/companyInfo?user_career=' + user_career + "&&user_company=" + user_company + "&&uer_email=" + uer_email + '&&type=' + type, )

                } else {
                  app.href('/pages/register/companyInfo/companyInfo?user_career=' + user_career + "&&user_company=" + user_company + "&&uer_email=" + uer_email, )
                }
              } else {
                app.errorHide(that, res.data.error_msg, 3000)
              }
            }
          })
        }
      }
    })
  },
});