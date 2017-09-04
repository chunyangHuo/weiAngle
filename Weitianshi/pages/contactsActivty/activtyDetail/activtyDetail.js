var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        status: false,
    },
    onLoad: function (options) {},

    onShow: function () {
        var user_id = wx.getStorageSync('user_id');
        let that = this;
        wx.request({
            url: url_common + '/api/team/cardsStatistics',
            data: {
                user_id: user_id,
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                let status = res.data.data.button_type;
                let activtyData=res.data.data
                that.setData({
                    status: status,
                    activtyData:activtyData
                })
            }
        })
    },

    onShareAppMessage: function () {

    },
    //报名
    enroll: function (e) {
        let xxx = e.currentTarget.dataset.url;
        let user_id = wx.getStorageSync('user_id');
        wx.request({
            url: url_common + '/api/user/checkUserInfo',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                if (res.data.status_code == 2000000) {
                    var complete = res.data.is_complete;
                    if (complete == 1) {
                        wx.navigateTo({
                            url: xxx
                        })
                    } else if (complete == 0) {
                        wx.removeStorageSync('followed_user_id')
                        wx.navigateTo({
                            url: '/pages/register/companyInfo/companyInfo?type=1'
                        })
                    }
                } else {
                    wx.removeStorageSync('followed_user_id')
                    wx.navigateTo({
                        url: '/pages/register/personInfo/personInfo?type=2'
                    })
                }
            }
        })
    },
})