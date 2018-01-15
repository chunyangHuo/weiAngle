import * as FilterModel from '../../utils/filterModel';
import * as CreateProject from '../../utils/createProjectBottom';
import * as ShareModel from '../../utils/shareModel';
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    //选项卡
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    slectProject: '',
    hidden: true,
    //筛选搜索
    SearchInit: FilterModel.data,
    //banner 
    bannerIndex: 0,
    modalBox: 0,
    insideColor: true,
    imgUrls: [
      app.globalData.picUrl.banner_1,
      app.globalData.picUrl.banner_3,
      app.globalData.picUrl.banner_4,
      app.globalData.picUrl.banner_5,
    ],
    imgUrls1: app.globalData.picUrl.page_discoverProject,
    atBottom: false,
    nonet: true
  },
  onLoad(options) {
    let that = this;
    let user_id = this.data.user_id;
    this.noSearch();
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
    app.netWorkChange(that)
  },
  onShow() {
    let that = this;
    that.selectProject();
  },
  onReady() {
    let that = this;
    // 无缓存用户FilterModel预处理
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
          thisData.hotCity.forEach((x) => { x.check = false })
          wx.setStorageSync("industry", thisData.industry)
          wx.setStorageSync("scale", thisData.scale)
          wx.setStorageSync("stage", thisData.stage)
          wx.setStorageSync('hotCity', thisData.hotCity)
          // 筛选的初始缓存
          let SearchInit = that.data.SearchInit;
          SearchInit.industry = wx.getStorageSync('industry');
          SearchInit.stage = wx.getStorageSync('stage');
          SearchInit.scale = wx.getStorageSync('scale');
          SearchInit.hotCity = wx.getStorageSync('hotCity');
          that.setData({
            SearchInit: SearchInit
          })
          console.log(SearchInit)
        },
      })
    }
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
  // 轮播图跳转
  bannerLink(e) {
    let index = e.currentTarget.dataset.index + 1;
    app.href('/pages/activtyPage/activtyPage/activtyPage?index=' + index)
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.selectProject();
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
      url: url_common + '/api/project/getSelectedAndMarketProjectList',
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
      url: url_common + '/api/project/getSelectedAndMarketProjectList',
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

  // 跳转投资机构
  jumpOrg() {
    wx.navigateTo({
      url: '/pages/discoverInvest/institutionalInvest/institutionalInvest',
    })
  },
  //投资人
  jumpInvestor() {
    wx.navigateTo({
      url: '/pages/discover/discoverPerson/discoverPerson',
    })
  },
  //FA融资顾问
  jumpFinancingAdvisor() {
    wx.navigateTo({
      url: '/pages/discover/financingAdvisor/financingAdvisor',
    })
  },
  //潜在投资方
  potentialInvestor() {
    wx.navigateTo({
      url: '/pages/matchInvestor/matchInvestor',
    })
  },
  //跳转搜索页面
  searchMore() {
    wx.navigateTo({
      url: '/pages/search/search2/search2',
    })
  },
  netWork() {
    wx.onNetworkStatusChange(function (res) {
      console.log(111)
      console.log(res.isConnected)
      let that = this;
      if (res.isConnected) {
        this.setData({
          aa: res.isConnected
        })
      } else {
        this.setData({
          aa: res.isConnected
        })
      }
      console.log(res.networkType)
    })
  }
})