var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({

  data: {
    bg_hongbao2: app.globalData.picUrl.bg_hongbao2,
    queding: app.globalData.picUrl.queding_1,
    zhuanfa: app.globalData.picUrl.zhuanfa,
    tankuang: app.globalData.picUrl.tankuang,
    show: true,
    kai: true,
  },
  onLoad: function (options) {
    console.log(this.data.kai);
  },
  formsubmit: function () {

  },
  kai: function () {
    let that = this;
    that.setData({
      kai: false,
      show: false
    })
  },
  //打开红包后,点击确定跳转
  makeSure() {
    this.setData({
      show: false
    })
    app.href("/redPackets/pages/openedHB/openedHB")
  }
})