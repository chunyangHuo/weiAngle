
Page({
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  onShareAppMessage: function () {
  
  },
  //人脈排行
  Connections:function(){
    wx.navigateTo({
      url: '/pages/contactsActivty/topPlayer/topPlayer'
    })
  },
  //报名
  // enroll: function () {
    // wx.navigateTo({
    //   url: ''
    // })
  // },
})