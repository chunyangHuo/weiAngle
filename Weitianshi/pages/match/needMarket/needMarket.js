var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    userInfo: {},
    winWidth: 0,//选项卡
    winHeight: 0,//选项卡
    currentTab: 0,//选项卡
    financingPage: 1,
    investPage: 1,
    resourcePage: 1,
    user: 0,
    userId : 0,
    investNeedcheck: true,
    financingNeedcheck: true,
    resourceNeedcheck: true,
    financingNeed_end:false
  },
  //载入页面
  onShow: function () {
    var that = this;
    var currentTab = this.data.currentTab;
    // 获取当前用户的id
    var user = wx.getStorageSync('user_id');
    that.setData({
      user: user
    });
    //融资需求获取数据
    wx.request({
      url: url_common + '/api/project/getMarketProjectList',
      data: {
      
      },
      method: 'POST',
      success: function (res) {
        var financingNeed = res.data.data;
        that.setData({
          financingNeed: financingNeed,
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })

    //投资需求获取数据
    wx.request({
      url: url + '/api/investors/investorMarket',
      data: {
          user_id:user
      },
      method: 'POST',
      success: function (res) {
        // console.log(res)
        var investNeed = res.data.data;
        that.setData({
          investNeed: investNeed
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })
    //资源需求获取数据
    wx.request({
      url: url + '/api/resource/resourceMarket',
      data: {
          user_id:user
      },
      method: 'POST',
      success: function (res) {
          console.log(res)
        var resourceNeed = res.data.data;
        that.setData({
          resourceNeed: resourceNeed
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })
  },
  /*滑动切换tab*/
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    that.setData({ currentTab: e.detail.current });
  },
  /*点击tab切换*/
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /*滑动切换tab*/
  bindChange: function (e) {
    var that = this;
    var current = e.detail.current;
    that.setData({ currentTab: e.detail.current });
  },
  // 跳转项目详情(融资需求和投资需求)
  projectDetail: function (e) {
    // 获取我自己的项目id
    var that = this;
    // 获取当前点击的项目id
    var id = e.currentTarget.dataset.id
    console.log(id);
    // 判斷項目是不是自己的
    wx.request({
      url: url + '/api/project/projectIsMine',
      data: {
        project_id: id
      },
      method: 'POST',
      success: function (res) {
        var that = this;
        var userId = res.data.user_id;
        var user = wx.getStorageSync('user_id');
        if (userId==user ) {
          wx.navigateTo({
            url: '/pages/myProject/projectDetail/projectDetail?id=' + id + '&&index=' + 0
          })
        } else {
          wx.navigateTo({
            url: '/pages/projectDetail/projectDetail?id=' + id,
          })
        }
        
      },
    })
    

    // if (index != -1) {
    //   wx.navigateTo({
    //     url: '/pages/myProject/projectDetail/projectDetail?id=' + id + '&&index=' + index
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/projectDetail/projectDetail?id=' + id
    //   })
    // }

  },
  // 跳转人物详情
  userDetail: function (e) {
    //获取当前id
    var id = e.currentTarget.dataset.id;
    // console.log(id);
    // 获取当前用户的id
    var user_id = this.data.user;
    // console.log(user_id);
    // 判断当前用户id和点击id是否一致,如果一致,点击进入我的页面
    if (id == user_id) {
      wx.switchTab({
        url: '/pages/my/my/my'
      })
    } else {
      // 如果当前用户id与点击id不一致,进入用户详情页面
      wx.navigateTo({
        url: '/pages/userDetail/networkDetail/networkDetail?id=' + id
      })
    }

  },

  // 融资需求触底刷新
  financingNeed: function () {
    var that = this;
    var financingPage = this.data.financingPage;
    var financingNeedcheck = this.data.financingNeedcheck;
    var financingNeed_end = this.data.financingNeed_end;
    financingPage++;
    this.setData({
      financingPage: financingPage
    });
    console.log(financingPage);
    if (financingNeedcheck) {
      wx.request({
        url: url_common + '/api/project/getMarketProjectList',
        data: {
          page: financingPage
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          var new_data = res.data.data;
          var financingNeed_end = res.data.page_end
          if (new_data != '') {
            wx.showToast({
              title: 'loading...',
              icon: 'loading'
            })
            var financingNeed = that.data.financingNeed;
            for (var i = 0; i < new_data.length; i++) {
              financingNeed.push(new_data[i])
            }
            
            that.setData({
              financingNeed: financingNeed,
              financingNeed_end: financingNeed_end,
              financingNeedcheck: true
            })
          } else {
            rqj.errorHide(that, '没有更多了', 3000)
          }
        },
        fail: function (res) {
          console.log(res)
        },
      })
    }
    this.setData({
      financingNeedcheck: false
    });
  },
  // 投资需求触底刷新
  investNeed: function () {
    var that = this;
    var investPage = this.data.investPage;
    var investNeedcheck = this.data.investNeedcheck;
    investPage++;
    console.log(investPage,investNeedcheck)
    this.setData({
      investPage: investPage
    });
    if (investNeedcheck) {
      wx.request({
        url: url + '/api/investors/investorMarket',
        data: {
          page: investPage
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          var new_data = res.data.data;
          if (new_data != '') {
            wx.showToast({
              title: 'loading...',
              icon: 'loading'
            })
            var investNeed = that.data.investNeed;
            for (var i = 0; i < new_data.length; i++) {
              investNeed.push(new_data[i])
            }
            that.setData({
              investNeed: investNeed,
              investNeedcheck: true
            })
          } else {
            rqj.errorHide(that, '没有更多了', 3000)
          }
        },
        fail: function (res) {
          console.log(res)
        },
      })
    }
    this.setData({
      investNeedcheck: false
    });
  },
  // 资源需求触底刷新
  resourceNeed: function () {
    var that = this;
    var resourcePage = this.data.resourcePage;
    var resourceNeedcheck = this.data.resourceNeedcheck;
    console.log(resourceNeedcheck);
    resourcePage++;
    this.setData({
      resourcePage: resourcePage
    });
    if (resourceNeedcheck) {
      wx.request({
        url: url + '/api/resource/resourceMarket',
        data: {
          page: resourcePage
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          var new_data = res.data.data;
          if (new_data != '') {
            wx.showToast({
              title: 'loading...',
              icon: 'loading'
            })
            var resourceNeed = that.data.resourceNeed;
            for (var i = 0; i < new_data.length; i++) {
              resourceNeed.push(new_data[i])
            }
            that.setData({
              resourceNeed: resourceNeed
            })
          }
        },
        fail: function (res) {
          console.log(res)
        },
      })
    } else {
      rqj.errorHide(that, '没有更多了', 3000)
    }
    this.setData({
      resourceNeedcheck: false
    });
  },
  // 返回对接页面
  backToResource: function () {
    wx.switchTab({
      url: '/pages/match/match/match/match',
    })
  }
});