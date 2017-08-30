var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({

  data: {

  },

  onLoad: function (options) {

  },

  onShow: function () {
    let team_id = this.data.team_id;
    let user_id = this.data.user_id;
    let that = this;
    wx.request({
      url: url_common + '/api/team/membersList',
      data: {
        // team_id : team_id,
        //user_id :  user_id,
        team_id: 7,
        user_id: 'v0eoXLmp',
        page : 1
      },
      method: 'POST',
      success: function (res) {
        let  warMemberList = res.data.data.members;
        that.setData({
          warMemberList: warMemberList
        })
      }
    })
    that.setData({
      requestCheck: true,
      currentPage: 1,
      page_end: false,
    })
  },
//加载更多
  loadMore: function () {
    //请求上拉加载接口所需要的参数
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var currentPage = this.data.currentPage;
    var request = {
      url: url_common + '/api/team/membersList',
      data: {
        team_id : team_id,
        user_id :  user_id,
        page: this.data.currentPage
      },
    }
    //调用通用加载函数
    app.loadMore(that, request, "warMemberList", that.data.warMemberList)
  },
  //跳转用户详情
  goTo:function(e){
  let id = e.currentTarget.dataset.id;
  wx.navigateTo({
    url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
  })
  }
})