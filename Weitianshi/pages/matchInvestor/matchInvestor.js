var rqj = require('../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {

  },
  onLoad() {
    this.getMyProject();
  },
  onShow() {

  },
  getMyProject() {
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    wx.showLoading({
      title: 'loading',
    })
    wx.request({
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: user_id,
        type: 'match'
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log('我的项目列表', res)
        let myProject = res.data.data;
        //刷新数据
        that.setData({
          myProject: myProject,
        })
      }
    })
  }
})