// pages/network/search/search.js
var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        empty: 0,
        currentPage: 1,
        searchCheck: true,
        page_end: false,
        contacts: [],
    },

    onLoad: function (options) {
        this.setData({
            currentPage: 1,
            searchCheck: true,
            page_end: false,
            contacts: []
        })
    },

    onShow: function () {

    },
    // 用户详情
    userDetail: function (e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
        })
    },
    // 人脉搜索
    searchSth: function (e) {
        var that = this;
        var user_id = wx.getStorageSync('user_id');
        that.setData({
            user_id: user_id,
            page_end: false,
            scroll: 0,
            contacts_page: 1
        })
        var find = e.detail.value;
        if (find === '') {
            that.setData({
                contacts: '',
                empty: 0
            })
        } else {
            wx.request({
                url: url + '/api/user/getMyFollowList',
                data: {
                    user_id: user_id,
                    page: 1,
                    filter: {
                        search: find,
                        industry: [],
                        stage: []
                    }
                },
                method: 'POST',
                success: function (res) {
                    var contacts = res.data.data;//所有的用户
                    var page_end = res.data.page_end;
                    that.setData({
                        contacts: contacts,
                        page_end: page_end,
                        currentPage: 1,
                        find: find
                    })
                    if (contacts.length !== 0) {
                        that.setData({
                            empty: 0
                        })
                    } else {
                        that.setData({
                            empty: 1
                        })
                    }
                }
            })
        }
    },
    // 取消
    searchEsc: function () {
        wx.switchTab({
            url: '/pages/contacts/contacts/contacts'
        })
    },
    // 绑定名片
    // bindUserInfo: function () {
    //     app.infoJump()
    // },
    // 一键拨号
    telephone: function (e) {
        var telephone = e.currentTarget.dataset.telephone;
        wx.makePhoneCall({
            phoneNumber: telephone,
        })
    },
    //上拉加载
    loadMore:function(){
        var that=this;
        var user_id=this.data.user_id;
        var find = this.data.find;
        var request={
            url: url + '/api/user/getMyFollowList',
            data:{
                user_id: user_id,
                page: this.data.currentPage,
                filter: {
                    search: find,
                    industry: [],
                    stage: []
                }
            }
        }
        //调用通用加载函数
        app.loadMore(that, request, "contacts", that.data.contacts)
    },
    //下拉刷新
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
    }
})