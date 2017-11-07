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
    let timer = this.data.timer;
    let currentTab = this.data.currentTab;
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
        }
      }).then(res => {
        wx.hideLoading()
        let searchData = res.data.data;
        console.log(searchData.member_list)
        let investment_list = [];
        let memberList = [];
        let industry_list = [];
        that.setData({
          searchData : searchData,
          memberList : searchData.member_list,
          industry_list : searchData.industry_list,
          investment_list : searchData.investment_list.list
        })
        wx.hideLoading();
      })
    }, 1500)
    this.setData({
      timer: timer,
    })

  },
  // 点击tab切换
  swichNav: function (e) {
    console.log(e)
    let that = this;
    let current = e.target.dataset.current;
    that.setData({
      currentTab: e.target.dataset.current
    })
    app.initPage(that);
  },
  // 滑动切换tab
  bindChange: function (e) {
    let that = this;
    let current = e.detail.current;
    app.initPage(that);
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
        let investment_list = res.data.data.investment_list.list;
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
  findMember(e) {
    let id = e.currentTarget.dataset.investment_id;
    app.href('/pages/organization/org_detail/org_detail?id=' + id)
  },
  //机构详情跳转
  institutionalDetails(e) {
    let id = e.currentTarget.dataset.id;
    app.href('/pages/organization/org_detail/org_detail?id=' + id)
  },
  //跳转到机构成员tab
  toMember() {
    let that = this;
    let searchData = this.data.searchData;
    let industry_list = searchData.industry_list;
    that.setData({
      currentTab: 2,
      industry_list: industry_list
    });
  },
  investment(){
    let that = this;
    let searchData = this.data.searchData;
    let industry_list = searchData.industry_list;
    that.setData({
      currentTab: 1,
      industry_list: industry_list
    });
  }
})