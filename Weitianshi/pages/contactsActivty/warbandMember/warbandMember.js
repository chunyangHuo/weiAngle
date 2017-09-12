var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({

  data: {

  },

  onLoad: function (options) {
    let team_id = options.team_id;
    let team_name = options.team_name;
    let that = this;
    that.setData({
      team_id: team_id,
      team_name: team_name
    })
    console.log(options)
    wx.setNavigationBarTitle({
      title: team_name+'的战队成员'
    })
  },

  onShow: function () {
    let that = this;
    let team_id = this.data.team_id;
    let user_id = wx.getStorageSync('user_id');
    //follow_status: 0 未加入战队  1:已加入战队
    wx.request({
      url: url_common + '/api/team/membersList',
      data: {
        team_id: team_id,
        user_id: user_id,
        page: 1
      },
      method: 'POST',
      success: function (res) {
        let follow_status = res.data.data.follow_status;
        let warMemberList = res.data.data.members;
        that.setData({
          warMemberList: warMemberList,
          follow_status: follow_status
        })
        if(warMemberList.length==0) app.errorHide(that,'该战队暂时没有成员',3000) 
      }
    })
    that.setData({
      requestCheck: true,
      currentPage: 1,
      page_end: false
    })
  },
  //加载更多
  loadMore: function () {
    //请求上拉加载接口所需要的参数
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    let team_id = this.data.team_id;
    var currentPage = this.data.currentPage;
    let warMemberList = this.data.warMemberList;

    var request = {
      url: url_common + '/api/team/membersList',
      data: {
        team_id: team_id,
        user_id: user_id,
        page: this.data.currentPage
      }
    }
    app.loadMore2(that, request, res => {
      let members = res.data.data.members;
      let page_end = res.data.data.page_end;
      let NewWarMemberList = warMemberList.concat(members)
      let page = this.data.currentPage;
      that.setData({
        warMemberList: NewWarMemberList,
        page_end: page_end,
        requestCheck: true
      })
    })
  },
  //跳转用户详情
  goTo: function (e) {
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
  },
  //分享页面
  onShareAppMessage: function () {
    let team_name = this.data.team_name;
    let team_id = this.data.team_id;
    return {
      title:team_name+ '正在参与2017首届创投人脉争霸赛，请您支持!',
      path: '/pages/contactsActivty/warbandMember/warbandMember?team_id='+team_id+'&team_name='+team_name,
      imageUrl: "https://weitianshi-2017.oss-cn-shanghai.aliyuncs.com/image/20170904/card_share.jpg",
      success: function (res) {
        console.log('分享成功', res)
      },
    }
  },
  //加入人脉
  addWar:function(e){
    // let xxx = e.currentTarget.dataset.url;
    let user_id = wx.getStorageSync('user_id');
    let team_id = this.data.team_id;
    let follow_status = this.data.follow_status;
    let that = this;
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
            //添加战队
              let user_id = wx.getStorageSync('user_id');
              let arr = [];
              let parameter = [];
              arr.push(user_id);
              arr.push(team_id);
              parameter.push(arr)
              wx.request({
                url: url_common + '/api/team/join',
                data: {
                  teams: parameter
                },
                method: 'POST',
                success: function (res) {
                  if (res.data.status_code == 2000000) {
                   that.setData({
                     follow_status : 1
                   })
                  } else {
                    app.errorHide(that, res.data.error_msg, 3000)
                  }
                }
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
  }
})