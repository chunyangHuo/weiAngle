var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        name: "",
        telphone: null,
        checkCode: "",
        result: "0",//手机号码验证是否正确
        error: "0",
        error_text: '',
        checking: "0",//获取验证码请求是否发送
        time: "0",//获取验证码按钮是否可点
        loading: "0",//加载动画控制
        getCode: "获取验证码",
        endTime: 60//多少秒后验证码得发
    },
    //下拉刷新
    onPullDownRefresh: function () {
        // console.log("开启了下拉刷新")
        wx.stopPullDownRefresh()
    },
    onShow: function () {
        var that=this;
        if (this.data._time) {
            that.setData({
                time: "1"
            })
        } else {
            // 清零短信倒计时
            that.setData({
                time: "0"
            })
        }
    },
    onHide: function () {
    },

    //过滤特殊字符
    stripscript: function (e) {
        var that = this;
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        var rs = "";
        var name = e.detail.value;
        console.log(name)
        for (var i = 0; i < name.length; i++) {
            rs = rs + name.substr(i, 1).replace(pattern, '');
        }
        that.setData({
            name: rs
        })
    },

    //手机号码验证
    checkPhone: function (e) {
        var temp = e.detail.value;
        console.log(temp)
        var myreg = /^(1+\d{10})|(159+\d{8})|(153+\d{8})$/;
        var that = this;
        if (!myreg.test(temp)) {
            // console.log('请输入有效的手机号码！');
            that.setData({
                result: "0"
            })
        } else {
            that.setData({
                result: "1",
                telphone: temp
            });
        }
    },

    //获取验证码按钮
    checkCode: function (e) {
        e.detail.disabled = true;
        var telphone = this.data.telphone;
        var checking = this.data.checking;
        var that = this;
        var endTime = this.data.endTime
        endTime = 60;
        that.setData({
            checking: "1",
            time: "1",
        });
        wx.request({
          url: url_common + '/api/auth/authCaptcha',
            data: {
                user_mobile: telphone
            },
            method: 'POST',
            success: function (res) {
                that.setData({
                    checking: "0"
                });
                // console.log(res)
                if (res.data.status_code == 5005005) {
                    that.setData({
                        error: "1",
                        error_text: "没有请求到验证码",
                        time: "0"
                    });
                    var errorTime = setTimeout(function () {
                        that.setData({
                            error: "0"
                        });
                        // console.log('提示已消失')
                    }, 1500)
                } else if (res.data.status_code == 420005) {
                    that.setData({
                        error: "1",
                        error_text: "手机号码不合法",
                        time: "0"
                    })
                    var errorTime = setTimeout(function () {
                        that.setData({
                            error: "0"
                        });
                        // console.log('提示已消失')
                    }, 1500)
                } else {
                    var _time = setInterval(function () {
                        if (endTime > 1) {
                            endTime--;
                            that.setData({
                                getCode: endTime + 's后重新获取'
                            })
                        }
                    }, 1000)
                    console.log(_time)
                    console.log(typeof _time)
                    that.setData({
                        _time: _time
                    })
                    setTimeout(function () {
                        that.setData({
                            time: "0",
                            getCode: "获取验证码"
                        });
                        clearInterval(_time)
                    }, 60000);
                }
            },
            fail: function () {
            },
            complete: function () {
                // complete
            }
        })
    },
    //获取验证码的值 
    checkCode2: function (e) {
        var that = this;
        that.setData({
            checkCode: e.detail.value
        });
        // console.log(e.detail.value)
    },

    //点击跳转
    nextPage: function () {
        var that = this;
        wx.login({
            success: function (res) {
                var name = that.data.name;
                var telphone = that.data.telphone;
                var result = that.data.result;
                var error = that.data.error;
                var error_text = that.data.error_text;
                var checkCode = that.data.checkCode;
                var code = res.code;
                var open_session = app.globalData.open_session;
                // console.log(name, telphone, checkCode, code);
                if (name !== "" && result == "1") {
                    wx.request({
                      url: url_common + '/api/user/bindUser',
                        data: {
                            user_real_name: name,
                            user_mobile: telphone,
                            captcha: checkCode,
                            code: code,
                            open_session: open_session
                        },
                        method: 'POST',
                        success: function (res) {
                            // console.log(checkCode);
                            // console.log(res);
                            var user_career = res.data.user_career;
                            var user_company = res.data.user_company;
                            var uer_email = res.data.user_email;
                            // console.log(user_career, user_company, uer_email);  
                            if (res.data.status_code == 2000000) {
                                wx.setStorageSync('user_id', res.data.user_id);
                                app.globalData.user_id = res.data.user_id;
                                wx.navigateTo({
                                    url: '/pages/register/companyInfo/companyInfo?user_career=' + user_career + "&&user_company=" + user_company + "&&uer_email=" + uer_email,
                                });
                            } else {
                                rqj.errorHide(that, "验证码错误", 1500)
                            }
                        }
                    })
                } else {
                    //显示错误提示
                    that.setData({
                        error: "1"
                    });
                    var errorTime = setTimeout(function () {
                        that.setData({
                            error: "0"
                        });
                        // console.log('提示已消失')
                    }, 1500);
                    if (name == '') {
                        that.setData({
                            error_text: '姓名不能为空'
                        });
                        // console.log(error_text)
                    } else if (result == "0") {
                        that.setData({
                            error_text: "请正确输入手机号"
                        })
                    } else {
                        that.setData({
                            error_text: "验证码错误"
                        })
                    }
                }
            }
        })
    }
});