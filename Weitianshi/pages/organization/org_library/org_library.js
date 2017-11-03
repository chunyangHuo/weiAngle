// pages/organization/org_library/org_library.js
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as SearchModel from '../../../utils/searchModel';
import * as ShareModel from '../../../utils/shareModel';
Page({
  data: {
    //筛选搜索
    SearchInit: SearchModel.data
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
      console.log(res)
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
    SearchModel.reInitSearch(that,{
      tab: [
        { name: '领域', check: false, arr: false, id: 'label_industry' },
        { name: '地区', check: false, arr: false, id: "label_area" },
        { name: '风格', check: false, arr: false, id: "label_style" },
        { name: '类型', check: false, arr: false, id: "label_type" }
      ],
    })
  },

  onShow: function () {

  },
  // 上拉加载
  loadMore: function () {

  },
  //跳转机构详情
  institutionalDetails: function (e) {
    let id = e.currentTarget.dataset.id;

  },
  // --------------------------筛选搜索-------------------------------------------------

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

})