var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as SearchModel from '../../utils/searchModel';
import * as ShareModel from '../../utils/shareModel';
Page({
  data: {
    investorList: [],
    faList: [],
    myContacts: [],
    //选项卡
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    slectProject: '',
    // 筛选搜索
    SearchInit: SearchModel.data,
    activtyBanner: app.globalData.picUrl.activtyBanner,
  },
  onLoad(options) {
    if (options.currentTab) {
      this.setData({
        currentTab: options.currentTab
      })
    }
  },
  onShow: function () {
    let that = this;
    //初始化数据
    app.initPage(that)
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
    //消除人脉筛选缓存(非contacts都需要)
    app.contactsCacheClear();
    //请求精选项目数据
    app.loginPage(function (user_id) {
      that.setData({
        user_id: user_id
      });
      wx.request({
        url: url_common + '/api/user/getUserGroupByStatus',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          // 0:未认证1:待审核 2 审核通过 3审核未通过
          let status = res.data.status;
          if (status != 0) {
            let group_id = res.data.group.group_id;
            that.setData({
              group_id: group_id
            })
          }
          that.setData({
            status: status
          })
        }
      })
      that.investment();
      that.investorList();
      that.faList();
      that.myList();
    })

  },
  // 点击tab切换
  swichNav: function (e) {
    let that = this;
    let current = e.target.dataset.current;
    that.setData({
      currentTab: e.target.dataset.current
    })
    app.initPage(that);
    this.allReset();
    if (this.data.currentTab === current) {
      this.tabChange(current)
    }
  },
  // 滑动切换tab
  bindChange: function (e) {
    let that = this;
    let current = e.detail.current;
    app.initPage(that);
    this.allReset();
    that.setData({ currentTab: e.detail.current });
    this.tabChange(current);
  },
  // tab页面切换数据调用(辅助函数)
  tabChange(current) {
    /*  if (current === 0) {
       //请求投资人列表
       this.investorList();
     } else if (current === 1) {
       //请求FA列表
       this.faList();
     } else if (current === 2) {
       //请求我的人脉列表
       this.myList();
     } */
  },
  //下拉刷新
  onPullDownRefresh() {
    let current = this.data.currentTab;
    if (current === 0) {
      //投资机构
      this.investment();
    } else if (current === 1) {
      //请求投资人列表
      this.investorList();
    } else if (current === 2) {
      //请求FA列表
      this.faList();
    } else if (current === 3) {
      //请求我的人脉列表
      this.myList();
    }
  },
  //投资机构列表信息
  investment() {
    let that = this;
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
    app.httpPost({
      url: url_common + '/api/investment',
      data: {}
    }).then(res => {
      wx.hideLoading()
      let investormentList = res.data.data;
      let investment_list = investormentList.investment_list;
      that.setData({
        investormentList: investormentList,
        investment_list: investment_list
      })
      wx.hideLoading();
    })
  },
  //投资人列表信息
  investorList() {
    let that = this;
    let SearchInit = this.data.SearchInit;
    wx.request({
      url: url_common + '/api/investor/getInvestorListByGroup',
      data: {
        user_id: this.data.user_id,
        type: 'investor',
        filter: this.data.SearchInit.searchData
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == '2000000') {
          console.log('投资人列表', res.data.data)
          wx.hideLoading();
          let investorList = res.data.data;
          SearchInit.currentIndex = 5;
          that.setData({
            investorList: investorList,
            SearchInit: SearchInit
          })
        }
      }
    });
  },
  //FA列表信息
  faList() {
    let that = this;
    let SearchInit = this.data.SearchInit;
    wx.request({
      url: url_common + '/api/investor/getInvestorListByGroup',
      data: {
        user_id: this.data.user_id,
        type: 'fa',
        filter: this.data.SearchInit.searchData
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == '2000000') {
          console.log('FA列表', res.data.data)
          wx.hideLoading();
          let faList = res.data.data;
          SearchInit.currentIndex = 5;
          that.setData({
            faList: faList,
            SearchInit: SearchInit
          })
        }
      }
    });
  },
  //我的人脉列表信息
  myList() {
    let user_id = this.data.user_id;
    let that = this;
    let SearchInit = this.data.SearchInit;
    // 检查个人信息全不全
    if (user_id == 0) {
      wx.request({
        url: url_common + '/api/user/checkUserInfo',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          that.setData({
            notIntegrity: res.data.is_complete,
            empty: 1
          })
        },
      })
    }
    // 获取人脉库信息
    if (user_id) {
      wx.showLoading({
        title: 'loading',
        mask: true,
      })
      wx.request({
        url: url_common + '/api/user/getMyFollowList',
        data: {
          user_id: user_id,
          page: 1,
          filter: SearchInit.searchData
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading();
          console.log('我的人脉列表', res);
          if (res.data.status_code == '2000000') {
            let myList = res.data.data;//所有的用户
            let page_end = res.data.page_end;
            SearchInit.currentIndex = 5;
            that.setData({
              myList: myList,
              page_end: page_end,
              SearchInit: SearchInit
            })
          }
        }
      })
    }
  },
  // 用户详情
  userDetail: function (e) {
    let id = e.currentTarget.dataset.id
    var user_id = wx.getStorageSync("user_id");//用戶id
    if (id == user_id) {
      wx.switchTab({
        url: '/pages/my/myNew/myNew',
      })
    } else {
      wx.navigateTo({
        url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
      })
    }
  },
  // 上拉加载
  loadMore: function () {
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
            url: url_common + '/api/user/getMyFollowList',
            data: {
              user_id: user_id,
              page: this.data.currentPage,
              filter: this.data.SearchInit.searchData
            }
          }
          //调用通用加载函数
          app.loadMore(that, request, "myList")
        }
        break;
    }
  },
  // 分享当前页面
  onShareAppMessage: function () {
    return ShareModel.discoverInvestShare();
  },
  // 项目推送
  projectPush(e) {
    let that = this;
    let pushTo_user_id = e.currentTarget.dataset.id;
    app.operationModel('projectPush', that, pushTo_user_id);
  },
  // 申请加人脉
  contactsAdd(e) {
    let added_user_id = e.currentTarget.dataset.id;
    let that = this;
    app.operationModel('contactsAdd', added_user_id, function (res) {
      console.log('申请添加人脉完成', res);
      that.contactsAddSuccessFunc(res, added_user_id, 2);
    });
  },
  // 直接加人脉
  contactsAddDirect(e) {
    let added_user_id = e.currentTarget.dataset.id;
    let that = this;
    app.operationModel('contactsAddDirect', added_user_id, function (res) {
      console.log('直接添加人脉完成', res)
      that.contactsAddSuccessFunc(res, added_user_id, 1);
    });
  },
  // 加人脉成功后处理(辅助函数)
  contactsAddSuccessFunc(res, added_user_id, num) {
    let that = this;
    let investorList = this.data.investorList;
    let faList = this.data.faList
    if (res.data.status_code == 2000000) {
      //更改投资人和FA列表中该人的加人脉按钮的字段
      if (investorList) {
        investorList.forEach(x => {
          if (x.user_id == added_user_id) {
            x.follow_status = num
          }
        })
        that.setData({
          investorList: investorList
        })
      }
      if (faList) {
        faList.forEach(x => {
          if (x.user_id == added_user_id) {
            x.follow_status = num
          }
        })
        that.setData({
          faList: faList
        })
      }
    } else {
      app.errorHide(that, res.data.error_Msg, 3000)
    }
  },
  //找项目投资人
  matchInvestor() {
    wx.navigateTo({
      url: '/pages/matchInvestor/matchInvestor'
    })
  },
  //活动详情
  goTo: function () {
    wx.navigateTo({
      url: '/pages/contactsActivty/activtyDetail/activtyDetail',
    })
  },
  // ------------------------------------筛选搜索-------------------------------------
  // 下拉框
  move(e) {
    let that = this;
    SearchModel.move(e, that)
  },
  // 标签选择
  tagsCheck(e) {
    let that = this;
    SearchModel.tagsCheck(e, that)
  },
  // 筛选重置
  reset() {
    let that = this;
    SearchModel.reset(that)
  },
  // 全部筛选重置
  allReset() {
    let that = this;
    SearchModel.allReset(that);
  },
  // 筛选确定
  searchCertain() {
    let that = this;
    let searchData = SearchModel.searchCertain(that);
    let current = this.data.currentTab;
    if (current == 1) {
      console.log('筛选投资人', searchData);
      this.investorList();
    } else if (current == 2) {
      console.log('筛选FA', searchData);
      this.faList();
    } else if (current == 3) {
      console.log('筛选我的', searchData);
      this.myList();
    } else {
      console.log('searchCertain()出错了')
    }
  },
  // 点击modal层
  modal() {
    let that = this;
    SearchModel.modal(that)
  },
  //搜索
  searchSth() {
    let that = this;
    let currentTab = this.data.currentTab;
    let str;
    switch (currentTab) {
      case 1:
        str = 'investorList';
        break;
      case 2:
        str = 'faList';
        break;
      case 3:
        str = 'myList';
        break;
    }
    SearchModel.searchSth(that, str)
  },

  //---------------------------我的人脉--------------------------------------------------------------
  // 一键拨号
  telephone: function (e) {
    let telephone = e.currentTarget.dataset.telephone;
    wx.makePhoneCall({
      phoneNumber: telephone,
    })
  },
  // -----------------------------------立即认证
  // 立即认证
  toAccreditation: function () {
    let status = this.data.status;
    let user_id = wx.getStorageSync('user_id');
    wx.request({
      url: url_common + '/api/user/checkUserInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == 2000000) {
          var complete = res.data.is_complete;
          if (complete == 1) {
            //如果信息完整就可以显示去认证
            if (status == 0) {
              wx.navigateTo({
                url: '/pages/my/identity/indentity/indentity'
              })
            } else if (status == 3) {
              wx.showModal({
                title: '友情提示',
                content: '您的身份未通过审核,只有投资人和买方FA才可申请查看项目',
                confirmColor: "#333333;",
                confirmText: "重新认证",
                showCancel: false,
                success: function (res) {
                  wx.request({
                    url: url_common + '/api/user/getUserGroupByStatus',
                    data: {
                      user_id: user_id
                    },
                    method: 'POST',
                    success: function (res) {
                      let group_id = res.data.group.group_id;
                      wx.navigateTo({
                        url: '/pages/my/identity/indentity/indentity?group_id=' + group_id
                      })
                    }
                  })
                }
              })
            }
          } else if (complete == 0) {
            wx.removeStorageSync('followed_user_id')
            wx.navigateTo({
              url: '/pages/register/companyInfo/companyInfo?type=1'
            })
          }
        } else {
          wx.removeStorageSync('followed_user_id')
          wx.navigateTo({
            url: '/pages/register/personInfo/personInfo?type=2'
          })
        }
      },
    });
  },
  // 搜索跳转
  allSearch: function () {
    app.href('/pages/organization/org_search/org_search')
  },
  //跳转热门领域全部
  toGoIndustry:function(){
    app.href('/pages/organization/subPage/list_industry/list_industry')
  },
  //投资机构全部
  toGoInvestment:function(){
    app.href('/pages/organization/org_library/org_library')
  }
})

