var rqj = require('../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as CreateProject from '../../utils/createProjectBottom'
Page({
  data: {
    imgUrls: app.globalData.picUrl.page_matchInvestorEmpty
  },
  onShow() {
    let that = this;
    this.getMyProject();
    app.initPage(that);
  },
  // 获取项目信息
  getMyProject() {
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    wx.showLoading({
      title: 'loading',
    })
    wx.request({
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: user_id,
        type: 'match'
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        let myProject = res.data.data;
        // 拼接industryArry和otherTag用于展示
        if (myProject) {
          myProject.forEach(x => {
            x.industryArr = '';
            x.otherTag = '';
            if (x.pro_industry.length != 0) {
              x.pro_industry.forEach((y, index) => {
                if (index != x.pro_industry.length - 1) {
                  x.industryArr += y.industry_name + '、'
                } else {
                  x.industryArr += y.industry_name
                }
              })
            }
            if (x.pro_finance_stock_after == 0.00) x.pro_finance_stock_after = 0;
            x.otherTag = x.pro_scale.scale_money + '、' + x.pro_finance_stock_after + '%、' + x.pro_stage.stage_name + '、' + x.pro_area.area_title
          })
        }
        console.log('项目列表', myProject)
        //刷新数据
        that.setData({
          myProject: myProject,
        })
      }
    })
  },
  //发布融资项目
  publicBtn: function () {
    CreateProject.toCreateProject();
  },
  //一键推送
  goToMatchInvestor(e) {
    let id = e.currentTarget.dataset.proId;
    wx.navigateTo({
      url: '/pages/myProject/projectDetail/projectDetail?id=' + id + "&&currentTab=" + 1
    })
  },
  // 浏览
  viewProject: function (e) {
    let project_id = e.currentTarget.dataset.proid;
    wx.navigateTo({
      url: '/pages/message/viewProjectUser/viewProjectUser?project_id=' + project_id,
    })
  },
  //申请查看
  applyPerson: function (e) {
    console.log(e)
    let proid = e.currentTarget.dataset.proid;
    wx.navigateTo({
      url: '/pages/message/applyPerson/applyPerson?id=' + proid,
    })
  },
  //约谈
  hasMeeting: function (e) {
    let projectId = e.currentTarget.dataset.proid;
    wx.navigateTo({
      url: '/pages/message/contactProject/projectList/projectList?id=' + projectId,
    })
  },
  //项目详情
  projectDetail(e) {
    let pro_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/myProject/projectDetail/projectDetail?id=' + pro_id,
    })
  },
  //加载更多
  loadMore() {
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    let currentPage = this.data.currentPage;
    let myProject = this.data.myProject;
    let request = {
      url: url_common + '/api/project/getMyProjectList',
      data: {
        user_id: user_id,
        type: 'match',
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
      if (page_end = true) {
        app.errorHide(that, '没有更多了', 3000)
      }
    })
  },

  //----------------------创建项目引导------------------------------------------------ 
  // 跳转创建项目页面
  toCreateProject: function () {
    CreateProject.toCreateProject();
  },
  // 在电脑上创建
  createProjectPc() {
    CreateProject.createProjectPc();
  },
})