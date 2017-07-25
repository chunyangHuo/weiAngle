var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        describe: "",
        industryValue: "选择领域",
        belongArea: "",
        stage_index: 0,
        stageValue: [],
        stageId: [],
        scale_index: 0,
        scaleValue: [],
        tips: ["其他", "独家签约", "非独家"],
        tipsIndex: 4,
        console_stage: "",
        console_scale: "",
        console_tips: "",
        error: '0',
        error_text: "",
        loading: '0',
        industryCard: {
            text: "项目领域*",
            url: "/pages/form/industry/industry?current=2",
            css: "checkOn",
            value: ["选择领域"],
            id: []
        }
    },
    onLoad: function (options) {
        console.log("onload industryCurrent2")
        console.log(wx.getStorageSync("industryCurrent2"))
        console.log(options)
        var that = this;
        var user_id = options.user_id;
        var pro_id = options.pro_id;
        var current = options.current;
        var stageValue = [];
        var stageId = [];
        var scaleValue = [];
        var scaleId = [];
        var industryCard = this.data.industryCard;
        console.log(this.data.belongArea)
        // 为项目阶段picker和期望融资pikcer做准备
        var scale = wx.getStorageSync("scale");
        var stage = wx.getStorageSync("stage");
        scale.unshift({
            scale_id: 0,
            scale_money: "选择融资"
        });
        stage.unshift({
            stage_id: 0,
            stage_name: "选择阶段"
        });
        //循环出阶段和融资的数组
        stage.forEach((x) => {
            stageValue.push(x.stage_name);
            stageId.push(x.stage_id);
        })
        scale.forEach((x) => {
            scaleValue.push(x.scale_money);
            scaleId.push(x.scale_id);
        })

        this.setData({
            pro_id: pro_id,
            user_id: user_id,
            current: current,
            stageValue: stageValue,
            stageId: stageId,
            scaleValue: scaleValue,
            scaleId: scaleId
        })

        // 获取项目信息
        wx.request({
          url: url_common + '/api/project/getProjectDetail',
            data: {
                user_id: options.user_id,
                project_id: options.pro_id
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var theData = res.data.data;
                var describe = theData.pro_intro;
                var industry = theData.pro_industry;
                var industryValue = [];
                var industryId = [];
                var stage_index = stageValue.indexOf(theData.pro_stage.stage_name);
                var scale_index = scaleValue.indexOf(theData.pro_scale.scale_money);
                var tipsIndex = theData.is_exclusive;
                var pro_goodness = theData.pro_goodness;
                var belongArea = theData.pro_area.area_title;//地区
                var provinceNum = theData.pro_area.pid;
                var cityNum = theData.pro_area.area_id;
                var industryCurrent2 = wx.getStorageSync("industry");
                wx.setStorageSync("m_provinceNum", provinceNum);
                wx.setStorageSync('m_cityNum', cityNum)
                wx.setStorageSync('m_belongArea', belongArea)
                wx.getStorageSync('belongArea')
                console.log(provinceNum, cityNum, belongArea, pro_goodness)
                //----------------------------项目领域进行处理----------------------
                if (industry) {
                    industry.forEach((x) => {
                        industryValue.push(x.industry_name);
                        industryId.push(x.industry_id)
                    })
                }
                industryCurrent2.forEach((x) => {
                    if (industryValue.indexOf(x.industry_name) != -1) {
                        console.log(x.industry_name)
                        x.check = true;
                    }
                })
                industryCard.value = industryValue;
                industryCard.id = industryId;
                console.log(industryValue)
                wx.setStorageSync("industryCurrent2", industryCurrent2)

                that.setData({
                    industryCard: industryCard,
                    describe: describe,
                    stage_index: stage_index,
                    scale_index: scale_index,
                    tipsIndex: tipsIndex,
                    belongArea: belongArea,
                    provinceNum: provinceNum,
                    cityNum: cityNum,
                    pro_goodness: pro_goodness
                })
                console.log(belongArea)
            },
            fail: function (res) {
                wx.showToast({
                    title: res.error_msg
                })
            },
        })
    },
    onShow: function () {
        console.log("onshow industryCurrent2")
        console.log(wx.getStorageSync("industryCurrent2"))
        var that = this;
        // console.log(that.data)
        // console.log(that.data.belongArea)
        if (wx.getStorageSync("m_belongArea") != '') {
            var belongArea = wx.getStorageSync('m_belongArea');
            console.log(belongArea);
        }
        // var belongArea = wx.getStorageSync('m_belongArea') || this.data.belongArea;
        // var belongArea = wx.getStorageSync('m_belongArea');
        var provinceNum = wx.getStorageSync("m_provinceNum");
        var cityNum = wx.getStorageSync('m_cityNum');
        var pro_goodness = wx.getStorageSync("pro_goodness");
        // console.log(cityNum);
        // console.log(pro_goodness)
        //如果已经进入项目领域后时,对返回该页面的值进行修正
        var industryCurrent2 = wx.getStorageSync("industryCurrent2");
        var industryCard = this.data.industryCard;
        if (industryCurrent2) {
            console.log(2)
            var industryValue = [];
            var industryId = [];
            industryCurrent2.forEach((x) => {
                if (x.check == true) {
                    industryValue.push(x.industry_name);
                    industryId.push(x.industry_id);
                }
                wx.setStorageSync("industryCurrent2", industryCurrent2)
            })
            industryCard.value = industryValue;
            industryCard.id = industryId;
            this.setData({
                industryCard: industryCard
            })
        }
        // this.setData({
        //     belongArea: belongArea,
        //     // pro_goodness: pro_goodness
        // })
        if (cityNum) {//如果取到了cityNum
            // console.log(cityNum)
            this.setData({
                provinceNum: provinceNum,
                cityNum: cityNum,
                belongArea: belongArea
            })
        }
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
    // 项目亮点
    slectInput: function (e) {
        var that = this;
        wx.setStorageSync("pro_goodness", e.detail.value);
        that.setData({
            pro_goodness: e.detail.value
        })
    },

    // 选择领域
    industry: function () {
        wx.navigateTo({
            url: '/pages/form/industry/industry?current=' + 2
        })
        console.log(wx.getStorageSync("industryCurrent2"));
    },

    //是否独家的效果实现
    tipsOn: function (e) {
        var that = this;
        console.log(e.target.dataset)
        that.setData({
            tipsIndex: e.target.dataset.tipsIndex
        })
    },

    //项目阶段
    stage: function (e) {
        this.setData({
            stage_index: e.detail.value,
        });
    },

    //期望融资
    scale: function (e) {
        this.setData({
            scale_index: e.detail.value,
        });
    },
    belongArea: function (e) {
        var provinceNum = this.data.provinceNum;//初始地区
        var cityNum = this.data.cityNum;//二级地区
        var provinceNum = wx.getStorageSync("m_provinceNum");
        var cityNum = wx.getStorageSync('m_cityNum')
        console.log(provinceNum, cityNum)
        wx.navigateTo({
            url: '/pages/form/area1/area1?current=1' + "&&provinceNum=" + provinceNum + "&&cityNum=" + cityNum
        })
    },

    //上传BP
    upLoad: function () {
        var that = this;
        var pro_intro = this.data.describe;//描述
        var industry = this.data.industryCard.id;//id
        var pro_finance_stage = this.data.stage_index;
        var pro_finance_scale = this.data.scale_index;
        var is_exclusive = this.data.tipsIndex;
        var pro_goodness = this.data.pro_goodness;
        this.setData({
            upLoad: 0
        })
        //保存项目更改
        that.updata(that)
        //跳出提示模态框 
        wx.showModal({
            titel: "友情提示",
            content: "请到www.weitianshi.cn/qr上传",
            showCancel: true,
            success: function (res) {
                if (res.confirm) {
                    wx.scanCode({
                        success: function (res) {
                            // console.log(res);
                            var user_id = wx.getStorageSync("user_id");//用戶id
                            var credential = res.result;//二维码扫描信息
                            var project_id = that.data.pro_id;
                            console.log(project_id);
                            wx.request({
                                url: app.globalData.url_common + '/api/auth/writeUserInfo',
                                data: {
                                    type: 'update',
                                    user_id: user_id,
                                    project_id: project_id,
                                    credential: credential,
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
        var describe = this.data.describe;
        var industryValue = this.data.industryCard.value;
        var industryId = this.data.industryCard.id;
        var provinceNum = this.data.provinceNum;
        var cityNum = this.data.cityNum;
        var stageId = this.data.stageId;
        var scaleId = this.data.scaleId;
        var stage_index = this.data.stage_index;
        var scale_index = this.data.scale_index;
        var console_stage = stageId[stage_index];
        var console_scale = scaleId[scale_index];
        var tipsIndex = this.data.tipsIndex;
        var user_id = wx.getStorageSync('user_id');
        var pro_id = this.data.pro_id;
        var current = this.data.current;
        var pro_goodness = this.data.pro_goodness;
        var upLoad = this.data.upLoad;
        this.setData({
            upLoad: 1
        })
        console.log(user_id, describe, industryId, console_stage, console_scale, provinceNum, cityNum, tipsIndex)
        if (describe !== "" && industryValue !== "选择领域" && console_stage !== 0 && console_scale != 0 && provinceNum !== 0 && cityNum !== 0 && tipsIndex !== 4 && pro_goodness !== "") {
            //保存项目更改
            that.updata(that)
        } else {
            if (describe == "") {
                rqj.errorHide(that, "介绍不能为空", 1500)
            } else if (industryId == 0) {
                rqj.errorHide(that, "所属领域不能为空", 1500)
            } else if (console_stage == 0) {
                rqj.errorHide(that, "项目阶段不能为空", 1500)
            } else if (console_scale == 0) {
                rqj.errorHide(that, "期望融资不能为空", 1500)
            } else if (provinceNum == 0 || cityNum == 0) {
                rqj.errorHide(that, "所在地区不能为空", 1500)
            } else if (tipsIndex == 4) {
                rqj.errorHide(that, "请选择是否独家", 1500)
            } else if (pro_goodness == "") {
                rqj.errorHide(that, "项目亮点不能为空", 1500)
            }
        }
    },

    //更新项目
    updata(that) {
        console.log(1)
        var user_id = wx.getStorageSync('user_id');
        var pro_id = that.data.pro_id;
        var describe = that.data.describe;
        var industryId = that.data.industryCard.id;
        var stageId = that.data.stageId;
        var scaleId = that.data.scaleId;
        var stage_index = that.data.stage_index;
        var scale_index = that.data.scale_index;
        var console_stage = stageId[stage_index];
        var console_scale = scaleId[scale_index];
        var provinceNum = that.data.provinceNum;
        var cityNum = that.data.cityNum;
        var tipsIndex = that.data.tipsIndex;
        var pro_goodness = that.data.pro_goodness;
        var upLoad = that.data.upLoad;
        // console.log(2222)
        wx.request({
          url: url_common + '/api/project/updateProject',
            data: {
                user_id: user_id,
                project_id: pro_id,
                pro_intro: describe,
                industry: industryId,
                pro_finance_stage: console_stage,
                pro_finance_scale: console_scale,
                pro_area_province: provinceNum,
                pro_area_city: cityNum,
                is_exclusive: tipsIndex,
                pro_goodness: pro_goodness
            },
            method: 'POST',
            success: function (res) {
                wx.removeStorageSync("industryCurrent2");
                if (res.status_code = 2000000) {
                    if (upLoad == 1) {
                        console.log("yes");
                        wx.navigateBack({//页面返回
                            delta: 2 // 回退前 delta(默认为1) 页面
                        })
                    }
                    console.log(2);
                } else {
                    wx.showToast({
                        title: res.status_code
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: "维护项目失败"
                })
            },
        })
    }
});