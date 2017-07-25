var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
// pages/message/bePushedProject/bePushedProject.js
Page({

  data: {
    winWidth: 0,//选项卡
    winHeight: 0,//选项卡
    currentTab: 2,//选项卡
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
  onShareAppMessage: function () {
  
  },

})