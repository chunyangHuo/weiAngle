var app=getApp();
var url=app.globalData.url;
Page({
    data: {
        integrity:30,
        resourcesIndex:9.9,
        user:"",
    },
    onLoad: function (options) {
        var that = this
        console.log(options);
        var user_id = options.id;
        var view_id=wx.getStorageSync('user_id');
        that.setData({
            user_id: user_id,
        })
        //分享至群打点准备
        wx.showShareMenu({
            withShareTicket: true,
        })
        //我的个人信息
        wx.request({
          url: url+'/api/user/getUserAllInfo',
          data: {
              share_id:0,
              user_id:user_id,
              view_id:view_id, 
          },
          method: 'POST',
          success: function(res){
            console.log(res)
            var user=res.data.user_info;
            var invest=res.data.invest_info;
            var resource=res.data.resource_info;
            var project_info=res.data.project_info;
            var invest_case=res.data.invest_case;
            console.log(invest_case)
            that.setData({
                user:user,
                invest:invest,
                resource:resource,
                project_info:project_info,
                invest_case:invest_case
            })
          },
          fail: function(res) {
            console.log(res)
          },
        })
    },
    //进入个人详情
    userInfo:function(){
        wx.navigateTo({
            url:"../userDetail/userDetail"
        })
    },
    //进入个人详情中转编辑页面
    resourcesIndex:function(){
        console.log(1)
        wx.navigateTo({
          url: 'myInfoEdit/myInfoEdit',
        })
    },
    //添加人脉
    addNetWork: function () {
        var that = this;
        var user_id = wx.getStorageSync('user_id');//获取我的user_id

        var followed_user_id = this.data.user_id;//当前用户的
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
    },
    //分享页面
    onShareAppMessage:function(){
        var id = this.data.user_id;
        return app.sharePage(id)
    }
});