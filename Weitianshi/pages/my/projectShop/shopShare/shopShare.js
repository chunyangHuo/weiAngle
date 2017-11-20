// pages/my/projectShop/shopShare/shopShare.js
Page({

  data: {
  
  },

  onLoad: function (options) {
  
  },
  onShow:function(){

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