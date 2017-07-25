var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
// pages/message/message/message.js
Page({
    data: {
        count: 0,
        messageList: [
            {
                event: "beAddedContacts",
                iconPath: "/img/img-personMessage.png",
                message_name: "项目申请",
                count: 0
            },
            {
                event: "beAddedContacts",
                iconPath: "/img/img-personMessage.png",
                message_name: "人脉申请",
                count: 0
            },
            {
                event: "beAddedContacts",
                iconPath: "/img/img-personMessage.png",
                message_name: "浏览我的名片",
                count: 0
            },
            {
                event: "beAddedContacts",
                iconPath: "/img/img-personMessage.png",
                message_name: "加我为人脉",
                count: 0
            },
            {
                event: "beAddedContacts",
                iconPath: "/img/img-personMessage.png",
                message_name: "同意/拒绝添加人脉",
                count: 0
            },
            {
                event: "beAddedContacts",
                iconPath: "/img/img-personMessage.png",
                message_name: "人脉申请",
                count: 0
            }
        ]
    },
    onShow: function () {
        //消除人脉缓存
        app.contactsCacheClear();
        var that = this;
        var user_id = wx.getStorageSync('user_id');
        var messageList = this.data.messageList;
        wx.request({
            url: url_common + '/api/message/messageType',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var data = res.data.data;
                console.log(data)
                var count = data[1].count;
                // console.log(data[1].count)
                data.forEach((x, index) => {
                    messageList[index].message_name = x.message_name;
                    if (x.count) {
                        messageList[index].count = x.count
                    } else {
                        messageList[index].count = 0
                    }
                })
                that.setData({
                    messageList: messageList,
                    count: count
                })
                console.log(that.data.messageList)
            }
        })
        wx.request({
          url: url_common +'/api/user/getUserGroupByStatus',
          data:{
            user_id:user_id
          },
          method:'POST',
          success:function(res){
            // 0:未认证1:待审核 2 审核通过 3审核未通过
            let status= res.data.status;
            console.log(status);
            that.setData({
              status:status
            })
          }
        })
    },

    // 跳转到人脉申请页面
    beAddedContacts: function () {
        wx.navigateTo({
            url: '/pages/message/beAddedContacts/beAddedContacts',
        })
    },
    //  beAddedContacts: function (e) {
    //   wx.navigateTo({
    //     url: '/pages/message/beAddedContacts/beAddedContacts',
    //   })
    // },
    // 身份认证跳转
    toIdentity:function(){
    console.log("跳转身份认证")
      wx.navigateTo({
        url: '/pages/my/identity/indentity/indentity',
      })
    },
    // 项目申请跳转
    projectApply:function(){
      wx.navigateTo({
        url: '/pages/message/applyProject/applyProject',
      })
    },
    // 项目推送
    projectPush:function(){
      wx.navigateTo({
        url: '/pages/message/pushProject/pushProject',
      })
    },

})