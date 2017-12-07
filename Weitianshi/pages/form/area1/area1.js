var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    province: [],
    city: [],
    background: [],
    belongArea: '',
    console_province: '',
  },
  onLoad: function (options) {
    // current==0发布融资项目 current==1 维护融资项目 current==2 添加投资案例
    let that = this;
    // 获取数据并标定check
    this.areaDeal();
  },
  areaDeal() {
    let that = this;
    let tran_area = wx.getStorageSync('tran_area');
    let provinceNum = tran_area[0];
    let cityNum = tran_area[1];
    let province = wx.getStorageSync('area');
    // 省
    province.forEach(x => {
      if (x.area_id == provinceNum) {
        x.check == false;
      }
    })
    // 市
    wx.request({
      url: app.globalData.url_common + '/api/category/getArea',
      data: {
        pid: provinceNum
      },
      method: 'POST',
      success: function (res) {
        let city = res.data.data;
        city.forEach(x => {
          x.check = false;
          if (x.area_id == cityNum) {
            x.check == true;
          }
        })
        that.setData({
          province: province,
          city: city
        })
      }
    });
  },
  province: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var id = e.target.dataset.id;
    var province = this.data.province;
  
    wx.request({
      url: app.globalData.url_common + '/api/category/getArea',
      data: {
        pid: id
      },
      method: 'POST',
      success: function (res) {
        var city = res.data.data;
        that.setData({
          city: city,
          backgroundcity: ""
        })
      }
    });
  },
  city: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var id = e.target.dataset.id;
    var city = this.data.city;
    var current = this.data.current;
    that.setData({
      belongArea: this.data.console_province + city[index].area_title,
      cityNum: city[index].area_id
    });
    if (current == 0) {
      if (this.data.belongArea == "") {
        wx.setStorageSync('belongArea', "选择地区");
      } else {
        wx.setStorageSync('belongArea', this.data.belongArea);
        wx.setStorageSync('provinceNum', this.data.provinceNum);
        wx.setStorageSync('cityNum', this.data.cityNum);
      }
    } else if (current == 1) {
      if (this.data.belongArea == "") {
        wx.setStorageSync('m_belongArea', "选择地区")
      } else {
        wx.setStorageSync('m_belongArea', this.data.belongArea);
        wx.setStorageSync('m_provinceNum', this.data.provinceNum);
        wx.setStorageSync('m_cityNum', this.data.cityNum);
      }
    } else if (current == 2) {
      if (this.data.belongArea == "") {
        wx.setStorage({
          key: 'addcase_belongArea',
          data: {
            belongArea: this.data.belongArea
          },
        })
      } else {
        wx.setStorage({
          key: 'addcase_belongArea',
          data: {
            belongArea: this.data.belongArea,
            provinceNum: this.data.provinceNum,
            cityNum: this.data.cityNum
          },
        })
        wx.setStorageSync('provinceNum', this.data.provinceNum);
        wx.setStorageSync('cityNum', this.data.cityNum);
      }
    }
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    })

  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
});