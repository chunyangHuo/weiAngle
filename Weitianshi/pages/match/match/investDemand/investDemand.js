var rqj = require('../../../Template/Template.js');
var app = getApp()
var url = app.globalData.url
var url_common = app.globalData.url_common;
var save = true;
Page({
    data: {
        describe: "",
        domainValue: "选择领域",
        payArea: "选择城市",
        payStage: "选择阶段",
        expect: [],
        expect_index: 0,
        expect_arry: [],
        console_stage: "",
        error: '0',
        error_text: "",
        loading: '0',
        picker: 0,
        industryCard: {
            text: "项目领域*",
            url: "/pages/form/industry/industry?current=1",
            css: "checkOn",
            value: ["选择领域"],
            id: []
        }
    },
    onLoad: function (options) {
        var user_id = wx.getStorageSync('user_id');
        var that = this;
        var current = options.current;
        this.setData({
            current: current
        })
        var y_area = '';

        //请求地区,标签,期望融资,项目阶段数据
        wx.request({
          url: app.globalData.url_common + '/api/category/getProjectCategory',
            method: 'POST',
            success: function (res) {
                console.log("领域,金额,阶段的列表数据调用")
                console.log(res)//所有标签
                var thisData = res.data.data;
                //添加false
                that.for(thisData.area);
                that.for(thisData.industry);
                that.for(thisData.scale);
                that.for(thisData.stage);

                wx.setStorageSync('y_area', thisData.area);//地区
                wx.setStorageSync('industry', thisData.industry);//投资领域
                wx.setStorageSync('y_scale', thisData.scale);//投资金额
                wx.setStorageSync('y_stage', thisData.stage);//投资阶段
    
                //期望融资
                var scale = wx.getStorageSync('y_scale');
                var console_expect = wx.getStorageSync('y_console_expect');
                var expect_arry = [];
                scale.unshift({
                    scale_id: console_expect,
                    scale_money: "选择金额"
                })
                that.setData({
                    expect: scale,
                    console_expect: console_expect
                });
                for (var i = 0; i < scale.length; i++) {
                    expect_arry.push(scale[i].scale_money)
                }
                that.setData({
                    expect_arry: expect_arry
                })
            },
        })

        //检查是否发布过投资信息
        wx.request({
            url: url + '/api/investors/checkInvestorInfo',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                console.log("检查是否发布过信息")
                console.log(res)
                if (res.data.data != '') {
                    //获取已存有的投资领域,投资阶段,投资金额,投資地区
                    var thisData = res.data.data;
                    var industry = wx.getStorageSync('industry')//项目领域总数                   
                    var y_stage = wx.getStorageSync('y_stage')//投资阶段总数
                    var y_scale = wx.getStorageSync('y_scale')//投资金额总数
                    var y_area = wx.getStorageSync('hotCity')//地区总数
                    var y_describe = thisData.investor_desc;
                    // var describle = wx.getStorageSync('investor_desc')//具体描述
                    console.log(y_stage);
                    console.log(y_describe)
                    
                    // =========================投资领域==========================//
                    var y_domainValue = [];
                    var y_domainId = [];
                    var y_domainAllchecked = [];
                    var y_domainAllcheckedid = [];
                    for (var i = 0; i < industry.length; i++) {
                        y_domainAllchecked.push(industry[i].checked);
                        y_domainAllcheckedid.push(industry[i].industry_id)
                    }
                    var domain = thisData.industry_tag;
                    for (var i = 0; i < domain.length; i++) {
                        y_domainValue.push(domain[i].industry_name)
                        y_domainId.push(domain[i].industry_id)
                        var index = y_domainAllcheckedid.indexOf(domain[i].industry_id)
                        if (index != -1) {
                            y_domainAllchecked[index] = true;
                        }
                    };

                    // =========================投资阶段==========================//
                    var y_payStage = [];
                    var y_StageId = [];
                    var y_StageAllchecked = [];
                    var y_StageAllcheckedid = [];

                    for (var i = 0; i < y_stage.length; i++) {
                        y_StageAllchecked.push(y_stage[i].checked);
                        y_StageAllcheckedid.push(y_stage[i].stage_id)
                    }

                    var payStage = thisData.stage_tag;
                    for (var i = 0; i < payStage.length; i++) {
                        y_payStage.push(payStage[i].stage_name);
                        y_StageId.push(payStage[i].stage_id);
                        var index = y_StageAllcheckedid.indexOf(payStage[i].stage_id)
                        if (index != -1) {
                            y_StageAllchecked[index] = true;
                        }
                    }
                    // =========================投资金额==========================//
                    var y_payMoney = [];
                    var y_payMoneyId = [];
                    var y_payMoneyAllchecked = [];
                    var y_payMoneyeAllcheckedid = [];

                    for (var i = 0; i < y_scale.length; i++) {
                        y_payMoneyAllchecked.push(y_scale[i].checked);
                        y_payMoneyeAllcheckedid.push(y_scale[i].scale_id)
                    }
                    var payMoney = thisData.scale_tag;
                    for (var i = 0; i < payMoney.length; i++) {
                        y_payMoney.push(payMoney[i].scale_money);
                        y_payMoneyId.push(payMoney[i].scale_id);
                        var index = y_payMoneyeAllcheckedid.indexOf(payMoney[i].scale_id)
                        if (index != -1) {
                            y_payMoneyAllchecked[index] = true;
                        }
                    };



                    // =========================地区总数==========================//
                    var y_payArea = [];
                    var y_payAreaId = [];
                    var y_payAreaAllchecked = [];
                    var y_payAreaAllcheckedid = [];
                    for (var i = 0; i < y_area.length; i++) {
                        y_payAreaAllchecked.push(y_area[i].checked);
                        y_payAreaAllcheckedid.push(y_area[i].area_id)
                    }
                    var payArea = thisData.area_tag;
                    for (var i = 0; i < payArea.length; i++) {
                        y_payArea.push(payArea[i].area_title);
                        y_payAreaId.push(payArea[i].area_id);
                        var index = y_payAreaAllcheckedid.indexOf(payArea[i].area_id)
                        if (index != -1) {
                            y_payAreaAllchecked[index] = true;
                        }
                    }


                    var initPayMoney = thisData.scale_tag[0].scale_money
                    that.setData({
                        initPayMoney: initPayMoney
                    })

                    //初始化
                    wx.setStorageSync('y_describe', y_describe)
                    wx.setStorageSync('y_domainValue', y_domainValue)
                    wx.setStorageSync('y_domainId', y_domainId)
                    wx.setStorageSync('y_payStage', y_payStage)
                    wx.setStorageSync('y_stageId', y_StageId)
                    wx.setStorageSync('y_payMoney', y_payMoney)
                    wx.setStorageSync('y_payMoneyId', y_payMoneyId)
                    wx.setStorageSync('y_payArea', y_payArea)
                    wx.setStorageSync('y_payAreaId', y_payAreaId)

                    //投资领域
                    wx.setStorageSync('enchangeValue', y_domainValue);
                    wx.setStorageSync('enchangeId', y_domainId);
                    wx.setStorageSync('enchangeCheck', y_domainAllchecked);
                    // //投资阶段
                    wx.setStorageSync('payenchangeValue', y_payStage);
                    wx.setStorageSync('payenchangeId', y_StageId);
                    wx.setStorageSync('payenchangeCheck', y_StageAllchecked);
                    wx.setStorageSync('y_payStageId', y_StageId);
                    // //投资金额
                    wx.setStorageSync('paymoneyenchangeValue', y_payMoney);
                    wx.setStorageSync('paymoneyenchangeId', y_payMoneyId);
                    wx.setStorageSync('paymoneyenchangeCheck', y_payMoneyAllchecked);
                    // //投资地区
                    wx.setStorageSync('payareaenchangeValue', y_payArea);
                    wx.setStorageSync('payareaenchangeId', y_payAreaId);
                    wx.setStorageSync('payareaenchangeCheck', y_payAreaAllchecked);
                    // 具体描述
                    wx.setStorageSync('y_describe', y_describe)
                    that.setData({
                        domainValue: y_domainValue,
                        domainId: y_domainId,
                        describe: y_describe,
                        payArea: y_payArea,
                        payAreaId: y_payAreaId,
                        payStage: y_payStage,
                        payStageId: y_StageId,
                        payMoney: y_payMoney,
                        payMoneyId: y_payMoneyId
                    })
                }
            },
        })


        // -------------------------项目领域处理部份---------------------------------
        let industryCard=this.data.industryCard;
        let industryCurrent1=wx.getStorageSync("industry");
        
        //检查是否发布过投资信息
        wx.request({
            url: url + '/api/investors/checkInvestorInfo',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                console.log("检查是否发布过信息")
                console.log(res)
                if (res.data.data != '') {
                    //所选领域部分的数据处理
                    var industry = res.data.data.industry_tag;
                    industryCard.value=[];
                    industry.forEach((x) => {
                        industryCard.value.push(x.industry_name);
                        industryCard.id.push(x.industry_id);
                    })

                    industryCurrent1.forEach((x) => {
                        if (industryCard.value.indexOf(x.industry_name) != -1) {
                            console.log(x.industry_name)
                            x.check = true;
                        }
                    })

                    wx.setStorageSync("industryCurrent1", industryCurrent1)
                    that.setData({
                        industryCard:industryCard,
                    })
                }
            },
        })
    },
    //页面显示
    onShow: function () {
        var that = this;
        //填入所属领域,项目介绍,所在地区
        var domainValue = wx.getStorageSync('y_domainValue') || "选择领域";
        var domainId = wx.getStorageSync('y_domainId');
        var y_describe = wx.getStorageSync('y_describe');
        var payArea = wx.getStorageSync('y_payArea') || "选择城市";
        var payAreaId = wx.getStorageSync('y_payAreaId');
        var payStage = wx.getStorageSync('y_payStage') || "选择阶段";
        var payStageId = wx.getStorageSync('y_payStageId');
        var payMoney = wx.getStorageSync('y_payMoney') || "选择金额";
        var payMoneyId = wx.getStorageSync('y_payMoneyId');
 
        that.setData({
            domainValue: domainValue,
            domainId: domainId,
            y_describe: y_describe,
            payArea: payArea,
            payAreaId: payAreaId,
            payStage: payStage,
            payStageId: payStageId,
            payMoney: payMoney,
            payMoneyId: payMoneyId
        })
        // -------------------------项目领域处理部份---------------------------------
        let industryCard=this.data.industryCard;
        let industryCurrent1=wx.getStorageSync("industryCurrent1");

        if (industryCurrent1) {
            industryCard.value=[];
            industryCard.id=[];
            industryCurrent1.forEach((x) => {
                if (x.check == true) {
                    industryCard.value.push(x.industry_name);
                    industryCard.id.push(x.industry_id);
                }
                wx.setStorageSync("industryCurrent1", industryCurrent1)
            })
            this.setData({
                industryCard: industryCard
            })
        }
    },
    //给所有添加checked属性
    for: function (name) {
        for (var i = 0; i < name.length; i++) {
            name[i].checked = false;
        }
    },

    //下拉刷新
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
    },

    //文本框输入
    bindTextAreaBlur: function (e) {
        var that = this;
        wx.setStorageSync('y_describe', e.detail.value);
        that.setData({
          y_describe: e.detail.value
        })  
    },


    //期望融资
    expect: function (e) {
        var picker = 1;
        this.setData({
            expect_index: e.detail.value,
            console_expect: this.data.expect[this.data.expect_index].scale_id,
            picker: picker
        });
    },


    //点击发布
    public: function () {
        save = !save;
        var that = this;
        var theData = that.data;
        var y_describe = theData.y_describe;
        var industryValue = this.data.industryCard.value;
        var industryId = this.data.industryCard.id;
        var payArea = this.data.payArea;
        var payAreaId = this.data.payAreaId;
        var payStage = this.data.payStage;
        var payStageId = this.data.payStageId;
        var payMoney = this.data.payMoney;
        var payMoneyId = this.data.payMoneyId;
        var user_id = wx.getStorageSync('user_id');
        // console.log(industryId, payStageId, payMoneyId, payAreaId, y_describe)
        if (industryValue !== "选择领域" && payMoney != "选择金额" && payArea !== "选择城市" && payStage !== "选择阶段") {
            wx.request({
                url: url + '/api/investors/insertInvestor',
                data: {
                    user_id: user_id,
                    investor_industry: industryId,
                    investor_stage: payStageId,
                    investor_scale: payMoneyId,
                    investor_area: payAreaId,
                    investor_desc: y_describe
                },
                method: 'POST',
                success: function (res) {
                    if (res.data.status_code == 2000000) {
                        wx.removeStorageSync("industryCurrent1")
                        wx.setStorageSync('investor_id', res.data.investor_id)
                        var current = that.data.current;
                        if (current == 1) {
                            wx.switchTab({
                                url: "/pages/my/my/my"
                            })
                        } else {
                            wx.switchTab({
                                url: '/pages/match/match/match/match'
                            });
                        }

                    } else {
                        that.setData({
                            error: "1",
                            error_text: res.data.error_msg
                        })
                        setTimeout(
                            function () {
                                that.setData({
                                    error: "0"
                                })
                            }
                            , 2000)
                    }
                },
            })
        } else {
            that.setData({
                error: "1"
            })
            var errorTime = setTimeout(function () {
                that.setData({
                    error: "0"
                });
            }, 1500);

            if (industryId == 0) {
                that.setData({
                    error_text: "领域不能为空"
                })
            } else if (payStageId == 0) {
                that.setData({
                    error_text: "轮次不能为空"
                })
            } else if (payMoneyId == 0) {
                that.setData({
                    error_text: "金额不能为空"
                })
            } else if (payAreaId == 0) {
                that.setData({
                    error_text: "地区不能为空"
                })
            }
        }
    },
    onUnload: function () {
        // 页面关闭
        if (save) {
            wx.setStorageSync('enchangeValue', []);
            wx.setStorageSync('enchangeId', []);
            wx.setStorageSync('enchangeCheck', [])
            wx.setStorageSync('payenchangeValue', [])
            wx.setStorageSync('payenchangeId', [])
            wx.setStorageSync('payenchangeCheck', [])
            wx.setStorageSync('paymoneychangeValue', [])
            wx.setStorageSync('paymoneychangeId', [])
            wx.setStorageSync('paymoneyenchangeCheck', [])
            wx.setStorageSync('payareachangeValue', [])
            wx.setStorageSync('payareachangeId', [])
            wx.setStorageSync('payareaenchangeCheck', [])
            wx.setStorageSync('domainValue', []);
            wx.setStorageSync('domainId', '');
        }
    }
});