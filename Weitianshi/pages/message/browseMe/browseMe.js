var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    count: 0
  },
  onLoad: function (options) {
    console.log(options)
    if (options.id) {
      let otherPerson_id = options.id;
      this.setData({
        otherPerson_id: otherPerson_id
      })
    }
  },
  onShow: function () {
    var that = this;
    app.initPage(that);
    let user_id = this.data.user_id;
    let otherPerson_id = this.data.otherPerson_id;
    // 获取浏览我的用户信息
    if (otherPerson_id){
      let user_id  = otherPerson_id;
     this. browseMe(user_id)
    }else if(user_id){
      this.browseMe(user_id)
    }
  },
  // 添加人脉
  addNetWork: function (e) {
    var that = this;
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    var followed_user_id = e.target.dataset.followedid;//当前用户的user_id
    var follow_status = e.currentTarget.dataset.follow_status;
    var index = e.target.dataset.index;
    var contacts = this.data.contacts
    if (follow_status == 0) {
      //添加人脉接口
      wx.request({
        url: url + '/api/user/UserApplyFollowUser',
        data: {
          user_id : user_id,
          applied_user_id: followed_user_id
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status_code == 2000000) {
            //将状态设为"未验证"
            contacts.forEach((x) => {
              if (x.user_id == followed_user_id) {
                x.follow_status = 2
              }
            })
            that.setData({
              contacts: contacts
            })
          }
        },
        fail: function (res) {
          wx.showModal({
            title: "错误提示",
            content: "添加人脉失败" + res
          })
        },
      })

    } else if (follow_status == 3) {
      // 同意申請接口
      wx.request({
        url: url + '/api/user/handleApplyFollowUser',
        data: {
          user_id: user_id,
          apply_user_id: followed_user_id
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status_code == 2000000) {
            //将状态设为"未验证"
            contacts.forEach((x) => {
              if (x.user_id == followed_user_id) {
                x.follow_status = 1
              }
            })
            that.setData({
              contacts: contacts
            })
          }
        }
      })
    }
  },
  // 用户详情
  userDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
    })
  },
  //下拉加载
  loadMore: function () {
    var that = this;
    var user_id = this.data.user_id
    var currentPage = this.data.currentPage;
    var request = {
      url: url_common + '/api/message/viewCardMessage',
      data: {
        user_id: user_id,
        page: currentPage,
        type_id: 3
      }
    }
    //调用通用加载函数
    app.loadMore(that, request, "contacts")
  },
  //列表加载
  browseMe:function(user_id){
    let  that = this;
      wx.showLoading({
        title: 'loading',
        mask: true,
      })
      console.log(user_id)
      wx.request({
        url: url_common + '/api/message/viewCardMessage',
        data: {
          user_id: user_id,
          page: 1,
          type_id: 3
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading()
          var contacts = res.data.data;
          var count = res.data.count;
          var page_end = res.data.page_end;
          that.setData({
            contacts: contacts,
            page_end: page_end,
            count: count
          })
        }
      })
      //向后台发送信息取消红点
      wx.request({
        url: url_common + '/api/message/setMessageToRead',
        data: {
          user_id: user_id,
          type_id: 3
        },
        method: "POST",
        success: function (res) {
          console.log(res)
        }
      })
    }
})