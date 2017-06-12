var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        integrity: 30,
        resourcesIndex: 9.9,
        user: "",
        tel: 0,
        telephone: 0,
        blue: -1,
        a: 1
    },
    onLoad: function (options) {
        var that = this
        console.log(options);
        var user_id = options.id;
        var view_id = wx.getStorageSync('user_id');
        that.setData({
            user_id: user_id,
        })
        //分享至群打点准备
        wx.showShareMenu({
            withShareTicket: true,
        })

        //用戶的个人信息
        wx.request({
            url: url + '/api/user/getUserAllInfo',
            data: {
                share_id: 0,
                user_id: user_id,
                view_id: view_id,
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var user = res.data.user_info;
                var invest = res.data.invest_info;
                var resource = res.data.resource_info;
                var project_info = res.data.project_info;
                var invest_case = res.data.invest_case;
                var tel = user.user_mobile;
                var button_type = res.data.button_type;
                if (button_type == 0) {
                    console.log("是好友或单项人脉")
                } else if (button_type == 1) {
                    console.log("分享出去的页面,直接添加")
                } else if (button_type == 2) {
                    console.log("正常申请添加人脉")
                } else if (button_type == 3) {
                    console.log("待处理状态")
                }
                if (tel.indexOf("*") != -1) {
                    that.setData({
                        blue: 1
                    })
                }
                // console.log(that.data.blue)
                that.setData({
                    user: user,
                    invest: invest,
                    resource: resource,
                    project_info: project_info,
                    invest_case: invest_case,
                    button_type: button_type
                })
            },
            fail: function (res) {
                console.log(res)
            },
        })
    },
    //进入个人详情
    userInfo: function () {
        wx.navigateTo({
            url: "/pages/userDetail/networkDetail/networkDetail"
        })
    },
    // 好友直接拨打电话
    telephone: function (e) {
        var telephone = e.currentTarget.dataset.telephone;
        var tel = telephone.indexOf("****") * 1;

        if (tel == -1) {
            wx.makePhoneCall({
                phoneNumber: telephone,
            })
        } else {
        }
        if (tel == -1) {
            wx.makePhoneCall({
                phoneNumber: telephone,
            })
        } else {

        }

    },
    //添加人脉
    addNetWork: function () {
        var that = this;
        var user_id = wx.getStorageSync('user_id');//获取我的user_id
        var followed_user_id = this.data.user_id;//当前用户的
        console.log(user_id, followed_user_id);
        if (user_id == false) {
            wx.showModal({
                title: "提示",
                content: "请先绑定个人信息",
                success: function (res) {
                    wx.setStorageSync('followed_user_id', followed_user_id)
                    if (res.confirm == true) {
                        wx.navigateTo({
                            url: '/pages/register/personInfo/personInfo'
                        })
                    }
                }
            })
        } else if (user_id != false) {
            wx.request({
                url: url + '/api/user/followUser',
                data: {
                    follow_user_id: user_id,
                    followed_user_id: followed_user_id
                },
                method: 'POST',
                success: function (res) {
                    console.log(res)
                    if (res.data.status_code == 2000000) {
                        wx.showModal({
                            title: "提示",
                            content: "添加人脉成功",
                            showCancel: false,
                            confirmText: "到人脉库",
                            success: function (res) {
                                wx.switchTab({
                                    url: '/pages/contacts/contacts/contacts',
                                })
                            }
                        })
                    } else {
                        wx.showModal({
                            title: "提示",
                            content: "您已经添加过此人脉",
                            showCancel: false,
                            confirmText: "到人脉库",
                            success: function () {
                                wx.switchTab({
                                    url: '/pages/contacts/contacts/contacts',
                                })
                            }
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
        } else {
            showModal({
                title: "错误提示",
                content: "bindUser部分出问题了"
            })
        }
    },
    //添加人脉
    addPerson: function (options) {
        var that = this;
        var followed_user_id = this.data.user_id;//当前用户的
        let view_id = wx.getStorageSync('user_id');//获取我自己的user_id/查看者的id
        let button_type = this.data.button_type;
        console.log(button_type)
        if (button_type == 1) {
            wx.request({
                url: url + '/api/user/followUser',
                data: {
                    follow_user_id: user_id,
                    followed_user_id: followed_user_id
                },
                method: 'POST',
                success: function (res) {
                    that.setData({
                        a: 2
                    })
                }
            })
        } else if (button_type == 2) {
            wx.request({
                url: url + '/api/user/UserApplyFollowUser',
                data: {
                    user_id: followed_user_id,
                    applied_user_id: view_id
                },
                method: 'POST',
                success: function (res) {
                    that.setData({
                        a: 2
                    })
                    console.log(res)
                }
            })
        }
    },
    //分享页面
    onShareAppMessage: function () {
        var user_id = this.data.user_id;
        var share_id = wx.getStorageSync("user_id");
        return app.sharePage(user_id, share_id)
    }
});