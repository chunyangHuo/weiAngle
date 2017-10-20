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
    black_user: '',
    subscribe: {
      white_company: 0,
      white_user: 0,
      black_company: '',
      black_user: ''
    }
  },

  onLoad: function (options) {
    let user_id = wx.getStorageSync('user_id');
    let that = this;
    // options.project存在为编辑项目;不存在为创建项目
    if (options.project) {
      this.setData({
        project_id: options.project
      })
      wx.request({
        url: url_common + '/api/project/getProjectEditInfo',
        data: {
          user_id: user_id,
          project_id: options.project
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            open_status: res.data.data.open_status,
            power_share_status: res.data.data.power_share_status,
            power_investor_status: res.data.data.power_investor_status,
            company_open_status: !res.data.data.company_open_status,
            black_company: res.data.data.black_list.black_company,
            black_user: res.data.data.black_list.black_user
          })
          if (res.data.data.black_list) {
            that.setData({
              white_company: res.data.data.black_list.white_company,
              white_user: res.data.data.black_list.white_user,
            })
          }
        }
      })
    } else {
      let setPrivacy = wx.getStorageSync('setPrivacy');
      if (setPrivacy){
        that.setData({
          open_status: setPrivacy.open_status,
          power_share_status: setPrivacy.power_share_status,
          power_investor_status: setPrivacy.power_investor_status,
          company_open_status: setPrivacy.company_open_status,
          white_company: setPrivacy.white_company,
          white_user: setPrivacy.white_user,
          black_company: setPrivacy.black_company,
          black_user: setPrivacy.black_user
        })
      }
    }
  },
  //公开项目
  switchChange1: function (e) {
    let open_status = e.detail.value;
    this.setData({
      open_status: open_status
    })
  },
  //分享项目
  switchChange2: function (e) {
    let power_share_status = e.detail.value;
    this.setData({
      power_share_status: power_share_status
    })
  },
  //认证
  switchChange3: function (e) {
    let power_investor_status = e.detail.value;
    this.setData({
      power_investor_status: power_investor_status
    })
  },
  //隐藏
  switchChange4: function (e) {
    let company_open_status = e.detail.value;
    this.setData({
      company_open_status: company_open_status
    })
  },
  //白名单公司
  whiteCompany: function (e) {
    let white_company = e.detail.value;
    this.setData({
      white_company: white_company
    })
  },
  //白名单用户
  whiteUser: function (e) {
    let white_user = e.detail.value;
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
    let open_status = Number(this.data.open_status);
    let power_share_status = Number(this.data.power_share_status);
    let power_investor_status = Number(this.data.power_investor_status);
    let company_open_status = Number(this.data.company_open_status);
    let white_company = Number(this.data.white_company);
    let white_user = Number(this.data.white_user);
    let black_company = this.data.black_company;
    let black_user = this.data.black_user;
    let subscribe = this.data.subscribe;
    //暂存私密性选项
    let setPrivacy = {
      open_status,
      power_share_status,
      power_investor_status,
      company_open_status,
      white_company,
      white_user,
      black_company,
      black_user,
      subscribe
    }
    wx.setStorageSync('setPrivacy', setPrivacy)
    // 保存私密性
    if (project_id) {
      wx.request({
        url: url_common + '/api/project/set',
        data: {
          project_id: project_id,
          open_status: open_status,
          power_share_status: power_share_status,
          power_investor_status: power_investor_status,
          company_open_status: Number(!company_open_status),
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
            app.errorHide(that, res.data.error_msg, 3000)
          }
        }
      })
    } else {
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})