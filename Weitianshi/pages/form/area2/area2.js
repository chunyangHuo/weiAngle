var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
var save = true;//是否删除缓存
Page({
  data: {
    payArea: [],
    checked: [],
    index: [],
    id: [],
    error: "0",
    error_text: "",
    enchangeCheck: [],
    enchangeValue: [],
    enchangeId: []
  },
  onLoad: function () {
    var that = this;
    var that = this;
    let area = wx.getStorageSync("hotCity");
    console.log(area)
    let tran_area = [];
    if (wx.getStorageSync("tran_area").length != 0) {
      tran_area = wx.getStorageSync("tran_area");
      area.forEach((y) => {
        tran_area.forEach((x) => {
          if (x.area_id == y.area_id) {
            y.check = true;
          }
        })
      })
    }
    that.setData({
      area: area,
      tran_area: tran_area
    });
  },
  onShow: function () {
    // 页面显示
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  //传值部份可提供资源
  checkboxChange: function (e) {
    let that = this;
    let area = this.data.area
    let tranArr = this.data.tran_area;
    let item = app.checkMore(e, area, tranArr, that, "area_id");
    this.setData({
      area: item.item,
      tran_area: item.tran_arr
    })
  },

  //点击确定
  certain: function () {
    var that = this;
    var index = this.data.index;
    let tran_area = this.data.tran_area;
    // 传值给myProject
    if (tran_area.length == 0) {
      wx.setStorageSync("tran_area", "")
    } else {
      wx.setStorageSync("tran_area", tran_area)
    }
    wx.navigateBack({
      delta: 1 // 回退前 delta(默认为1) 页面
    })
  }

});