// pages/contactsActivty/createWarband/createWarband.js
var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
  
  },

  onLoad: function (options) {
  
  },

  onShow: function () {
  
  },
  writeNewThing:function(e){
    let type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: '/pages/contactsActivty/createInfo/createInfo?type=' + type,
      })
    } else if (type == 2) {
      wx.navigateTo({
        url: '/pages/contactsActivty/createInfo/createInfo?type=' + type,
      })
    }
    else if (type == 3) {
      wx.navigateTo({
        url: '/pages/contactsActivty/createInfo/createInfo?type=' + type,
      })
    }
  },
  createWar:function(){
    let  user_id = this.data.user_id;
    let team_name = this.data.team_name;
    let team_founder = this.data.team_founder;
    let team_logo = this.data.team_logo;
    wx.request({
      url: url + '/api/team/create',
      data: {
        user_id: "vrny6QAp",
        team_name: team_name,
        team_founder: team_founder,
        team_logo: ''
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.status_code == 2000000) {
          wx.showModal({
            title: '创建成功',
            content: '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0战队正在审核中,\n加FA哥微信weitianshicn，加速审核',
            confirmText: "下一步",
            confirmColor: "#333333",
            showCancel: false,
            success: function (res) {
              wx.navigateTo({
                url: '/pages/contactsActivty/activtyDetail/activtyDetail'
              })
            }
          })
        } else if (res.data.status_code == 411001) {
          wx.showModal({
            title: '创建成功',
            content: '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0您创建的该战队,\n\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0已被创建过，是否加入',
            confirmText: "加入",
            cancelText: "重新编辑",
            confirmColor: "#333333",
            success: function (res) {
            if (res.cancel) {
              console.log('用户点击取消')
            }
            }
          })
        } else if (res.data.status_code == 411000) {
          wx.showModal({
            title: '创建成功',
            content: '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0该战队已存在,\n\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0正在审核中',
            confirmText: "下一步",
            cancelText: "取消",
            confirmColor: "#333333",
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '/pages/contactsActivty/activtyDetail/activtyDetail'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  }
})