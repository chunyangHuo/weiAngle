var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
let RP = require('../../../utils/model/redPackets.js');
let rp = new RP.redPackets();
Page({
  data: {
    packetlist: app.globalData.picUrl.packetlist,
    packetover: app.globalData.picUrl.packetover,
    imgUrls: app.globalData.picUrl.meifaguo,
  },
  onLoad: function (options) {
    let groupId = options.groupId;
    let openGId = "GblEJ0dKCN5Q5b2lBxp_pqtzN3Kw"
    rp.groupInsideHB.call(this, openGId)
  },
  //跳转用户详情
  userDetail(e) {
    let id = e.currentTarget.dataset.id; 
    app.href('/pages/userDetail/networkDetail/networkDetail?id=' + id)
  },
  //领取红包
  getHB(e) {
    let user_id = e.currentTarget.dataset.id; 
    app.href("/pages/my/sharePage/sharePage")
  }
}) 