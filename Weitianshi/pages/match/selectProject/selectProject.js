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
        console.log(request)
        //调用通用加载函数
        app.loadMore(that, request, "slectProject", that.data.slectProject)
    },
    //项目详情
    yourDetail: function (e) {
        var thisData = e.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/projectDetail/projectDetail?id=' + thisData.id
        })
    },
    //分享当前页面
    onShareAppMessage: function () {
        return {
            title: '来微天使找优质项目',
            path: '/pages/match/selectProject/selectProject'
        }
    }
})