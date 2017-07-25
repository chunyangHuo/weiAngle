var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    buttonOne: {
      text: "添加案例"
    }
  },
  onShow: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    this.setData({
      user_id: user_id
    })
    // 初始化案例编辑时的领域和地区
    wx.removeStorageSync('case_domainValue');
    wx.removeStorageSync('case_domainId');
    wx.removeStorageSync('addcase_belongArea')
    // 载入我的个人信息
    if (user_id) {
      wx.request({
        url: url_common + '/api/user/getUserAllInfo',
        data: {
          share_id:0,
          user_id: user_id,
          view_id:user_id
        },
        method: 'POST',
        success: function (res) {
          // console.log(res);
          //  console.log(res.case_province);
          var invest_case = res.data.invest_case;
          wx.setStorageSync('invest_case', invest_case)
          that.setData({
            invest_case: invest_case,
          })
        },
        fail: function (res) {
          console.log(res)
        },
      })
    } else {
      app.noUserId()
    }
  },
  //编辑案例
  /*detail: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../investCaseEdit/investCaseEdit?index=' + index,
    })
  },*/

  // 按钮一号
  buttonOne: function () {
    wx.navigateTo({
      url: '/pages/my/investCaseEdit/investCaseEdit',
    })
  }
})