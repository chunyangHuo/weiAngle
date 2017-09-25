var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as search from '../../utils/search'
Page({
  data: {
    //选项卡
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    slectProject: '',
    //筛选搜索
    firstTime: true,
    tab: [
      { name: '领域', check: false, arr: false, id: 'industry' },
      { name: '轮次', check: false, arr: false, id: "stage" },
      { name: '金额', check: false, arr: false, id: "scale" },
      { name: '地区', check: false, arr: false, id: "hotCity" }
    ],
    currentIndex: 5,
    industryArr: [],
    stageArr: [],
    scaleArr: [],
    hotCityArr: [],
    searchData: {
      industry: [],
      stage: [],
      scale: [],
      hotCity: [],
    },
    //banner
    bannerIndex: 0,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
  },
  onShow: function () {
    let that = this;
    let user_id = this.data.user_id;
    let industry = wx.getStorageSync('industry');
    let stage = wx.getStorageSync('stage');
    let scale = wx.getStorageSync('scale');
    let hotCity = wx.getStorageSync('hotCity');
    //初始化数据
    app.initPage(that)
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
    this.setData({
      industry: industry,
      stage: stage,
      scale: scale,
      hotCity: hotCity
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
    if (this.data.currentTab === current) {
      this.tabChange(current)
    }
  },
  // 滑动切换tab
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    that.setData({ currentTab: e.detail.current });
    this.tabChange(current);
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
    wx.request({
      url: url_common + '/api/project/getMarketProjectList',
      data: {
        user_id: this.data.user_id
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        var financingNeed = res.data.data;
        that.setData({
          financingNeed: financingNeed,
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })
  },
  // 请求精选tab页面数据(辅助函数)
  selectProject() {
    let that = this;
    app.httpPost({
      url: url_common + '/api/project/getSelectedProjectList',
      data: {
        user_id: this.data.user_id
      }
    }).then(res => {
      wx.hideLoading()
      var slectProject = res.data.data;
      that.setData({
        slectProject: slectProject,
      })
    })
  },
  // 提交form
  formSubmit(e) {
    console.log(e)
  },
  // 上拉加载
  loadMore: function () {
    console.log(1)
    //请求上拉加载接口所需要的参数
    var that = this;
    var user_id = this.data.user_id;
    var currentPage = this.data.currentPage;
    var request = {
      url: url_common + '/api/project/getSelectedProjectList',
      data: {
        user_id: user_id,
        page: this.data.currentPage,
      }
    }
    //调用通用加载函数
    app.loadMore(that, request, "slectProject", that.data.slectProject)
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
    return {
      title: '来微天使找优质项目',
      path: '/pages/match/selectProject/selectProject'
    }
  },
  // 跳转创建项目页面
  toCreateProject: function () {
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
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
            wx.navigateTo({
              url: '/pages/myProject/publishProject/publishProject'
            })
          } else if (complete == 0) {
            wx.navigateTo({
              url: '/pages/register/companyInfo/companyInfo?type=1'
            })
          }
        } else {
          wx.navigateTo({
            url: '/pages/register/personInfo/personInfo?type=2'
          })
        }
      },
    });
  },
  // 申请查看
  matchApply(e){
    let that=this;
    app.applyProject(e, that,'slectProject');
  },
  // 人脉大赛
  competitor: function () {
    wx.navigateTo({
      url: '/pages/contactsActivty/activtyDetail/activtyDetail'
    })
  },
  // 下拉框
  move(e) {
    let that = this;
    search.move(e, that)
  },
  // 标签选择
  tagsCheck(e) {
    let that = this;
    search.tagsCheck(e, that)
  },
  // 筛选重置
  reset() {
    let that = this;
    search.reset(that)
  },
  // 筛选确定
  searchCertain() {
    let that = this;
    let searchData = search.searchCertain(that);
    let current = this.data.currentTab;
    if(current==0){
      console.log('筛选精选',searchData)
    }else if(current==1){
      console.log('筛选最新',searchData)
    }else{
      console.log('searchCertain()出错了')
    }
  },
  // 点击modal层
  modal() {
    let that = this;
    search.modal(that)
  },
  //搜索
  searchSth() {
    let that = this;
    search.searchSth(that)
  }
})