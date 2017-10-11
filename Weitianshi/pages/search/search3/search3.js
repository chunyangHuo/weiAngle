var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as SearchModel from '../../../utils/searchModel';
Page({
  data: {
    SearchInit: SearchModel.data,
    financingNeed: [],//最新
    slectProject: [],
    investorList: [],
    faList: [],
    contacts: [],
  },
  onLoad: function (options) {
    let that = this;
    let user_id = options.user_id;
    let entrance = options.entrance;
    // entrance: slected,newest,investorList,faList,myList
    this.setData({
      user_id: user_id,
      entrance: entrance
    });
    app.initPage(that);
  },
  //搜索事件
  searchSth: function (e) {
    let that = this;
    let user_id = this.data.user_id;
    let currentUser = wx.getStorageSync('user_id');
    let entrance = this.data.entrance;
    let str = e.detail.value;
    let SearchInit = this.data.SearchInit;
    let timer = this.data.timer;
    SearchInit.searchData.search = str;
    this.setData({
      SearchInit: SearchInit
    })
    //防止多次请求进行延时处理
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(x => {
      wx.showLoading({
        title: 'loading',
        mask: true
      })
      switch (entrance) {
        case 'selected':

          this.selectedProject();
          break;
        case 'newest':
          this.newestProject();
          break;
        case "investorList":
          this.investorList();
          break;
        case "faList":
          this.faList();
          break;
        case "myList":
          this.myList();
          break;
      }
    }, 1500)
    this.setData({
      timer: timer,
    })
  },
  // 取消
  searchEsc: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //点击进入项目详情
  projectDetail(e) {
    let id = e.currentTarget.dataset.id;
    let user_id = this.data.user_id;
    let currentUser = wx.getStorageSync('user_id');
    console.log(user_id)
    console.log(currentUser)
    if (user_id == currentUser) {
      wx.navigateTo({
        url: '/pages/myProject/projectDetail/projectDetail?id=' + id + '&&index=' + 0
      })
    } else if (user_id != currentUser) {
      wx.navigateTo({
        url: '/pages/projectDetail/projectDetail?id=' + id,
      })
    }
  },
  //点击进入用户详情
  userDetail(e) {

  },
  //上拉加载
  myPublicProject: function () {
    let entrance = this.data.entrance;
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    let request;
    switch (entrance) {
      case 'newest':
        request = {
          url: url_common + '/api/project/getMarketProjectList',
          data: {
            user_id: this.data.user_id,
            page: this.data.currentPage
          }
        }
        app.loadMore(that, request, "financingNeed")
      case 'selected':
        request = {
          url: url_common + '/api/project/getSelectedProjectList',
          data: {
            user_id: user_id,
            page: this.data.currentPage,
          }
        }
        //调用通用加载函数
        app.loadMore(that, request, "slectProject")
      case 'investorList':
        {
          request = {
            url: url_common + '/api/investor/getInvestorListByGroup',
            data: {
              user_id: user_id,
              type: 'investor',
              page: this.data.currentPage,
              filter: this.data.SearchInit.searchData
            }
          }
          //调用通用加载函数
          app.loadMore(that, request, "investorList")
        }
        break;
      case 'faList':
        {
          request = {
            url: url_common + '/api/investor/getInvestorListByGroup',
            data: {
              user_id: user_id,
              type: 'fa',
              page: this.data.currentPage,
              filter: this.data.SearchInit.searchData
            }
          }
          //调用通用加载函数
          app.loadMore(that, request, "faList")
        }
        break;
      case 'myList':
        {
          request = {
            url: url_common + '/api/project/getMarketProjectList',
            data: {
              user_id: user_id,
              page: this.data.currentPage,
              filter: this.data.SearchInit.searchData
            }
          }
          //调用通用加载函数
          app.loadMore(that, request, "financingNeed")
        }
        break;
    }
  },

  // ----------------------------------获取搜索结果---------------------------------------------------
  // 最新
  newestProject() {
    let that = this;
    wx.request({
      url: url_common + '/api/project/getMarketProjectList',
      data: {
        user_id: this.data.user_id,
        filter: this.data.SearchInit.searchData
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        console.log('最新', res)
        var financingNeed = res.data.data;
        that.setData({
          financingNeed: financingNeed,
        })
      }
    })
  },
  // 精选
  selectedProject() {
    let that = this;
    app.httpPost({
      url: url_common + '/api/project/getSelectedProjectList',
      data: {
        user_id: this.data.user_id,
        filter: this.data.SearchInit.searchData
      }
    }).then(res => {
      wx.hideLoading();
      var slectProject = res.data.data;
      console.log('精选', res)
      that.setData({
        slectProject: slectProject,
      })
    })
  },
  // 投资人
  investorList() {
    let that = this;
    let SearchInit = this.data.SearchInit;
    wx.request({
      url: url_common + '/api/investor/getInvestorListByGroup',
      data: {
        user_id: this.data.user_id,
        type: 'investor',
        filter: this.data.SearchInit.searchData
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == '2000000') {
          console.log('投资人列表', res.data.data)
          wx.hideLoading();
          var investorList = res.data.data;
          that.setData({
            investorList: investorList,
          })
        }
      }
    });
  },
  // FA
  faList() {
    let that = this;
    let SearchInit = this.data.SearchInit;
    wx.request({
      url: url_common + '/api/investor/getInvestorListByGroup',
      data: {
        user_id: this.data.user_id,
        type: 'fa',
        filter: this.data.SearchInit.searchData
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == '2000000') {
          console.log('FA列表', res.data.data)
          wx.hideLoading();
          var faList = res.data.data;
          that.setData({
            faList: faList,
          })
        }
      }
    });
  },
  // 我的人脉
  myList() {
    let user_id = this.data.user_id;
    let that = this;
    let SearchInit = this.data.SearchInit;
    // 检查个人信息全不全
    if (user_id != 0) {
      wx.request({
        url: url_common + '/api/user/checkUserInfo',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            notIntegrity: res.data.is_complete,
            empty: 1
          })
        },
      })
    }
    // 获取人脉库信息
    if (user_id) {
      wx.showLoading({
        title: 'loading',
        mask: true,
      })
      wx.request({
        url: url_common + '/api/user/getMyFollowList',
        data: {
          user_id: user_id,
          page: 1,
          filter: SearchInit.searchData
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading();
          console.log('我的人脉列表', res);
          if (res.data.status_code == '2000000') {
            var contacts = res.data.data;//所有的用户
            var page_end = res.data.page_end;
            that.setData({
              contacts: contacts,
              page_end: page_end,
            })
          }
        }
      })
    }
  },
})