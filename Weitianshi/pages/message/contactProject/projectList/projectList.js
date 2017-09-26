// pages/message/contactProject/projectList/projectList.js
var rqj = require('../../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {

  },
  onLoad: function (options) {
    let project_id = options.id;
    this.setData({
      project_id: project_id
    })
  },
  onShow: function () {
    let user_id = wx.getStorageSync('user_id');//获取我的user_id
    let project_id = this.data.project_id;
    let that = this;
    wx.request({
      url: url_common + '/api/project/myMet',
      data: {
        user_id : user_id,
        type_id: 9,
        project_id: project_id,
        page: 1
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        let projectMessage = res.data.data.project;
        let metList = res.data.data.messages;
        let count = res.data.data.count;
        that.setData({
          projectMessage: projectMessage,
          metList: metList,
          count: count
        })
      }
    })
  },
})