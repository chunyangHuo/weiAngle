var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    notIntegrity: 0,//检查个人信息是否完整
    contacts_page: 1,//人脉列表的当前分页
    page_end: false,//是否还有下一页
  },
  onShow: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    that.setData({
      user_id: user_id,
      page_end: false,
      scroll: 0,
      contacts_page: 1
    })
    wx.request({
      url: url + '/api/user/getUserAllInfo',
      data: {
        share_id: 0,
        user_id: user_id,
        view_id: user_id,
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var user = res.data.user_info;
        var invest = res.data.invest_info;
        var resource = res.data.resource_info;
        var project_info = res.data.project_info;
        var invest_case = res.data.invest_case;
        var tel = user.user_mobile;
        var button_type = res.data.button_type;
        if (button_type == 0) {
          console.log("不是人脉并没有发送人脉申请")
        } else if (button_type == 1) {
          console.log("单方人脉")
        } else if (button_type == 2) {
          console.log("互为人脉")
        } else if (button_type == 3){
          console.log("待验证")
        }
        if (tel.indexOf("*") != -1) {
          that.setData({
            blue: 1
          })
        }
        // console.log(that.data.blue)
        that.setData({
          user: user,
          invest: invest,
          resource: resource,
          project_info: project_info,
          invest_case: invest_case,
          button_type: button_type
        }) 
        } 
    })
    // 获取人脉库信息
    if (user_id) {
      wx.request({
        url: url_common + '/api/message/viewCardMessage',
        data: {
          user_id: user_id,
          page: 1,
          type_id:3
        },
        method: 'POST',
        success: function (res) {
          console.log("我的人脉列表")
          var contacts = res.data.data;//所有的用户
          console.log(res.data.data.length)
          var numLen = res.data.data.length;
          var page_end = res.data.page_end;
         wx.setStorageSync('numLen', numLen);
          that.setData({
            contacts: contacts,
            page_end: page_end,
            contacts_page: 1,
            numLen: numLen
          })
        }
      })
    }
  },
  // 用户详情=========================================================================================
  userDetail: function (e) {
    var id = e.currentTarget.dataset.id
    console.log(id);
    wx.navigateTo({
      url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
    })
  },
  //我的名片
  myCard: function () {
    var that = this;
    var user_id = this.data.user_id;
    //获取用户信息
    wx.request({
      url: url + '/api/user/getUserAllInfo',
      data: {
        share_id: 0,
        user_id: user_id,
        view_id: user_id
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.status_code == 2000000) {
          wx.showModal({
            titel: "友情提示",
            content: "分享名片功能需要在个人页面点击去交换按钮实现",
            showCancel: false,
            success: function (res) {
              if (res.confirm == true) {
                wx.switchTab({
                  url: '/pages/my/my/my',
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: "友情提示",
            content: "交换名片之前,请先完善自己的名片",
            success: function (res) {
              if (res.confirm == true) {
                wx.navigateTo({
                  url: '/pages/my/cardEdit/cardEdit',
                })
              }
            }
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "对不起没有获取到您的个人信息"
        })
      },
    })
  },
  // 绑定名片
  bindUserInfo: function () {
    app.infoJump()
  },
  // 一键拨号
  telephone: function (e) {
    var telephone = e.currentTarget.dataset.telephone;
    wx.makePhoneCall({
      phoneNumber: telephone,
    })
  },
  // 下拉加载
  // loadMore: function () {
  //   var that = this;
  //   that.setData({
  //     user_id: user_id,
  //     page_end: false,
  //     scroll: 0,
  //     netWork_page: 1
  //   })
  //   var netWork_page = this.data.netWork_page;
  //   console.log(netWork_page)
  //   var user_id = wx.getStorageSync('user_id');
  //   var page_end = this.data.page_end;
  //   if (page_end == false) {
  //     wx.showToast({
  //       title: 'loading...',
  //       icon: 'loading'
  //     })
  //     netWork_page++;
  //     that.setData({
  //       netWork_page: netWork_page
  //     })
      
  //     wx.request({
  //       url: url + '/api/user/getMyFollowList',
  //       data: {
  //         user_id: user_id,
  //         page: netWork_page,
  //       },
  //       method: 'POST',
  //       success: function (res) {
  //         console.log(res)
  //         var newPage = res.data.data;
  //         var netWork = that.data.netWork;
  //         var page_end = res.data.page_end;
  //         for (var i = 0; i < newPage.length; i++) {
  //           netWork.push(newPage[i])
  //         }
  //         that.setData({
  //           netWork: netWork,
  //           page_end: page_end,
  //         })
  //       },
  //       fail: function () {
  //         wx.showToast({
  //           title: '加载人脉失败',
  //         })
  //       },
  //     })
  //   } else {
  //     rqj.errorHide(that, "没有更多了", 3000)
  //   }
  // }
})