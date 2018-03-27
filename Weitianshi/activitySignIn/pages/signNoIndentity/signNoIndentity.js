var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    name: '',
    brand: '',
    company: "",
    position: "",
    email: "",
    name: '',
    telephone: '',
    checkCode: '',
    checking: "0",//获取验证码请求是否发送
    time: "0",//获取验证码按钮是否可点
    loading: "0",//加载动画控制
    getCode: "获取验证码",
    endTime: 60,//多少秒后验证码得发
    nonet: true
  },
  onLoad() {
    let that = this;
    let user_id = wx.getStorageSync("user_id");
    if (user_id) {
      this.userInfo(user_id)
      this.setData({
        user_id: user_id
      })
    } else {

    }
  },
  //跳转微天使首页
  goToIndex() {
    app.href('/pages/discoverProject/discoverProject');
  },
  //有user_id
  userInfo(user_id) {
    let that = this;
    app.httpPost({
      url: url_common + '/api/user/getUserBasicInfo',
      data: {
        user_id: user_id
      },
    }).then(res => {
      let user_info = res.data.user_info;
      let name = res.data.user_info.user_real_name;
      let email = user_info.user_email;
      let position = user_info.user_company_career;
      let company = user_info.user_company_name;
      let brand = user_info.user_brand;
      let telephone = user_info.user_mobile;
      let weChat = user_info.user_wechat;
      that.setData({
        name: name,
        email: email,
        position: position,
        company: company,
        brand: brand,
        telephone: telephone,
        weChat: weChat
      })
    })
  },
  //注册过的用户
  signed() {
    let that = this;
    let activity_id = this.data.activity_id;
    let user_name = this.data.name;
    let user_mobile = this.data.telephone;
    let user_company_name = this.data.company;
    let user_company_career = this.data.position;
    let user_brand = this.data.checkBrand;
    let user_email = this.data.checkEmail;
    let user_wechat = this.data.checkWechart;
    app.httpPost({
      url: url_common + '/api/activity/apply',
      data: {
        "user_id": this.data.user_id,
        "activity_id": 21,
        "user_mobile": user_mobile,
        "user_name": user_name,
        "user_company_name": user_company_name,
        "user_company_career": user_company_career,
        "user_brand": user_brand,
        "user_email": user_email,
        "user_wechat": user_wechat
      },
    }).then(res => {
      console.log(res)
    })
  },
  //未注册的用户
  noSign() {
    let that = this;
    let activity_id = this.data.activity_id;
    let user_name = this.data.name;
    let user_mobile = this.data.telephone;
    let user_company_name = this.data.company;
    let user_company_career = this.data.position;
    let user_brand = this.data.checkBrand;
    let user_email = this.data.checkEmail;
    let user_wechat = this.data.checkWechart;
    let captcha = this.data.checkCode;
      app.httpPost({
        url: url_common + '/api/activity/applyAndRegister',
        data: {
          "user_id": 0,
          "activity_id": 21,
          "user_mobile": user_mobile,
          "user_name": user_name,
          "user_company_name": user_company_name,
          "user_company_career": user_company_career,
          "user_brand": user_brand,
          "user_email": user_email,
          "user_wechat": user_wechat,
          "captcha": captcha,
          "open_session": app.globalData.open_session
        },
      }).then(res => {
        console.log(user_info)
        let user_info = res.data.user_info;
        that.setData({
          user_info: user_info
        })
      })
  },
  //提交
  pushInfo() {
    let user_id = this.data.user_id;
    if (user_id) {
      this.signed()
    } else {

    }
  },
  //姓名
  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //品牌验证
  checkBrand(e) {
    let brand = e.detail.value;
    brand = app.globalData.verify.deleteSymbol(brand)
    this.setData({
      brand
    });
  },
  //公司项的特殊符号过滤和值的双向绑定
  company(e) {
    let company = e.detail.value;
    company = app.globalData.verify.deleteSymbol(company);
    this.setData({
      company
    });
    // 传公司名称到后台以用于数据爬取
    app.httpPost({
      url: url_common + '/api/dataTeam/checkCompany',
      data: {
        com_name: company
      },
    }, this).then(res => { })
  },
  //职位项的特殊符号过滤和值的双向绑定
  position(e) {
    let position = e.detail.value;
    position = app.globalData.verify.deleteSymbol(position);
    this.setData({
      position
    });
  },
  //邮箱验证
  checkEmail(e) {
    let that = this;
    let email = e.detail.value;
    app.globalData.verify.email(this, email, res => {

    })
    that.setData({
      email
    })
  },
  //微信
  checkWechart(e) {
    this.setData({
      weChat: e.detail.value
    })
  },
  //手机号码验证
  checkPhone(e) {
    this.setData({
      telephone: e.detail.value
    })
  },
  // 清除记时器(辅助函数)
  clearTime() {
    if (this.data._time) {
      this.setData({
        time: "1"
      })
    } else {
      // 清零短信倒计时
      this.setData({
        time: "0"
      })
    }
  },
  //手机号码验证
  checkPhone(e) {
    let telephone = e.detail.value;
    this.setData({
      telephone
    })
  },
  //获取验证码按钮倒计时动效
  checkCode(e) {
    console.log(e)
    e.detail.disabled = true;
    let telephone = this.data.telephone;
    let checking = this.data.checking;
    let that = this;
    let endTime = this.data.endTime
    endTime = 60;
    app.globalData.verify.mobile(this, telephone, res => {
      that.setData({
        checking: "1",
        time: "1",
      });
      that.getCaptcha(that, telephone, endTime);
    })
  },
  // 请求验证码
  getCaptcha(that, user_mobile, endTime) {
    app.httpPost({
      url: url_common + '/api/auth/authCaptcha',
      data: {
        user_mobile
      },
    }, this, res => {
      that.setData({
        checking: "0",
        time: '0'
      });
    }).then(res => {
      let _time = setInterval(function () {
        that.setData({
          checking: "0"
        });
        if (endTime > 1) {
          endTime--;
          that.setData({
            getCode: endTime + 's后重新获取'
          })
        }
      }, 1000)
      setTimeout(function () {
        that.setData({
          time: "0",
          getCode: "获取验证码"
        });
        clearInterval(_time)
      }, 60000);
    }).catch(res => {
      this.setData({
        checking: "0",
        time: '0'
      });
    })
  },

  // 获取验证码的值 
  checkCode2(e) {
    let that = this;
    that.setData({
      checkCode: e.detail.value
    });
  },
  // personInfo点击跳转
  nextPage() {
    register.personInfoRegister.call(this);
  },
  //跳转
  jumpto(){
    app.href("/activitySignIn/pages/signIndentityCard/signIndentityCard")
  }
})