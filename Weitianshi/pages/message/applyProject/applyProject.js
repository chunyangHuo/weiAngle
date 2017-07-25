// pages/message/applyProject/applyProject.js
Page({
   data: {
      winWidth: 0,//选项卡
      winHeight: 0,//选项卡
      currentTab: 0,//选项卡
    },  

  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  /*滑动切换tab*/
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    that.setData({ currentTab: e.detail.current });
  },
  /*点击tab切换*/
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

})