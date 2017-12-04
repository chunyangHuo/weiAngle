var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    payMoney: [],
    checked: [],
    index: [],
    id: [],
    error: "0",
    error_text: "",
    enchangeCheck: [],
    enchangeValue: [],
    enchangeId: [],
    tran_scale: [],
    scale_id: ""
  },
  onLoad: function () {
    var that = this;
    let scale = wx.getStorageSync("scale");
    let tran_scale = [];
    if (wx.getStorageSync("tran_scale").length != 0) {
      tran_scale = wx.getStorageSync("tran_scale");
      scale.forEach((y) => {
        tran_scale.forEach((x) => {
          if (x.scale_id == y.scale_id) {
            y.check = true;
          }
        })
      })
    }
    that.setData({
      scale: scale,
      tran_scale: tran_scale
    });
  },
  checkboxChange(e) {
    let that = this;
    let scale = this.data.scale
    let tranArr = this.data.tran_scale;
    let item = app.checkMore(e, scale, tranArr, that);
    this.setData({
      scale: item.item,
      tran_scale: item.tran_scale
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  //点击确定
  certain: function () {
    var that = this;
    var checked = this.data.checked;
    var id = this.data.id;
    var index = this.data.index;
    let tran_scale = this.data.tran_scale;

    that.setData({
      error: "0"
    });

    if (tran_scale.length > 5) {
      that.setData({
        error: "1",
        error_text: "至多选择五个标签"
      });
      var time = setTimeout(function () {
        var that = this;
        that.setData({
          error: "0"
        })
      }, 1500)
    } else {
      // 传值给myProject
      if (tran_scale.length == 0) {
        wx.setStorageSync("tran_scale", "")

      } else {
        wx.setStorageSync("tran_scale", tran_scale)
      }

      wx.navigateBack({
        delta: 1 // 回退前 delta(默认为1) 页面
      })
    }
  }
});