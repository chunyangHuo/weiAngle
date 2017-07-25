var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        case_time: "请选择",
        industry: "请选择",
        stage: ["请选择"],
        stage_index: 0,
        buttonOne: {
            text: "保存"
        },
        industryCard: {
            text: "项目领域*",
            url: "/pages/form/industry/industry?current=3",
            css: "",
            value: ["选择领域"],
            id: []
        }
    },
    onLoad: function (options) {
        //获取当前时间,以备picker使用
        var d = new Date();
        var yearBefore = d.getFullYear() - 20;
        var yearNow = d.getFullYear();
        var month = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
        var day = d.getDate() > 9 ? d.getDate() : '0' + d.getDate()
        var timeBefore = yearBefore + '-' + month + '-' + day;
        var timeNow = yearNow + '-' + month + '-' + day;


        var that = this;
        var industry = wx.getStorageSync("industry");
        wx.request({
          url: app.globalData.url_common + '/api/category/getProjectCategory',
            method: 'POST',
            success: function (res) {
                var stage = res.data.data.stage;
                var stage_arr = [];
                var stageId = [];
                stage.unshift({
                    stage_id: 0,
                    stage_name: "请选择"
                });
                for (var i = 0; i < stage.length; i++) {
                    stage_arr.push(stage[i].stage_name);
                    stageId.push(stage[i].stage_id)
                }
                stage = stage_arr;
                that.setData({
                    timeNow:timeNow,
                    timeBefore:timeBefore,
                    stage: stage,
                    stageId: stageId,
                })
            },
        })
        // 维护案例的情况下
        // 通过是否有Index传值进来来区别新建案例还是维护案例
        if (options.index) {
            var case_index = options.index;
            var invest_case = wx.getStorageSync('invest_case');
            var index = options.index;
            invest_case = invest_case[index];
            var industry = invest_case.industry;
            var industry_arr = [];
            var industryId = [];
            for (var i = 0; i < industry.length; i++) {
                industry_arr.push(industry[i].industry_name);
                industryId.push(industry[i].industry_id)
            }
            industry = industry_arr;
            var case_stage = invest_case.stage.stage_id;
            var case_stage_name = invest_case.stage.stage_name;
            var case_money = invest_case.case_money;
            var case_time = invest_case.case_deal_time;
            var case_city = invest_case.case_city;
            var case_province = invest_case.case_province;
            this.setData({
                case_index: case_index,
                case_name: invest_case.case_name,
                industry: industry,
                industryId: industryId,
                case_stage: case_stage,
                case_stage_name: case_stage_name,
                case_money: case_money,
                case_time: case_time,
                case_city: case_city,
                case_province: case_province
            })
        }
    },
    onShow: function () {
        var case_index = this.data.case_index;
        var industry = wx.getStorageSync('case_domainValue');
        var industryId = wx.getStorageSync('case_domainId');
        var belongArea = wx.getStorageSync('addcase_belongArea');

        //如果维护项目就不用再去读领域的缓存
        if (case_index) {
            this.setData({
                belongArea: belongArea
            })
        } else {
            this.setData({
                industry: industry,
                industryId: industryId,
                belongArea: belongArea
            })
        }

        // -------------------对industry相关数据进行处理---------------------------------
        var industryCard = this.data.industryCard;
        var that = this;
        var industryCurrent3 = wx.getStorageSync("industryCurrent3");
        rqj.dealTagsData(that, industryCurrent3, industryCard, "industry_name", "industry_id")
        this.setData({
            industryCard: industryCard
        })

    },

    //项目名称
    case_name: function (e) {
        var that = this;
        var case_name = e.detail.value;
        that.setData({
            case_name: case_name
        })
    },

    //项目阶段
    case_stage: function (e) {
        var case_stage = this.data.case_stage;
        var case_stage_name = this.data.case_stage_name;
        var stage_index = e.detail.value;
        var stage = this.data.stage;
        var stageId = this.data.stageId;
        this.setData({
            stage_index: stage_index,
            case_stage: stageId[stage_index],
            case_stage_name: stage[stage_index]
        })
    },
    //项目金额
    case_money: function (e) {
        var that = this;
        var case_money = e.detail.value;
        that.setData({
            case_money: case_money
        })
        console.log(case_money);
    },
    //项目时间
    case_time: function (e) {
        this.setData({
            case_time: e.detail.value
        })
    },
    // 投资地区
    case_local: function (e) {
        wx.navigateTo({
            url: '/pages/form/area1/area1?current=' + 2
        })
    },
    //保存
    buttonOne: function () {
        var that = this;
        var case_index = this.data.case_index;
        var user_id = wx.getStorageSync('user_id');
        var case_name = this.data.case_name;
        var industry = this.data.industryCard.value;
        var case_industry = this.data.industryCard.id;
        var stageId = this.data.stageId;
        var stage_index = this.data.stage_index;
        var case_stage = case_stage || stageId[stage_index];
        var case_money = this.data.case_money;
        var case_time = this.data.case_time;
        var belongArea = this.data.belongArea
        var case_province = belongArea.provinceNum;
        var case_city = belongArea.cityNum;
        console.log("名称,标签名,标签Id,阶段ID,金额,时间,省份ID,城市ID")
        console.log(user_id, case_name, industry, case_industry, case_stage, case_money, case_time, case_province, case_city, belongArea)
        if (user_id && case_name != undefined && case_industry != '' && case_stage != 0 && case_money != undefined && case_time != '请选择' && case_province != undefined && case_city != undefined) {
            if (case_index) {
                console.log(case_index)
            } else {
                wx.request({
                    url: url_common + '/api/user/createUserProjectCase',
                    data: {
                        user_id: user_id,
                        case_name: case_name,
                        case_industry: case_industry,
                        case_stage: case_stage,
                        case_money: case_money,
                        case_deal_time: case_time,
                        case_province: case_province,
                        case_city: case_city
                    },
                    method: 'POST',
                    success: function (res) {
                        if (res.data.status_code == 2000000) {
                            wx.removeStorageSync("industryCurrent3")
                            wx.removeStorageSync('case_domainValue');
                            wx.removeStorageSync('case_domainId')
                            wx.navigateBack({
                                delta: 1,
                            })
                        }
                    },
                    fail: function (res) {
                        console.log(res)
                    },
                })
            }
        } else {
            console.log("不能为空")
            if (case_name == undefined) {
                console.log(2)
                rqj.errorHide(that, "项目名称不能为空", 1500)
            } else if (case_industry == '') {
                console.log(3)
                rqj.errorHide(that, "领域不能为空", 1500)
            } else if (case_stage == 0) {
                console.log(4)
                rqj.errorHide(that, "轮次不能为空", 1500)
            } else if (case_money == undefined) {
                console.log(5)
                rqj.errorHide(that, "投资金额不能为空", 1500)
            } else if (case_time == '请选择') {
                console.log(6)
                rqj.errorHide(that, "交易时间不能为空", 1500)
            } else if (belongArea == '') {
                // case_city == [] || case_province == undefined
                console.log(7)
                rqj.errorHide(that, "地区不能为空", 1500)
            }

        }
    },
    onUnload: function () {
        wx.setStorageSync('provinceNum', [])
        wx.setStorageSync('cityNum', [])
    }
})