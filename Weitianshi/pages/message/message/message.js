var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        count: 0,
        messageList: [
            {
                event: "toIdentity",
                iconPath: "/img/icon-xiaoxi_renzheng@2x.png",
                message_name: "身份认证",
                count: 0,
                type_id: 0
            },
            {
                event: "projectApply",
                iconPath: "/img/icon-xiaoxi_xiangmu@2x.png",
                message_name: "项目申请",
                count: 0,
                type_id: 0
            },
            {
                event: "projectPush",
                iconPath: "/img/icon-xiaoxi_tuisong@2x.png",
                message_name: "项目推送",
                count: 0,
                type_id: 0
            },
            {
                event: "beAddedContacts",
                iconPath: "/img/icon-xiaoxi_renmai@2x.png",
                message_name: "人脉申请",
                count: 0,
                type_id: 0
            }
        ]
    },
    onShow: function () {
        //消除人脉缓存
        app.contactsCacheClear();
        var that = this;
        var user_id = wx.getStorageSync('user_id');
        var messageList = this.data.messageList;
        let count = this.data.count;
        let type_id = this.data.type_id;
        console.log(messageList)
        wx.request({
            url: url_common + '/api/message/messageType',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var list = res.data.data;
                console.log(list)
                list.forEach((x, index) => {
                    messageList[index].message_name = x.message_name;
                    messageList[index].count = x.count;
                    messageList[index].type_id = x.type_id;
                    if (x.count) {
                        messageList[index].count = x.count
                    } else {
                        messageList[index].count = 0
                    }
                })
                that.setData({
                    messageList: messageList,
                    count: count,
                    type_id: type_id
                })
                console.log(that.data.messageList)
            }
        })
        wx.request({
            url: url_common + '/api/user/getUserGroupByStatus',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                // 0:未认证1:待审核 2 审核通过 3审核未通过
                let status = res.data.status;
                if (status != 0) {
                    let group_id = res.data.group.group_id;
                    that.setData({
                        group_id: group_id
                    })
                }
                that.setData({
                    status: status
                })
            }
        })
    },

    // 跳转到人脉申请页面
    beAddedContacts: function () {
        wx.navigateTo({
            url: '/pages/message/beAddedContacts/beAddedContacts',
        })
    },

    // 身份认证跳转
    toIdentity: function (e) {
        console.log("跳转身份认证")
        let status = this.data.status;
        var user_id = wx.getStorageSync('user_id');
        // 0未认证 1待审核 2 认证成功 3 拒绝
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
                        //如果信息完整就可以显示去认证
                        if (status == 0) {
                            wx.navigateTo({
                                url: '/pages/my/identity/indentity/indentity',
                            })
                        } else if (status == 1) {
                            wx.navigateTo({
                                url: '/pages/my/identity/identityResult/identityResult?type=' + 1,
                            })
                        } else if (status == 2) {
                            wx.navigateTo({
                                url: '/pages/my/identity/identityResult/identityResult?type=' + 2,
                            })
                        } else if (status == 3) {
                            wx.navigateTo({
                                url: '/pages/my/identity/identityResult/identityResult?type=' + 3,
                            })
                        }
                    } else if (complete == 0) {
                        wx.navigateTo({
                            url: '/pages/register/companyInfo/companyInfo?type=1'
                        })
                    }
                } else {
                    wx.navigateTo({
                        url: '/pages/register/personInfo/personInfo?type=2'
                    })
                }
            },
        });
    },
    // 项目申请跳转
    projectApply: function (e) {
        let type = e.currentTarget.dataset.type;
        let group_id = this.data.group_id;
        console.log(group_id)
        if (group_id) {
            wx.navigateTo({
                url: '/pages/message/applyProject/applyProject?type=' + type + '&&group_id=' + group_id,
            })
        } else {
            wx.navigateTo({
                url: '/pages/message/applyProject/applyProject?type=' + type,
            })
        }
    },
    // 项目推送
    projectPush: function (e) {
        let type = e.currentTarget.dataset.type;
        let group_id = this.data.group_id;
        if (group_id) {
            wx.navigateTo({
                url: '/pages/message/pushProject/pushProject?type=' + type + '&&group_id=' + group_id,
            })
        } else {
            wx.navigateTo({
                url: '/pages/message/pushProject/pushProject?type=' + type,
            })
        }
    },
    //测试一键尽调
    testOneKey() {
        wx.navigateTo({
            // url: '/pages/oneKeyResearch/oneKeyResearch?id=oWdemnpQ',
          url: '/pages/oneKeyResearch/oneKeyResearch?id=RrZDkXWQ',      
        })
    }
})