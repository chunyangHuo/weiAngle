// pages/myProject/initPrivacy/initPrivacy.js
var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    open_status: 1,
    power_share_status: 1,
    power_investor_status: 1,
    company_open_status: 0,
    white_company: 0,
    white_user: 0,
    black_company: '',
    black_user: ''
  },

  onLoad: function (options) {
    if (options.project) {
      this.setData({
        project_id: options.project
      })
    } else {

    }
  },

  onShow: function () {

  },
  //公开项目
  switchChange1: function (e) {
    let open_status = e.detail.value;
    console.log(open_status)
    if (e.detail.value == false) {
      open_status: 0
    } else {
      open_status: 1
    }
    this.setData({
      open_status: open_status
    })
  },
  //分享项目
  switchChange2: function (e) {
    let power_share_status = e.detail.value;
    if (e.detail.value == false) {
      power_share_status: 0
    } else {
      power_share_status: 1
    }
    this.setData({
      power_share_status: power_share_status
    })
  },
  //认证
  switchChange3: function (e) {
    let power_investor_status = e.detail.value;
    if (e.detail.value == false) {
      power_investor_status: 0
    } else {
      power_investor_status: 1
    }
    this.setData({
      power_investor_status: power_investor_status
    })
  },
  //隐藏
  switchChange4: function (e) {
    let company_open_status = e.detail.value;
    if (e.detail.value == false) {
      company_open_status: 0
    } else {
      company_open_status: 1
    }
    this.setData({
      company_open_status: company_open_status
    })
  },
  //白名单公司
  whiteCompany: function (e) {
    let white_company = e.detail.value;
    if (e.detail.value == false) {
      white_company: 0
    } else {
      white_company: 1
    }
    this.setData({
      white_company: white_company
    })
  },
  //白名单用户
  whiteUser: function (e) {
    let white_user = e.detail.value;
    if (e.detail.value == false) {
      white_user: 0
    } else {
      white_user: 1
    }
    this.setData({
      white_user: white_user
    })
  },
  //黑名单机构
  blackCompany: function (e) {
    let black_company = e.detail.value;
    let that = this;
    that.setData({
      black_company: black_company
    })
  },
  //黑名单用户
  blackUser: function (e) {
    let black_user = e.detail.value;
    let that = this;
    that.setData({
      black_user: black_user
    })
  },
  //保存私密性设置
  saveInitPrivacy: function () {
    var that = this;
    let project_id = this.data.project_id;
    let open_status = this.data.open_status;
    let power_share_status = this.data.power_share_status;
    let power_investor_status = this.data.power_investor_status;
    let company_open_status = this.data.company_open_status;
    let white_company = this.data.white_company;
    let white_user = this.data.white_user;
    let black_company = this.data.black_company;
    let black_user = this.data.black_user;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    let prevPage = pages[pages.length - 2];
    let subscribe = prevPage.data.subscribe;
    console.log(subscribe)
    if (project_id) {
      wx.request({
        url: url_common + '/api/project/set',
        data: {
          project_id: project_id,
          open_status: open_status,
          power_share_status: power_share_status,
          power_investor_status: power_investor_status,
          company_open_status: company_open_status,
          white_company: white_company,
          white_user: white_user,
          black_company: black_company,
          black_user: black_user
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status_code == 2000000) {
            wx.navigateBack({
              delta: 1,
            })
          } else {
            console.log(res.data.error_msg)
          }
        }
      })
    } else {
      open_status = open_status;
      power_share_status = power_share_status;
      power_investor_status = power_investor_status;
      company_open_status = company_open_status;
      subscribe.white_company = white_company;
      subscribe.white_user = white_user;
      subscribe. black_company = black_company;
      subscribe.black_user = black_user
      prevPage.setData({
        open_status: open_status,
        power_share_status: power_share_status,
        power_investor_status: power_investor_status,
        company_open_status: company_open_status,
        subscribe: subscribe
      })
      wx.navigateBack({
        delta: 1
      })
    }
  }
})