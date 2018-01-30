let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
let shareModel = require('../../../utils/model/shareModel.js')
Page({
  data: {
    bg_hongbao2: app.globalData.picUrl.bg_hongbao2,
    queding: app.globalData.picUrl.queding_1,
    zhuanfa: app.globalData.picUrl.zhuanfa,
    tankuang: app.globalData.picUrl.tankuang,
    open: app.globalData.picUrl.open,
    show: true,
    kai: true,
  },
  onLoad: function (options) {
    console.log(this.data.kai);
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  formsubmit: function () {

  },
  hidemodel: function () {
    let that = this;
    that.setData({
      show: true
    });
  },
  kai: function () {
    let that = this;
    that.setData({
      kai: false,
    })
    setTimeout(() => {
      that.setData({
        show: false,
        kai: true,
      });
    }, 1000)
  },
  // 打开红包后,点击确定跳转
  makeSure() {
    this.setData({
      show: false
    })
    app.href("/redPackets/pages/openedHB/openedHB")
  },
  // 分享页面
  onShareAppMessage(){
    return shareModel.redPacketsShare('阮千军',1000000)
  }
})