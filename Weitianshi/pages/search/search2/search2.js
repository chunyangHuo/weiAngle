var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({

  data: {
    currentTab: 0,
    value : ''
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  // 点击tab切换
  swichNav: function (e) {
    console.log(e)
    let that = this;
    let current = e.target.dataset.current;
    that.setData({
      currentTab: e.target.dataset.current
    })
    app.initPage(that);
  },
  // 滑动切换tab
  bindChange: function (e) {
    let that = this;
    that.setData({
      currentTab: e.detail.current
    })
    app.initPage(that);
  },
  //输入的内容
  searchSth(e) {
    let value = e.detail.value;
    this.setData({
      searchValue : value
    })
  },
  //搜索确定的按钮
  searchYes() { 

  },
  //搜索指定内容
  jumpToSearch(e) {
    let current = e.currentTarget.dataset.current;
    this.setData({
      currentTab: current
    })
  }
})