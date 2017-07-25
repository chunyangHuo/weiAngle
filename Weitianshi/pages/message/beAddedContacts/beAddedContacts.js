var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        type_id: 2,
        count: 0
    },
    onShow: function () {
        var that = this;
        app.initPage(that);
        var user_id = this.data.user_id;
        //获取加我为人脉的用户信息
        if (user_id) {
            wx.request({
                url: url_common + '/api/message/cardMessage',
                data: {
                    user_id: user_id,
                    type_id: 2
                },
                method: 'POST',
                success: function (res) {
                    console.log("获取加我为人脉的信息")
                    console.log(res)
                    that.setData({
                        contacts: res.data.data,
                        count: res.data.count
                    })
                }
            })
        }
        //向后台发送信息取消红点
        wx.request({
            url: url_common + '/api/message/setMessageToRead',
            data: {
                user_id: user_id,
                type_id: 2
            },
            method: "POST",
        })

    },
    //添加人脉
    addPerson: function (e) {
        console.log("添加人脉")
        var that = this;
        var user_id = wx.getStorageSync('user_id');
        var apply_user_id = e.currentTarget.dataset.followedid;
        var follow_status = e.currentTarget.dataset.follow_status;
        var contacts = this.data.contacts;
        console.log(user_id, apply_user_id)
        console.log("follow_status")
        console.log(follow_status)
        wx.request({
            url: url + '/api/user/handleApplyFollowUser',
            data: {
                user_id: user_id,
                apply_user_id: apply_user_id
            },
            method: 'POST',
            success: function (res) {
                console.log(res);
                //将状态改为"已互为人脉"
                contacts.forEach((x) => {
                    if (x.user_id == apply_user_id) {
                        x.follow_status = 1
                    }
                })
                that.setData({
                    contacts: contacts
                })
            }
        })

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
}) 