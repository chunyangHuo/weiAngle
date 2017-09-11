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
  
  },
  upLoadPic:function(){
    console.log(111)
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        let avatar = tempFilePaths[0];
        let size = res.tempFiles[0].size;
        console.log(size)
        if (size <= 2097152) {
          // wx.uploadFile({
          //   url: url_common + '/api/team/uploadLogo', //仅为示例，非真实的接口地址
          //   filePath: tempFilePaths[0],
          //   name: 'avatar',
          //   formData: {
          //     user_id: user_id,
          //   },
          //   success: function (res) {
          //     let data = JSON.parse(res.data);
          //     let image_id = data.data.image_id;
          //     that.setData({
          //       image_id: image_id
          //     })
          //   }
          // })
          // that.setData({
          //   filePath: tempFilePaths
          // })
        } else {
          app.errorHide(that, "上传图片不能超过2M", 1500)
        }
      }
    })
  },
  save:function(){
     
  }
})