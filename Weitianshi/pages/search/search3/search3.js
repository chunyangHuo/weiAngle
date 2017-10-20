var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as SearchModel from '../../../utils/searchModel';
Page({
  data: {
    SearchInit: SearchModel.data,
    financingNeed: [],//最新
    slectProject: [],
    investorList: [],
    faList: [],
    myList: [],
    placeHold: "请输入姓名、公司、品牌"
  },
  onLoad: function (options) {
    let that = this;
    let user_id = options.user_id;
    let entrance = options.entrance;
    // entrance: slected,newest,investorList,faList,myList
    this.setData({
      user_id: user_id,
      entrance: entrance
    });
    app.initPage(that);
    switch (entrance) {
      case 'selected':
        wx.setNavigationBarTitle({
          title: '项目搜索',
        })
        that.setData({
          placeHold: "请输入项目名称，公司名称"
        })
        break;
      case 'newest':
        wx.setNavigationBarTitle({
          title: '项目搜索',
        })
        that.setData({
          placeHold: "请输入项目名称，公司名称"
        })
        break;
      case "investorList":
        wx.setNavigationBarTitle({
          title: '人脉搜索',
        })
        break;
      case "faList":
        wx.setNavigationBarTitle({
          title: '人脉搜索',
        })
        break;
      case "myList":
        wx.setNavigationBarTitle({
          title: '人脉搜索',
        })
        break;
    }
  },
  //搜索事件
  searchSth: function (e) {
    let that = this;
    let user_id = this.data.user_id;
    let currentUser = wx.getStorageSync('user_id');
    let entrance = this.data.entrance;
    let str = e.detail.value;
    let SearchInit = this.data.SearchInit;
    let timer = this.data.timer;
    SearchInit.searchData.search = str;
    this.setData({
      SearchInit: SearchInit
    })
    //防止多次请求进行延时处理
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(x => {
      wx.showLoading({
        title: 'loading',
        mask: true
      })
      switch (entrance) {
        case 'selected':
          this.selectedProject();
          break;
        case 'newest':
          this.newestProject();
          break;
        case "investorList":
          this.newSearch(0);
          break;
        case "faList":
          this.newSearch(1);
          break;
        case "myList":
          this.newSearch(2);
          break;
      }
    }, 1500)
    this.setData({
      timer: timer,
    })
  },
  // 取消
  searchEsc: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //点击进入项目详情
  projectDetail: function (e) {
    var project_id = e.currentTarget.dataset.project;
    // 判斷項目是不是自己的
    wx.request({
      url: url + '/api/project/projectIsMine',
      data: {
        project_id: project_id
      },
      method: 'POST',
      success: function (res) {
        var that = this;
        var userId = res.data.user_id;
        var user = wx.getStorageSync('user_id');
        if (userId == user) {
          wx.navigateTo({
            url: '/pages/myProject/projectDetail/projectDetail?id=' + project_id + '&&index=' + 0
          })
        } else {
          wx.navigateTo({
            url: '/pages/projectDetail/projectDetail?id=' + project_id,
          })
        }
      }
    })
  },
  //点击进入用户详情
  userDetail(e) {
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
  //上拉加载
  loadMore: function () {
    let entrance = this.data.entrance;
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    let search = this.data.SearchInit.searchData.search
    let request;
    switch (entrance) {
      case 'newest':
        request = {
          url: url_common + '/api/project/getMarketProjectList',
          data: {
            user_id: this.data.user_id,
            filter: this.data.SearchInit.searchData,
            page: this.data.currentPage
          }
        }
        app.loadMore(that, request, "financingNeed")
      case 'selected':
        request = {
          url: url_common + '/api/project/getSelectedProjectList',
          data: {
            user_id: user_id,
            filter: this.data.SearchInit.searchData,
            page: this.data.currentPage,
          }
        }
        //调用通用加载函数
        app.loadMore(that, request, "slectProject")
      case 'investorList':
        {
          request = {
            url: url_common + '/api/investor/searchInvestor',
            data: {
              user_id: user_id,
              page: this.data.currentPage,
              search: search
            }
          }
          //调用通用加载函数
          app.loadMore(that, request, "investorList")
        }
        break;
      case 'faList':
        {
          request = {
            url: url_common + '/api/investor/searchInvestor',
            data: {
              user_id: user_id,
              search: search,
              page: this.data.currentPage,
            }
          }
          //调用通用加载函数
          app.loadMore(that, request, "faList")
        }
        break;
      case 'myList':
        {
          request = {
            url: url_common + '/api/investor/searchInvestor',
            data: {
              user_id: user_id,
              search: search,
              page: this.data.currentPage,
            }
          }
          //调用通用加载函数
          app.loadMore(that, request, "financingNeed")
        }
        break;
    }
  },
  //申请查看
  matchApply(e) {
    let that = this;
    let pro_id = e.currentTarget.dataset.project;
    let slectProject = that.data.slectProject;
    let financingNeed = that.data.financingNeed;
    let entrance = that.data.entrance;
    app.operationModel('projectApply', pro_id, res => {
      console.log(res)
      if (entrance == 'selected') {
        slectProject.forEach(x => {
          if (x.project_id == pro_id) {
            x.relationship_button = 0;
          }
        })
      } else if (entrance == 'newest') {
        financingNeed.forEach(x => {
          if (x.project_id == pro_id) {
            x.relationship_button = 0;
          }
        })
      }
      that.setData({
        slectProject: slectProject,
        financingNeed: financingNeed
      })
    });
  },
  // 项目推送
  projectPush(e) {
    console.log(1)
    let pushTo_user_id = e.currentTarget.dataset.id;
    app.operationModel('projectPush', pushTo_user_id);
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
  // ----------------------------------获取搜索结果---------------------------------------------------
  // 最新
  newestProject() {
    let that = this;
    wx.request({
      url: url_common + '/api/project/getMarketProjectList',
      data: {
        user_id: this.data.user_id,
        filter: this.data.SearchInit.searchData
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        console.log('最新', res)
        var financingNeed = res.data.data;
        that.setData({
          financingNeed: financingNeed,
        })
      }
    })
  },
  // 精选
  selectedProject() {
    let that = this;
    app.httpPost({
      url: url_common + '/api/project/getSelectedProjectList',
      data: {
        user_id: this.data.user_id,
        filter: this.data.SearchInit.searchData
      }
    }).then(res => {
      wx.hideLoading();
      var slectProject = res.data.data;
      console.log('精选', res)
      that.setData({
        slectProject: slectProject,
      })
    })
  },
  // 投资人
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
          var investorList = res.data.data;
          that.setData({
            investorList: investorList,
          })
        }
      }
    });
  },
  // FA
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
          var faList = res.data.data;
          that.setData({
            faList: faList,
          })
        }
      }
    });
  },
  // 我的人脉
  myList() {
    let user_id = this.data.user_id;
    let that = this;
    let SearchInit = this.data.SearchInit;
    // 检查个人信息全不全
    if (user_id != 0) {
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
          console.log('我的人脉列表', res);
          if (res.data.status_code == '2000000') {
            var myList = res.data.data;//所有的用户
            var page_end = res.data.page_end;
            that.setData({
              myList: myList,
              page_end: page_end,
            })
          }
        }
      })
    }
  },

  // 新搜索逻辑
  newSearch(num) {
    let user_id = this.data.user_id;
    let that = this;
    let search = this.data.SearchInit.searchData.search;
    wx.request({
      // url: url_common + '/api/investor/searchInvestor',
      url: url_common + '/api/user/searchUser',
      data: {
        user_id: user_id,
        search: search,
      },
      method: 'POST',
      success(res) {
        if (res.data.status_code == 2000000) {
          switch (num) {
            case 0: {
              console.log('投资人列表', res.data.data)
              wx.hideLoading();
              var investorList = res.data.data;
              that.setData({
                investorList: investorList,
              })
              break;
            }
            case 1: {
              console.log('FA列表', res.data.data)
              wx.hideLoading();
              var faList = res.data.data;
              that.setData({
                faList: faList,
              })
              break;
            }
            case 2: {
              wx.hideLoading();
              var myList = res.data.data;//所有的用户
              var page_end = res.data.page_end;  
              console.log(myList)
              that.setData({
                myList: myList,
                page_end: page_end,
              })
              break;
            }
          }
        } else {
          wx.hideLoading();
          app.errorHide(that, res.data.error_msg, 3000)
        }
      }
    })
  }
})