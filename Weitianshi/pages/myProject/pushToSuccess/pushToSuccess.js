var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    imgUrls: app.globalData.picUrl.push_success
  },

  btnYes:function(){
  wx.navigateBack({
    delta:2
  })
}
})