var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    otherPerson: false
  },
  onLoad: function (options) {
    let user_id = options.user_id;
    this.setData({
      user_id: user_id
    })
  },
  onShow: function () {

  },
  searchSth: function (e) {
    let search = e.detail.value;
    console.log(search)
    let user_id = this.data.user_id;
    let currentUser =   wx.getStorageSync('user_id');
    let that = this;
    if (user_id == currentUser){
      console.log("本人")
      that.setData({
        otherPerson: false,
        user_id: user_id})
    }else{
      console.log("其他人")
      that.setData({
        otherPerson: true,
        user_id: user_id
      })
    }
    console.log(user_id)
    wx.request({
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: user_id,
        filter: {
          search: search
        }
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var myProject = res.data.data;
        that.setData({
          myProject: myProject,
          myPublic_page_end: false,
          myPublicProject_page: 1
        })
      }
    })
  },
  // 取消
  searchEsc: function () {
    wx.navigateBack({
      delta: 1
    })
  },
})