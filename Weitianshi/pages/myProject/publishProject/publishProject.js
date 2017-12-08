var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    describe: "",
    area_title: "选择城市",
    provinceNum: '',
    cityNum: '',
    // ---------------------picker----------------------
    stage: [],
    stage_index: 0,
    stage_arry: [],
    scale: [],
    scale_index: 0,
    scale_arry: [],
    // ---------------------picker----------------------
    tips: ["其他", "独家签约", "非独家"],
    tips_index: 4, //独家效果
    console_stage: "",
    console_expect: "",
    console_tips: "",
    loading: '0',
    pro_goodness: "",
    service_fa: 0,
    service_yun: 0,
    service_ps_bp: 0,
    industryCard: {
      text: "项目领域*",
      url: "/pages/form/industry/industry?current=0",
      css: "",
      value: ["选择领域"],
      id: []
    },
    pro_finance_stock_after: 0,
    open_status: 1,
    power_share_status: 1,
    power_investor_status: 1,
    company_open_status: 0,
    subscribe: {
      white_company: 0,
      white_user: 0,
      black_company: '',
      black_user: ''
    },
    modalBox: 0,
  },
  onLoad: function (options) {
    let that = this;
    let type = options.type;
    let pro_total_score = 14.4;
    let stage = wx.getStorageSync('stage');
    let scale = wx.getStorageSync('scale');
    let stage_arry = [];
    let scale_arry = [];
    // picker 初始数据预处理
    this.pickerDeal(stage, stage_arry, 'stage_name', 'stage', 'stage_arry');
    this.pickerDeal(scale, scale_arry, 'scale_money', 'scale', 'scale_arry');
    that.setData({
      type: type,
      pro_total_score: pro_total_score,
    })
  },
  //页面显示
  onShow: function () {
    // 项目领域取值
    this.tranIndustryDeal();
    this.tranAreaDeal();
  },
  //picker数据预处理
  pickerDeal(item, itemArr, itemName, string_item, string_itemArr) {
    if (string_itemArr == 'stage_arry') {
      item.unshift({ stage_name: '选择阶段' })
    } else {
      item.unshift({ scale_money: '选择金额' })
    }
    item.forEach(x => {
      itemArr.push(x[itemName])
    })
    this.setData({
      [string_item]: item,
      [string_itemArr]: itemArr
    })
  },
  //tran_industry取值处理
  tranIndustryDeal() {
    let tran_industry = wx.getStorageSync('tran_industry');
    console.log(tran_industry)
    let industryCard = this.data.industryCard;
    if (tran_industry.length != 0) {
      industryCard.value = [];
      industryCard.id = [];
      tran_industry.forEach(x => {
        industryCard.value.push(x.industry_name)
        industryCard.id.push(x.industry_id)
      })
      //字体颜色改变
      industryCard.css = 'black';
    } else {
      industryCard.value = ['请择领域'];
      industryCard.css = '';
      industryCard.id = [];
    }
    this.setData({
      industryCard: industryCard
    })
  },
  //tran_area取值处理
  tranAreaDeal() {
    let tran_area = wx.getStorageSync('tran_area');
    if (tran_area.length != 0) {
      let area_title = tran_area[0].area_title + '-' + tran_area[1].area_title;
      this.setData({
        area_title: area_title,
        provinceNum: tran_area[0].area_id,
        cityNum: tran_area[1].area_id
      })
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  //项目名称
  projectName: function (e) {
    this.setData({
      projectName: e.detail.value
    })
  },
  //公司名称
  companyName: function (e) {
    this.setData({
      companyName: e.detail.value
    })
  },
  //项目介绍
  bindTextAreaBlur: function (e) {
    this.setData({
      describe: e.detail.value
    })
  },
  //投后股份
  projectFinance: function (e) {
    this.setData({
      pro_finance_stock_after: e.detail.value
    })
  },
  //项目亮点
  slectInput: function (e) {
    this.setData({
      pro_goodness: e.detail.value
    })
  },
  //是否独家的效果实现
  tipsOn: function (e) {
    this.setData({
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
  scale: function (e) {
    this.setData({
      scale_index: e.detail.value,
    });
  },
  //关闭模态框
  closeModal: function () {
    this.setData({
      modalBox: 0
    })
  },
  //去电脑上传
  toPc: function () {
    this.setData({
      modalBox: 1
    })
  },
  //需要Bp美化
  switchChange1: function (e) {
    this.setData({
      service_ps_bp: e.detail.value
    })
  },
  //需要融资股份(FA)服务
  switchChange2: function (e) {
    this.setData({
      service_fa: e.detail.value
    })
  },
  //是否需要云投行服务
  switchChange3: function (e) {
    this.setData({
      service_yun: e.detail.value
    })
  },
  //私密性设置
  initPrivacy: function () {
    app.href('/pages/myProject/initPrivacy/initPrivacy')
  },
  //完整度
  totalScore: function (name) {
    let pro_total_score = this.data.pro_total_score;
    if (name) {
      pro_total_score = pro_total_score + 2.4;
      this.setData({
        pro_total_score: pro_total_score
      })
    }
  },
  //到电脑
  upLoadPc: function () {
    var that = this;
    wx.scanCode({
      success: function (res) {
        wx.request({
          url: app.globalData.url_common + '/api/auth/writeUserInfo',
          data: {
            type: 'create',
            user_id: wx.getStorageSync('user_id'),
            project_id: that.data.pro_id,
            credential: res.result,//二维码扫描信息
            pro_data: {
              pro_intro: that.data.describe,
              industry: that.data.industryCard.id,
              pro_finance_stage: that.data.stage[that.data.stage_index].stage_id,
              pro_finance_scale: that.data.scale[that.data.scale_index].scale_id,
              pro_area_province: that.data.provinceNum,
              pro_area_city: that.data.cityNum,
              is_exclusive: that.data.tips_index,
              pro_goodness: that.data.pro_goodness,
              pro_company_name: that.data.companyName,
              pro_name: that.data.projectName,
              pro_finance_stock_after: that.data.pro_finance_stock_after,
              service_fa: that.data.service_fa,
              service_yun: that.data.service_yun,
              service_ps_bp: that.data.service_ps_bp
            }
          },
          method: 'POST',
          success: function (res) {
            if (res.data.status_code == 2000000) {
              app.href('/pages/myProject/bpScanSuccess/bpScanSuccess')
              that.setData({
                modalBox: 0
              })
            }
          }
        })
      },
    })
  },
  //点击发布
  public: function () {
    var that = this;
    let type = this.data.type;
    var theData = that.data;
    let pro_company_name = this.data.companyName;
    let pro_name = this.data.projectName;
    let pro_finance_stock_after = this.data.pro_finance_stock_after;
    var describe = this.data.describe;
    var pro_goodness = this.data.pro_goodness;
    var industryValue = this.data.industryCard.value;
    var industryId = this.data.industryCard.id;
    var provinceNum = this.data.provinceNum;
    var cityNum = this.data.cityNum;
    var console_stage = this.data.stage[this.data.stage_index].stage_id;
    var console_expect = this.data.scale[this.data.scale_index].scale_id;
    var tips = this.data.tips_index;
    var user_id = wx.getStorageSync('user_id');
    let service_ps_bp = Number(this.data.service_ps_bp);
    let service_fa = Number(this.data.service_fa);
    let service_yun = Number(this.data.service_yun);
    // ===========================私密性设置=====================
    let subscribe = this.data.subscribe;
    Number(subscribe.white_company)
    Number(subscribe.white_user)
    this.setData({
      subscribe: subscribe
    })
    this.totalScore(pro_name)
    this.totalScore(pro_company_name)
    this.totalScore(pro_finance_stock_after)
    this.totalScore(service_yun)
    this.totalScore(service_fa)
    this.totalScore(service_ps_bp)
    let open_status = this.data.open_status;
    let power_share_status = this.data.power_share_status;
    let power_investor_status = this.data.power_investor_status;
    let company_open_status = this.data.company_open_status;
    let pro_total_score = this.data.pro_total_score;
    if (describe !== "" && industryValue !== "选择领域" && console_stage !== 0 && console_expect != 0 && provinceNum !== 0 && cityNum !== 0 && tips !== 4 && pro_goodness !== "") {
      // 投后股份项数值限定
      function checkNumber(data) {
        var reg = /^\d+\.[0-9]{2}/;
        if (reg.test(data)) {
          return true;
        }
        return false;
      }
      //处理下投后股份数据类型 
      if (isNaN(pro_finance_stock_after)) {
      } else {
        pro_finance_stock_after = Number(Number(pro_finance_stock_after).toFixed(2));
      }
      if (typeof pro_finance_stock_after != 'number' || pro_finance_stock_after < 0 || pro_finance_stock_after > 100) {
        if (pro_finance_stock_after < 0) {
          app.errorHide(that, '投后股份项应该为大于等0的数字', 3000);
        } else if (pro_finance_stock_after > 100) {
          app.errorHide(that, '投后股份项应该为小于等于100的小数位不超过两位的数字', 3000);
        } else if (typeof pro_finance_stock_after != 'number') {
          console.log(pro_finance_stock_after)
          app.errorHide(that, '投后股份项应该为数字', 3000);
        }
        return;
      }
      app.httpPost({
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
          pro_goodness: pro_goodness,
          pro_company_name: pro_company_name,
          pro_name: pro_name,
          pro_finance_stock_after: pro_finance_stock_after,
          service_ps_bp: service_ps_bp,
          service_fa: service_fa,
          service_yun: service_yun,
          open_status: open_status,
          power_share_status: power_share_status,
          power_investor_status: power_investor_status,
          company_open_status: Number(!company_open_status),
          subscribe: subscribe,
          pro_total_score: pro_total_score
        },
      }).then(res => {
        console.log(res)
        if (res.data.status_code == 2000000) {
          //数据清空
          wx.setStorageSync('tran_industry', [])
          app.href('/pages/myProject/publishSuccess/publishSuccess?type=' + type)
        } else {
          app.errorHide(that, res.data.error_msg, 3000)
        }
      })
    } else {
      app.errorHide(that, "请完整填写信息", 1500)
    }
  },
});