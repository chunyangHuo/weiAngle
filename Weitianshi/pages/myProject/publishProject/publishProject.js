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
    modalBox: 0,
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
    open_status: 1,
    power_share_status: 1,
    power_investor_status: 1,
    company_open_status: 0,
    subscribe: {
      white_company: 0,
      white_user: 0,
      black_company: '',
      black_user: ''
    }
  },
  onLoad: function (options) {
    var that = this;
    let type = options.type;
    let pro_total_score = 14.4;
    that.setData({
      type: type,
      pro_total_score: pro_total_score
    })
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
    var user_id = wx.getStorageSync('user_id');
    //返回上一页时启动onShow;
    let pages = getCurrentPages();
    let pre = pages[pages.length - 2];
    if (pre) {
      pre.data.firstTime = false;
    }
    app.identity(user_id, res => {
      console.log(res)
      if (res.data.status != 0) {
        let group_id = res.data.group.group_id;
        if (res.data.status == 2) {
          if (group_id == 6 || group_id == 18 || group_id == 21) {
            that.setData({
              yesData: true
            })
          } else {
            that.setData({
              yesData: false
            })
          }
        } else {
          that.setData({
            yesData: false
          })
        }
        that.setData({
          group_id: group_id
        })
      } else {
        that.setData({
          yesData: false
        })
      }
    })

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

    // ------------------项目领域数据处理--------------------------------
    var industryCard = this.data.industryCard;
    var industryCurrent0 = wx.getStorageSync("industryCurrent0");
    app.dealTagsData(that, industryCurrent0, industryCard, "industry_name", "industry_id")
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
  //项目名称
  projectName: function (e) {
    let projectName = e.detail.value;
    let that = this;
    that.setData({
      projectName: projectName
    })
  },
  //公司名称
  companyName: function (e) {
    let companyName = e.detail.value;
    let that = this;
    that.setData({
      companyName: companyName
    })
  },
  //文本框输入
  bindTextAreaBlur: function (e) {
    var that = this;
    wx.setStorageSync('describe', e.detail.value);
    that.setData({
      describe: e.detail.value
    })
  },
  //投后股份
  projectFinance: function (e) {
    let pro_finance_stock_after = e.detail.value;
    let that = this;
    that.setData({
      pro_finance_stock_after: pro_finance_stock_after
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
  //上传BP
  upLoad: function () {
    var pro_intro = this.data.describe;//描述
    var industry = this.data.industryCard.id;//id
    var pro_goodness = this.data.pro_goodness;//亮点
    var pro_finance_stage = this.data.stage[this.data.stage_index].stage_id;
    var pro_finance_scale = this.data.expect[this.data.expect_index].scale_id;
    let pro_company_name = this.data.pro_company_name;
    let pro_name = this.data.pro_name;
    let pro_finance_stock_after = this.data.pro_finance_stock_after;
    var is_exclusive = this.data.tips_index * 1;
    let service_ps_bp = Number(this.data.service_ps_bp);
    let service_fa = Number(this.data.service_fa);
    let service_yun = Number(this.data.service_yun);
    let subscribe = this.data.subscribe;
    Number(subscribe.white_company)
    Number(subscribe.white_user)
    this.setData({
      subscribe: subscribe
    })
    let open_status = this.data.open_status;
    let power_share_status = this.data.power_share_status;
    let power_investor_status = this.data.power_investor_status;
    let company_open_status = this.data.company_open_status;
    let pro_total_score = this.data.pro_total_score;
    //弹出PC端url提示文本模态框
    wx.showModal({
      title: "PC上传",
      content: "电脑打开www.weitianshi.cn/qr点击扫一扫",
      showCancel: true,
      confirmText: "扫一扫",
      success: function (res) {
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
                    "pro_goodness": pro_goodness,
                    "pro_company_name": pro_company_name,
                    "pro_name": pro_name,
                    "pro_finance_stock_after": pro_finance_stock_after,
                    "service_fa": service_fa,
                    "service_yun": service_yun,
                    "service_ps_bp": service_ps_bp,
                    "open_status": open_status,
                    "power_share_status": power_share_status,
                    "company_open_status": company_open_status,
                    "pro_total_score": pro_total_score,
                    "subscribe": subscribe
                  }
                },
                method: 'POST',
                success: function (res) {
                  if (res.data.status_code == 2000000) {
                    wx.navigateTo({
                      url: '/pages/scanCode/bpScanSuccess/bpScanSuccess',
                    })
                    that.setData({
                      modalBox: 0
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
  //需要Bp美化
  switchChange1: function (e) {
    console.log(e.detail.value)
    let service_ps_bp = e.detail.value;
    this.setData({
      service_ps_bp: service_ps_bp
    })
  },
  //需要融资股份(FA)服务
  switchChange2: function (e) {
    let service_fa = e.detail.value;
    this.setData({
      service_fa: service_fa
    })
  },
  //是否需要云投行服务
  switchChange3: function (e) {
    let service_yun = e.detail.value;
    this.setData({
      service_yun: service_yun
    })
  },
  //私密性设置
  initPrivacy: function () {
    let open_status = this.data.open_status;
    let power_share_status = this.data.power_share_status;
    let power_investor_status = this.data.power_investor_status;
    let company_open_status = this.data.company_open_status;
    let subscribe = this.data.subscribe;
    let whiteCompany = subscribe.white_company;
    let white_user = subscribe.white_user;
    let black_company = subscribe.black_company;
    let black_user = subscribe.black_user;
    wx.navigateTo({
      url: '/pages/myProject/initPrivacy/initPrivacy?open_status=' + open_status + '&power_share_status=' + power_share_status + '&power_investor_status=' + power_investor_status + '&company_open_status=' + company_open_status +
      '&white_user=' + white_user + '&whiteCompany=' + whiteCompany + '&black_company=' + black_company + '&black_user=' + black_user
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
    var console_expect = this.data.expect[this.data.expect_index].scale_id;
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
          company_open_status: company_open_status,
          subscribe: subscribe,
          pro_total_score: pro_total_score
        },
      }).then(res => {
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
          if (type == 8) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.redirectTo({
              url: '/pages/matchInvestor/matchInvestor'
            });
          }
        } else {
          app.errorHide(that, res.data.error_msg, 3000)
        }
      })
    } else {
      app.errorHide(that, "请完整填写信息", 1500)
    }
  },
  //完整度
  totalScore: function (name) {
    let pro_total_score = this.data.pro_total_score;
    console.log(pro_total_score)
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
    var pro_intro = this.data.describe;//描述
    var industry = this.data.industryCard.id;//id
    var pro_finance_stage = this.data.stage_index;
    var pro_finance_scale = this.data.scale_index;
    var is_exclusive = this.data.tipsIndex;
    var pro_goodness = this.data.pro_goodness;
    let pro_company_name = that.data.pro_company_name;
    let pro_name = that.data.pro_name;
    let pro_finance_stock_after = that.data.pro_finance_stock_after;
    let service_fa = that.data.service_fa;
    let service_yun = that.data.service_yun;
    let service_ps_bp = that.data.service_ps_bp;
    this.setData({
      upLoad: 0
    })
    //保存项目更改
    // that.updata(that)
    wx.scanCode({
      success: function (res) {
        var user_id = wx.getStorageSync("user_id");//用戶id
        var credential = res.result;//二维码扫描信息
        var project_id = that.data.pro_id;
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
              "pro_goodness": pro_goodness,
              "pro_company_name": pro_company_name,
              "pro_name": pro_name,
              "pro_finance_stock_after": pro_finance_stock_after,
              "service_fa": service_fa,
              "service_yun": service_yun,
              "service_ps_bp": service_ps_bp
            }
          },
          method: 'POST',
          success: function (res) {
            if (res.data.status_code == 2000000) {
              wx.navigateTo({
                url: '/pages/scanCode/bpScanSuccess/bpScanSuccess',
              })
              that.setData({
                modalBox: 0
              })
            }
          }
        })

      },
    })
  },
});