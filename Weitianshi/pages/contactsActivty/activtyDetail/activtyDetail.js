var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        status: false
    },
    onLoad: function (options) {

    },

    onShow: function () {
        var user_id = wx.getStorageSync('user_id');
        let that = this;
        wx.request({
            url: url_common + '/api/team/isJoin',
            data: {
                user_id: user_id,
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                let status = res.data.is_join;
                that.setData({
                    status: status
                })
            }
        })
    },

    onShareAppMessage: function () {

    },
    //人脈排行
    Connections: function () {
        wx.navigateTo({
            url: '/pages/contactsActivty/topPlayer/topPlayer'
        })
    },
    //报名
    enroll: function () {
        wx.navigateTo({
            url: '/pages/contactsActivty/joinWarband/joinWarband'
        })
    },
})