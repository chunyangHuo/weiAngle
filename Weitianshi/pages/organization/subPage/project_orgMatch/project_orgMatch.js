let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
import * as ShareModel from '../../../../utils/shareModel';
Page({
  data: {
 
    currentIndex: 5,
    industryArr: [],
    stageArr: [],
    scaleArr: [],
    hotCityArr: [],
    myPublicProject_page: 1,
    myPublicCheck: true,
    myPublic_page_end: false,
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

    });


  },
  onShow: function () {
    // console.log(111)
    if (!this.data.firstTime) {
      // console.log('onShow', this.data.user_id)
      this.setData({
        requestCheck: true,
        currentPage: 1,
        page_end: false
      })
      this.getProjectInfo();
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

  //分享页面
  onShareAppMessage: function () {
    let that = this;
    return ShareModel.projectShopShare(that);
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
      // console.log(res)
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
      wx.navigateTo({
        url: '/pages/projectDetail/projectDetail?id=' + id + "&&index=" + index + "&&share_id=" + user_id
      })
    } else {
      wx.navigateTo({
        url: '/pages/myProject/projectDetail/projectDetail?id=' + id + "&&index=" + index
      })
    }
  },


  //展开
  // allPoint: function () {
  //   this.setData({
  //     isChecked: false
  //   })
  // },
  //收起
  // noPoint: function () {
  //   this.setData({
  //     isChecked: true
  //   })
  // },


})