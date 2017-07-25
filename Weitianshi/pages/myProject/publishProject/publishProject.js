var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        describe: "",
        belongArea: "选择城市",
        stage: [],
        stage_index: 0,
        stage_arry: [],
        expect: [],
        expect_index: 0,
        expect_arry: [],
        tips: ["其他", "独家签约", "非独家"],
        tips_index: 4,
        console_stage: "",
        console_expect: "",
        console_tips: "",
        loading: '0',
        pro_goodness: "",
        industryCard: {
            text: "项目领域*",
            url: "/pages/form/industry/industry?current=0",
            css: "",
            value: ["选择领域"],
            id: []
        }
    },
    onLoad: function () {
        var that = this;

        //初始化
        wx.removeStorageSync("industryCurrent0")
        wx.setStorageSync('describe', "");
        wx.setStorageSync('pro_goodness', "");
        wx.setStorageSync('console_stage', 0);
        wx.setStorageSync('console_expect', 0);
        wx.setStorageSync('belongArea', "选择城市");
        wx.setStorageSync('provinceNum', 0);
        wx.setStorageSync('cityNum', 0);
        wx.setStorageSync('tips', 4);
        //请求地区,标签,期望融资,项目阶段数据
        wx.request({
          url: app.globalData.url_common + '/api/category/getProjectCategory',
            method: 'POST',
            success: function (res) {
                console.log("各种条目分类")
                console.log(res)
                var thisData = res.data.data;
                wx.setStorageSync('area', thisData.area);
                wx.setStorageSync('industry', thisData.industry);
                wx.setStorageSync('scale', thisData.scale);
                wx.setStorageSync('stage', thisData.stage);
                //填入项目阶段和期望融资
                var scale = wx.getStorageSync('scale');
                var stage = wx.getStorageSync('stage');
                var expect_arry = [];
                var stage_arry = [];
                // console.log(scale, stage);
                scale.unshift({
                    scale_id: 0,
                    scale_money: "选择融资"
                });
                stage.unshift({
                    stage_id: 0,
                    stage_name: "选择阶段"
                });
                that.setData({
                    stage: stage,
                    expect: scale
                });

                for (var i = 0; i < stage.length; i++) {
                    stage_arry.push(stage[i].stage_name)
                }
                for (var b = 0; b < scale.length; b++) {
                    expect_arry.push(scale[b].scale_money)
                }
                that.setData({
                    stage_arry: stage_arry,
                    expect_arry: expect_arry
                })
            },
        })
    },
    //页面显示
    onShow: function () {
        var that = this;

        //填入所属领域,项目介绍,所在地区
        var that = this;
        // 项目介绍
        var describe = wx.getStorageSync('describe');
        // 所在地区
        var belongArea = wx.getStorageSync('belongArea');
        // 省的信息
        var provinceNum = wx.getStorageSync('provinceNum');
        // 城市信息
        var cityNum = wx.getStorageSync('cityNum');
        // 项目亮点
        var pro_goodness = wx.getStorageSync('pro_goodness');
        // console.log(industryValue, industryId, describe, belongArea, provinceNum, cityNum, this.data.tips_index);

        // ------------------项目领域数据处理--------------------------------
        var industryCard = this.data.industryCard;
        var industryCurrent0 = wx.getStorageSync("industryCurrent0");
        rqj.dealTagsData(that, industryCurrent0, industryCard, "industry_name", "industry_id")

        that.setData({
            industryCard: industryCard,
            describe: describe,
            belongArea: belongArea,
            provinceNum: provinceNum,
            cityNum: cityNum,
            pro_goodness: pro_goodness
        })
    },
    //下拉刷新
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
    },

    //文本框输入
    bindTextAreaBlur: function (e) {
        var that = this;
        wx.setStorageSync('describe', e.detail.value);
        that.setData({
            describe: e.detail.value
        })
    },
    //项目亮点
    slectInput: function (e) {
        var that = this;
        wx.setStorageSync('pro_goodness', e.detail.value);
        that.setData({
            pro_goodness: e.detail.value
        })
    },

    //是否独家的效果实现
    tipsOn: function (e) {
        var that = this;
        that.setData({
            tips_index: e.target.dataset.tips
        })
    },

    //项目阶段
    stage: function (e) {
        this.setData({
            stage_index: e.detail.value,
        });
    },

    //期望融资
    expect: function (e) {
        this.setData({
            expect_index: e.detail.value,
            console_expect: this.data.expect[this.data.expect_index].scale_id,
        });
    },

    //上传BP
    upLoad: function () {
        var pro_intro = this.data.describe;//描述
        var industry = this.data.industryCard.id;//id
        var pro_goodness = this.data.pro_goodness;//亮点
        var pro_finance_stage = this.data.stage[this.data.stage_index].stage_id;
        var pro_finance_scale = this.data.expect[this.data.expect_index].scale_id;
        var is_exclusive = this.data.tips_index * 1;
        //弹出PC端url提示文本模态框
        wx.showModal({
            titel: "友情提示",
            content: "请到www.weitianshi.cn/qr上传",
            showCancel: true,
            success: function (res) {
                // console.log('用户点击确定')
                if (res.confirm) {
                    wx.scanCode({
                        success: function (res) {
                            var user_id = app.globalData.user_id;
                            var credential = res.result;//二维码扫描信息
                            //发送扫描结果和项目相关数据到后台
                            wx.request({
                                url: app.globalData.url_common + '/api/auth/writeUserInfo',
                                data: {
                                    type: 'create',
                                    credential: credential,
                                    user_id: user_id,
                                    pro_data: {
                                        "pro_intro": pro_intro,
                                        "industry": industry,
                                        "pro_finance_stage": pro_finance_stage,
                                        "pro_finance_scale": pro_finance_scale,
                                        "is_exclusive": is_exclusive,
                                        "pro_goodness": pro_goodness
                                    }
                                },
                                method: 'POST',
                                success: function (res) {
                                    if (res.data.status_code == 2000000) {
                                        wx.navigateTo({
                                            url: '/pages/scanCode/bpScanSuccess/bpScanSuccess',
                                        })
                                    }
                                }
                            })
                        },
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },


    //点击发布
    public: function () {
        var that = this;
        var theData = that.data;
        var describe = this.data.describe;
        var pro_goodness = this.data.pro_goodness;
        var industryValue = this.data.industryCard.value;
        var industryId = this.data.industryCard.id;
        var provinceNum = this.data.provinceNum;
        var cityNum = this.data.cityNum;
        var console_stage = this.data.stage[this.data.stage_index].stage_id;
        var console_expect = this.data.expect[this.data.expect_index].scale_id;
        var tips = this.data.tips_index;
        var user_id = app.globalData.user_id;
        // console.log(user_id, describe, industryId, console_stage, console_expect, provinceNum, cityNum, tips)
        if (describe !== "" && industryValue !== "选择领域" && console_stage !== 0 && console_expect != 0 && provinceNum !== 0 && cityNum !== 0 && tips !== 4 && pro_goodness !== "") {
            wx.request({
                url: url_common + '/api/project/createProject',
                data: {
                    user_id: user_id,
                    pro_intro: describe,
                    industry: industryId,
                    pro_finance_stage: console_stage,
                    pro_finance_scale: console_expect,
                    pro_area_province: provinceNum,
                    pro_area_city: cityNum,
                    is_exclusive: tips,
                    pro_goodness: pro_goodness
                },
                method: 'POST',
                success: function (res) {
                    console.log(res)
                    if (res.data.status_code == 2000000) {
                        //数据清空
                        wx.setStorageSync('project_id', res.data.project_id);
                        wx.setStorageSync('describe', "");
                        wx.setStorageSync('console_stage', 0);
                        wx.setStorageSync('console_expect', 0);
                        wx.setStorageSync('belongArea', "选择城市");
                        wx.setStorageSync('provinceNum', 0);
                        wx.setStorageSync('cityNum', 0);
                        wx.setStorageSync('tips', 4);
                        wx.setStorageSync('enchangeCheck', [])
                        wx.setStorageSync('enchangeValue', []);
                        wx.setStorageSync('enchangeId', []);
                        wx.setStorageSync('pro_goodness', "");
                        wx.switchTab({
                            url: '/pages/match/match/match/match'
                        });
                    }
                },
            })
        } else {
            console.log(6);
            rqj.errorHide(that, "请完整填写信息", 1500)
            // var errorTime = setTimeout(function () {
            //     that.setData({
            //         error: "0"
            //     });
            //     console.log('提示已消失')
            // }, 1500);

            // if (describe == "") {
            //     that.setData({
            //         error_text: "介绍不能为空"
            //     })
            // } else if (industryId == 0) {
            //     that.setData({
            //         error_text: "领域不能为空"
            //     })
            // } else if (console_stage == 0) {
            //     that.setData({
            //         error_text: "轮次不能为空"
            //     })
            // } else if (console_expect == 0) {
            //     that.setData({
            //         error_text: "金额不能为空"
            //     })
            // } else if (provinceNum == 0 || cityNum == 0) {
            //     that.setData({
            //         error_text: "地区不能为空"
            //     })
            // } else if (tips == 4) {
            //     that.setData({
            //         error_text: "请选择是否独家"
            //     })
            // } else if (pro_goodness == "") {
            //     that.setData({
            //         error_text: "请填写项目亮点"
            //     })
            // }
        }
    },
});