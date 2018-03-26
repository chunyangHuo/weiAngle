var app = getApp();
var url_common = app.globalData.url_common;
Page({
  data: {
    jiandi: false,
    nonet: true
  },
  onLoad() {
    let that = this;
    let user_id = wx.getStorageSync("user_id");
    app.httpPost({
      url: url_common + '/api/activity/applyProjectList',
      data: {
        "user_id": user_id,
        "activity_id": 21,
        "page": 1
      },
    }).then(res => {
      console.log(res)
      let applyList = res.data.data.list;
      that.setData({
        applyList : applyList
      })
    })
    that.setData({
      requestCheck: true,
      currentPage: 1,
      page_end: false
    });
  },
  //加载更多
  loadMore(){
    console.log(1111)
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var request = {
      url: url_common + '/api/activity/applyProjectList',
      data: {
        user_id: user_id,
        page: this.data.currentPage
      }
    };
    //调用通用加载函数
    app.loadMore(that, request, "applyList");
  },
})