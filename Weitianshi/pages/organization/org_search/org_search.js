// pages/organization/org_search/org_search.js
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as SearchModel from '../../../utils/searchModel';
import * as ShareModel from '../../../utils/shareModel';
Page({
  data: {
    currentTab: 0,
    investment_list: [],
    memberList: [],
    industry_list: []
  },
  onLoad: function (options) {

  },
  onShow: function () {
    let that = this;
  },
  // 点击tab切换
  swichNav: function (e) {
    let that = this;
    let current = e.target.dataset.current;
    that.setData({
      currentTab: e.target.dataset.current
    })
    app.initPage(that);
    // this.allReset();
    if (this.data.currentTab === current) {
      // this.tabChange(current)
    }
  },
  // 滑动切换tab
  bindChange: function (e) {
    let that = this;
    let current = e.detail.current;
    app.initPage(that);
    // this.allReset();
    that.setData({ currentTab: e.detail.current });
    // this.tabChange(current);
  },
  //搜索事件
  searchSth: function (e) {
    let that = this;
    let str = e.detail.value;
    let timer = this.data.timer;
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(x => {
      wx.showLoading({
        title: 'loading',
        mask: true
      })
      app.httpPost({
        url: url_common + '/api/investment/search',
        data: {
          word: str
        }
      }).then(res => {
        wx.hideLoading()
        let investment_list = res.data.data.investment_list;
        let memberList = res.data.data.member_list;
        let industry_list = res.data.data.industry_list;
        that.setData({
          investment_list: investment_list,
          memberList: memberList,
          industry_list: industry_list
        })
        wx.hideLoading();
      })
    }, 1500)
    this.setData({
      timer: timer,
    })


  },
  //取消
  searchEsc: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //投资机构列表信息
  // investment() {
  //   let that = this;
  //   wx.showLoading({
  //     title: 'loading',
  //     mask: true,
  //   })
  //   app.httpPost({
  //     url: url_common + '/api/investment',
  //     data: {}
  //   }).then(res => {
  //     wx.hideLoading()
  //     let investormentList = res.data.data;
  //     let investment_list = investormentList.investment_list;
  //     that.setData({
  //       investormentList: investormentList,
  //       investment_list: investment_list
  //     })
  //     wx.hideLoading();
  //   })
  // },
  //投资领域
  // inputValue(e){
  //   let companyName = e.detail.value;
  //   let that = this;
  //   that.setData({
  //     company_name: companyName
  //   })
  // },
  //机构成员
  // investmentMember() {
  //   let that = this;
  //   wx.showLoading({
  //     title: 'loading',
  //     mask: true,
  //   })
  //   app.httpPost({
  //     url: url_common + '/api/investment/members',
  //     data: {
  //       investment_id: '1'
  //     }
  //   }).then(res => {
  //     wx.hideLoading()
  //     let memberList = res.data.data.memberlist;
  //     that.setData({
  //       memberList: memberList
  //     })
  //     wx.hideLoading();
  //   })
  // }
})