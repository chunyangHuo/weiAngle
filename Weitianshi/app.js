//app.js
App({
    // onLaunch 用于监听小程序初始化,当完成时会触发onLaunch(全局只会触发一次)
    onLaunch: function (options) {
        var options = options;
        let url = this.globalData.url;
        let url_common = this.globalData.url_common;
        var that = this;
        //如果是在是点击群里名片打开的小程序,则向后台发送一些信息
        if (options.shareTicket) {
            //获取code
            wx.login({
                success: function (login) {
                    let code = login.code;
                    if (code) {
                        let path = options.path;
                        let shareTicket = options.shareTicket;
                        //获取群ID
                        wx.getShareInfo({
                            shareTicket: shareTicket,
                            success(res) {
                                let encryptedData = res.encryptedData;
                                let iv = res.iv;
                                console.log(code, path, encryptedData, iv, url)
                                //向后台发送信息
                                wx.request({
                                    url: url_common + '/api/log/clickLogRecord',
                                    data: {
                                        code: code,
                                        path: path,
                                        encryptedData: encryptedData,
                                        iv: iv
                                    },
                                    method: "POST",
                                    success(res) {
                                        console.log(res)
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }

        //获取各分类的信息并存入缓存
        wx.request({
          url: url_common + '/api/category/getProjectCategory',
            method: 'POST',
            success: function (res) {
                var thisData = res.data.data;
                thisData.area.forEach((x) => { x.check = false })
                thisData.industry.forEach((x) => { x.check = false })
                thisData.scale.forEach((x) => { x.check = false })
                thisData.stage.forEach((x) => { x.check = false })
                wx.setStorageSync("industry", thisData.industry)
                wx.setStorageSync("scale", thisData.scale)
                wx.setStorageSync("stage", thisData.stage)
            },
        })

        //获取热门城市并存入缓存
        wx.request({
            url: url_common + '/api/category/getHotCity',
            data: {},
            method: 'POST',
            success: function (res) {
                var hotCity = res.data.data;
                hotCity.forEach((x) => {
                    x.checked = false;
                })
                wx.setStorageSync('hotCity', hotCity)
            }
        });
    },

    onError: function (msg) {
        console.log(msg)
    },

    //进入页面判断是否有open_session
    loginPage: function (cb) {
        var that = this;
        //群分享打点准备
        /* wx.showShareMenu({
             withShareTicket: true
         })*/
        if (this.globalData.open_session) {
            console.log("open_session已经存在")
            var timeNow = Date.now();
            var session_time = this.globalData.session_time;
            var differenceTime = timeNow - session_time;
            // console.log(differenceTime/3600000+"小时")
            if (differenceTime > 432000000) {//432000000代表2个小时
                console.log("已超时")
                this.getSession(cb)
            } else {
                console.log("未超时")
                typeof cb == "function" && cb(this.globalData.user_id)
            }
        } else {
            console.log("open_session不存在")
            this.getSession(cb)//赋值 在这里
        }
    },

    //获取open_session  
    getSession(cb) {
        var that = this;
        //获取code
        wx.login({
            success: function (login) {
                var code = login.code;
                that.globalData.code = code;
                //获取encryptedData和iv
                wx.getUserInfo({
                    //用户授权
                    success: function (res) {
                        console.log("调用wx.getUserInfo成功")
                        // console.log(res)
                        that.globalData.userInfo = res.userInfo;//这里,赋完值函数就结束了
                        that.globalData.encryptedData = res.encryptedData;
                        that.globalData.iv = res.iv;
                        wx.request({
                            url: that.globalData.url + '/api/wx/returnOauth',
                            data: {
                                code: code,
                                encryptedData: res.encryptedData,
                                iv: res.iv
                            },
                            method: 'POST',
                            success: function (res) {
                                console.log("这里是获取到encryptedData,iv后调用returnOauth,获取并设置了open_session,session_time,user_id")
                                // console.log(res);
                                //在globalData里存入open_session,session_time,user_id;
                                that.globalData.open_session = res.data.open_session;
                                that.globalData.session_time = Date.now();
                                that.globalData.user_id = res.data.user_id;
                                console.log(Date(that.globalData.session_time))
                                // console.log(that.globalData.user_id)
                                wx.setStorageSync("user_id", res.data.user_id)
                                typeof cb == "function" && cb(wx.getStorageSync("user_id"))
                            },
                            fail: function () {
                                console.log("调用returnOauth失败")
                            }
                        })
                    },
                    //用户不授权
                    fail: function (res) {
                        wx.request({
                            url: that.globalData.url + '/api/wx/returnOauth',
                            data: {
                                code: code,
                            },
                            method: 'POST',
                            success: function (res) {
                                console.log("这里是没获取到encryptedData,iv后调用returnOauth,获取并设置了open_session,session_time,user_id")
                                // console.log(res);
                                //在globalData里存入open_session,session_time,user_id;
                                that.globalData.open_session = res.data.open_session;
                                that.globalData.session_time = Date.now();
                                that.globalData.user_id = res.data.user_id;
                                console.log(Date(that.globalData.session_time))
                                wx.setStorageSync("user_id", res.data.user_id)
                                typeof cb == "function" && cb(wx.getStorageSync("user_id"))
                            },
                            fail: function () {
                                console.log("调用returnOauth失败")
                            },
                        })
                    },
                })
            }
        })
    },

    //进行授权验证
    getUserInfo: function (cb) {
        var that = this;
        //如果全局变量里有userInfo就去执行cb函数,如果全局变量里没有userInfo就去调用授权接口
        if (this.globalData.userInfo) {
            console.log("全局变量userInfo存在")
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            console.log("全局变量userInfo不存在")
            //调用登录接口
            wx.login({
                success: function (login) {
                    var code = login.code;
                    that.globalData.code = code;
                    //获取用户信息
                    wx.getUserInfo({
                        success: function (res) {
                            console.log("这里是wx.getUserInfo")
                            console.log(res)
                            that.globalData.userInfo = res.userInfo;
                            that.globalData.encryptedData = res.encryptedData;
                            that.globalData.iv = res.iv;
                            typeof cb == "function" && cb(that.globalData.userInfo);
                        },
                        fail: function (res) {
                            console.log(res)
                        },
                        complete: function () {
                            //如果已经存在session_time就进行比较,如果不没有就建一个session_time;
                            if (that.globalData.session_time) {
                                var timeNow = new (Date.now())
                                console.log(that.globalData.session_time, timeNow)
                            } else {
                                that.checkLogin(that);
                            }
                        }
                    })
                }
            })
        }
    },

    //查看缓存
    cacheCheck: function () {
        var res = wx.getStorageInfoSync();
        console.log(res)
    },

    // user_id为空时,返回首页或者完善信息
    noUserId: function () {
        wx.showModal({
            title: "提示",
            content: "请先绑定个人信息",
            success: function (res) {
                console.log(res)
                if (res.confirm == true) {
                    wx.navigateTo({
                        url: '/pages/register/personInfo/personInfo',
                    })
                } else {
                    wx.switchTab({
                        url: '/pages/match/match/match/match',
                    })
                }
            }
        })
    },

    //分享页面函数(user_id为数据所有人ID,share_Id为分享人的ID)
    sharePage: function (user_id, share_id) {
        let path = "/pages/my/sharePage/sharePage?user_id=" + user_id + "&&share_id=" + share_id;
        let url = this.globalData.url;
        let url_common = this.globalData.url_common;
        let json = {
            title: '投资名片—智能精准匹配投融资双方的神器',
            path: path,
            //分享成功后的回调
            success: function (res) {
                console.log("分享成功")
                let shareTicket = res.shareTickets[0];
                //获取code
                wx.login({
                    success(res) {
                        let code = res.code;
                        if (code) {
                            //如果是分享到群里
                            if (shareTicket) {
                                wx.getShareInfo({
                                    shareTicket: shareTicket,
                                    success: function (res) {
                                        let encryptedData = res.encryptedData;
                                        let iv = res.iv;
                                        console.log(code, path)
                                        //发送请求到后台
                                        wx.request({
                                            url: url_common + '/api/log/shareLogRecord',
                                            method: "POST",
                                            data: {
                                                code: code,
                                                path: path,
                                                encryptedData: encryptedData,
                                                iv: iv
                                            },
                                            success(res) {
                                                console.log(res)
                                            }
                                        })
                                    },
                                })
                            } else {//如果不是分享到群里
                                console.log(code, path)
                                //发送请求到后台
                                wx.request({
                                    url: url_common + '/api/log/shareLogRecord',
                                    method: "POST",
                                    data: {
                                        code: code,
                                        path: path,
                                    },
                                    success(res) {
                                        console.log(res)
                                    }
                                })
                            }
                        }
                    }
                })
            },
        }
        return json
    },

    //根据用户信息完整度跳转不同的页面
    infoJump: function (targetUrl) {
        var user_id = this.globalData.user_id;
        // 核对用户信息是否完整
        wx.request({
            url: this.globalData.url_common + '/api/user/checkUserInfo',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                // console.log("检查用户信息是否完整,如果不完整则返回个人信息")
                // console.log(res);
                if (res.data.status_code == 2000000) {
                    var complete = res.data.is_complete;
                    if (complete == 1) {
                        wx.navigateTo({
                            url: targetUrl
                        })
                    } else if (complete == 0) {
                        wx.navigateTo({
                            url: '/pages/register/companyInfo/companyInfo'
                        })
                    }
                } else {//后台返回500状态码,可能原因为参数的user_id传了0过去
                    wx.navigateTo({
                        url: '/pages/register/personInfo/personInfo'
                    })
                }
            },
        });
    },

    //多选标签事件封装(tags需要要data里设置相关,str为标签数所字段)
    tagsCheck(that, rqj, e, tags, str) {
        console.log(tags)
        let target = e.currentTarget.dataset;
        let tagsData = tags.tagsData;
        let checkObject = [];

        tagsData[target.index].check = !tagsData[target.index].check;
        let checkedNum = 0
        tagsData.forEach((x) => {
            if (x.check == true) {
                checkedNum++
            }
        })
        if (checkedNum >= 6) {
            tagsData[target.index].check = !tagsData[target.index].check;
            rqj.errorHide(that, "最多可选择五项", 1000)
        } else {
            that.setData({
                [str]: tags
            })
        }
        tagsData.forEach((x) => {
            if (x.check == true) {
                checkObject.push(x)
            }
        })
        return checkObject
    },

    //下拉加载事件封装(request需要设置,包括url和请求request所需要的data,str为展示数据字段,dataSum为展示数据)
    //初始必须在onShow()里初始化requestCheck:true(防多次请求),currentPage:1(当前页数),page_end:false(是否为最后一页)
    loadMore(that, request, str, dataSum) {
        var user_id = wx.getStorageSync("user_id");
        var rqj = require('./pages/Template/Template.js');
        if (that.data.requestCheck) {
            if (user_id != '') {
                if (that.data.page_end == false) {
                    wx.showToast({
                        title: 'loading...',
                        icon: 'loading'
                    })
                    request.data.page++;
                    that.setData({
                        currentPage: request.data.page,
                        requestCheck: false
                    });
                    //请求加载数据
                    wx.request({
                        url: request.url,
                        data: request.data,
                        method: 'POST',
                        success: function (res) {
                            console.log(res)
                            var newPage = res.data.data;
                            console.log(newPage);
                            var page_end = res.data.page_end;
                            for (var i = 0; i < newPage.length; i++) {
                                dataSum.push(newPage[i])
                            }
                            that.setData({
                                [str]: dataSum,
                                page_end: page_end,
                                requestCheck: true
                            })
                        }
                    })
                } else {
                    rqj.errorHide(that, "没有更多了", 3000)
                    that.setData({
                        requestCheck: true
                    });
                }
            }
        }
    },

    //初始化页面(others为其他要初始化的数据,格式为键值对.如{key:value})
    initPage: function (that, others) {
        var user_id = wx.getStorageSync('user_id');
        that.setData({
            user_id: user_id,
            requestCheck: true,
            currentPage: 1,
            page_end: false
        })
        if (others) {
            that.setData(others)
        }
    },

    //添加人脉
    addContacts(that, addType, user_id, followed_id, callBack1, callBack2) {
        if (addType == 1) {
            wx.request({
                url: url + '/api/user/followUser',
                data: {
                    user_id: user_id,
                    followed_user_id: followed_id
                },
                method: 'POST',
                success: function (res) {
                    callBack1(res)
                }
            })
        } else if (addType == 2) {
            wx.request({
                url: url + '/api/user/UserApplyFollowUser',
                data: {
                    user_id: user_id,
                    applied_user_id: followed_id
                },
                method: 'POST',
                success: function (res) {
                    callBack2(res)
                }
            })
        } else {
            console.log("addType写错了")
        }
    },

    //消除人脉筛选的四个缓存(以实现人脉切到其他tab页再切回来数据初始化)
    contactsCacheClear() {
        wx.removeStorageSync('contactsIndustry');
        wx.removeStorageSync('contactsStage');
        wx.setStorageSync("industryFilter", '');
        wx.setStorageSync("stageFilter", '');
    },

    //重新封装console.log
    console(x) {
        if (this.globalData.url == 'https://wx.weitianshi.cn') {

        } else {
            console.log(x)
        }
    },

    // 时间戳转换
    changeTime: function (x) {
        var n = x * 1000;
        var date = new Date(n);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return (Y + M + D)
    },
    changeTimeStyle: function (x) {
        var n = x * 1000;
        var date = new Date(n);
        var Y = date.getFullYear() + '.';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return (Y + M + D)
    },

    // 邮箱检验
    checkEmail(data) {
        var myreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (myreg.test(data)) {
            return true
        } else {
            return false
        }
    },

    //初始本地缓存
    globalData: {
        error: 0,
        // url: "https://wx.weitianshi.cn",
        // url_common: "https://www.weitianshi.cn"
        url: "https://wx.dev.weitianshi.cn",
        url_common: "https://dev.weitianshi.cn"
    }
});