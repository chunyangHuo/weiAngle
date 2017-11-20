var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    imgUrls: app.globalData.picUrl.project_success
  },
  onLoad: function (options) {
    let type = options.type;
    this.setData({
      type: type
    })
  },
  btnYes: function () {
    let type = this.data.type;
    if (type == 8) {
      wx.navigateBack({
        delta: 2
      })
    } else {
      wx.redirectTo({
        url: '/pages/matchInvestor/matchInvestor'
      });
    }
  }

})