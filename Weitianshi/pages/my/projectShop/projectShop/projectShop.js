var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    buttonOne: {
      text: "新增项目"
    },
    tab: [
      { name: '领域', check: false },
      { name: '轮次', check: false },
      { name: '金额', check: false },
      { name: '地区', check: false }
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
        otherPerson: true
      })
    } else {
      var user_id = wx.getStorageSync('user_id');
      that.setData({
        otherPerson: false
      })
    }
    //获取我的项目
    wx.request({
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: user_id
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
        let user_name = userInfo.user_real_name;
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
        wx.setNavigationBarTitle({
          title: user_name + '的店铺'
        })
      }
    })
  },
  //下拉框
  move(e) {
    let index = e.currentTarget.dataset.index;
    let currentIndex = this.data.currentIndex;
    if (currentIndex != index) {
      this.getOffset();
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
    let that = this;
    let industry = this.data.industry;
    let stage = this.data.stage;
    let scale = this.data.scale;
    let hotCity = this.data.hotCity;
    let searchData = this.data.searchData;
    industry.forEach(x => {
      x.check = false;
      if (searchData.industry.indexOf(x.industry_id) != -1) {
        x.check = true;
      }
    })
    stage.forEach(x => {
      x.check = false;
      if (searchData.stage.indexOf(x.stage_id) != -1) {
        x.check = true;
      }
    })
    scale.forEach(x => {
      x.check = false;
      if (searchData.scale.indexOf(x.scale_id) != -1) {
        x.check = true;
      }
    })
    hotCity.forEach(x => {
      x.check = false;
      if (searchData.hotCity.indexOf(x.area_id) != -1) {
        x.check = true;
      }
    })
    that.setData({
      industry: industry,
      stage: stage,
      scale: scale,
      hotCity: hotCity
    })

  },
  initItem(str) {
    let itemStr = str;
    let itemArrStr = str + 'Arr';
    let item = this.data[itemStr];
    let itemArr = this.data[itemArrStr]
    let searchData = this.data.searchData;
    let itemIdStr = '';
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
    item.forEach(x => {
      x.check = false;
      itemArr = [];
      if (searchData[item].indexOf(x[itemIdStr]) != -1) {
        x.check = true;
        itemArr.push(x)
      }
    })
  },
  // 筛选项重置(辅助函数)
  itemReset(str) {
    let itemStr = str;
    let itemArrStr = str + 'Arr';
    let item = this.data[itemStr];
    let itemArr = this.data[itemArrStr];
    item.forEach(x => {
      x.check = false;
    })
    itemArr = [];
    this.setData({
      [itemStr]: item,
      [itemArrStr]: itemArr
    })
  },
  // 标签选择
  tagsCheck(e) {
    let that = this;
    let industry = this.data.industry;
    let industryArr = this.data.industryArr;
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    if (item.check == false) {
      if (industryArr.length < 5) {
        industry[index].check = true;
        industryArr.push(item)
      } else {
        app.errorHide(that, '不能选择超过5个标签', 3000)
      }
    } else {
      industry[index].check = false;
      industryArr.forEach((y, index) => {
        if (item.id == y.id) {
          industryArr.splice(index, 1)
        }
      })
    }
    this.setData({
      industry: industry,
      industryArr: industryArr
    })
    console.log('industryArr', industryArr)
  },
  // 搜索重置
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
  // 搜索确定
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
      case 4:
        this.data.scaleArr.forEach(x => {
          newArr.push(x.area_id)
        })
        searchData.hotCity = newArr;
        break;
      default:
        console.log('出错了,不知道点了哪个确定')
    }
    this.setData({
      searchData: searchData
    })
    //发送筛选请求
    console.log('search', this.data.searchData.industry)
    this.initData();
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
  // 编辑项目
  editDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var user_id = wx.getStorageSync('user_id');
    var currentTab = this.data.currentTab;
    if (currentTab != 1) {
      wx.navigateTo({
        url: '/pages/myProject/editProject/editProject?project_id=' + id + "&&user_id=" + user_id,
      })
    }
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
    let myProject = this.data.myProject;
    // let proId = e.currentTarget.dataset.id;
    if (team.check == false) {
      warband[index].check = true;
      joinedWarband.push(team)
    } else {
      warband[index].check = false;
      joinedWarband.forEach((x, index) => {
        if (x.team_id === team.team_id) {
          joinedWarband.splice(index, 1)
        }
      })
    }
    this.setData({
      warband: warband,
      joinedWarband: joinedWarband
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
      url:'/pages/my/projectShop/projectShop/projectShop'
    })
  }
})