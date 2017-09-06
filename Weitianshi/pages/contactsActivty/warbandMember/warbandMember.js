var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({

  data: {

  },

  onLoad: function (options) {
    let team_id = options.team_id;
    let that = this;
    that.setData({
      team_id: team_id
    })
  },

  onShow: function () {
    let that = this;
    let team_id = this.data.team_id;
    let user_id = wx.getStorageSync('user_id');
    wx.request({
      url: url_common + '/api/team/membersList',
      data: {
        team_id: team_id,
        user_id: user_id,
        page: 1
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        let warMemberList = res.data.data.members;
        that.setData({
          warMemberList: warMemberList
        })
        if(warMemberList.length==0) app.errorHide(that,'该战队暂时没有成员',3000) 
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
        team_id: team_id,
        user_id: user_id,
        page: this.data.currentPage
      },
    }
    //调用通用加载函数
    app.loadMore(that, request, "warMemberList", that.data.warMemberList)
  },
  //跳转用户详情
  goTo: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let user_id = wx.getStorageSync('user_id');
    if (user_id == id) {
      wx.switchTab({
        url: '/pages/my/my/my',
      })
    } else {
      wx.navigateTo({
        url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
      })
    }

  },
  //添加人脉
  addPerson: function (e) {
    let user_id = wx.getStorageSync('user_id');
    let applied_user_id = e.currentTarget.dataset.applyid;
    let follow_status = e.currentTarget.dataset.status;
    let warMemberList = this.data.warMemberList;
    let that = this;
    if (follow_status == 0) {
      wx.request({
        url: url + '/api/user/UserApplyFollowUser',
        data: {
          user_id: user_id,
          applied_user_id: applied_user_id
        },
        method: 'POST',
        success: function (res) {
          warMemberList.forEach((x) => {
            if (x.user_id == applied_user_id) {
              x.follow_status = 2
            }
          })
          that.setData({
            warMemberList: warMemberList
          })
        }
      })
    } else if (follow_status == 3) {
      wx.request({
        url: url + '/api/user/handleApplyFollowUser',
        data: {
          user_id: user_id,
          apply_user_id: applied_user_id
        },
        method: 'POST',
        success: function (res) {
          //将状态改为"已互为人脉
        warMemberList.forEach((x) => {
          if (x.user_id == applied_user_id) {
            x.follow_status = 1
          }
        })
        that.setData({
          warMemberList: warMemberList
        })
      }
      })
    } 
  }
})