var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        dataUrl: ""
    },
    onShow: function () {
        var that = this;
        var QR_id = wx.getStorageSync('QR_id');//点击二维码页面的用户id
        //登录态维护
        app.loginPage(function (user_id) {
            console.log("这里是cb函数")
            var view_id = QR_id;
            console.log(view_id);
            wx.setStorageSync('user_id', user_id);
            that.setData({
                user_id: user_id
            })
            //分享至群打点准备
            /*wx.showShareMenu({
                withShareTicket: true,
            })*/
            console.log(user_id)
            //载入我的个人信息
            wx.request({
                url: url_common + '/api/user/getUserAllInfo',
                data: {
                    share_id: 0,
                    user_id: QR_id,
                    view_id: user_id,
                },
                method: 'POST',
                success: function (res) {
                    console.log("我的getUserAllInfo信息")
                    console.log(res);
                    var user = res.data.user_info;
                    that.setData({
                        user: user,
                    })
                },
            })
            // 获取二维码接口
            wx.request({
                url: url + '/api/wx/getCardQr',
                data: {
                    'user_id': QR_id,
                    'path': '/pages/my/sharePage/sharePage?user_id=' + QR_id + "&&share_id=" + user_id,
                    'width': 430,
                    'auto_color': false,
                    'line_color': { "r": "0", "g": "0", "b": "0" }
                },
                method: 'POST',
                success: function (res) {
                    console.log(res)
                    var net = res.data;
                    var access_token = net.qrcode;
                    that.setData({
                        access_token: access_token
                    })
                    var filPath = wx.setStorageSync('access_token', access_token);
                },
                fail: function (res) {
                    console.log(res)
                }
            })
        })
    },

    //保存小程序码
    savePic: function () {
        var filePath = wx.getStorageSync('access_token');
        wx.getImageInfo({
            src: filePath,
            success: function (res) {
                var picPath = res.path;
                wx.getSetting({
                    success(res) {
                        if (!res['scope.writePhotosAlbum']) {
                            wx.authorize({
                                scope: 'scope.writePhotosAlbum',
                                success() {
                                    wx.saveImageToPhotosAlbum({
                                        filePath: picPath,
                                        success: function (res) {
                                            console.log(res)
                                            wx.showToast({
                                              title: '保存图片成功',
                                              icon: 'success'
                                            })
                                        },
                                        fail: function (res) {
                                            console.log(filePath)
                                            console.log(res)
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            },
        })
    },

    //分享页面
    onShareAppMessage: function () {
        var user_id = wx.getStorageSync('QR_id');
        var share_id = wx.getStorageSync('user_id') || 0;
        return app.sharePage(user_id, share_id)
    },

    //取消分享
    cancelShare: function () {
        this.setData({
            modal: 0
        })
    },

})