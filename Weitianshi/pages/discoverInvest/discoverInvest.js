var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as FilterModel from '../../utils/filterModel';
import * as ShareModel from '../../utils/shareModel';

Page({
  data: {
    investorList: '',
    faList: '',
    myContacts: '',
    hidden: true,
    //选项卡
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    slectProject: '',
    banner_organization: app.globalData.picUrl.banner_organization,
    // 筛选搜索
    SearchInit: FilterModel.data,
    activtyBanner: app.globalData.picUrl.activtyBanner,
    nonet: true
  },
  onLoad(options) {
    let that = this;
    app.netWorkChange(that);
    let SearchInit = that.data.SearchInit;
    if (options.currentTab) {
      this.setData({
        currentTab: options.currentTab
      })
    }

    // ------------下面获取缓存是必要的,不要删除--------------------------------------------------
    // 无缓存用户FilterModel预处理
    if (!that.data.SearchInit.industry) {
      //获取筛选项所需的信息并存入缓存
      wx.request({
        url: url_common + '/api/category/getProjectCategory',
        method: 'POST',
        success: function (res) {
          // console.log('getProjectCategory',res)
          let thisData = res.data.data;
          thisData.area.forEach((x) => {
            x.check = false
          })
          thisData.industry.forEach((x) => {
            x.check = false
          })
          thisData.scale.forEach((x) => {
            x.check = false
          })
          thisData.stage.forEach((x) => {
            x.check = false
          })
          thisData.hotCity.forEach((x) => {
            x.check = false
          })
          wx.setStorageSync("industry", thisData.industry)
          wx.setStorageSync("scale", thisData.scale)
          wx.setStorageSync("stage", thisData.stage)
          wx.setStorageSync('hotCity',thisData.hotCity)
          // 筛选的初始缓存
          let SearchInit = that.data.SearchInit;
          SearchInit.industry = wx.getStorageSync('industry');
          SearchInit.stage = wx.getStorageSync('stage');
          SearchInit.scale = wx.getStorageSync('scale');
          SearchInit.hotCity = wx.getStorageSync('hotCity');
          that.setData({
            SearchInit: SearchInit
          })
        },
      })
    }


    this.noSearch();
    app.initPage(that)
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
    //请求精选项目数据
    app.loginPage(function (user_id) {
      that.setData({
        user_id: user_id
      });
      // 身份认证状态获取
      wx.request({
        url: url_common + '/api/user/getUserGroupByStatus',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          app.log(that,"身份状态获取",res);
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
    })
  },
  // 控制投资机构不显示筛选项(辅助函数)
  noSearch() {
    if (this.data.currentTab == 0) {
      this.setData({
        hidden: false
      })
    } else {
      this.setData({
        hidden: true
      })
    }
  },
  // 点击tab切换
  swichNav: function (e) {
    this.setData({
      currentTab: e.target.dataset.current
    })
  },
  // 滑动切换tab
  bindChange: function (e) {
    let that = this;
    let current = e.detail.current;
    let searchData = that.data.SearchInit.searchData;
    let searchLength = searchData.industry.length + searchData.stage.length + searchData.scale.length + searchData.hotCity.length;
    app.initPage(that);
    this.noSearch();
    this.allReset();
    that.setData({currentTab: e.detail.current});
    // 如果切换前tab页进行过筛选则重置大部分tab页数据
    if (searchLength != 0) {
      switch (current) {
      case 0: {
        that.setData({
          investorList: that.data.investorList2,
          faList: that.data.faList2,
          myList: that.data.myList2,
          page_end: false
        })
        break;
      }
      case 1: {
        that.setData({
          faList: that.data.faList2,
          myList: that.data.myList2,
          page_end: false
        })
        break;
      }
      case 2: {
        that.setData({
          investorList: that.data.investorList2,
          myList: that.data.myList2,
          page_end: false
        })
        break;
      }
      case 3: {
        that.setData({
          investorList: that.data.investorList2,
          faList: that.data.faList2,
        })
        break;
      }
      }
    }
    // 如果当前tab页无数据则请求接口
    switch (current) {
    case 0: {
      break;
    }
    case 1: {
      if (!that.data.investorList) {
        this.investorList();
      }
      break;
    }
    case 2: {
      if (!that.data.faList) {
        this.faList();
      }
      break;
    }
    case 3: {
      if (!that.data.myList) {
        this.myList();
      }
      break;
    }
    }
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
      let investment_list = investormentList.investment_list.list;
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
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
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
          app.log(that,"投资人列表",res.data.data);
          wx.hideLoading();
          let investorList = res.data.data;
          SearchInit.currentIndex = 99;
          // 存入无筛选项的投资人列表以备他用
          if (!that.data.investorList) {
            that.setData({
              investorList2: investorList
            })
          }
          that.setData({
            investorList: investorList,
            SearchInit: SearchInit
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
    let SearchInit = this.data.SearchInit;
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
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
          app.log(that,"FA",res.data.data);
          wx.hideLoading();
          let faList = res.data.data;
          SearchInit.currentIndex = 99;
          // 存入无筛选项的FA列表以备他用
          if (!that.data.faList) {
            that.setData({
              faList2: faList
            })
          }
          that.setData({
            faList: faList,
            SearchInit: SearchInit
          })
        }
      },
      complete() {
        wx.hideLoading();
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
          app.log(that,"我的人脉列表",res);
          if (res.data.status_code == '2000000') {
            let myList = res.data.data;//所有的用户
            let page_end = res.data.page_end;
            SearchInit.currentIndex = 99;
            // 存入无筛选项的我的人脉列表以备他用
            if (!that.data.myList) {
              that.setData({
                myList2: myList
              })
            }
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
      app.href('/pages/my/myNew/myNew')
    } else {
      app.href('/pages/userDetail/networkDetail/networkDetail?id=' + id)
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
    case 1: {
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
    case 2: {
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
    case 3: {
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
      app.log(that,"申请添加人脉完成",res);
      that.contactsAddSuccessFunc(res, added_user_id, 2);
    });
  },
  // 直接加人脉
  contactsAddDirect(e) {
    let added_user_id = e.currentTarget.dataset.id;
    let that = this;
    app.operationModel('contactsAddDirect', added_user_id, function (res) {
      app.log(that,"直接添加人脉完成",res);
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
    app.href('/pages/matchInvestor/matchInvestor')
  },
  //活动详情
  goTo() {
    app.href('/pages/contactsActivty/activtyDetail/activtyDetail')
  },
  // ------------------------------------筛选搜索-------------------------------------
  // 下拉框
  move(e) {
    let that = this;
    FilterModel.move(e, that)
  },
  // 标签选择
  tagsCheck(e) {
    let that = this;
    FilterModel.tagsCheck(e, that)
  },
  // 筛选重置
  reset() {
    let that = this;
    FilterModel.reset(that)
  },
  // 全部筛选重置
  allReset() {
    let that = this;
    FilterModel.allReset(that);
  },
  // 筛选确定
  searchCertain() {
    let that = this;
    let searchData = FilterModel.searchCertain(that);
    let current = this.data.currentTab;
    if (current == 1) {
      app.log(that,"筛选投资人",searchData);
      this.investorList();
    } else if (current == 2) {
      app.log(that,"筛选FA",searchData);
      this.faList();
    } else if (current == 3) {
      app.log(that,"筛选我的",searchData);
      this.myList();
    } else {
      app.log(that,"searchCertain()出错了");
    }
  },
  // 点击modal层
  modal() {
    let that = this;
    FilterModel.modal(that)
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
    FilterModel.searchSth(that, str)
  },
  // 展示项删除
  labelDelete(e) {
    FilterModel.labelDelete(e, this)
  },
  // 一级联动选择
  firstLinkCheck(e) {
    FilterModel.firstLinkCheck(e, this);
  },
  // 联动选择全部
  linkCheckAll(e) {
    FilterModel.linkCheckAll(e, this);
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
              app.href('/pages/my/identity/indentity/indentity')
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
                      app.href('/pages/my/identity/indentity/indentity?group_id=' + group_id)
                    }
                  })
                }
              })
            }
          } else if (complete == 0) {
            wx.removeStorageSync('followed_user_id')
            app.href('/pages/register/companyInfo/companyInfo?type=1')
          }
        } else {
          wx.removeStorageSync('followed_user_id')
          app.href('/pages/register/personInfo/personInfo?type=2')
        }
      },
    });
  },
  // 搜索跳转
  allSearch: function () {
    app.href('/pages/organization/org_search/org_search')
  },
  //跳转热门领域全部
  toGoIndustry: function () {
    app.href('/pages/organization/subPage/list_industry/list_industry')
  },
  //投资机构全部
  toGoInvestment: function () {
    app.href('/pages/organization/org_library/org_library')
  },
  //投资机构跳转
  institutionalDetails(e) {
    let id = e.currentTarget.dataset.id;
    app.href('/pages/organization/org_detail/org_detail?investment_id=' + id)
  },
  //投资风格跳转
  toStyle(e) {
    let id = e.currentTarget.dataset.style;
    app.href('/pages/organization/org_library/org_library?label=label_style&&itemId=' + id)
  },
  //热门领域跳转搜索
  toIndustrySearch(e) {
    let id = e.currentTarget.dataset.id;
    app.href('/pages/organization/org_library/org_library?label=label_industry&&itemId=' + id)
  },
  // 重新加载
  refresh() {
    let timer = '';
    wx.showLoading({
      title: 'loading',
      mask: true
    });
    timer = setTimeout(x => {
      wx.hideLoading();
      this.onShow();
    }, 1500)
  }

})

