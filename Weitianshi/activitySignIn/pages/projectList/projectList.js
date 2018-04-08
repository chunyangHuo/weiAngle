var app = getApp();
var url_common = app.globalData.url_common;
Page({
  data: {
    jiandi: false,
    nonet: true
  },
  onLoad(options) {
    let that = this;
    let activity_id = options.activity_id;
    let user_id = wx.getStorageSync("user_id");
    app.httpPost({
      url: url_common + '/api/activity/applyProjectList',
      data: {
        "user_id": user_id,
        "activity_id": activity_id,
        "page": 1
      },
    }).then(res => {
      let applyList = res.data.data.list;
      that.setData({
        applyList: applyList
      })
    })
    that.setData({
      requestCheck: true,
      currentPage: 1,
      page_end: false,
      activity_id: activity_id
    });
  },
  //加载更多
  loadMore() {
    var that = this;
    var request = {
      url: url_common + '/api/activity/applyProjectList',
      data: {
        "user_id": wx.getStorageSync('user_id'),
        "activity_id": this.data.activity_id,
        page: this.data.currentPage
      }
    };
    //调用通用加载函数
    app.loadMore(that, request, "applyList");
  },
})