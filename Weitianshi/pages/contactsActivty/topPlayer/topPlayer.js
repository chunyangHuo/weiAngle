var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    currentTab: 1,//选项卡
  },

  
  onLoad: function (options) {
  
  },

  onShow: function () {

  },
  /*滑动切换tab*/
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    that.setData({ currentTab: e.detail.current });
  },
  /*点击tab切换*/
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //返回小程序
  backTo:function(){
    wx.switchTab({
      url: '/pages/match/selectProject/selectProject',
    })
  },
  //扩展我的人脉
  expandMyContacts:function(){
    let user_id = wx.getStorageSync('user_id');
    wx.redirectTo({
      url: '/pages/my/qrCode/qrCode?user_id='+ user_id+'&type='+1,
    })
  }
})