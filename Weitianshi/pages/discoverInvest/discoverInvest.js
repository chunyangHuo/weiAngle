var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as Search from '../../utils/search'
 Page({
  data: {
    //选项卡
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    slectProject: '',
    // 筛选搜索
    SearchInit:Search.data,
  },
  onShow: function () {
    console.log(this.data.SearchInit)
    let that = this;
    let user_id = this.data.user_id;
    //初始化数据
    app.initPage(that)
    // wx.showLoading({
    //   title: 'loading',
    //   mask: true,
    // })
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
    app.initPage(that)
    if (this.data.currentTab === current) {
      this.tabChange(current)
    }
  },
  // 滑动切换tab
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    app.initPage(that)
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
    wx.request({
      // url: url + '/api/resource/getMatchResource',
      url: url_common + '/api/resource/getMatchResourceList',
      data: {
        user_id: this.data.user_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == '2000000') {
          wx.setStorageSync("resource_find", res.data.data.res_find);
          wx.setStorageSync("resource_give", res.data.data.res_give);
          wx.setStorageSync("resource_desc", res.data.data.res_desc);
          var res_match = res.data.data.match_list;
          var res_find = res.data.data.res_find;
          var res_find_arry = [];
          var res_id = res.data.data.res_id;
          let count3 = res.data.data.match_count;
          if (res_find != '') {
            for (var i = 0; i < res_find.length; i++) {
              res_find_arry.push(res_find[i].resource_name)
            }
          }
          res_find = res_find_arry;
          that.setData({
            res_match: res_match, //资源需求匹配出来的项目
            res_find: res_find,//我正在寻求的资源
            hasPublic2: 1,//是否发布过资源需求
            res_id: res_id,//用过请求资源需求匹配项目的分页接口
            resource_page: 1,//初始化分页数
            resource_page_end: false,//初始化是否还有数据
            count3: count3
          })
        } else {
          that.setData({
            hasPublic2: 0,
            count3: 0
          })
        }
      },
      fail: function (res) { }
    });
  },
  //FA列表信息
  faList() {

  },
  //我的人脉列表信息
  myList() {

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
    app.loadMore(that, request, "slectProject", that.data.slectProject)
  },
  financingNeed() {
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
    app.loadMore(that, request, "financingNeed", that.data.financingNeed)
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
      title: '来微天使找优质人脉',
      path: '/pages/discoverInvest/discoverInvest'
    }
  },
  // 申请查看
  matchApply(e) {
    let that = this;
    app.applyProject(e, that, 'slectProject');
  },
  // 人脉大赛
  competitor: function () {
    wx.navigateTo({
      url: '/pages/contactsActivty/activtyDetail/activtyDetail'
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
  // 筛选确定
  searchCertain() {
    let that = this;
    let searchData = Search.searchCertain(that);
    let current = this.data.currentTab;
    if (current == 0) {
      console.log('筛选精选', searchData)
    } else if (current == 1) {
      console.log('筛选最新', searchData)
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
  }
})