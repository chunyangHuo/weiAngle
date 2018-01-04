var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    currentTab: 3,
    value : ''
  },
  onLoad: function (options) {
    let user_id = wx.getStorageSync('user_id');
    this.setData({
      user_id : user_id
    })
    this.investorList();
    this.faList();
    this.newestProject()
  },
  onShow: function () {

  },
  // 点击tab切换
  swichNav: function (e) {
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
    that.setData({
      currentTab: e.detail.current
    })
    app.initPage(that);
  },
  //输入的内容
  searchSth(e) {
    let value = e.detail.value;
    this.setData({
      searchValue : value
    })
  },
  //搜索确定的按钮
  searchYes() { 

  },
  //搜索指定内容
  jumpToSearch(e) {
    let current = e.currentTarget.dataset.current;
    this.setData({
      currentTab: current
    })
  },
  //投资人列表信息
  investorList() {
    let that = this;
    console.log(this.data.user_id)
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
    wx.request({
      url: url_common + '/api/investor/getInvestorListByGroup',
      data: {
        user_id: this.data.user_id,
        type: 'investor',
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == '2000000') {
          console.log('投资人列表', res.data.data)
          wx.hideLoading();
          let investorList = res.data.data;
          // 存入无筛选项的投资人列表以备他用
          if (!that.data.investorList) {
            that.setData({
              investorList2: investorList
            })
          }
          that.setData({
            investorList: investorList,
            // SearchInit: SearchInit
          })
        }
      },
      complete() {
        wx.hideLoading()
      }
    });
  },
  //FA列表信息
  faList() {
    let that = this;
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
    wx.request({
      url: url_common + '/api/investor/getInvestorListByGroup',
      data: {
        user_id: this.data.user_id,
        type: 'fa'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == '2000000') {
          console.log('FA列表', res.data.data)
          wx.hideLoading();
          let faList = res.data.data;
          // 存入无筛选项的FA列表以备他用
          if (!that.data.faList) {
            that.setData({
              faList2: faList
            })
          }
          that.setData({
            faList: faList,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    });
  },
  // 上拉加载
  loadMore: function () {
    console.log(5555)
    //请求上拉加载接口所需要的参数
    let that = this;
    let user_id = this.data.user_id;
    let currentPage = this.data.currentPage;
    let currentTab = this.data.currentTab;
    switch (currentTab) {
      case 1:
        {
          let request = {
            url: url_common + '/api/investor/getInvestorListByGroup',
            data: {
              user_id: user_id,
              type: 'investor',
              page: this.data.currentPage,
              filter: this.data.SearchInit.searchData
            }
          }
          //调用通用加载函数
          app.loadMore(that, request, "investorList")
        }
        break;
      case 2:
        {
          let request = {
            url: url_common + '/api/investor/getInvestorListByGroup',
            data: {
              user_id: user_id,
              type: 'fa',
              page: this.data.currentPage,
              filter: this.data.SearchInit.searchData
            }
          }
          //调用通用加载函数
          app.loadMore(that, request, "faList")
        }
        break;
      case 3:
        {
          let request = {
            url: url_common + '/api/investor/getInvestorListByGroup',
            data: {
              user_id: user_id,
              type: 'investor',
              page: this.data.currentPage,
              filter: this.data.SearchInit.searchData
            }
          }
          //调用通用加载函数
          app.loadMore(that, request, "investorList")
        }
        break;
      case 4:
        {
          let request = {
            url: url_common + '/api/investor/getInvestorListByGroup',
            data: {
              user_id: user_id,
              type: 'fa',
              page: this.data.currentPage,
              filter: this.data.SearchInit.searchData
            }
          }
          //调用通用加载函数
          app.loadMore(that, request, "faList")
        }
        break;
    }
  },
  //最新项目
  newestProject() {
    let that = this;
    if (!that.data.financingNeed) {
      wx.showLoading({
        title: 'loading',
        mask: true,
      })
    }
    wx.request({
      url: url_common + '/api/project/getMarketProjectList',
      data: {
        user_id: this.data.user_id,
        // filter: this.data.SearchInit.searchData
      },
      method: 'POST',
      success: function (res) {
        var financingNeed = res.data.data;
        console.log('最新', financingNeed);
        // 将无筛选条件的最新列表存入变量以备使用
        if (!that.data.financingNeed) {
          that.setData({
            financingNeed2: financingNeed
          })
        }
        that.setData({
          financingNeed: financingNeed,
        })
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
})