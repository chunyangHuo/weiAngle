var app = getApp();
Page({
  data: {
    imgUrls: app.globalData.picUrl.band_identity,
    nonet: true
  },

  onLoad: function (options) {
    let type = options.type;
    console.log(options);
    this.setData({
      type: type
    });
    let that = this;
    app.netWorkChange(that);
  },

  onShow: function () {

  },
  btnYes: function () {
    let type = this.data.type;
    console.log(type);
    if (type == 1) {
      let pages = getCurrentPages();
<<<<<<< HEAD
      console.log(pages)
=======
      console.log(pages);
>>>>>>> fa4490c8a11ce5ab85de35bc05fe4b89983f26f8
      wx.navigateBack({
        delta: 2
      });
    } else {
      if (type == 2) {
<<<<<<< HEAD
        let pages = getCurrentPages()
        console.log(pages)
=======
        let pages = getCurrentPages();
        console.log(pages);
>>>>>>> fa4490c8a11ce5ab85de35bc05fe4b89983f26f8
        wx.navigateBack({
          delta: 3
        });
      } else {
        app.href("/pages/discoverProject/discoverProject");
      }
    }
  },
  // 重新加载
  refresh() {
    wx.showLoading({
      title: 'loading',
      mask: true
    });
    setTimeout(x => {
      wx.hideLoading();
      this.onShow();
    }, 1500);
  }
});