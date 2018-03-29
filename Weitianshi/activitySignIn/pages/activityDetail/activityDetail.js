var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;

Page({
  data: {

  },
  onLoad: function (options) {
    let activity_id = options.activity_id;
    let user_id = wx.getStorageSync("user_id");
    let that = this;
    app.httpPost({
      url: url_common + '/api/activity/show',
      data: {
        "user_id": user_id,
        "activity_id": activity_id
      },
    }, this, res => {
      console.log(res)
      let data = res.data.data;
      this.check(data)
      that.setData({
        data: data
      })
    })
    that.setData({
      activity_id: activity_id
    })
  },
  // 报名
  signIn() {
    let activity_id = this.data.activity_id;
    app.href("/activitySignIn/pages/signNoIndentity/signNoIndentity?activity_id=" + activity_id)
  },
  //进入微天使
  toWTS() {
    app.href("/pages/discoverProject/discoverProject")
  },
  //发布活动
  publishActive() {
    app.href("/activitySignIn/pages/publishActive/publishActive")
  },
  //分享
  //报名列表
  personList() {
    let activity_id = this.data.activity_id;
    app.href("/activitySignIn/pages/signUpList/signUpList?activity_id=" + activity_id)
  },
  check(data) {
    let detail = data.detail;
    let hasThing = false;
    detail.forEach(x => {
      console.log(x)
      if (x.describle || x.image.length != 0) {
        this.setData({
          hasThing: true
        })
      }
    })
  }
})