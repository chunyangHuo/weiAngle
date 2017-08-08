var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
// pages/message/bePushedProject/bePushedProject.js
Page({

  data: {
    winWidth: 0,//选项卡
    winHeight: 0,//选项卡
    currentTab: 2,//选项卡
  },

  onLoad: function (e) {
    console.log(e)
    if (this.data.currentTab == 0) {
      console.log(this.data.currentTab)
    } else if (this.data.currentTab == 1) {
      console.log(this.data.currentTab)
    }else(
      console.log(this.data.currentTab)
    )
  },
  onShow: function (e) {
    console.log(e)
    // 我申请查看的项目
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    let that = this;
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
          pushToList: pushToList
        })
      }
    })
    // 匹配推荐
    wx.request({
      url: url_common + '/api/investor/getMatchProjectList',
      data: {
        user_id : user_id,
        type: 'only_match'     
      },
      method: 'POST',
      success: function (res) {
        console.log("匹配推荐")
        console.log(res)
        let count2 = res.data.data.match_count;
        let getMatchList = res.data.data.projects;
        // button-type: 0=申请中 1.申请已通过 2.申请被拒绝(重新申请) 3.推送给我的 4.未申请也未推送(申请按钮)
        that.setData({
          count2: count2,
          getMatchList: getMatchList
        })
      }
    })
    // 取消红点 --推送给我的
    wx.request({
      url: url_common + '/api/message/setMessageToRead',
      data: {
        user_id: user_id,
        type_id: "7"
      },
      method: "POST",
      success: function (res) {
        console.log(res)
      }
    })
    that.setData({
      requestCheck: true,
      requestCheckBoolean: true,
      requestCheckThird: true,
      currentPage: 1,
      otherCurrentPage: 1,
      thirdCurrentPage:1,
      page_end: false,
      page_endBoolean: false,
      page_endThird : false,
      push_page: 1,
      match_page:1
    })
    
  },
  /*滑动切换tab*/
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    that.setData({ currentTab: e.detail.current });
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    if (current == 1) {
      //向后台发送信息取消红点 我申请查看的
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
  //匹配更多
  matchMore:function(){
    //请求上拉加载接口所需要的参数
    var user_id = wx.getStorageSync("user_id");
    let that = this;
    let getMatchList = this.data.getMatchList;
    if (that.data.requestCheckThird) {
      if (user_id != '') {
        if (that.data.page_endThird == false) {
          wx.showToast({
            title: 'loading...',
            icon: 'loading'
          })
          that.data.match_page++;
          that.setData({
            thirdCurrentPage: this.data.match_page,
            requestCheckThird: false
          });
          //请求加载数据
          wx.request({
            url: url_common + '/api/investor/getMatchProjectList',
            data: {
              user_id: user_id,
              type: 'only_match',   
              page: this.data.thirdCurrentPage
            },
            method: 'POST',
            success: function (res) {
              console.log(res)
              let newPage = res.data.data.projects;
              console.log(newPage);
              let page_end = res.data.page_end;
              console.log(newPage.length)
              for (var i = 0; i < newPage.length; i++) {
                getMatchList.push(newPage[i])
              }
              that.setData({
                getMatchList: getMatchList,
                page_endThird: page_end,
                requestCheckThird: true
              })
              console.log(getMatchList)
            }
          })
        } else {
          console.log("没有更多")
          rqj.errorHide(that, "没有更多了", that, 3000)
          that.setData({
            requestCheckThird: true
          });
        }
      }
    }
  },
  //推送给我更多
  pushMore:function(){
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
  // 申请查看
  matchApply:function(e){
    console.log(e)
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    let that = this;
    let content = e.currentTarget.dataset.content;
    let project_id = e.currentTarget.dataset.project;
    let index = e.currentTarget.dataset.index;
    let getMatchList = this.data.getMatchList;
      // button-type: 0=申请中 1.申请已通过 2.申请被拒绝(重新申请) 3.推送给我的 4.未申请也未推送(申请按钮)
    if (content == 0) {
      console.log(index)
      getMatchList[index].relationship_button = 0;
      console.log(getMatchList[index].relationship_button)
      that.setData({
        getMatchList: getMatchList[index].relationship_button
      })
    } else if (content == 1) {
      console.log(index)
      console.log(content)
      getMatchList[index].relationship_button = 0;
      console.log(getMatchList[index].relationship_button)
      that.setData({
        getMatchList: getMatchList[index].relationship_button
      })
    }
      wx.request({
        url: url_common + '/api/project/applyProject',
        data: {
          user_id : user_id,
          project_id: project_id
        },
        method: 'POST',
        success: function (res) { 
          console.log(res)
          
        }
      })
  },
  //重新申请
  matchReApply:function(e){
    console.log("重新申请")
  }
})