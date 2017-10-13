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

    //向后台发送信息取消红点
    wx.request({
      url: url_common + '/api/project/metViewed',
      data: {
        user_id: user_id,
        type_id: 9
      },
      method: "POST",
      success:function(res){
        console.log(res)
      }
    })
    this.setData({
      requestCheck: true,
      currentPage: 1,
      page_end: false
    })
  },
  loadMore: function () {
    var that = this;
    let user_id = wx.getStorageSync('user_id');//获取我的user_id
    let project_id = this.data.project_id;
    var currentPage = this.data.currentPage;
    let metList = this.data.metList;
    let list = this.data.list;
    var request = {
      url: url_common + '/api/project/myMet',
      data: {
        user_id : user_id,
        type_id: 9,
        project_id: project_id,
        page: currentPage
      },
    }
    //调用通用加载函数
    app.loadMore2(that, request, res => {
      let rank = res.data.data.messages;
      let page_end = res.data.data.page_end;
      if (rank) {
        let newRank_list = metList.concat(rank)
        that.setData({
          metList: newRank_list,
          page_end: page_end,
          requestCheck: true
        })
      }
    })
  },
  //点击跳转到用户详情
  personDetail: function (e) {
    var id = e.currentTarget.dataset.project;
    app.console(id)
    wx.navigateTo({
      url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
    })
  },
  //推送项目
  pushProject:function(e){
    console.log(e)
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    let pushed_user_id = e.currentTarget.dataset.id;
    let project_id = this.data.project_id;
    let metList = this.data.metList;
    app.operationModel('projectOneKeyPush', that, pushed_user_id, project_id, function (res) {
      console.log(res)
      let statusCode = res.data.status_code;
      if (statusCode == 2000000) {
        console.log(55555555)
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 20000
        })
      }
      metList.forEach((x) => {
        if (x.user_id == pushed_user_id) {
          x.push_status = 1
        }
      })
      console.log(metList)
      that.setData({
        metList: metList
      })
    })
  },
  //添加人脉
  addPerson:function(){
    
  }
})