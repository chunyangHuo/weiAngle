var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as SearchModel from '../../utils/searchModel';
import * as CreateProject from '../../utils/createProjectBottom';
import * as ShareModel from '../../utils/shareModel';
Page({
  data: {
    //选项卡
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    slectProject: '',
    //筛选搜索
    SearchInit: SearchModel.data,
    //banner
    bannerIndex: 0,
    imgUrls: [
      app.globalData.picUrl.activtyBanner,
      app.globalData.picUrl.banner_workBench,
    ],
  },
  onShow: function () {
    let that = this;
    let user_id = this.data.user_id;

    // app.operationModel('projectApply')


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
      that.selectProject();
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
  // 轮播图跳转
  bannerLink(e) {
    let index = e.currentTarget.dataset.index;
    switch (index) {
      case 0:
        wx.navigateTo({
          url: '/pages/contactsActivty/activtyDetail/activtyDetail',
        })
        break;
      case 1:
        wx.navigateTo({
          url: '/pages/contactsActivty/activtyPage/workBenchJump/workBenchJump',
        })
        break;
    }
  },
  // tab页面切换数据调用(辅助函数)
  tabChange(current) {
    if (current === 0) {
      //请求精选项目列表
      this.selectProject();
    } else if (current === 1) {
      //请求最新项目列表
      this.newestProject();
    }
  },
  // 请求最新tab页面项目数据(辅助函数)
  newestProject() {
    let that = this;
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
    wx.request({
      url: url_common + '/api/project/getMarketProjectList',
      data: {
        user_id: this.data.user_id,
        filter: this.data.SearchInit.searchData
      },
      method: 'POST',
      success: function (res) {
        console.log('最新', res)
        var financingNeed = res.data.data;
        financingNeed.forEach(x => {
          x.pro_time = x.pro_time.substr(5, 11);
          console.log(x.pro_time)
        })
        console.log(financingNeed)
        that.setData({
          financingNeed: financingNeed,
        })
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  // 请求精选tab页面数据(辅助函数)
  selectProject() {
    let that = this;
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
    app.httpPost({
      url: url_common + '/api/project/getSelectedProjectList',
      data: {
        user_id: this.data.user_id,
        filter: this.data.SearchInit.searchData
      }
    }).then(res => {
      wx.hideLoading()
      var slectProject = res.data.data;
      that.setData({
        slectProject: slectProject,
      })
      wx.hideLoading();
    })
  },
  // 上拉加载
  loadMore: function () {
    //请求上拉加载接口所需要的参数
    let that = this;
    let user_id = this.data.user_id;
    let currentPage = this.data.currentPage;
    let request = {
      url: url_common + '/api/project/getSelectedProjectList',
      data: {
        user_id: user_id,
        page: this.data.currentPage,
      }
    }
    //调用通用加载函数
    app.loadMore(that, request, "slectProject")
  },
  loadMore2() {
    let that = this;
    let user_id = this.data.user_id;
    let currentPage = this.data.currentPage;
    let request = {
      url: url_common + '/api/project/getMarketProjectList',
      data: {
        user_id: this.data.user_id,
        page: this.data.currentPage
      }
    }
    app.loadMore(that, request, "financingNeed")
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
  // 分享当前页面
  onShareAppMessage: function () {
    return ShareModel.discoverProjectShare();
  },
  // 申请查看
  matchApply(e) {
    let that = this;
    let pro_id = e.currentTarget.dataset.project;
    let slectProject = that.data.slectProject;

    app.operationModel('projectApply', pro_id, res => {
      slectProject.forEach(x => {
        if (x.project_id == pro_id) {
          x.relationship_button = 1;
        }
      })
      that.setData({
        slectProject: slectProject
      })
    });
  },
  // 人脉大赛
  competitor: function () {
    wx.navigateTo({
      url: '/pages/contactsActivty/activtyDetail/activtyDetail'
    })
  },
  // --------------------------筛选搜索--------------------------------------------------
  // 下拉框
  move(e) {
    let that = this;
    SearchModel.move(e, that)
  },
  // 标签选择
  tagsCheck(e) {
    let that = this;
    SearchModel.tagsCheck(e, that)
  },
  // 筛选重置
  reset() {
    let that = this;
    SearchModel.reset(that)
  },
  // 筛选全部重置
  allReset() {
    let that = this;
    SearchModel.allReset(that)
  },
  // 筛选确定
  searchCertain() {
    let that = this;
    let searchData = SearchModel.searchCertain(that);
    let current = this.data.currentTab;
    let SearchInit = this.data.SearchInit;
    SearchInit.searchData = searchData;
    this.setData({
      searchInit: SearchInit
    })
    if (current == 0) {
      console.log('筛选精选', searchData)
      this.selectProject();
    } else if (current == 1) {
      console.log('筛选最新', searchData)
      this.newestProject();
    } else {
      console.log('searchCertain()出错了')
    }
    SearchInit.currentIndex = 5;
    this.setData({
      SearchInit: SearchInit
    })
  },
  // 点击modal层
  modal() {
    let that = this;
    SearchModel.modal(that)
  },
  //搜索
  searchSth() {
    let that = this;
    let str;
    str = this.data.currentTab == 0 ? "selected" : "newest"
    SearchModel.searchSth(that, str)
  },

  //----------------------创建项目引导------------------------------------------------ 
  // 跳转创建项目页面
  toCreateProject: function () {
    CreateProject.toCreateProject();
  },
  // 在电脑上创建
  createProjectPc() {
    CreateProject.createProjectPc();
  },
})