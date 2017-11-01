// pages/organization/org_search/org_search.js
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as SearchModel from '../../../utils/searchModel';
import * as ShareModel from '../../../utils/shareModel';
Page({
  data: {
    currentTab: 0,
  },

 
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
    // 点击tab切换
  swichNav: function (e) {
    let that = this;
    let current = e.target.dataset.current;
    that.setData({
      currentTab: e.target.dataset.current
    })
    app.initPage(that);
    // this.allReset();
    if (this.data.currentTab === current) {
      // this.tabChange(current)
    }
  },
  // 滑动切换tab
  bindChange: function (e) {
    let that = this;
    let current = e.detail.current;
    app.initPage(that);
    // this.allReset();
    that.setData({ currentTab: e.detail.current });
    // this.tabChange(current);
  },
})