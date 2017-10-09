var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as ShareModel from '../../../utils/shareModel';
Page({
  data: {

  },
  onLoad: function (options) {

  },

  onShow: function () {
    //消除人脉缓存
    app.contactsCacheClear();
    var that = this
    app.loginPage(function (user_id) {
      that.setData({
        user_id: user_id,
      })
      //分享至群打点准备
      /* wx.showShareMenu({
         withShareTicket: true,
       })*/
      if (user_id != 0) {
        wx.showLoading({
          title: 'loading',
          mask: true,
        })
        //载入我的个人信息
        wx.request({
          url: url_common + '/api/user/myInfo',
          data: {
            share_id: 0,
            user_id: user_id,
            view_id: user_id,
          },
          method: 'POST',
          success: function (res) {
            wx.hideLoading()
            console.log(res)
            var user = res.data.data.user;
            console.log(user)
            var count = res.data.data.count;
            var invest = res.data.data.invest_info;
            var resource = res.data.data.resource_info;
            var project_info = res.data.data.project_info;
            var user_name = res.data.data.user.user_real_name;
            console.log(user_name)
            wx.setNavigationBarTitle({
              title: user_name + "的投资名片",
            })
            that.setData({
              user: user,
              invest: invest,
              resource: resource,
              project_info: project_info,
              count: count
            })
          },
          fail: function (res) {
            console.log(res)
          },
        })
      } else {
        app.noUserId()
      }
    })

  },
  //进入我的名片
  toMyCard: function () {
    wx.navigateTo({
      url: '/pages/my/my/my',
    })
  },
  //人气
  popularity: function () {
    wx.navigateTo({
      url: '/pages/message/browseMe/browseMe'
    })
  },
  //加我为人脉
  attention: function () {
    wx.navigateTo({
      url: '/pages/message/beAddedContacts/beAddedContacts'
    })
  },
  //潜在项目
  pushTo: function () {
    wx.navigateTo({
      url: '/pages/message/potentialProject/potentialProject'
    })
  },
  //身份验证
  identity: function () {

  },
  //项目店铺
  projectShop: function () {
    wx.navigateTo({
      url: '/pages/my/projectShop/projectShop/projectShop',
    })
  },
  //约谈的项目
  contactProject: function () {
    wx.navigateTo({
      url: '/pages/message/contactProject/userList/userList',
    })
  },
  //收藏的项目
  collectProject: function () {
    // wx.navigateTo({
    //   url: '/pages/message/collectProject/collectProject',
    // })
    let that = this;
    app.errorHide(that, "收藏项目近期开放", 3000);
  },
  //分享页面
  onShareAppMessage: function () {
    let that = this;
    return SharePage.myCardShare(that);
  },
})