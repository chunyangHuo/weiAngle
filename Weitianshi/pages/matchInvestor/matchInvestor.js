var rqj = require('../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as CreateProject from '../../utils/createProjectBottom'
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
  },
  //----------------------创建项目引导------------------------------------------------ 
  // 跳转创建项目页面
  toCreateProject: function () {
    CreateProject.toCreateProject();
  },
  // 在电脑上创建
  createProjectPc() {
    CreateProject.createProjectPc();
  },
})