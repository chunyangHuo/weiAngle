// pages/search/search1/search1.js
var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({

  data: {
    tags: '',
    com_id: 0
  },

  onLoad: function (options) {
    let that = this;
    let company = options.company;
    let type = options.type;
    that.setData({
      company_name: company,
      type: type
    })
  },

  onShow: function () {

  },
  //获取输入内容
  inputValue: function (e) {
    console.log(e)
    let companyName = e.detail.value;
    let that = this;
    that.setData({
      company_name: companyName
    })
  },
  // 查找公司名字
  searchCompany: function () {
    let that = this;
    let company_name = this.data.company_name;
    var user_id = wx.getStorageSync('user_id');
    console.log(company_name);
    let com_id = this.data.com_id;
    wx.request({
      url: url_common + '/api/dataTeam/selectCompany',
      data: {
        user_id: user_id,
        company_name: company_name
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        let company = res.data.data;
        that.setData({
          company: company,
          com_id: com_id
        })
      }
    })
  },
  // 选择其中的一个
  checkOne: function (e) {
    console.log(e)
    let tags = e.currentTarget.dataset.id;
    let company_name = e.currentTarget.dataset.name;
    console.log(company_name)
    let that = this;
    that.setData({
      com_id: tags,
      company_name: company_name
    })

  },
  // 保存公司名称
  save: function () {
    console.log("保存")
    let that = this;
    let type = this.data.type;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    let prevPage = pages[pages.length - 2];
    if (type == 3) {
      let user_info = prevPage.data.user_info;
      let company_name = this.data.company_name;
      user_info.user_company_name = company_name;
      if (company_name != '') {
        prevPage.setData({
          user_info: user_info
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        rqj.errorHide(that, "公司不能为空", 1500)
      }
    } else if (type == 8) {
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];
      let prevPage = pages[pages.length - 2];
      let company_name = this.data.company_name;
      prevPage.setData({
        company_name: company_name
      })
      wx.navigateBack({
        delta: 1
      })
    }
  }
}) 