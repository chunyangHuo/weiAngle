// pages/my/myNew/myNew.js
Page({
  data: {

  },
  onLoad: function (options) {

  },

  onShow: function () {

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
    wx.navigateTo({
      url: '/pages/message/collectProject/collectProject',
    })
  }
})