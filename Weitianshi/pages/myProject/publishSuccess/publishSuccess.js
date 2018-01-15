var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    imgUrls: app.globalData.picUrl.project_success
  },
  onLoad: function (options) {
   let projectId = options.projectId;
   console.log(projectId)
    this.setData({
      type: options.type,
      projectId: projectId
    })
  },
  btnYes: function () {
    let type = this.data.type;
    if (type == 8) {
      wx.navigateBack({
        delta: 2
      })
    } else {
      wx.redirectTo({
        url: '/pages/matchInvestor/matchInvestor'
      });
    }
  },
  continueEdit(){
    let projectId = this.data.projectId;
    wx.redirectTo({
      url: '/pages/myProject/publishedProject/publishedProject?pro_id='+ projectId +'&&fromPublish='+ 3,
    })
  },
  // 重新加载
  refresh() {
    let timer = '';
    wx.showLoading({
      title: 'loading',
      mask: true
    });
    timer = setTimeout(x => {
      wx.hideLoading();
      this.onShow();
    }, 1500)
  }
})