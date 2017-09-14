var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    buttonOne: {
      text: "新增项目"
    },
    tab: [
      { name: '领域', check: false, arr: false, id: 'industry' },
      { name: '轮次', check: false, arr: false, id: "stage" },
      { name: '金额', check: false, arr: false, id: "scale" },
      { name: '地区', check: false, arr: false, id: "hotCity" }
    ],
    currentIndex: 5,
    industryArr: [],
    stageArr: [],
    scaleArr: [],
    hotCityArr: [],
    searchData: {
      industry: [],
      stage: [],
      scale: [],
      hotCity: [],
    },
    myPublicProject_page: 1,
    myPublicCheck: true,
    myPublic_page_end: false,
    check: false,
    isChecked: true,
    contentMore: false,
    otherPerson: false
  },
  onLoad: function (options) {
    let that = this;
    let currentTab = options.currentTab;//从sharePage页面跳转过来的
    let followed_user_id = options.followed_user_id;
    if (currentTab == 1) {
      this.setData({
        currentTab: currentTab,
        followed_user_id: followed_user_id
      })
    }
    let industry = wx.getStorageSync('industry');
    let stage = wx.getStorageSync('stage');
    let scale = wx.getStorageSync('scale');
    let hotCity = wx.getStorageSync('hotCity')
    this.setData({
      industry: industry,
      stage: stage,
      scale: scale,
      hotCity: hotCity
    })
    // 打上check属性
    this.initData();
  },
  onShow: function () {
    var that = this;
    if (this.data.currentTab == 1) {
      var user_id = this.data.followed_user_id;
      that.setData({
        otherPerson: true,
        user_id: user_id
      })
    } else {
      var user_id = wx.getStorageSync('user_id');
      that.setData({
        otherPerson: false,
        user_id: user_id
      })
    }
    //获取我的项目
    wx.request({
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: user_id,
      },
      method: 'POST',
      success: function (res) {
        var myProject = res.data.data;
        console.log(myProject)
        //刷新数据
        that.setData({
          myProject: myProject,
          myPublic_page_end: false,
          myPublicProject_page: 1
        })
      }
    });
    //加载内容
    wx.request({
      url: url_common + '/api/user/getUserBasicInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        let userInfo = res.data.user_info;
        console.log(userInfo)
        let user_name = userInfo.user_real_name;
        let shop_name = userInfo.shop_name;
        if (userInfo.user_intro) {
          let user_intro = userInfo.user_intro;
          if (user_intro.length >= 55) {
            that.setData({
              contentMore: true
            })
          }
        }
        that.setData({
          userInfo: userInfo
        })
        if (!shop_name) {
          wx.setNavigationBarTitle({
            title: user_name + '的店铺'
          })
        } else {
          wx.setNavigationBarTitle({
            title: shop_name
          })
        }
      }
    })
  },
  //分享页面
  onShareAppMessage: function () {
    let myProject = this.data.myProject;
    let user_id = this.data.user_id;
    let share_id = wx.getStorageSync('user_id');
    if (user_id == share_id) {
      return {
        title: '项目店铺',
        path: '/pages/my/projectShop/projectShop/projectShop?user_id=' + share_id,
        success: function (res) {
          console.log('分享成功', res)
        },
      }
    } else if (user_id != share_id) {
      return {
        title: '项目店铺',
        path: '/pages/my/projectShop/projectShop/projectShop?currentTab=1' + '&&followed_user_id=' + user_id,
        success: function (res) {
          console.log('分享成功', res)
        },
      }
    }

  },
  //下拉框
  move(e) {
    let index = e.currentTarget.dataset.index;
    let currentIndex = this.data.currentIndex;
    console.log(this.data.searchData)
    this.initData();
    if (currentIndex != index) {
      // this.getOffset();
      this.setData({
        currentIndex: index
      })
    } else {
      this.setData({
        currentIndex: 5
      })
    }
  },
  // 获取dropDown
  getOffset() {
    let query = wx.createSelectorQuery();
    query.select('.dropDown').boundingClientRect(res => {
      console.log(res)
      res.top
      res.bottom
      res.left
      res.right
    }).exec();
  },
  // 初始化check值(辅助函数)
  initData() {
    this.initItem('industry');
    this.initItem('stage');
    this.initItem('scale');
    this.initItem('hotCity');
  },
  initItem(str) {
    let itemStr = str;
    let itemArrStr = str + 'Arr';
    let item = this.data[itemStr];
    let itemArr = this.data[itemArrStr]
    let searchData = this.data.searchData;
    let itemIdStr = '';
    let tab = this.data.tab;
    switch (itemStr) {
      case 'industry':
        itemIdStr = 'industry_id'
        break;
      case 'stage':
        itemIdStr = 'stage_id'
        break;
      case 'scale':
        itemIdStr = 'scale_id'
        break;
      case 'hotCity':
        itemIdStr = 'area_id'
        break;
      default:
        console.log('initItem()出了问题')
    }
    itemArr = [];
    item.forEach(x => {
      x.check = false;
      if (searchData[itemStr].indexOf(x[itemIdStr]) != -1) {
        console.log(x[itemIdStr])
        x.check = true;
        itemArr.push(x)
      }
    })
    tab.forEach(x => {
      if (x.id == itemStr) {
        if (itemArr.length > 0) {
          x.arr = true;
        } else {
          x.arr = false;
        }
      }
    })
    this.setData({
      [itemStr]: item,
      [itemArrStr]: itemArr,
      tab: tab
    })
  },
  // 标签选择
  tagsCheck(e) {
    let currentIndex = this.data.currentIndex;
    switch (currentIndex) {
      case 0:
        this.itemCheck(e, 'industry', 'industry_id');
        break;
      case 1:
        this.itemCheck(e, 'stage', 'stage_id');
        break;
      case 2:
        this.itemCheck(e, 'scale', 'scale_id');
        break;
      case 3:
        this.itemCheck(e, 'hotCity', 'area_id');
        console.log(this.data.hotCityArr)
        break;
      default:
        console.log('tagCheck()出错了')
    }
  },
  itemCheck(e, str, itemIdStr) {
    let that = this;
    let itemStr = str;
    let itemArrStr = str + 'Arr';
    let item = this.data[itemStr];
    let itemArr = this.data[itemArrStr];
    let target = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    if (target.check == false) {
      if (itemArr.length < 5) {
        item[index].check = true;
        itemArr.push(target)
      } else {
        app.errorHide(that, '不能选择超过5个标签', 3000)
      }
    } else {
      item[index].check = false;
      itemArr.forEach((y, index) => {
        if (target[itemIdStr] == y[itemIdStr]) {
          itemArr.splice(index, 1)
        }
      })
    }
    this.setData({
      [itemStr]: item,
      [itemArrStr]: itemArr
    })
  },
  // 筛选重置
  reset() {
    let currentIndex = this.data.currentIndex;
    switch (currentIndex) {
      case 0:
        this.itemReset('industry')
        break;
      case 1:
        this.itemReset('stage')
        break;
      case 2:
        this.itemReset('scale')
        break;
      case 3:
        this.itemReset('hotCity')
        break;
      default:
        {
          this.itemReset('industry');
          this.itemReset('stage');
          this.itemReset('scale');
          this.itemReset('hotCity')
        }
    }
    console.log('search', this.data.searchData.industry)
  },
  itemReset(str) {
    let itemStr = str;
    let itemArrStr = str + 'Arr';
    let item = this.data[itemStr];
    let itemArr = this.data[itemArrStr];
    let searchData = this.data.searchData;
    item.forEach(x => {
      x.check = false;
    })
    itemArr = [];
    searchData[itemStr] = [];
    this.setData({
      [itemStr]: item,
      [itemArrStr]: itemArr,
      searchData: searchData
    })
  },
  // 筛选确定
  searchCertain() {
    let currentIndex = this.data.currentIndex;
    let searchData = this.data.searchData;
    let that = this;
    let newArr = [];
    switch (currentIndex) {
      case 0:
        this.data.industryArr.forEach(x => {
          newArr.push(x.industry_id)
        })
        searchData.industry = newArr;
        break;
      case 1:
        this.data.stageArr.forEach(x => {
          newArr.push(x.stage_id)
        })
        searchData.stage = newArr;
        break;
      case 2:
        this.data.scaleArr.forEach(x => {
          newArr.push(x.scale_id)
        })
        searchData.scale = newArr;
        break;
      case 3:
        this.data.hotCityArr.forEach(x => {
          newArr.push(x.area_id)
        })
        searchData.hotCity = newArr;
        break;
      default:
        console.log('searchCertain()出错了')
    }
    this.setData({
      searchData: searchData
    })
    //发送筛选请求
    console.log('search', this.data.searchData, this.data.industryArr)
    this.initData();
    console.log('initData后', this.data.searchData, this.data.industryArr)
    this.setData({
      currentIndex: 5
    })
    /* wx.request({
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: wx.getStorageSync('user_id'),
        filter:searchData
      },
      method: 'POST',
      success: function (res) {
        that.initData();
        console.log(res)
      }
    }); */
  },
  // 点击modal层
  modal() {
    console.log(1)
    let currentIndex = this.data.currentIndex;
    this.setData({
      currentIndex: 5
    })
  },
  //搜索
  searchSth: function () {
    let user_id = this.data.user_id;
    wx.navigateTo({
      url: '/pages/my/projectShop/projectSearch/projectSearch?user_id=' + user_id,
    })
  },
  // 上拉加载
  myPublicProject: function () {
    var that = this;
    var myPublicProject_page = this.data.myPublicProject_page;
    var myPublicCheck = this.data.myPublicCheck;
    var myPublic_page_end = this.data.myPublic_page_end;
    var user_id = wx.getStorageSync('user_id');
    var followed_user_id = this.data.followed_user_id;
    if (myPublicCheck) {
      if (followed_user_id) {
        //判断数据是不是已经全部显示了
        if (myPublic_page_end == false) {
          myPublicProject_page++;
          this.setData({
            myPublicProject_page: myPublicProject_page,
            myPublicCheck: false
          });
          wx.showLoading({
            title: 'loading',
            mask: true,
          })
          wx.request({
            url: url_common + '/api/project/getMyProjectList',
            data: {
              user_id: followed_user_id,
              page: myPublicProject_page,
              type: 'profile'
            },
            method: 'POST',
            success: function (res) {
              var myPublic_page_end = res.data.page_end;
              var newPage = res.data.data;//新请求到的数据
              var myProject = that.data.myProject;//现在显示的数据
              myProject = myProject.concat(newPage)
              that.setData({
                myProject: myProject,
                myPublicCheck: true,
                myPublic_page_end: myPublic_page_end
              })
              wx.hideLoading()
            },
          })
        } else {
          app.errorHide(that, "没有更多了", that, 3000)
          that.setData({
            myPublicCheck: true
          })
        }
      } else {
        //判断数据是不是已经全部显示了
        if (myPublic_page_end == false) {
          myPublicProject_page++;
          this.setData({
            myPublicProject_page: myPublicProject_page,
            myPublicCheck: false
          });
          wx.showLoading({
            title: 'loading',
            mask: true
          })
          wx.request({
            url: url_common + '/api/project/getMyProjectList',
            data: {
              user_id: user_id,
              page: myPublicProject_page,
              type: 'profile'
            },
            method: 'POST',
            success: function (res) {
              var myPublic_page_end = res.data.page_end;
              var newPage = res.data.data;//新请求到的数据
              var myProject = that.data.myProject;//现在显示的数据
              myProject = myProject.concat(newPage)
              that.setData({
                myProject: myProject,
                myPublicCheck: true,
                myPublic_page_end: myPublic_page_end
              })
              wx.hideLoading()
            },
          })
        } else {
          app.errorHide(that, "没有更多了", that, 3000)
          that.setData({
            myPublicCheck: true
          })
        }
      }
    }
  },
  // 项目详情
  detail: function (e) {
    console.log(e)
    var thisData = e.currentTarget.dataset;
    var id = thisData.id;
    var index = thisData.index;
    var currentTab = this.data.currentTab;
    if (currentTab == 1) {
      wx.navigateTo({
        url: '/pages/projectDetail/projectDetail?id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/myProject/projectDetail/projectDetail?id=' + id + "&&index=" + index + "&&currentTab=" + 0
      })
    }
  },
  // 新增项目
  editDetail: function (e) {
    wx.navigateTo({
      url: '/pages/myProject/publishProject/publishProject',
    })
  },
  // 按钮一号
  buttonOne: function () {
    app.infoJump("/pages/myProject/publishProject/publishProject");
  },
  // 店铺装修
  decorate: function () {
    let user_id = this.data.userInfo.user_id;
    wx.navigateTo({
      url: '/pages/my/projectShop/shopEdit/shopEdit?user_id=' + user_id
    })
  },
  // 选中项目
  clickProject: function (e) {
    console.log(e)
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    let myProject = this.data.myProject;
    console.log(myProject)
    let project_id = e.currentTarget.dataset.id;
    let is_top = e.currentTarget.dataset.top;
    wx.request({
      url: url_common + '/api/project/stickProject ',
      data: {
        project_id: project_id,
        user_id: user_id
      },
      method: "POST",
      success: function (res) {
        console.log(res)
        if (res.data.status_code = 200000) {
          myProject.forEach((x) => {
            if (x.project_id == project_id && is_top == 0) {
              x.is_top = 1
            } else if (x.project_id == project_id && is_top == 1) {
              x.is_top = 0
            }
          })
          that.setData({
            myProject: myProject
          })
        }
      }
    })
  },
  //展开
  allPoint: function () {
    this.setData({
      isChecked: false
    })
  },
  //收起
  noPoint: function () {
    this.setData({
      isChecked: true
    })
  },
  //推送项目
  pushProject: function () {
    let pushId = this.data.followed_user_id;
    console.log(pushId)
    wx.redirectTo({
      url: '/pages/myProject/pushTo/pushTo?pushId=' + pushId,
    })
  },
  //更多精选项目
  moreProject: function () {
    wx.switchTab({
      url: '/pages/match/selectProject/selectProject',
    })
  },
  //跳转到我的店铺
  toMyShop: function () {
    let user_id = this.data.user_id;
    wx.redirectTo({
      url: '/pages/my/projectShop/projectShop/projectShop'
    })
  },
  //跳转用户详情
  toPersonDetail: function () {
    let user_id = this.data.user_id;
    let currentUser = wx.getStorageSync('user_id');
    if (user_id != currentUser) {
      wx.navigateTo({
        url: '/pages/userDetail/networkDetail/networkDetail?id=' + user_id,
      })
    }
  }
})