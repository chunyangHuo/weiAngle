var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        status: false,
    },
    onLoad: function (options) { },

    onShow: function () {
        let that = this;
        app.loginPage(function(user_id){
            wx.request({
                url: url_common + '/api/team/cardsStatistics',
                data: {
                    user_id: user_id,
                },
                method: 'POST',
                success: function (res) {
                    console.log(res)
                    let status = res.data.data.button_type;
                    let activtyData = res.data.data
                    that.setData({
                        status: status,
                        activtyData: activtyData
                    })
                }
            })
        })    
    },

    onShareAppMessage: function () {
        return {
            title: '100万大礼包助攻2017首届中国双创机构人气品牌百强评选，等你来战!',
            path: '/pages/contactsActivty/activtyDetail/activtyDetail',
            imageUrl:"https://weitianshi-2017.oss-cn-shanghai.aliyuncs.com/image/20170904/card_share_4.jpg",
            success: function (res) {
               console.log('分享成功',res)
            },
        }
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
                console.log(res)
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