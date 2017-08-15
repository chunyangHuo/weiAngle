var rqj = require('../../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    messageList: [
      {
        event: "toIdentityEdit",
        iconPath: "/img/img-maifangFA@2x.png",
        identityName: "我是买方FA",
        indentityExplain: "帮助大企业寻找优质项目的人"
      },
      {
        event: "toIdentityEdit",
        iconPath: "/img/img-maifangFA@2x.png",
        identityName: "我是卖方FA",
        indentityExplain: "帮助优秀项目融资陪跑的人"
      },
      {
        event: "toIdentityEdit",
        iconPath: "/img/img-touzifang@2x.png",
        identityName: "我是投资方",
        indentityExplain: "拥有资金寻找优秀项目的人"
      },
      {
        event: "toIdentityEdit",
        iconPath: "/img/img-chuangyezhe@2x.png",
        identityName: "我是创业者",
        indentityExplain: "正在做一件牛逼的事"
      },
      {
        event: "toIdentityEdit",
        iconPath: "/img/img-qita@2x.png",
        identityName: "其他",
        indentityExplain: "政府、公益组织、高校等用户"
      }
    ]
  },

  onLoad: function (options) {
    console.log(options)
    let old_group_id = options.group_id;
    let old_authenticate_id = options.authenticate_id;
    let that = this;
    wx.request({
      url: url_common + '/api/category/getGroupIdentify',
      data: {
      },
      method: 'POST',
      success: function (res) {
        let groupIdentityList = res.data.data;
        var messageList = that.data.messageList;
        groupIdentityList.forEach((x, index) => {
          messageList[index].sort = x.sort;
          messageList[index].group_id = x.group_id;
        })
        that.setData({
          messageList: messageList
        })
        console.log(that.data.messageList)
      }
    })
    that.setData({
      old_group_id : old_group_id,
      old_authenticate_id: old_authenticate_id
    })
  },

  onShow: function () {

  },
  // 跳转认证资料信息填写页面
  toIdentityEdit: function (e) {
    console.log(e)
    let user_id = wx.getStorageSync('user_id');
    let group_id = e.currentTarget.dataset.group;
    // 重新认证的时候，才会有old_group_id
    let old_group_id = this.data.old_group_id;
    let old_authenticate_id = this.data.old_authenticate_id;
    console.log(old_group_id)
    console.log(group_id)
    if (old_group_id){
        wx.request({
          url: url_common + '/api/user/setUserGroup',
          data: {
            user_id: user_id,
            group_id: group_id,
            old_authenticate_id: old_authenticate_id
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            // isUpdate :0 未认证过 1:重新认证
            let isUpdate = res.data.is_update;
            console.log(isUpdate)
          if(old_group_id != group_id){
            wx.navigateTo({
              url: '/pages/my/identity/identityEdit/identityEdit?group_id=' + group_id + '&&authenticate_id=' + authenticate_id,
            })
          }else if(old_group_id == group_id){
            wx.navigateTo({
              url: '/pages/my/identity/identityEdit/identityEdit?group_id=' + group_id + '&&authenticate_id=' + authenticate_id,
            })
          }
          }
        })
   }else{
      wx.request({
        url: url_common + '/api/user/setUserGroup',
        data: {
          user_id: user_id,
          group_id: group_id
        },
        method: 'POST',
        success: function (res) {
          let isUpdate = res.data.is_update;
          var authenticate_id = res.data.authenticate_id;
          wx.navigateTo({
            url: '/pages/my/identity/identityEdit/identityEdit?group_id=' + group_id + '&&authenticate_id=' + authenticate_id,
          })
        }
      })
   }
  }
})