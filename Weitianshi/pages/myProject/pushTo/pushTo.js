// pages/myProject/pushTo/pushTo.js
var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        dataList: {
            tagsData: ''
        },
        clicked: false,
    },
    onLoad: function (options) {
        let pushed_user_id = options.pushId;
        let that = this;
        that.setData({
            pushed_user_id: pushed_user_id
        })
    },
    onShow: function () {
        var that = this;
        app.initPage(that);
        let user_id = wx.getStorageSync('user_id');
        let pushed_user_id = this.data.pushed_user_id;
        that.setData({
            user_id: user_id,
            scroll: 0,
            requestCheck: true,
            currentPage: 1,
            page_end: false,
        })
        wx.request({
            url: url_common + '/api/project/getMyProjectListOrderByMatch',
            data: {
                user_id: user_id,
                pushed_user_id: pushed_user_id,
                page: 1
            },
            method: 'POST',
            success: function (res) {
                let dataList = res.data.data;
                let pushTimes = res.data.push_times;
                var page_end = res.data.page_end;
                if (dataList.length != 0) {
                    dataList.forEach((x, index) => {
                        dataList[index] = x;
                    })
                }
                // is_exclusive是否独家 1独家 2非独家 0其他
                that.setData({
                    dataList: dataList,
                    pushTimes: pushTimes,
                    pushed_user_id: pushed_user_id
                })
            }
        })
    },

    // 创建项目
    createProject: function () {
        wx.navigateTo({
            url: '/pages/myProject/publishProject/publishProject',
        })
    },
    //点击选中标签
    checkboxChange(e) {
        let overTime = this.data.pushTimes.remain_times;
        let dataList = this.data.dataList;
        let that = this;
        let tagsData = e.currentTarget.dataset;
        let index = tagsData.index;
        let checkObject = [];
        dataList[index].check = !dataList[index].check;
        let checkedNum = 0
        dataList.forEach((x) => {
            if (x.check == true) {
                checkedNum++
            }
        })
        if (overTime != 0) {
            if (checkedNum > 5) {
                dataList[index].check = !dataList[index].check;
                app.errorHide(that, "最多可选择五项", 1000)
            } else {
                if (checkedNum > overTime) {
                    dataList[index].check = !dataList[index].check;
                    app.errorHide(that, "超过了推送限制", 1000)
                } else {
                    that.setData({
                        dataList: dataList
                    })
                }
            }
        } else if (overTime == 0) {
            app.errorHide(that, "今日推送次数已用完", 1000)
        }
        dataList.forEach((x) => {
            if (x.check == true) {
                checkObject.push(x)
            }
        })
        that.setData({
            checkObject: checkObject
        })
    },
    //推送
    pushTo: function () {
        let user_id = wx.getStorageSync('user_id');
        let pushed_user_id = this.data.pushed_user_id;
        let time = this.data.pushTimes;
        let remainTimes = time.remain_times;
        let that = this;
        let checkObject = this.data.checkObject;
        let projectList = []
        if (checkObject) {
            checkObject.forEach((x) => {
                projectList.push(x.project_id)
            })
        }

        if(remainTimes===0){
            app.errorHide(that, "今日推送次数已用完", 1000)
        } else if (!checkObject){
            app.errorHide(that, "没有选择任何项目", 1000)
        }else{
            that.setData({
                clicked:true
            })
            wx.request({
                url: url_common + '/api/project/pushProjectToUser',
                data: {
                    user_id: user_id,
                    pushed_user_id: pushed_user_id,
                    pushed_project: projectList
                },
                method: 'POST',
                success: function (res) {
                    let statusCode = res.data.status_code;
                    if (statusCode == 2000000) {
                        wx.showToast({
                            title: '成功',
                            icon: 'success',
                            duration: 2000
                        })
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 2000)
                    } else if (statusCode == 490001) {
                        app.errorHide(that, "没有选择任何项目", 1000)
                    }
                }
            })
        }
    },
    //上拉加载
    loadMore: function () {
        //请求上拉加载接口所需要的参数
        var that = this;
        var user_id = wx.getStorageSync('user_id');
        var currentPage = this.data.currentPage;
        let pushed_user_id = this.data.pushed_user_id;
        var request = {
            url: url_common + '/api/project/getMyProjectListOrderByMatch',
            data: {
                user_id: user_id,
                page: this.data.currentPage,
                type: 'push',
                pushed_user_id: pushed_user_id

            }
        }
        //调用通用加载函数
        app.loadMore(that, request, "dataList", that.data.dataList)
    },
})