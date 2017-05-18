var app = getApp();
var url = app.globalData.url;
Page({
    data: {
        firstName: "代",
        id: "",
        page: 0,
        aa: [],
        bpName: "",
        projectName: "",
        companyName: "",
        stock: 0,
        load: 0
    },
    onLoad: function (options) {
        var that = this;
        var id = options.id;
        var index = options.index;
        var user_id = wx.getStorageSync('user_id');//获取我的user_id
        var page = this.data.page;
        var avatarUrl = wx.getStorageSync('avatarUrl');
        that.setData({
            index: index,
            id: id,
            user_id: user_id,
            avatarUrl: avatarUrl,
        });

        //项目详情(不包括投资人)
        wx.request({
            url: url + '/api/project/showProjectDetail',
            data: {
                user_id: user_id,
                pro_id: this.data.id
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var project = res.data.data;
                var user = res.data.user;
                var firstName = user.user_name.substr(0, 1) || '';
                var pro_industry = project.pro_industry;
                console.log(project)
                var followed_user_id=res.data.user.user_id
                that.setData({
                    project: project,
                    user: user,
                    firstName: firstName,
                    pro_industry: pro_industry,
                    followed_user_id:followed_user_id
                });

                var is_mine = res.data.data.is_mine;
                //console.log(is_mine)
                if (is_mine == true) {
                    //请求投资人详情
                    wx.request({
                        url: url + '/api/project/getProjectMatchInvestors',
                        data: {
                            user_id: user_id,
                            pro_id: that.data.id,
                            page: page
                        },
                        method: 'POST',
                        success: function (res) {
                            console.log(res)
                            var investor2 = res.data.data;
                            console.log(investor2)
                            that.setData({
                                investor2: investor2
                            });
                            setTimeout(function () {
                                that.setData({
                                    load: 0
                                })
                            }, 1500)
                        },
                        fail: function () {
                            // fail
                        },
                    })
                }
            },
        })
    },
    // 用户详情=========================================================================================
    userDetail: function (e) {
        console.log(e);
        var id = e.currentTarget.dataset.id
        console.log(id)
        wx.navigateTo({
            url: '/pages/userDetail/userDetail?id=' + id,
        })
    },
    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新")
        wx.stopPullDownRefresh()
    },

    //分享当前页面
    onShareAppMessage: function () {
        var pro_intro = this.data.project.pro_intro;
        console.log(pro_intro)
        return {
            title:  pro_intro,
            path: '/pages/yourDetail/yourDetail?pro_id=' + this.data.id
        }
    },
    //添加人脉
    addNetWork: function () {
        var user_id = this.data.user_id;
        var followed_user_id = this.data.followed_user_id;
        console.log(user_id, followed_user_id);
        if (user_id==false) {
            wx.showModal({
                title: "提示",
                content: "请先绑定个人信息",
                success: function (res) {
                    wx.setStorageSync('followed_user_id', followed_user_id)
                    if (res.confirm == true) {
                        wx.navigateTo({
                            url: '/pages/myProject/personInfo/personInfo'
                        })
                    }
                }
            })
        } else if (user_id!=false) {
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
                                    url: '/pages/network/network',
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
                                    url: '/pages/network/network',
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
    }
});