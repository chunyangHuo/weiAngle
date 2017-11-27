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
    hidden: true,
    //筛选搜索
    SearchInit: SearchModel.data,
    //banner
    bannerIndex: 0,
    modalBox: 0,
    imgUrls: [
      app.globalData.picUrl.banner_1,
      app.globalData.picUrl.banner_3,
      app.globalData.picUrl.banner_4,
      app.globalData.picUrl.banner_5,
    ],
    imgUrls1: app.globalData.picUrl.page_discoverProject,
  },
  onLoad(options) {
    let that = this;
    let user_id = this.data.user_id;
    if (options.currentTab) {
      this.setData({
        currentTab: options.currentTab
      })
    }
    this.noSearch();

    // ------------下面获取缓存是必要的,不要删除--------------------------------------------------
    // 无缓存用户searchModel预处理
    if (!that.data.SearchInit.industry) {
      //获取筛选项所需的信息并存入缓存
      wx.request({
        url: url_common + '/api/category/getProjectCategory',
        method: 'POST',
        success: function (res) {
          // console.log('getProjectCategory',res)
          let thisData = res.data.data;
          thisData.area.forEach((x) => { x.check = false })
          thisData.industry.forEach((x) => { x.check = false })
          thisData.scale.forEach((x) => { x.check = false })
          thisData.stage.forEach((x) => { x.check = false })
          wx.setStorageSync("industry", thisData.industry)
          wx.setStorageSync("scale", thisData.scale)
          wx.setStorageSync("stage", thisData.stage)
        },
      })
      wx.request({
        url: url_common + '/api/category/getHotCity',
        data: {},
        method: 'POST',
        success: function (res) {
          let hotCity = res.data.data;
          hotCity.forEach((x) => {
            x.check = false;
          })
          wx.setStorageSync('hotCity', hotCity)
          // 筛选的初始缓存
          let SearchInit = that.data.SearchInit;
          SearchInit.industry = wx.getStorageSync('industry');
          SearchInit.stage = wx.getStorageSync('stage');
          SearchInit.scale = wx.getStorageSync('scale');
          SearchInit.hotCity = wx.getStorageSync('hotCity');
          that.setData({
            SearchInit: SearchInit
          })
        }
      });
    }

    //初始化数据
    app.initPage(that)
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
    //请求精选项目数据
    app.loginPage(function (user_id) {
      that.setData({
        user_id: user_id
      });
      that.selectProject();
    })
  },
  // 不显示项目库的筛选项(辅助函数)
  noSearch() {
    if (this.data.currentTab == 2) {
      this.setData({
        hidden: false
      })
    } else {
      this.setData({
        hidden: true
      })
    }
  },
  // 点击tab切换
  swichNav: function (e) {
    let that = this;
    let current = e.target.dataset.current;
    that.setData({
      currentTab: e.target.dataset.current
    })
  },
  // 滑动切换tab
  bindChange: function (e) {
    let that = this;
    let current = e.detail.current;
    let searchData = that.data.SearchInit.searchData;
    let searchLength = searchData.industry.length + searchData.stage.length + searchData.scale.length + searchData.hotCity.length;
    app.initPage(that);
    that.setData({ currentTab: e.detail.current });
    this.noSearch();
    this.allReset();
    // 进入tab页时该tab页无数据则请求接口
    if (current == 0) {
      if (!that.data.slectProject) {
        this.selectProject();
      }
    } else if (current == 1) {
      if (!that.data.financingNeed) {
        this.newestProject();
      }
    }
    // 如果当前tab使用过筛选功能,则重置所有tab页数据
    if (searchLength != 0) {
      that.setData({
        financingNeed: that.data.financingNeed2,
        slectProject: that.data.slectProject2
      })
    }
  },
  // 轮播图跳转
  bannerLink(e) {
    let index = e.currentTarget.dataset.index + 1;
    app.href('/pages/activtyPage/activtyPage/activtyPage?index=' + index)
  },
  // 下拉刷新
  onPullDownRefresh() {
    let current = this.data.currentTab;
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
    if (!that.data.financingNeed) {
      wx.showLoading({
        title: 'loading',
        mask: true,
      })
    }
    wx.request({
      url: url_common + '/api/project/getMarketProjectList',
      data: {
        user_id: this.data.user_id,
        filter: this.data.SearchInit.searchData
      },
      method: 'POST',
      success: function (res) {
        var financingNeed = res.data.data;
        console.log('最新', financingNeed);
        // 将无筛选条件的最新列表存入变量以备使用
        if (!that.data.financingNeed) {
          that.setData({
            financingNeed2: financingNeed
          })
        }
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
    if (!that.data.slectProject) {
      wx.showLoading({
        title: 'loading',
        mask: true,
      })
    }
    app.httpPost({
      url: url_common + '/api/project/getSelectedProjectList',
      data: {
        user_id: this.data.user_id,
        filter: this.data.SearchInit.searchData
      }
    }, that).then(res => {
      wx.hideLoading()
      var slectProject = res.data.data;
      console.log('精选', slectProject)
      // 将无筛选条件的精选列表存入变量以备使用
      if (!that.data.financingNeed) {
        that.setData({
          slectedProject2: slectProject
        })
      }
      that.setData({
        slectProject: slectProject,
      })
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
        filter: this.data.SearchInit.searchData,
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
        filter: this.data.SearchInit.searchData,
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
          app.href('/pages/myProject/projectDetail/projectDetail?id=' + project_id + '&&index=' + 0)
        } else {
          app.href('/pages/projectDetail/projectDetail?id=' + project_id)
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
    let financingNeed = that.data.financingNeed;
    let currentTab = that.data.currentTab;
    app.operationModel('projectApply', pro_id, res => {
      console.log(res)
      if (currentTab == 0) {
        slectProject.forEach(x => {
          if (x.project_id == pro_id) {
            x.relationship_button = 0;
          }
        })
      } else {
        financingNeed.forEach(x => {
          if (x.project_id == pro_id) {
            x.relationship_button = 0;
          }
        })
      }
      that.setData({
        slectProject: slectProject,
        financingNeed: financingNeed
      })
    });
  },
  // 人脉大赛
  competitor: function () {
    app.href('/pages/contactsActivty/activtyDetail/activtyDetail')
  },
  // --------------------------筛选搜索--------------------------------------------------
  // 下拉框
  move(e) {
    let that = this;
    SearchModel.move(e, that)
  },
  // 标签选择
  tagsCheck(e) {
    SearchModel.tagsCheck(e, this)
  },
  // 筛选重置
  reset() {
    SearchModel.reset(this)
  },
  // 筛选全部重置
  allReset() {
    SearchModel.allReset(this)
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
    SearchInit.currentIndex = 99;
    this.setData({
      SearchInit: SearchInit
    })
    console.log(this.data.SearchInit)
  },
  // 点击modal层
  modal() {
    SearchModel.modal(this)
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
  //去电脑上传
  toPc: function () {
    this.setData({
      modalBox: 1
    })
  },
  //关闭模态框
  closeModal: function () {
    this.setData({
      modalBox: 0
    })
  },
})