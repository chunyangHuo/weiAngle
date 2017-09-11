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
    myPublicProject_page: 1,
    myPublicCheck: true,
    myPublic_page_end: false,
    check: false
  },
  onLoad: function (options) {
    var that = this;
    var currentTab = options.currentTab;//从sharePage页面跳转过来的
    var followed_user_id = options.followed_user_id;
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
    wx.removeStorageSync("investors")
    var that = this;
    if (this.data.currentTab == 1) {
      var user_id = this.data.followed_user_id
    } else {
      var user_id = wx.getStorageSync('user_id')
    }
    //获取我的项目匹配到的投资人
    wx.request({
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        var myProject = res.data.data;
        console.log(myProject)
        //将匹配出来的四个人放入缓存
        var investors = [];
        var cards = res.data.data;
        cards.forEach((x) => {
          investors.push(x.match_investors)
        })
        wx.setStorageSync('investors', investors);
        //刷新数据
        that.setData({
          myProject: myProject,
          investors: investors,
          myPublic_page_end: false,
          myPublicProject_page: 1
        })
      }
    });
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
  getOffset(){ 
    let query=wx.createSelectorQuery();
    query.select('.dropDown').boundingClientRect(res=>{
      console.log(res)
      res.top
      res.bottom
      res.left
      res.right
    }).exec();
  },
  // 清空check值(辅助函数)
  initData() {
    let industry = this.data.industry;
    let stage = this.data.stage;
    let scale = this.data.scale;
    let hotCity = this.data.hotCity;
    let that = this;
    industry.forEach(x => {
      x.check = false;
    })
    stage.forEach(x => {
      x.check = false;
    })
    scale.forEach(x => {
      x.check = false;
    })
    hotCity.forEach(x => {
      x.check = false;
    })
    that.setData({
      industry: industry,
      stage: stage,
      scale: scale,
      hotCity: hotCity
    })
  },
  // 筛选项重置(辅助函数)
  itemReset(item){
    let industry=this.data.industry;
    let stage=this.data.stage;
    let scale=this.data.scale;
    let hotCity=this.data.hotCity;
    switch(item){
      case 'industry':
        {industry.forEach(x=>{x.check=false;})}
        break;
      case 'stage':
        { stage.forEach(x => { x.check = false; }) }
        break;
      case 'scale':
        { scale.forEach(x => { x.check = false; }) }
        break;
      case 'hotCity':
        { hotCity.forEach(x => { x.check = false; }) }
        break;    
    }
    this.setData({
      industry:industry,
      stage:stage,
      scale:scale,
      hotCtiy:hotCity
    })
  },
  // 标签选择
  tagsCheck(){
    app.tagsCheck(that, e, tags, str)
  },
  // 搜索重置
  reset(){
    let currentIndex=this.data.currentIndex;
    switch(currentIndex){
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
        {this.itemReset('industry');this.itemReset('stage');this.itemReset('scale');this.itemReset('hotCity')}    
    }
  },
  // 搜索确定
  searchCertain(){
    let currentIndex = this.data.currentIndex;
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
    wx.navigateTo({
      url: '/pages/my/projectShop/shopEdit/shopEdit'
    })
  }, 
  // 选中项目
  clickProject: function (e) {
   console.log(e)
    let  that = this;
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
  }
})