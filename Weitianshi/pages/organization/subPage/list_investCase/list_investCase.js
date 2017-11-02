let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
import * as ShareModel from '../../../../utils/shareModel';
import * as httpModel from '../../../../utils/httpModel';
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
    let that=this;
    that.setData({
      requestCheck: true,
      currentPage: 0,
      page_end: false,
      project_list:[]
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
        page: this.data.currentPage
      },
    }
    app.loadMore2(that, request, res => {
      console.log("投资案例",res)
      let newPage = res.data.data;
      let list = res.data.data.project_list;
      let page_end = res.data.data.page_end;
      if (list) {
        let newProject = project_list.concat(list)
        currentPage++;
        that.setData({
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