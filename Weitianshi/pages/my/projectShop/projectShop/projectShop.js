let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
import * as ShareModel from '../../../../utils/shareModel';
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
    banner_personShop: app.globalData.picUrl.banner_personShop,
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
      schedule: [],
    },
    myPublicProject_page: 1,
    myPublicCheck: true,
    myPublic_page_end: false,
    check: false,
    isChecked: true,
    contentMore: false,
    otherPerson: false,
    notHave: 1,
    firstTime: true
  },
  onLoad: function (options) {
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
    let that = this;
    let followed_user_id = options.followed_user_id;
    let industry = wx.getStorageSync('industry');
    let stage = wx.getStorageSync('stage');
    let scale = wx.getStorageSync('scale');
    let hotCity = wx.getStorageSync('hotCity');
    let searchData = this.data.searchData;
    this.setData({
      followed_user_id: followed_user_id,
      industry: industry,
      stage: stage,
      scale: scale,
      hotCity: hotCity
    });
    app.loginPage(user_id => {
      app.initPage(that)
      //判断是不是分享页面,并判断分享者和查看者是不是本人 
      if (followed_user_id && followed_user_id != user_id) {
        this.setData({
          user_id: followed_user_id,
          otherPerson: true
        })
      } else {
        this.setData({
          user_id: user_id
        })
      }
      this.getProjectInfo();
      this.getUserInfo();
      // 打上check属性
      this.initData();
      app.httpPost({
        url: url_common + '/api/project/getNodeCount',
        data: {
          user_id: followed_user_id
        }
      }, that).then(res => {
        let node_list = res.data.data.node_list;
        console.log(node_list)
        that.setData({
          node_list: node_list
        })
      })
    });


  },
  onShow: function () {
    if (!this.data.firstTime) {
      console.log('onShow', this.data.user_id)
      this.setData({
        requestCheck: true,
        currentPage: 1,
        page_end: false
      })
      this.getProjectInfo();
      this.getUserInfo();
    }
  },
  //获取项目详情
  getProjectInfo() {
    let that = this;
    wx.request({
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: this.data.user_id,
        filter: this.data.searchData
      },
      method: 'POST',
      success: function (res) {
        let myProject = res.data.data;
        wx.hideLoading();
        //刷新数据
        that.setData({
          myProject: myProject,
          myPublic_page_end: false,
          myPublicProject_page: 1
        })
      }
    });
  },
  //获取用户详情 
  getUserInfo() {
    let that = this;
    wx.request({
      url: url_common + '/api/user/getUserBasicInfo',
      data: {
        user_id: this.data.user_id
      },
      method: 'POST',
      success: function (res) {
        let userInfo = res.data.user_info;
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
    let that = this;
    return ShareModel.projectShopShare(that);
  },
  // 下拉框
  move(e) {
    let index = e.currentTarget.dataset.index;
    let currentIndex = this.data.currentIndex;
    this.initData();
    if (currentIndex != index) {
      this.setData({
        currentIndex: index
      })
      this.getOffset();
    } else {
      this.setData({
        currentIndex: 5
      })
    }
  },
  // 获取dropDown
  getOffset() {
    let query = wx.createSelectorQuery();
    query.select('.dropDown').fields({
      dataset: true,
      size: true,
    }, function (res) {
      res.dataset    // 节点的dataset
      res.width      // 节点的宽度
      res.height     // 节点的高度
    }).exec()
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
      searchData: searchData,
      requestCheck: true,
      currentPage: 1,
      page_end: false
    })
    // 发送筛选请求
    this.requestPost();
  },

  // 评分阶段筛选
  scheduleCheck(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let node_list = this.data.node_list;
    let searchData = this.data.searchData;
    searchData.schedule = [];
    node_list.forEach(x => {
      x.is_select = 0;
    })
    node_list[index].is_select = 1;
    searchData.schedule.push(node_list[index].schedule_id)
    this.setData({
      node_list: node_list,
      searchData: searchData
    })
    // 发送筛选请求
    this.requestPost();
  },
  // 发送筛选请求
  requestPost(searchData) {
    let that = this;
    wx.request({
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: this.data.user_id,
        filter: this.data.searchData
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.initData();
        if (res.data.data.length == 0) {
          that.setData({
            currentIndex: 5,
            myProject: res.data.data,
            notHave: 0
          })
        } else {
          that.setData({
            currentIndex: 5,
            myProject: res.data.data
          })
        }
      }
    });
  },
  // 点击modal层
  modal() {
    let currentIndex = this.data.currentIndex;
    this.setData({
      currentIndex: 5
    })
  },
  // 搜索
  searchSth: function () {
    let user_id = this.data.user_id;
    app.href('/pages/my/projectShop/projectSearch/projectSearch?user_id=' + user_id)
  },
  // 上拉加载
  loadMore() {
    let that = this;
    let searchData = this.data.searchData;
    let myProject = this.data.myProject;
    let currentPage = this.data.currentPage;
    let request = {
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: this.data.user_id,
        filter: searchData,
        page: currentPage
      },
    }
    app.loadMore2(that, request, res => {
      console.log(res)
      let newPage = res.data.data;
      let page_end = res.data.page_end;
      if (myProject) {
        myProject = myProject.concat(newPage)
        currentPage++;
        that.setData({
          myProject: myProject,
          page_end: page_end,
          requestCheck: true,
          currentPage: currentPage
        })
      }
    });
    if (page_end = true) {
      app.errorHide(that, '没有更多了', 3000)
    }
  },
  // 项目详情
  detail: function (e) {
    let thisData = e.currentTarget.dataset;
    let id = thisData.id;
    let index = thisData.index;
    let user_id = wx.getStorageSync('user_id');
    let followed_user_id = this.followed_user_id;
    // followed_user_id 存在:他人的店铺详情;不存在:自己的店铺详情
    if (followed_user_id) {
      app.href('/pages/projectDetail/projectDetail?id=' + id + "&&index=" + index + "&&share_id=" + user_id)
    } else {
      app.href('/pages/myProject/projectDetail/projectDetail?id=' + id + "&&index=" + index)
    }
  },
  // 新增项目
  editDetail: function (e) {
    this.identity('/pages/myProject/publishProject/publishProject?type=8', 1)
  },
  // 店铺装修
  decorate: function () {
    let user_id = this.data.userInfo.user_id;
    app.href('/pages/my/projectShop/shopEdit/shopEdit?user_id=' + user_id)
  },
  // 选中项目
  clickProject: function (e) {
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    let myProject = this.data.myProject;
    let project_id = e.currentTarget.dataset.id;
    let is_top = e.currentTarget.dataset.top;
    wx.request({
      url: url_common + '/api/project/stickProject',
      data: {
        project_id: project_id,
        user_id: user_id
      },
      method: "POST",
      success: function (res) {
        if (res.data.status_code = 200000) {
          myProject.forEach((x) => {
            if (x.project_id == project_id && is_top == 0) {
              app.errorHide(that, "设为推荐项目", 1000)
              x.is_top = 1
            } else if (x.project_id == project_id && is_top == 1) {
              app.errorHide(that, "取消推荐项目", 1000)
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
    let pushId = this.data.user_id;
    this.identity('/pages/myProject/pushTo/pushTo?pushId=' + pushId, 2)
  },
  //更多精选项目
  moreProject: function () {
    wx.switchTab({
      url: '/pages/discoverProject/discoverProject',
    })
  },
  //跳转到我的店铺
  toMyShop: function () {
    this.identity('/pages/my/projectShop/projectShop/projectShop', 2)
  },
  //跳转用户详情
  toPersonDetail: function () {
    let user_id = this.data.user_id;
    let currentUser = wx.getStorageSync('user_id');
    if (user_id != currentUser) {
      app.href('/pages/userDetail/networkDetail/networkDetail?id=' + user_id)
    }
  },
  //身份验证
  identity: function (targetUrl, num) {
    let user_id = wx.getStorageSync('user_id');
    wx.request({
      url: url_common + '/api/user/checkUserInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == 2000000) {
          let complete = res.data.is_complete;
          if (complete == 1) {
            if (targetUrl && num == 1) {
              wx.navigateTo({
                url: targetUrl
              })
            } else if (targetUrl && num == 2) {
              wx.redirectTo({
                url: targetUrl
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
      }
    })
  },
  //分享店铺
  toShareShop() {
    app.href("/pages/my/projectShop/shopShare/shopShare")
  }
})