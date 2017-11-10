let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
import * as ShareModel from '../../../../utils/shareModel';
import * as httpModel from '../../../../utils/httpModel';
import * as SearchModel from '../../../../utils/searchModel';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SearchInit: SearchModel.data,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    this.setData({
      investment_id: options.investment_id,
    });

    //更改搜索模块初始化设置
    SearchModel.reInitSearch(that, {
      tab: [
        { type: 2, name: '领域', label: 'label_industry', itemId: 'industry_id', itemName: 'industry_name', longCheckBox: false, page: '0' },
        { type: 1, name: '地区', label: "hotCity", itemId: 'area_id', itemName: 'area_title', longCheckBox: false },
        { type: 1, name: '轮次', label: "stage", itemId: 'stage_id', itemName: 'stage_name', longCheckBox: false },
        { type: 1, name: '时间', label: "label_time", itemId: 'time_id', itemName: 'time_name', longCheckBox: false },
      ],
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.setData({
      requestCheck: true,
      currentPage: 0,
      page_end: false,
      project_list: []
    })
    // app.initPage(that);
    this.loadMore();

  },
  //加载更多
  loadMore() {
    let that = this;
    let currentPage = this.data.currentPage;
    let project_list = this.data.project_list;
    let request = {
      url: url_common + '/api/investment/events',
      data: {
        page: this.data.currentPage,
        investment_id: this.data.investment_id,
        filter: this.data.SearchInit.searchData
      },
    }
    app.loadMore2(that, request, res => {
      console.log("投资案例", res)
      let newPage = res.data.data;
      let list = res.data.data.project_list;
      let page_end = res.data.data.page_end;
      if (list) {
        let newProject = project_list.concat(list)
        currentPage++;
        that.setData({
          newPage: newPage,
          project_list: newProject,
          page_end: page_end,
          requestCheck: true,
          currentPage: currentPage
        })
      }
      if (page_end == true) {
        app.errorHide(that, '没有更多了', 3000)
      }
    })
  },


  // --------------------------筛选搜索--------------------------------------------------

  // 下拉框
  move(e) {
    let that = this;
    let SearchInit = this.data.SearchInit;
    SearchModel.move(e, that)
  },
  // 标签选择
  tagsCheck(e) {
    SearchModel.tagsCheck(e, this)
  },
  // 展示项删除
  labelDelete(e) {
    SearchModel.labelDelete(e, this)
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
    let current = this.data.currentTab;
    let SearchInit = this.data.SearchInit;
    let searchData = SearchModel.searchCertain(that);
    console.log(searchData);
    SearchInit.searchData = searchData;
    this.setData({
      searchInit: SearchInit
    })
    this.loadMore();
    console.log(this.data.SearchInit.searchData)
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
  // 一级联动选择
  firstLinkCheck(e) {
    SearchModel.firstLinkCheck(e, this);
  },
  // 联动选择全部
  linkCheckAll(e) {
    SearchModel.linkCheckAll(e, this);
  },
})