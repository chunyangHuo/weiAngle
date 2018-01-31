let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
let shareModel = require('../../../utils/model/shareModel.js')
let RP = require('../../../utils/model/redPackets.js')
let rp = new RP.redPackets();
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
    let unique_id = options.unique_id;
    this.setData({
      unique_id
    })
    rp.pushHBPerson.call(this,unique_id)
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
    let unique_id = this.data.unique_id;
    let personInfo = this.data.personInfo;
    return shareModel.redPacketsShare(personInfo.user.user_real_name, personInfo.packet.money, unique_id)
  }
})