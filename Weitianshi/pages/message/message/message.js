var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    count: 0,
    messageList: [
      // {
      //   event: "toIdentity",
      //   iconPath: "/img/icon-xiaoxi_renzheng@2x.png",
      //   message_name: "身份认证",
      //   count: 0,
      //   type_id: 8
      // },
      {
        event: "projectApply",
        iconPath: "/img/icon-xiaoxi_xiangmu@2x.png",
        message_name: "项目申请",
        count: 0,
        type_id: 0
      },
      {
        event: "projectPush",
        iconPath: "/img/icon-xiaoxi_tuisong@2x.png",
        message_name: "项目推送",
        count: 0,
        type_id: 0
      },
      {
        event: "beAddedContacts",
        iconPath: "/img/icon-xiaoxi_renmai@2x.png",
        message_name: "人脉申请",
        count: 0,
        type_id: 0
      }
    ],
    status: 0
  },
  onShow: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var messageList = this.data.messageList;
    let count = this.data.count;
    let type_id = this.data.type_id;
    if (user_id) {
      wx.request({
        url: url_common + '/api/message/messageType',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          var list = res.data.data;
          console.log(list)
          list.forEach((x, index) => {
            messageList[index].message_name = x.message_name;
            messageList[index].count = x.count;
            messageList[index].type_id = x.type_id;
            if (x.count) {
              messageList[index].count = x.count
            } else {
              messageList[index].count = 0
            }
          })
          that.setData({
            messageList: messageList,
            count: count,
            type_id: type_id
          })
        }
      })
    }
  },
  // 跳转到人脉申请页面
  beAddedContacts: function () {
    app.href('/pages/message/beAddedContacts/beAddedContacts')
  },
  // 项目申请跳转
  projectApply: function (e) {
    let type = e.currentTarget.dataset.type;
    let group_id = this.data.group_id;
    app.delayDeal(x=>{
      if (group_id) {
        app.href('/pages/message/applyProject/applyProject?type=' + type + '&&group_id=' + group_id)
      } else {
        app.href('/pages/message/applyProject/applyProject?type=' + type)
      }
    })
  },
  // 项目推送
  projectPush: function (e) {
    let type = e.currentTarget.dataset.type;
    let group_id = this.data.group_id;
    if (group_id) {
      app.href('/pages/message/pushProject/pushProject?type=' + type + '&&group_id=' + group_id)
    } else {
      app.href('/pages/message/pushProject/pushProject?type=' + type)
    }
  },
  //测试一键尽调
  testOneKey() {
    app.href('/pages/oneKeyResearch/oneKeyResearch?id=RpAQ5jpx')
  }
})