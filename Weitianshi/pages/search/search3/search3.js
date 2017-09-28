var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {

  },
  onLoad: function (options) {
    let user_id = options.user_id;
    let entrance = options.entrance;
    this.setData({
      user_id: user_id,
      entrance:entrance
    })
  },
  onShow: function () {
    let user_id = this.data.user_id;
    let  that = this;

  },
  //查找项目
  searchSth: function (e) {
    let that = this;
    let user_id = this.data.user_id;
    let currentUser = wx.getStorageSync('user_id');
    let entrance=this.data.entrance;
  },
  // 取消
  searchEsc: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //点击进入项目详情
  detail: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let user_id = this.data.user_id;
    let currentUser = wx.getStorageSync('user_id');
    console.log(user_id)
    console.log(currentUser)
    if (user_id == currentUser) {
      wx.navigateTo({
        url: '/pages/myProject/projectDetail/projectDetail?id=' + id + '&&index=' + 0
      })
    } else if (user_id != currentUser){
      wx.navigateTo({
        url: '/pages/projectDetail/projectDetail?id=' + id,
      })
    }
  },
  //上拉加载
  myPublicProject: function () {
   
  },
})