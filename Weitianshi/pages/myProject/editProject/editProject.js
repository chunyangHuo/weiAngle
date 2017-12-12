var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    disabled: false,//保存按钮是否禁用
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
    modalBox: 0,
    industryCard: {
      text: "项目领域*",
      url: "/pages/form/industry/industry?current=2",
      css: "checkOn",
      value: ["选择领域"],
      id: [],
      service_fa: 0,
      service_yun: 0,
      service_ps_bp: 0
    }
  },
  onLoad: function (options) {
    var that = this;
    var user_id = options.user_id;
    var pro_id = options.pro_id;
    var current = options.current;
    var stageValue = [];
    var stageId = [];
    var scaleValue = [];
    var scaleId = [];
    var industryCard = this.data.industryCard;
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
      url: url_common + '/api/project/getProjectEditInfo',
      data: {
        user_id: options.user_id,
        project_id: options.pro_id
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var theData = res.data.data;
        var describe = theData.pro_intro;
        let pro_company_name = theData.pro_company_name;
        let pro_name = theData.pro_name;
        let pro_finance_stock_after = theData.pro_finance_stock_after;
        let service_fa = theData.service_fa;
        let service_yun = theData.service_yun;
        let service_ps_bp = theData.service_ps_bp;
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
        //----------------------------项目领域进行处理----------------------
        if (industry) {
          industry.forEach((x) => {
            industryValue.push(x.industry_name);
            industryId.push(x.industry_id)
          })
        }
        industryCurrent2.forEach((x) => {
          if (industryValue.indexOf(x.industry_name) != -1) {
            x.check = true;
          }
        })
        industryCard.value = industryValue;
        industryCard.id = industryId;
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
          pro_goodness: pro_goodness,
          pro_company_name: pro_company_name,
          pro_name: pro_name,
          pro_finance_stock_after: pro_finance_stock_after,
          service_fa: service_fa,
          service_yun: service_yun,
          service_ps_bp: service_ps_bp
        })
      },
      fail: function (res) {
        wx.showToast({
          title: res.error_msg
        })
      },
    })
  },
  onShow: function () {
    var that = this;
    //身份信息
    var user_id = wx.getStorageSync('user_id');
    app.identity(user_id, res => { 
      console.log(res)
      if (res.data.status != 0) {
        let group_id = res.data.group.group_id;
        if (res.data.status == 2) {
          if (group_id == 6 || group_id == 18 || group_id == 21) {
            that.setData({
              yesData: true,
              group_id: group_id
            })
          } else {
            that.setData({
              yesData: false,
              group_id: group_id
            })
          }
        } else {
          that.setData({
            yesData: false,
            group_id: group_id
          })
        }
      } else {
        that.setData({
          yesData: false,
          group_id: group_id
        })
      }
    })
    if (wx.getStorageSync("m_belongArea") != '') {
      var belongArea = wx.getStorageSync('m_belongArea');
    }
    var provinceNum = wx.getStorageSync("m_provinceNum");
    var cityNum = wx.getStorageSync('m_cityNum');
    var pro_goodness = wx.getStorageSync("pro_goodness");
    //如果已经进入项目领域后时,对返回该页面的值进行修正
    var industryCurrent2 = wx.getStorageSync("industryCurrent2");
    var industryCard = this.data.industryCard;
    if (industryCurrent2) {
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
    if (cityNum) {//如果取到了cityNum
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
    this.setData({
      describe: e.detail.value
    })
  },
  // 项目亮点
  slectInput: function (e) {
    this.setData({
      pro_goodness: e.detail.value
    })
  },
  // 选择领域
  industry: function () {
    app.href('/pages/form/industry/industry')
  },
  //是否独家的效果实现
  tipsOn: function (e) {
    this.setData({
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
    var cityNum = this.data.cityNum;//二级地区)
    app.href('/pages/form/area1/area1')
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
  //项目名称
  projectName: function (e) {
    this.setData({
      pro_name: e.detail.value
    })
  },
  //公司名称
  companyName: function (e) {
    this.setData({
      pro_company_name: e.detail.value
    })
  },
  //需要Bp美化
  switchChange1: function (e) {
    this.setData({
      service_ps_bp: e.detail.value
    })
  },
  //投后股份
  projectFinance: function (e) {
    this.setData({
      pro_finance_stock_after: e.detail.value
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
  //上传BP
  upLoad: function () {
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
    let service_fa = theData.service_fa;
    let service_yun = theData.service_yun;
    let service_ps_bp = theData.service_ps_bp;
    this.setData({
      upLoad: 0
    })
    //保存项目更改
    that.updata(that)
    //跳出提示模态框 
    wx.showModal({
      title: "PC上传",
      content: "电脑打开www.weitianshi.cn/qr点击扫一扫",
      showCancel: true,
      confirmText: "扫一扫",
      success: function (res) {
        if (res.confirm) {
          (res) => {
            console.log(res)
          }
          wx.scanCode({
            success: (res) => {
              console.log(res)
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
                  console.log(res)
                  if (res.data.status_code == 2000000) {
                    app.href('/pages/scanCode/bpScanSuccess/bpScanSuccess')
                  }
                }
              })

            },
            fail: (res) => {
              console.log("失败")
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
    that.updata(that)
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
              app.href('/pages/scanCode/bpScanSuccess/bpScanSuccess')
              that.setData({
                modalBox: 0
              })
            }
          }
        })

      },
    })
  },
  //私密性设置
  initPrivacy: function () {
    let project = this.data.pro_id;
    app.href('/pages/myProject/initPrivacy/initPrivacy?project=' + project)
  },
  //点击发布
  public: function () {
    var that = this;
    let pro_company_name = this.data.pro_company_name;
    let pro_name = this.data.pro_name;
    let pro_finance_stock_after = this.data.pro_finance_stock_after;
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
    let service_fa = Number(this.data.service_fa);
    let service_yun = Number(this.data.service_yun);
    let service_ps_bp = Number(this.data.service_ps_bp);
    this.setData({
      upLoad: 1
    })
    if (describe !== "" && industryValue !== "选择领域" && console_stage !== 0 && console_scale != 0 && provinceNum !== 0 && cityNum !== 0 && tipsIndex !== 4 && pro_goodness !== "") {
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
          app.errorHide(that, '投后股份项应该为数字', 3000);
        }
        return;
      }
      //保存项目更改
      that.updata(that)
    } else {
      if (describe == "") {
        app.errorHide(that, "介绍不能为空", 1500)
      } else if (industryId == 0) {
        app.errorHide(that, "所属领域不能为空", 1500)
      } else if (console_stage == 0) {
        app.errorHide(that, "项目阶段不能为空", 1500)
      } else if (console_scale == 0) {
        app.errorHide(that, "期望融资不能为空", 1500)
      } else if (provinceNum == 0 || cityNum == 0) {
        app.errorHide(that, "所在地区不能为空", 1500)
      } else if (tipsIndex == 4) {
        app.errorHide(that, "请选择是否独家", 1500)
      } else if (pro_goodness == "") {
        app.errorHide(that, "项目亮点不能为空", 1500)
      }
    }
  },

  //更新项目(辅助函数)
  updata(that) {
    var user_id = wx.getStorageSync('user_id');
    var pro_id = that.data.pro_id;
    var describe = that.data.describe;
    let pro_company_name = that.data.pro_company_name;
    let pro_name = that.data.pro_name;
    let pro_finance_stock_after = that.data.pro_finance_stock_after;
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
    let service_fa = Number(that.data.service_fa);
    let service_yun = Number(that.data.service_yun);
    let service_ps_bp = Number(that.data.service_ps_bp);

    app.httpPost({
      url: url_common + '/api/project/updateProject',
      data: {
        user_id: user_id,
        project_id: pro_id,
        pro_intro: describe,
        pro_company_name: pro_company_name,
        pro_name: pro_name,
        industry: industryId,
        pro_finance_stage: console_stage,
        pro_finance_scale: console_scale,
        pro_area_province: provinceNum,
        pro_area_city: cityNum,
        is_exclusive: tipsIndex,
        pro_goodness: pro_goodness,
        service_fa: service_fa,
        service_yun: service_yun,
        service_ps_bp: service_ps_bp,
        pro_finance_stock_after: pro_finance_stock_after
      },
    }, app.refreshButton(that)).then(res => {
      console.log(res)
      wx.removeStorageSync("industryCurrent2");
      if (res.data.status_code == 2000000) {
        if (upLoad == 1) {
          wx.navigateBack({//页面返回
            delta: 2 // 回退前 delta(默认为1) 页面
          })
        }
      } else {
        wx.showToast({
          title: res.error_msg
        })
      }
    })
    .catch(err=>{
      wx.showToast({
        title: "维护项目失败"
      })
    })
  }
});