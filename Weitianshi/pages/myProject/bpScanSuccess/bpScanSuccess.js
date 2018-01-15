var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    nonet: true
  },
  onLoad: function (options) {
    
  },
  onShow: function () {

  },
  route: function () {
    wx.navigateBack({
      delta: 2  // 回退前 delta(默认为1) 页面
    })
  },
  // 重新加载
  refresh() {
    let timer = '';
    wx.showLoading({
      title: 'loading',
      mask: true
    });
    timer = setTimeout(x => {
      wx.hideLoading();
      this.onShow();
    }, 1500)
  }
})