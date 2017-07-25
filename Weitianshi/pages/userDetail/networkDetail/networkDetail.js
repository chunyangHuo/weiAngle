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
        condition: 0,
        IdentificationShow: 0,
        playTime:1
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
        /*wx.showShareMenu({
            withShareTicket: true,
        })*/

        //用戶的个人信息
        wx.request({
            url: url_common + '/api/user/getUserAllInfo',
            data: {
                share_id: 0,
                user_id: user_id,
                view_id: view_id,
            },
            method: 'POST',
            success: function (res) {
                app.console(res)
                var user = res.data.user_info;
                var count = res.data.count;
                var invest = res.data.invest_info;
                var resource = res.data.resource_info;
                var project_info = res.data.project_info;
                var invest_case = res.data.invest_case;
                var tel = user.user_mobile;
                var button_type = res.data.button_type;
                app.console(user.active_status)
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
                    button_type: button_type,
                    count: count
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
    addPerson: function (options) {
        var that = this;
        var followed_user_id = this.data.user_id;//当前用户的
        let view_id = wx.getStorageSync('user_id');//获取我自己的user_id/查看者的id
        let button_type = this.data.button_type;
        console.log(button_type)
        // button_type==0  0申请加人脉按钮，1不显示任何按钮  2待验证   3同意加为人脉  4加为单方人脉
        //判断用户信息是否完整
        wx.request({
            url: url_common + '/api/user/checkUserInfo',
            data: {
                user_id: view_id
            },
            method: 'POST',
            success: function (res) {
                if (res.data.status_code == 2000000) {
                    var complete = res.data.is_complete;
                    if (complete == 1) {
                        //信息完整
                        if (button_type == 0) {
                            wx.request({
                                url: url + '/api/user/UserApplyFollowUser',
                                data: {
                                    user_id: view_id,
                                    applied_user_id: followed_user_id
                                },
                                method: 'POST',
                                success: function (res) {
                                    console.log(res)
                                    console.log("正常申请添加人脉")
                                    that.setData({
                                        button_type: 2
                                    })
                                }
                            })

                        } else if (button_type == 1) {
                            console.log("我的人脉--不显示内容")
                        } else if (button_type == 2) {
                            console.log("待验证===显示待验证")
                        } else if (button_type == 3) {
                            wx.request({
                                url: url + '/api/user/handleApplyFollowUser',
                                data: {
                                    // 当前登录者的
                                    user_id: view_id,
                                    // 当前申请的用户
                                    apply_user_id: followed_user_id
                                },
                                method: 'POST',
                                success: function (res) {
                                    console.log(res)
                                    console.log("同意申請")
                                    that.setData({
                                        button_type: 1
                                    })
                                }
                            })
                        } else if (button_type == 4) {
                            // 单方人脉添加
                            wx.request({
                                url: url + '/api/user/followUser',
                                data: {
                                    user_id: user_id,
                                    followed_user_id: followed_user_id
                                },
                                method: 'POST',
                                success: function (res) {
                                    console.log("这里是单方人脉添加")
                                    console.log(res)
                                    that.setData({
                                        button_type: 1
                                    })
                                }
                            })
                        }
                    } else if (complete == 0) {
                        //有user_id但信息不全
                        wx.showModal({
                            title: "提示",
                            content: "请先绑定个人信息",
                            success: function (res) {
                                wx.setStorageSync('followed_user_id', followed_user_id)
                                if (res.confirm == true) {
                                    wx.navigateTo({
                                        url: '/pages/register/companyInfo/companyInfo'
                                    })
                                }
                            }
                        })
                    }
                } else {
                    //没有user_id
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
                }
            }
        })
    },
    // 二维码分享页面
    shareSth: function (e) {
        var QR_id = e.currentTarget.dataset.clickid;
        wx.setStorageSync('QR_id', QR_id)
        wx.navigateTo({
            url: '/pages/my/qrCode/qrCode',
        })
    },
    //分享页面
    onShareAppMessage: function () {
        var user_id = this.data.user_id;
        var share_id = wx.getStorageSync("user_id");
        return app.sharePage(user_id, share_id)
    },
    //项目融资
    projectFinance: function () {
        var followed_user_id = this.data.user_id;
        wx.navigateTo({
            url: '/pages/my/projectFinance/projectFinance?currentTab=1' + '&&followed_user_id=' + followed_user_id,
        })
    },
    //融资项目详情
    financingDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/projectDetail/projectDetail?id=' + id,
        })
    },
});