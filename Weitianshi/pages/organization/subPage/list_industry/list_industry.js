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
      url: url_common + '/api/investment/fieldlist',
      data: {}
    }).then(res => {
      console.log(res)
      // status =2 是绿色降 status =1 是红色
      wx.hideLoading()
      let industry_list = res.data.data.industry_list;
      that.setData({
        industry_list: industry_list,
      })
      wx.hideLoading();
    })
  },

})