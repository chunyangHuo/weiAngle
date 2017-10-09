var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as Search from '../../utils/search';
import * as ShareModel from '../../utils/shareModel';
Page({
  data: {
    //选项卡
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    slectProject: '',
    // 筛选搜索
    SearchInit: Search.data,
  },
  onShow: function () {
    let that = this;
    let user_id = this.data.user_id;
    //初始化数据
    app.initPage(that)
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
    //消除人脉筛选缓存(非contacts都需要)
    app.contactsCacheClear();
    //请求精选项目数据
    app.loginPage(function (user_id) {
      that.setData({
        user_id: user_id
      });
      that.investorList();
    })
  },
  // 点击tab切换
  swichNav: function (e) {
    let that = this;
    let current = e.target.dataset.current;
    that.setData({
      currentTab: e.target.dataset.current
    })
    app.initPage(that);
    this.allReset();
    if (this.data.currentTab === current) {
      this.tabChange(current)
    }
  },
  // 滑动切换tab
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    app.initPage(that);
    this.allReset();
    that.setData({ currentTab: e.detail.current });
    this.tabChange(current);
  },
  // tab页面切换数据调用(辅助函数)
  tabChange(current) {
    if (current === 0) {
      //请求投资人列表
      this.investorList();
    } else if (current === 1) {
      //请求FA列表
      this.faList();
    } else if (current === 2) {
      //请求我的人脉列表
      this.myList();
    }
  },
  //投资人列表信息
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
          SearchInit.currentIndex = 5;
          that.setData({
            investorList: investorList,
            SearchInit: SearchInit

          })
        }
      }
    });
  },
  //FA列表信息
  faList() { },
  //我的人脉列表信息
  myList() {
    let user_id = this.data.user_id;
    let that = this;
    // 检查个人信息全不全
    if (user_id == 0) {
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
          filter: {
            search: "",
            industry: [],
            stage: [],
          }
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading()
          console.log('我的人脉列表', res)
          var contacts = res.data.data;//所有的用户
          var page_end = res.data.page_end;
          if (contacts.length != 0) {
            that.setData({
              empty: 0
            })
          } else if (contacts.length == 0) {

          }
          that.setData({
            contacts: contacts,
            page_end: page_end,
            currentPage: 1
          })
        }
      })
    }
  },
  // 用户详情
  userDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
    })
  },
  // 上拉加载
  loadMore: function () {
    //请求上拉加载接口所需要的参数
    let that = this;
    let user_id = this.data.user_id;
    let currentPage = this.data.currentPage;
    let currentTab = this.data.currentTab;
    switch (currentTab) {
      case 0:
        {
          let request = {
            url: url_common + '/api/resource/getMatchResourceList',
            data: {
              user_id: user_id,
              page: this.data.currentPage,
            }
          }
          //调用通用加载函数
          app.loadMore(that, request, "investorList", that.data.investorList)
        }
        break;
      case 1:
        {
          let request = {
            url: url_common + '/api/resource/getMatchResourceList',
            data: {
              user_id: user_id,
              page: this.data.currentPage,
            }
          }
          //调用通用加载函数
          app.loadMore(that, request, "investorList", that.data.investorList)
        }
        break;
      case 2:
        {
          let request = {
            url: url_common + '/api/project/getMarketProjectList',
            data: {
              user_id: user_id,
              page: this.data.currentPage
            }
          }
          app.loadMore(that, request, "financingNeed", that.data.financingNeed)
        }
        break;
    }

  },
  // 分享当前页面
  onShareAppMessage: function () {
    return ShareModel.discoverInvestShare();
  },
  // 申请查看
  matchApply(e) {
    let that = this;
    app.applyProject(e, that, 'slectProject');
  },
  // 项目详情 
  projectDetail: function (e) {
    var project_id = e.currentTarget.dataset.project;
    // 判斷項目是不是自己的
    wx.request({
      url: url + '/api/project/projectIsMine',
      data: {
        project_id: project_id
      },
      method: 'POST',
      success: function (res) {
        var that = this;
        var userId = res.data.user_id;
        var user = wx.getStorageSync('user_id');
        if (userId == user) {
          wx.navigateTo({
            url: '/pages/myProject/projectDetail/projectDetail?id=' + project_id + '&&index=' + 0
          })
        } else {
          wx.navigateTo({
            url: '/pages/projectDetail/projectDetail?id=' + project_id,
          })
        }
      }
    })
  },
  //找项目投资人
  matchInvestor() {
    wx.navigateTo({
      url: '/pages/matchInvestor/matchInvestor'
    })
  },


  // ------------------------------------筛选搜索-------------------------------------
  // 下拉框
  move(e) {
    let that = this;
    Search.move(e, that)
  },
  // 标签选择
  tagsCheck(e) {
    let that = this;
    Search.tagsCheck(e, that)
  },
  // 筛选重置
  reset() {
    let that = this;
    Search.reset(that)
  },
  // 全部筛选重置
  allReset() {
    let that = this;
    Search.allReset(that);
  },
  // 筛选确定
  searchCertain() {
    let that = this;
    let searchData = Search.searchCertain(that);
    let current = this.data.currentTab;
    if (current == 0) {
      console.log('筛选投资人', searchData);
      this.investorList();
    } else if (current == 1) {
      console.log('筛选FA', searchData)
    } else if (current == 2) {
      console.log('筛选我的', searchData)
    } else {
      console.log('searchCertain()出错了')
    }
  },
  // 点击modal层
  modal() {
    let that = this;
    Search.modal(that)
  },
  //搜索
  searchSth() {
    let that = this;
    Search.searchSth(that)
  },

  //---------------------------我的人脉--------------------------------------------------------------
  // 一键拨号
  telephone: function (e) {
    var telephone = e.currentTarget.dataset.telephone;
    wx.makePhoneCall({
      phoneNumber: telephone,
    })
  },
  //上拉加载
  loadMore: function () {
    //请求上拉加载接口所需要的参数
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var currentPage = this.data.currentPage;
    var industryFilter = wx.getStorageSync("industryFilter") || [];
    var stageFilter = wx.getStorageSync("stageFilter") || [];
    var request = {
      url: url + '/api/user/getMyFollowList',
      data: {
        user_id: user_id,
        page: this.data.currentPage,
        filter: {
          search: "",
          'industry': industryFilter,
          'stage': stageFilter
        }
      }
    }
    //调用通用加载函数
    app.loadMore(that, request, "contacts", that.data.contacts)
  },
})