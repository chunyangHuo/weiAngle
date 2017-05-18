var app = getApp();
var url = app.globalData.url;
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
        picker: 0
    },
    //给所有添加checked属性
    for :function(name){
      for (var i = 0; i < name.length; i++) {
        name[i].checked = false;
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
        wx.request({
          url: url + '/api/category/getHotCity',
          data: {},
          method: 'POST',
          success: function (res) {
            console.log(res)
            var y_area = res.data.data;
            for (var i = 0; i < y_area.length; i++) {
              y_area[i].checked = false;
            }
            wx.setStorageSync('hotpayArea', y_area)
          }
        });

        //请求地区,标签,期望融资,项目阶段数据
        wx.request({
            url: url + '/api/category/getWxProjectCategory',
            method: 'POST',
            success: function (res) {
                console.log(res)//所有标签
                var thisData = res.data.data;
                //添加false
                that.for (thisData.area);
                that.for(thisData.industry);
                that.for(thisData.scale);
                that.for(thisData.stage);

                // console.log(thisData.area)
                // console.log(thisData.area)
                wx.setStorageSync('y_area', thisData.area);//地区
                wx.setStorageSync('industry', thisData.industry);//投资领域
                wx.setStorageSync('y_scale', thisData.scale);//投资金额
                wx.setStorageSync('y_stage', thisData.stage);//投资阶段
                // console.log(thisData);//所有的数据


                //期望融资
                var scale = wx.getStorageSync('y_scale');
                console.log(scale)
                var console_expect = wx.getStorageSync('y_console_expect');
                var expect_arry = [];
                // console.log(console_expect);
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
                // console.log(expect_arry)
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
                console.log(res)
                if (res.data.data != '') {
                    //获取已存有的投资领域,投资阶段,投资金额,投次地区
                    var thisData = res.data.data;
                    var industry = wx.getStorageSync('industry')//投资领域总数                   
                    var y_stage = wx.getStorageSync('y_stage')//投资阶段总数
                    var y_scale = wx.getStorageSync('y_scale')//投资金额总数
                    
                    var y_area = wx.getStorageSync('hotpayArea')//地区总数

                    // =========================投资领域==========================//
                    var y_domainValue = [];
                    var y_domainId = [];
                    var y_domainAllchecked=[];
                    var y_domainAllcheckedid =[];
                    for (var i = 0; i < industry.length; i++) {
                      y_domainAllchecked.push(industry[i].checked);
                      y_domainAllcheckedid.push(industry[i].industry_id)                                    
                    }
                    // console.log(y_domainAllchecked, y_domainAllcheckedid);
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
                    console.log(y_area);
                    for (var i = 0; i < y_area.length; i++) {
                      y_payAreaAllchecked.push(y_area[i].checked);
                      y_payAreaAllcheckedid.push(y_area[i].area_id)
                    }
                    var payArea = thisData.area_tag;
                    console.log(payArea,y_area)
                    for (var i = 0; i < payArea.length; i++) {
                        y_payArea.push(payArea[i].area_title);
                        y_payAreaId.push(payArea[i].area_id);
                        var index = y_payAreaAllcheckedid.indexOf(payArea[i].area_id)
                        console.log()
                        if (index != -1) {
                          y_payAreaAllchecked[index] = true;
                        }
                    }
                    
                    console.log(y_area, y_payAreaId,y_payAreaAllchecked)


                    var initPayMoney = thisData.scale_tag[0].scale_money
                    // console.log(initPayMoney)
                    that.setData({
                        initPayMoney: initPayMoney
                    })

                    //初始化
                    wx.setStorageSync('y_describe', thisData.investor_desc)
                    wx.setStorageSync('y_domainValue', y_domainValue)
                    wx.setStorageSync('y_domainId', y_domainId)
                    wx.setStorageSync('y_payStage', y_payStage)
                    wx.setStorageSync('y_stageId', y_StageId)
                    wx.setStorageSync('y_payMoney', y_payMoney)
                    wx.setStorageSync('y_payMoneyId', y_payMoneyId)
                    wx.setStorageSync('y_payArea', y_payArea)
                    wx.setStorageSync('y_payAreaId', y_payAreaId)
                    // console.log(y_payArea, y_payAreaId);

                    // =====================================================================
                    //投资领域
                    wx.setStorageSync('enchangeValue', y_domainValue);
                    wx.setStorageSync('enchangeId', y_domainId);
                    wx.setStorageSync('enchangeCheck', y_domainAllchecked);
                    // //投资阶段
                    wx.setStorageSync('payenchangeValue', y_payStage);
                    wx.setStorageSync('payenchangeId', y_StageId);
                    wx.setStorageSync('payenchangeCheck', y_StageAllchecked);
                    console.log(y_StageId, y_StageAllchecked);
                    wx.setStorageSync('y_payStageId', y_StageId);
                    // //投资金额
                    wx.setStorageSync('paymoneyenchangeValue', y_payMoney);
                    wx.setStorageSync('paymoneyenchangeId', y_payMoneyId);
                    wx.setStorageSync('paymoneyenchangeCheck', y_payMoneyAllchecked);
                    // //投资地区
                    wx.setStorageSync('payareaenchangeValue', y_payArea);
                    wx.setStorageSync('payareaenchangeId', y_payAreaId);
                    wx.setStorageSync('payareaenchangeCheck', y_payAreaAllchecked);
                    console.log(y_payAreaAllchecked);

                    that.setData({
                        domainValue: y_domainValue,
                        domainId: y_domainId,
                        describe: thisData.investor_desc,
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
    },
    //页面显示
    onShow: function () {
        var that = this;
        //填入所属领域,项目介绍,所在地区
        var domainValue = wx.getStorageSync('y_domainValue') || "选择领域";
        var domainId = wx.getStorageSync('y_domainId');
        var describe = wx.getStorageSync('y_describe');
        var payArea = wx.getStorageSync('y_payArea') || "选择城市";
        var payAreaId = wx.getStorageSync('y_payAreaId');
        var payStage = wx.getStorageSync('y_payStage') || "选择阶段";
        var payStageId = wx.getStorageSync('y_payStageId');
        var payMoney = wx.getStorageSync('y_payMoney') || "选择金额";
        var payMoneyId = wx.getStorageSync('y_payMoneyId')
        //console.log(domainValue, domainId, describe, payArea, payAreaId, payStage, payStageId)
        that.setData({
            domainValue: domainValue,
            domainId: domainId,
            describe: describe,
            payArea: payArea,
            payAreaId: payAreaId,
            payStage: payStage,
            payStageId: payStageId,
            payMoney: payMoney,
            payMoneyId: payMoneyId
        })

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
            describe: e.detail.value
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
        // console.log(this.data.expect_index)
    },


    //点击发布
    public: function () {
        save = !save;
        var that = this;
        var theData = that.data;
        var describe = this.data.describe;
        var domainValue = this.data.domainValue;
        var domainId = this.data.domainId;
        var payArea = this.data.payArea;
        var payAreaId = this.data.payAreaId;
        var payStage = this.data.payStage;
        var payStageId = this.data.payStageId;
        var payMoney = this.data.payMoney;
        var payMoneyId = this.data.payMoneyId;
        var user_id = wx.getStorageSync('user_id');

        // console.log(user_id, describe, domainId, payMoney, payMoney, payArea, payAreaId, payStage, payStageId)
        console.log(domainId, payStageId, payMoneyId, payAreaId, describe)
        if (domainValue !== "选择领域" && payMoney != "选择金额" && payArea !== "选择城市" && payStage !== "选择阶段") {
            wx.request({
                url: url + '/api/investors/insertInvestor',
                data: {
                    user_id: user_id,
                    investor_industry: domainId,
                    investor_stage: payStageId,
                    investor_scale: payMoneyId,
                    investor_area: payAreaId,
                    investor_desc: describe

                },
                method: 'POST',
                success: function (res) {
                  console.log(res)
                  console.log(res.data.status_code, res.data.error_msg)
                  if (res.data.status_code == 2000000){
                    wx.setStorageSync('investor_id', res.data.investor_id)
                    var current = that.data.current;
                    //数据清空
                    // wx.setStorageSync('y_project_id', res.data.project_index)
                    // wx.setStorageSync('y_describe', "")
                    // wx.setStorageSync('y_domainValue', "选择领域")
                    // wx.setStorageSync('y_domainId', [])
                    // wx.setStorageSync('y_payStage', "选择地区")
                    // wx.setStorageSync('y_payStageId', [])
                    // wx.setStorageSync('y_console_expect', 0)
                    // wx.setStorageSync('y_payArea', "选择城市")
                    // wx.setStorageSync('y_payAreaId', [])
                    if (current == 1) {
                      wx.switchTab({
                        url: "/pages/my/my"
                      })
                    } else {
                      wx.switchTab({
                        url: '../resource/resource'
                      });
                    }
                    
                  }else{             
                    that.setData({
                      error: "1",
                      error_text: res.data.error_msg
                    })
                    setTimeout(
                      function(){
                        that.setData({
                          error: "0"
                        })
                      }
                      ,2000)                
                  }
                },
              fail: function () {
                // fail
                console.log("fail")
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

            if (domainId == 0) {
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
        // wx.setStorageSync('y_domainValue', "选择领域");
        // wx.setStorageSync('y_domainId', []);
        // wx.setStorageSync('m_domainValue', []);
        // wx.setStorageSync('m_domainId', []);
        // wx.setStorageSync('y_payArea', "选择城市");
        // wx.setStorageSync('y_payAreaId', []);;
        // wx.setStorageSync('y_payStage', "选择阶段"); 
        // wx.setStorageSync('y_payStageId', []);;
        // wx.setStorageSync('y_payMoney', "选择金额");
        // console.log("clear");
      }
      // console.log("close");
    }
});