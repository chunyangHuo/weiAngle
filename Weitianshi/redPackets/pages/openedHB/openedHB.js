let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
let RP = require('../../../utils/model/redPackets.js');
let rp = new RP.redPackets();
Page({
  data: {
    bg_hongbao2: app.globalData.picUrl.bg_hongbao2,
    open: app.globalData.picUrl.open,
  },
  onLoad: function (options) {
    //红包分享人的id
    let unique_id = options.unique_id;
    let user_id = wx.getStorageSync('user_id');
    console.log(options)
    rp.otherGroupHB.call(this, options.shareTicket)
    rp.getHBRecord.call(this, user_id, unique_id)
    rp.pushHBPerson.call(this, user_id, unique_id)
    this.setData({
      shareTicket: options.shareTicket || "",
      user_id: wx.getStorageSync("user_id")
    })
  },
  // 跳转到群详情
  redDetail(e) {
    let groupId = e.currentTarget.dataset.groupid;
    app.href('/redPackets/pages/crowdDetail/crowdDetail?groupId=' + groupId)
  },
  // 查看更多群红包
  seeMore() {
    let shareTicket = this.data.shareTicket;
    app.href('/redPackets/pages/allCrowdHB/allCrowdHB?shareTicket=' + shareTicket)
  },
  // 跳转到首页
  toFirst() {
    app.href("/pages/discoverProject/discoverProject")
  },
  //发红包
  sendHB() {
    app.href("/redPackets/pages/publishHB/publishHB")
  },
  //转发到更多群
  sendMoreGroup() {

  },
  // 加人脉成功后处理(辅助函数)
  contactsAddSuccessFunc(res, added_user_id, num) {
    let that = this;
    var contacts = this.data.contacts;
    app.log("contacts", contacts);
    if (res.data.status_code == 2000000) {
      //更改投资人和FA列表中该人的加人脉按钮的字段
      if (contacts) {
        contacts.forEach(x => {
          if (x.user_id == added_user_id) {
            x.follow_status = num;
          }
        });
        that.setData({
          contacts: contacts
        });
      }
    } else {
      app.errorHide(that, res.data.error_Msg, 3000);
    }
  },
  // 申请加人脉
  contactsAdd(e) {
    let added_user_id = e.currentTarget.dataset.id;
    let that = this;
    app.operationModel('contactsAdd', added_user_id, function (res) {
      app.log('申请添加人脉完成', res);
      that.contactsAddSuccessFunc(res, added_user_id, 2);
    });
  },
  //看看Ta的投资名片
  sendMoreGroup(e) {
    let id = e.currentTarget.dataset.id;
    app.href('/pages/userDetail/networkDetail/networkDetail?id=' + id)
  },
  //查看个人名片
  userDetail(e) {
    let id = e.currentTarget.dataset.id;
    app.href('/pages/userDetail/networkDetail/networkDetail?id=' + id)
  },

})