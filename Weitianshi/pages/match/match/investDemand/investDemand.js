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
    //检查是否发布过投资信息
    wx.request({
      url: url + '/api/investor/checkInvestorInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        var thisData = res.data.data;
        let tran_scale = thisData.scale_tag;
        let tran_stage = thisData.stage_tag;
        let tran_area = thisData.area_tag;
        if (res.data.data != '') {
          //获取已存有的投资领域,投资阶段,投资金额,投資地区

          var industry = wx.getStorageSync('industry')//项目领域总数                   
          var y_describe = thisData.investor_desc;
          // var describle = wx.getStorageSync('investor_desc')//具体描述

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
          that.setData({
            tran_stage: tran_stage,
            tran_scale: tran_scale,
            tran_area: tran_area
          })
          //初始化
          wx.setStorageSync('y_describe', y_describe)
          wx.setStorageSync('y_domainValue', y_domainValue)
          wx.setStorageSync('y_domainId', y_domainId)

          //投资领域
          wx.setStorageSync('enchangeValue', y_domainValue);
          wx.setStorageSync('enchangeId', y_domainId);
          wx.setStorageSync('enchangeCheck', y_domainAllchecked);
          // //投资阶段
          wx.setStorageSync('tran_stage', tran_stage);
          // //投资金额
          wx.setStorageSync("tran_scale", tran_scale)
          // //投资地区
          wx.setStorageSync("tran_area", tran_area)
          // 具体描述
          wx.setStorageSync('y_describe', y_describe)
          that.setData({
            domainValue: y_domainValue,
            domainId: y_domainId,
            describe: y_describe
          })
        }
      },
    })
    // -------------------------项目领域处理部份---------------------------------
    let industryCard = this.data.industryCard;

    //检查是否发布过投资信息
    wx.request({
      url: url + '/api/investor/checkInvestorInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.data != '') {
          //所选领域部分的数据处理
          var industry = res.data.data.industry_tag;
          wx.setStorageSync('industryCurrent1', industry)
          industryCard.value = [];
          industry.forEach((x) => {
            industryCard.value.push(x.industry_name);
            industryCard.id.push(x.industry_id);
          })
          that.setData({
            industryCard: industryCard,
          })
        }
      },
    })
  },
  //页面显示
  onShow: function () {
    var that = this;
    //填入所属领域,项目介绍,所在地区
    var domainValueName = wx.getStorageSync('industryCurrent1');
    var domainValue = [];
    if (domainValueName.length == 0) {
      domainValue = "选择领域"
    } else {
      domainValueName.forEach((x) => {
        domainValue.push(x.industry_name)
      })
    }

    var domainId = wx.getStorageSync('y_domainId');
    var y_describe = wx.getStorageSync('y_describe');
    var tran_area = wx.getStorageSync('tran_area');
    var tran_stage = wx.getStorageSync('tran_stage');
    var tran_scale = wx.getStorageSync('tran_scale');
    that.setData({
      domainValue: domainValue,
      domainId: domainId,
      y_describe: y_describe,
      tran_scale: tran_scale,
      tran_area: tran_area,
      tran_stage: tran_stage
    })
    // -------------------------项目领域处理部份---------------------------------
    let industryCard = this.data.industryCard;
    let industryCurrent1 = wx.getStorageSync("industryCurrent1");
    if (industryCurrent1) {
      industryCard.value = [];
      industryCard.id = [];
      industryCurrent1.forEach((x) => {
        // if (x.check == true) {
        industryCard.value.push(x.industry_name);
        industryCard.id.push(x.industry_id);
        // }
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
    var user_id = wx.getStorageSync('user_id');
    var industryValue = this.data.industryCard.value;
    var industryId = this.data.industryCard.id;
    var payStage = this.data.tran_stage;
    var payMoney = this.data.tran_scale;
    var payArea = this.data.tran_area;
    let payMoneyId = [];
    let payStageId = [];
    let payAreaId = [];
    if (payStage != "") {
      payStage.forEach((x) => {
        payStageId.push(x.stage_id)
      })
    }
    if (payMoney != "") {
      payMoney.forEach((x) => {
        payMoneyId.push(x.scale_id)
      })
    }
    if (payArea != "") {
      payArea.forEach((x) => {
        payAreaId.push(x.area_id)
      })
    }
    if (industryValue !== "选择领域" && payMoney != "" && payArea !== "" && payStage !== "") {
      wx.request({
        url: url + '/api/investor/updateOrCreateInvestor',
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
            wx.removeStorageSync("tran_scale")
            wx.removeStorageSync("tran_stage")
            wx.removeStorageSync("tran_area")
            wx.setStorageSync('investor_id', res.data.investor_id)
            var current = that.data.current;
            if (current == 1) {
              wx.redirectTo({
                url: "/pages/my/my/my"
              })
            } else {
              wx.switchTab({
                url: '/pages/discoverProject/discoverProject'
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
          error_text: "阶段不能为空"
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