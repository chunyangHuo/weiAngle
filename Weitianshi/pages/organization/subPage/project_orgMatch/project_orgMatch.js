// pages/organization/subPage/list_media/list_media.js
let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
import * as ShareModel from '../../../../utils/shareModel';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      newPage:'',
      requestCheck: true,
      currentPage: 0,
      page_end: false,
      investment_list: []
    })
    // app.initPage(that);
    this.loadMore();
  },
  loadMore() {
    let that = this;
    let currentPage = this.data.currentPage;
    let investment_list = this.data.investment_list;
    let request = {
      url: url_common + '/api/investment/matchs',
      data: {
        page: this.data.currentPage
      },
    }
    app.loadMore2(that, request, res => {
      console.log("机构版买家图谱", res)
      let newPage = res.data.data;
      let list = res.data.data.investment_list;
      let page_end = res.data.data.page_end;
      if (list) {
        let newProject = investment_list.concat(list)
        currentPage++;
        that.setData({
          newPage: newPage,
          investment_list: newProject,
          page_end: page_end,
          requestCheck: true,
          currentPage: currentPage
        })
      }
      console.log("list", that.data.investment_list);
      if (page_end == true) {
        app.errorHide(that, '没有更多了', 3000)
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})