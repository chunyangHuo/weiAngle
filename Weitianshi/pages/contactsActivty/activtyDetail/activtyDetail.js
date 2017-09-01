var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    status: false,
    signUp:'/pages/contactsActivty/joinWarband/joinWarband',
    topPlay: '/pages/contactsActivty/topPlayer/topPlayer'
  },
  onLoad: function (options) {

  },

  onShow: function () {
    var user_id = wx.getStorageSync('user_id');
    let that = this;
    wx.request({
      url: url_common + '/api/team/isJoin',
      data: {
        user_id: user_id,
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        let status = res.data.is_join;
        that.setData({
          status: status
        })
      }
    })
  },

  onShareAppMessage: function () {

  },
  //报名
  enroll: function (xxx) {
    console.log(xxx)
    let user_id = wx.getStorageSync('user_id');
    wx.request({
      url: url_common + '/api/user/checkUserInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == 2000000) {
          var complete = res.data.is_complete;
          if (complete == 1) {
            wx.navigateTo({
              url:xxx
            })
          } else if (complete == 0) {
            wx.removeStorageSync('followed_user_id')
            wx.navigateTo({
              url: '/pages/register/companyInfo/companyInfo?type=1'
            })
          }
        } else {
          wx.removeStorageSync('followed_user_id')
          wx.navigateTo({
            url: '/pages/register/personInfo/personInfo?type=2'
          })
        }
      }
    })
  },
})