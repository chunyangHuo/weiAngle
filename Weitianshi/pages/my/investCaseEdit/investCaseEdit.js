var app = getApp();
var url = app.globalData.url;
Page({
  data: {
    case_time: "请选择",
    industry: "请选择",
    stage: ["请选择"],
    stage_index: 0,
    buttonOne: {
      text: "保存"
    }
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: url + '/api/category/getWxProjectCategory',
      method: 'POST',
      success: function (res) {
        var stage = res.data.data.stage;
        var industry = res.data.data.industry;
        wx.setStorageSync('industry', industry)
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
        case_city:case_city,
        case_province:case_province
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

  },
  //项目名称
  case_name: function (e) {
    var that = this;
    var case_name = e.detail.value;
    that.setData({
      case_name: case_name
    })
  },
  // 项目领域
  case_industry: function (e) {
    wx.navigateTo({
      url: '/pages/industry/industry?current=' + 3,
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
  },
  //项目时间
  case_time: function (e) {
    this.setData({
      case_time: e.detail.value
    })
  },
  // 项目领域
  case_local: function (e) {
    wx.navigateTo({
      url: '/pages/belongArea/belongArea?current=' + 2
    })
  },
  //保存
  buttonOne: function () {
    var case_index = this.data.case_index;
    var user_id = wx.getStorageSync('user_id');
    var case_name = this.data.case_name;
    var industry = this.data.industry;
    var case_industry = this.data.industryId;
    var stageId = this.data.stageId;
    var stage_index = this.data.stage_index;
    var case_stage = case_stage || stageId[stage_index];
    var case_money = this.data.case_money;
    var case_time = this.data.case_time;
    var belongArea = this.data.belongArea
    var case_province = belongArea.provinceNum;
    var case_city = belongArea.cityNum;
    console.log("名称,标签名,标签Id,阶段ID,金额,时间,省份ID,城市ID")
    console.log(case_name, industry, case_industry, case_stage, case_money, case_time, case_province, case_city)
    if (user_id && case_name != undefined && case_industry != '' && case_stage != 0 && case_money != undefined && case_time != '请选择') {
      if (case_index) {

      } else {
        wx.request({
          url: url + '/api/user/createUserProjectCase',
          data: {
            user_id: user_id,
            case_name: case_name,
            case_industry: case_industry,
            case_stage: case_stage,
            case_money: case_money,
            case_deal_time: case_time,
            case_province:case_province,
            case_city:case_city
          },
          method: 'POST',
          success: function (res) {
            if (res.data.status_code == 2000000) {
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
    }
  },
  onUnload: function () {
    wx.setStorageSync('provinceNum', [])
    wx.setStorageSync('cityNum', [])
  }

})