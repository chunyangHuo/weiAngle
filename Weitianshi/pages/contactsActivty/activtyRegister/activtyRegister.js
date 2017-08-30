var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        user_info:{
            user_avatar_url:'',
            user_mobile:'',
            user_real_name:'',
            user_company_name:'',
            user_brand:'',
            user_company_career:'',
        },
    },
    onLoad: function (options) {
        var that = this;
        var user_id = wx.getStorageSync('user_id');

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
                console.log(res.data.user_info)
                that.setData({
                    user_id:user_id,
                    user_info: res.data.user_info,
                })
            },
        })
    },
    onShow: function () {

    },
    //头像
    headPic() {

    },
    //手机号码
    telephone() {

    },
    //姓名
    name() {

    },
    //公司
    company() {

    },
    //品牌
    brand() {

    },
    //职位
    career() {

    },
    //提交
    save() {

    },
})