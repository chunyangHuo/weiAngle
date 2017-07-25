var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        notIntegrity: 0,//检查个人信息是否完整
        industryFilter: [],
        stageFilter: [],
        empty: 0

    },
    onShow: function () {
        var that = this;
        app.initPage(that);
        var user_id=this.data.user_id;
        var industryFilter = wx.getStorageSync("industryFilter") || [];
        var stageFilter = wx.getStorageSync("stageFilter") || [];
        that.setData({
            user_id: user_id,
            scroll: 0,
           requestCheck:true,
            currentPage: 1,
            page_end: false,
        })
        // 检查个人信息全不全
        if (user_id == 0) {
            console.log(user_id)
            wx.request({
                url: url_common + '/api/user/checkUserInfo',
                data: {
                    user_id: user_id
                },
                method: 'POST',
                success: function (res) {
                    that.setData({
                        notIntegrity: res.data.is_complete,
                        empty: 1
                    })
                    console.log(notIntegrity)
                },
                fail: function (res) {
                    wx.showToast({
                        title: res
                    })
                },
            })
        }
        // 获取人脉库信息
        if (user_id) {
            wx.request({
                url: url + '/api/user/getMyFollowList',
                data: {
                    user_id: user_id,
                    page: 1,
                    filter: {
                        search: "",
                        'industry': industryFilter,
                        'stage': stageFilter
                    }
                },
                method: 'POST',
                success: function (res) {
                    console.log("我的人脉列表")
                    console.log(res)
                    var contacts = res.data.data;//所有的用户
                    var page_end = res.data.page_end;
                    if (contacts.length != 0) {
                        that.setData({
                            empty: 0
                        })
                    } else if (contacts.length == 0) {
                        if (stageFilter.length != 0 || industryFilter.length != 0) {
                            that.setData({
                                empty: 2
                            })
                        } else {
                            that.setData({
                                empty: 1,
                                notIntegrity: 1
                            })
                        }
                    }
                    that.setData({
                        contacts: contacts,
                        page_end: page_end,
                        currentPage: 1
                    })
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
    //我的名片
    myCard: function () {
        var that = this;
        var user_id = this.data.user_id;
        //获取用户信息
        wx.request({
          url: url_common + '/api/user/getUserAllInfo',
            data: {
                share_id: 0,
                user_id: user_id,
                view_id: user_id
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                if (res.data.status_code == 2000000) {
                    wx.showModal({
                        titel: "友情提示",
                        content: "分享名片功能需要在个人页面点击去交换按钮实现",
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm == true) {
                                wx.switchTab({
                                    url: '/pages/my/my/my',
                                })
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: "友情提示",
                        content: "交换名片之前,请先完善自己的名片",
                        success: function (res) {
                            if (res.confirm == true) {
                                wx.navigateTo({
                                    url: '/pages/my/cardEdit/cardEdit',
                                })
                            }
                        }
                    })
                }
            },
            fail: function (res) {
                wx.showToast({
                    title: "对不起没有获取到您的个人信息"
                })
            },
        })
    },
    // 搜索姓名公司和电话
    searchSth: function () {
        wx.navigateTo({
            url: '/pages/search/search2/search2',
        })
    },
    // 筛选内容
    screenSth: function () {
        wx.navigateTo({
            url: '/pages/search/filter4/filter4',
        })
    },
    // 绑定名片
    bindUserInfo: function () {
        app.infoJump()
    },
    // 一键拨号
    telephone: function (e) {
        var telephone = e.currentTarget.dataset.telephone;
        wx.makePhoneCall({
            phoneNumber: telephone,
        })
    },
    //上拉加载
    loadMore: function () {
        //请求上拉加载接口所需要的参数
        var that = this;
        var user_id = wx.getStorageSync('user_id');
        var currentPage = this.data.currentPage;
        var industryFilter = wx.getStorageSync("industryFilter") || [];
        var stageFilter = wx.getStorageSync("stageFilter") || [];
        var request = {
            url: url + '/api/user/getMyFollowList',
            data: {
                user_id: user_id,
                page: this.data.currentPage,
                filter: {
                    search: "",
                    'industry': industryFilter,
                    'stage': stageFilter
                }
            }
        }
        //调用通用加载函数
        app.loadMore(that, request, "contacts",that.data.contacts)
    },
})