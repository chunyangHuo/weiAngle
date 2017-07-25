// pages/message/viewProjectUser/viewProjectUser.js
var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        count: 0
    },
    onLoad: function (options) {
        console.log(options);
    },
    onShow: function () {
        var that = this;
        // 初始化下拉加载相关参数
        app.initPage(that);
        var user_id = this.data.user_id;
        let project_id = wx.getStorageSync("projectId");
        console.log(project_id)
        // 获取浏览我的用户信息
        if (user_id) {
            wx.request({
                url: url_common + '/api/message/viewProjectUserList',
                data: {
                    user_id: user_id,
                    project_id: project_id,
                    type_id: 6
                },
                method: 'POST',
                success: function (res) {
                    console.log("浏览了我的項目")
                    console.log(res)
                    var contacts = res.data.list.users;
                    var count = res.data.list.count;
                    console.log(count)
                    that.setData({
                        contacts: contacts,
                        count: count,
                        project_id: project_id
                    })
                }
            })
        }

        //向后台发送信息取消红点
        wx.request({
            url: url_common + '/api/message/setProjectViewToRead',
            data: {
                user_id: user_id,
                project_id: project_id,
                type_id: 6
            },
            method: "POST",
        })
        wx.removeStorageSync("project_id")
    },
    // 添加人脉
    addNetWork: function (e) {
        var that = this;
        var user_id = wx.getStorageSync('user_id');//获取我的user_id
        var followed_user_id = e.target.dataset.followedid;//当前用户的user_id
        var follow_status = e.currentTarget.dataset.follow_status;
        var index = e.target.dataset.index;
        var contacts = this.data.contacts
        console.log(contacts)
        console.log(user_id, followed_user_id);
        if (follow_status == 0) {
            //添加人脉接口
            wx.request({
                url: url + '/api/user/UserApplyFollowUser',
                data: {
                    user_id : user_id,
                    applied_user_id: followed_user_id
                },
                method: 'POST',
                success: function (res) {
                    console.log(res)
                    if (res.data.status_code == 2000000) {
                        //将状态设为"未验证"
                        contacts.forEach((x) => {
                            if (x.user_id == followed_user_id) {
                                x.follow_status = 2
                            }
                        })
                        that.setData({
                            contacts: contacts
                        })
                    }
                },
                fail: function (res) {
                    wx.showModal({
                        title: "错误提示",
                        content: "添加人脉失败" + res
                    })
                },
            })

        } else if (follow_status == 3) {
            // 同意申請接口
            wx.request({
                url: url + '/api/user/handleApplyFollowUser',
                data: {
                    user_id: user_id,
                    apply_user_id: followed_user_id
                },
                method: 'POST',
                success: function (res) {
                    console.log(res)
                    console.log("同意申請")
                    if (res.data.status_code == 2000000) {
                        //将状态设为"未验证"
                        contacts.forEach((x) => {
                            if (x.user_id == followed_user_id) {
                                x.follow_status = 1
                            }
                        })
                        that.setData({
                            contacts: contacts
                        })
                    }
                }
            })
        }
    },
    // 用户详情
    userDetail: function (e) {
        var id = e.currentTarget.dataset.id
        console.log(id);
        wx.navigateTo({
            url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
        })
    },
    //下拉加载
    loadMore: function () {
        var that = this;
        var user_id = this.data.user_id
        var currentPage = this.data.currentPage;
        var project_id = this.data.project_id;
        console.log(user_id, project_id, currentPage)
        var request = {
            url: url_common + '/api/message/viewProjectUserList',
            data: {
                user_id: user_id,
                project_id: project_id,
                page: currentPage,
                type_id: 6
            }
        }
        //调用通用加载函数
        this.more(that, request, "contacts", that.data.contacts)
    },
    //下拉加载模版
    more: function (that, request, str, dataSum) {
        var user_id = wx.getStorageSync("user_id");
        if (that.data.requestCheck) {
            if (user_id != '') {
                if (that.data.page_end == false) {
                    wx.showToast({
                        title: 'loading...',
                        icon: 'loading'
                    })
                    request.data.page++;
                    that.setData({
                        currentPage: request.data.page,
                        requestCheck: false
                    });
                    //请求加载数据
                    wx.request({
                        url: request.url,
                        data: request.data,
                        method: 'POST',
                        success: function (res) {
                            console.log(res)
                            var newPage = res.data.list.users;
                            var page_end = res.data.page_end;
                            for (var i = 0; i < newPage.length; i++) {
                                dataSum.push(newPage[i])
                            }
                            that.setData({
                                [str]: dataSum,
                                page_end: page_end,
                                requestCheck: true
                            })
                        }
                    })
                } else {
                    rqj.errorHide(that, "没有更多了", 3000)
                    that.setData({
                        requestCheck: true
                    });
                }
            }
        }
    }
})