// pages/message/pushProject/pushProject.js
var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    winWidth: 0,//选项卡
    winHeight: 0,//选项卡
    currentTab: 0,//选项卡
    type: 1, //我申請查看的項目
    hasRedPoint:true,
    // handle_status: 0 // handle_status:待处理:0  感兴趣:1
  },

  onLoad: function (options) {
    console.log(options)
    let type = options.type;
    let that = this;
    that.setData({
      type: type
    })
  },
  onShow: function () {
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    let that = this;
    let type = this.data.type;
    // 推送给我的项目
    wx.request({
      url: url_common + '/api/message/getProjectWithPushToMe',
      data: {
        user_id : user_id
      },
      method: 'POST',
      success: function (res) {
        console.log("推送给我的")
        console.log(res)
        let pushToList = res.data.data;
        let count1 = res.data.count;
        that.setData({
          count1: count1,
          pushToList: pushToList,
        })
      }
    })

    // 我推送的项目
    wx.request({
      url: url_common + '/api/message/pushProjectList',
      data: {
        user_id : user_id
      },
      method: 'POST',
      success: function (res) {
        console.log("我推送的")
        console.log(res)
        let pushProjectList = res.data.data;
        let count = res.data.count;
        that.setData({
          count: count,
          pushProjectList: pushProjectList
        })
      }
    })
    // 向后台发送信息取消红点 推送给我的
    wx.request({
      url: url_common + '/api/message/setMessageToRead',
      data: {
        user_id: user_id,
        type_id: type
      },
      method: "POST",
      success: function (res) {
      }
    })
    that.setData({
      requestCheck: true,
      requestCheckBoolean: true,
      currentPage: 1,
      otherCurrentPage: 1,
      page_end: false,
      page_endBoolean: false,
      push_page: 1
    })
  },
  /*滑动切换tab*/
  bindChange: function (e) {
    var that = this;
    let type = this.data.type;
    var current = e.detail.current;
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    let pushProjectList = this.data.pushProjectList;
    let pushToList = this.data.pushToList;
    if (current == 1) {
        //向后台发送信息取消红点 我推送的项目
        wx.request({
            url: url_common + '/api/message/setFeedbackToRead',
            data: {
                user_id: user_id,
                type: "push"
            },
            method: "POST",
            success: function (res) {
                if (res.data.status_code == 2000000) {
                    pushProjectList.forEach((x) => {
                        x.message_status = 1;
                    })
                    that.setData({
                        hasRedPoint: false
                    })
                }
            }
        })
    } else if (current == 0) {
      wx.request({
        url: url_common + '/api/message/setMessageToRead',
        data: {
          user_id: user_id,
          type_id: type
        },
        method: "POST",
        success: function (res) {
          console.log(1,res)
          if (res.data.status_code == 2000000) {
            pushToList.forEach((x) => {
              x.message_status = 1;
            })
            that.setData({
              pushToList: pushToList
            })
          }

        }
      })
      if(this.data.hasRedPoint===false){
          pushProjectList.forEach((x) => {
              x.message_status = 1;
          })
          that.setData({
              pushProjectList: pushProjectList
          })
      }
    }
    that.setData({ currentTab: e.detail.current });
  },
  /*点击tab切换*/
  swichNav: function (e) {
    var that = this;
    let cancel = this.data.cancel;
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    if (this.data.currentTab === e.target.dataset.current) {
      if (current == 1) {
        //向后台发送信息取消红点 我推送的项目
        wx.request({
          url: url_common + '/api/message/setFeedbackToRead',
          data: {
            user_id: user_id,
            type: "push"
          },
          method: "POST",
          success: function (res) {
            console.log(res)
            if (res.data.status_code == 2000000) {
              pushProjectList.forEach((x) => {
                x.message_status = 1;
              })
              that.setData({
                pushProjectList: pushProjectList
              })
              console.log("yes,成功了")
            }
          }
        })
      } else if (current == 0) {
        wx.request({
          url: url_common + '/api/message/setMessageToRead',
          data: {
            user_id: user_id,
            type_id: type
          },
          method: "POST",
          success: function (res) {
            console.log(res)
            if (res.data.status_code == 2000000) {
              pushToList.forEach((x) => {
                x.message_status = 1;
              })
              that.setData({
                pushToList: pushToList
              })
              console.log("yes,成功了")
            }
          }
        })
      }
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
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
  personDetail: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.project;
    app.console(id)
    wx.navigateTo({
      url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
    })
  },
  //推送给我的加载更多
  loadMore: function () {
    //请求上拉加载接口所需要的参数
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var currentPage = this.data.currentPage;
    var request = {
      url: url_common + '/api/message/getProjectWithPushToMe',
      data: {
        user_id: user_id,
        page: this.data.currentPage
      }
    }
    //调用通用加载函数
    app.loadMore(that, request, "pushToList", that.data.pushToList)
  },
  // 我推送的项目加载更多
  moreForApply: function () {
    //请求上拉加载接口所需要的参数
    var user_id = wx.getStorageSync("user_id");
    let that = this;
    let pushProjectList = this.data.pushProjectList;
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
            url: url_common + '/api/message/pushProjectList',
            data: {
              user_id: user_id,
              page: this.data.otherCurrentPage
            },
            method: 'POST',
            success: function (res) {
              console.log(res)
              var newPage = res.data.data;
              console.log(newPage);
              var page_end = res.data.page_end;
              console.log(page_end)
              for (var i = 0; i < newPage.length; i++) {
                pushProjectList.push(newPage[i])
              }
              that.setData({
                pushProjectList: pushProjectList,
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
  // 感兴趣
  interesting: function (e) {
    console.log(e)
    let that = this;
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    let push_id = e.currentTarget.dataset.push;
    let status = e.currentTarget.dataset.status;
    let pushToList = this.data.pushToList;
    // status: 1 =>感兴趣 2=>不感兴趣 0或3为待处理

    wx.request({
      url: url_common + '/api/message/handlePushProjectMessage',
      data: {
        user_id : user_id,
        push_id: push_id,
        status: status
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        let statusCode = res.data.status_code;
        if (statusCode == 2000000) {
          if (status == 1) {
            console.log("感兴趣")
            pushToList.forEach((x) => {
              if (x.push_id == push_id) {
                x.handle_status = 1
              }
            })
            wx.showToast({
              title: '已感兴趣',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              pushToList: pushToList
            })
          } else if (status == 2) {
            pushToList.forEach((x) => {
              if (x.push_id == push_id) {
                x.handle_status = 2
              }
            })
            that.setData({
              pushToList: pushToList
            })
            console.log("不感兴趣")
          }
        } else {
          console.log(statusCode)
        }

      }
    })
  },
  // 同意或者拒绝
  btn: function (e) {
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    let that = this;
    let record_id = e.currentTarget.dataset.record;
    // status 1:同意  2:拒绝
    let status = e.currentTarget.dataset.status;
    console.log(status)
    wx.request({
      url: url_common + '/api/message/handleApplyProjectMessage',
      data: {
        user_id : user_id,
        record_id: record_id,
        // status: status
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (status == 1) {
          console.log("同意查看")
        } else if (status == 2) {
          console.log("我拒绝")
          that.setData({
            record_id: record_id
          })
        }
      }
    })
  }
})

