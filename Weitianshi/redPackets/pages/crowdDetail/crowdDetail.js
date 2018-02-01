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
    let groupId = options.groupId;groupId
    rp.groupInsideHB.call(this, groupId)
  },
  //跳转用户详情
  userDetail(e) {
    let id = e.currentTarget.dataset.id;
    app.href('/pages/userDetail/networkDetail/networkDetail?id=' + id)
  },
  //领取红包
  getHB(e) {
    let unique_id = e.currentTarget.dataset.uniqueid;
    let user_id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    if (status == 0) {
      app.href("/pages/my/sharePage/sharePage?user_id=" + user_id + "&&share_id=" + user_id + "&&unique_id=" + uniqueId + '&&is_redPackets=' + true);
    } else {
      app.href('/redPackets/pages/openedHB/openedHB?unique_id=' + uniqueId);
    }
  }
}) 