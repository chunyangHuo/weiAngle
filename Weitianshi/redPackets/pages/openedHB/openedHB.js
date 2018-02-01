let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
let RP = require('../../../utils/model/redPackets.js');
let rp = new RP.redPackets();
import * as shareModel from '../../../utils/model/shareModel.js';
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
    rp.pushHBPerson.call(this, unique_id)
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
  // 加人脉成功后处理(辅助函数)
  contactsAddSuccessFunc(res, added_user_id, num, onlyPerson) {
    let that = this;
    if (onlyPerson) {
      let personInfo = this.data.personInfo;
      personInfo.is_card = num;
      this.setData({
        personInfo: personInfo
      })
    } else if (!onlyPerson) {
      let whoGet = this.data.whoGet;
      if (res.data.status_code == 2000000) {
        if (whoGet) {
          whoGet.forEach(x => {
            if (x.user.user_id == added_user_id) {
              x.is_card = num;
            }
          });
          that.setData({
            whoGet: whoGet
          });
        }
      } else {
        app.errorHide(that, res.data.error_Msg, 3000);
      }
    }
  },
  // 申请加人脉
  contactsAdd(e) {
    let added_user_id = e.currentTarget.dataset.id;
    let that = this;
    let onlyPerson = e.currentTarget.dataset.only;
    app.operationModel('contactsAdd', added_user_id, function (res) {
      console.log('申请添加人脉完成', res);
      that.contactsAddSuccessFunc(res, added_user_id, 2, onlyPerson);
    });
  },
  // 直接加人脉
  contactsAddDirect(e) {
    let added_user_id = e.currentTarget.dataset.id;
    let onlyPerson = e.currentTarget.dataset.only;
    let that = this;
    app.operationModel('contactsAddDirect', added_user_id, function (res) {
      app.log("直接添加人脉完成", res);
      that.contactsAddSuccessFunc(res, added_user_id, 1, onlyPerson);
    });
  },
  // 看看Ta的投资名片
  sendMoreGroup(e) {
    let id = e.currentTarget.dataset.id;
    app.href('/pages/userDetail/networkDetail/networkDetail?id=' + id)
  },
  // 查看个人名片
  userDetail(e) {
    let id = e.currentTarget.dataset.id;
    app.href('/pages/userDetail/networkDetail/networkDetail?id=' + id)
  },
  // 分享页面
  onShareAppMessage(){
    let unique_id = this.data.unique_id;
    let personInfo = this.data.personInfo;
    return shareModel.redPacketsShare(personInfo.user.user_real_name, personInfo.packet.money, unique_id)
  }
})