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
//机构成员跳转
  findMember(e){
    let memberId = e.currentTarget.dataset.memberid;
    // app.href('/pages/organization/subPage/list_orgMember/list_orgMember?memberId=?'+memberId)
  },
})