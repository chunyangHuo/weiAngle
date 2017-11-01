var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import  *  as  SearchModel  from  '../../../../utils/searchModel';
import * as ShareModel from '../../../../utils/shareModel';
Page({
  data: {

  },

  onLoad: function (options) {

  },

  onShow: function () {
    let that = this;
    app.httpPost({
      url: url_common + '//api/investment/industrylist',
      data: {}
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      let industry_list = res.data.data;
      that.setData({
        industry_list: industry_list,
      })
      wx.hideLoading();
    })
  },

})