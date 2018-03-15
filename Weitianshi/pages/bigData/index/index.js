var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;

Page({
  data: {

  },
  onload() {

  },
  onShow() {
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    app.httpPost({
      url: url_common + '/api/source',
      data: {
        user_id: user_id,
      }
    }, that).then(res => {
      let sourceData = res.data.data;
      console.log(sourceData.events_list.list)
      that.setData({
        sourceData: sourceData
      })
    })
  },
  // 全网项目库
  allNetProject() {

  },
  // 最新获投跳转全部
  newProject() {

  }
})