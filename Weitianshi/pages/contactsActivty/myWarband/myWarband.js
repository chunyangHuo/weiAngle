var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    currentTab: 0,//选项卡
  },


  onLoad: function (options) {

  },

  onShow: function () {
    let user_id = wx.getStorageSync('user_id');
    let that = this;
    //个人信息
    wx.request({
      url: url_common + '/api/team/userRelationshipRank',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        let my_rank = res.data.data.my_rank;
        let rank_list = res.data.data.rank_list;
        that.setData({
          my_rank: my_rank,
          rank_list: rank_list
        })
      }
    })
    //战队信息
    wx.request({
      url: url_common + '/api/team/teamRelationshipRank',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        let team_rank_list = res.data.data.rank_list;
        that.setData({
          team_rank_list: team_rank_list
        })
      }
    })
    that.setData({
      requestCheck: true,
      currentPage: 1,
      page_end: false,
      teamRequestCheck: true,
      teamCurrentPage: 1,
      teamPage_end: false
    })
  },
  /*滑动切换tab*/
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    that.setData({ currentTab: e.detail.current });
  },
  /*点击tab切换*/
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //返回小程序
  backTo: function () {
    wx.switchTab({
      url: '/pages/match/selectProject/selectProject',
    })
  },
  //扩展我的人脉
  expandMyContacts: function () {
    let user_id = wx.getStorageSync('user_id');
    wx.redirectTo({
      url: '/pages/my/qrCode/qrCode?user_id=' + user_id + '&type=' + 1,
    })
  },
  //个人加载更多
  moreThing: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var currentPage = this.data.currentPage;
    let rank_list = this.data.rank_list;
    var request = {
      url: url_common + '/api/team/userRelationshipRank',
      data: {
        user_id: user_id,
        page: this.data.currentPage,
      }
    }
    app.loadMore2(that, request, res => {
      let rank = res.data.data.rank_list;
      let page_end = res.data.page_end;
      if (rank) {
        let newRank_list = rank_list.concat(rank)
        that.setData({
          rank_list: newRank_list,
          page_end: page_end,
          requestCheck: true
        })
      }
    })
  },
  //点击跳转战队人的列表
  allPerson: function (e) {
    let team_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/contactsActivty/warbandMember/warbandMember?team_id=' + team_id,
    })
  },
  //跳转用户详情
  goTo: function (e) {
    let id = e.currentTarget.dataset.applyid;
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
    let follow_status = e.currentTarget.dataset.follow_status;
    let rank_list = this.data.rank_list;
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
          rank_list.forEach((x) => {
            if (x.user_id == applied_user_id) {
              x.follow_status = 2
            }
          })
          that.setData({
            rank_list: rank_list
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
          rank_list.forEach((x) => {
            if (x.user_id == applied_user_id) {
              x.follow_status = 1
            }
          })
          that.setData({
            rank_list: rank_list
          })
        }
      })
    }
  },
  //添加战队
  addTeam: function (e) {
    let user_id = wx.getStorageSync('user_id');
    let team_id = e.currentTarget.dataset.team_id;
    let team_rank_list = this.data.team_rank_list;
    let status = e.currentTarget.dataset.status;
    let that = this;
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
          team_rank_list.forEach((x) => {
            if (x.team_id == team_id) {
              x.follow_status = 1
            }
          })
          that.setData({
            team_rank_list: team_rank_list
          })
        } else {
          app.errorHide(that, res.data.error_msg, 3000)
        }
      }
    })
  },
  //战队的加载更多
  loadMore: function () {
    //请求上拉加载接口所需要的参数
    var user_id = wx.getStorageSync("user_id");
    let that = this;
    let team_rank_list = this.data.team_rank_list;
    if (that.data.teamRequestCheck) {
      if (user_id != '') {
        if (that.data.teamPage_end == false) {
          wx.showToast({
            title: 'loading...',
            icon: 'loading'
          })
          that.data.teamCurrentPage++;
          that.setData({
            teamCurrentPage: this.data.teamCurrentPage,
            teamRequestCheck: false
          });
          //请求加载数据
          wx.request({
            url: url_common + '/api/team/teamRelationshipRank',
            data: {
              user_id: user_id,
              page: this.data.teamCurrentPage
            },
            method: 'POST',
            success: function (res) {
              var newPage = res.data.data.rank_list;
              var page_end = res.data.page_end;
              for (var i = 0; i < newPage.length; i++) {
                team_rank_list.push(newPage[i])
              }
              that.setData({
                team_rank_list: team_rank_list,
                teamPage_end: page_end,
                teamRequestCheck: true
              })
            }
          })
        } else {
          app.errorHide(that, "没有更多了", that, 30000)
          that.setData({
            teamRequestCheck: true
          });
        }
      }
    }
  },
  // 分享名片
  onShareAppMessage(e) {
    let id = e.target.dataset.applyid;
    let name = e.target.dataset.name;
    return {
      title: name + '正在参与2017首届中国创投人脉争霸赛，等你来战!',
      path: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
      imageUrl: "https://weitianshi-2017.oss-cn-shanghai.aliyuncs.com/image/20170904/card_share.jpg",
      success: function (res) {
        console.log('分享成功', res)
      },
    }
  },
})