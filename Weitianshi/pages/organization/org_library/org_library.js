// pages/organization/org_library/org_library.js
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as SearchModel from '../../../utils/searchModel';
import * as ShareModel from '../../../utils/shareModel';
Page({
  data: {

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
  },

  onShow: function () {

  },
  // 上拉加载
  loadMore: function () {

  },
  //跳转机构详情
  institutionalDetails: function (e) {
    let id = e.currentTarget.dataset.id;

  }
})