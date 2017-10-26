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
    let case_id = options.case_id;
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
          timeNow: timeNow,
          timeBefore: timeBefore,
          stage: stage,
          stageId: stageId,
        })
      },
    })
    // 维护案例的情况下
    // 通过是否有Index传值进来来区别新建案例还是维护案例,index存在是編輯案例
    if (options.index) {
      var case_index = options.index;
      let industryCard = this.data.industryCard;
      let that = this;
      var user_id = wx.getStorageSync('user_id');
      wx.request({
        url: url_common + '/api/user/getOneUserProjectCase',
        data: {
          user_id: user_id,
          case_id: case_id
        },
        method: 'POST',
        success: function (res) {
          let invest_case = res.data.data;
          let industry = invest_case.case_industry;
          var industry_arr = [];
          var industryId = [];
          var industryCurrent3 = wx.getStorageSync("industry");
          //----------------------------项目领域进行处理----------------------
          if (industry) {
            industry.forEach((x) => {
              industry_arr.push(x.industry_name);
              industryId.push(x.industry_id)
            })
          }
          industryCurrent3.forEach((x) => {
            if (industry_arr.indexOf(x.industry_name) != -1) {
              x.check = true;
            }
          })
          industryCard.value = industry_arr;
          industryCard.id = industryId;
          wx.setStorageSync("industryCurrent3", industryCurrent3)
          that.setData({
            case_name: invest_case.case_name,
            industryCard: industryCard,
            case_stage: invest_case.case_stage,
            case_stage_id: invest_case.case_stage.stage_id,
            case_stage_name: invest_case.case_stage.stage_name,
            case_money: invest_case.case_money,
            case_time: invest_case.case_deal_time,
            // case_city: invest_case.case_city,
            belongArea: invest_case.has_one_city
            // case_province: invest_case.case_province
          })
        },
        fail: function (res) {
          console.log(res)
        },
      })
      this.setData({
        case_index: case_index,
        case_id: case_id
      })
    }
  },
  onShow: function () {
    var case_index = this.data.case_index;
    var belongArea = wx.getStorageSync('addcase_belongArea');
    console.log('belongArea', belongArea)
    if (belongArea) {
      belongArea.area_title = belongArea.belongArea;
      this.setData({
        belongArea: belongArea
      })
    }


    // -------------------对industry相关数据进行处理---------------------------------

    //如果已经进入项目领域后时,对返回该页面的值进行修正
    var industryCurrent3 = wx.getStorageSync("industryCurrent3");
    var industryCard = this.data.industryCard;
    if (industryCurrent3) {
      var industryValue = [];
      var industryId = [];
      industryCurrent3.forEach((x) => {
        if (x.check == true) {
          industryValue.push(x.industry_name);
          industryId.push(x.industry_id);
        }
        wx.setStorageSync("industryCurrent3", industryCurrent3)
      })
      industryCard.value = industryValue;
      industryCard.id = industryId;
      this.setData({
        industryCard: industryCard
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
    console.log(this.data.case_stage_name, this.data.case_stage)
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
  // 投资地区
  case_local: function (e) {
    this.setData({
      case_city: e.detail.value
    })
    wx.navigateTo({
      url: '/pages/form/area1/area1?current=' + 2
    })
  },
  //保存
  buttonOne: function () {
    var that = this;
    var case_index = this.data.case_index;
    let case_id = this.data.case_id;
    var user_id = wx.getStorageSync('user_id');
    var case_name = this.data.case_name;
    var industry = this.data.industryCard.value;
    var case_industry = this.data.industryCard.id;
    var stageId = this.data.stageId;
    var stage_index = this.data.stage_index;
    let case_stage_id = this.data.case_stage_id;
    var case_stage = this.data.case_stage || case_stage_id;
    var case_money = this.data.case_money;
    var case_time = this.data.case_time;
    var belongArea = this.data.belongArea
    var case_province = belongArea.provinceNum || belongArea.pid;
    var case_city = belongArea.cityNum || belongArea.area_id;
    console.log("名称,标签名,标签Id,阶段ID,金额,时间,省份ID,城市ID")
    console.log(user_id, case_name, industry, case_industry, case_stage, case_money, case_time, case_province, case_city, belongArea)
    if (case_name == '') {
      app.errorHide(that, "项目名称不能为空", 1500)
    } else if (case_industry.length < 1) {
      app.errorHide(that, "领域不能为空", 1500)
    } else if (case_stage.length < 1) {
      app.errorHide(that, "轮次不能为空", 1500)
    } else if (case_money.length < 1) {
      app.errorHide(that, "投资金额不能为空", 1500)
    } else if (case_time == '请选择') {
      app.errorHide(that, "交易时间不能为空", 1500)
    } else if (belongArea.length < 1) {
      // case_city == [] || case_province == undefined
      app.errorHide(that, "地区不能为空", 1500)
    } else {
      if (case_index) {
        wx.request({
          url: url_common + '/api/user/editUserProjectCase',
          data: {
            case_id: case_id,
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
            console.log(res)
            if (res.data.status_code == 2000000) {
              wx.removeStorageSync("industryCurrent3")
              wx.navigateBack({
                delta: 1,
              })
            } else {
              app.errorHide(that, res.data.error_msg, 3000)
            }
          },
          fail: function (res) {
            console.log(res)
          },
        })

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
              wx.navigateBack({
                delta: 1,
              })
            } else {
              app.errorHide(that, res.data.error_msg, 3000)
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