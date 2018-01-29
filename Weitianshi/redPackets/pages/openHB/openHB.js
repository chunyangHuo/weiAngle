var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg_hongbao2: app.globalData.picUrl.bg_hongbao2,
    kai :true,
    zhuanfa: app.globalData.picUrl.zhuanfa,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.kai);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },
  formsubmit :function(){

  },
  kai: function () {
    let that = this;
    that.setData({
      kai: false
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})