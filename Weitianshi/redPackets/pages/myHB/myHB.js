var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
let RP = require('../../../utils/model/redPackets.js')
let rp = new RP.redPackets();
Page({
  data: {
    imgUrls: app.globalData.picUrl.meifaguo,
    redHB: true,
    imgUrls2: app.globalData.picUrl.shengcheng2,
  },
  onLoad() {
    let that = this;
    app.loginPage(user_id => {
      wx.showLoading({
        title: 'loading',
        mask: true,
      });
      rp.publishedHBList.call(this, user_id)
    })
  },
  //跳转生成红包页面
  createHB(){
    app.href("/redPackets/pages/publishHB/publishHB")
  }
})