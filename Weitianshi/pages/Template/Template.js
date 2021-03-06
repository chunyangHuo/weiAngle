var _this
var app = getApp();
var url=app.globalData.url;

//错误提示消失
function errorHide(target, errorText, time) {
    var that = target;
    that.setData({
        error: "1",
        error_text: errorText
    })
    var errorTime = setTimeout(function () {
        that.setData({
            error: "0"
        });
    }, time)
}
//上滑加载
function loadMore(projectCheck, url, that, api, page, parameter, user_id, page_end) {
    if (projectCheck) {
        if (user_id != '') {
            if (page_end == false) {
                wx.showToast({
                    title: 'loading...',
                    icon: 'loading'
                })
                page++;
                that.setData({
                    page: page
                });
                wx.request({
                    url: url + api,
                    data: {
                        res_id: parameter,
                        page: page,
                    },
                    method: 'POST',
                    success: function (res) {
                        console.log("资源需求匹配的分页加载接口")
                        console.log(res)
                        that.callback(res, that)
                    }
                })
                return
            } else {
                rqj.errorHide(that, "没有更多了", 3000)
            }
        }
    }

}
//循环出用户投资信息
function userNeed(that) {
    var userNeed = {};
    var user_industry = [];
    var user_industryId = [];
    var user_area = [];
    var user_areaId = [];
    var user_stage = [];
    var user_stageId = [];
    var user_scale = [];
    var user_scaleId = [];
    var user_id = wx.getStorageSync('user_id')
    if (user_id != 0) {
        wx.request({
            url: url+'/api/investors/checkInvestorInfo',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                var investor = res.data.data;
                var industry = investor.industry_tag;
                for (var i = 0; i < industry.length; i++) {
                    user_industry.push(industry[i].industry_name);
                    user_industryId.push(industry[i].industry_id)
                }
                var area = investor.area_tag;
                for (var i = 0; i < area.length; i++) {
                    user_area.push(area[i].area_title);
                    user_areaId.push(area[i].area_id)
                }
                var scale = investor.scale_tag;
                for (var i = 0; i < scale.length; i++) {
                    user_scale.push(scale[i].scale_money)
                    user_scaleId.push(scale[i].scale_id)
                }
                var stage = investor.stage_tag;
                for (var i = 0; i < stage.length; i++) {
                    user_stage.push(stage[i].stage_name)
                    user_stageId.push(stage[i].stage_id)
                }
            }
        })
    }
    userNeed.user_industry = user_industry;
    userNeed.user_industryId = user_industryId;
    userNeed.user_area = user_area;
    userNeed.user_areaId = user_areaId;
    userNeed.user_stage = user_stage;
    userNeed.user_stageId = user_stageId;
    userNeed.user_scale = user_scale;
    userNeed.user_scaleId = user_scaleId;
    return userNeed;
}
//添加人脉
function addNetWork(that, follow_user_id, followed_user_id) {
    wx.request({
        url: url + '/api/user/followUser',
        data: {
            follow_user_id: follow_user_id,
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
}
//获取user_id
// function loginPage(that, user_id) {
//     if (user_id != 0) {
//         that.loadData(that, user_id)
//     } else {
//         //获取user_id
//         app.getUserInfo(function (userInfo) {
//             console.log("已经有了userInfo");
//             wx.setStorageSync("userInfo", userInfo)
//             wx.setStorageSync('avatarUrl', userInfo.avatarUrl)
//         });
//     }
// }
//函数输出
module.exports = { errorHide, userNeed, loadMore}

