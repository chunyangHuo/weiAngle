var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        slectProject: '',
    },
    onShow: function () {
        var that = this;
        //初始化数据
        app.initPage(that)
        var user_id=this.data.user_id;
        //消除人脉筛选缓存(非contacts都需要)
        app.contactsCacheClear();
        //请求精选项目数据
        wx.request({
          url: url_common + '/api/project/getSelectedProjectList',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
              console.log(res)
                var slectProject = res.data.data;
                that.setData({
                    slectProject: slectProject,
                })
            }
        })
    },
    //上拉加载
    loadMore:function(){
        //请求上拉加载接口所需要的参数
        var that = this;
        var user_id=this.data.user_id;
        var currentPage = this.data.currentPage;
        var request = {
          url: url_common + '/api/project/getSelectedProjectList',
            data: {
                user_id: user_id,
                page: this.data.currentPage,
            }
        }
        //调用通用加载函数
        app.loadMore(that, request, "slectProject", that.data.slectProject)
    },
    //项目详情
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
    //分享当前页面
    onShareAppMessage: function () {
        return {
            title: '来微天使找优质项目',
            path: '/pages/match/selectProject/selectProject'
        }
    },
    // 跳转创建项目页面
    toCreateProject:function(){
      wx.navigateTo({
        url: '/pages/myProject/publishProject/publishProject'
      })
    },
    // 申请查看
    matchApply: function (e) {
      var user_id = wx.getStorageSync('user_id');//获取我的user_id
      let that = this;
      // content: 0(申请查看) 1: (重新申请)
      let content = e.currentTarget.dataset.content;
      let project_id = e.currentTarget.dataset.project;
      let getMatchList = this.data.slectProject;
      // button-type: 0=申请中 1.申请已通过 2.申请被拒绝(重新申请) 3.推送给我的 4.未申请也未推送(申请按钮)
      app.applyProjectTo(that, project_id, content, getMatchList)
      console.log(0,this.data.getMatchList)
    },
})