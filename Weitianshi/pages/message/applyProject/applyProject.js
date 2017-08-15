var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    winWidth: 0,//选项卡
    winHeight: 0,//选项卡
    currentTab: 0,//选项卡
    type: 1 //我申請查看的項目
  },

  onLoad: function (options) {
    console.log(options)
    let type = options.type;
    let that = this;
    that.setData({
      type: type
    })
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    // 申请查看我的项目
    wx.request({
      url: url_common + '/api/message/applyProjectToMe',
      data: {
        user_id : user_id
      },
      method: 'POST',
      success: function (res) {
        console.log("申請查看我的")
        console.log(res)
        let contentList = res.data.data;
        let count1 = res.data.count;
        that.setData({
          count1: 　count1,
          contentList: contentList
        })
      }
    })

    // 我申请查看的项目
    wx.request({
      url: url_common + '/api/message/applyProjectList',
      data: {
        user_id : user_id
      },
      method: 'POST',
      success: function (res) {
        console.log("我申请查看的项目")
        console.log(res)
        let count = res.data.count;
        let applyList = res.data.data;
        that.setData({
          count: count,
          applyList: applyList
        })
      }
    })
  },
  onShow: function () {
    let that = this;
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    let type = this.data.type;
    that.setData({
      requestCheck: true,
      requestCheckBoolean: true,
      currentPage: 1,
      otherCurrentPage: 1,
      page_end: false,
      page_endBoolean: false,
      push_page: 1
    })
    //向后台发送信息取消红点
    wx.request({
      url: url_common + '/api/message/setMessageToRead',
      data: {
        user_id: user_id,
        type_id: type
      },
      method: "POST",
      success: function (res) {
        console.log(res)
        console.log("发送成功")
      }
    })
  },
  /*滑动切换tab*/
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    if (current == 1) {
      //向后台发送信息取消红点
      wx.request({
        url: url_common + '/api/message/setFeedbackToRead',
        data: {
          user_id: user_id,
          type: "apply"
        },
        method: "POST",
        success: function (res) {
          console.log("yes,成功了")
        }
      })
    }
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
  //我申请的项目加载更多
  loadMore: function () {
    //请求上拉加载接口所需要的参数
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var currentPage = this.data.currentPage;
    var request = {
      url: url_common + '/api/message/applyProjectList',
      data: {
        user_id: user_id,
        page: this.data.currentPage
      }
    }
    //调用通用加载函数
    app.loadMore(that, request, "applyList", that.data.applyList)
  },
  // 申请我的项目加载更多
  moreForApply: function () {
    //请求上拉加载接口所需要的参数
    var user_id = wx.getStorageSync("user_id");
    let that = this;
    let contentList = this.data.contentList;

    if (that.data.requestCheckBoolean) {
      if (user_id != '') {
        if (that.data.page_endBoolean == false) {
          wx.showToast({
            title: 'loading...',
            icon: 'loading'
          })
          that.data.push_page++;
          that.setData({
            otherCurrentPage: this.data.push_page,
            requestCheckBoolean: false
          });
          //请求加载数据
          wx.request({
            url: url_common + '/api/message/applyProjectToMe',
            data: {
              user_id: user_id,
              page: this.data.otherCurrentPage
            },
            method: 'POST',
            success: function (res) {
              console.log(res)
              var newPage = res.data.data;
              // console.log(newPage);
              var page_end = res.data.page_end;
              console.log(page_end)
              for (var i = 0; i < newPage.length; i++) {
                contentList.push(newPage[i])
              }
              that.setData({
                contentList: contentList,
                page_endBoolean: page_end,
                requestCheckBoolean: true
              })
            }
          })
        } else {
          rqj.errorHide(that, "没有更多了", that, 3000)
          that.setData({
            requestCheckBoolean: true
          });
        }
      }
    }
  },
  // 点击跳转
  projectDetail: function (e) {
    // 获取我自己的项目id
    var that = this;
    // 获取当前点击的项目id
    var id = e.currentTarget.dataset.project;
    console.log(id);
    // 判斷項目是不是自己的
    wx.request({
      url: url + '/api/project/projectIsMine',
      data: {
        project_id: id
      },
      method: 'POST',
      success: function (res) {
        var that = this;
        var userId = res.data.user_id;
        var user = wx.getStorageSync('user_id');
        if (userId == user) {
          wx.navigateTo({
            url: '/pages/myProject/projectDetail/projectDetail?id=' + id + '&&index=' + 0
          })
        } else {
          wx.navigateTo({
            url: '/pages/projectDetail/projectDetail?id=' + id,
          })
        }
      }
    })
  },
  //点击跳转到用户详情
  personDetail:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.project;
    app.console(id)
    wx.navigateTo({
      url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
    })
  },
  // 点击同意
  btn: function (e) {
    console.log(e)
    let contentList = this.data.contentList;
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    let that = this;
    let record_id = e.currentTarget.dataset.record;
    // status 1:同意  2:拒绝 0:待处理
    let status = e.currentTarget.dataset.status;
    wx.request({
      url: url_common + '/api/message/handleApplyProjectMessage',
      data: {
        user_id : user_id,
        record_id: record_id,
        status: status
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (status == 1) {
          contentList.forEach((x) => {
            if (x.record_id == record_id) {
              x.handle_status = 1
            }
          })
          console.log(contentList)
          that.setData({
            contentList: contentList
          })
        } else if (status == 2) {
          that.setData({
            record_id :record_id
          })
        }
      }
    })
  },
  //重新申请
  matchReApply: function (e) {
    console.log("重新申请")
    console.log(e)
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    let that = this;
    let project_id = e.currentTarget.dataset.project;
    let applyList = this.data.applyList;
    // button-type: 0=申请中 1.申请已通过 2.申请被拒绝(重新申请) 3.推送给我的 4.未申请也未推送(申请按钮)
    wx.request({
      url: url_common + '/api/project/applyProject',
      data: {
        user_id : user_id,
        project_id: project_id
      },
      method: 'POST',
      success: function (res) {
        console.log("重新申请")

        applyList.forEach((x) => {
          if (x.project_id == project_id) {
            console.log("进来了")
            x.handle_status = 0
          }
        })
        that.setData({
          applyList: applyList
        })
      }
    })
  },

})