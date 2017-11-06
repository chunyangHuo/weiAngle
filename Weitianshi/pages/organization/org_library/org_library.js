// pages/organization/org_library/org_library.js
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as SearchModel from '../../../utils/searchModel';
import * as ShareModel from '../../../utils/shareModel';
Page({
  data: {
    //筛选搜索
    SearchInit: SearchModel.data,
    imgUrls: app.globalData.picUrl.invest_org
  },
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
    app.httpPost({
      url: url_common + '/api/investment/list',
      data: {}
    }).then(res => {
      wx.hideLoading()
      let investormentList = res.data.data;
      let investment_list = investormentList.investment_list;
      that.setData({
        investormentList: investormentList,
        investment_list: investment_list
      })
      wx.hideLoading();
    })

    //更改搜索模块初始化设置
    SearchModel.reInitSearch(that, {
      tab: [
        { name: '领域', label: 'label_industry', itemId: 'industry_id', itemName: 'industry_name', longCheckBox: false },
        { name: '地区', label: "label_area", itemId: 'area_id', itemName: 'area_name', longCheckBox: false },
        { name: '风格', label: "label_style", itemId: 'style_id', itemName: 'style_name', longCheckBox: false },
        { name: '类型', label: "label_type", itemId: 'type_id', itemName: 'type_name', longCheckBox: false }
      ],
    })
  },

  onShow: function () {

  },
  // 上拉加载
  loadMore: function () {
    console.log("loadMore")
    let that = this;
    let user_id = this.data.user_id;
    let currentPage = this.data.currentPage;
    let currentTab = this.data.currentTab;
    var request = {
      url: url_common + '/api/investment/list',
      data: {
      }
    }
    //调用通用加载函数
    app.loadMore(that, request, "investment_list")
  },
  //跳转机构详情
  institutionalDetails: function (e) {
    let id = e.currentTarget.dataset.id;

  },

  // --------------------------筛选搜索--------------------------------------------------
  
  // 下拉框
  move(e) {
    let that = this;
    let SearchInit = this.data.SearchInit;
    if (SearchInit.industry.length < 1) {
      SearchInit.industry = wx.getStorageSync('industry');
      SearchInit.stage = wx.getStorageSync('stage');
      SearchInit.scale = wx.getStorageSync('scale');
      SearchInit.hotCity = wx.getStorageSync('hotCity');
      this.setData({
        SearchInit: SearchInit
      })
    }
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
    SearchInit.currentIndex = 5;
    this.setData({
      SearchInit: SearchInit
    })
    console.log(this.data.SearchInit)
  },
  // 点击modal层
  modal() {
    let that = this;
    SearchModel.modal(that)
  },
  // 搜索
  searchSth() {
    let that = this;
    let str;
    str = this.data.currentTab == 0 ? "selected" : "newest"
    SearchModel.searchSth(that, str)
  },
  //跳转帮助
  guideHelp() {
    app.href('/pages/organization/subPage/guide_help/guide_help')
  },
  //机构详情跳转
  institutionalDetails(e) {
    let id = e.currentTarget.dataset.id;
    app.href('/pages/organization/org_detail/org_detail?id=' + id)
  },

  onShareAppMessage: function () {
    return ShareModel.projectListShare();
  },
})