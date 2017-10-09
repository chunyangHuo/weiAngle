let rqj = require('../../Template/Template.js');
let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
import * as ShareModel from '../../../utils/shareModel'
Page({
  data: {
    dataUrl: ""
  },
  onLoad: function (options) {
    let QR_id = this.options.user_id;
    let type = this.options.type;
    if (type) {
      this.setData({
        QR_id: QR_id,
        type: type
      })
    }
  },
  onShow: function () {
    let that = this;
    let type = this.data.type;
    let QR_id;
    if (type == 1) {
      QR_id = this.data.QR_id;
    } else {
      QR_id = wx.getStorageSync('QR_id');//点击二维码页面的用户id
    }

    //登录态维护
    app.loginPage(function (user_id) {
      let view_id = QR_id;
      wx.setStorageSync('user_id', user_id);
      that.setData({
        user_id: user_id
      })
      //载入我的个人信息
      wx.request({
        url: url_common + '/api/user/getUserAllInfo',
        data: {
          share_id: 0,
          user_id: QR_id,
          view_id: user_id,
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          let user = res.data.user_info;
          that.setData({
            user: user,
          })
        },
      })
      // 获取二维码接口
      wx.request({
        url: url + '/api/wx/getCardQr',
        data: {
          'user_id': QR_id,
          'path': '/pages/my/sharePage/sharePage?user_id=' + QR_id + "&&share_id=" + user_id,
          'width': 430,
          'auto_color': false,
          'line_color': { "r": "0", "g": "0", "b": "0" }
        },
        method: 'POST',
        success: function (res) {
          let net = res.data;
          let access_token = net.qrcode;
          that.setData({
            access_token: access_token
          })
          let filPath = wx.setStorageSync('access_token', access_token);
        },
        fail: function (res) {
          console.log(res)
        }
      })
    })
  },

  //保存小程序码
  savePic: function () {
    let filePath = wx.getStorageSync('access_token');
    wx.getImageInfo({
      src: filePath,
      success: function (res) {
        let picPath = res.path;
        wx.getSetting({
          success(res) {
            if (!res['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  wx.saveImageToPhotosAlbum({
                    filePath: picPath,
                    success: function (res) {
                      wx.showToast({
                        title: '保存图片成功',
                        icon: 'success'
                      })
                    },
                    fail: function (res) {
                      console.log(filePath)
                      console.log(res)
                    }
                  })
                }
              })
            }
          }
        })
      },
    })
  },

  //分享页面
  onShareAppMessage: function () {
    let that = this;
    return ShareModel.qrCodeShare(that);
  },
  //取消分享
  cancelShare: function () {
    this.setData({
      modal: 0
    })
  },

})