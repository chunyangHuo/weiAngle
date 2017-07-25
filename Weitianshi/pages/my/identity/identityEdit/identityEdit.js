var rqj = require('../../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
  
  },

  onLoad: function (options) {
  
  },

  onShow: function () {
  console.log("edit")
  },
  scanIDcard:function(){
    console.log("上传名片")
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log("成功")
        var tempFilePaths = res.tempFilePaths
        // wx.request({
        //   url: url_common +' /api/user/uploadCard',
        //   data: '',
        //   header: {},
        //   method: '',
        //   dataType: '',
        //   success: function(res) {},
        //   fail: function(res) {},
        //   complete: function(res) {},
        // })还没写完
      }
    })
  }
})